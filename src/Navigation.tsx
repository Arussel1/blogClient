import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 

interface DecodedToken {
  id: string;
}

interface User {
  firstname: string;
  lastname: string;
}

const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded;
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  return null;
};

const NavigationBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      const decodedToken = getUserFromToken();
      if (!decodedToken) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_WEB}/api/users/${decodedToken.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/'); 
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };
  
  const handleProfileNavigation = () => {
    if (user) {
      const decodedToken = getUserFromToken();
      if (decodedToken) {
        navigate(`/users/${decodedToken.id}`);
      }
    }
  };

  const handlePostsNavigation = () => {
    if (user) {
      navigate('/posts');
    }
  };

  if (loading) return null;
  if (!localStorage.getItem('token')) return null;

  return (
    <div className="flex items-center justify-between bg-gray-200 p-4">
      <img
        className="w-24 h-auto flex-shrink-0"
        src="/blogLogo.png"
        alt="Blog Logo"
      />
      {user ? (
        <div className="flex items-center space-x-4">
          <button 
            onClick={handlePostsNavigation}
            className="text-black hover:bg-blue-700 hover:text-white py-2 px-4 rounded transition duration-300"
          >
            Posts
          </button>
          <button 
            onClick={toggleDropdown}
            className="text-black hover:bg-blue-700 hover:text-white py-2 px-4 rounded transition duration-300"
          >
            {user.firstname} {user.lastname}
          </button>
          {dropdownVisible && (
            <ul 
              className="absolute right-0 top-20 mt-2 bg-white border border-gray-300 rounded shadow-lg"
              style={{ minWidth: '150px' }}
            >
              <li
                onClick={handleProfileNavigation}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              >
                Profile
              </li>
              <li
                onClick={handleLogout}
                className="cursor-pointer px-4 py-2 hover:bg-gray-200"
              >
                Log Out
              </li>
            </ul>
          )}
        </div>
      ) : (
        <p className="text-white">Loading user data...</p>
      )}
    </div>
  );
};

export default NavigationBar;

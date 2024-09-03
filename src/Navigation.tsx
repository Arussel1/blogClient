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
      navigate('/posts')
    }
  };

  if (loading) return null;
  if (!localStorage.getItem('token')) return null;

  return (
    <div>
      <img className='mix-blend-multiply' src="/blogLogo.png" alt="Blog Logo" />
      {user ? (
        <div>
          <button onClick={handlePostsNavigation}>Posts</button>
          <button onClick={toggleDropdown}>
            {user.firstname} {user.lastname}
          </button>
          {dropdownVisible && (
            <ul style={{ position: 'absolute', backgroundColor: 'white', border: '1px solid #ccc', padding: '10px' }}>
              <li onClick={handleProfileNavigation} style={{ cursor: 'pointer' }}>Profile</li>
              <li onClick={handleLogout} style={{ cursor: 'pointer' }}>Log Out</li>
            </ul>
          )}
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default NavigationBar;

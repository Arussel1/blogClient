import { useEffect, useState } from 'react';
import NavigationBar from '../Navigation';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
  id: string;
}

interface User {
  id: string; 
  firstname: string;
  lastname: string;
  username: string;
}

const getUserFromToken = () => {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded: DecodedToken = jwtDecode(token);
      return decoded.id; 
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }
  return null;
};

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const userId = getUserFromToken();

      if (!userId) {
        setLoading(false);
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_WEB}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        setUser({
          id: userId, 
          ...response.data, 
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        navigate('/'); // Navigate away if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChangeNavigate = () => {
    if (user) {
      navigate(`/user/${user.id}/update`, { state: { user } });
    }
  };

  const handleDelete = async () => {
    if (user) {
      const confirmDelete = window.confirm('Are you sure you want to delete your account?');
      if (confirmDelete) {
        try {
          await axios.delete(`${import.meta.env.VITE_BACKEND_WEB}/api/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });

          localStorage.removeItem('token');
          navigate('/'); 
        } catch (error) {
          console.error('Failed to delete user:', error);
        }
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) navigate('/');

  return (
    <div>
      <NavigationBar />
      <div className="mt-8 mx-8">
        <p><strong>Firstname:</strong> {user?.firstname}</p>
        <p><strong>Lastname:</strong> {user?.lastname}</p>
        <p><strong>Username:</strong> {user?.username}</p>
      </div>
      <div className="flex space-x-4 mt-8 mx-6">
        <button 
          onClick={handleChangeNavigate}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Change Info
        </button>
        <button 
          onClick={handleDelete}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-700 transition"
        >
          Delete User
        </button>
      </div>
    </div>
  );
};

export default Profile;

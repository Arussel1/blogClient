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
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
      <p>Firstname: {user?.firstname}</p>
      <p>Lastname: {user?.lastname}</p>
      <p>Username: {user?.username}</p>
      <button onClick={handleChangeNavigate}>Change Info</button>
      <button onClick={handleDelete}>Delete User</button>
    </div>
  );
};

export default Profile;

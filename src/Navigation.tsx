import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';

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

  if (loading) return null; 

  if (!localStorage.getItem('token')) return null;

  return (
    <div>
      <img src="/blogLogo.png" alt="blogLogo" />
      {user ? <p>{user.firstname} {user.lastname}</p> : <p>Loading user data...</p>}
    </div>
  );
};

export default NavigationBar;

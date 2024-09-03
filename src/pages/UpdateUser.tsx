import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import NavigationBar from '../Navigation';
import axios from 'axios';

const Update = () => {
  const location = useLocation();
  const navigate = useNavigate(); 
  const user = location.state?.user; 
  const [formData, setFormData] = useState({
    firstname: user?.firstname || '',
    lastname: user?.lastname || '',
    username: user?.username || '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
       await axios.put(
        `${import.meta.env.VITE_BACKEND_WEB}/api/users/${user?.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setSuccess('User updated successfully!');

      navigate(`/users/${user?.id}`);
    } catch (error) {
      console.error('Failed to update user data:', error);
      setError('Failed to update user. Please try again.');
    }
  };

  return (
    <div>
      <NavigationBar />
      <h2>Update User</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="firstname">Firstname:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="lastname">Lastname:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="password">New password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default Update;

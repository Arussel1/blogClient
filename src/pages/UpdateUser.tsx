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
      <h2 className="text-xl font-bold m-8">Update User</h2>

      {error && <p className="text-red-500 m-8">{error}</p>}
      {success && <p className="text-green-500 m-8">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 m-8">
        <div className="flex flex-col">
          <label htmlFor="firstname" className="mb-1">Firstname:</label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="lastname" className="mb-1">Lastname:</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="username" className="mb-1">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1">New Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Update
        </button>
      </form>
    </div>
  );
};

export default Update;

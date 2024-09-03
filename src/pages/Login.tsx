import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import axios from 'axios'; 

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/posts');
    }
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_WEB}/api/users/login`, {
        username,
        password,
      });
      const { token } = response.data;

      localStorage.setItem('token', token);

      navigate('/posts');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error Response:', err.response?.data.error || err.response?.data.errors);
        setError(err.response?.data.message || 'Login failed. Please check your credentials.');
      } else {
        console.error('Unexpected Error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Login
        </button>
        {error && (
          <p className="mt-4 text-red-500 text-center">{error}</p>
        )}
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-blue-500 hover:underline">Sign up here</Link>
        </p>
      </form>
    </div>
  );
}

export default Login;

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
    <form onSubmit={handleLogin}>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
      {error && <p>{error}</p>}
      <p>
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </form>
  );
}

export default Login;

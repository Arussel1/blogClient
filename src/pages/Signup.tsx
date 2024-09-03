import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

interface BackendError {
  msg: string;
}

function Signup() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmpassword) {
      setErrors(['Passwords do not match.']);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_WEB}/api/users/signup`, {
        firstname,
        lastname,
        username,
        password,
        confirmpassword
      });

      navigate('/');
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const errorMessages = err.response?.data.errors.map((error: BackendError) => error.msg) || ['Signup failed. Please check your credentials.'];
        setErrors(errorMessages);
      } else {
        console.error('Unexpected Error:', err);
        setErrors(['An unexpected error occurred. Please try again.']);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSignup} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstname}
          onChange={(e) => setFirstname(e.target.value)}
          autoComplete="given-name"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastname}
          onChange={(e) => setLastname(e.target.value)}
          autoComplete="family-name"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmpassword}
          onChange={(e) => setConfirmpassword(e.target.value)}
          autoComplete="new-password"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
        >
          Sign Up
        </button>
        {errors.length > 0 && (
          <div className="mt-4">
            {errors.map((error, index) => (
              <p key={index} className="text-red-500">{error}</p>
            ))}
          </div>
        )}
        <p className="mt-4 text-center">
          Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login here</Link>
        </p>
      </form>
    </div>
  );
}

export default Signup;

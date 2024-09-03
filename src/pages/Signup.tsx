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
    <form onSubmit={handleSignup}>
      <input
        type="text"
        placeholder="First Name"
        value={firstname}
        onChange={(e) => setFirstname(e.target.value)}
        autoComplete="given-name"
        required
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastname}
        onChange={(e) => setLastname(e.target.value)}
        autoComplete="family-name"
        required
      />
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="username"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmpassword}
        onChange={(e) => setConfirmpassword(e.target.value)}
        autoComplete="new-password"
        required
      />
      <button type="submit">Sign Up</button>
      {errors.length > 0 && (
        <div>
          {errors.map((error, index) => (
            <p key={index} style={{ color: 'red' }}>{error}</p>
          ))}
        </div>
      )}
      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </form>
  );
}

export default Signup;

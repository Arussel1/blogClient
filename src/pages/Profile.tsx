import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  id: string;
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

const Profile = () => {
  const user = getUserFromToken();

  if (!user) {
    return <p>No user information available</p>;
  }

  return (
    <div>
      <p>User ID: {user.id}</p>
    </div>
  );
};

export default Profile;
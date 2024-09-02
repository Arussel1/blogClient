import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export interface Post {
  id: number;
  title: string;
  createdAt: string;
  content: string;
  authorName: string;
  published: boolean;
  image: string;
}

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
      }
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_WEB}/api/posts`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        // Filter out unpublished posts
        if (Array.isArray(response.data)) {
          const publishedPosts = response.data.filter((post: Post) => post.published);
          setPosts(publishedPosts);
        } else {
          console.error('Unexpected data format:', response.data);
          setError('Received unexpected data format. Please contact support.');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error Response:', err.response?.data.message || err.response?.data.errors);
          setError(err.response?.data.message || 'Failed to load posts. Please try again.');
        } else {
          console.error('Unexpected Error:', err);
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [navigate]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="posts">
      <h1>Published Posts</h1>
      {posts.length > 0 ? (
        posts.map((post: Post) => (
          <button
            key={post.id}
            onClick={() => navigate(`/posts/${post.id}`)}
          >
            <div className="post" >
              <h2>{post.title}</h2>
              <p>
                {post.authorName} at {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <img src={post.image} alt="Post image"  />
              <p>{post.content}</p>
            </div>
          </button>
        ))
      ) : (
        <p>No published posts available.</p>
      )}
    </div>
  );
};

export default Posts;

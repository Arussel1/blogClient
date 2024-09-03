import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavigationBar from '../Navigation';
import DOMPurify from 'dompurify';
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
  const truncateToWords = (text:string, maxWords: number) => {
    const words = text.split(/\s+/); 
    if (words.length > maxWords) {
      return words.slice(0, maxWords).join(' ') + '...'; 
    }
    return text;
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationBar />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-center">Published Posts</h1>
        {posts.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: Post) => (
              <button
                key={post.id}
                onClick={() => navigate(`/posts/${post.id}`)}
                className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 w-full"
              >
                <div className="post">
                  <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                  <p className="text-gray-600 mb-2">
                    {post.authorName} at {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(truncateToWords(post.content,30)) }}
                  className="text-gray-800 mb-2 text-left"
                />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600">No published posts available.</p>
        )}
      </div>
    </div>
  );
};

export default Posts;

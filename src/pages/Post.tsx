import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from './Posts';
import NavigationBar from '../Navigation';
import DOMPurify from 'dompurify';
interface Comment {
  id: number;
  content: string;
  authorName: string;
  createdAt: string;
}

const Post = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState(''); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_WEB}/api/posts/${postId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data && response.data.post) {
          setPost(response.data.post);
          setComments(response.data.comments || []);
        } else {
          setError('Post not found or is unpublished.');
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          console.error('Error Response:', err.response?.data.message || err.response?.data.errors);
          setError(err.response?.data.message || 'Failed to load post. Please try again.');
        } else {
          console.error('Unexpected Error:', err);
          setError('An unexpected error occurred. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [postId, navigate]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token || !newComment.trim()) {
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_WEB}/api/posts/${postId}/comments`,
        { content: newComment },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      window.location.reload();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        console.error('Error Response:', err.response?.data.message || err.response?.data.errors);
        setError(err.response?.data.message || 'Failed to add comment. Please try again.');
      } else {
        console.error('Unexpected Error:', err);
        setError('An unexpected error occurred. Please try again.');
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="min-h-screen bg-gray-100">
    <NavigationBar />
    <div className="container mx-auto px-4 py-6">
      {post && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 mb-4">
            <em>{post.authorName} at {new Date(post.createdAt).toLocaleDateString()}</em>
          </p>
          <img
            src={post.image}
            alt="Post image"
            className="w-full h-60 object-cover rounded-lg mb-4"
          />
          <div
                  dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                  className="text-gray-800 mb-2 "
                />
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-300 pb-4 mb-4">
              <p className="text-gray-600 mb-1">
                <strong>{comment.authorName}</strong> at{' '}
                {new Date(comment.createdAt).toLocaleString(undefined, {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})}
              </p>
              <p className="text-gray-800">{comment.content}</p>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No comments yet.</p>
        )}
        <form onSubmit={handleCommentSubmit} className="mt-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg mb-4"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit Comment
          </button>
        </form>
      </div>
    </div>
  </div>
);
};

export default Post;

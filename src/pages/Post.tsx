import { useState, useEffect, FormEvent } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import type { Post } from './Posts';
import NavigationBar from '../Navigation';
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
          setComments(response.data.comment || []);
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
    <div className="post-detail">
      <NavigationBar/>
      {post && (
        <>
          <h1>{post.title}</h1>
          <p>
            <em>
              {post.authorName} at {new Date(post.createdAt).toLocaleDateString()}
            </em>
          </p>
          <img
            src={post.image}
            alt="Post image"
            style={{ width: '100%', maxHeight: '300px', objectFit: 'cover' }}
          />
          <p>{post.content}</p>
        </>
      )}
      <div className="comments-section">
        <h2>Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="comment">
              <p>
                <strong>{comment.authorName}</strong> at{' '}
                {new Date(comment.createdAt).toLocaleDateString()}
              </p>
              <p>{comment.content}</p>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        <form onSubmit={handleCommentSubmit} className="comment-form">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment..."
            required
          />
          <button type="submit">Submit Comment</button>
        </form>
      </div>
    </div>
  );
};

export default Post;

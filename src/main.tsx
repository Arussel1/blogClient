import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login';
/* import Signup from './pages/Signup';
import Profile from './pages/UserProfile';
import UpdateUser from './pages/UpdateUser';
import DeleteUser from './pages/DeleteUser';
import Posts from './pages/Posts';
import Post from './pages/Post';
import Comments from './pages/Comments';
import './index.css' */

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
 /* { path: "signup", element: <Signup /> },
  { path: "user/:userId", element: <Profile /> },
  { path: "user/:userId/update", element: <UpdateUser /> },
  { path: "user/:userId/delete", element: <DeleteUser /> },
  { path: "posts", element: <Posts /> },
  { path: "posts/:postId", element: <Post /> },
  { path: "posts/:postId/comments", element: <Comments /> }, */
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

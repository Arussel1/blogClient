import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Update from './pages/UpdateUser';
import Posts from './pages/Posts';
import Post from './pages/Post';
import './index.css' 

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "users/:userId", element: <Profile /> },
  { path: "user/:userId/update", element: <Update /> },
  { path: "posts", element: <Posts /> },
  { path: "posts/:postId", element: <Post /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

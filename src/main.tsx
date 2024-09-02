import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
// import UpdateUser from './pages/UpdateUser';
// import DeleteUser from './pages/DeleteUser';
import Posts from './pages/Posts';
import Post from './pages/Post';
import NavigationBar from './Navigation';
//import './index.css' 

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "signup", element: <Signup /> },
  { path: "users/:userId", element: <Profile /> },
   // { path: "user/:userId/update", element: <UpdateUser /> },
 // { path: "user/:userId/delete", element: <DeleteUser /> },
  { path: "posts", element: <Posts /> },
  { path: "posts/:postId", element: <Post /> },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <NavigationBar></NavigationBar>
    <RouterProvider router={router} />
  </StrictMode>,
)

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'
import Navbar from './components/Navbar.jsx';
import Front from './components/Front.jsx';
import LoginSignup from './components/LoginSignup.jsx';
import Search from './components/Search.jsx';
import ComparePage from './components/ComparePage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Front />, 
  },
  {
    path: "/login",
    element: <LoginSignup />, 
  },
  {
    path: "/search",
    element: <Search />, 
  },
  {
    path: "/compare",
    element: <ComparePage />, 
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Navbar></Navbar>
    <RouterProvider router={router} />
  </StrictMode>,
)

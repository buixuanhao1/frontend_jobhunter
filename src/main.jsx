import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import App from './App.jsx'
import 'antd/dist/reset.css'; // Cho phiên bản mới của Ant Design
import LoginPage from './pages/LoginPage.jsx';
import Register from './pages/Register.jsx';
import UsersTable from './pages/UserTable.jsx';
import UserPage from './pages/User.jsx';
import ErrorPage from './pages/error.jsx';
import JobPage from './pages/Job.jsx';
import CompanyPage from './pages/Company.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <p>Trang Chủ</p>
      },
      {
        path: "/user",
        element: <UserPage />,
      },
      {
        path: "/job",
        element: <JobPage />,
      },
      {
        path: "/company",
        element: <CompanyPage />,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/register",
    element: <Register />,
  },

]);

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <RouterProvider router={router} />

  </StrictMode>,
)

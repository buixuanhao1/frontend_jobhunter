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
import UserPage from './pages/User.jsx';
import CompanyPage from './pages/company/index.jsx';
import ClientCompanyDetailPage from './pages/company/details.jsx';
import HomePage from './pages/home/index.jsx';
import ClientJobDetailPage from './pages/job/details.jsx';
import JobPage from './pages/job/index.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/user",
        element: <UserPage />,
      },
      {
        path: "/job",
        element: <JobPage />
      },
      {
        path: "/company",
        element: <CompanyPage />,
      },
      {
        path: "/company/:id",
        element: <ClientCompanyDetailPage />,
      },
      {
        path: "/job/:id",
        element: <ClientJobDetailPage />,
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

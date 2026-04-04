import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import 'antd/dist/reset.css'; // Cho phiên bản mới của Ant Design

import App from './App.jsx';
import LoginPage from './pages/LoginPage.jsx';
import Register from './pages/Register.jsx';
import HomePage from './pages/home/index.jsx';
import UserPage from './pages/User.jsx';
import JobPage from './pages/job/index.jsx';
import ClientJobDetailPage from './pages/job/details.jsx';
import CompanyPage from './pages/company/index.jsx';
import ClientCompanyDetailPage from './pages/company/details.jsx';
import ErrorPage from './pages/error.jsx';
import PrivateRoute from './pages/private.route.jsx';
import { AuthWrapper } from './components/context/auth.context.jsx';
import LayoutAdmin from './components/admin/layout.admin.jsx';
import CompanyTable from './pages/admin/company.jsx';
import UserTable from './pages/admin/user.jsx';
import ManagePage from './pages/admin/job/manage.jsx';
import ResumePage from './pages/admin/resume.jsx';
import PermissionPage from './pages/admin/permission.jsx';
import RolePage from './pages/admin/role.jsx';
import AdminDashboard from './pages/admin/dashboard.jsx';
import SavedJobsPage from './pages/SavedJobsPage.jsx';
import MyPortal from './pages/my/index.jsx';
import CVBuilder from './pages/cv-builder/index.jsx';
import LayoutHR from './components/hr/layout.hr.jsx';
import HRDashboard from './pages/hr/dashboard.jsx';
import HRJobs from './pages/hr/jobs.jsx';
import HRResumes from './pages/hr/resumes.jsx';
import BlogPage from './pages/blog/index.jsx';
import BlogDetailPage from './pages/blog/detail.jsx';
import BlogEditorPage from './pages/blog/editor.jsx';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: '/user',
        element: (
          <PrivateRoute>
            <UserPage />
          </PrivateRoute>
        ),
      },
      { path: '/job', element: <JobPage /> },
      { path: '/job/:id', element: <ClientJobDetailPage /> },
      { path: '/saved-jobs', element: <PrivateRoute><SavedJobsPage /></PrivateRoute> },
      { path: '/my', element: <PrivateRoute><MyPortal /></PrivateRoute> },
      { path: '/cv-builder', element: <PrivateRoute><CVBuilder /></PrivateRoute> },
      { path: '/blog', element: <BlogPage /> },
      { path: '/blog/:id', element: <BlogDetailPage /> },
      { path: '/blog/create', element: <PrivateRoute><BlogEditorPage /></PrivateRoute> },
      { path: '/blog/edit/:id', element: <PrivateRoute><BlogEditorPage /></PrivateRoute> },
      { path: '/company', element: <CompanyPage /> },
      { path: '/company/:id', element: <ClientCompanyDetailPage /> },
    ],
  },

  // Layout dành cho trang Admin
  {
    path: '/admin',
    element: (
      <LayoutAdmin />
    ),
    children: [
      { index: true, element: <PrivateRoute><AdminDashboard /></PrivateRoute> },
      { path: 'user', element: <PrivateRoute><UserTable /></PrivateRoute> },
      { path: 'job', element: <PrivateRoute><ManagePage /></PrivateRoute> },
      { path: 'company', element: <PrivateRoute><CompanyTable /></PrivateRoute> },
      { path: 'resume', element: <PrivateRoute><ResumePage /></PrivateRoute> },
      { path: 'permission', element: <PrivateRoute><PermissionPage /></PrivateRoute> },
      { path: 'role', element: <PrivateRoute><RolePage /></PrivateRoute> },
    ],
  },

  // HR Portal
  {
    path: '/hr',
    element: <LayoutHR />,
    children: [
      { index: true, element: <HRDashboard /> },
      { path: 'jobs', element: <HRJobs /> },
      { path: 'resumes', element: <HRResumes /> },
    ],
  },

  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <Register /> },
  { path: '*', element: <ErrorPage /> }, // ✅ Route 404
]);

createRoot(document.getElementById('root')).render(
  <AuthWrapper>
    <RouterProvider router={router} />
  </AuthWrapper>
);

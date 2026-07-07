import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ExplorerPage from '../pages/ExplorerPage';
import SharedPage from '../pages/SharedPage';
import { DashboardLayout } from '../layouts/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/drive" replace />,
          },
          {
            path: 'drive',
            element: <ExplorerPage />,
          },
          {
            path: 'drive/:folderId',
            element: <ExplorerPage />,
          },
          {
            path: 'shared',
            element: <SharedPage />,
          },
        ],
      },
    ],
  },
]);

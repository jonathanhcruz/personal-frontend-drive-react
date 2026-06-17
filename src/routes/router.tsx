import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import ExplorerPage from '../pages/ExplorerPage';
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
    ],
  },
]);

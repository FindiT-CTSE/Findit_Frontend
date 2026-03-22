import { Navigate, createBrowserRouter } from 'react-router-dom';
import { PublicLayout } from './components/layout/PublicLayout';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailsPage } from './pages/PostDetailsPage';
import { MyPostsPage } from './pages/MyPostsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { MatchesPage } from './pages/MatchesPage';
import { MyClaimsPage } from './pages/MyClaimsPage';
import { ReceivedClaimsPage } from './pages/ReceivedClaimsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Navigate to="/login" replace /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
    ],
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <PublicLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: 'posts/:id', element: <PostDetailsPage /> },
        ],
      },
      {
        element: <DashboardLayout />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          { path: 'posts/new', element: <CreatePostPage /> },
          { path: 'my-posts', element: <MyPostsPage /> },
          { path: 'my-posts/:id/matches', element: <MatchesPage /> },
          { path: 'my-claims', element: <MyClaimsPage /> },
          { path: 'received-claims', element: <ReceivedClaimsPage /> },
          { path: 'notifications', element: <NotificationsPage /> },
          { path: 'profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

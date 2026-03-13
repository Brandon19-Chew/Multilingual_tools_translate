import TranslationPage from './pages/TranslationPage';
import LoginPage from './pages/LoginPage';
import FeedbackPage from './pages/FeedbackPage';
import SettingsPage from './pages/SettingsPage';
import AdminPage from './pages/AdminPage';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Translation',
    path: '/',
    element: <TranslationPage />
  },
  {
    name: 'Login',
    path: '/login',
    element: <LoginPage />
  },
  {
    name: 'Feedback',
    path: '/feedback',
    element: <FeedbackPage />
  },
  {
    name: 'Settings',
    path: '/settings',
    element: <SettingsPage />
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPage />
  }
];

export default routes;

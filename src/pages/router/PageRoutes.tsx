// types
import type { RouteType } from 'types/utils';

// pages
import Home from 'pages/home';
import Announcements from 'pages/announcements';
import Leaderboard from 'pages/leaderboard';
import About from 'pages/about';
import AdminPanel from 'pages/admin-panel';
import Problems from 'pages/problems';
import Attendance from 'pages/attendance';
import Challenges from 'pages/Challenges';
import Challenge from 'pages/challenge';
import ActionPanel from 'pages/action-panel';
import The404Page from 'pages/404-page';
import RequestAttendance from 'pages/request-attendance';

const routes: RouteType[] = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/announcements',
    element: <Announcements />
  },
  {
    path: '/leaderboard',
    element: <Leaderboard />
  },
  {
    path: '/about',
    element: <About />
  },
  {
    path: '/admin',
    element: <AdminPanel />
  },
  {
    path: '/problems',
    element: <Problems />
  },
  {
    path: '/attendance',
    element: <Attendance />
  },
  {
    path: '/challenges',
    element: <Challenges />
  },
  {
    path: '/challenges/:id',
    element: <Challenge />
  },
  {
    path: '/actions',
    element: <ActionPanel />
  },
  {
    path: '/request-attendance',
    element: <RequestAttendance />
  },
  {
    path: '*',
    element: <The404Page />
  }
];

export default routes;

import { RouterProvider, createBrowserRouter } from 'react-router';
import RootLayout from '@sidepanel/layouts/RootLayout';
import HomePage from '@sidepanel/pages/HomePage';
import Vod from '@sidepanel/pages/Vod';
import Assignment from '@sidepanel/pages/Assignment';
import Settings from '@sidepanel/pages/Settings';

export default function Routers() {
  const router = createBrowserRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          { path: '/', element: <HomePage /> },
          { path: '/index.html', element: <HomePage /> },
          { path: '/vod', element: <Vod /> },
          { path: '/assignment', element: <Assignment /> },
          { path: '/settings', element: <Settings /> },
        ],
      },
      {
        path: '*',
        element: (
          <h3>
            <b>NOT FOUND PAGE</b>
          </h3>
        ),
      },
    ],
    {
      basename: '/sidepanel.html', // HTML 파일 경로 기준
    },
  );
  return <RouterProvider router={router} />;
}

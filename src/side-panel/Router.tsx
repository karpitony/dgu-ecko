import { RouterProvider, createBrowserRouter } from 'react-router';
import RootLayout from '@/side-panel/layouts/RootLayout';
import HomePage from '@/side-panel/pages/HomePage';
import Vod from '@/side-panel/pages/Vod';
import Assignment from '@/side-panel/pages/Assignment';
import Settings from '@/side-panel/pages/Settings';

export default function Routers() {
  const router = createBrowserRouter([
    {path: '/',
      element: <RootLayout />,
      children: [
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
  ])
  return <RouterProvider router={router} />
}
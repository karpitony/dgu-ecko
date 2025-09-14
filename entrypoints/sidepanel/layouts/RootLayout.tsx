import { Outlet } from 'react-router';
import Header from '@sidepanel/components/Header';
import Footer from '../components/Footer';

export default function RootLayout() {
  return (
    <div className="flex justify-center items-center w-full h-screen bg-gray-200">
      <div className="flex flex-col items-center h-screen w-full max-w-lg">
        <Header />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
}

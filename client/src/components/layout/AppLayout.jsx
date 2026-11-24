import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

// Shared shell for every logged-in page
export default function AppLayout() {
  return (
    <div className="min-h-screen bg-app">
      <Navbar />
      <Outlet />
    </div>
  );
}
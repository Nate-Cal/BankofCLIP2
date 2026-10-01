import { Outlet } from 'react-router';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex min-h-screen w-full items-stretch">
      <Sidebar />
      <main className="min-w-0 flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}
export default Layout;
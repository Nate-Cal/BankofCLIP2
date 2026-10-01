
import { Link } from 'react-router';

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col justify-between bg-[#034F54] p-5 text-white">
        <div>
        <h2 className="text-xl font-bold mb-6">Account Menu</h2>
        <nav className="space-y-2">
            <Link to="/Balance" className="block px-3 py-2 rounded hover:bg-[#002D2A]">
                Balance
            </Link>
            <Link to="/Deposit" className="block px-3 py-2 rounded hover:bg-[#002D2A] transition">
                Deposit
            </Link>
            <Link to="/Withdraw" className="block rounded px-3 py-2 transition hover:bg-[#002D2A]">
                Withdraw
            </Link>
            <Link to="/Transfer" className="block rounded px-3 py-2 transition hover:bg-[#002D2A]">
                Transfer
            </Link>
            <Link to="/History" className="block rounded px-3 py-2 transition hover:bg-[#002D2A]">
                History
            </Link>
            <Link to="/Logout" className="block rounded px-3 py-2 transition hover:bg-[#002D2A]">
                Logout
            </Link>
        </nav>
        </div>
    </aside>
  );
}

export default Sidebar;

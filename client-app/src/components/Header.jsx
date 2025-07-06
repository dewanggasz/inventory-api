import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="w-full bg-white shadow-sm p-4 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center text-gray-600">
          <User size={20} className="mr-2" />
          <span className="font-semibold">
            Halo, {user ? user.name : 'Pengguna'}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          <LogOut size={16} className="mr-2" />
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;

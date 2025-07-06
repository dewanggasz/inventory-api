import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react'; // Impor ikon baru

function Header() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  // URL ke panel admin Filament Anda
  const adminDashboardUrl = 'http://127.0.0.1:8000/admin'; 

  return (
    <header className="w-full bg-white shadow-sm p-4 mb-8">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center text-gray-600">
          <User size={20} className="mr-2" />
          <span className="font-semibold">
            Halo, {user ? user.name : 'Pengguna'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Tombol ini hanya muncul jika user adalah admin */}
          {isAdmin && (
            <a
              href={adminDashboardUrl}
              target="_blank" // Buka di tab baru agar tidak menutup aplikasi React
              rel="noopener noreferrer"
              className="flex items-center bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              <LayoutDashboard size={16} className="mr-2" />
              Dashboard
            </a>
          )}
          <button
            onClick={logout}
            className="flex items-center bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
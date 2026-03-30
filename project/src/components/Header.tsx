import { Home, LogIn, Menu, X, CalendarCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-2 rounded-lg transform group-hover:scale-110 transition-transform duration-200">
              <Home className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              VacancesDream
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/mes-reservations"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                isActive('/mes-reservations')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Mes réservations</span>
            </Link>
            <Link
              to="/admin"
              className={`flex items-center space-x-1 text-sm font-medium transition-colors duration-200 ${
                isActive('/admin')
                  ? 'text-blue-600'
                  : 'text-gray-700 hover:text-blue-600'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slideDown">
          <div className="px-4 py-3 space-y-3">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              Accueil
            </Link>
            <Link
              to="/mes-reservations"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/mes-reservations')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CalendarCheck className="h-4 w-4" />
              <span>Mes réservations</span>
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive('/admin')
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

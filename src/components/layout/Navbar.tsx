import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, Menu } from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  onLogout: () => Promise<void>;
  onMenuToggle?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout, onMenuToggle }) => {
  const { user } = useAuth();


  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-opacity-80">
      <div className="max-w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex justify-between h-16 items-center">
          {/* Left: Logo + Menu Toggle */}
          <div className="flex items-center space-x-2">
            {/* Mobile menu button - always visible on mobile */}
            <button
              onClick={onMenuToggle}
              className="sm:hidden p-2 rounded-md text-gray-600 hover:text-black hover:bg-gray-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <img 
                src="IMG/sivo.png" 
                alt="Company Logo"
                className="w-[180px] hover:opacity-90 transition-opacity" 
              />
            </div>
          </div>

          {/* Right: User actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                {/* User info with subtle animation */}
                <div className="hidden sm:flex items-center space-x-3">
                  <span className="text-sm text-gray-600 transition-colors hover:text-gray-900">
                    Welcome, <span className="font-medium text-indigo-600">{user.name}</span>
                  </span>
                  
                  {/* Divider */}
                  <span className="h-5 w-px bg-gray-300"></span>
                  
                  {/* Logout button with better hover effect */}
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={<LogOut className="h-4 w-4" />}
                    onClick={onLogout}
                    className="group hover:bg-gray-100 transition-colors"
                  >
                    <span className="group-hover:text-red-600 transition-colors">Sign out</span>
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, LogOut, Menu } from 'lucide-react';
import Button from '../ui/Button';

interface NavbarProps {
  onLogout: () => Promise<void>;
}

const Navbar: React.FC<NavbarProps> = ({ onLogout }) => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className=" px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="ml-2 text-xl font-bold text-gray-900">HandScript</span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>

          {/* Desktop navigation */}
          <div className="hidden sm:flex sm:items-center sm:ml-6">
            {user && (
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-700">
                  Hi, <span className="font-medium">{user.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={() => onLogout()}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {user && (
              <div className="flex flex-col space-y-2 px-4 py-2">
                <div className="text-sm text-gray-700">
                  Hi, <span className="font-medium">{user.name}</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  icon={<LogOut className="h-4 w-4" />}
                  onClick={() => onLogout()}
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
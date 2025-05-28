import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Images,
  History,
  Settings,
  Package,
  X,
  LogOut,
  PersonStanding,
  User2,
} from 'lucide-react';

interface NavItem {
  name: string;
  path?: string;
  icon: React.ReactNode;
  action?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => Promise<void>;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onLogout }) => {
  const location = useLocation();

  const navItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <User2 className="h-5 w-5" /> },
    { name: 'New Scan', path: '/scan', icon: <Images className="h-5 w-5" /> },
    { name: 'History', path: '/history', icon: <History className="h-5 w-5" /> },
    // { name: 'Products', path: '/products', icon: <Package className="h-5 w-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const navItemsMobile: NavItem[] = [
    ...navItems,
    {
      name: 'Sign out',
      icon: <LogOut className="h-5 w-5" />,
      action: async () => {
        await onLogout();
        onClose();
      },
    },
  ];

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:fixed md:inset-y-0 md:flex md:w-64 md:flex-col bg-white border-r border-gray-200 z-20 shadow-sm">
        <div className="flex flex-col h-full pt-5 pb-4 overflow-y-auto">
        
          
          <nav className="flex-1 space-y-1 px-3 pt-16">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path!}
                className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 text-indigo-600 shadow-inner'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`mr-3 p-1.5 rounded-lg ${
                  location.pathname === item.path 
                    ? 'bg-indigo-100 text-indigo-600' 
                    : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                }`}>
                  {item.icon}
                </span>
                {item.name}
                {location.pathname === item.path && (
                  <span className="ml-auto h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
                )}
              </Link>
            ))}
          </nav>
          
          <div className="px-3 mt-auto">
            <div className="border-t border-gray-200 pt-4">
              <button
                onClick={onLogout}
                className="group flex items-center w-full px-3 py-2.5 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                <span className="mr-3 p-1.5 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500">
                  <LogOut className="h-5 w-5" />
                </span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          {/* Overlay with fade-in animation */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ease-in-out" 
            onClick={onClose}
          ></div>

          {/* Sidebar Panel with slide-in animation */}
          <div className="relative flex flex-col w-80 max-w-[80%] bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between px-5 pt-5 pb-2 border-b border-gray-100">
              <div className="flex-shrink-0 flex items-center">
              <img 
                src="IMG/sivo.png" 
                alt="Company Logo"
                className="w-[180px] hover:opacity-90 transition-opacity" 
              />
            </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
              </button>
            </div>

            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
              {navItemsMobile.map((item) =>
                item.path ? (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={onClose}
                    className={`group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all ${
                      location.pathname === item.path
                        ? 'bg-indigo-50 text-indigo-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className={`mr-3 p-1.5 rounded-lg ${
                      location.pathname === item.path 
                        ? 'bg-indigo-100 text-indigo-600' 
                        : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-50 group-hover:text-indigo-500'
                    }`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                ) : (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className="group flex items-center px-3 py-3 text-sm font-medium rounded-lg text-gray-600 hover:bg-gray-50 hover:text-gray-900 w-full transition-colors"
                  >
                    <span className="mr-3 p-1.5 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-red-50 group-hover:text-red-500">
                      {item.icon}
                    </span>
                    {item.name}
                  </button>
                )
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
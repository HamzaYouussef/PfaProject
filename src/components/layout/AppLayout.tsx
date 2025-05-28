import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  // Fonction pour toggle la sidebar mobile
  const toggleSidebar = () => setSidebarOpen((open) => !open);

  // Fonction de déconnexion à passer à Navbar et Sidebar
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Passe la fonction toggleSidebar à Navbar */}
      <Navbar onLogout={handleLogout} onMenuToggle={toggleSidebar} />

      <div className="flex">
        {/* Passe l'état et la fonction de fermeture à Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onLogout={handleLogout}
        />

        {/* Décale le contenu à droite sur desktop, pleine largeur sur mobile */}
        <main className="flex-1 p-6 md:ml-64">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

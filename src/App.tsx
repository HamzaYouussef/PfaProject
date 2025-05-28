import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/auth/AuthPage';
import Dashboard from './pages/Dashboard';
import ScanPage from './pages/ScanPage';
import HistoryPage from './pages/HistoryPage';
import ScanDetailPage from './pages/ScanDetailPage';
import SettingsPage from './pages/SettingsPage';
import ProductsPage from './pages/ProductsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ScanProvider } from './context/ScanContext';
// Import Cloudinary
import { Cloudinary } from '@cloudinary/url-gen';
import UsersPage from './pages/UsersPage';

// Initialize Cloudinary instance
const cld = new Cloudinary({
  cloud: {
    cloudName: 'dyvc8vr0b' // Replace with your Cloudinary cloud name
  }
});

// Protected route component
const ProtectedRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? element : <Navigate to="/auth" replace />;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
      <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
      <Route path="/users" element={<ProtectedRoute element={<UsersPage />} />} />
      <Route path="/scan" element={<ProtectedRoute element={<ScanPage />} />} />
      <Route path="/history" element={<ProtectedRoute element={<HistoryPage />} />} />
      <Route path="/history/:id" element={<ProtectedRoute element={<ScanDetailPage />} />} />
      <Route path="/products" element={<ProtectedRoute element={<ProductsPage />} />} />
      <Route path="/settings" element={<ProtectedRoute element={<SettingsPage />} />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} replace />} />
    </Routes>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScanProvider>
          {/* Optional: Wrap with CloudinaryProvider if you created one */}
          <AppRoutes />
        </ScanProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
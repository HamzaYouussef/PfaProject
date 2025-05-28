import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, AuthState } from '../types';

// Mock auth service - would be replaced with actual auth implementation
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  if (email === 'demo@example.com' && password === 'password') {
    return {
      id: '1',
      email: 'demo@example.com',
      name: 'Demo User',
      createdAt: new Date().toISOString(),
    };
  }
  
  throw new Error('Invalid credentials');
};

const mockSignUp = async (email: string, password: string, name: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: '1',
    email,
    name,
    createdAt: new Date().toISOString(),
  };
};

const mockLogout = async (): Promise<void> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check for existing session
    const checkAuth = async () => {
      try {
        // In a real app, this would verify the user's session with the server
        const savedUser = localStorage.getItem('user');
        
        if (savedUser) {
          setState({
            user: JSON.parse(savedUser),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to restore session',
        });
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockLogin(email, password);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to login',
      }));
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const user = await mockSignUp(email, password, name);
      localStorage.setItem('user', JSON.stringify(user));
      
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to sign up',
      }));
      throw error;
    }
  };

  const logout = async () => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await mockLogout();
      localStorage.removeItem('user');
      
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to logout',
      }));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        signUp,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
// Type definitions for the application

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface ScanResult {
  id: string;
  userId: string;
  imageUrl: string;
  extractedText: string;
  confidence: number;
  createdAt: string;
}

export interface DashboardStats {
  totalScans: number;
  successfulScans: number;
  averageConfidence: number;
  recentScans: ScanResult[];
}

export interface Product {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}
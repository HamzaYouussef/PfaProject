// context/ScanContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { ScanResult, DashboardStats } from '../types';
import { useAuth } from './AuthContext';

const OCR_API_URL = import.meta.env.VITE_OCR_API_URL;

const mockScanResults: ScanResult[] = [
  {
    id: '1',
    userId: '1',
    imageUrl: 'https://images.pexels.com/photos/8985458/pexels-photo-8985458.jpeg',
    extractedText: 'Meeting notes: Discuss product roadmap with team',
    confidence: 0.92,
    createdAt: '2025-05-01T14:23:10Z',
  },
  {
    id: '2',
    userId: '1',
    imageUrl: 'https://images.pexels.com/photos/6683072/pexels-photo-6683072.jpeg',
    extractedText: 'Remember to pick up groceries after work',
    confidence: 0.85,
    createdAt: '2025-05-03T09:45:22Z',
  },
  {
    id: '3',
    userId: '1',
    imageUrl: 'https://images.pexels.com/photos/5238117/pexels-photo-5238117.jpeg',
    extractedText: 'Call John about the project deadline extension',
    confidence: 0.78,
    createdAt: '2025-05-05T16:12:45Z',
  },
];

const uploadToCloudinary = async (file: File): Promise<string> => {
  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', 'ProjetRL');
  data.append('cloud_name', 'dxc5curxy');

  const response = await fetch('https://api.cloudinary.com/v1_1/dxc5curxy/image/upload', {
    method: 'POST',
    body: data,
  });

  if (!response.ok) throw new Error("Échec de l'upload");

  const result = await response.json();
  if (result && result.url) return result.url;
  else throw new Error('Réponse Cloudinary invalide');
};

const processImageFile = async (imageFile: File): Promise<ScanResult> => {
  if (!OCR_API_URL) throw new Error('OCR API URL not configured');
  const cloudinaryUrl = await uploadToCloudinary(imageFile);

  const formData = new FormData();
  formData.append('image', imageFile);

  const response = await fetch(OCR_API_URL, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) throw new Error('Failed to process image');

  const data = await response.json();

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    userId: '1',
    imageUrl: cloudinaryUrl,
    extractedText: data.text || '',
    confidence: data.confidence || 0.75,
    createdAt: new Date().toISOString(),
  };
};

const processImageUrl = async (imageUrl: string): Promise<ScanResult> => {
  if (!OCR_API_URL) throw new Error('OCR API URL not configured');

  const response = await fetch(`${OCR_API_URL}/url`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageUrl }),
  });

  if (!response.ok) throw new Error('Failed to process image URL');

  const data = await response.json();

  return {
    id: data.id || Math.random().toString(36).substr(2, 9),
    userId: '1',
    imageUrl,
    extractedText: data.text || '',
    confidence: data.confidence || 0.75,
    createdAt: new Date().toISOString(),
  };
};

const calculateStats = (scans: ScanResult[]): DashboardStats => {
  const totalScans = scans.length;
  const successfulScans = scans.filter(scan => scan.confidence > 0.7).length;
  const averageConfidence = scans.reduce((sum, scan) => sum + scan.confidence, 0) / (totalScans || 1);
  const recentScans = [...scans].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
  return { totalScans, successfulScans, averageConfidence, recentScans };
};

interface ScanContextType {
  scans: ScanResult[];
  isProcessing: boolean;
  stats: DashboardStats;
  processImage: (file: File | string) => Promise<ScanResult>;
  uploadImage: (file: File) => Promise<string>;
}

const ScanContext = createContext<ScanContextType | undefined>(undefined);

export const ScanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [scans, setScans] = useState<ScanResult[]>(mockScanResults);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcessImage = async (input: File | string): Promise<ScanResult> => {
    setIsProcessing(true);
    try {
      const result = typeof input === 'string' ? await processImageUrl(input) : await processImageFile(input);
      setScans(prev => [result, ...prev]);
      return result;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScanContext.Provider
      value={{
        scans,
        isProcessing,
        stats: calculateStats(scans),
        processImage: handleProcessImage,
        uploadImage: uploadToCloudinary,
      }}
    >
      {children}
    </ScanContext.Provider>
  );
};

export const useScan = (): ScanContextType => {
  const context = useContext(ScanContext);
  if (context === undefined) {
    throw new Error('useScan must be used within a ScanProvider');
  }
  return context;
};

import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useScan } from '../context/ScanContext';
import ScanCard from '../components/history/ScanCard';

const HistoryPage: React.FC = () => {
  const { scans } = useScan();
  
  return (
    <AppLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">History</h1>
        <p className="mt-1 text-sm text-gray-500">
          View all your previous scans
        </p>
      </div>
      
      {scans.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <p className="text-gray-500">You don't have any scans yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scans.map((scan) => (
            <ScanCard key={scan.id} scan={scan} />
          ))}
        </div>
      )}
    </AppLayout>
  );
};

export default HistoryPage;
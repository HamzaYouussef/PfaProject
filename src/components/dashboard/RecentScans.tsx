import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ScanResult } from '../../types';

interface RecentScansProps {
  scans: ScanResult[];
}

const RecentScans: React.FC<RecentScansProps> = ({ scans }) => {
  if (scans.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900">Recent Scans</h3>
        <div className="mt-4 text-gray-500 text-center py-6">
          No scans yet. Start by creating your first scan!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Scans</h3>
      </div>
      <ul className="divide-y divide-gray-200">
        {scans.map((scan) => (
          <li key={scan.id}>
            <Link to={`/history/${scan.id}`} className="block hover:bg-gray-50">
              <div className="px-6 py-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded overflow-hidden bg-gray-200">
                    <img 
                      src={scan.imageUrl} 
                      alt="Scan thumbnail" 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {scan.extractedText.substring(0, 50)}
                      {scan.extractedText.length > 50 ? '...' : ''}
                    </div>
                    <div className="mt-1 flex items-center text-sm text-gray-500">
                      <span className="truncate">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                      <span className="ml-2 flex-shrink-0 inline-block px-2 py-0.5 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                        {Math.round(scan.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <div className="px-6 py-4 border-t border-gray-200">
        <Link 
          to="/history" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all scans
        </Link>
      </div>
    </div>
  );
};

export default RecentScans;
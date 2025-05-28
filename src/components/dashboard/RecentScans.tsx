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
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Scans</h3>
        <div className="mt-4 text-gray-500 text-center py-6 text-sm sm:text-base">
          No scans yet. Start by creating your first scan!
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Scans</h3>
      </div>

      <ul className="divide-y divide-gray-200">
        {scans.map((scan) => (
          <li key={scan.id}>
            <Link to={`/history/${scan.id}`} className="block hover:bg-gray-50 transition">
              <div className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                  {/* Vignette image responsive */}
                  <div className="flex-shrink-0 w-full aspect-video sm:w-20 sm:h-20 rounded overflow-hidden bg-gray-200">
                    <img
                      src={scan.imageUrl}
                      alt="Scan thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Texte extrait & infos */}
                  <div className="flex-1 min-w-0">
                    <div className="text-sm sm:text-base font-medium text-gray-900 line-clamp-2">
                      {scan.extractedText}
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:flex-wrap sm:items-center text-xs sm:text-sm text-gray-500 gap-1 sm:gap-2">
                      <span className="truncate">
                        {new Date(scan.createdAt).toLocaleDateString()}
                      </span>
                      <span className="px-2 py-0.5 text-green-800 font-medium bg-green-100 rounded-full">
                        {Math.round(scan.confidence * 100)}% confidence
                      </span>
                    </div>
                  </div>

                  {/* Flèche visible sur desktop */}
                  <div className="hidden sm:flex items-center ml-auto">
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="px-4 py-4 sm:px-6 border-t border-gray-200">
        <Link
          to="/history"
          className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
        >
          View all scans
        </Link>
      </div>

    </>
  );
};

export default RecentScans;

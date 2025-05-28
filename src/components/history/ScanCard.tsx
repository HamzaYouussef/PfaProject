import React from 'react';
import { Link } from 'react-router-dom';
import { ScanResult } from '../../types';

interface ScanCardProps {
  scan: ScanResult;
}

const ScanCard: React.FC<ScanCardProps> = ({ scan }) => {
  const date = new Date(scan.createdAt).toLocaleDateString();
  const time = new Date(scan.createdAt).toLocaleTimeString();
  const confidencePercent = Math.round(scan.confidence * 100);

  const getConfidenceColor = () => {
    if (confidencePercent >= 90) return 'bg-green-100 text-green-800';
    if (confidencePercent >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow transition-transform duration-200 hover:shadow-md hover:-translate-y-1 w-full max-w-md mx-auto sm:max-w-none">
      {/* Image preview */}
      <div className="w-full h-48 sm:h-56 md:h-64 bg-gray-100 overflow-hidden">
        <img 
          src={scan.imageUrl} 
          alt="Scan preview" 
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor()}`}>
            {confidencePercent}% confidence
          </span>
          <span className="text-xs text-gray-500">{date} at {time}</span>
        </div>

        <p className="text-sm text-gray-800 line-clamp-3">
          {scan.extractedText}
        </p>

        <div className="mt-3">
          <Link
            to={`/history/${scan.id}`}
            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            View details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ScanCard;

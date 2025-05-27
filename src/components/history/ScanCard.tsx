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
  
  // Get confidence color
  const getConfidenceColor = () => {
    if (confidencePercent >= 90) return 'bg-green-100 text-green-800';
    if (confidencePercent >= 75) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden transition-transform duration-200 hover:shadow-md hover:translate-y-[-2px]">
      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
        <img 
          src={scan.imageUrl} 
          alt="Scan preview" 
          className="object-cover w-full h-48"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor()}`}>
              {confidencePercent}% confidence
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {date} at {time}
          </div>
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
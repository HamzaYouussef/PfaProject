import React from 'react';
import { ScanResult as ScanResultType } from '../../types';
import Button from '../ui/Button';
import { ClipboardCopy, Download } from 'lucide-react';

interface ScanResultDisplayProps {
  result: ScanResultType;
  isProcessing: boolean;
}

const ScanResultDisplay: React.FC<ScanResultDisplayProps> = ({ result, isProcessing }) => {
  const handleCopyText = () => {
    navigator.clipboard.writeText(result.extractedText);
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([result.extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `scan_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  if (isProcessing) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600">Processing your image...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Extracted Text</h3>
        <div className="mt-1">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {Math.round(result.confidence * 100)}% confidence
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-4 p-4 bg-gray-50 rounded-md text-gray-800 whitespace-pre-wrap">
          {result.extractedText}
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            icon={<ClipboardCopy className="h-4 w-4" />}
            onClick={handleCopyText}
          >
            Copy text
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            icon={<Download className="h-4 w-4" />}
            onClick={handleDownloadText}
          >
            Download
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultDisplay;
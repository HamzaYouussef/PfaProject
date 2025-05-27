import React from 'react';
import { useParams, Link } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import { useScan } from '../context/ScanContext';
import Button from '../components/ui/Button';
import { Download, ArrowLeft, ClipboardCopy } from 'lucide-react';

const ScanDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { scans } = useScan();
  
  const scan = scans.find(s => s.id === id);
  
  if (!scan) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Scan not found</h2>
          <p className="mt-2 text-gray-500">The requested scan could not be found.</p>
          <div className="mt-6">
            <Link to="/history">
              <Button variant="outline">Back to History</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }
  
  const handleCopyText = () => {
    navigator.clipboard.writeText(scan.extractedText);
  };

  const handleDownloadText = () => {
    const element = document.createElement('a');
    const file = new Blob([scan.extractedText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `scan_${new Date(scan.createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };
  
  const date = new Date(scan.createdAt).toLocaleDateString();
  const time = new Date(scan.createdAt).toLocaleTimeString();
  
  return (
    <AppLayout>
      <div className="mb-6 flex items-center">
        <Link to="/history" className="text-indigo-600 hover:text-indigo-500 mr-4">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scan Details</h1>
          <p className="mt-1 text-sm text-gray-500">
            Scanned on {date} at {time}
          </p>
        </div>
      </div>
      
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                {Math.round(scan.confidence * 100)}% confidence
              </span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Original Image</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <img 
                src={scan.imageUrl} 
                alt="Original scan" 
                className="w-full h-auto"
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Extracted Text</h3>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg h-full">
              <p className="whitespace-pre-wrap text-gray-800">
                {scan.extractedText}
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default ScanDetailPage;
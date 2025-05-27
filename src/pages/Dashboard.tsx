import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { useScan } from '../context/ScanContext';
import StatCard from '../components/dashboard/StatCard';
import RecentScans from '../components/dashboard/RecentScans';
import { Link } from 'react-router-dom';
import { BarChart2, FileText, Percent, Clock, PlusCircle } from 'lucide-react';
import Button from '../components/ui/Button';

const Dashboard: React.FC = () => {
  const { stats } = useScan();
  
  return (
    <AppLayout>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your text extraction activity
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link to="/scan">
            <Button icon={<PlusCircle className="h-4 w-4" />}>
              New Scan
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Scans"
          value={stats.totalScans}
          icon={<BarChart2 className="h-5 w-5 text-blue-700" />}
          color="blue"
        />
        <StatCard
          title="Successful Scans"
          value={stats.successfulScans}
          icon={<FileText className="h-5 w-5 text-green-700" />}
          color="green"
        />
        <StatCard
          title="Average Confidence"
          value={`${Math.round(stats.averageConfidence * 100)}%`}
          icon={<Percent className="h-5 w-5 text-purple-700" />}
          color="purple"
        />
        <StatCard
          title="Last Scan"
          value={stats.recentScans.length > 0 
            ? new Date(stats.recentScans[0].createdAt).toLocaleDateString() 
            : 'N/A'}
          icon={<Clock className="h-5 w-5 text-orange-700" />}
          color="orange"
        />
      </div>
      
      <div className="mt-8">
        <RecentScans scans={stats.recentScans} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;
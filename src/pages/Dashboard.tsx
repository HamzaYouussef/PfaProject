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
      {/* Container centralisé avec padding responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">
              Dashboard Overview
            </h1>
            <p className="mt-2 text-gray-600">
              Track and analyze your text extraction performance
            </p>
          </div>
          <div>
            <Link to="/scan">
              <Button icon={<PlusCircle className="h-4 w-4" />}>
                New Scan
              </Button>
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Scans"
            value={stats.totalScans}
            icon={<BarChart2 className="h-6 w-6 text-blue-600" />}
            trend="up"
            description="All time scans"
            className="hover:shadow-blue-100 transition-shadow"
          />
          <StatCard
            title="Successful"
            value={stats.successfulScans}
            icon={<FileText className="h-6 w-6 text-emerald-600" />}
            trend="stable"
            description="Completed scans"
            className="hover:shadow-emerald-100 transition-shadow"
          />
          <StatCard
            title="Confidence"
            value={`${Math.round(stats.averageConfidence * 100)}%`}
            icon={<Percent className="h-6 w-6 text-violet-600" />}
            trend={stats.averageConfidence > 0.8 ? "up" : "down"}
            description="Average accuracy"
            className="hover:shadow-violet-100 transition-shadow"
          />
          <StatCard
            title="Last Scan"
            value={stats.recentScans.length > 0
              ? new Date(stats.recentScans[0].createdAt).toLocaleDateString()
              : 'Never'}
            icon={<Clock className="h-6 w-6 text-amber-600" />}
            trend="none"
            description="Most recent activity"
            className="hover:shadow-amber-100 transition-shadow"
          />
        </div>

        {/* Recent Scans Table */}
        <div className="mt-8 overflow-x-auto rounded-lg shadow-sm bg-white p-4">
          {/* Ajouter min-w sur tableau dans RecentScans si possible */}
          <RecentScans scans={stats.recentScans} />
        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;

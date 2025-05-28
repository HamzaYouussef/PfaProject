import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
  const iconBgClasses = {
    blue: 'bg-blue-100',
    green: 'bg-green-100',
    purple: 'bg-purple-100',
    orange: 'bg-orange-100',
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center min-w-0 gap-3">
          
          {/* Icon container */}
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-md flex items-center justify-center ${iconBgClasses[color]}`}
          >
           {icon}
          </div>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            <dt className="text-sm sm:text-base font-medium text-gray-500 truncate">
              {title}
            </dt>
            <dd className="mt-1 sm:mt-2">
              <div className="text-xl sm:text-2xl font-semibold text-gray-900 truncate">
                {value}
              </div>
            </dd>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default StatCard;

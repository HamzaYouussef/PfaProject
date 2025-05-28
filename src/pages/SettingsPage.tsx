import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <AppLayout>
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
        </div>

      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Account Information */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Account Information</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <Input
                  label="Name"
                  value={user?.name || ''}
                  fullWidth
                  readOnly
                />
              </div>
              <div>
                <Input
                  label="Email"
                  value={user?.email || ''}
                  fullWidth
                  readOnly
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                disabled
              >
                Update Profile
              </Button>
            </div>
          </div>
        </div>

        {/* OCR Settings (commented out)
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">OCR Settings</h3>
          </div>
          <div className="p-6 space-y-6">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Minimum Confidence Threshold</h4>
                  <p className="text-sm text-gray-500">Only show results with confidence above this level</p>
                </div>
                <select
                  className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  defaultValue="0.7"
                >
                  <option value="0.5">50%</option>
                  <option value="0.6">60%</option>
                  <option value="0.7">70%</option>
                  <option value="0.8">80%</option>
                  <option value="0.9">90%</option>
                </select>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <div>
                  <h4 className="text-base font-medium text-gray-900">Language</h4>
                  <p className="text-sm text-gray-500">Primary language for text recognition</p>
                </div>
                <select
                  className="mt-1 block w-full sm:w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  defaultValue="en"
                >
                  <option value="en">English</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                  <option value="de">German</option>
                  <option value="it">Italian</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  id="auto-correct"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  defaultChecked
                />
                <label htmlFor="auto-correct" className="ml-2 block text-sm text-gray-900">
                  Enable auto-correction
                </label>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                variant="primary"
                disabled
              >
                Save Settings
              </Button>
            </div>
          </div>
        </div>
        */}
      </div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;

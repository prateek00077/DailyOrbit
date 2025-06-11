import React from 'react';
import SettingsForm from '../components/settings/SettingsForm';

const Settings: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-500 mb-6">Settings</h1>
      <SettingsForm />
    </div>
  );
};

export default Settings;
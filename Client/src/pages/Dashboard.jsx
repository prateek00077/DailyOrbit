import React from "react";

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-indigo-600">Welcome to DailyOrbit, Prateek! 🎯</h2>
        <p className="mt-2 text-gray-600">
          Plan your day, track your progress, and conquer your goals.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-indigo-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-indigo-700">4 Categories</h3>
          <p className="text-sm text-gray-600 mt-1">Manage your goals effectively</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-green-700">12 Tasks</h3>
          <p className="text-sm text-gray-600 mt-1">Tasks across all categories</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold text-yellow-700">68% Completed</h3>
          <p className="text-sm text-gray-600 mt-1">Overall goal completion</p>
        </div>
      </div>

      {/* Progress Map Placeholder */}
      <div className="bg-white p-6 rounded-2xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Your Weekly Progress Map</h3>
        <div className="text-center text-gray-400 italic">
          [Progress Map Chart Will Appear Here]
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

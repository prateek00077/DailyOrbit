import React, { useEffect, useState } from "react";

const Settings = () => {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [notifications, setNotifications] = useState(() => localStorage.getItem("notifications") === "true");
  const [language, setLanguage] = useState(() => localStorage.getItem("language") || "en");
  const [profile, setProfile] = useState({ name: "Prateek Pandey", email: "prateek@example.com" });

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const handleProfileChange = (e) => {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const resetSettings = () => {
    setDarkMode(false);
    setNotifications(true);
    setLanguage("en");
    setProfile({ name: "", email: "" });
    localStorage.clear();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 py-10 flex justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg max-w-2xl w-full p-8 space-y-8">
        <h1 className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 text-center mb-6">Settings</h1>

        {/* Dark Mode */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Dark Mode</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Toggle dark or light theme for better experience.
            </p>
          </div>
          <label htmlFor="darkModeToggle" className="relative inline-flex items-center cursor-pointer">
            <input
              id="darkModeToggle"
              type="checkbox"
              checked={darkMode}
              onChange={() => setDarkMode(!darkMode)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 bg-white dark:bg-gray-800 w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300"></div>
          </label>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200">Notifications</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Enable or disable app notifications.
            </p>
          </div>
          <label htmlFor="notificationsToggle" className="relative inline-flex items-center cursor-pointer">
            <input
              id="notificationsToggle"
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
              className="sr-only peer"
            />
            <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors duration-300"></div>
            <div className="absolute left-1 top-1 bg-white dark:bg-gray-800 w-6 h-6 rounded-full shadow-md transform peer-checked:translate-x-6 transition-transform duration-300"></div>
          </label>
        </div>

        {/* Language Selection */}
        <div>
          <label
            htmlFor="languageSelect"
            className="block text-lg font-semibold text-gray-900 dark:text-gray-200 mb-1"
          >
            Language
          </label>
          <select
            id="languageSelect"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        {/* Profile Info */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-200 mb-3">Profile Info</h2>
          <div className="space-y-4">
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleProfileChange}
              placeholder="Your Name"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleProfileChange}
              placeholder="Your Email"
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Reset Button */}
        <div className="text-center">
          <button
            onClick={resetSettings}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300"
          >
            Reset Preferences
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
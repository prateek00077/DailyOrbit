import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  ListTodo,
  LineChart,
  Settings,
  Menu,
  X,
} from "lucide-react";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, path: "/" },
  { name: "Categories", icon: FolderKanban, path: "/categories" },
  { name: "Progress Map", icon: LineChart, path: "/progress" },
  { name: "Settings", icon: Settings, path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const closeSidebar = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white shadow sticky top-0 z-40">
        <button onClick={toggleSidebar}>
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        <div className="text-lg font-bold text-indigo-600">DailyOrbit 🚀</div>
      </div>

      {/* Desktop Sidebar */}
      <div className="w-64 bg-white border-r shadow-lg hidden md:flex flex-col">
        <div className="h-20 flex items-center justify-center text-2xl font-bold tracking-wide text-indigo-600">
          DailyOrbit 🚀
        </div>
        <nav className="flex-1 px-4">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 hover:bg-indigo-50 text-sm font-medium ${
                location.pathname === path ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" /> {name}
            </Link>
          ))}
        </nav>
      </div>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={closeSidebar}
      />

      {/* Mobile Sidebar Slide-in */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 md:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-bold text-indigo-600">DailyOrbit 🚀</h2>
          <button onClick={closeSidebar}>
            <X className="w-6 h-6 text-gray-700" />
          </button>
        </div>
        <nav className="px-4 pt-4">
          {navItems.map(({ name, icon: Icon, path }) => (
            <Link
              key={name}
              to={path}
              onClick={closeSidebar}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-all duration-200 hover:bg-indigo-50 text-sm font-medium ${
                location.pathname === path ? "bg-indigo-100 text-indigo-700" : "text-gray-700"
              }`}
            >
              <Icon className="w-5 h-5 mr-3" /> {name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

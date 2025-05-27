import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Tasks from "./pages/Tasks";
import ProgressMap from "./pages/ProgressMap";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen w-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
              <Sidebar />
              <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-y-auto p-6">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/tasks/:categoryId" element={<Tasks />} />
                    <Route path="/progress" element={<ProgressMap />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

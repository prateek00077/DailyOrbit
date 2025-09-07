import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Progress from './pages/Progress';
import SharedTasks from './pages/SharedTasks';
import OtpForm from './pages/OtpForm';

function ProtectedRoute() {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}

function PublicRoute() {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
}

function App() {
  return (
    <AppProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes for login/register */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/otp-form" element={<OtpForm/>}/>
            </Route>
            {/* Protected routes for authenticated users */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="categories" element={<Categories />} />
                <Route path="tasks" element={<Tasks />} />
                <Route path="settings" element={<Settings />} />
                <Route path="progress" element={<Progress/>}/>
                <Route path="*" element={<Navigate to="/" replace />} />
                <Route path="/shared-tasks" element={<SharedTasks />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AppProvider>
  );
}

export default App;
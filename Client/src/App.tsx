import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import Tasks from './pages/Tasks';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Progress from './pages/Progress';

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
      <BrowserRouter>
        <Routes>
          {/* Public routes for login/register */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
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
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
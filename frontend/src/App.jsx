import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login     from './pages/Login';
import Register  from './pages/Register';
import Dashboard from './pages/Dashboard';
import Builder   from './pages/Builder';
import Templates from './pages/Templates';

// PrivateRoute: redirect to /login if not logged in
const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" replace />;
};

// PublicRoute: redirect to /dashboard if already logged in
const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  return !user ? children : <Navigate to="/dashboard" replace />;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login"    element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Protected pages */}
      <Route path="/dashboard"   element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/builder/:id" element={<PrivateRoute><Builder /></PrivateRoute>} />
      <Route path="/templates"   element={<PrivateRoute><Templates /></PrivateRoute>} />

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

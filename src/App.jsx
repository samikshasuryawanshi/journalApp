import { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import EntryDetail from './components/EntryDetail';

// Protected routing component
function AppRoutes({ isLoggedIn, onLogin, onLogout }) {
  const location = useLocation();

  return (
    <Routes>
      {/* Root Route */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" replace state={{ from: location }} />
          ) : (
            <Login onLogin={onLogin} />
          )
        }
      />

      {/* Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          isLoggedIn ? (
            <Dashboard onLogout={onLogout} />
          ) : (
            <Navigate to="/" replace state={{ from: location }} />
          )
        }
      />

      {/* Entry Detail Route */}
      <Route
        path="/entry/:id"
        element={
          isLoggedIn ? (
            <EntryDetail />
          ) : (
            <Navigate to="/" replace state={{ from: location }} />
          )
        }
      />

      {/* Fallback Route */}
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} replace />}
      />
    </Routes>
  );
}

// Main App
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('loggedIn') === 'true';
    setIsLoggedIn(stored);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('loggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <AppRoutes
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

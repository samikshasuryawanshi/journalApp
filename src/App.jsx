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

// Separate component to use `useLocation` safely
function AppRoutes({ isLoggedIn, onLogin, onLogout }) {
  const location = useLocation();

  return (
    <Routes>
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
      <Route
        path="*"
        element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} replace />}
      />
    </Routes>
  );
}

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

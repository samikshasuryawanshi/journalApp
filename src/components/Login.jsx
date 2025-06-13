import { useState } from 'react';
import { auth, provider } from '../utils/firebase';
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import ThreadBackground from '../partials/ThreadBackground';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: user.displayName,
        email: user.email,
        picture: user.photoURL,
      }));
      onLogin();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      localStorage.setItem('loggedIn', 'true');
      localStorage.setItem('user', JSON.stringify({
        name: user.displayName || user.email,
        email: user.email,
        picture: user.photoURL || '',
      }));
      onLogin();
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
   <>
    <ThreadBackground />
    <div className="min-h-screen  text-white flex items-center justify-center px-4">
      
      <div className="bg-zinc-900 p-8 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 bg-clip-text text-transparent">
          Login
        </h2>
        <p className='text-sm italic text-zinc-400 mb-4 mt-2 text-center'>
          Your daily space to reflect, express, and grow.
        </p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            className="w-full bg-zinc-800 text-white border border-zinc-700 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-white py-2 rounded font-medium shadow-lg hover:opacity-90 transition"
          >
            Login with Email
          </button>
        </form>

        <div className="my-4 text-gray-400 text-sm text-center">or</div>

        <button
          onClick={handleGoogleLogin}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-white py-2 rounded font-medium shadow-lg hover:opacity-90 transition"
        >
          Login with Google
        </button>

        {error && (
          <p className="mt-4 text-red-400 text-sm text-center">{error}</p>
        )}
      </div>
    </div>
   </>
  );
}

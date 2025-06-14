import React, { useEffect, useRef, useState } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import CalendarView from './CalendarView';
import { getEntries } from '../utils/indexedDB';
import ThreadBackground from '../partials/ThreadBackground';

export default function Dashboard({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const formRef = useRef(null);
  const [user, setUser] = useState(null);

  const refreshEntries = async () => {
    if (!user) return;
    const allEntries = await getEntries(user.email);
    setEntries(allEntries);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
    }
  }, []);

  useEffect(() => {
    if (user) {
      refreshEntries();
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [user]);

  const handleLogout = async () => {
    localStorage.clear();
    setEntries([]);
    setUser(null);

    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    onLogout();
  };

  return (
    <>
      <ThreadBackground />
      <div className="max-w-7xl mx-auto px-4 py-7 font-sans min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 drop-shadow-md mb-5">
              Welcome to Moody
            </h1>

            {user && (
              <div className="flex items-center mt-2 space-x-2">
                <img src={user.picture} alt="User" className="w-10 h-10 rounded-full border" />
                <span className="text-lg font-medium text-zinc-400">{user.name}</span>
                <button onClick={handleLogout} title="Logout" className="ml-2 text-red-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-start mb-4">
          <button
            className={`px-4 py-2 rounded-full text-white font-medium transition ${
              showCalendar ? 'bg-indigo-500' : 'bg-zinc-900 shadow-2xl'
            }`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            {showCalendar ? 'Show List View' : 'Show Calendar View'}
          </button>
        </div>

        {showCalendar ? (
          <CalendarView entries={entries} onDateSelect={setSelectedDate} />
        ) : (
          <>
            <div ref={formRef}>
              <EntryForm
                refreshEntries={refreshEntries}
                selectedDate={selectedDate}
                userEmail={user?.email}
              />
            </div>
            <EntryList entries={entries} refreshEntries={refreshEntries} />
          </>
        )}
      </div>
    </>
  );
}

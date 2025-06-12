import React, { useEffect, useRef, useState } from 'react';
import EntryForm from './EntryForm';
import EntryList from './EntryList';
import CalendarView from './CalendarView';
import { getEntries } from '../utils/indexedDB';

export default function Dashboard({ onLogout }) {
  const [entries, setEntries] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const formRef = useRef(null);
  const [user, setUser] = useState(null);

  const refreshEntries = async () => {
    const allEntries = await getEntries();
    setEntries(allEntries);
  };

  useEffect(() => {
    refreshEntries();
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = async () => {
    // 1. Clear localStorage
    localStorage.clear();

    // 2. Clear all cookies
    document.cookie.split(';').forEach(cookie => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });

    // 3. Delete IndexedDB
    if (window.indexedDB) {
      const DBDeleteRequest = window.indexedDB.deleteDatabase('journalDB');

      DBDeleteRequest.onsuccess = () => {
        console.log('IndexedDB deleted');
      };
      DBDeleteRequest.onerror = () => {
        console.log('Error deleting IndexedDB');
      };
      DBDeleteRequest.onblocked = () => {
        console.log('Delete blocked');
      };
    }

    // 4. Trigger App logout logic
    onLogout();
  };

  return (
    <div className="max-w-full mx-auto p-6 font-sans min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-indigo-600">My Daily Journal</h1>
          {user && (
            <div className="flex items-center mt-2 space-x-2">
              <img
                src={user.picture}
                alt="User"
                className="w-10 h-10 rounded-full border"
              />
              <span className="text-lg font-medium text-gray-700">{user.name}</span>
              <button
                onClick={handleLogout}
                title="Logout"
                className="ml-2 text-gray-600 hover:text-red-500"
              >
                {/* Logout Icon */}
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
            showCalendar ? 'bg-indigo-500' : 'bg-gray-400'
          }`}
          onClick={() => setShowCalendar(!showCalendar)}
        >
          {showCalendar ? 'Show List View' : 'Show Calendar View'}
        </button>
      </div>

      {showCalendar ? (
        <CalendarView entries={entries} />
      ) : (
        <>
          <div ref={formRef}>
            <EntryForm refreshEntries={refreshEntries} />
          </div>
          <EntryList entries={entries} refreshEntries={refreshEntries} />
        </>
      )}
    </div>
  );
}

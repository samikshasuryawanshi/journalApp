import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ThreadBackground from '../partials/ThreadBackground';

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [entry, setEntry] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');

  useEffect(() => {
    const request = indexedDB.open('journalDB');
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('entries', 'readonly');
      const store = tx.objectStore('entries');
      const getReq = store.get(Number(id));
      getReq.onsuccess = () => {
        setEntry(getReq.result);
        setEditedContent(getReq.result?.content || '');
      };
    };
  }, [id]);

  const handleDelete = () => {
    const request = indexedDB.open('journalDB');
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('entries', 'readwrite');
      const store = tx.objectStore('entries');
      store.delete(Number(id));
      tx.oncomplete = () => {
        navigate('/dashboard'); // Redirect to dashboard after delete
      };
    };
  };

  const handleSave = () => {
    const updatedEntry = { ...entry, content: editedContent };
    const request = indexedDB.open('journalDB');
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('entries', 'readwrite');
      const store = tx.objectStore('entries');
      store.put(updatedEntry);
      tx.oncomplete = () => {
        setEntry(updatedEntry);
        setIsEditing(false);
      };
    };
  };

  if (!entry) return <div className="text-white p-4">Loading entry...</div>;

  return (
    <>
      <ThreadBackground />

      <header className="bg-zinc-900 shadow-2xl p-5 flex items-center justify-start gap-5">
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-sm text-indigo-400 hover:text-indigo-300 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h1 className="text-2xl font-bold text-zinc-300">
          🌙 Your Journal Entry
        </h1>
      </header>

      <div className="max-w-3xl mx-auto p-6 rounded-xl shadow-2xl border-zinc-800 text-white mt-6">
        <h2 className="text-3xl font-bold mb-2">{entry.title}</h2>

        <p className="text-sm text-gray-400 mb-4">
          {new Date(entry.date).toLocaleString()}
        </p>

        <p className="text-2xl mb-4">{entry.mood}</p>

        {isEditing ? (
          <textarea
            rows="6"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full p-3 rounded-lg bg-zinc-800 border border-gray-600 text-white resize-none mb-4"
          />
        ) : (
          <p className="whitespace-pre-wrap mb-6">{entry.content}</p>
        )}

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="text-gray-400 hover:underline"
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="text-blue-400 hover:underline"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="text-red-500 hover:underline"
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';

export default function EntryList({ entries, refreshEntries }) {
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editedContent, setEditedContent] = useState('');
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);

  const startEditing = (entry) => {
    setEditingEntryId(entry.id);
    setEditedContent(entry.content);
  };

  const cancelEditing = () => {
    setEditingEntryId(null);
    setEditedContent('');
  };

  const saveEditedEntry = (entry) => {
    const updatedEntry = { ...entry, content: editedContent };

    const request = window.indexedDB.open('journalDB');
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('entries', 'readwrite');
      const store = tx.objectStore('entries');
      store.put(updatedEntry);
      tx.oncomplete = () => {
        refreshEntries();
        db.close();
        setEditingEntryId(null);
        setEditedContent('');
      };
    };
  };

  const handleDelete = (id) => {
    const request = window.indexedDB.open('journalDB');
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction('entries', 'readwrite');
      const store = tx.objectStore('entries');
      store.delete(id);
      tx.oncomplete = () => {
        refreshEntries();
        db.close();
        setConfirmingDeleteId(null);
      };
    };
  };

  return (
    <div className="space-y-6">
      {entries.map((entry) => {
        const isEditing = editingEntryId === entry.id;
        const isConfirmingDelete = confirmingDeleteId === entry.id;

        return (
          <div
            key={entry.id}
            className="bg-transparent rounded-xl shadow-2xl border-2 border-zinc-800 p-6 transition duration-300"
          >
            {/* Title & Mood */}
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {entry.title}
              </h2>
              <span className="text-2xl">{entry.mood}</span>
            </div>

            {/* Date & Time */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {new Date(entry.date).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                weekday: 'short',
              })}{' '}
              at{' '}
              {new Date(entry.date).toLocaleTimeString(undefined, {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </p>

            {/* Content or Editor */}
            {isEditing ? (
              <div className="mb-4">
                <textarea
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white resize-none"
                  rows="5"
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                />
              </div>
            ) : (
              <p className="dark:text-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">
                {entry.content}
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-4 text-sm">
              {isEditing ? (
                <>
                  <button
                    onClick={() => saveEditedEntry(entry)}
                    className="text-green-500 hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="text-gray-400 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : isConfirmingDelete ? (
                <>
                  <span className="text-red-400 font-medium">Are you sure?</span>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="text-red-600 hover:underline"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(null)}
                    className="text-gray-400 hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => startEditing(entry)}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setConfirmingDeleteId(entry.id)}
                    className="text-red-500 hover:underline"
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

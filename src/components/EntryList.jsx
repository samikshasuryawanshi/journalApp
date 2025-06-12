import React from 'react';

export default function EntryList({ entries }) {
  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">{entry.title}</h2>
            <span className="text-2xl">{entry.mood}</span>
          </div>
          <p className="text-sm text-gray-500 mb-2">{new Date(entry.date).toLocaleDateString()}</p>
          <p className="text-gray-700">{entry.content}</p>
        </div>
      ))}
    </div>
  );
}

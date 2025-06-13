import React from 'react';
import { Link } from 'react-router-dom';

export default function EntryList({ entries }) {
  return (
    <div className="space-y-6">
      {entries.map((entry) => (
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

          {/* Content Preview */}
          <p className="dark:text-gray-200 text-gray-700 leading-relaxed whitespace-pre-wrap line-clamp-3 mb-2">
            {entry.content}
          </p>

          {/* Read More Button */}
          <div className="mt-2">
            <Link
              to={`/entry/${entry.id}`}
              className="text-indigo-500 hover:underline text-sm font-medium"
            >
              ...more
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

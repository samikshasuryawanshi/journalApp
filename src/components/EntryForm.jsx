import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { addEntry } from '../utils/indexedDB';

export default function EntryForm({ refreshEntries, selectedDate, userEmail }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const maxChars = 500;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }

    if (!userEmail) {
      setError('User not authenticated.');
      return;
    }

    await addEntry(
      {
        title,
        content,
        mood,
        date: (selectedDate || new Date()).toISOString(),
      },
      userEmail
    );

    setTitle('');
    setContent('');
    setMood('');
    refreshEntries();
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 2500);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl shadow-xl p-8 space-y-6 transition-all duration-300 border border-white/10 hover:shadow-2xl hover:scale-[1.01] mb-4"
      style={{
        background: 'rgba(17, 21, 17, 0.45)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        color: 'white',
      }}
    >
      {/* Mood Picker */}
      <div>
        <label className="block text-sm font-medium mb-2 text-white">Today's Mood</label>
        <div className="relative z-10">
          <div className="max-w-xs rounded-lg border border-gray-600 overflow-hidden">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setMood(emoji.native)}
              theme="dark"
            />
          </div>
          {mood && (
            <div className="mt-2 text-2xl">
              Selected Mood: <span>{mood}</span>
            </div>
          )}
        </div>
      </div>

      {/* Selected Date Display */}
      {selectedDate && (
        <div className="text-sm text-green-400 mb-2">
          📅 Entry for: {selectedDate.toLocaleDateString()} at {selectedDate.toLocaleTimeString()}
        </div>
      )}

      {/* Title Input */}
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Title</label>
        <input
          className="w-full px-4 py-3 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="What's the title?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* Content Input */}
      <div>
        <label className="block text-sm font-medium mb-1 text-white">Entry</label>
        <textarea
          rows="5"
          maxLength={maxChars}
          className="w-full px-4 py-3 rounded-lg border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <div className="text-right text-sm text-gray-400 mt-1">
          {content.length} / {maxChars}
        </div>
      </div>

      {/* Feedback */}
      {error && <p className="text-red-400 font-medium">{error}</p>}
      {submitted && <p className="text-green-400 font-medium">✅ Entry saved!</p>}

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition duration-200"
        >
          Save Entry
        </button>
      </div>
    </form>
  );
}

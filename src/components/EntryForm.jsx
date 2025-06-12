import React, { useState } from 'react';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { addEntry } from '../utils/indexedDB';

export default function EntryForm({ refreshEntries }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mood, setMood] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addEntry({ title, content, mood, date: new Date().toISOString() });
    setTitle('');
    setContent('');
    setMood('');
    refreshEntries();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 mb-6">
      <div className="mb-4">
        <label className="block text-gray-600 mb-1 font-semibold">Today's Mood</label>
        <div className="relative inline-block z-10">
          <div className="max-w-[280px] overflow-auto">
            <Picker
              data={data}
              onEmojiSelect={(emoji) => setMood(emoji.native)}
              theme="light"
            />
          </div>
        </div>
      </div>

      <input
        className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        rows="4"
        className="border border-gray-300 rounded-lg p-3 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Write your entry..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        type="submit"
        className="bg-blue-500 text-white font-semibold px-5 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        Save Entry
      </button>
    </form>
  );
}

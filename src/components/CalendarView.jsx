import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendarCustom.css';

export default function CalendarView({ entries, onDateSelect = () => {} }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const entryDatesSet = new Set(
    entries.map(entry => new Date(entry.date).toISOString().split('T')[0])
  );

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
    setShowCalendar(false);
  };

  const formatDisplayDate = (date) => {
    return date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md text-gray-800 dark:text-white">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => setShowCalendar(!showCalendar)}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition"
        >
          {showCalendar ? 'Hide Calendar' : 'Pick a Date'}
        </button>

        {showCalendar && (
          <button
            onClick={() => setShowCalendar(false)}
            title="Close Calendar"
            className="text-gray-500 hover:text-red-500 ml-2 text-xl"
          >
            &#10005;
          </button>
        )}
      </div>

      {showCalendar && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <Calendar
            onChange={handleDateChange}
            tileClassName={({ date }) => {
              const dateStr = date.toISOString().split('T')[0];

              if (dateStr === todayStr) return 'highlight-today';
              if (entryDatesSet.has(dateStr)) return 'highlight-entry';
              return '';
            }}
          />
        </div>
      )}

      {selectedDate && (
        <div className="mt-6 text-lg font-medium text-center">
          📅 Selected:{' '}
          <span className="text-green-500">
            {formatDisplayDate(selectedDate)}
          </span>
        </div>
      )}
    </div>
  );
}

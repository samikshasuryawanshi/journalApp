import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ entries, onDateSelect = () => {} }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const datesWithEntries = entries.map(e => new Date(e.date).toDateString());

  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
    setShowCalendar(false); // auto-hide
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl shadow-md text-gray-800 dark:text-white">
      {/* Toggle Calendar */}
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
            tileClassName={({ date }) =>
              datesWithEntries.includes(date.toDateString())
                ? 'text-green-500 font-semibold'
                : ''
            }
          />
        </div>
      )}

      {selectedDate && (
        <div className="mt-6 text-lg font-medium text-center">
          📅 Selected:{' '}
          <span className="text-green-500">
            {selectedDate.toLocaleDateString()} at {selectedDate.toLocaleTimeString()}
          </span>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

export default function CalendarView({ entries }) {
  const datesWithEntries = entries.map(e => new Date(e.date).toDateString());

  return (
    <div className="p-4">
      <Calendar tileContent={({ date }) => {
        return datesWithEntries.includes(date.toDateString()) ? <span className="text-green-600">•</span> : null;
      }} />
    </div>
  );
}
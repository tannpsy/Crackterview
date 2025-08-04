import React, { useState } from 'react';

const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 22C4.45 22 3.97917 21.8042 3.5875 21.4125C3.19583 21.0208 3 20.55 3 20V6C3 5.45 3.19583 4.97917 3.5875 4.5875C3.97917 4.19583 4.45 4 5 4H6V2H8V4H16V2H18V4H19C19.55 4 20.0208 4.19583 20.4125 4.5875C20.8042 4.97917 21 5.45 21 6V20C21 20.55 20.8042 21.0208 20.4125 21.4125C20.0208 21.8042 19.55 22 19 22H5ZM5 20H19V10H5V20Z" fill="#49454F"/>
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3C21.0625 3 26 7.9375 26 14C26 20.0625 21.0625 25 15 25C10.3125 25 6.375 22.1875 5.25 18H7.125C8.125 21.1875 11.25 23.5 15 23.5C20.25 23.5 24.5 19.25 24.5 14C24.5 8.75 20.25 4.5 15 4.5C11.75 4.5 9 6.5 7.5 9.375H10.5V10.875H5.25V5.625H6.75V8.25C8.5 5.25 11.5 3 15 3Z" fill="#000"/>
  </svg>
);

export default function FilterCandidate({ onClose, onApplyFilter }) {
  const [filters, setFilters] = useState({
    statusCandidate: {
      all: false,
      reviewed: false,
      unreviewed: false
    },
    sendEmail: {
      all: false,
      sent: false,
      needReview: false
    },
    timeOfApplication: {
      startDate: '',
      endDate: ''
    }
  });

  const handleCheckboxChange = (group, key) => {
    setFilters(prev => ({
      ...prev,
      [group]: {
        ...prev[group],
        [key]: !prev[group][key]
      }
    }));
  };

  const handleDateChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      timeOfApplication: {
        ...prev.timeOfApplication,
        [field]: value
      }
    }));
  };

  const handleResetAll = () => {
    setFilters({
      statusCandidate: { all: false, reviewed: false, unreviewed: false },
      sendEmail: { all: false, sent: false, needReview: false },
      timeOfApplication: { startDate: '', endDate: '' }
    });
  };

  return (
    <div className="p-4 w-[280px] bg-white">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold">Filter</h2> 
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {/* Filter Sections */}
        <div className="space-y-4 mb-4">
        {/* Status */}
        <div>
            <h3 className="text-sm font-semibold mb-2">Status</h3>
            <div className="space-y-1">
            {Object.keys(filters.statusCandidate).map(key => (
                <label key={key} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={filters.statusCandidate[key]}
                    onChange={() => handleCheckboxChange('statusCandidate', key)}
                    className="w-4 h-4 rounded"></input>
                <span className="text-sm capitalize">{key}</span> 
                </label>
            ))}
            </div>
        </div>

        {/* Email Status */}
        <div>
            <h3 className="text-sm font-semibold mb-2">Email Status</h3> 
            <div className="space-y-1">
            {Object.keys(filters.sendEmail).map(key => (
                <label key={key} className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={filters.sendEmail[key]}
                    onChange={() => handleCheckboxChange('sendEmail', key)}
                    className="w-4 h-4 rounded" 
                />
                <span className="text-sm capitalize"> 
                    {key === 'needReview' ? 'Need Review' : key}
                </span>
                </label>
            ))}
            </div>
        </div>

        {/* Date Range */}
        <div>
            <h3 className="text-sm font-semibold mb-2">Date Range</h3>
            <div className="space-y-2">
            <input
                type="date"
                value={filters.timeOfApplication.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full text-sm p-1.5 border rounded"
            />
            <input
                type="date"
                value={filters.timeOfApplication.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full text-sm p-1.5 border rounded" 
            />
            </div>
        </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
        <button
            onClick={() => onApplyFilter(filters)}
            className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700" 
        >
            Apply
        </button>
        <button
            onClick={handleResetAll}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 flex items-center justify-center gap-1"
        >
            <ResetIcon /> Reset
        </button>
        </div>
    </div>
    );
}
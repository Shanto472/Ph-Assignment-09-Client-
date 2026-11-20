import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="relative w-16 h-16 mb-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-200 dark:border-blue-900 animate-ping absolute inset-0 opacity-40" />
        <div className="w-16 h-16 rounded-full border-4 border-blue-600 border-t-transparent animate-spin relative" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white">Loading EquipRent Platform</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">
        Preparing verified fleet availability, rates, and marketplace inventory...
      </p>
    </div>
  );
}

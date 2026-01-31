
import React from 'react';
import { SemesterConfig } from '../types';

interface Props {
  config: SemesterConfig;
  onChange: (config: SemesterConfig) => void;
}

const SemesterSettings: React.FC<Props> = ({ config, onChange }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
        Semester Duration
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Start Date</label>
          <input 
            type="date"
            className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={config.startDate}
            onChange={(e) => onChange({ ...config, startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">End Date</label>
          <input 
            type="date"
            className="w-full bg-gray-50 border-gray-200 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
            value={config.endDate}
            onChange={(e) => onChange({ ...config, endDate: e.target.value })}
          />
        </div>
        <p className="text-[10px] text-gray-400 leading-tight">
          These dates define when the weekly repeating events will start and end in your calendar.
        </p>
      </div>
    </div>
  );
};

export default SemesterSettings;

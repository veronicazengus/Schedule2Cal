
import React from 'react';
import { Course } from '../types';

interface Props {
  courses: Course[];
  onUpdate: (course: Course) => void;
  onDelete: (id: string) => void;
}

const CourseList: React.FC<Props> = ({ courses, onUpdate, onDelete }) => {
  if (courses.length === 0) {
    return (
      <div className="p-12 text-center text-gray-500">
        No courses found in the image. Try a different photo.
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {courses.map(course => (
        <div key={course.id} className="p-6 hover:bg-gray-50 transition group">
          <div className="flex justify-between items-start mb-4">
            <input 
              className="text-lg font-bold text-gray-900 bg-transparent border-none focus:ring-2 focus:ring-blue-100 rounded px-1 w-full mr-4"
              value={course.name}
              onChange={(e) => onUpdate({ ...course, name: e.target.value })}
            />
            <button 
              onClick={() => onDelete(course.id)}
              className="text-gray-400 hover:text-red-500 transition opacity-0 group-hover:opacity-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold w-12 text-gray-400">Days:</span>
              <input 
                className="bg-gray-100 border-none rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-100 w-full"
                value={course.days.join(', ')}
                onChange={(e) => onUpdate({ ...course, days: e.target.value.split(',').map(s => s.trim()) })}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="font-semibold w-12 text-gray-400">Time:</span>
              <div className="flex items-center gap-1">
                <input 
                  type="time"
                  className="bg-gray-100 border-none rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-100"
                  value={course.startTime}
                  onChange={(e) => onUpdate({ ...course, startTime: e.target.value })}
                />
                <span>-</span>
                <input 
                  type="time"
                  className="bg-gray-100 border-none rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-100"
                  value={course.endTime}
                  onChange={(e) => onUpdate({ ...course, endTime: e.target.value })}
                />
              </div>
            </div>
            {course.location && (
              <div className="flex items-center gap-2 text-sm text-gray-600 md:col-span-2">
                <span className="font-semibold w-12 text-gray-400">Place:</span>
                <input 
                  className="bg-gray-100 border-none rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-100 w-full"
                  value={course.location}
                  onChange={(e) => onUpdate({ ...course, location: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CourseList;

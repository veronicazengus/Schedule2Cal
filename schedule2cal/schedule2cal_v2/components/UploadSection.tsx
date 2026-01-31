
import React, { useRef } from 'react';

interface Props {
  onFileSelect: (file: File) => void;
}

const UploadSection: React.FC<Props> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div 
      className="max-w-2xl w-full mx-auto p-12 border-4 border-dashed border-slate-200 rounded-[3rem] bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all cursor-pointer group relative overflow-hidden"
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        accept="image/*,application/pdf" 
        onChange={handleFileChange}
        ref={fileInputRef}
      />
      
      {/* Visual background sparkle effect for demo */}
      <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-100/30 rounded-full blur-3xl group-hover:bg-blue-200/50 transition-all"></div>
      
      <div className="flex flex-col items-center relative z-10">
        <div className="w-24 h-24 bg-white border border-slate-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-blue-50 group-hover:scale-110 transition-transform duration-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800 mb-2">Drop your schedule here</h3>
        <p className="text-slate-400 font-bold mb-8 text-sm uppercase tracking-widest">PDF, PNG or JPEG (Max 10MB)</p>
        <div className="bg-blue-600 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-2xl shadow-blue-200 group-hover:bg-blue-700 transition active:scale-95">
          Select From Computer
        </div>
      </div>
    </div>
  );
};

export default UploadSection;

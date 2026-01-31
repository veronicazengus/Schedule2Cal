
import React, { useState, useCallback } from 'react';
import { Course, SemesterConfig, ExtractionStatus } from './types';
import { extractScheduleFromFile } from './services/geminiService';
import { generateICS, downloadICSFile } from './services/icsService';

// Components
import Header from './components/Header';
import UploadSection from './components/UploadSection';
import CourseList from './components/CourseList';
import SemesterSettings from './components/SemesterSettings';

const MOCK_DATA: Course[] = [
  { id: 'm1', name: 'Computer Science 101: Intro to AI', days: ['Monday', 'Wednesday'], startTime: '10:00', endTime: '11:30', location: 'Hall A, Room 202' },
  { id: 'm2', name: 'UI/UX Design Systems', days: ['Tuesday', 'Thursday'], startTime: '14:00', endTime: '15:30', location: 'Creative Arts Center' },
  { id: 'm3', name: 'Calculus III', days: ['Monday', 'Wednesday', 'Friday'], startTime: '08:00', endTime: '09:00', location: 'Mathematics Annex' },
];

const App: React.FC = () => {
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('');
  const [status, setStatus] = useState<ExtractionStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  
  const today = new Date().toISOString().split('T')[0];
  const fourMonthsLater = new Date();
  fourMonthsLater.setMonth(fourMonthsLater.getMonth() + 4);
  
  const [semester, setSemester] = useState<SemesterConfig>({
    startDate: today,
    endDate: fourMonthsLater.toISOString().split('T')[0]
  });

  const handleFileSelect = useCallback(async (file: File) => {
    const reader = new FileReader();
    const type = file.type;
    setMimeType(type);
    
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      setFilePreview(base64);
      setStatus('processing');
      setError(null);
      
      try {
        const extracted = await extractScheduleFromFile(base64, type);
        setCourses(extracted);
        setStatus('success');
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDemoMode = () => {
    setStatus('processing');
    setTimeout(() => {
      setMimeType('image/sample');
      setFilePreview('https://images.unsplash.com/photo-1506784919141-939e9e8ef50b?auto=format&fit=crop&q=80&w=1000');
      setCourses(MOCK_DATA);
      setStatus('success');
    }, 1500);
  };

  const handleUpdateCourse = (updated: Course) => {
    setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const handleDeleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  const handleDownload = () => {
    const icsContent = generateICS(courses, semester);
    downloadICSFile(icsContent, 'my-schedule.ics');
  };

  const reset = () => {
    setFilePreview(null);
    setStatus('idle');
    setCourses([]);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] pb-20 selection:bg-blue-100">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 mt-12 md:mt-20">
        {status === 'idle' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">New: PDF Support Included</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                Your schedule, <br/><span className="text-blue-600">digitized.</span>
              </h1>
              <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                Upload a photo or PDF of your class timetable. Our AI converts it into calendar events in seconds.
              </p>
              
              <div className="flex flex-col items-center gap-6">
                <UploadSection onFileSelect={handleFileSelect} />
                <button 
                  onClick={handleDemoMode}
                  className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all font-bold text-sm"
                >
                  <span>Or try a live demo</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 border-t border-slate-100 pt-16">
              {[
                { title: 'Privacy First', desc: 'Schedules are processed instantly and never stored on our servers.', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
                { title: 'Universal Export', desc: 'Works with Google Calendar, Apple Calendar, and Microsoft Outlook.', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                { title: 'Zero Typing', desc: 'Detects times, days, and locations automatically even from messy photos.', icon: 'M13 10V3L4 14h7v7l9-11h-7z' }
              ].map((f, i) => (
                <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.icon} />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === 'processing' && (
          <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[3rem] shadow-xl shadow-blue-50 border border-slate-100 animate-in zoom-in duration-500">
            <div className="relative mb-10">
              <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
              <div className="relative animate-spin rounded-full h-24 w-24 border-t-4 border-b-4 border-blue-600"></div>
            </div>
            <h2 className="text-3xl font-black text-slate-900">Decoding Schedule...</h2>
            <p className="text-slate-500 mt-4 text-center max-w-xs font-medium italic">Gemini AI is identifying your courses, locations, and timings.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="lg:w-1/3">
                <div className="sticky top-8 space-y-6">
                   <div className="bg-white p-5 rounded-[2.5rem] shadow-sm border border-slate-200">
                    <h3 className="font-black text-slate-800 mb-4 px-2 uppercase tracking-widest text-xs">Source Preview</h3>
                    {mimeType === 'application/pdf' ? (
                      <div className="w-full aspect-[3/4] rounded-2xl bg-slate-50 flex flex-col items-center justify-center border-2 border-dashed border-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs font-black text-slate-400">PDF DOCUMENT</span>
                      </div>
                    ) : (
                      <div className="rounded-2xl overflow-hidden border border-slate-100">
                        <img src={filePreview || ''} alt="Schedule" className="w-full h-auto object-contain max-h-80 bg-slate-50" />
                      </div>
                    )}
                    <button onClick={reset} className="mt-4 w-full bg-slate-50 text-slate-500 py-3 rounded-2xl font-black text-xs hover:bg-slate-100 transition tracking-widest uppercase">
                      Upload New File
                    </button>
                  </div>
                  <SemesterSettings config={semester} onChange={setSemester} />
                </div>
              </div>

              <div className="lg:w-2/3">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-blue-50/50 border border-slate-200 overflow-hidden">
                  <div className="p-10 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">Calendar Preview</h2>
                      <p className="text-sm font-bold text-blue-600 mt-1 uppercase tracking-widest">Found {courses.length} Weekly Courses</p>
                    </div>
                    <button 
                      onClick={handleDownload}
                      className="w-full sm:w-auto bg-blue-600 text-white px-8 py-4 rounded-[1.5rem] font-black hover:bg-blue-700 transition flex items-center justify-center gap-3 shadow-xl shadow-blue-100 active:scale-95 group"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      Sync All to Calendar
                    </button>
                  </div>
                  <CourseList courses={courses} onUpdate={handleUpdateCourse} onDelete={handleDeleteCourse} />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;

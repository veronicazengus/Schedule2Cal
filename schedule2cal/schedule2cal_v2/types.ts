
export interface Course {
  id: string;
  name: string;
  days: string[]; // e.g., ["Monday", "Wednesday"]
  startTime: string; // "HH:mm" (24h)
  endTime: string; // "HH:mm" (24h)
  location?: string;
}

export interface SemesterConfig {
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
}

export type ExtractionStatus = 'idle' | 'processing' | 'success' | 'error';

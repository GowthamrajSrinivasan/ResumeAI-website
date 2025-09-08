import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  addDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from './useAuth';

export interface SavedJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  extractedSkills: string[];
  searchTerms: string[];
  searchKeywords: string[];
  tags: string[];
  skillsCount: number;
  descriptionLength: number;
  isRemote: boolean;
  salary: number | null;
  applicants: number | null;
  platform: string;
  sourceUrl: string;
  userId: string;
  status: string;
  viewCount: number;
  lastViewed: Timestamp | null;
  savedAt: Timestamp;
  createdAt: Timestamp;
  lastUpdated: Timestamp;
}

// Application status mapping for JobTracker compatibility
const STATUS_MAPPING = {
  'saved': 'applied',
  'applied': 'applied',
  'in_review': 'in_review',
  'phone_screen': 'in_review',
  'interview_scheduled': 'interview_scheduled',
  'technical_interview': 'interview_scheduled',
  'final_interview': 'interview_scheduled',
  'offer_received': 'offer_received',
  'offer_pending': 'offer_received',
  'rejected': 'rejected',
  'declined': 'withdrawn',
  'withdrawn': 'withdrawn'
} as const;

const REVERSE_STATUS_MAPPING = {
  'applied': 'applied',
  'in_review': 'in_review',
  'interview_scheduled': 'interview_scheduled',
  'offer_received': 'offer_received',
  'rejected': 'rejected',
  'withdrawn': 'withdrawn'
} as const;

export function useSavedJobs() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !db) {
      setJobs([]);
      setLoading(false);
      return;
    }

    try {
      // Use the new subcollection structure: users/{userId}/saved_jobs
      const jobsRef = collection(db, 'users', user.uid, 'saved_jobs');
      const q = query(
        jobsRef,
        orderBy('savedAt', 'desc')
      );

      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const jobsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as SavedJob[];
          
          setJobs(jobsData);
          setLoading(false);
          setError(null);
        },
        (err) => {
          console.error('Error fetching saved jobs:', err);
          setError('Failed to load saved jobs');
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error setting up jobs listener:', err);
      setError('Failed to initialize job tracking');
      setLoading(false);
    }
  }, [user]);

  const updateJobStatus = async (jobId: string, newStatus: keyof typeof REVERSE_STATUS_MAPPING) => {
    if (!user || !db) {
      throw new Error('User not authenticated');
    }

    try {
      const jobRef = doc(db, 'users', user.uid, 'saved_jobs', jobId);
      await updateDoc(jobRef, {
        status: REVERSE_STATUS_MAPPING[newStatus],
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating job status:', error);
      throw error;
    }
  };

  const incrementViewCount = async (jobId: string) => {
    if (!user || !db) return;

    try {
      const jobRef = doc(db, 'users', user.uid, 'saved_jobs', jobId);
      const job = jobs.find(j => j.id === jobId);
      if (!job) return;

      await updateDoc(jobRef, {
        viewCount: (job.viewCount || 0) + 1,
        lastViewed: serverTimestamp(),
        lastUpdated: serverTimestamp()
      });
    } catch (error) {
      console.error('Error updating view count:', error);
    }
  };

  const deleteJob = async (jobId: string) => {
    if (!user || !db) {
      throw new Error('User not authenticated');
    }

    try {
      const jobRef = doc(db, 'users', user.uid, 'saved_jobs', jobId);
      await deleteDoc(jobRef);
    } catch (error) {
      console.error('Error deleting job:', error);
      throw error;
    }
  };

  const addJob = async (jobData: Omit<SavedJob, 'id' | 'userId' | 'savedAt' | 'createdAt' | 'lastUpdated' | 'viewCount'>) => {
    if (!user || !db) {
      throw new Error('User not authenticated');
    }

    try {
      const jobsRef = collection(db, 'users', user.uid, 'saved_jobs');
      const newJob = {
        ...jobData,
        userId: user.uid,
        viewCount: 0,
        lastViewed: null,
        savedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        lastUpdated: serverTimestamp()
      };

      const docRef = await addDoc(jobsRef, newJob);
      return docRef.id;
    } catch (error) {
      console.error('Error adding job:', error);
      throw error;
    }
  };

  // Transform saved jobs to JobTracker format
  const getJobsForTracker = () => {
    return jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      salary: job.salary ? `$${Math.round(job.salary / 1000)}k` : undefined,
      applicationDate: job.savedAt?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      status: STATUS_MAPPING[job.status as keyof typeof STATUS_MAPPING] || 'applied',
      description: job.description,
      jobUrl: job.sourceUrl,
      notes: `Platform: ${job.platform}\nSkills: ${job.extractedSkills.join(', ')}\nApplicants: ${job.applicants || 'N/A'}`,
      lastUpdated: job.lastUpdated?.toDate?.()?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
      priority: job.tags.includes('high-priority') ? 'high' as const : 
               job.tags.includes('low-priority') ? 'low' as const : 
               'medium' as const,
      // Additional fields from saved_jobs
      extractedSkills: job.extractedSkills,
      isRemote: job.isRemote,
      platform: job.platform,
      viewCount: job.viewCount,
      applicants: job.applicants,
      tags: job.tags
    }));
  };

  const getJobStatistics = () => {
    const stats = jobs.reduce((acc, job) => {
      const status = STATUS_MAPPING[job.status as keyof typeof STATUS_MAPPING] || 'applied';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: jobs.length,
      applied: stats.applied || 0,
      in_review: stats.in_review || 0,
      interview_scheduled: stats.interview_scheduled || 0,
      offer_received: stats.offer_received || 0,
      rejected: stats.rejected || 0,
      withdrawn: stats.withdrawn || 0
    };
  };

  return {
    jobs,
    loading,
    error,
    updateJobStatus,
    incrementViewCount,
    deleteJob,
    addJob,
    getJobsForTracker,
    getJobStatistics,
    // Statistics
    totalJobs: jobs.length,
    remoteJobs: jobs.filter(job => job.isRemote).length,
    averageSalary: jobs.length > 0 ? 
      Math.round(jobs.filter(job => job.salary).reduce((sum, job) => sum + (job.salary || 0), 0) / jobs.filter(job => job.salary).length) : 0
  };
}
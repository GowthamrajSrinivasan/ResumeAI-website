"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  ExternalLink,
  Clock,
  CheckCircle,
  XCircle,
  User,
  Building2,
  DollarSign,
  MoreHorizontal,
  Edit3,
  Trash2,
  Eye,
  Globe,
  Users,
  TrendingUp,
  Briefcase,
  LogIn,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  LinkIcon,
  Download,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSavedJobs } from '@/hooks/useSavedJobs';
import { isFirebaseConfigured } from '@/lib/firebase';
import AddApplicationForm from './AddApplicationForm';

const statusConfig = {
  applied: { 
    label: 'Applied', 
    color: 'bg-blue-100 text-blue-800', 
    icon: Clock,
    bgColor: 'bg-blue-50'
  },
  in_review: { 
    label: 'In Review', 
    color: 'bg-yellow-100 text-yellow-800', 
    icon: Eye,
    bgColor: 'bg-yellow-50'
  },
  interview_scheduled: { 
    label: 'Interview Scheduled', 
    color: 'bg-purple-100 text-purple-800', 
    icon: Calendar,
    bgColor: 'bg-purple-50'
  },
  offer_received: { 
    label: 'Offer Received', 
    color: 'bg-green-100 text-green-800', 
    icon: CheckCircle,
    bgColor: 'bg-green-50'
  },
  rejected: { 
    label: 'Rejected', 
    color: 'bg-red-100 text-red-800', 
    icon: XCircle,
    bgColor: 'bg-red-50'
  },
  withdrawn: { 
    label: 'Withdrawn', 
    color: 'bg-gray-100 text-gray-800', 
    icon: XCircle,
    bgColor: 'bg-gray-50'
  }
};

const priorityConfig = {
  high: { color: 'border-l-red-500', badge: 'bg-red-100 text-red-800' },
  medium: { color: 'border-l-yellow-500', badge: 'bg-yellow-100 text-yellow-800' },
  low: { color: 'border-l-gray-300', badge: 'bg-gray-100 text-gray-800' }
};

export default function JobTrackerReal() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const {
    jobs: rawJobs,
    loading: jobsLoading,
    error,
    getJobsForTracker,
    getJobStatistics,
    updateJobStatus,
    incrementViewCount,
    deleteJob,
    addJob,
    totalJobs,
    remoteJobs
  } = useSavedJobs();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUrlForm, setShowUrlForm] = useState(false);
  const [jobUrl, setJobUrl] = useState('');
  const [isLoadingUrl, setIsLoadingUrl] = useState(false);
  const [urlFormError, setUrlFormError] = useState('');

  const jobs = getJobsForTracker();
  const stats = getJobStatistics();

  // Debug logging
  console.log('JobTrackerReal - Debug Info:', {
    isFirebaseConfigured,
    user: user?.email || 'null',
    authLoading,
    jobsLoading,
    error,
    jobsCount: jobs.length
  });

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.extractedSkills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    const matchesPlatform = platformFilter === 'all' || job.platform === platformFilter;
    return matchesSearch && matchesStatus && matchesPlatform;
  });

  const platforms = Array.from(new Set(jobs.map(job => job.platform))).filter(Boolean);

  const handleJobClick = async (job: any) => {
    setSelectedJob(job);
    setShowJobDetails(true);
    setIsDescriptionExpanded(false); // Reset description expansion for new job

    // Increment view count
    try {
      await incrementViewCount(job.id);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: string) => {
    try {
      await updateJobStatus(jobId, newStatus as any);
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      try {
        await deleteJob(jobId);
        setShowJobDetails(false);
      } catch (error) {
        console.error('Failed to delete job:', error);
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const formatSalary = (salary: number | null) => {
    if (!salary) return 'Not specified';
    if (salary >= 1000) {
      return `$${Math.round(salary / 1000)}k`;
    }
    return `$${salary}`;
  };

  const extractKeywords = (description: string): string[] => {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'React', 'Angular', 'Vue', 'Node.js', 'Python',
      'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin',
      'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap', 'SQL', 'NoSQL', 'MongoDB',
      'PostgreSQL', 'MySQL', 'Redis', 'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes',
      'Git', 'Jenkins', 'CI/CD', 'REST', 'GraphQL', 'API', 'Microservices',
      'Machine Learning', 'AI', 'Data Science', 'Analytics', 'Tableau', 'Power BI'
    ];

    const text = description.toLowerCase();
    const foundSkills = commonSkills.filter(skill =>
      text.includes(skill.toLowerCase())
    );

    return foundSkills;
  };

  const fetchJobFromUrl = async (url: string) => {
    setIsLoadingUrl(true);
    setUrlFormError('');

    try {
      // Validate URL
      new URL(url);

      // Use the scraping logic from the provided code
      const API_KEY = '7SJQ7CE7BJI03CP24M8OO8X6T3FLTOI1I2YXBLLH336VBSER87P8V6XY4UR3NW7NZ58DG6Q5DVXWID3A';

      // Determine site-specific configuration
      const isNaukri = url.includes('naukri.com');
      const isLinkedIn = url.includes('linkedin.com');

      const params = new URLSearchParams({
        api_key: API_KEY,
        url: url,
        render_js: 'true',
        premium_proxy: isNaukri || isLinkedIn ? 'true' : 'false',
        wait: isNaukri ? '5000' : '3000'
      });

      // Add additional parameters for difficult sites
      if (isNaukri || isLinkedIn) {
        params.append('country_code', 'IN');
        params.append('block_ads', 'true');
        params.append('stealth_proxy', 'true');
      }

      const response = await fetch(`https://app.scrapingbee.com/api/v1/?${params}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch job data: ${response.status}`);
      }

      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      // Extract job information using comprehensive selectors
      const extractJobInfo = () => {
        const selectors = {
          title: [
            // Naukri specific selectors
            '.jd-header-title', '.job-title', '.jobTitle',
            '.jd-job-title', '.detail-header h1', '.jd-header h1',
            // Generic selectors
            'h1', '.title', '[class*="title"]', '[class*="Title"]',
            '[data-testid="job-title"]', '.job-header h1', '.posting-headline h2',
            '[class*="job-title"]', '[class*="jobTitle"]',
            // Broader selectors
            'h1[class*="title"]', 'h2[class*="title"]', '.header h1', '.main-title'
          ],
          company: [
            // Naukri specific
            '.jd-header-comp-name', '.company-name', '.companyName',
            '.jd-company-name', '.detail-header .company',
            // Generic selectors
            '[class*="company"]', '[class*="Company"]',
            '[data-testid="company"]', '.employer-name', '.job-company',
            '.comp-name', '.company-title'
          ],
          location: [
            // Naukri specific
            '.jd-header-location', '.location', '.job-location',
            '.jd-location', '.detail-header .location',
            // Generic selectors
            '[class*="location"]', '[class*="Location"]',
            '[data-testid="location"]', '.job-location-text',
            '.loc', '.job-loc'
          ],
          description: [
            // Naukri specific
            '.jd-desc', '.job-description', '.description', '.job-details',
            '.jd-content', '.detail-content',
            // Generic selectors
            '[class*="description"]', '[class*="Description"]',
            '.posting-description', '.job-content', '.job-desc',
            '.content', '.main-content', '.body'
          ],
          salary: [
            // Naukri specific
            '.jd-header-salary', '.salary', '.compensation',
            '.jd-salary', '.detail-header .salary',
            // Generic selectors
            '[class*="salary"]', '[class*="Salary"]',
            '[class*="compensation"]', '.pay-range', '.package'
          ]
        };

        const extractText = (selectors: string[], fieldName: string) => {
          console.log(`\nTrying to extract ${fieldName}...`);
          for (const selector of selectors) {
            const element = doc.querySelector(selector);
            if (element && element.textContent?.trim()) {
              const text = element.textContent.trim().replace(/\s+/g, ' ');
              console.log(`Found ${fieldName} with selector "${selector}": "${text}"`);
              return text;
            } else {
              console.log(`No match for selector "${selector}"`);
            }
          }
          console.log(`No ${fieldName} found with any selector`);
          return '';
        };

        // Log all available h1 and title elements for debugging
        console.log('\n=== DEBUGGING JOB EXTRACTION ===');
        console.log('Available H1 elements:');
        doc.querySelectorAll('h1').forEach((h1, index) => {
          console.log(`H1 ${index}: class="${h1.className}" text="${h1.textContent?.trim()}"`);
        });

        console.log('\nElements with "title" in class:');
        doc.querySelectorAll('[class*="title"], [class*="Title"]').forEach((el, index) => {
          console.log(`Title ${index}: ${el.tagName} class="${el.className}" text="${el.textContent?.trim()}"`);
        });

        return {
          title: extractText(selectors.title, 'title'),
          company: extractText(selectors.company, 'company'),
          location: extractText(selectors.location, 'location'),
          description: extractText(selectors.description, 'description'),
          salary: extractText(selectors.salary, 'salary')
        };
      };

      const jobInfo = extractJobInfo();

      // Fallback: Try to extract title from page title if no title found
      if (!jobInfo.title) {
        console.log('\nTrying fallback methods...');
        const pageTitle = doc.querySelector('title')?.textContent;
        console.log('Page title:', pageTitle);

        if (pageTitle) {
          // Extract job title from page title (common pattern: "Job Title - Company - Naukri.com")
          const titleParts = pageTitle.split(' - ');
          if (titleParts.length > 0) {
            const extractedTitle = titleParts[0].trim();
            if (extractedTitle && !extractedTitle.toLowerCase().includes('naukri') && extractedTitle.length > 5) {
              jobInfo.title = extractedTitle;
              console.log('Extracted title from page title:', extractedTitle);
            }
          }
        }
      }

      // Final check
      if (!jobInfo.title) {
        console.log('Final attempt: checking all text content for patterns...');

        // Try to find text that looks like a job title
        const allText = doc.body?.textContent || '';
        const lines = allText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

        for (const line of lines.slice(0, 10)) { // Check first 10 lines
          if (line.length > 10 && line.length < 100 &&
              !line.toLowerCase().includes('naukri') &&
              !line.toLowerCase().includes('login') &&
              !line.toLowerCase().includes('register') &&
              /[a-zA-Z]/.test(line)) {
            jobInfo.title = line;
            console.log('Extracted title from text content:', line);
            break;
          }
        }
      }

      if (!jobInfo.title) {
        // Log the first part of HTML for debugging
        console.log('HTML preview (first 1000 chars):', html.substring(0, 1000));
        throw new Error('Could not extract job title from the provided URL. The page might be using anti-bot protection or have a different structure.');
      }

      const keywords = extractKeywords(jobInfo.description);

      // Create job object compatible with the SavedJob interface
      const newJobData = {
        title: jobInfo.title,
        company: jobInfo.company || 'Unknown Company',
        location: jobInfo.location || 'Location not specified',
        description: jobInfo.description || 'No description available',
        extractedSkills: keywords,
        searchTerms: keywords, // Use extracted keywords as search terms
        searchKeywords: keywords, // Use extracted keywords as search keywords
        tags: ['manual-entry', 'url-imported'],
        skillsCount: keywords.length,
        descriptionLength: jobInfo.description ? jobInfo.description.length : 0,
        isRemote: jobInfo.location ? jobInfo.location.toLowerCase().includes('remote') : false,
        salary: null, // Could be parsed from jobInfo.salary if needed
        applicants: null,
        platform: 'Manual Entry',
        sourceUrl: url,
        status: 'applied', // Default status for manually added jobs
        lastViewed: null // Required by SavedJob interface
      };

      console.log('Saving job data:', newJobData);

      // Save the job using the existing hook function
      try {
        const jobId = await addJob(newJobData);
        console.log('Job saved successfully with ID:', jobId);

        setJobUrl('');
        setShowUrlForm(false);

        // You could add a success notification here if needed
        // For now, the job will automatically appear in the list due to the real-time listener

      } catch (saveError) {
        console.error('Error saving job:', saveError);
        setUrlFormError('Successfully extracted job data, but failed to save to database. Please try again.');
        return; // Don't close the form if saving failed
      }

    } catch (error) {
      console.error('Error fetching job:', error);
      setUrlFormError(error instanceof Error ? error.message : 'Failed to fetch job information');
    } finally {
      setIsLoadingUrl(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (jobUrl.trim()) {
      fetchJobFromUrl(jobUrl.trim());
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="bg-blue-50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <Briefcase className="h-12 w-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Track Your Job Applications</h3>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Sign in to view and manage your saved jobs from LinkedIn. Track application status, add notes, and stay organized in your job search.
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>View all your saved LinkedIn jobs</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Track application status and progress</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Add personal notes and priorities</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>Get insights and analytics</span>
            </div>
          </div>

          <button
            onClick={() => router.push('/login?returnTo=' + encodeURIComponent('/jobs'))}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 w-full group"
          >
            <LogIn className="h-5 w-5" />
            <span>Sign In to Get Started</span>
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <p className="text-sm text-gray-500 mt-4">
            Don't have an account? You can create one on the login page.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md mx-auto p-6">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading jobs</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          {error.includes('Firebase not configured') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <p className="text-sm text-yellow-800 mb-2">
                <strong>Firebase Configuration Missing:</strong>
              </p>
              <p className="text-xs text-yellow-700">
                The Firebase environment variables are not configured. Please check your .env file 
                or contact support for assistance.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600">Track and manage your saved jobs</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={() => setShowUrlForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <LinkIcon className="h-4 w-4" />
            <span>Add from URL</span>
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Application</span>
          </button>
        </div>
      </div>

      {jobsLoading ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Saved</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
              <div className="text-sm text-blue-600">Applied</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <div className="text-2xl font-bold text-yellow-600">{stats.in_review}</div>
              <div className="text-sm text-yellow-600">In Review</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <div className="text-2xl font-bold text-purple-600">{stats.interview_scheduled}</div>
              <div className="text-sm text-purple-600">Interviews</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-600">{stats.offer_received}</div>
              <div className="text-sm text-green-600">Offers</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Globe className="h-8 w-8 text-blue-600" />
                <div>
                  <div className="text-lg font-semibold text-blue-900">{remoteJobs} Remote Jobs</div>
                  <div className="text-sm text-blue-700">Out of {totalJobs} total</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-8 w-8 text-green-600" />
                <div>
                  <div className="text-lg font-semibold text-green-900">{Math.round((stats.interview_scheduled + stats.offer_received) / Math.max(stats.total, 1) * 100)}% Response Rate</div>
                  <div className="text-sm text-green-700">Interviews + Offers</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div>
                  <div className="text-lg font-semibold text-purple-900">{platforms.length} Platforms</div>
                  <div className="text-sm text-purple-700">Job sources</div>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search jobs, companies, skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="applied">Applied</option>
                <option value="in_review">In Review</option>
                <option value="interview_scheduled">Interview Scheduled</option>
                <option value="offer_received">Offer Received</option>
                <option value="rejected">Rejected</option>
                <option value="withdrawn">Withdrawn</option>
              </select>
            </div>
            {platforms.length > 0 && (
              <div className="relative">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Platforms</option>
                  {platforms.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Job Cards */}
          <div className="grid gap-4">
            {filteredJobs.map((job) => {
              const StatusIcon = statusConfig[job.status as keyof typeof statusConfig].icon;
              return (
                <div
                  key={job.id}
                  className={`bg-white border-l-4 ${priorityConfig[job.priority].color} rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => handleJobClick(job)}
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityConfig[job.priority].badge}`}>
                            {job.priority.toUpperCase()}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {job.platform}
                          </span>
                          {job.isRemote && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              Remote
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1">
                            <Building2 className="h-4 w-4" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          {job.salary && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                          )}
                          {job.applicants && (
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{job.applicants} applicants</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[job.status as keyof typeof statusConfig].color}`}>
                          <StatusIcon className="h-4 w-4" />
                          <span>{statusConfig[job.status as keyof typeof statusConfig].label}</span>
                        </div>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {job.extractedSkills.slice(0, 6).map((skill, index) => (
                          <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            {skill}
                          </span>
                        ))}
                        {job.extractedSkills.length > 6 && (
                          <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                            +{job.extractedSkills.length - 6} more
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Saved {formatDate(job.applicationDate)}</span>
                        </div>
                        {job.viewCount > 0 && (
                          <div className="flex items-center space-x-1">
                            <Eye className="h-4 w-4" />
                            <span>{job.viewCount} views</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>Updated {formatDate(job.lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredJobs.length === 0 && !jobsLoading && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">
                {jobs.length === 0 
                  ? "You haven't saved any jobs yet. Start saving jobs from LinkedIn to track them here!"
                  : "Try adjusting your search or filter criteria"}
              </p>
            </div>
          )}
        </>
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowJobDetails(false)}
        >
          <div
            className="bg-white rounded-xl w-full min-w-[280px] max-w-[65vw] sm:max-w-lg h-[80vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Sticky Header */}
            <div className="sticky top-0 flex-shrink-0 p-4 sm:p-6 border-b border-gray-200 bg-white z-10">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 leading-tight">
                    {selectedJob.title}
                  </h2>
                  <div className="flex items-center space-x-3 text-sm text-gray-600 flex-wrap gap-2">
                    <div className="flex items-center space-x-1 min-w-0">
                      <Building2 className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{selectedJob.company}</span>
                    </div>
                    <div className="flex items-center space-x-1 min-w-0">
                      <MapPin className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{selectedJob.location}</span>
                    </div>
                    <span className="badge-blue flex-shrink-0">
                      {selectedJob.platform}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobDetails(false)}
                  className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 pr-2 sm:pr-4 scrollbar-visible min-h-0" style={{ scrollbarGutter: 'stable' }}>
              {/* ... your content (status, description, skills, notes, metadata) ... */}
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 flex-shrink-0 p-3 sm:p-4 border-t border-gray-200 bg-gray-50 z-10">
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {selectedJob.jobUrl && (
                  <button
                    onClick={() => window.open(selectedJob.jobUrl, '_blank')}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>View Original</span>
                  </button>
                )}

                <select
                  value={selectedJob.status}
                  onChange={(e) => {
                    handleStatusChange(selectedJob.id, e.target.value);
                    setSelectedJob({ ...selectedJob, status: e.target.value });
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="applied">Applied</option>
                  <option value="in_review">In Review</option>
                  <option value="interview_scheduled">Interview Scheduled</option>
                  <option value="offer_received">Offer Received</option>
                  <option value="rejected">Rejected</option>
                  <option value="withdrawn">Withdrawn</option>
                </select>

                <button
                  onClick={() => handleDeleteJob(selectedJob.id)}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* URL Form Modal */}
      {showUrlForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add Job from URL</h2>
                <button
                  onClick={() => {
                    setShowUrlForm(false);
                    setJobUrl('');
                    setUrlFormError('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <form onSubmit={handleUrlSubmit} className="space-y-4">
                <div>
                  <label htmlFor="jobUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    Job Posting URL
                  </label>
                  <input
                    type="url"
                    id="jobUrl"
                    value={jobUrl}
                    onChange={(e) => setJobUrl(e.target.value)}
                    placeholder="https://example.com/job-posting"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                    disabled={isLoadingUrl}
                  />
                </div>

                {urlFormError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{urlFormError}</p>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <strong>Supported sites:</strong> Naukri, Indeed, LinkedIn, Monster India,
                    TimesJobs, Shine, FreshersWorld, and many other job portals.
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    disabled={isLoadingUrl || !jobUrl.trim()}
                    className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoadingUrl ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Fetching Job...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>Fetch Job Details</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowUrlForm(false);
                      setJobUrl('');
                      setUrlFormError('');
                    }}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    disabled={isLoadingUrl}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Application Form */}
      <AddApplicationForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          // Form will handle the success message and auto-close
          console.log('Job application added successfully');
        }}
      />
    </div>
  );
}
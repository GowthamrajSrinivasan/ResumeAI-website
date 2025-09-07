"use client";

import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useSavedJobs } from '@/hooks/useSavedJobs';

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
  const { 
    jobs: rawJobs, 
    loading: jobsLoading, 
    error, 
    getJobsForTracker, 
    getJobStatistics,
    updateJobStatus,
    incrementViewCount,
    deleteJob,
    totalJobs,
    remoteJobs
  } = useSavedJobs();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const jobs = getJobsForTracker();
  const stats = getJobStatistics();

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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign in to track jobs</h3>
          <p className="text-gray-600">Please sign in to view and manage your job applications.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error loading jobs</h3>
          <p className="text-gray-600">{error}</p>
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
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </button>
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Building2 className="h-4 w-4" />
                      <span>{selectedJob.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{selectedJob.location}</span>
                    </div>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      {selectedJob.platform}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowJobDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${statusConfig[selectedJob.status as keyof typeof statusConfig].color}`}>
                    {React.createElement(statusConfig[selectedJob.status as keyof typeof statusConfig].icon, { className: "h-4 w-4" })}
                    <span className="font-medium">{statusConfig[selectedJob.status as keyof typeof statusConfig].label}</span>
                  </div>
                  {selectedJob.salary && (
                    <div className="flex items-center space-x-1 text-lg font-semibold text-green-600">
                      <DollarSign className="h-5 w-5" />
                      <span>{selectedJob.salary}</span>
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                  <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.extractedSkills.map((skill: string, index: number) => (
                      <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {selectedJob.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Additional Info</h3>
                    <p className="text-gray-600 whitespace-pre-line">{selectedJob.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Saved Date:</span>
                    <p className="text-gray-600">{formatDate(selectedJob.applicationDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">{formatDate(selectedJob.lastUpdated)}</p>
                  </div>
                  {selectedJob.applicants && (
                    <div>
                      <span className="font-medium text-gray-700">Applicants:</span>
                      <p className="text-gray-600">{selectedJob.applicants}</p>
                    </div>
                  )}
                  <div>
                    <span className="font-medium text-gray-700">Views:</span>
                    <p className="text-gray-600">{selectedJob.viewCount || 0}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  {selectedJob.jobUrl && (
                    <button 
                      onClick={() => window.open(selectedJob.jobUrl, '_blank')}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span>View Original Job</span>
                    </button>
                  )}
                  
                  <select
                    value={selectedJob.status}
                    onChange={(e) => {
                      handleStatusChange(selectedJob.id, e.target.value);
                      setSelectedJob({...selectedJob, status: e.target.value});
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
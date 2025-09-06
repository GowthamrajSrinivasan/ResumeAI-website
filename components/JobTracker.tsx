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
  Eye
} from 'lucide-react';

interface JobApplication {
  id: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  applicationDate: string;
  status: 'applied' | 'in_review' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'withdrawn';
  description: string;
  jobUrl?: string;
  notes?: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high';
}

const sampleJobs: JobApplication[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salary: '$120k - $150k',
    applicationDate: '2024-03-15',
    status: 'interview_scheduled',
    description: 'We are looking for a Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing features using React, TypeScript, and modern web technologies.',
    jobUrl: 'https://example.com/job/1',
    notes: 'Had initial phone screen. Technical interview scheduled for next week.',
    lastUpdated: '2024-03-18',
    priority: 'high'
  },
  {
    id: '2',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    location: 'Remote',
    salary: '$90k - $130k',
    applicationDate: '2024-03-10',
    status: 'in_review',
    description: 'Join our fast-growing startup as a Full Stack Engineer. Work with Node.js, React, and AWS to build scalable applications.',
    jobUrl: 'https://example.com/job/2',
    notes: 'Submitted portfolio and cover letter.',
    lastUpdated: '2024-03-12',
    priority: 'medium'
  },
  {
    id: '3',
    title: 'Product Manager',
    company: 'InnovateLabs',
    location: 'New York, NY',
    salary: '$110k - $140k',
    applicationDate: '2024-03-08',
    status: 'offer_received',
    description: 'Lead product strategy and work cross-functionally with engineering and design teams to deliver exceptional user experiences.',
    jobUrl: 'https://example.com/job/3',
    notes: 'Received verbal offer. Waiting for written offer letter.',
    lastUpdated: '2024-03-20',
    priority: 'high'
  },
  {
    id: '4',
    title: 'UX Designer',
    company: 'DesignHub',
    location: 'Austin, TX',
    salary: '$75k - $95k',
    applicationDate: '2024-03-05',
    status: 'rejected',
    description: 'Create intuitive and engaging user experiences for our suite of design tools.',
    lastUpdated: '2024-03-14',
    priority: 'low'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudTech Solutions',
    location: 'Seattle, WA',
    salary: '$100k - $130k',
    applicationDate: '2024-03-12',
    status: 'applied',
    description: 'Manage cloud infrastructure, CI/CD pipelines, and ensure high availability of our services.',
    jobUrl: 'https://example.com/job/5',
    lastUpdated: '2024-03-12',
    priority: 'medium'
  }
];

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

export default function JobTracker() {
  const [jobs, setJobs] = useState<JobApplication[]>(sampleJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusStats = () => {
    const stats = jobs.reduce((acc, job) => {
      acc[job.status] = (acc[job.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    return stats;
  };

  const stats = getStatusStats();

  const handleJobClick = (job: JobApplication) => {
    setSelectedJob(job);
    setShowJobDetails(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600">Track and manage your job applications</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          <Plus className="h-4 w-4" />
          <span>Add Application</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
          <div className="text-sm text-gray-600">Total Applications</div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="text-2xl font-bold text-blue-600">{stats.applied || 0}</div>
          <div className="text-sm text-blue-600">Applied</div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="text-2xl font-bold text-yellow-600">{stats.in_review || 0}</div>
          <div className="text-sm text-yellow-600">In Review</div>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
          <div className="text-2xl font-bold text-purple-600">{stats.interview_scheduled || 0}</div>
          <div className="text-sm text-purple-600">Interviews</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="text-2xl font-bold text-green-600">{stats.offer_received || 0}</div>
          <div className="text-sm text-green-600">Offers</div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <div className="text-2xl font-bold text-red-600">{stats.rejected || 0}</div>
          <div className="text-sm text-red-600">Rejected</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search jobs, companies, or locations..."
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
      </div>

      {/* Job Cards */}
      <div className="grid gap-4">
        {filteredJobs.map((job) => {
          const StatusIcon = statusConfig[job.status].icon;
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
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${statusConfig[job.status].color}`}>
                      <StatusIcon className="h-4 w-4" />
                      <span>{statusConfig[job.status].label}</span>
                    </div>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>
                
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Applied {formatDate(job.applicationDate)}</span>
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

      {filteredJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Job Details Modal */}
      {showJobDetails && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
                  <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${statusConfig[selectedJob.status].color}`}>
                    {React.createElement(statusConfig[selectedJob.status].icon, { className: "h-4 w-4" })}
                    <span className="font-medium">{statusConfig[selectedJob.status].label}</span>
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

                {selectedJob.notes && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Notes</h3>
                    <p className="text-gray-600">{selectedJob.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Application Date:</span>
                    <p className="text-gray-600">{formatDate(selectedJob.applicationDate)}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Last Updated:</span>
                    <p className="text-gray-600">{formatDate(selectedJob.lastUpdated)}</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  {selectedJob.jobUrl && (
                    <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      <ExternalLink className="h-4 w-4" />
                      <span>View Job Posting</span>
                    </button>
                  )}
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Edit3 className="h-4 w-4" />
                    <span>Edit</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
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
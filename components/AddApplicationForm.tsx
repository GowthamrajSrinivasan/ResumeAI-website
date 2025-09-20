"use client";

import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  User,
  FileText,
  Tag,
  Globe,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Users
} from 'lucide-react';
import { useSavedJobs } from '@/hooks/useSavedJobs';

interface AddApplicationFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FormData {
  title: string;
  company: string;
  location: string;
  description: string;
  salary: string;
  sourceUrl: string;
  platform: string;
  applicants: string;
  isRemote: boolean;
  status: string;
  priority: 'low' | 'medium' | 'high';
  skills: string;
  notes: string;
}

const initialFormData: FormData = {
  title: '',
  company: '',
  location: '',
  description: '',
  salary: '',
  sourceUrl: '',
  platform: '',
  applicants: '',
  isRemote: false,
  status: 'applied',
  priority: 'medium',
  skills: '',
  notes: ''
};

const statusOptions = [
  { value: 'applied', label: 'Applied' },
  { value: 'in_review', label: 'In Review' },
  { value: 'interview_scheduled', label: 'Interview Scheduled' },
  { value: 'offer_received', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' }
];

const platformOptions = [
  'LinkedIn',
  'Indeed',
  'Glassdoor',
  'AngelList',
  'Stack Overflow Jobs',
  'Dice',
  'Monster',
  'CareerBuilder',
  'ZipRecruiter',
  'Company Website',
  'Referral',
  'Other'
];

export default function AddApplicationForm({ isOpen, onClose, onSuccess }: AddApplicationFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const { addJob } = useSavedJobs();

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Required fields
    if (!formData.title.trim()) {
      newErrors.title = 'Job title is required';
    }
    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Job description is required';
    }
    if (!formData.platform.trim()) {
      newErrors.platform = 'Platform/Source is required';
    }

    // Validate salary if provided
    if (formData.salary && isNaN(Number(formData.salary.replace(/[^\d]/g, '')))) {
      newErrors.salary = 'Please enter a valid salary amount';
    }

    // Validate applicants if provided
    if (formData.applicants && isNaN(Number(formData.applicants))) {
      newErrors.applicants = 'Please enter a valid number of applicants';
    }

    // Validate URL if provided
    if (formData.sourceUrl && !isValidUrl(formData.sourceUrl)) {
      newErrors.sourceUrl = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  const parseSkills = (skillsString: string): string[] => {
    return skillsString
      .split(/[,\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0);
  };

  const parseSalary = (salaryString: string): number | null => {
    if (!salaryString.trim()) return null;

    const cleanSalary = salaryString.replace(/[^\d]/g, '');
    const numericSalary = Number(cleanSalary);

    if (isNaN(numericSalary)) return null;

    // If the number is less than 1000, assume it's in thousands (e.g., "120" = 120k)
    if (numericSalary < 1000) {
      return numericSalary * 1000;
    }

    return numericSalary;
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const extractedSkills = parseSkills(formData.skills);
      const numericSalary = parseSalary(formData.salary);
      const numericApplicants = formData.applicants ? Number(formData.applicants) : null;

      const jobData = {
        title: formData.title.trim(),
        company: formData.company.trim(),
        location: formData.location.trim(),
        description: formData.description.trim(),
        extractedSkills,
        searchTerms: [formData.title, formData.company, ...extractedSkills],
        searchKeywords: extractedSkills,
        tags: formData.priority === 'high' ? ['high-priority'] :
              formData.priority === 'low' ? ['low-priority'] : [],
        skillsCount: extractedSkills.length,
        descriptionLength: formData.description.length,
        isRemote: formData.isRemote,
        salary: numericSalary,
        applicants: numericApplicants,
        platform: formData.platform,
        sourceUrl: formData.sourceUrl.trim() || '',
        status: formData.status,
        lastViewed: null
      };

      await addJob(jobData);

      setSubmitStatus('success');
      setFormData(initialFormData);

      // Call success callback and close form after a short delay
      setTimeout(() => {
        onSuccess?.();
        onClose();
        setSubmitStatus('idle');
      }, 1500);

    } catch (error) {
      console.error('Error adding job application:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData(initialFormData);
      setErrors({});
      setSubmitStatus('idle');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Add Job Application</h2>
                <p className="text-gray-600 mt-1">Track a new job opportunity</p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-6">
            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-green-800 font-medium">Job application added successfully!</p>
                  <p className="text-green-600 text-sm">Redirecting...</p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-red-800 font-medium">Failed to add job application</p>
                  <p className="text-red-600 text-sm">Please try again or contact support if the problem persists.</p>
                </div>
              </div>
            )}

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Briefcase className="h-4 w-4 inline mr-1" />
                  Job Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.title ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. Senior Frontend Developer"
                  disabled={isSubmitting}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="h-4 w-4 inline mr-1" />
                  Company *
                </label>
                <input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.company ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. TechCorp Inc."
                  disabled={isSubmitting}
                />
                {errors.company && <p className="text-red-600 text-sm mt-1">{errors.company}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="h-4 w-4 inline mr-1" />
                  Location *
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.location ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. San Francisco, CA or Remote"
                  disabled={isSubmitting}
                />
                {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4 inline mr-1" />
                  Platform/Source *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => handleInputChange('platform', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.platform ? 'border-red-300' : 'border-gray-300'
                  }`}
                  disabled={isSubmitting}
                >
                  <option value="">Select platform...</option>
                  {platformOptions.map(platform => (
                    <option key={platform} value={platform}>{platform}</option>
                  ))}
                </select>
                {errors.platform && <p className="text-red-600 text-sm mt-1">{errors.platform}</p>}
              </div>
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FileText className="h-4 w-4 inline mr-1" />
                Job Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.description ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Describe the role, responsibilities, and requirements..."
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  Salary (Optional)
                </label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.salary ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. 120000 or 120k"
                  disabled={isSubmitting}
                />
                {errors.salary && <p className="text-red-600 text-sm mt-1">{errors.salary}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="h-4 w-4 inline mr-1" />
                  Applicants (Optional)
                </label>
                <input
                  type="number"
                  value={formData.applicants}
                  onChange={(e) => handleInputChange('applicants', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.applicants ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="e.g. 150"
                  disabled={isSubmitting}
                />
                {errors.applicants && <p className="text-red-600 text-sm mt-1">{errors.applicants}</p>}
              </div>
            </div>

            {/* Job URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ExternalLink className="h-4 w-4 inline mr-1" />
                Job URL (Optional)
              </label>
              <input
                type="url"
                value={formData.sourceUrl}
                onChange={(e) => handleInputChange('sourceUrl', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.sourceUrl ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/job-posting"
                disabled={isSubmitting}
              />
              {errors.sourceUrl && <p className="text-red-600 text-sm mt-1">{errors.sourceUrl}</p>}
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Tag className="h-4 w-4 inline mr-1" />
                Required Skills (Optional)
              </label>
              <textarea
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter skills separated by commas (e.g. React, TypeScript, Node.js)"
                disabled={isSubmitting}
              />
              <p className="text-gray-500 text-sm mt-1">Separate multiple skills with commas</p>
            </div>

            {/* Status and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  {statusOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <input
                  type="checkbox"
                  id="isRemote"
                  checked={formData.isRemote}
                  onChange={(e) => handleInputChange('isRemote', e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <label htmlFor="isRemote" className="text-sm font-medium text-gray-700">
                  Remote Position
                </label>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add any additional notes about this application..."
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Adding...</span>
                  </>
                ) : (
                  <span>Add Application</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
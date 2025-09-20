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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl h-[90vh] flex flex-col">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-xl z-10">
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
  
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ... all your form fields here ... */}
          </div>
  
          {/* Footer */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-6 rounded-b-xl z-10">
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
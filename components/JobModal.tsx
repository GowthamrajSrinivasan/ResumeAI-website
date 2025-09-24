"use client"

import React, { useState } from "react"
import {
  MapPin,
  Calendar,
  DollarSign,
  Building2,
  Clock,
  ExternalLink,
  Bookmark,
  BookmarkCheck,
  Users,
  TrendingUp,
  Briefcase,
  Share2,
  Flag,
  ChevronLeft,
  Globe,
  Mail,
  Phone,
  Award,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit3,
  Trash2
} from "lucide-react"
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalFooter
} from "@/components/ui/modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface JobModalProps {
  isOpen: boolean
  onClose: () => void
  job: {
    id?: string
    title: string
    company: string
    location: string
    salary?: string
    salaryRange?: {
      min?: number
      max?: number
      currency?: string
    }
    type?: "Full-time" | "Part-time" | "Contract" | "Internship"
    experience?: string
    skills?: string[]
    description?: string
    requirements?: string[]
    responsibilities?: string[]
    benefits?: string[]
    postedDate?: string
    applicationDeadline?: string
    applicationDate?: string
    status?: 'applied' | 'in_review' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'withdrawn'
    priority?: 'low' | 'medium' | 'high'
    isBookmarked?: boolean
    companyLogo?: string
    applicants?: number
    isUrgent?: boolean
    isRemote?: boolean
    isNew?: boolean
    jobUrl?: string
    notes?: string
    lastUpdated?: string
    companyInfo?: {
      website?: string
      email?: string
      phone?: string
      size?: string
      industry?: string
      founded?: string
      description?: string
    }
    applicationInfo?: {
      howToApply?: string
      contactPerson?: string
      additionalInstructions?: string
    }
  }
  onApply?: () => void
  onBookmark?: () => void
  onShare?: () => void
  onReport?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

const statusConfig = {
  applied: {
    label: 'Applied',
    variant: 'info' as const,
    icon: Clock,
  },
  in_review: {
    label: 'In Review',
    variant: 'warning' as const,
    icon: Eye,
  },
  interview_scheduled: {
    label: 'Interview Scheduled',
    variant: 'info' as const,
    icon: Calendar,
  },
  offer_received: {
    label: 'Offer Received',
    variant: 'success' as const,
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive' as const,
    icon: XCircle,
  },
  withdrawn: {
    label: 'Withdrawn',
    variant: 'secondary' as const,
    icon: XCircle,
  }
}

const JobModal: React.FC<JobModalProps> = ({
  isOpen,
  onClose,
  job,
  onApply,
  onBookmark,
  onShare,
  onReport,
  onEdit,
  onDelete
}) => {
  const [activeTab, setActiveTab] = useState<"overview" | "company" | "apply">("overview")

  const formatPostedDate = (date?: string) => {
    if (!date) return "Recently"
    try {
      const posted = new Date(date)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - posted.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return "Yesterday"
      if (diffDays <= 7) return `${diffDays} days ago`
      if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      return `${Math.ceil(diffDays / 30)} months ago`
    } catch {
      return "Recently"
    }
  }

  const formatSalary = () => {
    if (job.salaryRange?.min && job.salaryRange?.max) {
      return `${job.salaryRange.currency || "$"}${job.salaryRange.min}k - ${job.salaryRange.max}k`
    }
    return job.salary || "Competitive"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const statusInfo = job.status ? statusConfig[job.status] : null
  const StatusIcon = statusInfo?.icon

  const TabButton = ({
    tab,
    label,
    isActive
  }: {
    tab: "overview" | "company" | "apply"
    label: string
    isActive: boolean
  }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={cn(
        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
        isActive
          ? "bg-gradient-primary text-white shadow-card"
          : "text-surface-600 hover:text-surface-900 hover:bg-surface-100"
      )}
    >
      {label}
    </button>
  )

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Job Description */}
      {job.description && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Job Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-surface-700 leading-relaxed whitespace-pre-line">
              {job.description}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Requirements */}
      {job.requirements && job.requirements.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary-500" />
              Requirements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-surface-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Responsibilities */}
      {job.responsibilities && job.responsibilities.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-interactive-500" />
              Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {job.responsibilities.map((resp, index) => (
                <li key={index} className="flex items-start gap-2 text-surface-700">
                  <div className="w-1.5 h-1.5 rounded-full bg-interactive-500 mt-2 flex-shrink-0" />
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      {job.benefits && job.benefits.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Award className="w-5 h-5 text-success-500" />
              Benefits & Perks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {job.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-surface-700">
                  <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Required Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-sm">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderCompanyTab = () => (
    <div className="space-y-6">
      <Card variant="gradient">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            {job.companyLogo ? (
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-card">
                <img
                  src={job.companyLogo}
                  alt={`${job.company} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-primary-100 to-interactive-100 flex items-center justify-center shadow-card">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
            )}
            <div>
              <h3 className="text-2xl font-bold text-foreground">{job.company}</h3>
              {job.companyInfo?.industry && (
                <p className="text-surface-600">{job.companyInfo.industry}</p>
              )}
            </div>
          </div>

          {job.companyInfo?.description && (
            <p className="text-surface-700 leading-relaxed mb-6">
              {job.companyInfo.description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            {job.companyInfo?.size && (
              <div>
                <p className="text-sm font-medium text-surface-900">Company Size</p>
                <p className="text-surface-600">{job.companyInfo.size}</p>
              </div>
            )}
            {job.companyInfo?.founded && (
              <div>
                <p className="text-sm font-medium text-surface-900">Founded</p>
                <p className="text-surface-600">{job.companyInfo.founded}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      {(job.companyInfo?.website || job.companyInfo?.email || job.companyInfo?.phone) && (
        <Card variant="glass">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {job.companyInfo?.website && (
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-primary-500" />
                  <a
                    href={job.companyInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {job.companyInfo.website}
                  </a>
                </div>
              )}
              {job.companyInfo?.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-interactive-500" />
                  <a
                    href={`mailto:${job.companyInfo.email}`}
                    className="text-interactive-600 hover:text-interactive-700 transition-colors"
                  >
                    {job.companyInfo.email}
                  </a>
                </div>
              )}
              {job.companyInfo?.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-success-500" />
                  <a
                    href={`tel:${job.companyInfo.phone}`}
                    className="text-success-600 hover:text-success-700 transition-colors"
                  >
                    {job.companyInfo.phone}
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  const renderApplyTab = () => (
    <div className="space-y-6">
      <Card variant="gradient">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {job.status ? 'Application Status' : 'Ready to Apply?'}
            </h3>
            <p className="text-surface-600">
              {job.status ? 'Track your application progress' : 'Take the next step in your career journey'}
            </p>
          </div>

          {job.applicationInfo?.howToApply && (
            <div className="bg-primary-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-primary-900 mb-2">How to Apply</h4>
              <p className="text-primary-800 text-sm leading-relaxed">
                {job.applicationInfo.howToApply}
              </p>
            </div>
          )}

          {job.applicationInfo?.contactPerson && (
            <div className="mb-4">
              <p className="text-sm font-medium text-surface-900">Contact Person</p>
              <p className="text-surface-600">{job.applicationInfo.contactPerson}</p>
            </div>
          )}

          {job.applicationInfo?.additionalInstructions && (
            <div className="bg-surface-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-surface-900 mb-2 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-warning-500" />
                Additional Instructions
              </h4>
              <p className="text-surface-700 text-sm leading-relaxed">
                {job.applicationInfo.additionalInstructions}
              </p>
            </div>
          )}

          {/* Application Details for tracked jobs */}
          {job.status && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm font-medium text-surface-900">Application Date</p>
                <p className="text-surface-600">{formatDate(job.applicationDate)}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-surface-900">Last Updated</p>
                <p className="text-surface-600">{formatDate(job.lastUpdated)}</p>
              </div>
              {job.priority && (
                <div>
                  <p className="text-sm font-medium text-surface-900">Priority</p>
                  <Badge variant={job.priority === 'high' ? 'destructive' : job.priority === 'medium' ? 'warning' : 'secondary'}>
                    {job.priority.toUpperCase()}
                  </Badge>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          {job.notes && (
            <div className="bg-surface-50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-surface-900 mb-2">Notes</h4>
              <p className="text-surface-700 text-sm leading-relaxed">
                {job.notes}
              </p>
            </div>
          )}

          <div className="flex gap-3">
            {!job.status ? (
              <>
                <Button
                  variant="gradient"
                  size="lg"
                  className="flex-1"
                  onClick={onApply}
                >
                  Apply Now
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => onBookmark?.()}
                >
                  {job.isBookmarked ? (
                    <BookmarkCheck className="w-4 h-4" />
                  ) : (
                    <Bookmark className="w-4 h-4" />
                  )}
                </Button>
              </>
            ) : (
              <>
                {job.jobUrl && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => window.open(job.jobUrl, '_blank')}
                    rightIcon={<ExternalLink className="w-4 h-4" />}
                  >
                    View Job Posting
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={onEdit}
                    rightIcon={<Edit3 className="w-4 h-4" />}
                  >
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="destructive"
                    size="lg"
                    onClick={onDelete}
                    rightIcon={<Trash2 className="w-4 h-4" />}
                  >
                    Delete
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <Modal open={isOpen} onOpenChange={onClose}>
      <ModalContent size="xl" variant="default" className="max-h-[90vh] overflow-hidden">
        <ModalHeader className="pb-4 border-b border-border/50">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {job.companyLogo ? (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-surface shadow-card">
                  <img
                    src={job.companyLogo}
                    alt={`${job.company} logo`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-interactive-100 flex items-center justify-center shadow-card">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
              )}
              <div>
                <ModalTitle className="text-xl gradient-text">{job.title}</ModalTitle>
                <ModalDescription className="text-surface-600 font-medium">
                  {job.company} • {job.location}
                </ModalDescription>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {job.isNew && (
                <Badge variant="gradient" size="sm" className="animate-pulse">
                  New
                </Badge>
              )}
              {job.isUrgent && (
                <Badge variant="destructive" size="sm">
                  Urgent
                </Badge>
              )}
              {job.isRemote && (
                <Badge variant="success" size="sm">
                  Remote
                </Badge>
              )}
            </div>
          </div>

          {/* Job meta information */}
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-surface-600">
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{job.type}</span>
            </div>
            {job.experience && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{job.experience}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatPostedDate(job.postedDate)}</span>
            </div>
            {job.applicants && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
              </div>
            )}
            {job.applicationDeadline && (
              <div className="flex items-center gap-1 text-warning-600">
                <Calendar className="w-4 h-4" />
                <span>Deadline: {formatDate(job.applicationDeadline)}</span>
              </div>
            )}
          </div>

          {/* Status Badge */}
          {job.status && statusInfo && StatusIcon && (
            <div className="flex items-center gap-2 mt-4">
              <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {statusInfo.label}
              </Badge>
            </div>
          )}

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 mt-4 bg-surface-100 rounded-lg p-1">
            <TabButton tab="overview" label="Overview" isActive={activeTab === "overview"} />
            <TabButton tab="company" label="Company" isActive={activeTab === "company"} />
            <TabButton tab="apply" label={job.status ? "Application" : "Apply"} isActive={activeTab === "apply"} />
          </div>
        </ModalHeader>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {activeTab === "overview" && renderOverviewTab()}
          {activeTab === "company" && renderCompanyTab()}
          {activeTab === "apply" && renderApplyTab()}
        </div>

        <ModalFooter className="pt-4 border-t border-border/50">
          <div className="flex items-center justify-between w-full">
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={onShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onReport}>
                <Flag className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {!job.status && (
                <Button variant="gradient" onClick={onApply}>
                  Apply Now
                </Button>
              )}
            </div>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default JobModal
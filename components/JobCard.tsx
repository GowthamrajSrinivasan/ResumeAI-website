"use client"

import React from "react"
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
  CheckCircle,
  XCircle,
  Eye
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface JobCardProps {
  id?: string
  title: string
  company: string
  location: string
  salary?: string
  type?: "Full-time" | "Part-time" | "Contract" | "Internship"
  experience?: string
  skills?: string[]
  description?: string
  postedDate?: string
  applicationDeadline?: string
  status?: 'applied' | 'in_review' | 'interview_scheduled' | 'offer_received' | 'rejected' | 'withdrawn'
  priority?: 'low' | 'medium' | 'high'
  isBookmarked?: boolean
  companyLogo?: string
  applicants?: number
  isUrgent?: boolean
  isRemote?: boolean
  isNew?: boolean
  salaryRange?: {
    min?: number
    max?: number
    currency?: string
  }
  jobUrl?: string
  notes?: string
  lastUpdated?: string
  onView?: () => void
  onApply?: () => void
  onBookmark?: () => void
  className?: string
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

const priorityConfig = {
  high: { borderColor: 'border-l-error-500', badgeVariant: 'destructive' as const },
  medium: { borderColor: 'border-l-warning-500', badgeVariant: 'warning' as const },
  low: { borderColor: 'border-l-surface-300', badgeVariant: 'secondary' as const }
}

const JobCard: React.FC<JobCardProps> = ({
  id,
  title,
  company,
  location,
  salary,
  type = "Full-time",
  experience,
  skills = [],
  description,
  postedDate,
  applicationDeadline,
  status,
  priority = 'medium',
  isBookmarked = false,
  companyLogo,
  applicants,
  isUrgent = false,
  isRemote = false,
  isNew = false,
  salaryRange,
  jobUrl,
  notes,
  lastUpdated,
  onView,
  onApply,
  onBookmark,
  className
}) => {
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
    if (salaryRange?.min && salaryRange?.max) {
      return `${salaryRange.currency || "$"}${salaryRange.min}k - ${salaryRange.max}k`
    }
    return salary || "Competitive"
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified"
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const statusInfo = status ? statusConfig[status] : null
  const StatusIcon = statusInfo?.icon

  return (
    <Card
      variant="default"
      hover="lift"
      className={cn(
        "group relative overflow-hidden border-l-4 transition-all duration-300",
        priorityConfig[priority].borderColor,
        isUrgent && "ring-2 ring-error-200 ring-offset-2",
        isNew && "ring-2 ring-primary-200 ring-offset-2",
        className
      )}
    >
      {/* Status badges */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {isNew && (
          <Badge variant="gradient" size="sm" className="animate-pulse">
            New
          </Badge>
        )}
        {isUrgent && (
          <Badge variant="destructive" size="sm">
            Urgent
          </Badge>
        )}
        {isRemote && (
          <Badge variant="success" size="sm">
            Remote
          </Badge>
        )}
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1 mr-4">
            {companyLogo ? (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gradient-surface flex items-center justify-center shadow-card">
                <img
                  src={companyLogo}
                  alt={`${company} logo`}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-100 to-interactive-100 flex items-center justify-center shadow-card">
                <Building2 className="w-6 h-6 text-primary-600" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary-600 transition-colors truncate">
                  {title}
                </h3>
                <Badge variant={priorityConfig[priority].badgeVariant} size="sm">
                  {priority.toUpperCase()}
                </Badge>
              </div>
              <p className="text-surface-600 font-medium truncate">{company}</p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onBookmark}
            className="opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary-500" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Job Details */}
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{location}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4" />
              <span>{formatSalary()}</span>
            </div>
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              <span>{type}</span>
            </div>
            {experience && (
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{experience}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <p className="text-surface-700 text-sm line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {skills.slice(0, 4).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  size="sm"
                  className="text-xs"
                >
                  {skill}
                </Badge>
              ))}
              {skills.length > 4 && (
                <Badge variant="outline" size="sm" className="text-xs">
                  +{skills.length - 4} more
                </Badge>
              )}
            </div>
          )}

          {/* Status for job applications */}
          {status && statusInfo && StatusIcon && (
            <div className="flex items-center justify-between">
              <Badge variant={statusInfo.variant} className="flex items-center gap-1">
                <StatusIcon className="w-3 h-3" />
                {statusInfo.label}
              </Badge>
            </div>
          )}

          {/* Notes preview */}
          {notes && (
            <p className="text-surface-600 text-xs italic line-clamp-1">
              Note: {notes}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div className="flex items-center gap-4 text-xs text-surface-500">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              <span>{formatPostedDate(postedDate)}</span>
            </div>
            {applicants && (
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                <span>{applicants} applicants</span>
              </div>
            )}
            {applicationDeadline && (
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>Deadline: {formatDate(applicationDeadline)}</span>
              </div>
            )}
            {lastUpdated && status && (
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>Updated {formatDate(lastUpdated)}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onView}
              rightIcon={<ExternalLink className="w-3 h-3" />}
            >
              {status ? 'Details' : 'View'}
            </Button>
            {!status && (
              <Button
                variant="gradient"
                size="sm"
                onClick={onApply}
              >
                Apply Now
              </Button>
            )}
            {jobUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(jobUrl, '_blank')}
                rightIcon={<ExternalLink className="w-3 h-3" />}
              >
                View Job
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Hover effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/5 to-interactive-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </Card>
  )
}

export default JobCard
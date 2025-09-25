"use client"

import React, { useState, useEffect, useCallback } from "react"
import {
  Search,
  Filter,
  MapPin,
  Briefcase,
  DollarSign,
  SlidersHorizontal,
  Grid3x3,
  List,
  TrendingUp,
  Clock,
  Star,
  Bookmark,
  RefreshCw,
  ChevronDown,
  X,
  Plus,
  Users,
  Building2,
  CheckCircle,
  AlertCircle,
  Sparkles,
  User,
  Crown,
  LogOut,
  Home,
  BarChart3
} from "lucide-react"
import JobCard from "@/components/JobCard"
import JobModal from "@/components/JobModal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useAuth } from '@/hooks/useAuth'
import JobTrackerReal from '@/components/JobTrackerReal'

// Mock data for job listings (you can replace this with real API data)
const mockJobs = [
  {
    id: "1",
    title: "Senior Frontend Developer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    salary: "$120k - $160k",
    salaryRange: { min: 120, max: 160, currency: "$" },
    type: "Full-time" as const,
    experience: "5+ years",
    skills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
    description: "Join our dynamic team as a Senior Frontend Developer and help build cutting-edge web applications that serve millions of users worldwide. You'll work with the latest technologies and collaborate with talented engineers to deliver exceptional user experiences.",
    requirements: [
      "5+ years of experience in frontend development",
      "Expert knowledge of React and TypeScript",
      "Experience with modern CSS frameworks",
      "Strong understanding of web performance optimization",
      "Experience with testing frameworks (Jest, Cypress)"
    ],
    responsibilities: [
      "Develop and maintain high-quality frontend applications",
      "Collaborate with design and backend teams",
      "Optimize applications for maximum speed and scalability",
      "Mentor junior developers and code review",
      "Stay up-to-date with emerging technologies"
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "Flexible working hours",
      "Remote work options",
      "Professional development budget",
      "Free lunch and snacks"
    ],
    postedDate: "2024-01-15",
    applicationDeadline: "2024-02-15",
    isBookmarked: false,
    companyLogo: "/api/placeholder/64/64",
    applicants: 23,
    isUrgent: false,
    isRemote: true,
    isNew: true,
    companyInfo: {
      website: "https://techcorp.com",
      email: "careers@techcorp.com",
      phone: "+1 (555) 123-4567",
      size: "500-1000 employees",
      industry: "Technology",
      founded: "2010",
      description: "TechCorp is a leading technology company focused on building innovative solutions that transform how people work and collaborate."
    },
    applicationInfo: {
      howToApply: "Please submit your resume along with a cover letter explaining why you're interested in this role.",
      contactPerson: "Sarah Johnson, Senior Recruiter",
      additionalInstructions: "Include links to your portfolio and GitHub profile."
    }
  },
  {
    id: "2",
    title: "Product Manager",
    company: "StartupX",
    location: "New York, NY",
    salary: "$140k - $180k",
    salaryRange: { min: 140, max: 180, currency: "$" },
    type: "Full-time" as const,
    experience: "3+ years",
    skills: ["Product Strategy", "User Research", "Agile", "Analytics", "Roadmapping"],
    description: "Lead product development for our flagship SaaS platform. Drive product strategy, work with cross-functional teams, and deliver features that delight our customers.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and problem-solving skills",
      "Experience with B2B SaaS products",
      "Excellent communication skills"
    ],
    responsibilities: [
      "Define and execute product roadmap",
      "Work with engineering and design teams",
      "Analyze user feedback and market trends",
      "Coordinate product launches"
    ],
    benefits: [
      "Stock options",
      "Health insurance",
      "Flexible PTO",
      "Learning stipend"
    ],
    postedDate: "2024-01-14",
    applicationDeadline: "2024-02-10",
    isBookmarked: true,
    applicants: 45,
    isUrgent: true,
    isRemote: false,
    isNew: false,
    companyInfo: {
      website: "https://startupx.com",
      email: "jobs@startupx.com",
      size: "50-100 employees",
      industry: "SaaS",
      founded: "2018",
      description: "StartupX is revolutionizing the way businesses manage their operations with our innovative SaaS platform."
    }
  },
  {
    id: "3",
    title: "UX Designer",
    company: "DesignStudio",
    location: "Austin, TX",
    salary: "$90k - $120k",
    salaryRange: { min: 90, max: 120, currency: "$" },
    type: "Full-time" as const,
    experience: "2+ years",
    skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Adobe Creative Suite"],
    description: "Create beautiful, intuitive user experiences for our growing portfolio of digital products. Work closely with product and engineering teams to bring ideas to life.",
    requirements: [
      "2+ years of UX design experience",
      "Proficiency in Figma and design tools",
      "Strong portfolio showcasing UX process",
      "Experience with user research methods"
    ],
    responsibilities: [
      "Design user interfaces for web and mobile",
      "Conduct user research and usability testing",
      "Create and maintain design systems",
      "Collaborate with product and engineering teams"
    ],
    benefits: [
      "Creative freedom",
      "Conference and workshop budget",
      "Health and dental insurance",
      "Flexible schedule"
    ],
    postedDate: "2024-01-12",
    isBookmarked: false,
    applicants: 67,
    isUrgent: false,
    isRemote: true,
    isNew: false,
    companyInfo: {
      website: "https://designstudio.com",
      email: "hello@designstudio.com",
      size: "20-50 employees",
      industry: "Design",
      founded: "2019",
      description: "DesignStudio helps companies create exceptional user experiences through thoughtful design and research."
    }
  }
]

const jobTypes = ["Full-time", "Part-time", "Contract", "Internship"]
const experienceLevels = ["Entry Level", "1-2 years", "3-5 years", "5+ years", "10+ years"]
const salaryRanges = ["$0-50k", "$50k-100k", "$100k-150k", "$150k-200k", "$200k+"]

interface FilterState {
  search: string
  location: string
  jobType: string[]
  experience: string[]
  salaryRange: string[]
  isRemote: boolean
  postedWithin: string
}

export default function JobsPage() {
  const { user, logout } = useAuth()
  const [jobs, setJobs] = useState(mockJobs)
  const [filteredJobs, setFilteredJobs] = useState(mockJobs)
  const [selectedJob, setSelectedJob] = useState<typeof mockJobs[0] | null>(null)
  const [isJobModalOpen, setIsJobModalOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showJobTracker, setShowJobTracker] = useState(false)

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    location: "",
    jobType: [],
    experience: [],
    salaryRange: [],
    isRemote: false,
    postedWithin: "all"
  })

  // Filter jobs based on current filters
  const applyFilters = useCallback(() => {
    let filtered = [...jobs]

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.skills.some(skill => skill.toLowerCase().includes(searchLower)) ||
        (job.description && job.description.toLowerCase().includes(searchLower))
      )
    }

    // Location filter
    if (filters.location) {
      const locationLower = filters.location.toLowerCase()
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationLower)
      )
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      filtered = filtered.filter(job =>
        filters.jobType.includes(job.type)
      )
    }

    // Remote filter
    if (filters.isRemote) {
      filtered = filtered.filter(job => job.isRemote)
    }

    // Posted within filter
    if (filters.postedWithin !== "all") {
      const days = parseInt(filters.postedWithin)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - days)

      filtered = filtered.filter(job => {
        if (!job.postedDate) return false
        return new Date(job.postedDate) >= cutoffDate
      })
    }

    setFilteredJobs(filtered)
  }, [jobs, filters])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleJobView = (job: typeof mockJobs[0]) => {
    setSelectedJob(job)
    setIsJobModalOpen(true)
  }

  const handleJobApply = (jobId?: string) => {
    console.log("Applying to job:", jobId)
    // You can add logic to navigate to application form or external URL
  }

  const handleJobBookmark = (jobId?: string) => {
    if (!jobId) return

    setJobs(prevJobs =>
      prevJobs.map(job =>
        job.id === jobId ? { ...job, isBookmarked: !job.isBookmarked } : job
      )
    )
  }

  const handleClearFilters = () => {
    setFilters({
      search: "",
      location: "",
      jobType: [],
      experience: [],
      salaryRange: [],
      isRemote: false,
      postedWithin: "all"
    })
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  if (showJobTracker) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                  <Briefcase className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-lg font-bold text-gray-900">Fit2Hire Job Tracker</h1>
              </div>

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowJobTracker(false)}
                >
                  View Job Listings
                </Button>
                {user && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    rightIcon={<LogOut className="h-4 w-4" />}
                  >
                    Logout
                  </Button>
                )}
              </div>
            </div>
          </nav>
        </header>

        {/* Page Title Section */}
        <section className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Job Application Tracker
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Manage your job applications with intelligent tracking, status updates, and insights
                to help you land your dream role.
              </p>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="pb-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <JobTrackerReal />
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Fit2Hire Jobs</h1>
            </div>

            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowJobTracker(true)}
                leftIcon={<BarChart3 className="h-4 w-4" />}
              >
                Job Tracker
              </Button>
              {user ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  rightIcon={<LogOut className="h-4 w-4" />}
                >
                  Logout
                </Button>
              ) : (
                <Button variant="gradient" size="sm">
                  <a href="/login">Sign In</a>
                </Button>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Find Your Dream Job
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Discover thousands of job opportunities from top companies around the world.
            Start your career journey today.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    leftIcon={<Search className="h-4 w-4 text-gray-500" />}
                    className="h-12 text-base bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div className="flex-1">
                  <Input
                    type="text"
                    placeholder="Location"
                    value={filters.location}
                    onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                    leftIcon={<MapPin className="h-4 w-4 text-gray-500" />}
                    className="h-12 text-base bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 shadow-sm"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setShowFilters(!showFilters)}
                    leftIcon={<Filter className="h-4 w-4" />}
                    className="bg-gray-100 hover:bg-gray-200 border-gray-300 shadow-sm"
                  >
                    Filters
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    className="min-w-[120px] bg-blue-600 hover:bg-blue-700 shadow-lg"
                  >
                    Search Jobs
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters Panel */}
      {showFilters && (
        <section className="px-4 sm:px-6 lg:px-8 pb-8">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={handleClearFilters} className="hover:bg-gray-100 text-gray-700">
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="hover:bg-gray-100 text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {/* Job Type */}
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">
                    Job Type
                  </label>
                  <div className="space-y-2">
                    {jobTypes.map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.jobType.includes(type)}
                          onChange={(e) => {
                            const newJobTypes = e.target.checked
                              ? [...filters.jobType, type]
                              : filters.jobType.filter(t => t !== type)
                            setFilters(prev => ({ ...prev, jobType: newJobTypes }))
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">
                    Experience
                  </label>
                  <div className="space-y-2">
                    {experienceLevels.map(level => (
                      <label key={level} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.experience.includes(level)}
                          onChange={(e) => {
                            const newExperience = e.target.checked
                              ? [...filters.experience, level]
                              : filters.experience.filter(exp => exp !== level)
                            setFilters(prev => ({ ...prev, experience: newExperience }))
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        />
                        <span className="text-sm text-gray-700">{level}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">
                    Salary Range
                  </label>
                  <div className="space-y-2">
                    {salaryRanges.map(range => (
                      <label key={range} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.salaryRange.includes(range)}
                          onChange={(e) => {
                            const newSalaryRange = e.target.checked
                              ? [...filters.salaryRange, range]
                              : filters.salaryRange.filter(r => r !== range)
                            setFilters(prev => ({ ...prev, salaryRange: newSalaryRange }))
                          }}
                          className="rounded border-gray-300 text-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
                        />
                        <span className="text-sm text-gray-700">{range}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Other Filters */}
                <div>
                  <label className="text-sm font-medium text-gray-800 mb-2 block">
                    Other Options
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={filters.isRemote}
                        onChange={(e) => setFilters(prev => ({ ...prev, isRemote: e.target.checked }))}
                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">Remote Only</span>
                    </label>
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium text-gray-800 mb-2 block">
                      Posted Within
                    </label>
                    <select
                      value={filters.postedWithin}
                      onChange={(e) => setFilters(prev => ({ ...prev, postedWithin: e.target.value }))}
                      className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800"
                    >
                      <option value="all">Any Time</option>
                      <option value="1">Last 24 hours</option>
                      <option value="7">Last 7 days</option>
                      <option value="30">Last 30 days</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Results Header */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredJobs.length} Jobs Found
              </h2>
              <p className="text-sm text-gray-700">
                Showing results for your search criteria
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <select className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 shadow-sm">
                <option>Most Relevant</option>
                <option>Most Recent</option>
                <option>Salary: High to Low</option>
                <option>Salary: Low to High</option>
              </select>

              {/* View Toggle */}
              <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg p-1 shadow-sm">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-7xl mx-auto">
          {filteredJobs.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
                  : "space-y-4"
              }
            >
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  {...job}
                  onView={() => handleJobView(job)}
                  onApply={() => handleJobApply(job.id)}
                  onBookmark={() => handleJobBookmark(job.id)}
                  className={viewMode === "list" ? "max-w-none" : ""}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-xl shadow-lg">
              <div className="text-gray-500 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No jobs found
              </h3>
              <p className="text-gray-700 mb-4">
                Try adjusting your search criteria or filters
              </p>
              <Button variant="outline" onClick={handleClearFilters} className="bg-gray-100 hover:bg-gray-200 border-gray-300">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Job Modal */}
      {selectedJob && (
        <JobModal
          isOpen={isJobModalOpen}
          onClose={() => {
            setIsJobModalOpen(false)
            setSelectedJob(null)
          }}
          job={selectedJob}
          onApply={() => handleJobApply(selectedJob.id)}
          onBookmark={() => handleJobBookmark(selectedJob.id)}
          onShare={() => console.log("Share job:", selectedJob.id)}
          onReport={() => console.log("Report job:", selectedJob.id)}
        />
      )}
    </div>
  )
}
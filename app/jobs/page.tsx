"use client";

import React, { useState, useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSavedJobs } from "@/hooks/useSavedJobs";
import { useRouter } from "next/navigation";
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Filter,
  Grid3x3,
  List,
  ChevronDown,
  Clock,
  Bookmark,
  BookmarkCheck,
  Heart,
  Share2,
  TrendingUp,
  Users,
  Building2,
  X,
  Menu,
  LogOut,
  User,
  ChevronRight,
  CheckCircle2,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Types
interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: "Remote" | "Hybrid" | "On-site";
  salary: {
    min: number;
    max: number;
    currency: string;
  };
  type: "Full-time" | "Part-time" | "Contract" | "Freelance";
  experience: "Entry" | "Mid" | "Senior" | "Lead";
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: Date;
  applicants: number;
  featured: boolean;
  companyLogo?: string;
}

interface FilterState {
  jobType: string[];
  experienceLevel: string[];
  locationType: string[];
  salaryRange: [number, number];
}

// Mock Job Data
const MOCK_JOBS: Job[] = [
  {
    id: "1",
    title: "Senior Full-Stack Engineer",
    company: "TechCorp Inc.",
    location: "San Francisco, CA",
    locationType: "Hybrid",
    salary: { min: 150000, max: 200000, currency: "USD" },
    type: "Full-time",
    experience: "Senior",
    skills: ["React", "Node.js", "TypeScript", "AWS", "PostgreSQL"],
    description:
      "We're looking for an experienced Full-Stack Engineer to join our growing team. You'll work on cutting-edge projects using modern technologies and help shape the future of our platform.",
    requirements: [
      "5+ years of experience with React and Node.js",
      "Strong understanding of TypeScript and modern JavaScript",
      "Experience with cloud platforms (AWS, Azure, or GCP)",
      "Excellent problem-solving and communication skills",
    ],
    benefits: [
      "Competitive salary and equity",
      "Health, dental, and vision insurance",
      "401(k) matching",
      "Unlimited PTO",
      "Remote work flexibility",
    ],
    postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    applicants: 47,
    featured: true,
  },
  {
    id: "2",
    title: "Product Manager",
    company: "InnovateLabs",
    location: "New York, NY",
    locationType: "On-site",
    salary: { min: 120000, max: 160000, currency: "USD" },
    type: "Full-time",
    experience: "Mid",
    skills: ["Product Strategy", "Agile", "Analytics", "UX Design", "Roadmapping"],
    description:
      "Join our product team to drive innovation and deliver exceptional user experiences. You'll work cross-functionally to define product vision and execute on strategic initiatives.",
    requirements: [
      "3+ years of product management experience",
      "Strong analytical and data-driven decision making",
      "Experience with Agile methodologies",
      "Excellent communication and leadership skills",
    ],
    benefits: [
      "Comprehensive health benefits",
      "Stock options",
      "Professional development budget",
      "Gym membership",
    ],
    postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    applicants: 89,
    featured: true,
  },
  {
    id: "3",
    title: "UX/UI Designer",
    company: "DesignStudio Pro",
    location: "Remote",
    locationType: "Remote",
    salary: { min: 90000, max: 130000, currency: "USD" },
    type: "Full-time",
    experience: "Mid",
    skills: ["Figma", "Adobe XD", "User Research", "Prototyping", "Design Systems"],
    description:
      "Create beautiful and intuitive user experiences for our suite of products. You'll work closely with engineers and product managers to bring designs to life.",
    requirements: [
      "3+ years of UX/UI design experience",
      "Strong portfolio demonstrating design expertise",
      "Proficiency in Figma and Adobe Creative Suite",
      "Experience with user research and testing",
    ],
    benefits: [
      "Fully remote position",
      "Flexible working hours",
      "Health insurance",
      "Annual design conference budget",
    ],
    postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    applicants: 124,
    featured: false,
  },
  {
    id: "4",
    title: "Data Scientist",
    company: "DataDriven Analytics",
    location: "Boston, MA",
    locationType: "Hybrid",
    salary: { min: 130000, max: 180000, currency: "USD" },
    type: "Full-time",
    experience: "Senior",
    skills: ["Python", "Machine Learning", "TensorFlow", "SQL", "Statistics"],
    description:
      "Join our data science team to build predictive models and extract insights from large datasets. You'll have the opportunity to work on challenging problems across multiple domains.",
    requirements: [
      "5+ years of data science experience",
      "Strong programming skills in Python",
      "Experience with ML frameworks (TensorFlow, PyTorch)",
      "PhD or Master's in Computer Science, Statistics, or related field",
    ],
    benefits: [
      "Competitive compensation",
      "Research publication opportunities",
      "Conference attendance",
      "Latest hardware and tools",
    ],
    postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    applicants: 62,
    featured: true,
  },
  {
    id: "5",
    title: "Frontend Developer",
    company: "WebWorks LLC",
    location: "Austin, TX",
    locationType: "Remote",
    salary: { min: 80000, max: 120000, currency: "USD" },
    type: "Full-time",
    experience: "Entry",
    skills: ["React", "JavaScript", "CSS", "HTML", "Git"],
    description:
      "Looking for a passionate frontend developer to join our team. Perfect opportunity for someone early in their career who wants to grow and learn from experienced engineers.",
    requirements: [
      "1-2 years of React development experience",
      "Strong understanding of HTML, CSS, and JavaScript",
      "Familiarity with Git and version control",
      "Eagerness to learn and grow",
    ],
    benefits: [
      "Mentorship program",
      "Remote-first culture",
      "Learning and development budget",
      "Health insurance",
    ],
    postedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    applicants: 203,
    featured: false,
  },
  {
    id: "6",
    title: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Seattle, WA",
    locationType: "Hybrid",
    salary: { min: 140000, max: 190000, currency: "USD" },
    type: "Full-time",
    experience: "Senior",
    skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
    description:
      "Build and maintain scalable infrastructure for our cloud-native applications. You'll work with cutting-edge DevOps tools and practices to ensure reliability and performance.",
    requirements: [
      "5+ years of DevOps/Infrastructure experience",
      "Expert knowledge of Kubernetes and Docker",
      "Strong experience with AWS or GCP",
      "Infrastructure as Code experience (Terraform, CloudFormation)",
    ],
    benefits: [
      "Top-tier compensation",
      "Equity package",
      "Comprehensive benefits",
      "Continuous learning opportunities",
    ],
    postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    applicants: 56,
    featured: false,
  },
  {
    id: "7",
    title: "Marketing Manager",
    company: "GrowthHub Marketing",
    location: "Los Angeles, CA",
    locationType: "On-site",
    salary: { min: 95000, max: 135000, currency: "USD" },
    type: "Full-time",
    experience: "Mid",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics", "Social Media"],
    description:
      "Lead marketing initiatives and drive growth for our B2B SaaS product. You'll develop and execute comprehensive marketing strategies across multiple channels.",
    requirements: [
      "3+ years of B2B marketing experience",
      "Proven track record of driving growth",
      "Experience with marketing automation tools",
      "Strong analytical and strategic thinking skills",
    ],
    benefits: [
      "Competitive salary",
      "Performance bonuses",
      "Health and wellness benefits",
      "Professional development",
    ],
    postedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    applicants: 78,
    featured: false,
  },
  {
    id: "8",
    title: "Sales Development Representative",
    company: "SalesPro Solutions",
    location: "Chicago, IL",
    locationType: "Hybrid",
    salary: { min: 60000, max: 90000, currency: "USD" },
    type: "Full-time",
    experience: "Entry",
    skills: ["Sales", "CRM", "Communication", "Lead Generation", "Salesforce"],
    description:
      "Join our dynamic sales team and help drive revenue growth. This is an excellent opportunity for someone looking to start their career in SaaS sales.",
    requirements: [
      "0-2 years of sales experience",
      "Excellent communication skills",
      "Self-motivated and goal-oriented",
      "Familiarity with CRM tools (Salesforce preferred)",
    ],
    benefits: [
      "Base salary plus commission",
      "Comprehensive training program",
      "Career advancement opportunities",
      "Health insurance",
    ],
    postedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    applicants: 145,
    featured: false,
  },
];

export default function JobsPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { jobs: savedJobsData, deleteJob, loading: savedJobsLoading } = useSavedJobs();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState<"recent" | "salary" | "relevance">("recent");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  // Create a Set of saved job IDs for quick lookup
  const savedJobIds = useMemo(() => {
    return new Set(savedJobsData.map(job => job.id));
  }, [savedJobsData]);

  const [filters, setFilters] = useState<FilterState>({
    jobType: [],
    experienceLevel: [],
    locationType: [],
    salaryRange: [0, 300000],
  });

  // Convert SavedJob data to Job format for display
  const convertedJobs = useMemo(() => {
    return savedJobsData.map(savedJob => ({
      id: savedJob.id,
      title: savedJob.title,
      company: savedJob.company,
      location: savedJob.location,
      locationType: savedJob.isRemote ? "Remote" as const : "On-site" as const,
      salary: {
        min: savedJob.salary ? savedJob.salary * 0.8 : 0,
        max: savedJob.salary || 0,
        currency: "USD"
      },
      type: "Full-time" as const,
      experience: "Mid" as const,
      skills: savedJob.extractedSkills || [],
      description: savedJob.description || "",
      requirements: [],
      benefits: [],
      postedAt: savedJob.savedAt?.toDate?.() || new Date(),
      applicants: savedJob.applicants || 0,
      featured: savedJob.tags?.includes('featured') || false,
    })) as Job[];
  }, [savedJobsData]);

  // Filter and search logic
  const filteredJobs = useMemo(() => {
    let jobs = [...convertedJobs];

    // Search filter
    if (searchQuery) {
      jobs = jobs.filter(
        (job) =>
          job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.skills.some((skill) =>
            skill.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Location filter
    if (locationQuery) {
      jobs = jobs.filter((job) =>
        job.location.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    // Job type filter
    if (filters.jobType.length > 0) {
      jobs = jobs.filter((job) => filters.jobType.includes(job.type));
    }

    // Experience level filter
    if (filters.experienceLevel.length > 0) {
      jobs = jobs.filter((job) =>
        filters.experienceLevel.includes(job.experience)
      );
    }

    // Location type filter
    if (filters.locationType.length > 0) {
      jobs = jobs.filter((job) =>
        filters.locationType.includes(job.locationType)
      );
    }

    // Salary range filter
    jobs = jobs.filter(
      (job) =>
        job.salary.max >= filters.salaryRange[0] &&
        job.salary.min <= filters.salaryRange[1]
    );

    // Sorting
    if (sortBy === "recent") {
      jobs.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
    } else if (sortBy === "salary") {
      jobs.sort((a, b) => b.salary.max - a.salary.max);
    }

    return jobs;
  }, [searchQuery, locationQuery, filters, sortBy, convertedJobs]);

  // Helper functions
  const toggleFilter = (
    category: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => {
      const current = prev[category] as string[];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const toggleSaveJob = async (job: Job) => {
    if (!user) {
      // Redirect to login if not authenticated
      router.push('/login');
      return;
    }

    try {
      // Check if job is already saved
      const isSaved = savedJobIds.has(job.id);

      if (isSaved) {
        // Delete the saved job from Firestore
        await deleteJob(job.id);
      }
    } catch (error) {
      console.error('Error removing saved job:', error);
    }
  };

  const formatSalary = (job: Job) => {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: job.salary.currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${formatter.format(job.salary.min)} - ${formatter.format(
      job.salary.max
    )}`;
  };

  const formatPostedDate = (date: Date) => {
    const days = Math.floor(
      (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Fit2Hire
                </h1>
                <p className="text-xs text-slate-600">Find Your Perfect Job</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    {user.email}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="md:hidden py-4 border-t border-slate-200 animate-slide-down">
              {user ? (
                <div className="space-y-2">
                  <div className="px-4 py-2 text-sm text-slate-600">
                    {user.email}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleLogout}
                    leftIcon={<LogOut className="w-4 h-4" />}
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Button
                  variant="gradient"
                  size="sm"
                  className="w-full"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </Button>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-10" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-6xl font-bold text-slate-900 mb-4">
              Find Your Dream Job
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
              Discover thousands of opportunities from top companies worldwide
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-4 md:p-6 border border-slate-200 animate-scale-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Job Title Search */}
              <div className="relative">
                <Input
                  placeholder="Job title or keyword"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" />}
                  className="h-12"
                />
              </div>

              {/* Location Search */}
              <div className="relative">
                <Input
                  placeholder="Location"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  leftIcon={<MapPin className="w-4 h-4" />}
                  className="h-12"
                />
              </div>

              {/* Search Button */}
              <Button
                size="lg"
                variant="gradient"
                className="h-12 w-full"
                leftIcon={<Search className="w-5 h-5" />}
              >
                Search Jobs
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-6 border-t border-slate-100">
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>
                  <strong className="text-slate-900">{savedJobsLoading ? '-' : savedJobsData.length}</strong>{" "}
                  Jobs Saved
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>
                  <strong className="text-slate-900">{savedJobsLoading ? '-' : new Set(savedJobsData.map(j => j.company)).size}</strong>{" "}
                  Companies
                </span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600">
                <Users className="w-4 h-4 text-pink-600" />
                <span>
                  <strong className="text-slate-900">{savedJobsLoading ? '-' : savedJobsData.reduce((sum, j) => sum + (j.applicants || 0), 0)}</strong>{" "}
                  Total Applicants
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          {/* Results Count */}
          <div className="flex items-center space-x-4">
            <h3 className="text-lg font-semibold text-slate-900">
              {filteredJobs.length} Jobs Found
            </h3>
            {(filters.jobType.length > 0 ||
              filters.experienceLevel.length > 0 ||
              filters.locationType.length > 0) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setFilters({
                    jobType: [],
                    experienceLevel: [],
                    locationType: [],
                    salaryRange: [0, 300000],
                  })
                }
                leftIcon={<X className="w-4 h-4" />}
              >
                Clear Filters
              </Button>
            )}
          </div>

          {/* View Controls */}
          <div className="flex items-center space-x-2">
            {/* Filter Button */}
            <Button
              variant={showFilters ? "default" : "outline"}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<Filter className="w-4 h-4" />}
            >
              Filters
            </Button>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "recent" | "salary" | "relevance")
              }
              className="px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="recent">Most Recent</option>
              <option value="salary">Highest Salary</option>
              <option value="relevance">Most Relevant</option>
            </select>

            {/* View Toggle */}
            <div className="hidden md:flex items-center space-x-1 bg-white border border-slate-300 rounded-lg p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded transition-all",
                  viewMode === "grid"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded transition-all",
                  viewMode === "list"
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Panel */}
          {showFilters && (
            <aside className="lg:w-64 flex-shrink-0 animate-slide-up">
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
                <h4 className="font-semibold text-slate-900 mb-4 flex items-center justify-between">
                  Filters
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </h4>

                {/* Job Type */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-slate-700 mb-3">
                    Job Type
                  </h5>
                  <div className="space-y-2">
                    {["Full-time", "Part-time", "Contract", "Freelance"].map(
                      (type) => (
                        <label
                          key={type}
                          className="flex items-center space-x-2 cursor-pointer group"
                        >
                          <input
                            type="checkbox"
                            checked={filters.jobType.includes(type)}
                            onChange={() => toggleFilter("jobType", type)}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-slate-600 group-hover:text-slate-900">
                            {type}
                          </span>
                        </label>
                      )
                    )}
                  </div>
                </div>

                {/* Experience Level */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-slate-700 mb-3">
                    Experience Level
                  </h5>
                  <div className="space-y-2">
                    {["Entry", "Mid", "Senior", "Lead"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.experienceLevel.includes(level)}
                          onChange={() =>
                            toggleFilter("experienceLevel", level)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900">
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Location Type */}
                <div className="mb-6">
                  <h5 className="text-sm font-medium text-slate-700 mb-3">
                    Work Location
                  </h5>
                  <div className="space-y-2">
                    {["Remote", "Hybrid", "On-site"].map((location) => (
                      <label
                        key={location}
                        className="flex items-center space-x-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={filters.locationType.includes(location)}
                          onChange={() =>
                            toggleFilter("locationType", location)
                          }
                          className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-slate-600 group-hover:text-slate-900">
                          {location}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h5 className="text-sm font-medium text-slate-700 mb-3">
                    Salary Range
                  </h5>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="300000"
                      step="10000"
                      value={filters.salaryRange[1]}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          salaryRange: [0, parseInt(e.target.value)],
                        }))
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>$0</span>
                      <span>
                        ${(filters.salaryRange[1] / 1000).toFixed(0)}K+
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          )}

          {/* Jobs Grid/List */}
          <div className="flex-1">
            {/* Loading State */}
            {savedJobsLoading ? (
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="flex justify-center mb-4">
                  <div className="animate-spin">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Loading your saved jobs...
                </h3>
                <p className="text-slate-600">
                  Please wait while we fetch your jobs from Firestore
                </p>
              </div>
            ) : savedJobsData.length === 0 ? (
              // Empty state when no jobs are saved
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Bookmark className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No saved jobs yet
                </h3>
                <p className="text-slate-600 mb-4">
                  Start saving jobs to track them and manage your job search
                </p>
                <Button
                  variant="gradient"
                  onClick={() => router.push('/jobs')}
                >
                  Browse Jobs
                </Button>
              </div>
            ) : filteredJobs.length === 0 ? (
              // No results after filtering
              <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No jobs found
                </h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your search or filters
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setLocationQuery("");
                    setFilters({
                      jobType: [],
                      experienceLevel: [],
                      locationType: [],
                      salaryRange: [0, 300000],
                    });
                  }}
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div
                className={cn(
                  "grid gap-6",
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
                    : "grid-cols-1"
                )}
              >
                {filteredJobs.map((job, index) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    viewMode={viewMode}
                    isSaved={savedJobIds.has(job.id)}
                    onSave={() => toggleSaveJob(job)}
                    onViewDetails={() => setSelectedJob(job)}
                    formatSalary={formatSalary}
                    formatPostedDate={formatPostedDate}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Job Detail Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          isSaved={savedJobIds.has(selectedJob.id)}
          onClose={() => setSelectedJob(null)}
          onSave={() => toggleSaveJob(selectedJob)}
          formatSalary={formatSalary}
          formatPostedDate={formatPostedDate}
        />
      )}
    </div>
  );
}

// Job Card Component
interface JobCardProps {
  job: Job;
  viewMode: "grid" | "list";
  isSaved: boolean;
  onSave: () => void;
  onViewDetails: () => void;
  formatSalary: (job: Job) => string;
  formatPostedDate: (date: Date) => string;
  index: number;
}

function JobCard({
  job,
  viewMode,
  isSaved,
  onSave,
  onViewDetails,
  formatSalary,
  formatPostedDate,
  index,
}: JobCardProps) {
  return (
    <div
      className={cn(
        "group bg-white rounded-xl shadow-md border border-slate-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 overflow-hidden animate-scale-in cursor-pointer",
        job.featured && "ring-2 ring-blue-400 ring-offset-2"
      )}
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={onViewDetails}
    >
      {job.featured && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 flex items-center">
          <Star className="w-3 h-3 mr-1 fill-current" />
          Featured Job
        </div>
      )}

      <div className={cn("p-6", viewMode === "list" && "flex items-start gap-6")}>
        {/* Company Logo */}
        <div className={cn(
          "flex-shrink-0",
          viewMode === "grid" && "mb-4"
        )}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {job.company.charAt(0)}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors truncate">
                {job.title}
              </h3>
              <p className="text-sm text-slate-600 mb-2">{job.company}</p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSave();
              }}
              className="ml-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              {isSaved ? (
                <BookmarkCheck className="w-5 h-5 text-blue-600 fill-current" />
              ) : (
                <Bookmark className="w-5 h-5 text-slate-400" />
              )}
            </button>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-slate-600">
              <MapPin className="w-4 h-4 mr-2 text-slate-400" />
              {job.location}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <DollarSign className="w-4 h-4 mr-2 text-slate-400" />
              {formatSalary(job)}
            </div>
            <div className="flex items-center text-sm text-slate-600">
              <Clock className="w-4 h-4 mr-2 text-slate-400" />
              {formatPostedDate(job.postedAt)}
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge variant="secondary" size="sm">
              {job.type}
            </Badge>
            <Badge variant="info" size="sm">
              {job.locationType}
            </Badge>
            <Badge variant="outline" size="sm">
              {job.experience}
            </Badge>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1 mb-4">
            {job.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded"
              >
                {skill}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="text-xs text-slate-500 px-2 py-1">
                +{job.skills.length - 3} more
              </span>
            )}
          </div>

          {/* Description Preview (List View) */}
          {viewMode === "list" && job.description && (
            <div className="mb-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
              <p className="text-sm text-slate-600 line-clamp-2">
                {job.description.split('\n')[0]}
              </p>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center text-sm text-slate-600">
              <Users className="w-4 h-4 mr-1 text-slate-400" />
              {job.applicants} applicants
            </div>
            <Button
              size="sm"
              variant="gradient"
              onClick={(e) => {
                e.stopPropagation();
                onViewDetails();
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Job Detail Modal Component
interface JobDetailModalProps {
  job: Job;
  isSaved: boolean;
  onClose: () => void;
  onSave: () => void;
  formatSalary: (job: Job) => string;
  formatPostedDate: (date: Date) => string;
}

function JobDetailModal({
  job,
  isSaved,
  onClose,
  onSave,
  formatSalary,
  formatPostedDate,
}: JobDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold text-2xl">
                {job.company.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-1">{job.title}</h2>
                <p className="text-blue-100">{job.company}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2" />
              {job.location}
            </div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-2" />
              {formatSalary(job)}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {formatPostedDate(job.postedAt)}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {job.applicants} applicants
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] px-6 py-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge variant="default">{job.type}</Badge>
            <Badge variant="info">{job.locationType}</Badge>
            <Badge variant="secondary">{job.experience}</Badge>
            {job.featured && <Badge variant="gradient">Featured</Badge>}
          </div>

          {/* Description */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">
              About the Role
            </h3>
            <div className="space-y-4">
              {job.description ? (
                job.description.split('\n').filter(para => para.trim()).map((para, index) => {
                  // Check if the paragraph is a list item (starts with - or •)
                  if (para.trim().startsWith('-') || para.trim().startsWith('•')) {
                    return (
                      <div key={index} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2.5 mr-3 flex-shrink-0" />
                        <p className="text-slate-700 leading-relaxed">
                          {para.trim().replace(/^[-•]\s*/, '')}
                        </p>
                      </div>
                    );
                  }
                  // Check if it's a numbered list
                  if (/^\d+\.\s/.test(para.trim())) {
                    return (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-600 font-semibold mr-3 mt-0.5 flex-shrink-0">
                          {para.trim().match(/^\d+/)?.[0]}.
                        </span>
                        <p className="text-slate-700 leading-relaxed">
                          {para.trim().replace(/^\d+\.\s*/, '')}
                        </p>
                      </div>
                    );
                  }
                  // Regular paragraph
                  return (
                    <p key={index} className="text-slate-700 leading-relaxed">
                      {para.trim()}
                    </p>
                  );
                })
              ) : (
                <p className="text-slate-600 italic">No description provided</p>
              )}
            </div>
          </section>

          {/* Requirements */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Requirements
            </h3>
            <ul className="space-y-2">
              {job.requirements.map((req, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-slate-700">{req}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Skills */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => (
                <Badge key={skill} variant="outline" size="lg">
                  {skill}
                </Badge>
              ))}
            </div>
          </section>

          {/* Benefits */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              Benefits
            </h3>
            <ul className="space-y-2">
              {job.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Star className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0 fill-current" />
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={onSave}
                leftIcon={
                  isSaved ? (
                    <BookmarkCheck className="w-5 h-5 fill-current" />
                  ) : (
                    <Bookmark className="w-5 h-5" />
                  )
                }
              >
                {isSaved ? "Saved" : "Save Job"}
              </Button>
              <Button variant="ghost" size="lg" leftIcon={<Share2 className="w-5 h-5" />}>
                Share
              </Button>
            </div>
            <Button
              variant="gradient"
              size="lg"
              leftIcon={<TrendingUp className="w-5 h-5" />}
            >
              Apply Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

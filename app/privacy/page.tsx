"use client";

import { useRouter } from 'next/navigation';
import React from "react";
import { Briefcase, ArrowLeft, ShieldCheck } from "lucide-react";

export default function PrivacyPolicyPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <Briefcase className="h-6 w-6 text-white" />
          <h1 className="text-xl font-extrabold">Fit2Hire</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="py-20 md:py-28 flex items-center justify-center px-4">
          <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-10 md:p-14 w-full max-w-4xl mx-auto transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
            <div
              className="pointer-events-none absolute inset-0 rounded-2xl"
              style={{
                background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
              }}
            />
            <div className="relative z-10">
              <button
                onClick={() => router.back()}
                className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 mb-8 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>

              <h2 className="text-4xl md:text-6xl font-extrabold mb-8 text-white drop-shadow-lg text-center">
                Privacy{' '}
                <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Policy
                </span>
              </h2>

              <div className="text-center mb-8">
                <p className="text-lg text-gray-300">
                  Last Updated: October 14, 2025
                </p>
                <p className="text-lg text-gray-300">
                  Effective Date: October 14, 2025
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Policy Content */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            {/* Introduction */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Introduction</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    Fit2Hire (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;the extension&rdquo;) is a Chrome browser extension designed to help job seekers analyze job descriptions and optimize their resumes for Applicant Tracking Systems (ATS). This Privacy Policy explains how we collect, use, store, and protect your information when you use our extension.
                  </p>
                  <p className="leading-relaxed">
                    By installing and using Fit2Hire, you agree to the collection and use of information in accordance with this policy.
                  </p>
                </div>
              </div>
            </div>

            {/* Information We Collect */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Information We Collect</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">1. Job-Related Information</h4>
                    <p className="leading-relaxed mb-2">When you use our extension to analyze job postings, we may collect:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Job titles, company names, and locations</li>
                      <li>Job descriptions and requirements</li>
                      <li>Skills and qualifications extracted from job postings</li>
                      <li>URLs of job posting pages you analyze</li>
                      <li>Platform names (LinkedIn, Indeed, Glassdoor, etc.)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">2. Resume Information</h4>
                    <p className="leading-relaxed mb-2">When you upload your resume for ATS analysis:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Text content extracted from your PDF resume</li>
                      <li>File name and metadata (page count, character count)</li>
                      <li>Resume analysis results and compatibility scores</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">3. User Authentication Information</h4>
                    <p className="leading-relaxed mb-2">When you choose to sign in with Google:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Email address</li>
                      <li>Display name</li>
                      <li>Profile photo URL</li>
                      <li>Google user ID (UID)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">4. Usage Data</h4>
                    <p className="leading-relaxed mb-2">We may collect:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Extension interaction data (button clicks, feature usage)</li>
                      <li>Error logs and diagnostic information</li>
                      <li>Browser tab URLs (only for job posting pages)</li>
                      <li>Timestamps of actions performed</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">5. Local Storage Data</h4>
                    <p className="leading-relaxed mb-2">The extension stores data locally in your browser using Chrome&apos;s storage API:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Cached job analysis results</li>
                      <li>Resume data and analysis results</li>
                      <li>User authentication session data</li>
                      <li>Saved job listings</li>
                      <li>Anonymous user identifiers (if you choose anonymous mode)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Primary Functions</h4>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Job Analysis:</strong> Extract and analyze job descriptions to identify required skills and qualifications</li>
                      <li><strong>ATS Score Calculation:</strong> Compare your resume against job requirements to generate compatibility scores</li>
                      <li><strong>Recommendations:</strong> Provide personalized suggestions to improve your resume&apos;s ATS compatibility</li>
                      <li><strong>Job Saving:</strong> Store and organize jobs you want to track for future reference</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Service Improvement</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Improve extension functionality and user experience</li>
                      <li>Diagnose and fix technical issues</li>
                      <li>Analyze usage patterns to enhance features</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Communication</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Send service-related notifications</li>
                      <li>Respond to user inquiries and support requests</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Storage and Retention */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Data Storage and Retention</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Local Storage</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Job analysis data is stored locally in your browser</li>
                      <li>Resume data is cached locally for quick access</li>
                      <li>You can clear all locally stored data by removing the extension or clearing browser data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Cloud Storage (Firebase Firestore)</h4>
                    <p className="leading-relaxed mb-2">When you sign in with Google:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Saved jobs are stored in our secure Firebase database</li>
                      <li>Data is associated with your unique user ID</li>
                      <li>You can delete your saved jobs at any time through the extension</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Anonymous Usage</h4>
                    <p className="leading-relaxed mb-2">If you choose to continue anonymously:</p>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>A temporary anonymous ID is generated locally</li>
                      <li>Limited data is stored in the cloud</li>
                      <li>You can clear this data by signing out or removing the extension</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Data Retention Period</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li><strong>Active Users:</strong> Data is retained while you actively use the extension</li>
                      <li><strong>Inactive Users:</strong> Data may be retained for up to 90 days after last activity</li>
                      <li><strong>Deleted Accounts:</strong> Data is permanently deleted within 30 days of account deletion request</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Sharing and Third Parties */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Data Sharing and Third Parties</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Third-Party Services We Use</h4>

                    <div className="space-y-3 mt-3">
                      <div>
                        <p className="font-semibold text-white">1. Google Firebase</p>
                        <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                          <li>Purpose: User authentication and data storage</li>
                          <li>Data shared: Email, name, profile photo, saved jobs</li>
                          <li>Privacy Policy: https://firebase.google.com/support/privacy</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-white">2. OpenAI API</p>
                        <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                          <li>Purpose: AI-powered job analysis and ATS scoring</li>
                          <li>Data shared: Job descriptions and resume text (anonymized)</li>
                          <li>Privacy Policy: https://openai.com/privacy</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-semibold text-white">3. Google OAuth 2.0</p>
                        <ul className="list-disc list-inside space-y-1 pl-4 mt-1">
                          <li>Purpose: User authentication</li>
                          <li>Data shared: Email, profile information</li>
                          <li>Privacy Policy: https://policies.google.com/privacy</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">We Do NOT:</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Sell your personal information to third parties</li>
                      <li>Share your resume or job data with employers or recruiters</li>
                      <li>Use your data for advertising purposes</li>
                      <li>Share your information with job posting platforms (LinkedIn, Indeed, etc.)</li>
                      <li>Track your browsing activity on non-job-related websites</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Security */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Data Security</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    We implement industry-standard security measures to protect your information:
                  </p>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Technical Safeguards</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>HTTPS/TLS encryption for all data transmission</li>
                      <li>Secure Firebase authentication with OAuth 2.0</li>
                      <li>Content Security Policy (CSP) to prevent unauthorized script execution</li>
                      <li>Encrypted storage of sensitive data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Access Controls</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>Limited access to user data by authorized personnel only</li>
                      <li>Regular security audits and updates</li>
                      <li>Secure API authentication for cloud functions</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">User Controls</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li>You can delete your account and all associated data at any time</li>
                      <li>You can clear locally stored data through browser settings</li>
                      <li>You can revoke Google authentication permissions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Permissions Explained */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Permissions Explained</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="leading-relaxed mb-3">The extension requires the following Chrome permissions:</p>
                  <div className="space-y-2">
                    <p><strong>1. activeTab, tabs:</strong> To detect when you&apos;re on a job posting page and analyze the content</p>
                    <p><strong>2. storage:</strong> To save your preferences, cached data, and analysis results locally</p>
                    <p><strong>3. identity:</strong> To enable Google sign-in for cloud synchronization</p>
                    <p><strong>4. contextMenus:</strong> To provide right-click menu options for quick actions</p>
                    <p><strong>5. clipboardWrite:</strong> To allow copying job descriptions and skills to your clipboard</p>
                    <p><strong>6. sidePanel:</strong> To display the extension interface as a side panel</p>
                    <p><strong>7. host_permissions:</strong> To access content on job posting websites (LinkedIn, Indeed, etc.) for analysis</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Your Rights and Choices */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Your Rights and Choices</h3>
                <div className="space-y-4 text-gray-300">
                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Access and Control</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li><strong>View Your Data:</strong> Access all data we&apos;ve collected about you</li>
                      <li><strong>Download Your Data:</strong> Export your saved jobs and analysis results</li>
                      <li><strong>Delete Your Data:</strong> Request deletion of all your personal data</li>
                      <li><strong>Update Your Data:</strong> Modify your profile information and preferences</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">Privacy Options</h4>
                    <ul className="list-disc list-inside space-y-1 pl-4">
                      <li><strong>Anonymous Mode:</strong> Use the extension without signing in (limited features)</li>
                      <li><strong>Data Deletion:</strong> Clear specific job analyses or all saved data</li>
                      <li><strong>Sign Out:</strong> Remove authentication and clear session data</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-blue-300 mb-2">How to Exercise Your Rights</h4>
                    <p className="leading-relaxed mb-2">To exercise any of these rights:</p>
                    <ol className="list-decimal list-inside space-y-1 pl-4">
                      <li>Sign out from the extension (clears local and session data)</li>
                      <li>Contact us at [your-email@example.com] for data deletion requests</li>
                      <li>Revoke extension permissions through Chrome settings</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>

            {/* Children's Privacy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 55% 20%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Children&apos;s Privacy</h3>
                <div className="text-gray-300">
                  <p className="leading-relaxed">
                    Fit2Hire is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
                  </p>
                </div>
              </div>
            </div>

            {/* California Privacy Rights (CCPA) */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 65% 40%, #7209b722 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">California Privacy Rights (CCPA)</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="leading-relaxed">If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Right to Know:</strong> Request information about data collected and how it&apos;s used</li>
                    <li><strong>Right to Delete:</strong> Request deletion of your personal information</li>
                    <li><strong>Right to Opt-Out:</strong> Opt-out of the sale of personal information (we do not sell data)</li>
                    <li><strong>Right to Non-Discrimination:</strong> Equal service regardless of exercising privacy rights</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* European Privacy Rights (GDPR) */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 40% 30%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">European Privacy Rights (GDPR)</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="leading-relaxed">If you are located in the European Economic Area (EEA), you have rights under the General Data Protection Regulation (GDPR):</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li><strong>Legal Basis:</strong> We process data based on your consent and legitimate interests</li>
                    <li><strong>Data Portability:</strong> Request your data in a machine-readable format</li>
                    <li><strong>Right to Object:</strong> Object to processing of your personal data</li>
                    <li><strong>Right to Restrict:</strong> Restrict how we process your data</li>
                    <li><strong>Supervisory Authority:</strong> Right to lodge a complaint with your local data protection authority</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Changes to This Privacy Policy */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 mb-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 60% 20%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Changes to This Privacy Policy</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">
                    We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. When we make changes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>We will update the &ldquo;Last Updated&rdquo; date at the top of this policy</li>
                    <li>For significant changes, we will notify users through the extension</li>
                    <li>Continued use of the extension after changes constitutes acceptance</li>
                  </ul>
                  <p className="leading-relaxed mt-4">
                    We encourage you to review this policy periodically to stay informed about how we protect your information.
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 50% 50%, #4361ee22 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Contact Information</h3>
                <div className="space-y-3 text-gray-300">
                  <p className="leading-relaxed">
                    If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
                  </p>
                  <ul className="space-y-2">
                    <li><strong>Email:</strong> [your-email@example.com]</li>
                    <li><strong>GitHub:</strong> [your-github-repo-url]</li>
                    <li><strong>Support:</strong> Create an issue at [your-github-repo-url/issues]</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Consent */}
            <div className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition duration-300 hover:-translate-y-2 hover:scale-[1.01] overflow-hidden">
              <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                background: "radial-gradient(circle at 35% 50%, #4cc9f022 0%, transparent 75%)"
              }} />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-white mb-4">Consent</h3>
                <div className="space-y-4 text-gray-300">
                  <p className="leading-relaxed">By using Fit2Hire, you consent to:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>The collection and use of information as described in this Privacy Policy</li>
                    <li>The processing of your data for the purposes outlined above</li>
                    <li>The storage of data in accordance with our retention policies</li>
                    <li>The use of third-party services as described in this policy</li>
                  </ul>

                  <p className="leading-relaxed mt-4">You can withdraw your consent at any time by:</p>
                  <ul className="list-disc list-inside space-y-1 pl-4">
                    <li>Signing out of the extension</li>
                    <li>Uninstalling the extension</li>
                    <li>Contacting us to request data deletion</li>
                  </ul>

                  <p className="leading-relaxed font-semibold text-blue-300 mt-6">
                    Acknowledgment: By installing and using Fit2Hire, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#111624]/90 border-t border-blue-900 py-10 mt-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-2">
              <span className="text-2xl font-bold text-white tracking-tight">
                Fit2Hire
              </span>
              <span className="text-gray-400 text-sm">
                Your AI-powered job application assistant
              </span>
            </div>
            <div className="flex flex-wrap gap-8 text-center md:text-left">
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Product</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="/#features" className="hover:text-blue-400 transition">Features</a></li>
                  <li><a href="/pricing" className="hover:text-blue-400 transition">Pricing</a></li>
                  <li><a href="/#faq" className="hover:text-blue-400 transition">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-300 mb-2">Legal</h4>
                <ul className="space-y-1 text-gray-400 text-sm">
                  <li><a href="/privacy" className="hover:text-blue-400 transition">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-blue-400 transition">Terms of Service</a></li>
                  <li><a href="/refund" className="hover:text-blue-400 transition">Refund Policy</a></li>
                  <li><a href="/contact" className="hover:text-blue-400 transition">Contact Us</a></li>
                </ul>
              </div>
            </div>
            <div className="flex items-center gap-5 mt-6 md:mt-0">
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 5.9c-.8.36-1.67.61-2.58.72a4.37 4.37 0 0 0 1.92-2.42c-.85.5-1.8.87-2.81 1.07A4.34 4.34 0 0 0 12.06 8c0 .34.04.66.1.97-3.61-.19-6.81-1.91-8.95-4.53a4.44 4.44 0 0 0-.59 2.17c0 1.5.76 2.82 1.92 3.6-.7 0-1.36-.2-1.93-.53v.06c0 2.09 1.48 3.83 3.45 4.23-.36.1-.73.16-1.11.16-.27 0-.53-.03-.78-.07.53 1.64 2.09 2.83 3.92 2.86a8.73 8.73 0 0 1-5.43 1.87c-.35 0-.7-.02-1.04-.06a12.37 12.37 0 0 0 6.69 1.96c8.04 0 12.45-6.66 12.45-12.44 0-.19-.01-.38-.02-.57A8.6 8.6 0 0 0 24 4.56a8.74 8.74 0 0 1-2.54.7z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-400 transition">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 10.268h-3v-4.604c0-1.097-.02-2.508-1.529-2.508-1.529 0-1.764 1.193-1.764 2.427v4.685h-3v-9h2.887v1.233h.041c.402-.762 1.379-1.563 2.841-1.563 3.042 0 3.604 2.003 3.604 4.605v4.725z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} Fit2Hire. All rights reserved.
          </div>
        </footer>
      </main>
    </div>
  );
}

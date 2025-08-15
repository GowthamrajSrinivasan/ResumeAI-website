import Link from 'next/link';

const blogPosts = [
  {
    slug: 'requill-best-chrome-extension-2025',
    title: 'Best Chrome Extension for LinkedIn Summaries in 2025',
    excerpt: 'Save hours on LinkedIn. Use Requill for instant summaries, profile insights & personalized replies.',
    publishedAt: '2025-01-15',
    author: 'Requill Team'
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-gradient-radial text-gray-200 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 py-4 px-4 shadow-xl text-white rounded-b-2xl backdrop-blur-lg bg-opacity-90">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-extrabold">Requill - Blog</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 via-blue-200 to-purple-400 bg-clip-text text-transparent mb-4">
            Blog
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Insights, tips, and updates from the Requill team
          </p>
        </div>

        <div className="space-y-8">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="block cursor-pointer"
            >
              <article className="relative rounded-2xl border border-blue-900 bg-[#181c28]/80 backdrop-blur-md shadow-2xl p-8 transition hover:-translate-y-2 hover:scale-[1.02] overflow-hidden">
                <div className="pointer-events-none absolute inset-0 rounded-2xl" style={{
                  background: "radial-gradient(circle at 50% 15%, #4361ee22 0%, transparent 80%)"
                }} />
                <div className="relative z-10">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <time dateTime={post.publishedAt}>
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </time>
                    <span className="mx-2">•</span>
                    <span>{post.author}</span>
                  </div>
                  
                  <h2 className="text-2xl font-semibold text-white mb-3 hover:text-blue-400 transition-colors drop-shadow-lg">
                    {post.title}
                  </h2>
                  
                  <p className="text-gray-300 mb-4">{post.excerpt}</p>
                  
                  <div className="inline-flex items-center text-blue-400 font-medium hover:text-blue-300 transition-colors">
                    Read more
                    <svg
                      className="ml-1 w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
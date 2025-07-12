"use client";

import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  // Redirect to the static HTML login page
  if (typeof window !== 'undefined') {
    window.location.href = '/index.html';
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Redirecting to login...</p>
    </div>
  );
}
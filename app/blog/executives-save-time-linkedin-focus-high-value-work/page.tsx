import Link from 'next/link';
import { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'How Can Executives Save Time on LinkedIn and Focus on High-Value Work | Requill',
  description: 'Requill helps executives cut through LinkedIn noise, save hours each week, and focus on tasks that truly matter.',
};

export default function ExecutivesSaveTimeLinkedInPost() {
  return <BlogContent />;
}
import Link from 'next/link';
import { Metadata } from 'next';
import BlogContent from './BlogContent';

export const metadata: Metadata = {
  title: 'How Professionals Save Hours on LinkedIn Networking Every Week | Requill',
  description: 'Use Requill to automate summaries and replies directly inside LinkedIn, freeing you from endless scrolling and repetitive typing.',
};

export default function ProfessionalsSaveHoursNetworkingPost() {
  return <BlogContent />;
}
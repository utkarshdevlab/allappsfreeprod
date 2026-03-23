import { getAllTools } from '@/utils/tools';
import type { Metadata } from 'next';
import ListingClient from '@/components/ListingClient';



export const metadata: Metadata = {
  title: 'All Tools & Apps - All Apps Free Directory',
  description: 'Explore our complete directory of free online tools, productivity apps, and entertainment utilities. Fully unlocked premium features with no ads.',
  alternates: {
    canonical: '/tools',
  },
};

export const dynamic = 'force-static';

export default function ToolsPage() {
  const tools = getAllTools();

  return (
    <ListingClient
      initialTools={tools}
      title="All Tools & Apps"
      description={`Browse our collection of ${tools.length} professional-grade tools and utilities, completely free and unlocked.`}
      icon="🛠️"
      gradient="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
    />
  );
}

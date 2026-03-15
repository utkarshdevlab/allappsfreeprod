import { getAllTools } from '@/utils/tools';
import type { Metadata } from 'next';
import ListingClient from '@/components/ListingClient';

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

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
      gradient="bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#3b82f6]"
    />
  );
}

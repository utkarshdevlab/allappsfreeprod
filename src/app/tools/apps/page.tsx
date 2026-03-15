import { getToolsByType } from '@/utils/tools';
import type { Metadata } from 'next';
import ListingClient from '@/components/ListingClient';

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

export const metadata: Metadata = {
  title: 'Productivity Apps & Tools - All Apps Free',
  description: 'Explore our suite of productivity apps, calculators, and developer utilities. All premium features unlocked, completely free to use.',
  alternates: {
    canonical: '/tools/apps',
  },
};

export const dynamic = 'force-static';

export default function AppsPage() {
  const apps = getToolsByType('app');

  return (
    <ListingClient
      initialTools={apps}
      title="Productivity Apps & Tools"
      description={`Master your workflow with ${apps.length} powerful utilities. From finance calculators to developer tools.`}
      icon="⚙️"
      gradient="bg-gradient-to-br from-[#083344] via-[#0e7490] to-[#06b6d4]"
      type="app"
    />
  );
}

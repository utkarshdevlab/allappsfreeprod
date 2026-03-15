import { getToolsByType } from '@/utils/tools';
import type { Metadata } from 'next';
import ListingClient from '@/components/ListingClient';

const canonicalBase = process.env.NEXT_PUBLIC_CANONICAL_BASE_URL ?? 'https://www.allappsfree.com';

export const metadata: Metadata = {
  title: 'Free Online Games - All Apps Free',
  description: 'Play a wide range of free online games including puzzles, arcade classics, and strategy games. No downloads, no ads, just instant fun.',
  alternates: {
    canonical: '/tools/games',
  },
};

export const dynamic = 'force-static';

export default function GamesPage() {
  const games = getToolsByType('game');

  return (
    <ListingClient
      initialTools={games}
      title="Free Online Games"
      description={`Discover ${games.length} amazing games to play directly in your browser. From classics to modern puzzles.`}
      icon="🎮"
      gradient="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"
      type="game"
    />
  );
}

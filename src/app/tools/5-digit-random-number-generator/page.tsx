import { Metadata } from 'next';
import FiveDigitRandomNumberGenerator from '@/components/tools/FiveDigitRandomNumberGenerator';

export const metadata: Metadata = {
  title: '5 Digit Random Number Generator - Free Online Tool | All Apps Free',
  description: 'Generate secure 5-digit random numbers instantly. Perfect for verification codes, PIN codes, lottery numbers, and testing. Free, unlimited, and private.',
  keywords: [
    '5 digit random number generator',
    'random 5 digit number',
    'verification code generator',
    'PIN code generator',
    'random number generator',
    'secure random numbers',
    'lottery number generator',
    '5 digit code generator',
    'online random generator',
    'free random numbers',
    'random number tool',
    'numeric code generator',
    '5 digit PIN',
    'random verification code',
    'secure code generator'
  ],
  authors: [{ name: 'All Apps Free' }],
  creator: 'All Apps Free',
  publisher: 'All Apps Free',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://www.allappsfree.com'),
  alternates: {
    canonical: '/tools/5-digit-random-number-generator',
  },
  openGraph: {
    title: '5 Digit Random Number Generator - Free Online Tool',
    description: 'Generate secure 5-digit random numbers instantly. Perfect for verification codes, PIN codes, and testing. Free, unlimited, and private.',
    url: 'https://www.allappsfree.com/tools/5-digit-random-number-generator',
    siteName: 'All Apps Free',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/5-digit-random-number-generator.png',
        width: 1200,
        height: 630,
        alt: '5 Digit Random Number Generator Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '5 Digit Random Number Generator - Free Online Tool',
    description: 'Generate secure 5-digit random numbers instantly. Perfect for verification codes, PIN codes, and testing.',
    images: ['/images/5-digit-random-number-generator.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function FiveDigitRandomNumberGeneratorPage() {
  return <FiveDigitRandomNumberGenerator />;
}

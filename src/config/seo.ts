// Centralized SEO Configuration
export const seoConfig = {
  // Site Information
  siteName: 'All Apps Free',
  siteUrl: 'https://allappsfree.com',
  siteDescription: 'Discover amazing games and useful tools. Everything you need, completely free. Play games, use utilities, and explore our collection of free online tools.',
  
  // Social Media
  social: {
    twitter: '@allappsfree',
    facebook: 'allappsfree',
    instagram: 'allappsfree',
  },
  
  // Analytics IDs (Replace with your actual IDs)
  analytics: {
    googleAnalyticsId: 'G-XXXXXXXXXX', // Replace with your GA4 ID
    googleSearchConsoleId: 'XXXXXXXXXXXXXXXXX', // Replace with your Search Console verification
    microsoftClarityId: '', // Optional: Microsoft Clarity
    hotjarId: '', // Optional: Hotjar
  },
  
  // Default SEO Tags
  defaultSEO: {
    title: 'All Apps Free - Games & Tools',
    description: 'Discover amazing games and useful tools. Everything you need, completely free.',
    keywords: [
      'free games',
      'online tools',
      'utilities',
      'apps',
      'games',
      'free software',
      'web tools',
      'productivity tools',
      'QR code generator',
      'image converter',
      'resume checker',
      'password generator'
    ],
    author: 'All Apps Free',
    language: 'en',
    locale: 'en_US',
  },
  
  // Open Graph
  openGraph: {
    type: 'website',
    siteName: 'All Apps Free',
    images: [
      {
        url: 'https://allappsfree.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'All Apps Free - Games & Tools',
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    cardType: 'summary_large_image',
    site: '@allappsfree',
    creator: '@allappsfree',
  },
  
  // Structured Data
  organization: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'All Apps Free',
    url: 'https://allappsfree.com',
    logo: 'https://allappsfree.com/logo.png',
    description: 'Free online games and tools for everyone',
    sameAs: [
      'https://twitter.com/allappsfree',
      'https://facebook.com/allappsfree',
      'https://instagram.com/allappsfree',
    ],
  },
  
  // Verification Codes
  verification: {
    google: '', // Google Search Console verification code
    bing: '', // Bing Webmaster verification code
    yandex: '', // Yandex verification code
    pinterest: '', // Pinterest verification code
  },
};

// Generate page-specific SEO
export function generatePageSEO(page: {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: string;
}) {
  const baseUrl = seoConfig.siteUrl;
  const fullTitle = page.title 
    ? `${page.title} | ${seoConfig.siteName}` 
    : seoConfig.defaultSEO.title;
  
  return {
    title: fullTitle,
    description: page.description || seoConfig.defaultSEO.description,
    keywords: [...(page.keywords || []), ...seoConfig.defaultSEO.keywords].join(', '),
    openGraph: {
      title: fullTitle,
      description: page.description || seoConfig.defaultSEO.description,
      url: page.url ? `${baseUrl}${page.url}` : baseUrl,
      type: page.type || 'website',
      images: [
        {
          url: page.image || seoConfig.openGraph.images[0].url,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      siteName: seoConfig.siteName,
    },
    twitter: {
      card: seoConfig.twitter.cardType,
      title: fullTitle,
      description: page.description || seoConfig.defaultSEO.description,
      images: [page.image || seoConfig.openGraph.images[0].url],
      site: seoConfig.twitter.site,
      creator: seoConfig.twitter.creator,
    },
  };
}

import { seoConfig } from '@/config/seo';

interface StructuredDataProps {
  type?: 'website' | 'tool' | 'game' | 'article';
  data?: Record<string, unknown>;
}

export default function StructuredData({ type = 'website', data }: StructuredDataProps) {
  const getStructuredData = () => {
    const baseData = {
      '@context': 'https://schema.org',
    };

    switch (type) {
      case 'website':
        return {
          ...baseData,
          '@type': 'WebSite',
          name: seoConfig.siteName,
          url: seoConfig.siteUrl,
          description: seoConfig.siteDescription,
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${seoConfig.siteUrl}/tools?search={search_term_string}`,
            },
            'query-input': 'required name=search_term_string',
          },
        };

      case 'tool':
      case 'game':
        return {
          ...baseData,
          '@type': type === 'game' ? 'Game' : 'SoftwareApplication',
          name: data?.name || '',
          description: data?.description || '',
          url: data?.url || '',
          applicationCategory: type === 'game' ? 'Game' : 'UtilityApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          aggregateRating: data?.rating ? {
            '@type': 'AggregateRating',
            ratingValue: data.rating,
            ratingCount: data.ratingCount || 100,
            bestRating: 100,
            worstRating: 0,
          } : undefined,
        };

      case 'article':
        return {
          ...baseData,
          '@type': 'Article',
          headline: data?.title || '',
          description: data?.description || '',
          image: data?.image || '',
          author: {
            '@type': 'Organization',
            name: seoConfig.siteName,
          },
          publisher: {
            '@type': 'Organization',
            name: seoConfig.siteName,
            logo: {
              '@type': 'ImageObject',
              url: `${seoConfig.siteUrl}/logo.png`,
            },
          },
          datePublished: data?.datePublished || new Date().toISOString(),
          dateModified: data?.dateModified || new Date().toISOString(),
        };

      default:
        return baseData;
    }
  };

  const structuredData = getStructuredData();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

// Breadcrumb structured data
export function BreadcrumbStructuredData({ items }: { items: Array<{ name: string; url: string }> }) {
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
    />
  );
}

// FAQ structured data
export function FAQStructuredData({ faqs }: { faqs: Array<{ question: string; answer: string }> }) {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

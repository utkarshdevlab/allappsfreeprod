import { Metadata } from 'next';
import FakeCreditCardGenerator from '@/components/tools/FakeCreditCardGenerator';

export const metadata: Metadata = {
  title: "Fake Credit Card Generator - Luhn Validated Test Cards for Development",
  description: "Generate Luhn-validated fake credit card numbers for testing. Support Visa, Mastercard, Amex, Discover, JCB, Diners Club, UnionPay with CVV and expiry dates. Free tool for developers.",
  keywords: [
    "fake credit card generator",
    "test credit card numbers",
    "luhn algorithm",
    "credit card testing",
    "payment gateway testing",
    "visa generator",
    "mastercard generator",
    "amex generator",
    "discover generator",
    "development testing",
    "qa testing",
    "e-commerce testing",
    "card validation testing",
    "cvv generator",
    "expiry date generator",
    "bulk card generation",
    "test payment data"
  ],
  openGraph: {
    title: "Fake Credit Card Generator - Free Testing Tool",
    description: "Generate Luhn-validated test credit card numbers for development and QA testing. Support 7 major card types with complete details.",
    type: "website",
    url: "https://www.allappsfree.com/tools/fake-credit-card-generator",
    images: [
      {
        url: "https://www.allappsfree.com/images/credit-card-icon.png",
        width: 1200,
        height: 630,
        alt: "Fake Credit Card Generator - Free Testing Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fake Credit Card Generator - Free Testing Tool",
    description: "Generate Luhn-validated test credit card numbers for development and QA testing. Support 7 major card types.",
    images: ["https://www.allappsfree.com/images/credit-card-icon.png"],
  },
  alternates: {
    canonical: "https://www.allappsfree.com/tools/fake-credit-card-generator",
  },
};

export default function FakeCreditCardGeneratorPage() {
  return <FakeCreditCardGenerator />;
}

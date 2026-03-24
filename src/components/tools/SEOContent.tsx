import React from 'react';
import { FAQStructuredData } from '../StructuredData';

export function SEOContent({ children, title }: { children: React.ReactNode; title?: React.ReactNode }) {
    return (
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 mb-12 border border-blue-100">
            <div className="prose prose-lg max-w-none text-gray-700">
                {title && <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>}
                {children}
            </div>
        </div>
    );
}

export function UseCasesSection({
    title = "Use Cases",
    cases
}: {
    title?: React.ReactNode;
    cases: { title: string; description: React.ReactNode }[]
}) {
    return (
        <div className="mt-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {cases.map((c, i) => (
                    <div key={i} className="bg-blue-50/50 rounded-xl p-6 border border-blue-100/50">
                        <h4 className="text-lg font-bold text-gray-900 mb-2">{c.title}</h4>
                        <div className="text-gray-600 mb-0 leading-relaxed text-base">{c.description}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export function FeaturesSection({
    title = "Key Features",
    features
}: {
    title?: React.ReactNode;
    features: React.ReactNode[]
}) {
    return (
        <div className="mt-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
            <ul className="space-y-3 list-none pl-0">
                {features.map((f, i) => (
                    <li key={i} className="flex items-start">
                        <span className="text-blue-500 font-bold mr-3 mt-1 select-none">✓</span>
                        <span className="text-gray-700">{f}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function FAQSection({
    title = "Frequently Asked Questions",
    faqs
}: {
    title?: React.ReactNode;
    faqs: { question: string; answer: string }[]
}) {
    return (
        <div className="mt-10 mb-8 border-t border-gray-100 pt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">{title}</h3>
            <div className="space-y-6">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white">
                        <h4 className="font-bold text-gray-900 mb-2 text-lg">{faq.question}</h4>
                        <p className="text-gray-600 mb-0 leading-relaxed text-base">{faq.answer}</p>
                    </div>
                ))}
            </div>
            <FAQStructuredData faqs={faqs} />
        </div>
    );
}

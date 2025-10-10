'use client';

import { useMemo, useState } from 'react';

type PricingTier = 'Free' | 'Freemium' | 'Paid';

interface DirectoryEntry {
  name: string;
  description: string;
  pricing: PricingTier;
  url: string;
  highlights: string[];
}

interface RoleDirectory {
  id: string;
  title: string;
  description: string;
  tools: DirectoryEntry[];
}

const directory: RoleDirectory[] = [
  {
    id: 'product-managers',
    title: 'Product Managers',
    description: 'Validate roadmaps faster, prioritise backlogs, and gather feedback with AI copilots tuned for strategic product work.',
    tools: [
      {
        name: 'Productboard AI',
        description: 'Automated customer insight clustering and prioritisation recommendations synced with your product roadmap.',
        pricing: 'Paid',
        url: 'https://www.productboard.com/product/ai/',
        highlights: ['Feedback summarisation', 'Opportunity scoring', 'Roadmap insights'],
      },
      {
        name: 'Notion Q&A',
        description: "Ask questions across product specs, meeting notes, and research docs—Notion's AI surfaces answers instantly.",
        pricing: 'Freemium',
        url: 'https://www.notion.so/product/ai',
        highlights: ['Instant knowledge base', 'Meeting recap drafts', 'Cross-document search'],
      },
      {
        name: 'Amplitude Experiment AI',
        description: 'Generate experiment ideas and analyse results in plain language to drive confident product decisions.',
        pricing: 'Paid',
        url: 'https://amplitude.com/experiment/ai',
        highlights: ['Experiment ideation', 'Impact summaries', 'Natural language analytics'],
      },
    ],
  },
  {
    id: 'designers',
    title: 'Designers',
    description: 'Ship concepts faster with AI partners for ideation, prototyping, and production-ready assets.',
    tools: [
      {
        name: 'Figma AI',
        description: 'Generate layouts, edit copy, and automate repetitive tweaks right inside your Figma files.',
        pricing: 'Freemium',
        url: 'https://www.figma.com/ai/',
        highlights: ['Layout suggestions', 'Content rewriting', 'Component automation'],
      },
      {
        name: 'Uizard Autodesigner',
        description: 'Turn text prompts or sketches into polished UI mockups with instantly editable components.',
        pricing: 'Freemium',
        url: 'https://uizard.io/autodesigner/',
        highlights: ['Prompt to prototype', 'Brand styling', 'Multi-platform export'],
      },
      {
        name: 'Midjourney',
        description: 'Create high-fidelity visual concepts, hero imagery, and brand explorations in seconds.',
        pricing: 'Paid',
        url: 'https://www.midjourney.com/home',
        highlights: ['Photorealistic renders', 'Style blending', 'Community inspiration'],
      },
    ],
  },
  {
    id: 'developers',
    title: 'Developers',
    description: 'Boost velocity with AI pair programmers, testing copilots, and deployment helpers.',
    tools: [
      {
        name: 'GitHub Copilot',
        description: 'Autocomplete entire functions, write tests, and chat with repositories using the GitHub coding assistant.',
        pricing: 'Paid',
        url: 'https://github.com/features/copilot',
        highlights: ['Editor autocompletion', 'Copilot Chat', 'Test generation'],
      },
      {
        name: 'Cursor',
        description: 'An AI-native IDE optimised for multi-file edits, refactors, and context-aware code explanations.',
        pricing: 'Freemium',
        url: 'https://cursor.com/',
        highlights: ['Inline edit suggestions', 'Repo-level context', 'Prompt playground'],
      },
      {
        name: 'Vercel v0',
        description: 'Generate production-ready React or Next.js interfaces from prompts and iterate visually.',
        pricing: 'Free',
        url: 'https://v0.dev/',
        highlights: ['Prompt to UI', 'Component iteration', 'One-click deploy'],
      },
    ],
  },
  {
    id: 'growth-marketing',
    title: 'Growth & Marketing',
    description: 'Scale campaigns, landing pages, and analytics with AI support tuned for acquisition teams.',
    tools: [
      {
        name: 'Jasper',
        description: 'Generate on-brand marketing copy, campaign briefs, and SEO content with team-wide style guides.',
        pricing: 'Paid',
        url: 'https://www.jasper.ai/',
        highlights: ['Brand voice controls', 'Campaign workflows', 'SEO optimisation'],
      },
      {
        name: 'Copy.ai',
        description: 'Automate cold outreach, product messaging, and nurture sequences with reusable prompt templates.',
        pricing: 'Freemium',
        url: 'https://www.copy.ai/',
        highlights: ['Marketing workflows', 'Sales email sequences', 'Template library'],
      },
      {
        name: 'HubSpot Content Assistant',
        description: 'Draft blog posts, landing pages, and emails directly inside HubSpot’s CRM and CMS suite.',
        pricing: 'Freemium',
        url: 'https://www.hubspot.com/products/ai',
        highlights: ['CRM-connected content', 'Email copy suggestions', 'SEO outlines'],
      },
    ],
  },
];

const pricingBadgeStyles: Record<PricingTier, string> = {
  Free: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Freemium: 'bg-amber-50 text-amber-700 border border-amber-200',
  Paid: 'bg-fuchsia-50 text-fuchsia-700 border border-fuchsia-200',
};

export default function AIDirectory() {
  const [activeRoleId, setActiveRoleId] = useState<RoleDirectory['id']>(directory[0].id);

  const roleTabs = useMemo(
    () =>
      directory.map((role) => ({
        id: role.id,
        title: role.title,
      })),
    []
  );

  const activeRole = useMemo(
    () => directory.find((role) => role.id === activeRoleId) ?? directory[0],
    [activeRoleId]
  );

  return (
    <div className="space-y-10">
      <section className="rounded-3xl bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white p-10 shadow-2xl border border-white/10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <p className="uppercase tracking-[0.35em] text-white/60 text-xs">Curated AI Stack</p>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight">AI Directory for Modern Product Teams</h1>
            <p className="text-white/80 text-base lg:text-lg">
              Browse trusted AI platforms across product management, design, engineering, and growth. Each listing links directly to the official homepage and
              includes a pricing label so you can plan quickly.
            </p>
            <div className="flex flex-wrap gap-3 text-sm text-white/70">
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full">Role-based filters</span>
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full">Free & paid listings</span>
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full">Handpicked references</span>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 space-y-3 min-w-[240px]">
            <div className="text-xs uppercase tracking-[0.3em] text-white/70">Currently browsing</div>
            <div className="text-2xl font-bold">{activeRole.title}</div>
            <p className="text-sm text-white/70 leading-relaxed">{activeRole.description}</p>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-8">
        <div className="flex flex-wrap gap-3">
          {roleTabs.map((tab) => {
            const isActive = tab.id === activeRoleId;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveRoleId(tab.id)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition border ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white border-transparent shadow-lg shadow-purple-200'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activeRole.tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-700 transition-colors">{tool.name}</h2>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${pricingBadgeStyles[tool.pricing]}`}>
                  {tool.pricing}
                </span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{tool.description}</p>
              <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                {tool.highlights.map((highlight) => (
                  <span
                    key={highlight}
                    className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100"
                  >
                    {highlight}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center text-sm font-semibold text-purple-600">
                Visit homepage
                <svg
                  className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 7l-10 10m0-10h10v10" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="bg-emerald-50 border border-emerald-100 rounded-3xl p-8 shadow-lg">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-emerald-900">How to use this directory</h3>
            <p className="text-sm text-emerald-700">
              Jump into a role, scan highlights, and click through to evaluate the official product page in seconds.
            </p>
          </div>
          <ul className="space-y-2 text-sm text-emerald-800 md:col-span-2">
            <li className="flex items-start gap-3">
              <span className="text-lg">✨</span>
              <p><strong>Spot opportunities.</strong> Pair a free prototyping tool with a paid analytics assistant to cover your workflow end-to-end.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🗺️</span>
              <p><strong>Plan budgets.</strong> Pricing badges help you align subscriptions with team size before deep dives.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-lg">🚀</span>
              <p><strong>Move fast.</strong> Each link opens the vendor homepage so you can explore demos, pricing, and documentation immediately.</p>
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}

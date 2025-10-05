import RandomDigitGeneratorBase from './RandomDigitGeneratorBase';

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">What Is a 5-Digit Number Generator?</h2>
      <p className="text-gray-600 leading-relaxed">
        A five-digit generator creates random numbers between <strong>10000</strong> and <strong>99999</strong> (or 00000 to 99999 with zero padding). Businesses use
        these compact IDs for coupons, queue tickets, referral codes, and QA datasets. The AllAppsFree generator delivers agency-level control with zero cost
        and zero limits.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Premium Features Included</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-indigo-800 font-semibold">Bulk & Control</h4>
          <ul className="space-y-1 text-sm text-indigo-900">
            <li>✔️ Generate up to 500 numbers instantly</li>
            <li>✔️ Toggle duplicate prevention with one click</li>
            <li>✔️ Add prefixes/suffixes for campaign branding</li>
            <li>✔️ Apply digit-sum and divisible-by filters</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-blue-800 font-semibold">Deploy Anywhere</h4>
          <ul className="space-y-1 text-sm text-blue-900">
            <li>✔️ Copy batches or single values instantly</li>
            <li>✔️ Export CSV, JSON, or TXT for automation</li>
            <li>✔️ No ads, signups, or paywalls to slow you down</li>
            <li>✔️ Responsive experience on desktop and mobile</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Where 5-Digit Numbers Shine</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Marketing & Growth</h4>
          <p className="text-sm text-gray-600">Launch promo codes, referral IDs, and loyalty points that integrate directly with CRM and e-commerce systems.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Operations & Product</h4>
          <p className="text-sm text-gray-600">Create queue tickets, QA sample data, and short-lived access codes for prototypes or staging environments.</p>
        </div>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Get Flawless 5-Digit Batches</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Pick a preset that matches your batch size (1, 5, 10, 50, 100, etc.).</li>
        <li>Enable <strong>Prevent duplicates</strong> when every coupon or ticket must stay unique.</li>
        <li>Use <strong>Advanced filters</strong> to meet analytic or compliance requirements.</li>
        <li>Add prefixes/suffixes to keep codes aligned with campaign naming.</li>
        <li>Export or copy immediately and reuse the generator as often as needed.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>How many numbers can I create?</strong> Without zero padding you can generate 90,000 combinations (10000-99999). With padding you unlock the full 100,000 options from 00000-99999.</p>
        <p><strong>Is the tool really free?</strong> Yes—every premium feature is unlocked for all users. No credits, subscriptions, or hidden upgrades.</p>
        <p><strong>Will the codes be stored online?</strong> No. Everything is generated locally in your browser, keeping campaigns private and compliant.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why Teams Choose AllAppsFree</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Fast & Flexible</h4>
          <p className="text-sm text-emerald-900">Generate exact batches on any device with zero friction or setup time.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Enterprise Presentation</h4>
          <p className="text-sm text-purple-900">Enjoy a polished interface backed by modern Next.js performance and export shortcuts.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Generate polished five-digit codes in seconds. From marketing campaigns to operational testing, AllAppsFree keeps every batch accurate, export-ready,
        and completely free.
      </p>
    </section>
  </div>
);

export default function Random5DigitGenerator() {
  return (
    <RandomDigitGeneratorBase
      digitCount={5}
      title="Premium Random 5-Digit Number Generator"
      subtitle="Create bulk 5-digit random numbers with pro controls, exports, history, and favourites."
      seoContent={seoContent}
    />
  );
}

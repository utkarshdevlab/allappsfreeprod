import RandomDigitGeneratorBase from './RandomDigitGeneratorBase';

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">What Is a 6-Digit Number Generator?</h2>
      <p className="text-gray-600 leading-relaxed">
        A 6-digit generator produces random codes between <strong>100000</strong> and <strong>999999</strong> (or 000000 to 999999 when zero padding is enabled).
        Enterprise teams rely on these codes for secure OTP delivery, ticket serials, inventory labels, and marketing vouchers. The AllAppsFree generator
        keeps every batch unique, exportable, and ready for production workflows.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Key Benefits</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-indigo-800 font-semibold">Premium Controls</h4>
          <ul className="space-y-1 text-sm text-indigo-900">
            <li>✔️ Bulk generation up to 500 numbers per run</li>
            <li>✔️ One-click duplicate prevention</li>
            <li>✔️ Zero padding for fixed-length IDs</li>
            <li>✔️ Digit-sum and divisibility filters</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-blue-800 font-semibold">Deployment Ready</h4>
          <ul className="space-y-1 text-sm text-blue-900">
            <li>✔️ Copy numbers individually or in bulk</li>
            <li>✔️ Export CSV, JSON, or TXT instantly</li>
            <li>✔️ No ads, no logins, no watermarks</li>
            <li>✔️ Works smoothly on desktop and mobile</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Where to Use 6-Digit Codes</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Security & Authentication</h4>
          <p className="text-sm text-gray-600">Deliver reliable OTPs and verification tokens for 2FA, password resets, and secure lockers.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Operations & Marketing</h4>
          <p className="text-sm text-gray-600">Issue ticket serials, coupon codes, and loyalty numbers that sync directly with CRM or POS systems.</p>
        </div>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Generate Perfect 6-Digit Lists</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Start with the quantity preset (1, 5, 10, 50, 100…) that matches your batch size.</li>
        <li>Enable <strong>Prevent duplicates</strong> when every code must be unique.</li>
        <li>Turn on <strong>Allow zero padding</strong> to produce codes like 001245 or 009999.</li>
        <li>Use <strong>Advanced filters</strong> to enforce digit-sum totals or divisible-by rules required by internal logic.</li>
        <li>Copy or export immediately—CSV for spreadsheets, JSON for APIs, TXT for messaging platforms.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>How many unique numbers can I create?</strong> Without zero padding you have 900,000 options (100000-999999). With padding, the pool expands to 1,000,000 combinations.</p>
        <p><strong>Is the randomness secure enough?</strong> Math.random() is ideal for business tooling and campaigns. For cryptographic use, pair exports with server-side RNG validation.</p>
        <p><strong>Are my codes stored?</strong> No. All generation runs locally in your browser—nothing is uploaded or saved by AllAppsFree.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why Teams Trust AllAppsFree</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Fast & Private</h4>
          <p className="text-sm text-emerald-900">No sign-up walls, no ads, and no tracking pixels. Generate at lightning speed with complete privacy.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Enterprise Polish</h4>
          <p className="text-sm text-purple-900">Built on modern Next.js architecture with export shortcuts, responsive design, and batch-friendly controls.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Generate six-digit codes with confidence—whether you are launching a loyalty campaign, issuing secure OTPs, or managing operational IDs, AllAppsFree
        keeps every batch precise, exportable, and completely free forever.
      </p>
    </section>
  </div>
);

export default function Random6DigitGenerator() {
  return (
    <RandomDigitGeneratorBase
      digitCount={6}
      title="Premium Random 6-Digit Number Generator"
      subtitle="Generate bulk random 6-digit numbers with uniqueness, sorting, prefixes, suffixes, and professional exports."
      seoContent={seoContent}
    />
  );
}

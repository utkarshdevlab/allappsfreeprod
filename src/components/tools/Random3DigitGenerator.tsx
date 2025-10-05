import RandomDigitGeneratorBase from './RandomDigitGeneratorBase';

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">What Is a 3-Digit Number Generator?</h2>
      <p className="text-gray-600 leading-relaxed">
        A three-digit generator creates numbers between <strong>100</strong> and <strong>999</strong> (or 000-999 with zero padding). These short codes are ideal for raffle tickets,
        queue tokens, trivia games, and QA experiments. AllAppsFree lets you generate them at scale with the same polish as premium SaaS platforms—no login,
        no ads, and no limits.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Premium Features Included</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-indigo-800 font-semibold">Batch Control</h4>
          <ul className="space-y-1 text-sm text-indigo-900">
            <li>✔️ Generate up to 500 numbers instantly</li>
            <li>✔️ Enforce uniqueness for fair draws</li>
            <li>✔️ Prefix/suffix support for custom formats</li>
            <li>✔️ Digit-sum and divisible-by filters</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-blue-800 font-semibold">Ready for Deployment</h4>
          <ul className="space-y-1 text-sm text-blue-900">
            <li>✔️ Copy individual values or the entire batch</li>
            <li>✔️ Export CSV, JSON, or TXT in one click</li>
            <li>✔️ Zero ads, zero sign-ups, zero watermarks</li>
            <li>✔️ Responsive layout for mobile and desktop</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Where 3-Digit Numbers Help Most</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Events & Engagement</h4>
          <p className="text-sm text-gray-600">Create memorable raffle tickets, trivia scoreboards, and lucky draw entries that audiences can quickly understand.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Operations & QA</h4>
          <p className="text-sm text-gray-600">Generate queue tokens, automation test data, and educational samples for maths or coding lessons.</p>
        </div>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Produce Perfect 3-Digit Lists</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Select a preset quantity (1, 5, 10, 50, 100, etc.) to match your needs.</li>
        <li>Enable <strong>Prevent duplicates</strong> when every ticket or token must be unique.</li>
        <li>Toggle <strong>Allow zero padding</strong> for codes like 001 or 099.</li>
        <li>Apply <strong>Advanced filters</strong> to meet analytic or compliance requirements.</li>
        <li>Export or copy instantly and reuse the tool without any limits.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>How many numbers can I create?</strong> Without zero padding there are 900 combinations (100-999). With zero padding you unlock the full 1,000 options (000-999).</p>
        <p><strong>Can I mix letters?</strong> Yes—use prefixes and suffixes (e.g., “A-512” or “673-B”) to blend alphanumeric codes.</p>
        <p><strong>Is the randomness reliable?</strong> Math.random() provides excellent randomness for business, education, and entertainment use cases.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why AllAppsFree?</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Fast & Private</h4>
          <p className="text-sm text-emerald-900">All processing happens in-browser with zero tracking or data collection—ideal for privacy-sensitive events.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Enterprise Finish</h4>
          <p className="text-sm text-purple-900">Enjoy a minimal, modern UI powered by Next.js with export shortcuts and mobile-friendly controls.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Generate reliable three-digit numbers in seconds. From prize draws to classroom exercises, AllAppsFree keeps every batch accurate, exportable, and
        completely free.
      </p>
    </section>
  </div>
);

export default function Random3DigitGenerator() {
  return (
    <RandomDigitGeneratorBase
      digitCount={3}
      title="Premium Random 3-Digit Number Generator"
      subtitle="Generate bulk 3-digit random numbers with uniqueness, sorting, formatting, history, and export-ready outputs."
      seoContent={seoContent}
    />
  );
}

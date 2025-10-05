import RandomDigitGeneratorBase from './RandomDigitGeneratorBase';

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">What Is a 4-Digit Number Generator?</h2>
      <p className="text-gray-600 leading-relaxed">
        A 4-digit generator outputs random numbers between <strong>1000</strong> and <strong>9999</strong> (or 0000 to 9999 when zero padding is enabled). These concise
        identifiers are perfect for queue tickets, raffle entries, mini OTPs, and QA test cases. AllAppsFree gives you the same polished experience as paid
        tools—without accounts or usage caps.
      </p>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Premium Features Included</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-indigo-800 font-semibold">Control Every Batch</h4>
          <ul className="space-y-1 text-sm text-indigo-900">
            <li>✔️ Generate up to 500 numbers instantly</li>
            <li>✔️ Enforce uniqueness with a single toggle</li>
            <li>✔️ Add prefixes and suffixes for department or campaign codes</li>
            <li>✔️ Apply digit-sum and divisible-by filters for precise datasets</li>
          </ul>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
          <h4 className="text-blue-800 font-semibold">Deploy Anywhere</h4>
          <ul className="space-y-1 text-sm text-blue-900">
            <li>✔️ Copy single values or the full batch</li>
            <li>✔️ Export CSV, JSON, or TXT right away</li>
            <li>✔️ No ads, logins, or paywalls slowing you down</li>
            <li>✔️ Responsive layout for desktop, tablet, and mobile</li>
          </ul>
        </div>
      </div>
    </section>

    <section className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Where 4-Digit Numbers Deliver Value</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Customer Experience</h4>
          <p className="text-sm text-gray-600">Issue queue tokens, service tickets, and event passes that customers can read and remember instantly.</p>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-2">
          <h4 className="font-semibold text-gray-900">Product & Operations</h4>
          <p className="text-sm text-gray-600">Label batches, seed QA tests, or create demo IDs for training sessions and classroom experiments.</p>
        </div>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Get the Best 4-Digit Lists</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Select a preset (1, 5, 10, 50, 100…) and scale as your project grows.</li>
        <li>Enable <strong>Prevent duplicates</strong> to keep every ticket distinct.</li>
        <li>Turn on <strong>Allow zero padding</strong> when you need consistent formats like 0001 or 0123.</li>
        <li>Use <strong>Advanced filters</strong> to balance datasets or meet compliance rules.</li>
        <li>Export instantly and reuse the generator as often as needed—no limits.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>How many numbers can I create?</strong> There are 9,000 combinations between 1000 and 9999. Zero padding expands the range to 10,000 options (0000-9999).</p>
        <p><strong>Can I include letters?</strong> Use prefix/suffix fields (e.g., “A-1234” or “1234-B”) while keeping the numeric core intact.</p>
        <p><strong>Is data stored anywhere?</strong> No—everything is generated within your browser for complete privacy.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why AllAppsFree?</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Clean & Focused</h4>
          <p className="text-sm text-emerald-900">Generate numbers in an ad-free workspace with zero distractions or tracking scripts.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Enterprise Grade</h4>
          <p className="text-sm text-purple-900">Modern Next.js engineering delivers fast interactions, export shortcuts, and reliable batches every time.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Whether you need queue tickets, QA samples, or quick raffle numbers, AllAppsFree keeps every 4-digit batch polished, export-ready, and completely free
        to use.
      </p>
    </section>
  </div>
);

export default function Random4DigitGenerator() {
  return (
    <RandomDigitGeneratorBase
      digitCount={4}
      title="Premium Random 4-Digit Number Generator"
      subtitle="Create professional 4-digit number series with bulk generation, favourites, history, exports, and formatting controls."
      seoContent={seoContent}
    />
  );
}

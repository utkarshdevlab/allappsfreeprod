import DataFormatConverterBase from './DataFormatConverterBase';

const sampleCsv = `id,name,email,plan,mrr
101,Ava Chen,ava.chen@example.com,Growth,129.99
102,Liam Patel,liam.patel@example.com,Scale,299.00`;

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">Turn CSV Files into Structured JSON Instantly</h2>
      <p className="text-gray-600 leading-relaxed">
        Upload or paste comma-separated values and receive API-ready JSON in seconds. This premium CSV to JSON converter handles headers, delimiter changes,
        and pretty-printing so you can move data between spreadsheets, back-end services, and JavaScript applications without manual reformatting.
      </p>
    </section>

    <section className="grid md:grid-cols-2 gap-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-indigo-800 font-semibold">Conversion Superpowers</h3>
        <ul className="space-y-1 text-sm text-indigo-900">
          <li>✔️ Detects headers automatically or generates field names</li>
          <li>✔️ Supports comma, semicolon, tab, and pipe delimiters</li>
          <li>✔️ Pretty-print toggle for readable JSON output</li>
          <li>✔️ Preview panel to verify data before copying</li>
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-blue-800 font-semibold">Where It Fits</h3>
        <ul className="space-y-1 text-sm text-blue-900">
          <li>✔️ Publish spreadsheet exports as JSON APIs for front-end apps</li>
          <li>✔️ Feed automation workflows in Zapier, Make, or custom scripts</li>
          <li>✔️ Prepare product catalogs and inventory lists for headless commerce</li>
          <li>✔️ Convert legacy CSV archives into modern JSON stores</li>
        </ul>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Get Perfect JSON Output</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Drop a `.csv` file or paste rows straight from Excel or Google Sheets.</li>
        <li>Confirm whether the first row contains headers and adjust delimiters if needed.</li>
        <li>Preview the generated JSON array to inspect objects and key names.</li>
        <li>Copy the formatted JSON or download it for immediate integration.</li>
        <li>Reuse history snapshots whenever you re-run weekly or monthly conversions.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>What if my CSV has different delimiters?</strong> Select semicolon, tab, or pipe from the dropdown to match your source file.</p>
        <p><strong>Can I keep the JSON compact?</strong> Disable pretty-printing to generate a compact array ideal for API payloads and storage.</p>
        <p><strong>Is data uploaded anywhere?</strong> No. Conversions happen 100% in your browser, ensuring privacy and compliance.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why Choose AllAppsFree?</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Engineered for Builders</h4>
          <p className="text-sm text-emerald-900">Developers, data teams, and product managers rely on consistent JSON for their pipelines—this tool delivers without paywalls.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Premium UX</h4>
          <p className="text-sm text-purple-900">Enjoy drag-and-drop uploads, instant previews, history restore, and mobile-friendly controls built with Next.js.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Convert CSV datasets into clean JSON arrays whenever inspiration strikes—AllAppsFree keeps the experience fast, private, and entirely free.
      </p>
    </section>
  </div>
);

export default function CsvToJsonConverter() {
  return (
    <DataFormatConverterBase
      mode="csv-to-json"
      title="CSV to JSON Converter"
      subtitle="Transform spreadsheet exports into developer-friendly JSON arrays with header detection, delimiter control, and pretty-print output."
      inputLabel="CSV Input"
      outputLabel="JSON Output"
      inputPlaceholder="Paste CSV rows or upload a .csv file."
      sampleInput={sampleCsv}
      seoContent={seoContent}
    />
  );
}

import DataFormatConverterBase from './DataFormatConverterBase';

const sampleJson = `[
  {
    "id": 101,
    "name": "Ava Chen",
    "email": "ava.chen@example.com",
    "plan": "Growth",
    "mrr": 129.99
  },
  {
    "id": 102,
    "name": "Liam Patel",
    "email": "liam.patel@example.com",
    "plan": "Scale",
    "mrr": 299.0
  }
]`;

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">Convert JSON Arrays to Polished CSV Files</h2>
      <p className="text-gray-600 leading-relaxed">
        This premium JSON to CSV converter transforms complex objects into analytics-ready spreadsheets. Upload or paste JSON arrays, pick a delimiter, and
        download structured CSV output in seconds. Ideal for data teams migrating API payloads into Excel, Google Sheets, CRM imports, or data warehouses.
      </p>
    </section>

    <section className="grid md:grid-cols-2 gap-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-indigo-800 font-semibold">What You Get</h3>
        <ul className="space-y-1 text-sm text-indigo-900">
          <li>✔️ Automatic header detection across nested objects</li>
          <li>✔️ Delimiter control (comma, semicolon, tab, pipe)</li>
          <li>✔️ Quote wrapping to prevent CSV injection issues</li>
          <li>✔️ Preview table for quick QA on the first rows</li>
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-blue-800 font-semibold">Use Cases</h3>
        <ul className="space-y-1 text-sm text-blue-900">
          <li>✔️ Export API responses into BI tools without manual cleanup</li>
          <li>✔️ Generate investor-ready revenue reports from product data</li>
          <li>✔️ Build training datasets for AI/ML experiments</li>
          <li>✔️ Share standardized CSV files with stakeholders and clients</li>
        </ul>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Workflow Tips</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Paste raw JSON or upload a `.json` file directly from Postman, Insomnia, or your backend logs.</li>
        <li>Toggle <strong>Include header row</strong> and <strong>Wrap values in quotes</strong> to meet spreadsheet requirements.</li>
        <li>Review the instant preview to verify field ordering and detect missing keys.</li>
        <li>Copy results to your clipboard or download the CSV for immediate distribution.</li>
        <li>Store frequently used datasets in history and restore them when you need quick updates.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Frequently Asked Questions</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>Does it support nested JSON?</strong> The converter flattens top-level keys. For deeply nested items, pre-process the JSON or map nested fields into top-level keys before conversion.</p>
        <p><strong>Is my data secure?</strong> Everything runs client-side inside your browser. No uploads, tracking, or persistent storage.</p>
        <p><strong>Can I change delimiters?</strong> Yes. Choose comma, semicolon, tab, or pipe to match regional spreadsheet settings.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why AllAppsFree?</h3>
      <div className="grid md:grid-cols-2 gap-5">
        <div className="p-6 rounded-2xl border border-emerald-100 bg-emerald-50">
          <h4 className="font-semibold text-emerald-800">Built for Teams</h4>
          <p className="text-sm text-emerald-900">Premium experience without paywalls—perfect for data analysts, marketers, and founders who need fast conversions.</p>
        </div>
        <div className="p-6 rounded-2xl border border-purple-100 bg-purple-50">
          <h4 className="font-semibold text-purple-800">Enterprise Polish</h4>
          <p className="text-sm text-purple-900">Enjoy a modern interface with copy/download shortcuts, conversion history, and instant previews.</p>
        </div>
      </div>
      <p className="text-gray-600 leading-relaxed">
        Export JSON into high-quality CSV files whenever you need—no logins, no ads, just professional tooling built for web-native teams.
      </p>
    </section>
  </div>
);

export default function JsonToCsvConverter() {
  return (
    <DataFormatConverterBase
      mode="json-to-csv"
      title="JSON to CSV Converter"
      subtitle="Transform clean JSON arrays into spreadsheet-ready CSV files with delimiter control, quote wrapping, and instant previews."
      inputLabel="JSON Input"
      outputLabel="CSV Output"
      inputPlaceholder="Paste an array of JSON objects or upload a .json file."
      sampleInput={sampleJson}
      seoContent={seoContent}
    />
  );
}

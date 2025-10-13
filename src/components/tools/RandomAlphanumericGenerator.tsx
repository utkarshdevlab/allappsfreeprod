"use client";

import { useCallback, useMemo, useState } from "react";

const CHARSETS = {
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
} as const;

const quantityOptions = [1, 5, 10, 25, 50, 100, 250, 500];

const seoContent = (
  <div className="space-y-12">
    <section className="space-y-3">
      <h2 className="text-2xl font-bold text-gray-900">What Is an Alphanumeric Generator?</h2>
      <p className="text-gray-600 leading-relaxed">
        The AllAppsFree alphanumeric generator instantly creates random IDs, reference codes, and secure tokens combining letters, numbers, and symbols.
        Choose the character sets you need, enforce uniqueness, and export your results for frictionless workflows.
      </p>
    </section>

    <section className="grid md:grid-cols-2 gap-5">
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-indigo-800 font-semibold">Powerful Controls</h3>
        <ul className="space-y-1 text-sm text-indigo-900">
          <li>✔️ Custom length from 4 to 64 characters</li>
          <li>✔️ Toggle uppercase, lowercase, digits, and symbols</li>
          <li>✔️ Guarantee uniqueness across the batch</li>
          <li>✔️ Optional prefixes and suffixes for branded codes</li>
        </ul>
      </div>
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 space-y-2">
        <h3 className="text-blue-800 font-semibold">Built for Teams</h3>
        <ul className="space-y-1 text-sm text-blue-900">
          <li>✔️ Export CSV, JSON, or TXT in a click</li>
          <li>✔️ Copy individual codes or the entire batch</li>
          <li>✔️ Works offline in your browser—no data uploads</li>
          <li>✔️ Perfect for coupons, invite codes, API keys, or QA</li>
        </ul>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">How to Generate Pro-Grade Codes</h3>
      <ol className="list-decimal list-inside space-y-2 text-gray-600">
        <li>Select how many codes you need and the character length.</li>
        <li>Enable the character types required by your policy (uppercase, numbers, symbols, etc.).</li>
        <li>Add optional prefixes/suffixes for easy sorting in spreadsheets or CRMs.</li>
        <li>Click <strong>Generate codes</strong>—every result appears instantly with copy/export actions.</li>
        <li>Download the batch as CSV, JSON, or TXT to hand off to your team.</li>
      </ol>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">FAQs</h3>
      <div className="space-y-3 text-gray-600">
        <p><strong>Is this secure?</strong> Codes are generated client-side using pseudo-random logic. For production secrets, pair with server-side verification.</p>
        <p><strong>Do you store my data?</strong> No. Everything runs in your browser; nothing is uploaded or logged.</p>
        <p><strong>Can I ensure uniqueness?</strong> Yes. Toggle <em>Prevent duplicates</em> to guarantee every string is unique within the batch.</p>
      </div>
    </section>

    <section className="space-y-3">
      <h3 className="text-xl font-semibold text-gray-900">Why Teams Choose AllAppsFree</h3>
      <p className="text-gray-600 leading-relaxed">
        From growth marketers to IT admins, thousands rely on AllAppsFree generators to deliver polished, export-ready results without friction.
        Generate alphanumeric codes in bulk, stay compliant with security requirements, and keep your workflows humming.
      </p>
    </section>
  </div>
);

function generateCharset(options: {
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
}) {
  let charset = "";
  if (options.uppercase) charset += CHARSETS.uppercase;
  if (options.lowercase) charset += CHARSETS.lowercase;
  if (options.numbers) charset += CHARSETS.numbers;
  if (options.symbols) charset += CHARSETS.symbols;
  return charset;
}

export default function RandomAlphanumericGenerator() {
  const [quantity, setQuantity] = useState(10);
  const [length, setLength] = useState(12);
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [charOptions, setCharOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  });
  const [codes, setCodes] = useState<string[]>([]);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const charset = useMemo(() => generateCharset(charOptions), [charOptions]);

  const validateSettings = useCallback(() => {
    if (!charset) {
      setNotice("Select at least one character type to generate codes.");
      return false;
    }
    if (length < 4 || length > 64) {
      setNotice("Length must be between 4 and 64 characters.");
      return false;
    }
    if (preventDuplicates && Math.pow(charset.length, length) < quantity) {
      setNotice("Not enough unique combinations available for the selected length. Reduce the quantity or disable duplicates.");
      return false;
    }
    return true;
  }, [charset, length, preventDuplicates, quantity]);

  const handleGenerate = useCallback(() => {
    setNotice(null);
    if (!validateSettings()) return;

    setLoading(true);
    const generated: string[] = [];
    const seen = new Set<string>();
    const maxAttempts = quantity * 1000;
    let attempts = 0;

    const buildCode = () => {
      let base = "";
      for (let i = 0; i < length; i += 1) {
        const index = Math.floor(Math.random() * charset.length);
        base += charset[index];
      }
      return `${prefix}${base}${suffix}`;
    };

    while (generated.length < quantity && attempts < maxAttempts) {
      attempts += 1;
      const candidate = buildCode();
      if (preventDuplicates && seen.has(candidate)) continue;
      generated.push(candidate);
      seen.add(candidate);
    }

    if (generated.length < quantity) {
      setNotice("Generated fewer codes than requested due to uniqueness constraints. Try reducing the quantity or lengthening the code.");
    }

    setCodes(generated);
    setLoading(false);
  }, [charset, length, prefix, suffix, preventDuplicates, quantity, validateSettings]);

  const handleCopyAll = useCallback(async () => {
    if (codes.length === 0) return;
    await navigator.clipboard.writeText(codes.join("\n"));
    setNotice(`Copied ${codes.length} codes to clipboard.`);
  }, [codes]);

  const handleCopySingle = useCallback(async (value: string) => {
    await navigator.clipboard.writeText(value);
    setNotice(`Copied ${value}`);
  }, []);

  const handleDownload = useCallback((format: "txt" | "csv" | "json") => {
    if (codes.length === 0) return;

    let content = "";
    let mime = "text/plain;charset=utf-8";
    let extension = format;

    if (format === "txt") {
      content = codes.join("\n");
    } else if (format === "csv") {
      content = ["index,code", ...codes.map((value, index) => `${index + 1},${value}`)].join("\n");
    } else {
      content = JSON.stringify(codes, null, 2);
      mime = "application/json;charset=utf-8";
      extension = "json";
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `random-codes.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Downloaded ${codes.length} codes as .${extension.toUpperCase()}`);
  }, [codes]);

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-purple-500 uppercase tracking-[0.35em]">Premium Generator</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Advanced Alphanumeric Code Generator</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">
              Create robust alphanumeric strings with full control over length, character sets, prefixes, suffixes, and uniqueness. Perfect for coupons, API keys, QA tokens, and onboarding codes.
            </p>
          </div>
          <div className="bg-purple-50 border border-purple-100 rounded-2xl px-6 py-4 text-center">
            <div className="text-purple-500 text-sm uppercase tracking-widest">String Length</div>
            <div className="text-4xl font-bold text-purple-700 mt-1">{length}</div>
            <div className="text-xs text-purple-400 mt-1">Prefix "{prefix || "—"}" · Suffix "{suffix || "—"}"</div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Generated Codes</p>
              <h2 className="text-2xl font-semibold text-gray-900">{codes.length || "0"} codes generated</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Copy All
              </button>
              <button
                onClick={() => handleDownload("csv")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                CSV
              </button>
              <button
                onClick={() => handleDownload("json")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                JSON
              </button>
              <button
                onClick={() => handleDownload("txt")}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                TXT
              </button>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {codes.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
                <p className="text-lg font-semibold">No codes yet</p>
                <p className="text-sm mt-1">Adjust the controls below and click Generate.</p>
              </div>
            ) : (
              codes.map((value) => (
                <div
                  key={value}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
                >
                  <div className="font-mono text-base md:text-lg font-semibold text-gray-900 break-all pr-3">{value}</div>
                  <button
                    onClick={() => handleCopySingle(value)}
                    className="text-sm font-semibold text-purple-600 px-3 py-1 border border-purple-200 rounded-lg hover:bg-purple-50"
                  >
                    Copy
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {notice && (
          <div className="flex items-center gap-3 bg-purple-50 border border-purple-200 text-purple-700 px-4 py-3 rounded-xl">
            <span className="text-lg">ℹ️</span>
            <p className="text-sm">{notice}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Generator Controls</h2>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Math.min(500, Number(event.target.value))))}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-lg"
              placeholder="Enter quantity"
            />
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-44 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-sm font-medium text-gray-700"
            >
              {quantityOptions.map((option) => (
                <option key={option} value={option}>
                  {option} codes
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Length</label>
            <input
              type="number"
              min={4}
              max={64}
              value={length}
              onChange={(event) => setLength(Math.max(4, Math.min(64, Number(event.target.value))))}
              className="w-24 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 text-lg"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-purple-200 hover:bg-purple-700 transition disabled:opacity-60 md:col-span-2"
          >
            {loading ? "Generating…" : "Generate Codes"}
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">Prefix</label>
              <input
                type="text"
                value={prefix}
                onChange={(event) => setPrefix(event.target.value)}
                placeholder="e.g., AAF-"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">Suffix</label>
              <input
                type="text"
                value={suffix}
                onChange={(event) => setSuffix(event.target.value)}
                placeholder="e.g., -2025"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: "uppercase", label: "Uppercase (A-Z)" },
                  { id: "lowercase", label: "Lowercase (a-z)" },
                  { id: "numbers", label: "Numbers (0-9)" },
                  { id: "symbols", label: "Symbols (!@#$)" },
                ] as const
              ).map((option) => (
                <label key={option.id} className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 cursor-pointer text-sm font-medium text-gray-600">
                  <input
                    type="checkbox"
                    checked={charOptions[option.id]}
                    onChange={(event) =>
                      setCharOptions((prev) => ({
                        ...prev,
                        [option.id]: event.target.checked,
                      }))
                    }
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold text-gray-600">
              <input
                type="checkbox"
                checked={preventDuplicates}
                onChange={(event) => setPreventDuplicates(event.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
              />
              Prevent duplicates
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">
        <div className="not-prose space-y-10">
          {seoContent}
        </div>
      </div>
    </div>
  );
}

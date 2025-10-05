'use client';

import { useMemo, useState, useCallback, type ReactNode } from 'react';

interface RandomDigitGeneratorBaseProps {
  digitCount: 6 | 5 | 4 | 3;
  title: string;
  subtitle: string;
  seoContent: ReactNode;
}

const quantityOptions = [1, 5, 10, 25, 50, 100, 250, 500];

type ExportFormat = 'txt' | 'csv' | 'json';

export default function RandomDigitGeneratorBase({
  digitCount,
  title,
  subtitle,
  seoContent,
}: RandomDigitGeneratorBaseProps) {
  const [quantity, setQuantity] = useState(1);
  const [allowZeroPadding, setAllowZeroPadding] = useState(false);
  const [preventDuplicates, setPreventDuplicates] = useState(true);
  const [numbers, setNumbers] = useState<string[]>([]);
  const [exactValues, setExactValues] = useState('');
  const [digitSumFilter, setDigitSumFilter] = useState('');
  const [divisibleBy, setDivisibleBy] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const minValue = useMemo(() => (allowZeroPadding ? 0 : Math.pow(10, digitCount - 1)), [allowZeroPadding, digitCount]);
  const maxValue = useMemo(() => Math.pow(10, digitCount) - 1, [digitCount]);
  const uniquePool = useMemo(() => (allowZeroPadding ? Math.pow(10, digitCount) : maxValue - minValue + 1), [allowZeroPadding, digitCount, maxValue, minValue]);

  const formatNumber = useCallback(
    (value: number) => value.toString().padStart(allowZeroPadding ? digitCount : 0, '0'),
    [allowZeroPadding, digitCount]
  );

  const matchesFilters = useCallback(
    (value: number) => {
      const formatted = formatNumber(value);

      if (!allowZeroPadding && formatted.length !== digitCount) {
        return false;
      }

      if (!allowZeroPadding && formatted.startsWith('0')) {
        return false;
      }

      if (digitSumFilter) {
        const target = Number(digitSumFilter);
        if (!Number.isFinite(target)) {
          return false;
        }
        const sum = formatted.split('').reduce((acc, digit) => acc + Number(digit), 0);
        if (sum !== target) {
          return false;
        }
      }

      if (divisibleBy) {
        const divisor = Number(divisibleBy);
        if (!Number.isFinite(divisor) || divisor === 0) {
          return false;
        }
        if (value % divisor !== 0) {
          return false;
        }
      }

      return true;
    },
    [allowZeroPadding, digitCount, digitSumFilter, divisibleBy, formatNumber]
  );

  const handleGenerate = async () => {
    setLoading(true);
    setNotice(null);

    const parsedExactValues = exactValues
      .split(',')
      .map((entry) => entry.trim())
      .filter(Boolean)
      .map((entry) => entry.padStart(digitCount, '0'))
      .filter((entry) => entry.length === digitCount && /^\d+$/.test(entry))
      .filter((entry) => (allowZeroPadding ? true : !entry.startsWith('0')));

    const uniqueExactValues = Array.from(new Set(parsedExactValues));

    const ensureAvailabilityNotice = (available: number) => {
      if (preventDuplicates && quantity > available) {
        setNotice(
          `Quantity reduced to ${available} due to uniqueness limits. Disable "Prevent duplicates" or add more valid numbers.`
        );
        return available;
      }
      return quantity;
    };

    if (uniqueExactValues.length > 0) {
      const filteredPool = uniqueExactValues
        .map((entry) => Number(entry))
        .filter((value) => matchesFilters(value))
        .map((value) => formatNumber(value));

      if (filteredPool.length === 0) {
        setNumbers([]);
        setNotice('No numbers matched the filters applied. Adjust filters or enter different exact values.');
        setLoading(false);
        return;
      }

      const targetQuantity = ensureAvailabilityNotice(preventDuplicates ? filteredPool.length : filteredPool.length * 5);
      const finalList: string[] = [];

      if (preventDuplicates) {
        const shuffled = [...filteredPool].sort(() => Math.random() - 0.5);
        finalList.push(...shuffled.slice(0, targetQuantity));
      } else {
        for (let i = 0; i < targetQuantity; i += 1) {
          const candidate = filteredPool[Math.floor(Math.random() * filteredPool.length)];
          finalList.push(candidate);
        }
      }

      setNumbers(finalList);
      setLoading(false);
      return;
    }

    let targetQuantity = quantity;
    if (preventDuplicates && quantity > uniquePool) {
      targetQuantity = uniquePool;
      setNotice(
        `Quantity reduced to ${uniquePool.toLocaleString()} because only that many unique ${digitCount}-digit numbers exist.`
      );
    }

    const generated: string[] = [];
    const seen = new Set<string>();
    const maxAttempts = targetQuantity * 500;
    let attempts = 0;

    while (generated.length < targetQuantity && attempts < maxAttempts) {
      attempts += 1;
      const candidate = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
      if (!matchesFilters(candidate)) {
        continue;
      }
      const formatted = formatNumber(candidate);
      if (preventDuplicates && seen.has(formatted)) {
        continue;
      }
      generated.push(formatted);
      seen.add(formatted);
    }

    if (generated.length < targetQuantity) {
      setNotice(
        `Generated ${generated.length} numbers that match the applied filters. Adjust filters or disable duplicates for more results.`
      );
    }

    setNumbers(generated);
    setLoading(false);
  };

  const handleCopyAll = async () => {
    if (numbers.length === 0) return;
    await navigator.clipboard.writeText(numbers.join('\n'));
    setNotice(`Copied ${numbers.length} numbers to clipboard.`);
  };

  const handleCopySingle = async (value: string) => {
    await navigator.clipboard.writeText(value);
    setNotice(`Copied ${value}`);
  };

  const handleDownload = (format: ExportFormat) => {
    if (numbers.length === 0) return;

    let content = '';
    let mime = 'text/plain;charset=utf-8';
    let extension = format;

    if (format === 'txt') {
      content = numbers.join('\n');
    } else if (format === 'csv') {
      content = ['index,value', ...numbers.map((value, index) => `${index + 1},${value}`)].join('\n');
    } else {
      content = JSON.stringify(numbers, null, 2);
      mime = 'application/json;charset=utf-8';
      extension = 'json';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${digitCount}-digit-random-numbers.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setNotice(`Downloaded ${numbers.length} numbers as .${extension.toUpperCase()}`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-indigo-500 uppercase tracking-[0.35em]">Premium Generator</p>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">{title}</h1>
            <p className="text-gray-500 mt-2 max-w-2xl">{subtitle}</p>
          </div>
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-6 py-4 text-center">
            <div className="text-indigo-500 text-sm uppercase tracking-widest">Digit Length</div>
            <div className="text-4xl font-bold text-indigo-700 mt-1">{digitCount}</div>
            <div className="text-xs text-indigo-400 mt-1">
              Range {formatNumber(minValue)} – {formatNumber(maxValue)}
            </div>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-6 bg-gray-50/60">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Generated Numbers</p>
              <h2 className="text-2xl font-semibold text-gray-900">{numbers.length || '0'} numbers generated</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleCopyAll}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                Copy All
              </button>
              <button
                onClick={() => handleDownload('csv')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                CSV
              </button>
              <button
                onClick={() => handleDownload('json')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                JSON
              </button>
              <button
                onClick={() => handleDownload('txt')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-100"
              >
                TXT
              </button>
            </div>
          </div>

          <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {numbers.length === 0 ? (
              <div className="sm:col-span-2 lg:col-span-3 xl:col-span-4 text-center py-10 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-white">
                <p className="text-lg font-semibold">No numbers yet</p>
                <p className="text-sm mt-1">Adjust the controls below and click Generate.</p>
              </div>
            ) : (
              numbers.map((value) => (
                <div
                  key={`${value}-${Math.random().toString(36).slice(2)}`}
                  className="bg-white border border-gray-200 rounded-xl px-4 py-4 flex items-center justify-between shadow-sm hover:shadow-md transition"
                >
                  <div className="text-2xl font-bold text-gray-900 tracking-[0.2em]">{value}</div>
                  <button
                    onClick={() => handleCopySingle(value)}
                    className="text-sm font-semibold text-indigo-600 px-3 py-1 border border-indigo-200 rounded-lg hover:bg-indigo-50"
                  >
                    Copy
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {notice && (
          <div className="flex items-center gap-3 bg-indigo-50 border border-indigo-200 text-indigo-700 px-4 py-3 rounded-xl">
            <span className="text-lg">ℹ️</span>
            <p className="text-sm">{notice}</p>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8 space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">How many numbers?</h2>

        <div className="grid md:grid-cols-[1fr_auto] gap-4">
          <div className="flex gap-3">
            <input
              type="number"
              min={1}
              max={500}
              value={quantity}
              onChange={(event) => setQuantity(Math.max(1, Math.min(500, Number(event.target.value))))}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-lg"
              placeholder="Enter quantity"
            />
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="w-44 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 text-sm font-medium text-gray-700"
            >
              {quantityOptions.map((option) => (
                <option key={option} value={option}>
                  {option} numbers
                </option>
              ))}
            </select>
          </div>

          <p className="text-xs text-gray-400 md:col-span-2">
            Presets help you switch instantly: choose <strong>1</strong> for a single number, <strong>5</strong> or <strong>10</strong> for small batches, and higher values for bulk generation.
          </p>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? 'Generating…' : `Generate ${digitCount}-Digit Numbers`}
          </button>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-medium text-gray-600">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={allowZeroPadding}
              onChange={(event) => setAllowZeroPadding(event.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Allow zero padding
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preventDuplicates}
              onChange={(event) => setPreventDuplicates(event.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Prevent duplicates
          </label>
        </div>

        <button
          onClick={() => setShowAdvanced((prev) => !prev)}
          className="w-full flex items-center justify-between px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 hover:bg-gray-100 text-sm font-semibold text-gray-600"
        >
          <span>Advanced Filters</span>
          <span>{showAdvanced ? '−' : '+'}</span>
        </button>

        {showAdvanced && (
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Exact values (comma separated)</label>
              <input
                type="text"
                value={exactValues}
                onChange={(event) => setExactValues(event.target.value)}
                placeholder={`e.g., ${Array.from({ length: digitCount }, (_, idx) => (idx + 1) % 10).join('')}`}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-xs text-gray-400 mt-1">Only numbers matching the digit length will be used.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Digit sum filter</label>
              <input
                type="number"
                min={0}
                value={digitSumFilter}
                onChange={(event) => setDigitSumFilter(event.target.value)}
                placeholder="e.g., 15"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-xs text-gray-400 mt-1">Sum of digits must equal this value.</p>
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Divisible by</label>
              <input
                type="number"
                min={1}
                value={divisibleBy}
                onChange={(event) => setDivisibleBy(event.target.value)}
                placeholder="e.g., 5"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus;border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
              <p className="text-xs text-gray-400 mt-1">Generated numbers must be divisible by this value.</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">
        <div className="not-prose space-y-10">
          {seoContent}
        </div>
      </div>
    </div>
  );
}

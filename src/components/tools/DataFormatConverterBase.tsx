'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';

const MAX_HISTORY = 6;

interface ConversionRecord {
  id: string;
  timestamp: string;
  inputSnapshot: string;
  outputSnapshot: string;
}

type ConverterMode = 'json-to-csv' | 'csv-to-json';

type CsvDelimiter = ',' | ';' | '\t' | '|';

interface DataFormatConverterBaseProps {
  mode: ConverterMode;
  title: string;
  subtitle: string;
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder: string;
  sampleInput: string;
  seoContent: ReactNode;
}

interface CsvToJsonOptions {
  delimiter: CsvDelimiter;
  firstRowHeaders: boolean;
  prettyPrint: boolean;
}

interface JsonToCsvOptions {
  includeHeaders: boolean;
  delimiter: CsvDelimiter;
  wrapValuesInQuotes: boolean;
}

type PreviewTable = {
  headers: string[];
  rows: string[][];
};

function escapeCsvValue(value: unknown, wrap: boolean) {
  if (value === null || value === undefined) return '';
  
  // Handle nested objects and arrays by stringifying them
  let stringValue: string;
  if (typeof value === 'object') {
    try {
      stringValue = JSON.stringify(value);
    } catch {
      stringValue = String(value);
    }
  } else {
    stringValue = String(value);
  }
  
  const containsSpecial = /[\",\n\r;]/.test(stringValue);
  if (!wrap && !containsSpecial) {
    return stringValue;
  }
  const escaped = stringValue.replace(/"/g, '""');
  return `"${escaped}"`;
}

function safeJsonParse<T>(value: string): T | null {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error('JSON parse failed', error);
    return null;
  }
}

function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseCsv(content: string, delimiter: CsvDelimiter): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let value = '';
  let insideQuotes = false;

  const pushValue = () => {
    current.push(value);
    value = '';
  };

  const pushRow = () => {
    if (current.length > 0 || rows.length === 0) {
      rows.push(current);
    }
    current = [];
  };

  for (let i = 0; i < content.length; i += 1) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          value += '"';
          i += 1;
        } else {
          insideQuotes = false;
        }
      } else {
        value += char;
      }
      continue;
    }

    if (char === '"') {
      insideQuotes = true;
      continue;
    }

    if (char === delimiter) {
      pushValue();
      continue;
    }

    if (char === '\n') {
      pushValue();
      pushRow();
      continue;
    }

    if (char === '\r') {
      if (nextChar === '\n') {
        continue;
      }
      pushValue();
      pushRow();
      continue;
    }

    value += char;
  }

  if (value !== '' || current.length > 0) {
    pushValue();
    pushRow();
  }

  return rows.filter((row) => row.length > 0 && row.some((cell) => cell.trim().length > 0));
}

function flattenObject(obj: Record<string, any>, prefix = ''): Record<string, any> {
  return Object.keys(obj).reduce((acc, k) => {
    const pre = prefix.length ? `${prefix}.` : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else if (Array.isArray(obj[k])) {
      // Handle arrays by joining them with semicolons
      acc[pre + k] = obj[k].map((item: any) => 
        typeof item === 'object' && item !== null 
          ? JSON.stringify(item) 
          : String(item)
      ).join('; ');
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {} as Record<string, any>);
}

function convertJsonToCsv(
  input: string,
  options: JsonToCsvOptions
): { csv: string; preview: PreviewTable } | { error: string } {
  const parsed = safeJsonParse<unknown>(input);
  if (!parsed) {
    return { error: 'Unable to parse JSON. Please ensure the syntax is valid.' };
  }

  const asArray = Array.isArray(parsed)
    ? parsed
    : typeof parsed === 'object' && parsed !== null
    ? [parsed]
    : null;

  if (!asArray || asArray.length === 0) {
    return { error: 'JSON must be an object or an array of objects with at least one entry.' };
  }

  // Flatten nested objects in each row
  const flattenedRows = asArray.map(row => 
    typeof row === 'object' && row !== null ? flattenObject(row) : { value: row }
  ) as Record<string, unknown>[];

  // Get all unique headers from all rows
  const headers = Array.from(
    flattenedRows.reduce((set, row) => {
      Object.keys(row).forEach((key) => set.add(key));
      return set;
    }, new Set<string>())
  );

  if (headers.length === 0) {
    return { error: 'No keys found in JSON objects to create CSV headers.' };
  }

  const csvRows: string[] = [];

  // Add header row if needed
  if (options.includeHeaders) {
    const headerRow = headers
      .map((header) => escapeCsvValue(header, true))
      .join(options.delimiter);
    csvRows.push(headerRow);
  }

  // Add data rows
  flattenedRows.forEach((row) => {
    const csvRow = headers
      .map((header) => escapeCsvValue(row[header], options.wrapValuesInQuotes))
      .join(options.delimiter);
    csvRows.push(csvRow);
  });

  // Prepare preview data (first 6 rows)
  const previewRows = flattenedRows.slice(0, 6).map((row) => 
    headers.map((header) => {
      const value = row[header];
      if (value === null || value === undefined) return '';
      return String(value);
    })
  );

  return {
    csv: csvRows.join('\n'),
    preview: {
      headers,
      rows: previewRows,
    },
  };
}

function convertCsvToJson(
  input: string,
  options: CsvToJsonOptions
): { json: string; preview: PreviewTable } | { error: string } {
  const rows = parseCsv(input.trim(), options.delimiter);
  if (rows.length === 0) {
    return { error: 'Unable to read CSV content. Please verify the delimiter and formatting.' };
  }

  let headers: string[] = [];
  let dataRows: string[][] = [];

  if (options.firstRowHeaders) {
    headers = rows[0].map((header, index) => header || `field_${index + 1}`);
    dataRows = rows.slice(1);
  } else {
    const columnCount = rows[0].length;
    headers = Array.from({ length: columnCount }, (_, index) => `field_${index + 1}`);
    dataRows = rows;
  }

  const jsonObjects = dataRows.map((cells) => {
    const entry: Record<string, string> = {};
    headers.forEach((header, index) => {
      entry[header] = cells[index] ?? '';
    });
    return entry;
  });

  const formatted = options.prettyPrint
    ? JSON.stringify(jsonObjects, null, 2)
    : JSON.stringify(jsonObjects);

  const previewRows = jsonObjects.slice(0, 6).map((row) => headers.map((header) => String(row[header] ?? '')));

  return {
    json: formatted,
    preview: {
      headers,
      rows: previewRows,
    },
  };
}

export default function DataFormatConverterBase({
  mode,
  title,
  subtitle,
  inputLabel,
  outputLabel,
  inputPlaceholder,
  sampleInput,
  seoContent,
}: DataFormatConverterBaseProps) {
  const [inputText, setInputText] = useState(sampleInput.trim());
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [conversionCount, setConversionCount] = useState(0);
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [preview, setPreview] = useState<PreviewTable | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [csvToJsonOptions, setCsvToJsonOptions] = useState<CsvToJsonOptions>({
    delimiter: ',',
    firstRowHeaders: true,
    prettyPrint: true,
  });

  const [jsonToCsvOptions, setJsonToCsvOptions] = useState<JsonToCsvOptions>({
    delimiter: ',',
    includeHeaders: true,
    wrapValuesInQuotes: true,
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const noticeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentOptions = mode === 'json-to-csv' ? jsonToCsvOptions : csvToJsonOptions;

  const modeOptions = useMemo(
    () => [
      {
        value: 'json-to-csv' as ConverterMode,
        label: 'JSON → CSV',
        href: '/tools/json-to-csv-converter',
      },
      {
        value: 'csv-to-json' as ConverterMode,
        label: 'CSV → JSON',
        href: '/tools/csv-to-json-converter',
      },
    ],
    []
  );

  const summaryCards = useMemo(
    () => [
      {
        label: 'Conversions run',
        value: conversionCount,
        icon: '⚡',
      },
      {
        label: mode === 'json-to-csv' ? 'JSON fields detected' : 'Columns detected',
        value: preview?.headers.length ?? 0,
        icon: mode === 'json-to-csv' ? '🧮' : '📊',
      },
      {
        label: 'Preview rows',
        value: preview?.rows.length ?? 0,
        icon: '👁️',
      },
    ],
    [conversionCount, mode, preview]
  );

  const showNotice = useCallback((message: string) => {
    if (noticeTimeoutRef.current) {
      clearTimeout(noticeTimeoutRef.current);
    }
    setNotice(message);
    noticeTimeoutRef.current = setTimeout(() => setNotice(null), 2600);
  }, []);

  useEffect(() => {
    return () => {
      if (noticeTimeoutRef.current) {
        clearTimeout(noticeTimeoutRef.current);
      }
    };
  }, []);

  const handleConvert = useCallback(() => {
    setIsProcessing(true);
    setError(null);
    setNotice(null);

    setTimeout(() => {
      if (!inputText.trim()) {
        setError('Please provide input data to convert.');
        setIsProcessing(false);
        return;
      }

      let conversionOutput = '';
      let conversionPreview: PreviewTable | null = null;

      if (mode === 'json-to-csv') {
        const result = convertJsonToCsv(inputText, jsonToCsvOptions);
        if ('error' in result) {
          setError(result.error);
          setIsProcessing(false);
          return;
        }
        conversionOutput = result.csv;
        conversionPreview = result.preview;
      } else {
        const result = convertCsvToJson(inputText, csvToJsonOptions);
        if ('error' in result) {
          setError(result.error);
          setIsProcessing(false);
          return;
        }
        conversionOutput = result.json;
        conversionPreview = result.preview;
      }
      setOutputText(conversionOutput);
      setPreview(conversionPreview);
      setConversionCount((count) => count + 1);
      setHistory((prev) => [
        {
          id: generateId(),
          timestamp: new Date().toISOString(),
          inputSnapshot: inputText.slice(0, 2000),
          outputSnapshot: conversionOutput.slice(0, 2000),
        },
        ...prev,
      ].slice(0, MAX_HISTORY));
      showNotice('Conversion complete. Output ready to copy or download.');
      setIsProcessing(false);
    }, 120);
  }, [csvToJsonOptions, inputText, jsonToCsvOptions, mode, showNotice]);

  // Fallback copy method for older browsers
  const fallbackCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (!successful) {
        throw new Error('Fallback copy failed');
      }
      return Promise.resolve();
    } catch (err) {
      console.error('Fallback copy failed:', err);
      return Promise.reject(err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const safeCopyToClipboard = async (text: string) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        await fallbackCopyToClipboard(text);
      }
      return true;
    } catch (err) {
      console.error('Failed to copy:', err);
      showNotice('Failed to copy to clipboard. Please try again.');
      return false;
    }
  };

  const handleCopy = useCallback(async (text: string, message: string) => {
    const success = await safeCopyToClipboard(text);
    if (success) {
      showNotice(`${message} copied to clipboard!`);
    }
  }, [showNotice]);

  const copyTableToClipboard = useCallback(async () => {
    if (!preview) return;
    
    // Create TSV (tab-separated values) for better compatibility with spreadsheets
    let tsvContent = '';
    
    // Add headers
    tsvContent += preview.headers.join('\t') + '\n';
    
    // Add rows
    preview.rows.forEach(row => {
      tsvContent += row.map(cell => 
        // Replace any existing tabs in cell content with spaces
        String(cell || '').replace(/\t/g, ' ')
      ).join('\t') + '\n';
    });
    
    // Copy to clipboard
    const success = await safeCopyToClipboard(tsvContent);
    if (success) {
      setCopied(true);
      showNotice('Table copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    }
  }, [preview, showNotice]);

  const handleDownload = (content: string, extension: 'csv' | 'json') => {
    if (!content) return;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${mode === 'json-to-csv' ? 'json-to-csv' : 'csv-to-json'}-result.${extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showNotice(`Downloaded ${extension.toUpperCase()} file.`);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (loadEvent) => {
      const text = loadEvent.target?.result;
      if (typeof text === 'string') {
        setInputText(text.trim());
        setOutputText('');
        setPreview(null);
        showNotice('File uploaded. Ready to convert.');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handlePasteSample = () => {
    setInputText(sampleInput.trim());
    setOutputText('');
    setPreview(null);
    setError(null);
    showNotice('Sample data loaded.');
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setPreview(null);
    setError(null);
    showNotice('Cleared input and output areas.');
  };

  const handleFormatInput = () => {
    if (mode === 'json-to-csv') {
      const parsed = safeJsonParse<unknown>(inputText);
      if (!parsed) {
        setError('Cannot format JSON: invalid syntax.');
        return;
      }
      setInputText(JSON.stringify(parsed, null, 2));
      showNotice('JSON formatted with 2-space indentation.');
    } else {
      const trimmed = inputText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n');
      setInputText(trimmed);
      showNotice('CSV trimmed and cleaned.');
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-3xl p-10 text-white shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="max-w-3xl space-y-4">
            <p className="uppercase tracking-[0.4em] text-blue-200 text-xs">Premium Converter</p>
            <h1 className="text-4xl lg:text-5xl font-black leading-tight">{title}</h1>
            <p className="text-blue-100 text-base lg:text-lg">{subtitle}</p>
            <div className="flex flex-wrap gap-3 text-sm text-blue-100/90">
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur">Drag &amp; drop upload</span>
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur">Instant preview</span>
              <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full backdrop-blur">History restore</span>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-2xl p-6 min-w-[230px] text-center space-y-2">
            <div className="text-blue-100 text-sm uppercase tracking-[0.3em]">Mode</div>
            <div className="flex gap-2">
              {modeOptions.map((option) => (
                <Link
                  key={option.value}
                  href={option.href}
                  className={`flex-1 px-4 py-2 rounded-xl text-sm font-semibold transition ${
                    mode === option.value
                      ? 'bg-white text-indigo-700 shadow-lg shadow-white/30'
                      : 'bg-white/10 text-blue-100 hover:bg-white/20'
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
            <div className="text-xs text-blue-200 leading-relaxed">
              {mode === 'json-to-csv'
                ? 'Supports arrays of objects, intelligent header detection, and quote wrapping.'
                : 'Detects headers, converts to structured JSON, and supports multiple delimiters.'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{inputLabel}</h2>
                <p className="text-sm text-gray-500">Paste, type, or upload your source data.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={handlePasteSample}
                  className="px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                >
                  Use sample data
                </button>
                <button
                  onClick={handleFormatInput}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  {mode === 'json-to-csv' ? 'Format JSON' : 'Clean CSV'}
                </button>
                <button
                  onClick={() => handleCopy(inputText, 'Input data')}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Copy input
                </button>
                <button
                  onClick={handleClear}
                  className="px-4 py-2 rounded-xl border border-red-200 text-red-500 font-semibold hover:bg-red-50 transition"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="relative group">
              <textarea
                value={inputText}
                onChange={(event) => setInputText(event.target.value)}
                placeholder={inputPlaceholder}
                rows={14}
                className="w-full font-mono text-sm bg-gray-900 text-gray-100 rounded-2xl border border-gray-800 px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 transition shadow-inner"
              />
              <div className="absolute inset-x-5 bottom-3 flex justify-between text-xs text-gray-400">
                <span>{inputText.length.toLocaleString()} characters</span>
                <span>{inputText.split('\n').length} lines</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 items-center text-sm">
              <button
                onClick={handleUploadClick}
                className="px-5 py-3 bg-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition"
              >
                Upload file
              </button>
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-200 hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-60"
              >
                {isProcessing ? 'Converting…' : 'Convert now'}
              </button>
              <span className="text-xs text-gray-500">
                Supports drag & drop uploads and clipboard copy.
              </span>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={mode === 'json-to-csv' ? '.json,.txt,.js' : '.csv,.txt'}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{outputLabel}</h2>
                <p className="text-sm text-gray-500">Copy or download your result instantly.</p>
              </div>
              <div className="flex flex-wrap gap-2 text-sm">
                <button
                  onClick={() => handleCopy(outputText, 'Converted output')}
                  className="px-4 py-2 rounded-xl border border-indigo-200 text-indigo-600 font-semibold hover:bg-indigo-50 transition"
                >
                  Copy output
                </button>
                <button
                  onClick={() => handleDownload(outputText, mode === 'json-to-csv' ? 'csv' : 'json')}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition"
                >
                  Download {mode === 'json-to-csv' ? 'CSV' : 'JSON'}
                </button>
              </div>
            </div>

            <textarea
              value={outputText}
              readOnly
              placeholder="Your converted output will appear here."
              rows={12}
              className="w-full font-mono text-sm bg-gray-900 text-emerald-100 rounded-2xl border border-gray-800 px-5 py-4 focus:outline-none shadow-inner"
            />

            {preview && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Preview ({preview.rows.length} rows)</h3>
                  <button
                    onClick={copyTableToClipboard}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    title="Copy table to clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy Table</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="overflow-x-auto border border-gray-200 rounded-2xl">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        {preview.headers.map((header) => (
                          <th key={header} className="px-4 py-3 text-left font-semibold text-gray-700 uppercase tracking-wide text-xs">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {preview.rows.map((row, rowIndex) => (
                        <tr key={`row-${rowIndex}`} className="hover:bg-gray-50">
                          {row.map((cell, cellIndex) => (
                            <td key={`cell-${rowIndex}-${cellIndex}`} className="px-4 py-3 text-gray-700 font-mono text-xs">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 text-amber-800 px-5 py-4 text-sm">
                {error}
              </div>
            )}
            {notice && !error && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-800 px-5 py-4 text-sm">
                {notice}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Quick Settings</h3>
            {mode === 'json-to-csv' ? (
              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 text-sm text-gray-600">
                  <span>Include header row</span>
                  <input
                    type="checkbox"
                    checked={jsonToCsvOptions.includeHeaders}
                    onChange={(event) =>
                      setJsonToCsvOptions((prev) => ({ ...prev, includeHeaders: event.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 text-sm text-gray-600">
                  <span>Wrap all values in quotes</span>
                  <input
                    type="checkbox"
                    checked={jsonToCsvOptions.wrapValuesInQuotes}
                    onChange={(event) =>
                      setJsonToCsvOptions((prev) => ({ ...prev, wrapValuesInQuotes: event.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </label>
                <label className="block text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Delimiter</span>
                  <select
                    value={jsonToCsvOptions.delimiter}
                    onChange={(event) =>
                      setJsonToCsvOptions((prev) => ({ ...prev, delimiter: event.target.value as CsvDelimiter }))
                    }
                    className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </label>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="flex items-center justify-between gap-4 text-sm text-gray-600">
                  <span>First row contains headers</span>
                  <input
                    type="checkbox"
                    checked={csvToJsonOptions.firstRowHeaders}
                    onChange={(event) =>
                      setCsvToJsonOptions((prev) => ({ ...prev, firstRowHeaders: event.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </label>
                <label className="flex items-center justify-between gap-4 text-sm text-gray-600">
                  <span>Pretty-print JSON output</span>
                  <input
                    type="checkbox"
                    checked={csvToJsonOptions.prettyPrint}
                    onChange={(event) =>
                      setCsvToJsonOptions((prev) => ({ ...prev, prettyPrint: event.target.checked }))
                    }
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </label>
                <label className="block text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Delimiter</span>
                  <select
                    value={csvToJsonOptions.delimiter}
                    onChange={(event) =>
                      setCsvToJsonOptions((prev) => ({ ...prev, delimiter: event.target.value as CsvDelimiter }))
                    }
                    className="mt-2 w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-200"
                  >
                    <option value=",">Comma (,)</option>
                    <option value=";">Semicolon (;)</option>
                    <option value="\t">Tab</option>
                    <option value="|">Pipe (|)</option>
                  </select>
                </label>
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6 space-y-5">
            <h3 className="text-lg font-semibold text-gray-900">Conversion History</h3>
            {history.length === 0 ? (
              <p className="text-sm text-gray-500">Run a conversion to keep a snapshot here.</p>
            ) : (
              <ul className="space-y-4 text-sm">
                {history.map((record) => (
                  <li key={record.id} className="border border-gray-200 rounded-2xl p-4 hover:border-indigo-200 transition">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                      <span>{new Date(record.timestamp).toLocaleString()}</span>
                      <button
                        onClick={() => {
                          setInputText(record.inputSnapshot);
                          setOutputText(record.outputSnapshot);
                          setError('Restored previous conversion. Update options and reconvert if needed.');
                        }}
                        className="px-3 py-1 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50"
                      >
                        Restore
                      </button>
                    </div>
                    <div className="font-mono text-xs text-gray-600 line-clamp-2">
                      {record.inputSnapshot.slice(0, 160)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900">Summary</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {summaryCards.map((card) => (
                <div key={card.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{card.icon}</span>
                    <div>
                      <div className="text-sm text-gray-500">{card.label}</div>
                      <div className="text-xl font-semibold text-gray-900">{card.value}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-10">
        <div className="space-y-12">{seoContent}</div>
      </div>
    </div>
  );
}

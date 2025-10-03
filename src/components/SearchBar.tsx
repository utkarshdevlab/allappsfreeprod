"use client";

import { useMemo, useState } from "react";
import { searchTools } from "@/utils/tools";
import Link from "next/link";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => (query ? searchTools(query).slice(0, 6) : []), [query]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="relative group">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools, games, categories..."
          className="w-full rounded-2xl border border-gray-300 bg-white/80 backdrop-blur px-5 py-3.5 pr-12 text-[15px] shadow-sm outline-none transition focus:border-violet-400 focus:ring-4 focus:ring-violet-400/20"
        />
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ⌘K
        </div>
      </div>

      {results.length > 0 && (
        <div className="mt-3 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl">
          <ul className="divide-y divide-gray-100">
            {results.map((tool) => (
              <li key={tool.id}>
                <Link
                  href={`/tools/${tool.slug}`}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium text-gray-900">{tool.title}</div>
                    <div className="text-xs text-gray-500">{tool.category} • {tool.type}</div>
                  </div>
                  <div className="text-xs rounded-full bg-gray-100 px-2 py-1 text-gray-600">Open →</div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

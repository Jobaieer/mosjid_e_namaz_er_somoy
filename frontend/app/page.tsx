"use client";
import { useState } from "react";
import Link from "next/link";
import api from "@/lib/api";

export default function HomePage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const { data } = await api.get(`/search?q=${encodeURIComponent(q)}`);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <header className="flex justify-between items-center p-4 max-w-3xl mx-auto">
        <h1 className="font-bold text-emerald-700">🕌 Namaz Time</h1>
        <Link
          href="/login"
          className="text-sm text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg"
        >
          Masjid Login
        </Link>
      </header>

      <div className="max-w-3xl mx-auto px-4 pt-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Apnar masjid er namaz time
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Masjid er naam ba area diye search korun
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Jemn: Baitul Mukarram, Paltan, Dhaka..."
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none"
          />
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 rounded-xl transition">
            Search
          </button>
        </form>

        {loading && (
          <p className="text-center text-gray-500">Khoja hocche...</p>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-gray-400">Kono masjid pawa jayni 😔</p>
        )}

        <div className="space-y-3">
          {results.map((m) => (
            <Link
              key={m._id}
              href={`/mosque/${m._id}`}
              className="block bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition"
            >
              <h3 className="font-semibold text-gray-800">{m.name}</h3>
              <p className="text-sm text-gray-500">
                {m.area}, {m.district}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

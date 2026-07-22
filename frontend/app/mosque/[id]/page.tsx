"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const LABELS: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

export default function MosqueDetailPage() {
  const { id } = useParams();
  const [mosque, setMosque] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/mosque/${id}`)
      .then(({ data }) => setMosque(data))
      .catch(() => setError("Masjid pawa jayni"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen grid place-items-center text-gray-400">
        {error}
      </div>
    );

  const pt = mosque.prayerTimes || {};

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-lg mx-auto">
        <Link href="/" className="text-sm text-emerald-600">
          ← Back to search
        </Link>

        <div className="bg-white rounded-2xl shadow p-6 mt-4">
          <h1 className="text-2xl font-bold text-emerald-700">
            🕌 {mosque.name}
          </h1>
          <p className="text-gray-500 mb-6">
            {mosque.area}, {mosque.district}
          </p>

          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-400 text-sm border-b">
                <th className="pb-2">Waqt</th>
                <th className="pb-2">Azan</th>
                <th className="pb-2">Iqamah</th>
              </tr>
            </thead>
            <tbody>
              {PRAYERS.map((p) => (
                <tr key={p} className="border-b last:border-0">
                  <td className="py-3 font-medium text-gray-700">
                    {LABELS[p]}
                  </td>
                  <td className="py-3 text-gray-600">{pt[p]?.azan || "—"}</td>
                  <td className="py-3 text-gray-600">{pt[p]?.iqamah || "—"}</td>
                </tr>
              ))}
              <tr>
                <td className="py-3 font-medium text-emerald-700">Jumu'ah</td>
                <td className="py-3 text-gray-600" colSpan={2}>
                  {pt.jumuah || "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const;
const LABELS: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
};

type Slot = { azan: string; iqamah: string };
type PrayerTimes = Record<string, Slot | string>;

const emptySlot = { azan: "", iqamah: "" };

export default function DashboardPage() {
  const router = useRouter();
  const [mosque, setMosque] = useState<any>(null);
  const [times, setTimes] = useState<PrayerTimes>({
    fajr: { ...emptySlot },
    dhuhr: { ...emptySlot },
    asr: { ...emptySlot },
    maghrib: { ...emptySlot },
    isha: { ...emptySlot },
    jumuah: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  // Login check + current data load
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      router.push("/login");
      return;
    }
    api
      .get("/mosque/me")
      .then(({ data }) => {
        setMosque(data);
        if (data.prayerTimes) {
          setTimes({
            fajr: data.prayerTimes.fajr || { ...emptySlot },
            dhuhr: data.prayerTimes.dhuhr || { ...emptySlot },
            asr: data.prayerTimes.asr || { ...emptySlot },
            maghrib: data.prayerTimes.maghrib || { ...emptySlot },
            isha: data.prayerTimes.isha || { ...emptySlot },
            jumuah: data.prayerTimes.jumuah || "",
          });
        }
      })
      .catch(() => {
        localStorage.removeItem("token");
        router.push("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const updateSlot = (
    prayer: string,
    field: "azan" | "iqamah",
    value: string,
  ) =>
    setTimes((t) => ({
      ...t,
      [prayer]: { ...(t[prayer] as Slot), [field]: value },
    }));

  const handleSave = async () => {
    setSaving(true);
    setMsg("");
    try {
      await api.put("/prayer-times", { prayerTimes: times });
      setMsg("✅ Namaz time update hoyeche");
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Save bhul hoyeche");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading)
    return (
      <div className="min-h-screen grid place-items-center text-gray-500">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-emerald-700">
              🕌 {mosque?.name}
            </h1>
            <p className="text-sm text-gray-500">
              {mosque?.area}, {mosque?.district}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow p-6 space-y-4">
          <h2 className="font-semibold text-gray-700">
            Namaz Time Set/Change koro
          </h2>

          {/* 5 waqt */}
          {PRAYERS.map((p) => (
            <div key={p} className="grid grid-cols-3 gap-3 items-center">
              <span className="font-medium text-gray-700">{LABELS[p]}</span>
              <input
                type="time"
                value={(times[p] as Slot).azan}
                onChange={(e) => updateSlot(p, "azan", e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1.5"
                placeholder="Azan"
              />
              <input
                type="time"
                value={(times[p] as Slot).iqamah}
                onChange={(e) => updateSlot(p, "iqamah", e.target.value)}
                className="border border-gray-300 rounded-lg px-2 py-1.5"
                placeholder="Iqamah"
              />
            </div>
          ))}

          {/* Header hint */}
          <p className="text-xs text-gray-400 text-right">
            Column: Azan | Iqamah
          </p>

          {/* Jumuah */}
          <div className="grid grid-cols-3 gap-3 items-center border-t pt-4">
            <span className="font-medium text-gray-700">Jumu'ah</span>
            <input
              type="time"
              value={times.jumuah as string}
              onChange={(e) =>
                setTimes((t) => ({ ...t, jumuah: e.target.value }))
              }
              className="border border-gray-300 rounded-lg px-2 py-1.5 col-span-2"
            />
          </div>

          {msg && <p className="text-sm text-emerald-600">{msg}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Time"}
          </button>
        </div>
      </div>
    </div>
  );
}

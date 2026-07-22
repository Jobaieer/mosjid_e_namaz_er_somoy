"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    area: "",
    district: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/mosque/register", form);
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Kichu ekta bhul hoyeche");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold text-center text-emerald-700">
          🕌 Masjid Register
        </h1>

        {error && (
          <p className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
            {error}
          </p>
        )}

        {[
          { name: "name", label: "Masjid er naam", type: "text" },
          { name: "area", label: "Area / Thana", type: "text" },
          { name: "district", label: "District", type: "text" },
          { name: "email", label: "Email", type: "email" },
          { name: "password", label: "Password", type: "password" },
        ].map((f) => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {f.label}
            </label>
            <input
              name={f.name}
              type={f.type}
              value={(form as any)[f.name]}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        ))}

        <button
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition disabled:opacity-50"
        >
          {loading ? "Wait..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500">
          Already account ache?{" "}
          <Link href="/login" className="text-emerald-600 font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

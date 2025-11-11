"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken } from "@/utils/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      return setError("Email dan password wajib diisi");
    }

    try {
      setLoading(true);
      const res = await api.post("/login", { email, password });

      // Laravel mengembalikan { message, user, token }
      const token = res.data.token;
      const user = res.data.user;

      if (!token) throw new Error("Token tidak ditemukan di response");

      saveToken(token);
      localStorage.setItem("fenya_user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.errors?.email?.[0] ||
          "Login gagal, periksa kembali email & password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-green-600">
          Digital Lapak Jaru
        </h1>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 mb-3 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="email@domain.com"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          Belum punya akun?{" "}
          <Link href="/auth/register" className="text-green-600 underline">
            Daftar
          </Link>
        </p>
      </form>
    </div>
  );
}

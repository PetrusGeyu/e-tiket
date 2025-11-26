"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { saveToken } from "@/utils/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, email, password, confirm_password } = form;

    // Validasi sederhana di frontend
    if (!name || !email || !password || !confirm_password) {
      return setError("Semua field wajib diisi.");
    }

    if (password !== confirm_password) {
      return setError("Password dan konfirmasi password tidak sama.");
    }

    // Validasi pola dasar (mirip regex Laravel)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return setError(
        "Password harus mengandung huruf besar, huruf kecil, angka, dan simbol, minimal 8 karakter."
      );
    }

    try {
      setLoading(true);

      // Kirim ke endpoint Laravel
      const res = await api.post("/register", form);

      const token = res.data.token;
      

      if (!token) throw new Error("Token tidak ditemukan di response");

      saveToken(token);
    

      // Redirect ke dashboard setelah register sukses
      router.push("/dashboard");
    } catch (err) {
      console.error("Register error:", err?.response?.data);
      const res = err?.response?.data;
      const errors = res?.errors;

      // Ambil semua pesan error Laravel (jika ada)
      if (errors) {
        const allErrors = Object.values(errors).flat().join(" ");
        setError(allErrors);
      } else {
        setError(res?.message || "Registrasi gagal. Silakan coba lagi.");
      }
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
          <span className="text-sm font-medium">Nama Lengkap</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Nama Lengkap"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Email</span>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="email@domain.com"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Password</span>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Minimal 8 karakter, kombinasi huruf besar, kecil, angka, simbol"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Konfirmasi Password</span>
          <input
            type="password"
            name="confirm_password"
            value={form.confirm_password}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="Ulangi password"
          />
        </label>

        <button
          type="submit"
          className={`w-full py-2 rounded text-white transition ${
            loading
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
          disabled={loading}
        >
          {loading ? "Memproses..." : "Daftar"}
        </button>

        <p className="mt-4 text-sm text-center text-gray-500">
          Sudah punya akun?{" "}
          <Link href="/auth/login" className="text-green-600 underline">
            Masuk
          </Link>
        </p>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function TransactionForm({ transaction, onClose, onSaved }) {
  const [form, setForm] = useState({
    ticket_name: "",
    price_ticket: "",
    buyer_name: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔹 Isi form saat edit
  useEffect(() => {
    if (transaction) {
      setForm({
        ticket_name: transaction.ticket_name || "",
        price_ticket: transaction.price_ticket || "",
        buyer_name: transaction.buyer_name || "",
        quantity: transaction.quantity || "",
      });
    } else {
      setForm({
        ticket_name: "",
        price_ticket: "",
        buyer_name: "",
        quantity: "",
      });
    }
  }, [transaction]);

  // 🔹 Handle input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Submit form (ONLINE ONLY)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !form.ticket_name ||
      !form.price_ticket ||
      !form.buyer_name ||
      !form.quantity
    ) {
      setError("Semua field wajib diisi.");
      return;
    }

    console.log("📦 Data dikirim:", form);
    setLoading(true);

    const token = getToken();

    try {
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/transactions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      console.error("❌ Gagal menyimpan transaksi:", err);
      setError(
        err?.response?.data?.message ||
          "Terjadi kesalahan saat menyimpan transaksi."
      );
    } finally {
      setLoading(false);
    }
  };

  // 🧱 UI
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
          {transaction ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 mb-3 rounded">
            {error}
          </div>
        )}

        {/* Nama Tiket */}
        <label className="block mb-2">
          <span className="text-sm font-medium">Nama Tiket</span>
          <input
            type="text"
            name="ticket_name"
            value={form.ticket_name}
            onChange={handleChange}
            placeholder="Masukkan nama tiket"
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        {/* Harga Tiket */}
        <label className="block mb-2">
          <span className="text-sm font-medium">Harga Tiket</span>
          <input
            type="number"
            name="price_ticket"
            value={form.price_ticket}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 bg-gray-100"
          />
        </label>

        {/* Nama Pembeli */}
        <label className="block mb-2">
          <span className="text-sm font-medium">Nama Pembeli</span>
          <input
            type="text"
            name="buyer_name"
            value={form.buyer_name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        {/* Jumlah Tiket */}
        <label className="block mb-4">
          <span className="text-sm font-medium">Jumlah Tiket</span>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            min="1"
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        {/* Tombol aksi */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Batal
          </button>

          <button
            type="submit"
            disabled={loading}
            className={`px-4 py-2 text-white rounded ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function TransactionForm({ transaction, onClose, onSaved }) {
  const [form, setForm] = useState({
    ticket_name: "",
    ticket_price: "",
    buyer_name: "",
    quantity: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setForm({
        ticket_name: transaction.ticket_name || "",
        ticket_price: String(transaction.ticket_price || ""),
        buyer_name: transaction.buyer_name || "",
        quantity: String(transaction.quantity || ""),
      });
    }
  }, [transaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.ticket_name || !form.ticket_price || !form.buyer_name || !form.quantity) {
      setError("Semua field wajib diisi.");
      return;
    }

    const payload = {
      ticket_name: form.ticket_name,
      ticket_price: Number(form.ticket_price),
      buyer_name: form.buyer_name,
      quantity: Number(form.quantity),
    };

    setLoading(true);

    try {
      const token = getToken();

      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/transactions", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      onSaved?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded w-full max-w-md shadow">
        <h2 className="text-xl font-bold mb-4 text-green-700 text-center">
          {transaction ? "✏️ Edit Transaksi" : "➕ Tambah Transaksi"}
        </h2>

        {error && <div className="bg-red-100 text-red-700 p-2 mb-3 rounded">{error}</div>}

        <label className="block mb-3">
          <span>Nama Tiket</span>
          <input
            name="ticket_name"
            value={form.ticket_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </label>

        <label className="block mb-3">
          <span>Harga Tiket</span>
          <input
            type="number"
            name="ticket_price"
            value={form.ticket_price}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </label>

        <label className="block mb-3">
          <span>Nama Pembeli</span>
          <input
            name="buyer_name"
            value={form.buyer_name}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </label>

        <label className="block mb-4">
          <span>Jumlah Tiket</span>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="w-full border rounded p-2"
          />
        </label>

        <div className="flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

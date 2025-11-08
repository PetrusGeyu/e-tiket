"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function TransactionForm({ transaction, onClose, onSaved }) {
  const [form, setForm] = useState({
    ticket_id: "",
    buyer_name: "",
    quantity: "",
    status: "pending",
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil daftar tiket untuk dropdown
  useEffect(() => {
    const token = getToken();
    api
      .get("/tickets", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setTickets(res.data.data))
      .catch(() => console.error("Gagal memuat tiket"));
  }, []);

  // Isi form jika edit
  useEffect(() => {
    if (transaction) setForm(transaction);
  }, [transaction]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const token = getToken();
      if (transaction) {
        await api.put(`/transactions/${transaction.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/transactions", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal menyimpan transaksi. Periksa data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-6 rounded-lg shadow"
      >
        <h2 className="text-xl font-bold mb-4 text-green-700">
          {transaction ? "Edit Transaksi" : "Tambah Transaksi"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 mb-3 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-sm font-medium">Pilih Tiket</span>
          <select
            name="ticket_id"
            value={form.ticket_id}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          >
            <option value="">-- Pilih Tiket --</option>
            {tickets.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} - Rp {t.price}
              </option>
            ))}
          </select>
        </label>

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

        <label className="block mb-2">
          <span className="text-sm font-medium">Jumlah Tiket</span>
          <input
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Status</span>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </label>

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

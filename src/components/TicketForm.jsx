"use client";

import { useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function TicketForm({ ticket, onClose, onSaved }) {
  const [form, setForm] = useState(
    ticket || { name: "", price: "", description: "", is_active: 1 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price || !form.description) {
      return setError("Semua field wajib diisi.");
    }

    try {
      setLoading(true);
      const token = getToken();
      if (ticket) {
        await api.put(`/tickets/${ticket.id}`, form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("/tickets", form, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "Gagal menyimpan tiket. Periksa input Anda."
      );
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
          {ticket ? "Edit Tiket" : "Tambah Tiket"}
        </h2>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 mb-3 rounded">
            {error}
          </div>
        )}

        <label className="block mb-2">
          <span className="text-sm font-medium">Nama Tiket</span>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Harga (Rp)</span>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Deskripsi</span>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2 focus:ring-2 focus:ring-green-400"
          ></textarea>
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Status</span>
          <select
            name="is_active"
            value={form.is_active}
            onChange={handleChange}
            className="mt-1 block w-full border rounded px-3 py-2"
          >
            <option value={1}>Aktif</option>
            <option value={0}>Nonaktif</option>
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

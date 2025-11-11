"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import TicketForm from "@/components/TicketForm";
import { saveOfflineTicket, syncOfflineTickets } from "@/lib/sync";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // 🔹 Ambil semua tiket
  const fetchTickets = async () => {
    try {
      const token = getToken();
      const res = await api.get("/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data || []);
    } catch (err) {
      console.warn("⚠️ Tidak bisa ambil tiket dari server, gunakan data lokal.");
      const localTickets =
        JSON.parse(localStorage.getItem("offline_tickets")) || [];
      setTickets(localTickets);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();

    // Sinkronisasi otomatis saat online
    if (navigator.onLine) syncOfflineTickets();

    window.addEventListener("online", syncOfflineTickets);
    return () => window.removeEventListener("online", syncOfflineTickets);
  }, []);

  // 🔹 Hapus tiket
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus tiket ini?")) return;
    try {
      const token = getToken();
      await api.delete(`/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Tiket berhasil dihapus");
      fetchTickets();
    } catch (err) {
      alert("❌ Gagal menghapus tiket (mungkin offline)");
    }
  };

  // 🔹 Simpan offline
  const handleOfflineSave = (ticket) => {
    saveOfflineTicket(ticket);
    alert("💾 Tiket disimpan secara offline. Akan disinkronkan otomatis nanti.");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
          🎟️ Manajemen Tiket
        </h1>
        <button
          onClick={() => {
            setSelectedTicket(null);
            setShowForm(true);
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow"
        >
          + Tambah Tiket
        </button>
      </div>
      {/* Tabel */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        {loading ? (
          <p className="p-4 text-gray-600">Memuat data tiket...</p>
        ) : tickets.length > 0 ? (
          <table className="w-full border-collapse text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-4 py-2 text-left font-medium">#</th>
                <th className="px-4 py-2 text-left font-medium">Nama Tiket</th>
                <th className="px-4 py-2 text-left font-medium">Harga</th>
                <th className="px-4 py-2 text-center font-medium">Status</th>
                <th className="px-4 py-2 text-center font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((t, i) => (
                <tr
                  key={t.id || i}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.name}</td>
                  <td className="px-4 py-2">Rp {t.price}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        t.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {t.is_active ? "Aktif" : "Nonaktif"}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedTicket(t);
                        setShowForm(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center py-6 text-gray-500 italic">
            Belum ada tiket.
          </p>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <TicketForm
          ticket={selectedTicket}
          onClose={() => setShowForm(false)}
          onSaved={fetchTickets}
          onOfflineSave={handleOfflineSave}
        />
      )}
    </div>
  );
}

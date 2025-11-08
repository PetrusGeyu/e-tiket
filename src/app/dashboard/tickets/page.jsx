"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import TicketForm from "@/components/TicketForm";
import {
  saveOfflineTicket,
  syncOfflineTickets,
} from "@/lib/sync";

export default function TicketsPage() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const fetchTickets = async () => {
    try {
      const token = getToken();
      const res = await api.get("/tickets", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTickets(res.data.data);
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

    if (navigator.onLine) {
      syncOfflineTickets();
    }

    window.addEventListener("online", syncOfflineTickets);
    return () => window.removeEventListener("online", syncOfflineTickets);
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus tiket ini?")) return;

    try {
      const token = getToken();
      await api.delete(`/tickets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTickets();
    } catch (err) {
      alert("❌ Gagal menghapus tiket (mungkin offline)");
    }
  };

  const handleOfflineSave = (ticket) => {
    saveOfflineTicket(ticket);
    alert("💾 Tiket disimpan secara offline. Akan disinkronkan otomatis nanti.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Manajemen Tiket
      </h1>

      <button
        onClick={() => {
          setSelectedTicket(null);
          setShowForm(true);
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        + Tambah Tiket
      </button>

      {loading ? (
        <p className="mt-4 text-gray-600">Memuat data tiket...</p>
      ) : (
        <table className="mt-4 w-full border border-gray-200 bg-white rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Nama Tiket</th>
              <th className="p-3 border">Harga</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket, index) => (
              <tr key={ticket.id || index} className="text-center">
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{ticket.name}</td>
                <td className="border p-2">Rp {ticket.price}</td>
                <td className="border p-2">
                  {ticket.is_active ? (
                    <span className="text-green-600 font-medium">Aktif</span>
                  ) : (
                    <span className="text-gray-400">Nonaktif</span>
                  )}
                </td>
                <td className="border p-2 space-x-2">
                  <button
                    onClick={() => {
                      setSelectedTicket(ticket);
                      setShowForm(true);
                    }}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(ticket.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

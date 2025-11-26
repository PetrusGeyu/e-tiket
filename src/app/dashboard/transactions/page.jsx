"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import TransactionForm from "@/components/TransactionForm";
import {
  saveOfflineTransaction,
  getOfflineTransactions,
  syncOfflineTransactions,
} from "@/lib/sync";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  // 🔹 Ambil semua transaksi (online/offline)
  const fetchTransactions = async () => {
    try {
      const token = getToken();
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const allTransactions = res.data.data || [];

      // Simpan cache transaksi
      localStorage.setItem("transactions_cache", JSON.stringify(allTransactions));

      // Ambil tiket aktif dari cache (kalau ada)
      const cachedTickets =
        JSON.parse(localStorage.getItem("tickets_cache")) || [];

      const activeTickets = cachedTickets.filter(
        (t) => t.is_active === 1 || t.is_active === true
      );

      // Filter transaksi hanya untuk tiket aktif
      const filteredTransactions =
        activeTickets.length > 0
          ? allTransactions.filter((t) =>
              activeTickets.some(
                (ticket) =>
                  ticket.id === t.ticket_id ||
                  ticket.name?.trim().toLowerCase() ===
                    t.ticket_name?.trim().toLowerCase()
              )
            )
          : allTransactions;

      // Gabungkan dengan data offline
      const offlineData = getOfflineTransactions();
      setTransactions([...filteredTransactions, ...offlineData]);
    } catch (err) {
      console.warn("⚠️ Gagal memuat transaksi dari server, gunakan data lokal.");
      const cached = JSON.parse(localStorage.getItem("transactions_cache")) || [];
      const offlineData = getOfflineTransactions();
      setTransactions([...cached, ...offlineData]);
    }
  };

  // 🔹 Setup awal dan event listener online/offline
  useEffect(() => {
    fetchTransactions();

    // Sinkron otomatis saat online
    if (navigator.onLine) syncOfflineTransactions();

    const handleOnline = () => {
      setIsOffline(false);
      syncOfflineTransactions();
      fetchTransactions();
    };

    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // 🔹 Simpan transaksi offline
  const handleOfflineSave = (data) => {
    saveOfflineTransaction(data);
    alert("💾 Transaksi disimpan secara offline. Akan disinkronkan nanti.");
    fetchTransactions();
  };

  // 🔹 Tambah transaksi
  const handleAdd = () => {
    setSelectedTransaction(null);
    setShowForm(true);
  };

  // 🔹 Edit transaksi
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  // 🔹 Hapus transaksi
  const handleDelete = async (id) => {
    if (!confirm("Yakin ingin menghapus transaksi ini?")) return;

    // Jika offline
    if (isOffline) {
      const offlineData = getOfflineTransactions();
      const updated = offlineData.filter((t) => t.id !== id);
      localStorage.setItem("offline_transactions", JSON.stringify(updated));

      const cached = JSON.parse(localStorage.getItem("transactions_cache")) || [];
      const updatedCache = cached.filter((t) => t.id !== id);
      localStorage.setItem("transactions_cache", JSON.stringify(updatedCache));

      setTransactions([...updatedCache, ...updated]);
      alert("🗑️ Transaksi dihapus secara offline.");
      return;
    }

    // Jika online
    try {
      const token = getToken();
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Transaksi berhasil dihapus");
      fetchTransactions();
    } catch (err) {
      console.error("❌ Gagal menghapus transaksi:", err);
      alert("Gagal menghapus transaksi.");
    }
  };

  // 🔹 Export ke Excel
  const handleExportExcel = async () => {
    try {
      const token = getToken();
      const url = `${process.env.NEXT_PUBLIC_API_URL}/transactions/export/excel`;

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal mengekspor data.");

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `data_transaksi_${new Date()
        .toISOString()
        .slice(0, 19)
        .replace(/[:T]/g, "-")}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error(err);
      alert("❌ Terjadi kesalahan saat export Excel");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          🧾 Manajemen Transaksi
        </h1>

        <div className="flex items-center gap-3">
          {isOffline && (
            <span className="bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded">
              ⚠️ Offline Mode
            </span>
          )}

          {/* Tombol Export */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow flex items-center gap-2"
          >
            📊 Export Excel
          </button>

          {/* Tombol Tambah */}
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            + Tambah Transaksi
          </button>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left font-medium">#</th>
              <th className="px-4 py-2 text-left font-medium">Nama Pembeli</th>
              <th className="px-4 py-2 text-left font-medium">Nama Tiket</th>
              <th className="px-4 py-2 text-left font-medium">Harga Tiket</th>
              <th className="px-4 py-2 text-center font-medium">Jumlah</th>
              <th className="px-4 py-2 text-center font-medium">Total</th>
              <th className="px-4 py-2 text-center font-medium">Tanggal</th>
              <th className="px-4 py-2 text-center font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <tr
                  key={t.id || i}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.buyer_name}</td>
                  <td className="px-4 py-2">{t.ticket_name}</td>
                  <td className="px-4 py-2 text-center font-semibold text-gray-800">
                    Rp{" "}
                    {Number(
                      t.total_price || t.quantity * (t.ticket_price || 0)
                    ).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2 text-center">{t.quantity}</td>
                  <td className="px-4 py-2 text-center">{t.total_price}</td>
                  <td className="px-4 py-2 text-center">
                    {t.visit_date
                      ? new Date(t.visit_date).toLocaleDateString("id-ID")
                      : "-"}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id || t.buyer_name)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      🗑️ Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Tidak ada transaksi untuk tiket aktif.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal form transaksi */}
      {showForm && (
        <TransactionForm
          transaction={selectedTransaction}
          onClose={() => setShowForm(false)}
          onSaved={fetchTransactions}
          onOfflineSave={handleOfflineSave}
        />
      )}
    </div>
  );
}

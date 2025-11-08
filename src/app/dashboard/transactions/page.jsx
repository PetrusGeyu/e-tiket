"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import TransactionForm from "@/components/TransactionForm";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [offlineTransactions, setOfflineTransactions] = useState([]);

  // 🔹 Ambil semua transaksi
  const fetchTransactions = async () => {
    try {
      const token = getToken();
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 🔹 Simpan transaksi offline
  const handleOfflineSave = (data) => {
    const updated = [...offlineTransactions, data];
    setOfflineTransactions(updated);
    localStorage.setItem("offline_transactions", JSON.stringify(updated));
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
    try {
      const token = getToken();
      await api.delete(`/transactions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Transaksi berhasil dihapus");
      fetchTransactions();
    } catch (err) {
      console.error("Gagal menghapus transaksi:", err);
      alert("Gagal menghapus transaksi.");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-700">
          🧾 Manajemen Transaksi
        </h1>
        <button
          onClick={handleAdd}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
        >
          + Tambah Transaksi
        </button>
      </div>

      {/* Tabel Transaksi */}
      <div className="overflow-x-auto bg-white shadow rounded-lg border border-gray-100">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="px-4 py-2 text-left font-medium">#</th>
              <th className="px-4 py-2 text-left font-medium">Nama Pembeli</th>
              <th className="px-4 py-2 text-left font-medium">Tiket</th>
              <th className="px-4 py-2 text-center font-medium">Jumlah</th>
              <th className="px-4 py-2 text-center font-medium">Status</th>
              <th className="px-4 py-2 text-center font-medium">Tanggal</th>
              <th className="px-4 py-2 text-center font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t, i) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-2">{i + 1}</td>
                  <td className="px-4 py-2">{t.buyer_name}</td>
                  <td className="px-4 py-2">{t.ticket_name}</td>
                  <td className="px-4 py-2 text-center">{t.quantity}</td>
                  <td className="px-4 py-2 text-center">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded ${
                        t.status === "paid"
                          ? "bg-green-100 text-green-700"
                          : t.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center">
                    {new Date(t.visit_date).toLocaleDateString("id-ID")}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    <button
                      onClick={() => handleEdit(t)}
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
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-500 italic"
                >
                  Belum ada transaksi.
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

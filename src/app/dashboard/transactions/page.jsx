"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import TransactionForm from "@/components/TransactionForm";

export default function TransactionPage() {
  const [transactions, setTransactions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ambil semua transaksi (online-only)
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allTransactions = res.data?.data || [];
      setTransactions(allTransactions);
    } catch (err) {
      console.error("❌ Gagal memuat transaksi:", err);
      alert("⚠️ Gagal memuat transaksi dari server. Coba refresh atau periksa koneksi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
    // Tidak perlu listen online/offline karena offline mode dihapus
  }, []);

  // Tambah transaksi (buka form)
  const handleAdd = () => {
    setSelectedTransaction(null);
    setShowForm(true);
  };

  // Edit transaksi (buka form dengan data)
  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowForm(true);
  };

  // Hapus transaksi (online only)
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
      console.error("❌ Gagal menghapus transaksi:", err);
      alert("Gagal menghapus transaksi. Cek koneksi atau coba lagi.");
    }
  };

  // Export ke Excel (online)
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
        <h1 className="text-2xl font-bold text-green-700">🧾 Manajemen Transaksi</h1>

        <div className="flex items-center gap-3">
          {/* Tombol Export */}
          <button
            onClick={handleExportExcel}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow flex items-center gap-2"
            disabled={loading}
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

          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg shadow"
          >
            🔄 Refresh Data
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
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center py-6 text-gray-500 italic">
                  Memuat transaksi...
                </td>
              </tr>
            ) : transactions.length > 0 ? (
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
                    {Number(t.ticket_price ?? (t.total_price / (t.quantity || 1) || 0)).toLocaleString(
                      "id-ID"
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">{t.quantity}</td>
                  <td className="px-4 py-2 text-center font-semibold">
                    Rp {Number(t.total_price ?? (t.quantity * (t.ticket_price || 0))).toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-2 text-center">
                    {t.visit_date ? new Date(t.visit_date).toLocaleDateString("id-ID") : "-"}
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
                <td colSpan="8" className="text-center py-6 text-gray-500 italic">
                  Tidak ada transaksi.
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
          onSaved={() => {
            setShowForm(false);
            fetchTransactions();
          }}
        />
      )}
    </div>
  );
}

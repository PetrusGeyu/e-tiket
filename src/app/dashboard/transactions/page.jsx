"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import { saveOfflineTransaction, syncOfflineTransactions } from "@/lib/sync";
import TransactionForm from "@/components/TransactionForm";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Ambil transaksi dari server
  const fetchTransactions = async () => {
    try {
      const token = getToken();
      const res = await api.get("/transactions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data.data);
    } catch (err) {
      console.error("Gagal memuat transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    // Jalankan sinkronisasi otomatis jika online
    if (navigator.onLine) {
      syncOfflineTransactions();
    }

    // Deteksi perubahan status koneksi
    window.addEventListener("online", syncOfflineTransactions);
    return () => window.removeEventListener("online", syncOfflineTransactions);
  }, []);

  const handleOfflineAdd = (transaction) => {
    saveOfflineTransaction(transaction);
    alert("💾 Tidak ada koneksi. Transaksi disimpan offline.");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-4">
        Manajemen Transaksi
      </h1>

      <button
        onClick={() => {
          setSelectedTransaction(null);
          setShowForm(true);
        }}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        + Tambah Transaksi
      </button>

      {loading ? (
        <p className="mt-4 text-gray-600">Memuat data transaksi...</p>
      ) : (
        <table className="mt-4 w-full border border-gray-200 bg-white rounded-lg overflow-hidden">
          <thead className="bg-green-100">
            <tr>
              <th className="p-3 border">#</th>
              <th className="p-3 border">Nama Tiket</th>
              <th className="p-3 border">Pembeli</th>
              <th className="p-3 border">Jumlah</th>
              <th className="p-3 border">Total</th>
              <th className="p-3 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t, i) => (
              <tr key={t.id} className="text-center">
                <td className="border p-2">{i + 1}</td>
                <td className="border p-2">{t.ticket_name}</td>
                <td className="border p-2">{t.buyer_name}</td>
                <td className="border p-2">{t.quantity}</td>
                <td className="border p-2">Rp {t.total_price}</td>
                <td className="border p-2">{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {showForm && (
        <TransactionForm
          transaction={selectedTransaction}
          onClose={() => setShowForm(false)}
          onSaved={fetchTransactions}
          onOfflineSave={handleOfflineAdd} // 🔥 simpan offline
        />
      )}
    </div>
  );
}

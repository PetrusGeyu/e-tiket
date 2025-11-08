import api from "./api";
import { getToken } from "@/utils/auth";

// === TRANSAKSI ===
export function saveOfflineTransaction(transaction) {
  const offlineData =
    JSON.parse(localStorage.getItem("offline_transactions")) || [];
  offlineData.push(transaction);
  localStorage.setItem("offline_transactions", JSON.stringify(offlineData));
}

export function getOfflineTransactions() {
  return JSON.parse(localStorage.getItem("offline_transactions")) || [];
}

export function clearOfflineTransactions() {
  localStorage.removeItem("offline_transactions");
}

export async function syncOfflineTransactions() {
  const offlineData = getOfflineTransactions();
  if (offlineData.length === 0) return;
  try {
    const token = getToken();
    await api.post(
      "/sync/upload",
      { transactions: offlineData },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    clearOfflineTransactions();
    console.log("✅ Transaksi offline berhasil disinkronkan");
    alert("✅ Data transaksi offline berhasil disinkronkan!");
  } catch (err) {
    console.error("❌ Gagal sinkronisasi transaksi:", err);
  }
}

// === TIKET ===
export function saveOfflineTicket(ticket) {
  const offlineTickets =
    JSON.parse(localStorage.getItem("offline_tickets")) || [];
  offlineTickets.push(ticket);
  localStorage.setItem("offline_tickets", JSON.stringify(offlineTickets));
  console.log("💾 Tiket disimpan offline:", ticket);
}

export function getOfflineTickets() {
  return JSON.parse(localStorage.getItem("offline_tickets")) || [];
}

export function clearOfflineTickets() {
  localStorage.removeItem("offline_tickets");
}

export async function syncOfflineTickets() {
  const offlineTickets = getOfflineTickets();
  if (offlineTickets.length === 0) return;

  try {
    const token = getToken();
    for (const t of offlineTickets) {
      await api.post("/tickets", t, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearOfflineTickets();
    console.log("✅ Tiket offline berhasil disinkronkan");
    alert("✅ Data tiket offline berhasil disinkronkan!");
  } catch (err) {
    console.error("❌ Gagal sinkronisasi tiket:", err);
  }
}

import api from "./api";
import { getToken } from "@/utils/auth";

// ===== Helper =====
const getLocal = (key) => JSON.parse(localStorage.getItem(key)) || [];
const setLocal = (key, val) => localStorage.setItem(key, JSON.stringify(val));
const clearLocal = (key) => localStorage.removeItem(key);

// ===== Tickets =====
export const saveOfflineTicket = (ticket) => {
  const data = getLocal("offline_tickets");
  const localTicket = { ...ticket, id: ticket.id || Date.now(), isOffline: true };
  data.push(localTicket);
  setLocal("offline_tickets", data);
  console.log("💾 Tiket disimpan offline:", localTicket);
};

export const getOfflineTickets = () => getLocal("offline_tickets");

export const syncOfflineTickets = async () => {
  const tickets = getOfflineTickets();
  if (tickets.length === 0) return;

  try {
    const token = getToken();
    for (const t of tickets) {
      await api.post("/tickets", t, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearLocal("offline_tickets");
    alert("✅ Tiket offline berhasil disinkronkan ke server!");
  } catch (err) {
    console.warn("⚠️ Gagal sinkron tiket:", err);
  }
};

// ===== Transactions =====
export const saveOfflineTransaction = (transaction) => {
  const data = getLocal("offline_transactions");
  const localTrx = { ...transaction, id: transaction.id || Date.now(), isOffline: true };
  data.push(localTrx);
  setLocal("offline_transactions", data);
  console.log("💾 Transaksi disimpan offline:", localTrx);
};

export const getOfflineTransactions = () => getLocal("offline_transactions");

export const syncOfflineTransactions = async () => {
  const transactions = getOfflineTransactions();
  if (transactions.length === 0) return;

  try {
    const token = getToken();
    for (const trx of transactions) {
      await api.post("/transactions", trx, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    clearLocal("offline_transactions");
    alert("✅ Transaksi offline berhasil disinkronkan ke server!");
  } catch (err) {
    console.warn("⚠️ Gagal sinkron transaksi:", err);
  }
};

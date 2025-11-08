"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      api
        .get("/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setStats(res.data))
        .catch(() => setStats({ pengunjung: 0, pendapatan: 0 }));
    }
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700">Dashboard</h1>
      <p className="mt-2 text-gray-600">
        Selamat datang di sistem e-ticket Fenya.
      </p>

      {stats && (
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">
              Pengunjung Hari Ini
            </h2>
            <p className="text-2xl font-bold text-green-700">
              {stats.pengunjung}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-sm font-medium text-gray-600">Pendapatan</h2>
            <p className="text-2xl font-bold text-green-700">
              Rp {stats.pendapatan}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

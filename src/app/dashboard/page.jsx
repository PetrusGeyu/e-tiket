"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { getToken } from "@/utils/auth";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStatistics = async () => {
    try {
      const token = getToken();
      const res = await api.get("/statistics", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data.data);
    } catch (err) {
      console.error("Gagal memuat statistik:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  if (loading) {
    return <p className="text-gray-600">📊 Memuat statistik...</p>;
  }

  if (!stats) {
    return <p className="text-red-500">❌ Tidak dapat memuat data statistik.</p>;
  }

  const { visitors, revenue } = stats;

  // Siapkan data untuk grafik bar
  const chartData = [
    { name: "Hari Ini", visitors: visitors.today, revenue: revenue.today },
    { name: "Minggu Ini", visitors: visitors.week, revenue: revenue.week },
    { name: "Bulan Ini", visitors: visitors.month, revenue: revenue.month },
    { name: "Tahun Ini", visitors: visitors.year, revenue: revenue.year },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-green-700 mb-6">📊 Dashboard</h1>

      {/* Statistik Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <StatCard
          title="Pengunjung Hari Ini"
          value={visitors.today}
          color="bg-green-500"
        />
        <StatCard
          title="Pengunjung Bulan Ini"
          value={visitors.month}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Pendapatan Tahun Ini"
          value={`Rp ${revenue.year.toLocaleString()}`}
          color="bg-yellow-500"
        />
      </div>

      {/* Grafik */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-green-700">
          Grafik Pengunjung & Pendapatan
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="visitors" fill="#16a34a" name="Pengunjung" />
            <Bar dataKey="revenue" fill="#facc15" name="Pendapatan" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Statistik Tambahan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <StatCard
          title="Pengunjung Weekday"
          value={visitors.weekday}
          color="bg-teal-500"
        />
        <StatCard
          title="Pengunjung Weekend"
          value={visitors.weekend}
          color="bg-pink-500"
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div className={`p-5 rounded-lg shadow-md text-white ${color}`}>
      <p className="text-sm opacity-90">{title}</p>
      <h3 className="text-2xl font-bold mt-1">{value}</h3>
    </div>
  );
}

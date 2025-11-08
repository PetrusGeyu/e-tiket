"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "@/utils/auth";
import { useEffect } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Tiket", href: "/dashboard/tickets" },
     {name: "Transaksi", href: "/dashboard/transactions"},
    { name: "Pengunjung", href: "/dashboard/visitors" },
    { name: "Laporan", href: "/dashboard/reports" },
  ];

  // Logout handler
  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  // Cek login token
  useEffect(() => {
    const token = getToken();
    if (!token) router.push("/auth/login");
  }, [router]);

  return (
    <aside className="w-64 h-screen bg-green-700 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-green-600">
        Fenya E-Ticket
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`block px-3 py-2 rounded-md text-sm font-medium transition ${
                isActive
                  ? "bg-green-500 text-white"
                  : "text-green-100 hover:bg-green-600"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-green-600">
        <button
          onClick={handleLogout}
          className="w-full text-left bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getToken, removeToken } from "@/utils/auth";
import { useEffect } from "react";
import {
  LogOut,
  LayoutDashboard,
  Ticket,
  Users,
  FileText,
  ShoppingCart,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Tiket", href: "/dashboard/tickets", icon: <Ticket size={18} /> },
    { name: "Transaksi", href: "/dashboard/transactions", icon: <ShoppingCart size={18} /> },
  ];

  const handleLogout = () => {
    removeToken();
    router.push("/auth/login");
  };

  useEffect(() => {
    const token = getToken();
    if (!token) router.push("/auth/login");
  }, [router]);

  return (
    <aside
      className="
        fixed top-0 left-0
        w-64 h-screen
        bg-green-700 text-white
        flex flex-col justify-between
        shadow-xl z-50
      "
    >
      {/* Header */}
      <div className="p-6 text-2xl font-bold border-b border-green-600 flex items-center gap-2">
        🎫 <span>Fenya E-Ticket</span>
      </div>

      {/* Navigasi */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-green-500 text-white shadow-inner"
                  : "text-green-100 hover:bg-green-600 hover:text-white"
              }`}
            >
              {link.icon}
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-green-600">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 justify-center bg-red-500 hover:bg-red-600 px-3 py-2 rounded-md text-sm font-medium transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}

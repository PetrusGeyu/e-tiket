"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard"); // langsung arahkan ke dashboard
  }, [router]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-green-600">Fenya E-Ticket</h1>
      <p className="mt-2 text-gray-600">
        Mengarahkan ke dashboard...
      </p>
    </main>
  );
}

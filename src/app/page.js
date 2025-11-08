import Image from "next/image";

export default function Home() {
  return (
   <>
    <main className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-4xl font-bold text-green-600">Fenya E-Ticket</h1>
      <p className="mt-2 text-gray-600">Pesan tiket taman wisata dengan mudah, bahkan tanpa internet.</p>
      <a href="/login" className="mt-6 bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600">
        Masuk Sekarang
      </a>
    </main>
   </>
  );
}

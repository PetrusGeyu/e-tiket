"use client";
import Image from "next/image";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-green-700 mb-4 text-center">
          🌳 Taman Hutan Raya Lapak Jaru
        </h1>

        {/* Foto */}
        <div className="flex justify-center mb-6">
          <Image
            src="/lapakjaru.jpg" // ← simpan gambar ini di public/lapakjaru.jpg
            alt="Taman Hutan Raya Lapak Jaru"
            width={800}
            height={400}
            className="rounded-xl shadow-lg object-cover"
          />
        </div>

        {/* Deskripsi */}
        <p className="text-gray-700 leading-relaxed mb-4">
          <strong>TAHURA (Taman Hutan Raya) Lapak Jaru</strong> adalah satu-satunya taman
          hutan raya yang berlokasi di Kabupaten Gunung Mas, Kalimantan Tengah.
          Kawasan ini dikenal sebagai destinasi wisata unggulan daerah yang menonjolkan
          keindahan alam yang masih sangat alami dan terjaga.
        </p>

        <h2 className="text-2xl font-semibold text-green-700 mt-6 mb-3">📍 Detail Lokasi</h2>
        <ul className="text-gray-700 space-y-2">
          <li><strong>Nama:</strong> TAHURA LAPAK JARU KABUPATEN GUNUNG MAS</li>
          <li>
            <strong>Alamat:</strong> Jln. Bawi Kameloh, Kuala Kurun, Kec. Kurun, Kabupaten Gunung MAS, Kalimantan Tengah 74511
          </li>
          <li><strong>Rating:</strong> ⭐ 4.2 / 5.0</li>
          <li><strong>Jam Buka:</strong> Setiap hari (09.00 - 16.00)</li>
          <li>
            <strong>Tautan Peta:</strong>{" "}
            <a
              href="https://www.google.com/maps?q=Tahura+Lapak+Jaru+Gunung+Mas"
              target="_blank"
              className="text-blue-600 underline"
            >
              Lihat di Google Maps
            </a>
          </li>
        </ul>

        <h2 className="text-2xl font-semibold text-green-700 mt-8 mb-3">
          🌲 Profil & Potensi Kawasan
        </h2>
        <p className="text-gray-700 mb-3">
          TAHURA Lapak Jaru memiliki luas sekitar <strong>4.119 hektar</strong> dan ditetapkan
          melalui Keputusan Menteri Lingkungan Hidup dan Kehutanan. Kawasan ini memiliki
          potensi luar biasa, meliputi:
        </p>

        <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
          <li><strong>Keindahan Alam:</strong> Flora dan fauna yang masih terjaga dan alami.</li>
          <li><strong>Potensi Wisata:</strong> Objek wisata alam dengan keindahan dan keutuhan sumber daya.</li>
          <li><strong>Pengembangan:</strong> Fokus pada pengelolaan optimal dan visi “SMART TOURISM”.</li>
        </ul>

        <p className="text-gray-700 mb-4">
          Kawasan ini dibuka kembali pada awal tahun 2022 dan terus dikembangkan
          sebagai destinasi <em>ekowisata</em> serta kawasan konservasi unggulan di Kalimantan Tengah.
        </p>

        <h2 className="text-2xl font-semibold text-green-700 mt-8 mb-3">
          💡 Alasan E-Ticket Diciptakan
        </h2>
        <p className="text-gray-700 leading-relaxed">
          E-Ticket Lapak Jaru diciptakan untuk mendukung visi <strong>“Smart Tourism”</strong> dengan
          tujuan mempermudah pengunjung dalam proses pemesanan tiket, meningkatkan efisiensi
          pengelolaan data wisata, dan mendorong digitalisasi layanan publik di kawasan
          <strong> TAHURA Lapak Jaru</strong>. Dengan sistem ini, wisatawan tetap bisa memesan tiket
          bahkan tanpa koneksi internet (offline mode).
        </p>

        {/* Tombol ke Statistik */}
        <div className="text-center mt-8">
          <Link
            href="/statistics"
            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow"
          >
            📊 Lihat Statistik
          </Link>
        </div>
      </div>
    </main>
  );
}

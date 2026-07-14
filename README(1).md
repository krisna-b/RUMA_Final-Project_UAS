<div align="center">

# 🛋️ RUMA
### Furniture & Home Living

*"Ruang yang pas, untuk hidup yang pas."*

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

![RUMA Banner](images/hero/banner.jpg)

</div>

## 📑 Daftar Isi
- [Business Overview](#-business-overview)
- [Apa yang Ada di Website Ini](#️-apa-yang-ada-di-website-ini)
- [Fitur Lanjutan (Roadmap)](#-fitur-lanjutan-roadmap)
- [Tampilan Website](#-tampilan-website)
- [Tech Stack](#️-tech-stack)
- [Struktur Proyek](#-struktur-proyek)
- [Live Demo](#-live-demo)

---

## 📋 Business Overview

**RUMA** adalah platform e-commerce furniture dan home living yang menghadirkan produk-produk fungsional bergaya minimalis dengan harga terjangkau, dirancang khusus untuk memenuhi kebutuhan hunian dengan ruang terbatas seperti apartemen, kos-kosan, dan rumah tipe kecil.

Terinspirasi dari konsep furniture flat-pack global (seperti IKEA), RUMA hadir sebagai alternatif lokal yang lebih terjangkau namun tetap mengutamakan desain rapi, kualitas material yang baik, dan kemudahan perakitan mandiri (self-assembly).

### Value Proposition
- **Desain modern & minimalis** — cocok untuk berbagai gaya hunian urban
- **Harga terjangkau** — diposisikan di antara produk premium (Informa, Fabelio) dan produk generik marketplace
- **Ramah ruang kecil** — banyak produk dirancang multifungsi dan hemat tempat
- **Mudah dirakit sendiri** — sistem flat-pack dengan panduan perakitan sederhana

### Target Market
- Usia 22–35 tahun
- First jobber, pasangan muda, mahasiswa/anak kos
- Tinggal di area urban (apartemen, kos, rumah subsidi)
- Budget-conscious namun tetap peduli terhadap estetika ruang

### Kompetitor & Diferensiasi
| Kompetitor | Posisi | Diferensiasi RUMA |
|---|---|---|
| IKEA | Harga menengah-atas, gerai terbatas | Harga lebih terjangkau, full online |
| Informa / Fabelio | Premium, target menengah-atas | Lebih fokus ke segmen ruang kecil & budget terbatas |
| Marketplace generik (Shopee/Tokopedia) | Murah, desain tidak konsisten | Kurasi desain lebih rapi dan konsisten |

### Kategori Produk
Website RUMA menghadirkan produk dalam lima kategori utama:
1. **Ruang Tamu** — sofa, meja, rak TV
2. **Kamar Tidur** — ranjang, lemari, nakas
3. **Dapur** — meja makan, rak dapur
4. **Storage & Organizer** — kotak penyimpanan, rak sepatu
5. **Dekorasi** — rak dinding, lampu meja, aksesori ruang

### Revenue Model
- Penjualan produk secara langsung (direct-to-consumer)
- Layanan tambahan opsional "RUMA Assembly" — jasa perakitan bagi pelanggan yang tidak ingin merakit sendiri

### Strategi Harga & Promosi
- Harga kompetitif dengan strategi *value pricing*
- Promo musiman (diskon awal bulan, bundling kategori)
- Free shipping untuk pembelian di atas nominal tertentu

---

## 🖥️ Apa yang Ada di Website Ini

RUMA dibangun sebagai website e-commerce fungsional dengan fitur-fitur berikut:

| Fitur | Deskripsi |
|---|---|
| 🏠 **Landing Page** | Navbar, hero section, dan highlight produk unggulan |
| 🗂️ **Halaman Katalog** | Daftar seluruh produk dengan filter kategori & pencarian (search) |
| 🔍 **Halaman Detail Produk** | Informasi lengkap tiap produk |
| 🛒 **Keranjang Belanja (Cart)** | Tambah/ubah/hapus produk, tersimpan otomatis lewat `localStorage` |
| 💳 **Halaman Checkout** | Form pemesanan dengan validasi input & simulasi payment gateway |
| 📱 **Desain Responsif** | Menyesuaikan tampilan desktop, tablet, dan mobile |
| 📊 **Integrasi Analytics (dummy)** | Simulasi pelacakan perilaku pengunjung untuk analisis bisnis |
| 🔗 **Footer & Navigasi** | Kontak, sosial media, dan navigasi antar halaman |

## 🚀 Fitur Lanjutan (Roadmap)

Selain fitur wajib di atas, RUMA merancang roadmap fitur lanjutan berikut untuk menaikkan nilai bisnis dan pengalaman pengguna secara bertahap:

### 1. Transaksi & Logistik (Inti Toko)
- **One-Page Checkout** — proses bayar cepat dalam satu halaman ringkas
- **Payment Gateway Multi-Metode** — dukung QRIS, E-Wallet, Virtual Account, dan PayLater
- **Guest Checkout** — bisa belanja instan tanpa wajib daftar akun dulu
- **Hitung Ongkir Otomatis** — integrasi API ekspedisi untuk cek tarif real-time hingga tingkat kecamatan
- **Tracking Resi Otomatis** — cek posisi paket langsung di website, otomatis terkirim via Email/WA

### 2. UX & Personalisasi Pintar
- **Smart Search (AJAX)** — hasil pencarian produk langsung muncul saat diketik + toleran typo
- **Rekomendasi Produk Dinamis** — fitur "Kamu mungkin juga suka" untuk menaikkan nilai belanjaan
- **Persistent Cart** — keranjang belanja tidak hilang meski browser sempat ditutup
- **Product Swatches** — variasi produk berupa visual warna/motif asli, bukan teks dropdown
- **Skeleton Loading & Infinite Scroll** — navigasi katalog yang mulus tanpa putus dan tanpa loading kaku
- **Dark Mode Toggle** — opsi tampilan gelap untuk kenyamanan mata saat belanja malam hari

### 3. Pemasaran & Retensi Pelanggan
- **Abandoned Cart Recovery** — otomatis ingatkan calon pembeli yang lupa bayar via WA/Email
- **Sistem Poin (Loyalty)** — kumpul poin dari setiap belanjaan untuk ditukar diskon berikutnya
- **Flash Sale & Countdown Timer** — pemicu psikologis FOMO agar pembeli segera bertransaksi
- **Review Media (Foto/Video)** — ulasan produk dari pembeli asli yang bisa melampirkan media
- **Shareable Wishlist** — daftar barang impian yang bisa dibagikan lewat link ke medsos/WA

### 4. Sistem Penjualan Tingkat Lanjut
- **Grosir Otomatis** — potongan harga yang aktif otomatis jika beli dalam jumlah banyak
- **Sistem Pre-Order (PO)** — manajemen khusus untuk produk yang belum ready stock
- **WhatsApp Automation** — pengiriman notifikasi status pesanan otomatis ke nomor WA pembeli

### 5. Keamanan & Manajemen Internal
- **Optimasi Mobile-First** — website super ringan dan navigasinya ramah jempol HP
- **SSL & Social Login** — keamanan data (`https://`) dan opsi masuk instan via Google/Apple
- **Inventory Alert** — alarm otomatis saat stok produk sisa sedikit agar admin bisa segera restock

> ⚠️ *Fitur-fitur di atas bersifat roadmap/rencana pengembangan lanjutan. Untuk versi prototype yang dikumpulkan, implementasi disesuaikan dengan skala proyek dan waktu yang tersedia — sebagian bisa disimulasikan (dummy) sesuai ketentuan tugas.*

## 📸 Tampilan Website

<div align="center">

| Landing Page | Katalog Produk |
|---|---|
| ![Landing Page](images/screenshots/landing.jpg) | ![Katalog](images/screenshots/katalog.jpg) |

| Keranjang Belanja | Checkout |
|---|---|
| ![Cart](images/screenshots/cart.jpg) | ![Checkout](images/screenshots/checkout.jpg) |

</div>

> 📷 *Screenshot di atas akan diperbarui begitu development halaman selesai.*

## 🛠️ Tech Stack
- HTML5, CSS3, JavaScript (Vanilla)
- LocalStorage untuk penyimpanan data keranjang
- Deployment: GitHub Pages

## 📁 Struktur Proyek

Mengikuti struktur folder yang disyaratkan pada ketentuan proyek (index.html, css/, js/, images/, dll.):

```
ruma-ecommerce/
├── index.html          # Single-page website (navbar, hero, katalog, cart, checkout, footer)
├── css/
│   └── style.css        # Seluruh styling (layout, responsive, komponen)
├── js/
│   └── script.js         # Seluruh logic (cart, filter/search, validasi, localStorage)
├── images/
│   ├── products/          # Foto produk (sumber: Unsplash/Pexels)
│   ├── hero/                # Gambar banner
│   └── screenshots/          # Screenshot tampilan desktop & mobile
├── README.md               # Dokumentasi bisnis & teknis
└── .gitignore
```

## 🚀 Live Demo
_(Tautan GitHub Pages akan ditambahkan setelah deployment)_

/* ==========================================
   SISTEM PENERJEMAH BAHASA (BILINGUAL ID/EN) - RUMA
   ========================================== */

const translations = {
  id: {
    // Navbar
    "nav-home": "Beranda",
    "nav-catalog": "Katalog",
    "nav-about": "Tentang Kami",
    "nav-login-btn": "Masuk",
    "nav-logout-btn": "Keluar",
    "nav-profile-btn": "Profil Saya",

    // Announcement Bar
    "announcement-text": "Beli 2 Item atau Lebih & Dapatkan Diskon Bundling 10% Otomatis!",

    // Homepage Hero
    "hero-tag": "Betah Diajak Tinggal",
    "hero-title": "Furniture yang Betah Diajak Tinggal",
    "hero-desc": "Desain simpel knock-down yang hemat ruang, harga bersahabat untuk mahasiswa & first-jobber, dan proses pindahan yang jauh lebih praktis.",
    "hero-cta-primary": "Mulai Belanja",
    "hero-cta-secondary": "Pelajari Lebih Lanjut",

    // Value Section
    "val-title": "Mengapa Memilih RUMA?",
    "val-subtitle": "Kami mendesain furniture dengan memahami tantangan keterbatasan ruang hidup urban modern.",
    "val-space-title": "Hemat Ruang",
    "val-space-desc": "Dimensi compact yang dirancang khusus agar pas di kamar kos, apartemen studio, atau rumah kecil.",
    "val-easy-title": "Mudah Dirakit",
    "val-easy-desc": "Sistem knock-down cerdas yang dilengkapi petunjuk jelas serta alat perakitan dalam setiap box produk.",
    "val-price-title": "Harga Bersahabat",
    "val-price-desc": "Mekanisme penjualan langsung secara online menekan biaya operasional toko fisik agar harga tetap murah.",
    "val-quality-title": "Kualitas Terjamin",
    "val-quality-desc": "Menggunakan bahan engineered wood bermutu tinggi yang kokoh, anti jamur, dan awet digunakan lama.",

    // Featured section
    "featured-title": "Produk Terpopuler RUMA",
    "featured-subtitle": "Furniture pilihan terbaik yang paling banyak disukai oleh pelanggan kami.",
    "featured-cta": "Lihat Semua Katalog Produk",

    // About Philosophy
    "about-title": "Filosofi Desain RUMA",
    "about-p1": "RUMA lahir dari keresahan mahasiswa tingkat akhir dan pekerja muda di kota besar yang sering berpindah-pindah hunian namun kesulitan mencari furniture yang pas di kantong, kokoh, dan mudah dipindahkan.",
    "about-p2": "Kami meyakini bahwa keterbatasan ukuran kamar kos atau apartemen studio Anda bukanlah halangan untuk memiliki ruang hidup yang tertata, fungsional, dan estetik.",
    "about-quote": "\"Rumah bukanlah tentang seberapa luas areanya, melainkan tentang seberapa betah Anda berada di dalamnya.\"",
    "about-cta": "Temukan Furniture Anda",

    // Testimonials
    "testi-title": "Cerita Mereka Bersama RUMA",
    "testi-subtitle": "Dengarkan ulasan dari mereka yang telah mengubah kamar kos & apartemennya bersama kami.",
    "testi-role-1": "Mahasiswa Universitas Indonesia",
    "testi-role-2": "First-jobber / Software Engineer",
    "testi-role-3": "Pasangan Muda / Wiraswasta",

    // Quick Links / Footer
    "footer-about-text": "E-commerce furniture minimalis, fungsional, dan ramah kantong yang didesain khusus untuk gaya hidup modern.",
    "footer-quick-title": "Menu Cepat",
    "footer-services-title": "Layanan",
    "footer-link-return": "Kebijakan Pengembalian",
    "footer-link-terms": "Syarat & Ketentuan",
    "footer-link-support": "Hubungi Dukungan",
    "footer-link-assembly": "Panduan Perakitan",
    "footer-payment-title": "Partner Pembayaran",
    "footer-rights": "© 2026 RUMA Furniture Co. Seluruh Hak Cipta Dilindungi Undang-Undang.",
    "footer-author": "Dibuat oleh Krisna Bagja (209250190) — Tugas KAIT II IWU",

    // Catalog Page
    "cat-title": "Filter Produk",
    "cat-reset": "Reset",
    "cat-category": "Kategori",
    "cat-maxprice": "Harga Maksimal",
    "cat-search-placeholder": "Cari nama furniture...",
    "cat-sort-label": "Urutkan:",
    "cat-sort-populer": "Terpopuler",
    "cat-sort-asc": "Harga: Terendah ke Tertinggi",
    "cat-sort-desc": "Harga: Tertinggi ke Terendah",
    "cat-modal-specs": "Spesifikasi:",
    "cat-modal-qty": "Jumlah:",

    // Cart Drawer
    "cart-title-drawer": "Keranjang Belanja",
    "cart-empty": "Keranjang belanja Anda masih kosong.",
    "cart-empty-cta": "Mulai Belanja",
    "cart-subtotal-label": "Subtotal:",
    "cart-discount-label": "Diskon Bundling (10%):",
    "cart-total-label": "Total Akhir:",
    "cart-checkout-cta": "Lanjut ke Pembayaran",
    "cart-close-review": "Tutup & Review Pengiriman",

    // Checkout Page
    "check-title": "Checkout Pembayaran",
    "check-ship-info": "Informasi Pengiriman",
    "check-label-name": "Nama Lengkap",
    "check-label-email": "Alamat Email",
    "check-label-phone": "Nomor Handphone",
    "check-label-address": "Alamat Lengkap",
    "check-label-city": "Kota / Kabupaten",
    "check-label-zip": "Kode Pos",
    "check-services-title": "Layanan Pengiriman & Perakitan",
    "check-shipping-method": "Metode Ekspedisi",
    "check-ship-reguler": "Reguler (3-5 Hari Kerja)",
    "check-ship-ekspres": "Ekspres (1-2 Hari Kerja)",
    "check-assembly-service": "Butuh Jasa Perakitan Tambahan",
    "check-assembly-desc": "Petugas ahli RUMA akan merakit furniture di kamar kos atau apartemen Anda setibanya barang.",
    "check-payment-title": "Metode Pembayaran",
    "check-pay-bank": "Transfer Bank / Virtual Account",
    "check-pay-bank-desc": "Simulasi Virtual Account BCA, Mandiri, BNI, BRI",
    "check-pay-qris": "Gopay / QRIS E-Wallet",
    "check-pay-qris-desc": "Simulasi Scan Kode QR pembayaran instan",
    "check-summary-title": "Ringkasan Pesanan",
    "check-subtotal-items": "Subtotal Barang:",
    "check-shipping-assembly": "Ongkos Kirim & Layanan:",
    "check-total-pay": "Total Bayar:",
    "check-pay-now": "Bayar Sekarang",
    "check-success-msg": "Terima kasih telah berbelanja di RUMA. Pesanan Anda telah kami terima dan sedang diproses untuk pengiriman.",

    // Global Payment Info
    "check-global-info-title": "Informasi Pembayaran Global",
    "check-global-info-desc": "RUMA menerima metode pembayaran internasional. Seluruh transaksi luar negeri diproses secara aman melalui standard enkripsi SSL.",
    
    // Additional Payment Methods
    "check-pay-cc": "Kartu Kredit / Debit Internasional (Visa, MasterCard)",
    "check-pay-cod": "Bayar di Tempat (COD - Cash on Delivery)",
    "check-pay-debit": "Kartu Debit Online / GPN",
    "check-pay-offline": "Pembayaran di Gerai Offline (Indomaret / Alfamart)",
    
    // Shipping Tracker
    "track-title": "Lacak Pengiriman",
    "track-btn": "Lacak",
    "track-placeholder": "Masukkan No. Resi (Contoh: RUMA-12345)",
    "track-status": "Status Pengiriman:",
    "track-result-transit": "Paket sedang transit di Hub Jakarta Selatan. Estimasi sampai besok.",
    "track-result-delivered": "Paket telah diterima oleh penerima bersangkutan (Krisna Bagja).",
    "track-result-notfound": "Nomor resi tidak ditemukan. Silakan periksa kembali nomor Anda.",
    "track-est-label": "Estimasi Pengiriman:",
    
    // Admin Dashboard
    "admin-title": "Panel Manajemen Admin RUMA",
    "admin-sync-btn": "Sinkronkan & Simpan Perubahan",
    "admin-col-name": "Nama Produk",
    "admin-col-price": "Harga",
    "admin-col-stock": "Stok",
    "admin-col-status": "Status / Visibilitas",
    "admin-status-visible": "Tampilkan",
    "admin-status-hidden": "Sembunyikan",

    // Detail Modal Reviews
    "detail-tab-specs": "Spesifikasi",
    "detail-tab-reviews": "Ulasan Pembeli",
    "detail-sold": "Terjual",
    "detail-no-reviews": "Belum ada ulasan untuk produk ini.",
    "notif-title": "Notifikasi",
    "notif-mark-read": "Tandai semua dibaca",
    "notif-empty": "Tidak ada notifikasi.",
    
    // Gallery Section
    "gallery-title": "RUMA di Setiap Sudut Ruang",
    "gallery-subtitle": "Inspirasi penataan ruang nyata menggunakan produk furniture knock-down hemat tempat dari RUMA.",
    "gallery-room1-title": "Kamar Kos Fungsional",
    "gallery-room1-desc": "Meja kerja compact & rak dinding minimalis.",
    "gallery-room2-title": "Ruang Tamu Apartemen Studio",
    "gallery-room2-desc": "Coffee table & kabinet penyimpanan modular.",
    "gallery-room3-title": "Sudut Kerja Produktif",
    "gallery-room3-desc": "Meja belajar serbaguna & laci dorong kolong meja."
  },
  en: {
    // Navbar
    "nav-home": "Home",
    "nav-catalog": "Catalog",
    "nav-about": "About Us",
    "nav-login-btn": "Login",
    "nav-logout-btn": "Logout",
    "nav-profile-btn": "My Profile",

    // Announcement Bar
    "announcement-text": "Buy 2 or More Items & Get 10% Bundling Discount Automatically!",

    // Homepage Hero
    "hero-tag": "Love Living With",
    "hero-title": "Furniture You Love Living With",
    "hero-desc": "Simple, space-saving knock-down designs, budget-friendly prices for students & first-jobbers, and lightweight moving process.",
    "hero-cta-primary": "Start Shopping",
    "hero-cta-secondary": "Learn More",

    // Value Section
    "val-title": "Why Choose RUMA?",
    "val-subtitle": "We design furniture by understanding the challenges of limited modern urban living spaces.",
    "val-space-title": "Space Saving",
    "val-space-desc": "Compact dimensions specially designed to fit in dorm rooms, studio apartments, or small homes.",
    "val-easy-title": "Easy Assembly",
    "val-easy-desc": "Smart knock-down system equipped with clear instructions and tools in every product box.",
    "val-price-title": "Friendly Prices",
    "val-price-desc": "Direct online sales mechanism reduces physical store operational costs to keep prices low.",
    "val-quality-title": "Guaranteed Quality",
    "val-quality-desc": "Using high-grade engineered wood that is sturdy, anti-mold, and durable for long-term use.",

    // Featured section
    "featured-title": "RUMA Featured Products",
    "featured-subtitle": "The best select furniture items most loved by our customers.",
    "featured-cta": "View All Products Catalog",

    // About Philosophy
    "about-title": "RUMA Design Philosophy",
    "about-p1": "RUMA was born from the concerns of final-year students and young workers in big cities who move houses frequently but struggle to find affordable, sturdy, and easy-to-move furniture.",
    "about-p2": "We believe that the limited size of your dorm room or studio apartment is not a barrier to having an organized, functional, and aesthetic living space.",
    "about-quote": "\"Home is not about how wide the area is, but about how comfortable you feel inside it.\"",
    "about-cta": "Discover Your Furniture",

    // Testimonials
    "testi-title": "Their Stories with RUMA",
    "testi-subtitle": "Hear from those who have transformed their dorm rooms & apartments with us.",
    "testi-role-1": "Student at Universitas Indonesia",
    "testi-role-2": "First-jobber / Software Engineer",
    "testi-role-3": "Young Couple / Entrepreneurs",

    // Quick Links / Footer
    "footer-about-text": "Minimalist, functional, and budget-friendly e-commerce furniture designed for modern lifestyles.",
    "footer-quick-title": "Quick Menu",
    "footer-services-title": "Services",
    "footer-link-return": "Return Policy",
    "footer-link-terms": "Terms & Conditions",
    "footer-link-support": "Contact Support",
    "footer-link-assembly": "Assembly Guides",
    "footer-payment-title": "Payment Partners",
    "footer-rights": "© 2026 RUMA Furniture Co. All Rights Reserved.",
    "footer-author": "Created by Krisna Bagja (209250190) — KAIT II IWU Assignment",

    // Catalog Page
    "cat-title": "Filter Products",
    "cat-reset": "Reset",
    "cat-category": "Category",
    "cat-maxprice": "Max Price",
    "cat-search-placeholder": "Search furniture name...",
    "cat-sort-label": "Sort by:",
    "cat-sort-populer": "Popularity",
    "cat-sort-asc": "Price: Low to High",
    "cat-sort-desc": "Price: High to Low",
    "cat-modal-specs": "Specifications:",
    "cat-modal-qty": "Quantity:",

    // Cart Drawer
    "cart-title-drawer": "Shopping Cart",
    "cart-empty": "Your shopping cart is still empty.",
    "cart-empty-cta": "Start Shopping",
    "cart-subtotal-label": "Subtotal:",
    "cart-discount-label": "Bundling Discount (10%):",
    "cart-total-label": "Grand Total:",
    "cart-checkout-cta": "Proceed to Checkout",
    "cart-close-review": "Close & Review Shipping",

    // Checkout Page
    "check-title": "Payment Checkout",
    "check-ship-info": "Shipping Information",
    "check-label-name": "Full Name",
    "check-label-email": "Email Address",
    "check-label-phone": "Phone Number",
    "check-label-address": "Full Address",
    "check-label-city": "City / Regency",
    "check-label-zip": "ZIP Code",
    "check-services-title": "Shipping & Assembly Services",
    "check-shipping-method": "Shipping Method",
    "check-ship-reguler": "Regular (3-5 Business Days)",
    "check-ship-ekspres": "Express (1-2 Business Days)",
    "check-assembly-service": "Need Additional Assembly Service",
    "check-assembly-desc": "RUMA expert staff will assemble the furniture in your room upon arrival.",
    "check-payment-title": "Payment Method",
    "check-pay-bank": "Bank Transfer / Virtual Account",
    "check-pay-bank-desc": "Simulated Virtual Account BCA, Mandiri, BNI, BRI",
    "check-pay-qris": "Gopay / QRIS E-Wallet",
    "check-pay-qris-desc": "Simulated instant QR Code scan payment",
    "check-summary-title": "Order Summary",
    "check-subtotal-items": "Items Subtotal:",
    "check-shipping-assembly": "Shipping & Services:",
    "check-total-pay": "Total Payment:",
    "check-pay-now": "Pay Now",
    "check-success-msg": "Thank you for shopping at RUMA. Your order has been received and is being processed for shipping.",

    // Global Payment Info
    "check-global-info-title": "Global Payment Information",
    "check-global-info-desc": "RUMA supports international payment methods. All foreign transactions are processed securely via SSL encryption standards.",
    
    // Additional Payment Methods
    "check-pay-cc": "Credit Card / International Debit (Visa, MasterCard)",
    "check-pay-cod": "Cash on Delivery (COD)",
    "check-pay-debit": "Online Debit Card / GPN",
    "check-pay-offline": "Convenience Store Offline (Indomaret / Alfamart)",
    
    // Shipping Tracker
    "track-title": "Track Shipping",
    "track-btn": "Track",
    "track-placeholder": "Enter Receipt No. (e.g. RUMA-12345)",
    "track-status": "Shipping Status:",
    "track-result-transit": "Package in transit at South Jakarta Hub. Est. delivery tomorrow.",
    "track-result-delivered": "Package has been received by the customer (Krisna Bagja).",
    "track-result-notfound": "Tracking number not found. Please double-check.",
    "track-est-label": "Est. Delivery:",
    
    // Admin Dashboard
    "admin-title": "RUMA Admin Management Panel",
    "admin-sync-btn": "Sync & Save Changes",
    "admin-col-name": "Product Name",
    "admin-col-price": "Price",
    "admin-col-stock": "Stock",
    "admin-col-status": "Status / Visibility",
    "admin-status-visible": "Visible",
    "admin-status-hidden": "Hidden",

    // Detail Modal Reviews
    "detail-tab-specs": "Specifications",
    "detail-tab-reviews": "Customer Reviews",
    "detail-sold": "Sold",
    "detail-no-reviews": "No reviews yet for this product.",
    "notif-title": "Notifications",
    "notif-mark-read": "Mark all as read",
    "notif-empty": "No notifications yet.",

    // Gallery Section
    "gallery-title": "RUMA in Every Corner",
    "gallery-subtitle": "Real space-saving layout inspiration featuring RUMA modular furniture.",
    "gallery-room1-title": "Functional Student Dorm",
    "gallery-room1-desc": "Compact workspace desk & minimalist wall shelving.",
    "gallery-room2-title": "Studio Living Room",
    "gallery-room2-desc": "Sleek coffee table & modular drawer cabinet units.",
    "gallery-room3-title": "Productive Work Nook",
    "gallery-room3-desc": "Study desk set & mobile desk drawer cabinet."
  }
};

// 1. Get Current Active Language (Default 'id')
let currentLang = localStorage.getItem('ruma_lang') || 'id';

// 2. Set Language and Translate All Marked Elements
function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('ruma_lang', lang);

  // Update Dropdown/Selector UI text
  const langToggleBtn = document.getElementById('lang-toggle-text');
  if (langToggleBtn) {
    langToggleBtn.textContent = lang.toUpperCase();
  }
  const mobileLangToggle = document.getElementById('lang-toggle-text-mobile');
  if (mobileLangToggle) {
    mobileLangToggle.textContent = lang.toUpperCase();
  }

  // Translate static tags
  const elementsToTranslate = document.querySelectorAll('[data-i18n]');
  elementsToTranslate.forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translation = translations[lang][key];

    if (translation) {
      // If it is an input with a placeholder
      if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
        el.setAttribute('placeholder', translation);
      } else {
        el.innerHTML = translation;
      }
    }
  });

  // Re-render components if functions exist (to refresh translations dynamically)
  if (typeof renderCatalog === 'function') {
    renderCatalog();
  }
  if (typeof renderCartDrawer === 'function') {
    renderCartDrawer();
  }
  if (typeof renderFeaturedProducts === 'function') {
    renderFeaturedProducts();
  }
  if (typeof renderOrderSummary === 'function') {
    renderOrderSummary();
  }
  if (typeof renderAdminDashboardProfile === 'function') {
    renderAdminDashboardProfile();
  }

  console.log(`🌐 [Language Switcher] Language set to: ${lang.toUpperCase()}`);
}

// 3. Toggle Language function
function toggleLanguage() {
  const nextLang = currentLang === 'id' ? 'en' : 'id';
  setLanguage(nextLang);
}

// 4. Initialize on Page Load
document.addEventListener('DOMContentLoaded', () => {
  setLanguage(currentLang);
});

// RUMA E-Commerce Products Database with Ratings, Sales Count, and LocalStorage Persistency
const defaultProducts = [
  {
    id: "P001",
    nama: "Meja Lipat Serbaguna",
    nama_en: "Multi-purpose Folding Table",
    kategori: "Meja",
    kategori_en: "Table",
    harga: 350000,
    deskripsi: "Meja belajar/kerja lipat minimalis yang hemat ruang, cocok untuk kamar kos atau apartemen kecil. Kaki meja berbahan baja kokoh dengan sistem pengunci aman dan permukaan anti air.",
    deskripsi_en: "Multi-purpose folding study/work desk that saves space, perfect for dorm rooms or small apartments. Sturdy steel legs with secure lock system and waterproof surface.",
    gambar: "images/products/meja-lipat.png",
    specs: "Dimensi: 80x40x75 cm. Material: MDF & Metal. Warna: Oak Wood & Black.",
    specs_en: "Dimensions: 80x40x75 cm. Material: MDF & Metal. Color: Oak Wood & Black.",
    stok: 15,
    rating: 4.8,
    terjual: 145,
    visible: true,
    reviews: [
      { nama: "Rian", rating: 5, komentar: "Sangat mudah dirakit dan kokoh!", komentar_en: "Very easy to assemble and sturdy!" },
      { nama: "Dewi", rating: 4, komentar: "Ukuran pas di sudut kosan saya.", komentar_en: "Perfect size for my dorm room corner." }
    ]
  },
  {
    id: "P002",
    nama: "Rak Buku Modular",
    nama_en: "Modular Bookshelf",
    kategori: "Rak",
    kategori_en: "Shelf",
    harga: 189000,
    deskripsi: "Rak buku kayu modular yang dapat disusun vertikal maupun horizontal sesuai luas ruangan Anda. Desain estetik dan mudah dibongkar-pasang.",
    deskripsi_en: "Modular wooden bookshelf that can be stacked vertically or horizontally according to your room size. Aesthetic design and easy assembly.",
    gambar: "images/products/rak-buku.jpg",
    specs: "Dimensi: 40x30x120 cm. Material: Particle Board. Warna: Cokelat Terang.",
    specs_en: "Dimensions: 40x30x120 cm. Material: Particle Board. Color: Light Brown.",
    stok: 12,
    rating: 4.6,
    terjual: 88,
    visible: true,
    reviews: [
      { nama: "Budi", rating: 5, komentar: "Bagus banget, bisa disusun nyesuaikan tempat.", komentar_en: "Great quality, stackable to fit space." },
      { nama: "Santi", rating: 4, komentar: "Petunjuk rakitnya jelas.", komentar_en: "Assembly instruction is clear." }
    ]
  },
  {
    id: "P003",
    nama: "Kursi Lipat Minimalis",
    nama_en: "Minimalist Folding Chair",
    kategori: "Kursi",
    kategori_en: "Chair",
    harga: 129000,
    deskripsi: "Kursi lipat ultra-ringan dengan bantalan busa empuk dilapisi kulit sintetis berkualitas. Sangat mudah disimpan di balik lemari saat sedang tidak digunakan.",
    deskripsi_en: "Ultra-light folding chair with soft foam padding wrapped in quality synthetic leather. Very easy to store behind the wardrobe when not in use.",
    gambar: "images/products/kursi-lipat.jpg",
    specs: "Dimensi: 45x45x80 cm. Material: Rangka Baja & Kulit PU. Warna: Cream.",
    specs_en: "Dimensions: 45x45x80 cm. Material: Steel Frame & PU Leather. Color: Cream.",
    stok: 20,
    rating: 4.5,
    terjual: 210,
    visible: true,
    reviews: [
      { nama: "Ahmad", rating: 4, komentar: "Bantalannya empuk, rangkanya lumayan kuat.", komentar_en: "Soft padding, frame is quite strong." },
      { nama: "Lina", rating: 5, komentar: "Praktis ditaruh di mana saja.", komentar_en: "Very handy to place anywhere." }
    ]
  },
  {
    id: "P004",
    nama: "Lemari Pakaian Portable",
    nama_en: "Portable Wardrobe",
    kategori: "Lemari",
    kategori_en: "Wardrobe",
    harga: 159000,
    deskripsi: "Lemari pakaian dengan rangka pipa baja kokoh dan penutup kain non-woven tebal anti-debu. Praktis dipasang dan dipindahkan ketika Anda pindah kos.",
    deskripsi_en: "Wardrobe with sturdy steel pipe frame and thick non-woven fabric cover. Practical to assemble and move when you change dorms.",
    gambar: "images/products/lemari-portable.jpg",
    specs: "Dimensi: 105x45x170 cm. Material: Pipa Baja & Non-Woven. Warna: Abu-abu.",
    specs_en: "Dimensions: 105x45x170 cm. Material: Steel Tube & Non-Woven. Color: Grey.",
    stok: 8,
    rating: 4.7,
    terjual: 95,
    visible: true,
    reviews: [
      { nama: "Eko", rating: 5, komentar: "Kapasitas muat banyak, kain penutupnya tebal.", komentar_en: "Holds a lot, thick fabric cover." },
      { nama: "Ratih", rating: 4, komentar: "Mudah digeser dan dipasang.", komentar_en: "Easy to move and assemble." }
    ]
  },
  {
    id: "P005",
    nama: "Meja Kerja Minimalis",
    nama_en: "Minimalist Work Desk",
    kategori: "Meja",
    kategori_en: "Table",
    harga: 349000,
    deskripsi: "Meja kerja dengan desain clean bertema Scandinavian. Dilengkapi dengan lubang manajemen kabel di sudut meja untuk menjaga kerapian area kerja WFH Anda.",
    deskripsi_en: "Work desk with a clean Scandinavian design. Features a cable management grommet in the corner to keep your WFH area clean.",
    gambar: "images/products/meja-kerja.jpg",
    specs: "Dimensi: 100x50x75 cm. Material: Kayu Solid & Baja. Warna: Oak Alami & Putih.",
    specs_en: "Dimensions: 100x50x75 cm. Material: Solid Wood & Steel. Color: Natural Oak & White.",
    stok: 10,
    rating: 4.9,
    terjual: 74,
    visible: true,
    reviews: [
      { nama: "Yudi", rating: 5, komentar: "Desain Scandinavian-nya mewah banget.", komentar_en: "The Scandinavian design looks luxury." },
      { nama: "Mia", rating: 5, komentar: "Kokoh, tidak goyang sama sekali.", komentar_en: "Very sturdy, does not wobble at all." }
    ]
  },
  {
    id: "P006",
    nama: "Rak Sepatu Compact",
    nama_en: "Compact Shoe Rack",
    kategori: "Rak",
    kategori_en: "Shelf",
    harga: 99000,
    deskripsi: "Rak sepatu 5 tingkat ramping yang memuat hingga 15 pasang sepatu. Menggunakan bahan pipa aluminium ringan dan penyambung plastik tebal berdaya tahan tinggi.",
    deskripsi_en: "Slim 5-tier shoe rack holding up to 15 pairs of shoes. Made from lightweight aluminum tubes and highly durable plastic connectors.",
    gambar: "images/products/rak-sepatu.png",
    specs: "Dimensi: 60x30x90 cm. Material: Aluminium & Plastik. Warna: Hitam.",
    specs_en: "Dimensions: 60x30x90 cm. Material: Aluminium & Plastic. Color: Black.",
    stok: 25,
    rating: 4.4,
    terjual: 320,
    visible: true,
    reviews: [
      { nama: "Dian", rating: 4, komentar: "Cukup luas untuk sepatu harian.", komentar_en: "Spacious enough for daily shoes." },
      { nama: "Toni", rating: 5, komentar: "Murah meriah tapi fungsional.", komentar_en: "Cheap but highly functional." }
    ]
  },
  {
    id: "P007",
    nama: "Nakas Samping Tempat Tidur",
    nama_en: "Bedside Nightstand",
    kategori: "Nakas",
    kategori_en: "Nightstand",
    harga: 119000,
    deskripsi: "Meja nakas kecil bersisi laci tertutup dan rak terbuka. Pas diletakkan di samping kasur untuk menaruh ponsel, lampu tidur, buku, dan pernak-pernik.",
    deskripsi_en: "Small nightstand table with a closed drawer and an open shelf. Fits perfectly bedside the bed to place phones, nightlights, books, and small accessories.",
    gambar: "images/products/nakas-samping.png",
    specs: "Dimensi: 40x40x50 cm. Material: Engineered Wood. Warna: Putih & Beech.",
    specs_en: "Dimensions: 40x40x50 cm. Material: Engineered Wood. Color: White & Beech.",
    stok: 14,
    rating: 4.6,
    terjual: 112,
    visible: true,
    reviews: [
      { nama: "Hendra", rating: 5, komentar: "Pas buat taruh lampu tidur dan ngecas HP.", komentar_en: "Fits perfectly for bedside lamps and charging phones." },
      { nama: "Citra", rating: 4, komentar: "Lacinya halus ditarik.", komentar_en: "Drawer pull is smooth." }
    ]
  },
  {
    id: "P008",
    nama: "Partisi Ruangan Lipat",
    nama_en: "Folding Room Divider",
    kategori: "Partisi",
    kategori_en: "Partition",
    harga: 299000,
    deskripsi: "Sekat pembatas ruangan lipat dengan anyaman serat kayu alami yang estetik. Ideal untuk memisahkan area tempat tidur dan ruang belajar/tamu di kamar studio.",
    deskripsi_en: "Folding screen partition with aesthetic natural wood fibers. Ideal to separate sleeping and studying/living areas in studio rooms.",
    gambar: "images/products/partisi-lipat.png",
    specs: "Dimensi: 120x2x170 cm (dibuka). Material: Kayu Pinus & Rotan. Warna: Cokelat Kayu.",
    specs_en: "Dimensions: 120x2x170 cm (unfolded). Material: Pine Wood & Rattan. Color: Light Brown.",
    stok: 5,
    rating: 4.8,
    terjual: 30,
    visible: true,
    reviews: [
      { nama: "Gani", rating: 5, komentar: "Bikin kamar kosan terasa punya sekat rapi.", komentar_en: "Makes the dorm room feel properly divided." },
      { nama: "Fitri", rating: 4, komentar: "Tampilan anyamannya estetik kayu alami.", komentar_en: "The weave look has aesthetic natural wood vibe." }
    ]
  },
  {
    id: "P009",
    nama: "Kursi Komputer Ergo",
    nama_en: "Ergonomic Computer Chair",
    kategori: "Kursi",
    kategori_en: "Chair",
    harga: 599000,
    deskripsi: "Kursi kantor komputer ergonomis dengan penyangga punggung jaring (mesh), lumbar support, serta sandaran tangan. Kenyamanan maksimal untuk kerja WFH maupun belajar online.",
    deskripsi_en: "Ergonomic computer office chair with breathable mesh back support, lumbar support, and armrests. Maximum comfort for WFH and online learning.",
    gambar: "images/products/kursi-komputer.png",
    specs: "Dimensi: 65x65x125 cm. Material: Rangka Kaki Nilon & Kulit Sintetis. Warna: Hitam & Merah.",
    specs_en: "Dimensions: 65x65x125 cm. Material: Nylon Base & Synthetic Leather. Color: Black & Red.",
    stok: 7,
    rating: 4.7,
    terjual: 56,
    visible: true,
    reviews: [
      { nama: "Alvin", rating: 5, komentar: "Nyaman buat kerja seharian, harga sangat murah.", komentar_en: "Comfortable for all day work, very cheap price." },
      { nama: "Wulan", rating: 4, komentar: "Bahan kulitnya tebal dan empuk.", komentar_en: "The leather material is thick and soft." }
    ]
  },
  {
    id: "P010",
    nama: "Meja Ruang Tamu",
    nama_en: "Living Room Coffee Table",
    kategori: "Meja",
    kategori_en: "Table",
    harga: 349000,
    deskripsi: "Meja tamu minimalis modern dengan desain estetik dan fungsional. Sangat cocok diletakkan di ruang keluarga atau ruang tamu untuk menyajikan kopi, teh, dan menaruh buku atau tanaman hias.",
    deskripsi_en: "Modern minimalist coffee table with aesthetic and functional design. Perfect for your family room or living room to serve coffee, tea, and store books or houseplants.",
    gambar: "images/products/meja-tamu.png",
    specs: "Dimensi: 80x50x42 cm. Material: MDF Grade A & Kaki Kayu Solid. Warna: Putih Alami.",
    specs_en: "Dimensions: 80x50x42 cm. Material: Grade A MDF & Solid Wood Legs. Color: Natural White.",
    stok: 15,
    rating: 4.6,
    terjual: 45,
    visible: true,
    reviews: [
      { nama: "Kevin", rating: 4, komentar: "Desainnya bagus sekali dan gampang dirakit.", komentar_en: "The design is very good and easy to assemble." },
      { nama: "Nisa", rating: 5, komentar: "Sangat pas ditaruh di tengah sofa minimalis saya.", komentar_en: "Fits perfectly in the middle of my minimalist sofa." }
    ]
  },
  {
    id: "P011",
    nama: "Laci Dorong Kolong Meja",
    nama_en: "Mobile Desk Drawer Cabinet",
    kategori: "Rak",
    kategori_en: "Shelf",
    harga: 220000,
    deskripsi: "Laci sorong portable beroda yang pas dipasang di kolong meja belajar Anda. Sangat praktis untuk menyimpan dokumen penting, alat tulis, dan buku catatan.",
    deskripsi_en: "Portable desk cabinet on wheels that fits perfectly under your study desk. Super practical for storing files, stationery, and notebooks.",
    gambar: "images/products/laci-dorong.png",
    specs: "Dimensi: 40x40x56 cm. Material: Kayu Engineered & Roda Nilon. Warna: Oak Wood.",
    specs_en: "Dimensions: 40x40x56 cm. Material: Engineered Wood & Nylon Casters. Color: Oak Wood.",
    stok: 18,
    rating: 4.6,
    terjual: 42,
    visible: true,
    reviews: [
      { nama: "Gibran", rating: 5, komentar: "Laci rodanya lancar, gak seret sama sekali.", komentar_en: "Caster wheels roll smoothly, not stiff at all." },
      { nama: "Fani", rating: 4, komentar: "Bagus dan hemat tempat di bawah meja.", komentar_en: "Nice design and saves space under the table." }
    ]
  },
  {
    id: "P012",
    nama: "Lampu Belajar Estetik",
    nama_en: "Aesthetic Study Lamp",
    kategori: "Meja",
    kategori_en: "Table",
    harga: 119000,
    deskripsi: "Lampu meja belajar dengan leher fleksibel yang dapat diarahkan 360 derajat. Menggunakan pencahayaan LED warm white yang nyaman di mata untuk membaca lama.",
    deskripsi_en: "Desk study lamp with 360-degree adjustable gooseneck. Emits warm white LED glow that is cozy and friendly for long reading hours.",
    gambar: "images/products/lampu-belajar.png",
    specs: "Dimensi: Tinggi 42 cm, Diameter Alas 15 cm. Material: Aluminium Matte. Warna: Putih Minimalis.",
    specs_en: "Dimensions: Height 42 cm, Base Diameter 15 cm. Material: Matte Aluminium. Color: Minimalist White.",
    stok: 25,
    rating: 4.7,
    terjual: 95,
    visible: true,
    reviews: [
      { nama: "Toni", rating: 5, komentar: "Cahayanya warm white nyaman banget buat baca malam.", komentar_en: "The warm white light is extremely comfy for night reading." },
      { nama: "Maya", rating: 4, komentar: "Desain metal matte nya terlihat sangat mewah.", komentar_en: "The matte metal finish looks very premium." }
    ]
  }
];

// Initialize global products database in localStorage if not exists, or needs update/reset
const stored = localStorage.getItem('ruma_products_db');
let needReset = false;
if (stored) {
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length < 12 || !parsed[0].nama_en || typeof parsed[0].rating === 'undefined' || parsed[8].nama !== "Kursi Komputer Ergo" || parsed[8].gambar.indexOf('kursi-komputer.png') === -1 || parsed[9].nama === "Rak Dinding Gantung") {
      needReset = true;
    }
  } catch (e) {
    needReset = true;
  }
} else {
  needReset = true;
}

if (needReset) {
  localStorage.setItem('ruma_products_db', JSON.stringify(defaultProducts));
}

// Live state fetched from localStorage
const products = JSON.parse(localStorage.getItem('ruma_products_db')) || defaultProducts;

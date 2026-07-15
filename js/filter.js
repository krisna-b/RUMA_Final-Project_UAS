/* ==========================================
   LOGIKA FILTER, PENCARIAN, & MODAL DETAIL - RUMA
   ========================================== */

// State Filter Aktif
let activeSearch = '';
let activeCategories = [];
let activeMaxPrice = 600000;
let activeSort = 'populer';

// State Modal Detail
let modalQty = 1;
let currentModalProductId = null;
let savedScrollPosition = 0;

document.addEventListener('DOMContentLoaded', () => {
  const catalogGrid = document.getElementById('catalog-grid');
  if (catalogGrid) {
    initFilters();
    renderCatalog();
    checkUrlParams();
  }
});

// 1. Inisialisasi Filter Input Listeners
function initFilters() {
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearch = e.target.value.trim().toLowerCase();
      renderCatalog();
      trackGAEvent('Pencarian Produk', activeSearch);
    });
  }

  const categoryCheckboxes = document.querySelectorAll('.filter-checkbox');
  categoryCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      activeCategories = Array.from(categoryCheckboxes)
        .filter(c => c.checked)
        .map(c => c.value);
      renderCatalog();
      trackGAEvent('Filter Kategori', activeCategories.join(', '));
    });
  });

  const priceSlider = document.getElementById('price-slider');
  const priceLabel = document.getElementById('price-max-label');
  if (priceSlider && priceLabel) {
    priceSlider.addEventListener('input', (e) => {
      activeMaxPrice = parseInt(e.target.value);
      priceLabel.textContent = formatRupiah(activeMaxPrice);
      renderCatalog();
    });
    
    priceSlider.addEventListener('change', (e) => {
      trackGAEvent('Filter Harga Maksimal', formatRupiah(activeMaxPrice));
    });
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      activeSort = e.target.value;
      renderCatalog();
      trackGAEvent('Ubah Urutan', activeSort);
    });
  }
}

// 2. Fungsi Reset Semua Filter
function resetFilters() {
  activeSearch = '';
  activeCategories = [];
  activeMaxPrice = 600000;
  activeSort = 'populer';

  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const categoryCheckboxes = document.querySelectorAll('.filter-checkbox');
  categoryCheckboxes.forEach(c => c.checked = false);

  const priceSlider = document.getElementById('price-slider');
  const priceLabel = document.getElementById('price-max-label');
  if (priceSlider && priceLabel) {
    priceSlider.value = 600000;
    priceLabel.textContent = formatRupiah(600000);
  }

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'populer';

  renderCatalog();
  trackGAEvent('Reset Filter', 'Semua Filter Direset');
}

/// Helper to generate star icons
function getRatingStarsSVG(rating) {
  let starsHtml = '';
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  
  for (let i = 0; i < 5; i++) {
    if (i < fullStars) {
      starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    } else if (i === fullStars && halfStar) {
      starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="var(--color-accent)" opacity="0.5" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    } else {
      starsHtml += `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }
  }
  return starsHtml;
}

// 3. Render Grid Produk Katalog
function renderCatalog() {
  const grid = document.getElementById('catalog-grid');
  const countEl = document.getElementById('results-count');
  if (!grid || typeof products === 'undefined') return;

  // Lakukan Filtering
  let filtered = products.filter(prod => {
    // Saring produk tidak aktif (visibilitas admin)
    if (prod.visible === false) return false;

    // Cari kecocokan kata kunci di nama / kategori bahasa Indonesia dan Inggris
    const namaLc = (prod.nama || '').toLowerCase();
    const namaEnLc = (prod.nama_en || '').toLowerCase();
    const kategoriLc = (prod.kategori || '').toLowerCase();
    const kategoriEnLc = (prod.kategori_en || '').toLowerCase();

    const matchesSearch = namaLc.includes(activeSearch) || 
                          namaEnLc.includes(activeSearch) ||
                          kategoriLc.includes(activeSearch) ||
                          kategoriEnLc.includes(activeSearch);
    
    const matchesCategory = activeCategories.length === 0 || 
                            activeCategories.includes(prod.kategori) ||
                            (prod.kategori_en && activeCategories.includes(prod.kategori_en));
    
    const matchesPrice = prod.harga <= activeMaxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  // Lakukan Sorting
  if (activeSort === 'harga-asc') {
    filtered.sort((a, b) => a.harga - b.harga);
  } else if (activeSort === 'harga-desc') {
    filtered.sort((a, b) => b.harga - a.harga);
  }

  // Tampilkan Hasil Pencarian (Bilingual)
  if (countEl) {
    const totalCount = filtered.length;
    countEl.textContent = currentLang === 'en' 
      ? `Showing ${totalCount} products` 
      : `Menampilkan ${totalCount} produk`;
  }

  if (filtered.length === 0) {
    const titleText = currentLang === 'en' ? 'Product Not Found' : 'Produk Tidak Ditemukan';
    const descText = currentLang === 'en' ? 'Please use other keywords or reset your filters.' : 'Silakan gunakan kata kunci lain atau reset filter Anda.';
    
    grid.innerHTML = `
      <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 60px 0;">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: 16px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <h3>${titleText}</h3>
        <p>${descText}</p>
        <button class="btn btn-secondary" style="margin-top: 16px;" onclick="resetFilters()">Reset Filter</button>
      </div>
    `;
    return;
  }

  let html = '';
  filtered.forEach(prod => {
    const displayName = currentLang === 'en' ? (prod.nama_en || prod.nama) : prod.nama;
    const displayCategory = currentLang === 'en' ? (prod.kategori_en || prod.kategori) : prod.kategori;
    const displayDesc = currentLang === 'en' ? (prod.deskripsi_en || prod.deskripsi) : prod.deskripsi;
    const soldText = currentLang === 'en' ? 'sold' : 'terjual';

    // Bag limit warning / badge
    let badgeHtml = `<span class="product-badge">${displayCategory}</span>`;
    if (prod.stok <= 0) {
      badgeHtml = `<span class="product-badge" style="background-color: var(--color-danger);">${currentLang === 'en' ? 'Out of Stock' : 'Stok Habis'}</span>`;
    }

    html += `
      <article class="product-card">
        <div class="product-img-wrapper">
          <img src="${prod.gambar}" alt="${displayName}" class="product-img">
          ${badgeHtml}
        </div>
        <div class="product-info">
          <span class="product-category">${displayCategory}</span>
          <h3 class="product-name">${displayName}</h3>
          
          <!-- Product Rating & Sales Count -->
          <div style="display: flex; align-items: center; gap: 4px; margin: 6px 0;">
            <div style="display: flex; align-items: center; gap: 1px;">
              ${getRatingStarsSVG(prod.rating || 5)}
            </div>
            <span style="font-size: 0.8rem; font-weight: 700; color: var(--color-text-primary); margin-left: 2px;">${prod.rating || 5.0}</span>
            <span style="font-size: 0.75rem; color: var(--color-text-secondary);">(${prod.terjual || 0} ${soldText})</span>
          </div>

          <p class="product-desc-short">${displayDesc}</p>
          <div class="product-footer">
            <span class="product-price">${formatRupiah(prod.harga)}</span>
            <div class="product-actions">
              <button class="btn-icon btn-icon-primary" onclick="addToCart('${prod.id}')" title="Tambah ke Keranjang" ${prod.stok <= 0 ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              </button>
              <button class="btn-icon" onclick="openDetailModal('${prod.id}')" title="Lihat Detail">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              </button>
            </div>
          </div>
        </div>
      </article>
    `;
  });

  grid.innerHTML = html;
}

// 4. Membuka Modal Detail Produk
function openDetailModal(productId) {
  if (typeof products === 'undefined') return;
  const product = products.find(p => p.id === productId);
  if (!product) return;

  currentModalProductId = productId;
  modalQty = 1;

  const displayName = currentLang === 'en' ? (product.nama_en || product.nama) : product.nama;
  const displayCategory = currentLang === 'en' ? (product.kategori_en || product.kategori) : product.kategori;
  const displayDesc = currentLang === 'en' ? (product.deskripsi_en || product.deskripsi) : product.deskripsi;
  const displaySpecs = currentLang === 'en' ? (product.specs_en || product.specs) : product.specs;

  // Isi data modal
  document.getElementById('modal-product-img').src = product.gambar;
  document.getElementById('modal-product-img').alt = displayName;
  document.getElementById('modal-product-category').textContent = displayCategory;
  document.getElementById('modal-product-name').textContent = displayName;
  document.getElementById('modal-product-price').textContent = formatRupiah(product.harga);
  document.getElementById('modal-qty-val').textContent = modalQty;
  document.getElementById('modal-product-desc').textContent = displayDesc;
  document.getElementById('modal-product-specs-text').textContent = displaySpecs;

  // Update ratings & sold stats in modal
  const ratingBox = document.getElementById('modal-product-rating-box');
  if (ratingBox) {
    ratingBox.innerHTML = `
      <div style="display: flex; align-items: center; gap: 6px; margin: 8px 0;">
        <div style="display: flex; align-items: center; gap: 1px;">
          ${getRatingStarsSVG(product.rating || 5)}
        </div>
        <span style="font-size: 0.9rem; font-weight: 700;">${product.rating || 5.0}</span>
        <span style="font-size: 0.8rem; color: var(--color-text-secondary);">| ${product.terjual || 0} ${currentLang === 'en' ? 'sold' : 'terjual'}</span>
      </div>
    `;
  }

  // Update reviews list in modal
  const reviewsContainer = document.getElementById('modal-product-reviews-list');
  if (reviewsContainer) {
    if (product.reviews && product.reviews.length > 0) {
      let reviewsHtml = '';
      product.reviews.forEach(rev => {
        const revComment = currentLang === 'en' ? (rev.komentar_en || rev.komentar) : rev.komentar;
        let starSvgList = '';
        for (let j = 0; j < 5; j++) {
          if (j < rev.rating) {
            starSvgList += `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="var(--color-accent)" stroke="var(--color-accent)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
          } else {
            starSvgList += `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--color-border)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
          }
        }
        reviewsHtml += `
          <div class="review-item" style="background-color: var(--color-bg-secondary); padding: 12px; border-radius: 6px; margin-bottom: 8px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <strong style="font-size: 0.8rem; color: var(--color-text-primary);">${rev.nama}</strong>
              <div style="display: flex; gap: 1px;">${starSvgList}</div>
            </div>
            <p style="margin: 0; font-size: 0.78rem; color: var(--color-text-secondary); line-height: 1.4;">${revComment}</p>
          </div>
        `;
      });
      reviewsContainer.innerHTML = reviewsHtml;
    } else {
      const emptyReviewsMsg = currentLang === 'en' ? 'No reviews yet for this product.' : 'Belum ada ulasan untuk produk ini.';
      reviewsContainer.innerHTML = `<p style="font-size: 0.8rem; color: var(--color-text-secondary); font-style: italic;">${emptyReviewsMsg}</p>`;
    }
  }

  // Update stok label (Bilingual & CSS Dots instead of emojis)
  const stockEl = document.getElementById('modal-product-stock');
  if (stockEl) {
    if (product.stok > 5) {
      stockEl.className = "modal-product-stock in-stock";
      stockEl.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#2e7d32; margin-right:6px;"></span> ${currentLang === 'en' ? `In Stock (${product.stok} available)` : `Tersedia (Sisa ${product.stok})`}`;
    } else if (product.stok > 0) {
      stockEl.className = "modal-product-stock low-stock";
      stockEl.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#f57c00; margin-right:6px;"></span> ${currentLang === 'en' ? `Low Stock (${product.stok} left)` : `Stok Terbatas (Sisa ${product.stok})`}`;
    } else {
      stockEl.className = "modal-product-stock low-stock";
      stockEl.innerHTML = `<span style="display:inline-block; width:8px; height:8px; border-radius:50%; background-color:#d32f2f; margin-right:6px;"></span> ${currentLang === 'en' ? `Out of Stock` : `Stok Habis`}`;
    }
  }

  // Setup tombol Add to Cart
  const addBtn = document.getElementById('modal-add-to-cart-btn');
  if (addBtn) {
    if (product.stok > 0) {
      addBtn.disabled = false;
      addBtn.textContent = currentLang === 'en' ? "Add to Cart" : "Tambah ke Keranjang";
      addBtn.onclick = () => {
        addToCart(product.id, modalQty);
        closeDetailModal();
      };
    } else {
      addBtn.disabled = true;
      addBtn.textContent = currentLang === 'en' ? "Out of Stock" : "Stok Habis";
    }
  }

  savedScrollPosition = window.scrollY;

  const modal = document.getElementById('product-detail-modal');
  if (modal) {
    modal.classList.add('open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollPosition}px`;
    document.body.style.width = '100%';
  }

  const decBtn = document.getElementById('modal-qty-dec');
  const incBtn = document.getElementById('modal-qty-inc');
  const qtyVal = document.getElementById('modal-qty-val');

  if (decBtn && incBtn && qtyVal) {
    decBtn.onclick = () => {
      if (modalQty > 1) {
        modalQty--;
        qtyVal.textContent = modalQty;
      }
    };
    incBtn.onclick = () => {
      if (modalQty < product.stok) {
        modalQty++;
        qtyVal.textContent = modalQty;
      } else {
        const warningMsg = currentLang === 'en' 
          ? `Stock limit reached. Max stock: ${product.stok} units.` 
          : `Stok tidak mencukupi. Stok maksimal: ${product.stok} unit.`;
        showToast(warningMsg, 'danger');
      }
    };
  }

  trackGAEvent('Lihat Detail Produk', displayName);
}

// 5. Menutup Modal Detail Produk
function closeDetailModal() {
  const modal = document.getElementById('product-detail-modal');
  if (modal) {
    modal.classList.remove('open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    window.scrollTo(0, savedScrollPosition);
  }
  currentModalProductId = null;
}

// 6. Cek Query Parameter URL untuk Auto-Open Modal
function checkUrlParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const detailId = urlParams.get('detail');
  if (detailId) {
    setTimeout(() => {
      openDetailModal(detailId);
    }, 300);
  }
}

/* ==========================================
   LOGIKA KERANJANG BELANJA & SESI USER - RUMA
   ========================================== */

// 1. Inisialisasi Data dari localStorage
let cart = JSON.parse(localStorage.getItem('ruma_cart')) || [];
let currentUser = JSON.parse(localStorage.getItem('ruma_user')) || null;

// 2. Integrasi Google Analytics Dummy
function trackGAEvent(action, label, value = null) {
  const eventData = {
    event: 'ruma_interaction',
    category: 'E-Commerce',
    action: action,
    label: label,
    value: value,
    timestamp: new Date().toISOString()
  };
  console.log(`📊 [Google Analytics Dummy] Event Terkirim:`, eventData);
  
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(eventData);
}

// 3. Mengatur Tampilan Drawer Keranjang
function toggleCart() {
  const drawer = document.getElementById('cart-drawer');
  if (drawer) {
    drawer.classList.toggle('open');
    if (drawer.classList.contains('open')) {
      trackGAEvent('Buka Keranjang', 'Drawer Dibuka');
      renderCartDrawer();
    }
  }
}

// 4. Menambahkan Produk ke Keranjang (Mendukung Bilingual Toast)
function addToCart(productId, qty = 1) {
  if (typeof products === 'undefined') {
    console.error('Database produk (products.js) belum dimuat.');
    return;
  }

  const product = products.find(p => p.id === productId);
  if (!product) {
    console.error(`Produk dengan ID ${productId} tidak ditemukan.`);
    return;
  }

  // Cek apakah produk sudah ada di keranjang
  const existingItemIndex = cart.findIndex(item => item.id === productId);

  if (existingItemIndex > -1) {
    if (cart[existingItemIndex].qty + qty > product.stok) {
      const msg = currentLang === 'en' ? `Stock limit reached. Max stock: ${product.stok} units.` : `Stok tidak mencukupi. Stok maksimal: ${product.stok} unit.`;
      showToast(msg, 'danger');
      return;
    }
    cart[existingItemIndex].qty += qty;
  } else {
    if (qty > product.stok) {
      const msg = currentLang === 'en' ? `Stock limit reached. Max: ${product.stok} units.` : `Stok tidak mencukupi. Stok maksimal: ${product.stok} unit.`;
      showToast(msg, 'danger');
      return;
    }
    cart.push({
      id: product.id,
      nama: product.nama,
      nama_en: product.nama_en || product.nama,
      harga: product.harga,
      gambar: product.gambar,
      qty: qty,
      stok: product.stok
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();

  const prodName = currentLang === 'en' ? (product.nama_en || product.nama) : product.nama;
  const successMsg = currentLang === 'en' ? `Successfully added ${prodName} to cart!` : `Berhasil menambahkan ${prodName} ke keranjang!`;
  showToast(successMsg, 'success');
  trackGAEvent('Tambah ke Keranjang', prodName, product.harga * qty);
}

// 5. Mengubah Kuantitas Item
function updateCartQty(productId, newQty) {
  const itemIndex = cart.findIndex(item => item.id === productId);
  if (itemIndex > -1) {
    const item = cart[itemIndex];
    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }
    
    if (newQty > item.stok) {
      const msg = currentLang === 'en' ? `Reached maximum stock limit (${item.stok} units).` : `Mencapai batas stok maksimal (${item.stok} unit).`;
      showToast(msg, 'danger');
      return;
    }

    item.qty = newQty;
    saveCart();
    updateCartBadge();
    renderCartDrawer();
    
    if (typeof renderOrderSummary === 'function') {
      renderOrderSummary();
    }
  }
}

// 6. Menghapus Item dari Keranjang
function removeFromCart(productId) {
  const item = cart.find(item => item.id === productId);
  const itemName = item ? (currentLang === 'en' ? (item.nama_en || item.nama) : item.nama) : productId;
  
  cart = cart.filter(item => item.id !== productId);
  saveCart();
  updateCartBadge();
  renderCartDrawer();

  const removeMsg = currentLang === 'en' ? `${itemName} removed from cart.` : `${itemName} dihapus dari keranjang.`;
  showToast(removeMsg, 'success');
  trackGAEvent('Hapus dari Keranjang', itemName);

  if (typeof renderOrderSummary === 'function') {
    renderOrderSummary();
  }
}

// 7. Menyimpan Cart ke localStorage
function saveCart() {
  localStorage.setItem('ruma_cart', JSON.stringify(cart));
}

// 8. Membersihkan Keranjang
function clearCart() {
  cart = [];
  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

// 9. Mengupdate Badge di Navbar
function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-badge');
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);

  badges.forEach(badge => {
    badge.textContent = totalItems;
    if (totalItems > 0) {
      badge.classList.add('active');
    } else {
      badge.classList.remove('active');
    }
  });
}

// 10. Kalkulasi Total Harga & Diskon Bundling
function calculateTotals() {
  const subtotal = cart.reduce((total, item) => total + (item.harga * item.qty), 0);
  const totalQty = cart.reduce((total, item) => total + item.qty, 0);
  
  let discount = 0;
  if (totalQty >= 2) {
    discount = Math.round(subtotal * 0.10);
  }

  const total = subtotal - discount;

  return { subtotal, discount, total, totalQty };
}

// Format Rupiah Helper (Mendukung IDR / USD)
function formatRupiah(number) {
  if (typeof activeCurrency !== 'undefined' && activeCurrency === 'USD') {
    const usdVal = number / 15000;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(usdVal);
  }
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(number);
}

// 11. Render Tampilan Drawer Keranjang
function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  if (!container) return;

  if (cart.length === 0) {
    const emptyText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Your shopping cart is empty.' : 'Keranjang belanja Anda masih kosong.';
    const shopText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Start Shopping' : 'Mulai Belanja';
    
    container.innerHTML = `
      <div class="empty-cart-message">
        <div class="empty-cart-icon" style="margin-bottom: 16px;">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-secondary)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5;">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
        </div>
        <p>${emptyText}</p>
        <a href="katalog.html" class="btn btn-primary" style="margin-top: 12px;" onclick="toggleCart()">${shopText}</a>
      </div>
    `;
    
    document.getElementById('cart-subtotal').textContent = formatRupiah(0);
    document.getElementById('cart-discount-row').style.display = 'none';
    document.getElementById('cart-total').textContent = formatRupiah(0);
    return;
  }

  let html = '';
  cart.forEach(item => {
    const displayName = typeof currentLang !== 'undefined' && currentLang === 'en' ? (item.nama_en || item.nama) : item.nama;
    const deleteText = typeof currentLang !== 'undefined' && currentLang === 'en' ? 'Delete' : 'Hapus';
    
    html += `
      <div class="cart-item">
        <img src="${item.gambar}" alt="${displayName}" class="cart-item-img">
        <div class="cart-item-info">
          <div>
            <h4 class="cart-item-name">${displayName}</h4>
            <div class="cart-item-price">${formatRupiah(item.harga)}</div>
          </div>
          <div class="cart-item-actions">
            <div class="qty-control">
              <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.qty - 1})">-</button>
              <span class="qty-val">${item.qty}</span>
              <button class="qty-btn" onclick="updateCartQty('${item.id}', ${item.qty + 1})">+</button>
            </div>
            <button class="remove-item-btn" onclick="removeFromCart('${item.id}')">
              <span>🗑️ ${deleteText}</span>
            </button>
          </div>
        </div>
      </div>
    `;
  });

  container.innerHTML = html;

  const totals = calculateTotals();
  document.getElementById('cart-subtotal').textContent = formatRupiah(totals.subtotal);
  
  const discountRow = document.getElementById('cart-discount-row');
  if (totals.discount > 0) {
    discountRow.style.display = 'flex';
    document.getElementById('cart-discount').textContent = `-${formatRupiah(totals.discount)}`;
  } else {
    discountRow.style.display = 'none';
  }

  document.getElementById('cart-total').textContent = formatRupiah(totals.total);
}

// 12. Sistem Toast Notification
function showToast(message, type = 'success') {
  let toastContainer = document.getElementById('toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'toast-container';
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const icons = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    danger:  `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d32f2f" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f57c00" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
    info:    `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0288d1" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
  };

  const dotColors = {
    success: '#2e7d32',
    danger:  '#d32f2f',
    warning: '#f57c00',
    info:    '#0288d1',
  };

  const icon = icons[type] || icons.info;
  const dot = dotColors[type] || dotColors.info;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span style="flex-shrink:0; display:flex; align-items:center;">${icon}</span>
    <span style="flex:1; line-height:1.4;">${message}</span>
    <span style="width:7px; height:7px; border-radius:50%; background:${dot}; flex-shrink:0; opacity:0.7;"></span>
  `;

  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.35s forwards';
    setTimeout(() => toast.remove(), 380);
  }, 2800);
}

// ==========================================
// LOGIKA LOGIN FITUR & KOORDINATOR ADMIN
// ==========================================

// Global currency state
let activeCurrency = localStorage.getItem('ruma_currency') || 'IDR';

function updateCurrencyToggleUI() {
  const toggleBtnText = document.getElementById('currency-toggle-text');
  if (toggleBtnText) {
    toggleBtnText.textContent = activeCurrency;
  }
  const mobileToggleText = document.getElementById('currency-toggle-text-mobile');
  if (mobileToggleText) {
    mobileToggleText.textContent = activeCurrency;
  }
}

function toggleCurrency() {
  activeCurrency = activeCurrency === 'IDR' ? 'USD' : 'IDR';
  localStorage.setItem('ruma_currency', activeCurrency);
  updateCurrencyToggleUI();

  // Re-translate and re-render elements
  if (typeof setLanguage === 'function') {
    setLanguage(currentLang);
  } else {
    if (typeof renderCatalog === 'function') renderCatalog();
    if (typeof renderCartDrawer === 'function') renderCartDrawer();
    if (typeof renderFeaturedProducts === 'function') renderFeaturedProducts();
    if (typeof renderOrderSummary === 'function') renderOrderSummary();
  }
}

function updateNavbarUserUI() {
  const container = document.getElementById('user-nav-container');
  if (!container) return;

  if (currentUser) {
    const profileLabel = currentLang === 'en' ? 'My Profile' : 'Profil Saya';
    const logoutLabel = currentLang === 'en' ? 'Logout' : 'Keluar';
    container.innerHTML = `
      <button class="btn btn-secondary" onclick="toggleUserDropdown(event)" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 4px; display: flex; align-items: center; gap: 6px;">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--color-accent);"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        <span>Halo, ${currentUser.name.split(' ')[0]}</span>
        <span style="font-size: 0.65rem;">▼</span>
      </button>
      <div id="user-dropdown-menu" class="user-dropdown-menu">
        <div style="padding: 10px 16px; font-size: 0.8rem; color: var(--color-text-secondary); border-bottom: 1px solid var(--color-border); word-break: break-all;">
          <strong>${currentUser.name}</strong><br>${currentUser.email}
        </div>
        <a href="profile.html" class="dropdown-item">${profileLabel}</a>
        <a href="#" onclick="handleLogout(event)" class="dropdown-item" style="color: var(--color-danger);">${logoutLabel}</a>
      </div>
    `;
  } else {
    const loginText = currentLang === 'en' ? 'Login' : 'Masuk';
    container.innerHTML = `
      <button class="btn btn-primary" onclick="openLoginModal()" style="padding: 8px 16px; font-size: 0.85rem; border-radius: 4px;">
        ${loginText}
      </button>
    `;
  }
}

function toggleUserDropdown(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown) {
    dropdown.classList.toggle('open');
  }
}

function openLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.add('open');
    trackGAEvent('Buka Modal Login', 'Form Login Ditampilkan');
    // Default to login (existing user) tab
    switchLoginTab('login');
  }
}

function closeLoginModal() {
  const modal = document.getElementById('login-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// =============================================
// LOGIN MODAL — 3-TAB SYSTEM
// =============================================

function switchLoginTab(mode) {
  const tabs = {
    login:  document.getElementById('tab-login-btn'),
    signup: document.getElementById('tab-signup-btn'),
    admin:  document.getElementById('tab-admin-btn'),
  };
  const panels = {
    login:  document.getElementById('tab-panel-login'),
    signup: document.getElementById('tab-panel-signup'),
    admin:  document.getElementById('tab-panel-admin'),
  };

  Object.keys(tabs).forEach(key => {
    if (!tabs[key]) return;
    const active = (key === mode);
    tabs[key].style.color = active ? 'var(--color-accent)' : 'var(--color-text-secondary)';
    tabs[key].style.fontWeight = active ? '700' : '500';
    tabs[key].style.borderBottomColor = active ? 'var(--color-accent)' : 'transparent';
    if (panels[key]) panels[key].style.display = active ? 'block' : 'none';
  });
}

// Login: pengguna yang sudah terdaftar
function submitExistingLogin(event) {
  event.preventDefault();
  const usernameVal = document.getElementById('login-ex-username').value.trim();
  const passwordVal = document.getElementById('login-ex-password').value;

  // Look up stored users
  const accounts = JSON.parse(localStorage.getItem('ruma_accounts') || '[]');
  const found = accounts.find(a => a.username === usernameVal && a.password === passwordVal);
  if (!found) {
    showToast(currentLang === 'en' ? 'Username or password is incorrect.' : 'Username atau password salah.', 'danger');
    return;
  }
  currentUser = { role: 'user', name: found.username, email: found.email, phone: found.phone, address: found.address, city: 'Jakarta', zip: '12345' };
  _finalizeLogin();
}

// Daftar: pengguna baru
function submitSignup(event) {
  event.preventDefault();
  const usernameVal = document.getElementById('signup-username').value.trim();
  const emailVal    = document.getElementById('signup-email').value.trim();
  const phoneVal    = document.getElementById('signup-phone').value.trim();
  const addressVal  = document.getElementById('signup-address').value.trim();
  const passwordVal = document.getElementById('signup-password').value;

  if (passwordVal.length < 6) {
    showToast(currentLang === 'en' ? 'Password must be at least 6 characters.' : 'Password minimal 6 karakter.', 'danger');
    return;
  }

  const accounts = JSON.parse(localStorage.getItem('ruma_accounts') || '[]');
  if (accounts.find(a => a.username === usernameVal)) {
    showToast(currentLang === 'en' ? 'Username already taken. Please choose another.' : 'Username sudah digunakan. Pilih username lain.', 'warning');
    return;
  }
  accounts.push({ username: usernameVal, email: emailVal, phone: phoneVal, address: addressVal, password: passwordVal });
  localStorage.setItem('ruma_accounts', JSON.stringify(accounts));

  currentUser = { role: 'user', name: usernameVal, email: emailVal, phone: phoneVal, address: addressVal, city: 'Jakarta', zip: '12345' };
  _finalizeLogin();
}

// Admin login
function submitAdminLogin(event) {
  event.preventDefault();
  const usernameVal = document.getElementById('admin-username').value.trim();
  const passwordVal = document.getElementById('admin-password').value;
  if (usernameVal === 'admin krisna' && passwordVal === 'admin krisna') {
    currentUser = { role: 'admin', name: 'Admin Krisna', email: 'admin.krisna@ruma.com' };
    _finalizeLogin();
  } else {
    showToast(currentLang === 'en' ? 'Invalid Admin credentials.' : 'Kredensial Admin salah.', 'danger');
  }
}

// Keep legacy submitLogin for any remaining references
function submitLogin(event) {
  if (event) event.preventDefault();
  submitExistingLogin(event);
}

function _finalizeLogin() {
  localStorage.setItem('ruma_user', JSON.stringify(currentUser));
  updateNavbarUserUI();
  closeLoginModal();
  initNotifications();
  if (typeof addNotification === 'function') {
    addNotification(
      'Sesi Dimulai / Login Sukses', 'Session Started / Login Success',
      `Selamat datang kembali, ${currentUser.name}! Hubungi kami lewat chat jika butuh bantuan.`,
      `Welcome back, ${currentUser.name}! Chat with us if you need any assistance.`,
      'info'
    );
  }
  showToast(currentLang === 'en' ? `Welcome, ${currentUser.name}!` : `Selamat datang, ${currentUser.name}!`, 'success');
  trackGAEvent('Login Sukses', currentUser.email);
  if (typeof loadProfilePage === 'function') loadProfilePage();
  if (typeof autofillCheckoutForm === 'function') autofillCheckoutForm();
}

function handleLogout(event) {
  event.preventDefault();
  const userName = currentUser ? currentUser.name : '';
  currentUser = null;
  localStorage.removeItem('ruma_user');
  updateNavbarUserUI();
  
  // Reset notifications to user/guest list and push a logout notification
  initNotifications();
  if (typeof addNotification === 'function') {
    addNotification(
      'Sesi Berakhir / Logout', 'Session Ended / Logout',
      `Terima kasih ${userName}, Anda telah keluar secara aman.`, `Thank you ${userName}, you have logged out safely.`,
      'info'
    );
  }

  const logoutMsg = currentLang === 'en' ? `Goodbye!` : `Anda berhasil keluar. Sampai jumpa!`;
  showToast(logoutMsg, 'success');
  trackGAEvent('Logout Sukses', userName);

  if (typeof loadProfilePage === 'function') {
    loadProfilePage();
  }

  // Kosongkan form jika ada di halaman checkout
  if (typeof clearCheckoutForm === 'function') {
    clearCheckoutForm();
  }
}

function showProfileInfo(event) {
  event.preventDefault();
  if (currentUser) {
    if (currentUser.role === 'admin') {
      alert(`Admin Profile:\n\nName: ${currentUser.name}\nEmail: ${currentUser.email}\nRole: Administrator`);
    } else {
      const profileInfo = currentLang === 'en' 
        ? `Profile Details:\n\nName: ${currentUser.name}\nEmail: ${currentUser.email}\nPhone: ${currentUser.phone}\nAddress: ${currentUser.address}, ${currentUser.city} (${currentUser.zip})`
        : `Detail Profil Anda:\n\nNama: ${currentUser.name}\nEmail: ${currentUser.email}\nNo HP: ${currentUser.phone}\nAlamat: ${currentUser.address}, ${currentUser.city} (${currentUser.zip})`;
      alert(profileInfo);
    }
  }
}

// ==========================================
// LOGIKA ADMIN PANEL & SINKRONISASI STOK
// ==========================================

function renderAdminDashboardProfile() {
  const tbody = document.getElementById('admin-products-tbody');
  if (!tbody) return;

  const currentDb = JSON.parse(localStorage.getItem('ruma_products_db')) || [];
  
  let tableRows = '';
  currentDb.forEach(prod => {
    const isVisible = prod.visible !== false;
    tableRows += `
      <tr style="border-bottom: 1px solid var(--color-border);">
        <td style="padding: 12px 8px; font-size: 0.85rem;"><strong>${prod.id}</strong> - ${currentLang === 'en' ? (prod.nama_en || prod.nama) : prod.nama}</td>
        <td style="padding: 12px 8px;">
          <input type="number" class="form-control admin-price-input" data-id="${prod.id}" value="${prod.harga}" style="width: 110px; padding: 6px; font-size: 0.8rem;">
        </td>
        <td style="padding: 12px 8px;">
          <input type="number" class="form-control admin-stock-input" data-id="${prod.id}" value="${prod.stok}" style="width: 70px; padding: 6px; font-size: 0.8rem;">
        </td>
        <td style="padding: 12px 8px; text-align: center;">
          <input type="checkbox" class="admin-visible-checkbox" data-id="${prod.id}" ${isVisible ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
        </td>
      </tr>
    `;
  });

  tbody.innerHTML = tableRows;
}

function openAdminDashboard(event) {
  if (event) event.preventDefault();
  
  // Cek element container modal admin, buat jika belum ada
  let adminModal = document.getElementById('admin-dashboard-modal');
  if (!adminModal) {
    adminModal = document.createElement('div');
    adminModal.id = 'admin-dashboard-modal';
    adminModal.className = 'modal';
    document.body.appendChild(adminModal);
  }

  // Load database produk terbaru dari localStorage
  const currentDb = JSON.parse(localStorage.getItem('ruma_products_db')) || [];
  
  const titleText = currentLang === 'en' ? 'RUMA Admin Management Panel' : 'Panel Manajemen Admin RUMA';
  const saveText = currentLang === 'en' ? 'Sync & Save Changes' : 'Sinkronkan & Simpan Perubahan';
  const colName = currentLang === 'en' ? 'Product Name' : 'Nama Produk';
  const colPrice = currentLang === 'en' ? 'Price' : 'Harga';
  const colStock = currentLang === 'en' ? 'Stock' : 'Stok';
  const colStatus = currentLang === 'en' ? 'Visibility' : 'Visibilitas';

  let tableRows = '';
  currentDb.forEach(prod => {
    const isVisible = prod.visible !== false;
    tableRows += `
      <tr style="border-bottom: 1px solid var(--color-border);">
        <td style="padding: 12px 8px; font-size: 0.85rem;"><strong>${prod.id}</strong> - ${currentLang === 'en' ? (prod.nama_en || prod.nama) : prod.nama}</td>
        <td style="padding: 12px 8px;">
          <input type="number" class="form-control admin-price-input" data-id="${prod.id}" value="${prod.harga}" style="width: 110px; padding: 6px; font-size: 0.8rem;">
        </td>
        <td style="padding: 12px 8px;">
          <input type="number" class="form-control admin-stock-input" data-id="${prod.id}" value="${prod.stok}" style="width: 70px; padding: 6px; font-size: 0.8rem;">
        </td>
        <td style="padding: 12px 8px; text-align: center;">
          <input type="checkbox" class="admin-visible-checkbox" data-id="${prod.id}" ${isVisible ? 'checked' : ''} style="transform: scale(1.2); cursor: pointer;">
        </td>
      </tr>
    `;
  });

  adminModal.innerHTML = `
    <div class="modal-overlay" onclick="closeAdminDashboard()"></div>
    <div class="modal-content" style="width: 720px; max-width: 95%; max-height: 90vh; overflow-y: auto;">
      <button class="close-modal-btn" onclick="closeAdminDashboard()" aria-label="Tutup Admin Modal">&times;</button>
      <div style="padding: 30px;">
        <h3 style="margin-bottom: 4px; font-family: var(--font-heading); font-size: 1.6rem; text-align: center;">${titleText}</h3>
        <p style="text-align:center; font-size:0.8rem; color:var(--color-text-secondary); margin-bottom:24px;">Dashboard pengelola toko RUMA</p>

        <!-- Section 1: Produk -->        
        <div style="background:var(--color-bg-secondary); border-radius:8px; padding:16px 18px; margin-bottom:24px;">
          <h4 style="font-size:0.92rem; font-weight:700; margin-bottom:16px; display:flex; align-items:center; gap:8px;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="var(--color-accent)" stroke-width="2" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            Manajemen Produk
          </h4>
          <table style="width: 100%; border-collapse: collapse; text-align: left;">
            <thead>
              <tr style="border-bottom: 2px solid var(--color-border);">
                <th style="padding: 10px 8px; font-size: 0.82rem;">${colName}</th>
                <th style="padding: 10px 8px; font-size: 0.82rem;">${colPrice} (IDR)</th>
                <th style="padding: 10px 8px; font-size: 0.82rem;">${colStock}</th>
                <th style="padding: 10px 8px; font-size: 0.82rem; text-align: center;">${colStatus}</th>
              </tr>
            </thead>
            <tbody>${tableRows}</tbody>
          </table>
          <button onclick="saveAdminChanges()" class="btn btn-primary" style="width: 100%; padding: 11px; font-weight: 700; margin-top:16px; font-size:0.85rem;">
            ${saveText}
          </button>
        </div>

      </div>
    </div>
  `;

  adminModal.classList.add('open');
}

function closeAdminDashboard() {
  const modal = document.getElementById('admin-dashboard-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

function saveAdminChanges() {
  const currentDb = JSON.parse(localStorage.getItem('ruma_products_db')) || [];
  
  const priceInputs = document.querySelectorAll('.admin-price-input');
  const stockInputs = document.querySelectorAll('.admin-stock-input');
  const visibilityChecks = document.querySelectorAll('.admin-visible-checkbox');

  // Update data array
  currentDb.forEach(prod => {
    // Cari input harga
    const priceInput = Array.from(priceInputs).find(i => i.getAttribute('data-id') === prod.id);
    if (priceInput) {
      prod.harga = Math.max(0, parseInt(priceInput.value) || 0);
    }
    
    // Cari input stok
    const stockInput = Array.from(stockInputs).find(i => i.getAttribute('data-id') === prod.id);
    if (stockInput) {
      prod.stok = Math.max(0, parseInt(stockInput.value) || 0);
    }
    
    // Cari checkbox visibilitas
    const visibleCheck = Array.from(visibilityChecks).find(c => c.getAttribute('data-id') === prod.id);
    if (visibleCheck) {
      prod.visible = visibleCheck.checked;
    }
  });

  // Simpan kembali ke localStorage database utama
  localStorage.setItem('ruma_products_db', JSON.stringify(currentDb));
  
  // Update instance di products global runtime agar script lain langsung dapet update
  if (typeof products !== 'undefined') {
    // Sinkronisasi data products global
    const newDb = JSON.parse(localStorage.getItem('ruma_products_db'));
    // Clear and copy
    products.length = 0;
    newDb.forEach(p => products.push(p));
  }

  closeAdminDashboard();

  // Re-translate / Re-render halaman
  if (typeof setLanguage === 'function') {
    setLanguage(currentLang);
  }

  showToast(currentLang === 'en' ? 'Database updated and synced successfully!' : 'Database berhasil diperbarui dan disinkronkan!', 'success');
  trackGAEvent('Admin Database Sync', 'Update database sukses');
}

// Close Dropdowns on outside click
window.addEventListener('click', (e) => {
  const dropdown = document.getElementById('user-dropdown-menu');
  if (dropdown && dropdown.classList.contains('open')) {
    const container = document.getElementById('user-nav-container');
    if (container && !container.contains(e.target)) {
      dropdown.classList.remove('open');
    }
  }

  // Close notifications dropdown
  const notifDropdown = document.getElementById('notification-dropdown');
  if (notifDropdown && notifDropdown.classList.contains('open')) {
    const notifBtn = document.querySelector('.notification-btn');
    if (notifBtn && !notifBtn.contains(e.target) && !notifDropdown.contains(e.target)) {
      notifDropdown.classList.remove('open');
    }
  }

  // Close chat window dropdown
  const chatWindow = document.getElementById('chat-window');
  if (chatWindow && chatWindow.classList.contains('open')) {
    const chatBtn = document.querySelector('.chat-nav-btn');
    if (chatBtn && !chatBtn.contains(e.target) && !chatWindow.contains(e.target)) {
      chatWindow.classList.remove('open');
    }
  }
});

// ==========================================
// NOTIFICATION SYSTEM ENGINE
// ==========================================

const defaultNotifications = [
  {
    id: "NOTIF-PROMO",
    title: "Diskon Bundling 10% Aktif!",
    title_en: "10% Bundling Discount Active!",
    content: "Beli 2 item furniture atau lebih dan dapatkan diskon otomatis 10% di keranjang belanja.",
    content_en: "Buy 2 or more furniture items and get automatic 10% discount in your cart.",
    type: "promo",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    unread: true
  },
  {
    id: "NOTIF-NEW",
    title: "Koleksi RUMA Terbaru",
    title_en: "New RUMA Collection",
    content: "Meja Ruang Tamu Minimalis (P010) sekarang tersedia dalam stok terbatas. Cek katalog!",
    content_en: "Minimalist Living Room Coffee Table (P010) is now available in limited stock. Check catalog!",
    type: "info",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
    unread: true
  },

];

function getNotificationKey() {
  if (currentUser && currentUser.name) {
    return 'ruma_notifications_' + currentUser.name;
  }
  return 'ruma_notifications_guest';
}

function initNotifications() {
  const key = getNotificationKey();
  if (!localStorage.getItem(key)) {
    localStorage.setItem(key, JSON.stringify(defaultNotifications));
  }
  updateNotificationsUI();
}

function toggleNotifications(event) {
  if (event) event.stopPropagation();
  const dropdown = document.getElementById('notification-dropdown');
  if (dropdown) {
    dropdown.classList.toggle('open');
    if (dropdown.classList.contains('open')) {
      trackGAEvent('Buka Notifikasi', 'Dropdown Notifikasi Ditampilkan');
    }
  }
}

function addNotification(title, titleEn, content, contentEn, type = 'info') {
  const key = getNotificationKey();
  const notifs = JSON.parse(localStorage.getItem(key)) || [];
  const newNotif = {
    id: 'NOTIF-' + Date.now(),
    title: title,
    title_en: titleEn,
    content: content,
    content_en: contentEn,
    type: type,
    timestamp: new Date().toISOString(),
    unread: true
  };
  notifs.unshift(newNotif);
  localStorage.setItem(key, JSON.stringify(notifs));

  updateNotificationsUI();
}

function markAllNotifsRead(event) {
  if (event) event.stopPropagation();
  const key = getNotificationKey();
  const notifs = JSON.parse(localStorage.getItem(key)) || [];
  notifs.forEach(n => n.unread = false);
  localStorage.setItem(key, JSON.stringify(notifs));
  updateNotificationsUI();
  showToast(currentLang === 'en' ? 'All notifications marked as read.' : 'Semua notifikasi ditandai telah dibaca.', 'success');
}

function updateNotificationsUI() {
  const badge = document.getElementById('notification-badge');
  const listContainer = document.getElementById('notification-list');
  if (!listContainer) return;

  const key = getNotificationKey();
  const notifs = JSON.parse(localStorage.getItem(key)) || [];
  const unreadCount = notifs.filter(n => n.unread).length;

  if (badge) {
    if (unreadCount > 0) {
      badge.style.display = 'flex';
      badge.textContent = unreadCount;
    } else {
      badge.style.display = 'none';
    }
  }

  if (notifs.length === 0) {
    const emptyText = currentLang === 'en' ? 'No notifications yet.' : 'Tidak ada notifikasi.';
    listContainer.innerHTML = `
      <div style="padding: 20px; text-align: center; font-size: 0.8rem; color: var(--color-text-secondary);">
        ${emptyText}
      </div>
    `;
    return;
  }

  let html = '';
  notifs.forEach(n => {
    const title = currentLang === 'en' ? (n.title_en || n.title) : n.title;
    const content = currentLang === 'en' ? (n.content_en || n.content) : n.content;
    
    // Format timestamp nicely
    const dateObj = new Date(n.timestamp);
    const dateStr = dateObj.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'id-ID', { month: 'short', day: 'numeric' });
    const timeStr = dateObj.toLocaleTimeString(currentLang === 'en' ? 'en-US' : 'id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    let typeEmoji = '🔔';
    if (n.type === 'promo') typeEmoji = '🏷️';
    if (n.type === 'shipping') typeEmoji = '📦';
    if (n.type === 'checkout') typeEmoji = '🛒';
    if (n.type === 'info') typeEmoji = 'ℹ️';

    html += `
      <div class="notification-item ${n.unread ? 'unread' : ''}" onclick="readSingleNotif('${n.id}')">
        <div class="notification-title">
          <span>${typeEmoji}</span>
          <span>${title}</span>
        </div>
        <p class="notification-desc">${content}</p>
        <span class="notification-time">${dateStr}, ${timeStr}</span>
      </div>
    `;
  });

  listContainer.innerHTML = html;
}

function readSingleNotif(id) {
  const key = getNotificationKey();
  const notifs = JSON.parse(localStorage.getItem(key)) || [];
  const notif = notifs.find(n => n.id === id);
  if (notif && notif.unread) {
    notif.unread = false;
    localStorage.setItem(key, JSON.stringify(notifs));
    updateNotificationsUI();
  }
}

// ==========================================
// FLOATING LIVE CHAT SYSTEM
// ==========================================

let activeChatUserId = null; // Used by admin to select active customer chat

function initChatWidget() {
  const cartBtn = document.querySelector('.cart-icon-btn');
  if (!cartBtn) return;

  const chatWrapper = document.createElement('div');
  chatWrapper.id = 'chat-nav-wrapper';
  
  chatWrapper.innerHTML = `
    <button class="btn-icon chat-nav-btn" onclick="toggleChatWindow(event)" title="Live Chat Support">
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-square" style="display:block;"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
    </button>
    <div class="chat-window" id="chat-window">
      <div class="chat-header">
        <h4 id="chat-title">💬 Live Chat Support</h4>
        <button class="chat-close-btn" onclick="toggleChatWindow(event)">&times;</button>
      </div>
      <div class="chat-body" id="chat-body">
      </div>
      <div class="chat-footer" id="chat-footer">
        <input type="text" class="chat-input" id="chat-input" placeholder="Tulis pesan..." onkeypress="handleChatEnter(event)">
        <button class="chat-send-btn" onclick="sendChatMessage()">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/></svg>
        </button>
      </div>
    </div>
  `;
  
  cartBtn.parentNode.insertBefore(chatWrapper, cartBtn);
  renderChatContent();
}

function toggleChatWindow(event) {
  if (event) event.stopPropagation();
  const windowEl = document.getElementById('chat-window');
  if (windowEl) {
    windowEl.classList.toggle('open');
    if (windowEl.classList.contains('open')) {
      renderChatContent();
      setTimeout(() => {
        const body = document.getElementById('chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }, 100);
    }
  }
}

function getVisitorId() {
  let vId = localStorage.getItem('ruma_visitor_id');
  if (!vId) {
    vId = 'Guest-' + Math.floor(1000 + Math.random() * 9000);
    localStorage.setItem('ruma_visitor_id', vId);
  }
  return vId;
}

function getChatHistory() {
  return JSON.parse(localStorage.getItem('ruma_chat_history')) || [];
}

function saveChatHistory(history) {
  localStorage.setItem('ruma_chat_history', JSON.stringify(history));
}

function renderChatContent() {
  const body = document.getElementById('chat-body');
  const footer = document.getElementById('chat-footer');
  const title = document.getElementById('chat-title');
  if (!body || !footer) return;

  const isAdmin = currentUser && currentUser.role === 'admin';
  const history = getChatHistory();

  if (isAdmin) {
    if (activeChatUserId) {
      const convo = history.find(c => c.senderId === activeChatUserId);
      const name = convo ? convo.senderName : activeChatUserId;
      title.innerHTML = `<button onclick="goBackToConvoList()" style="background:none; border:none; color:white; font-size:1.1rem; cursor:pointer; margin-right:4px; padding:0 4px; font-family:inherit;">←</button> Chat: ${name}`;
      footer.style.display = 'flex';

      if (!convo || convo.messages.length === 0) {
        body.innerHTML = `<div style="text-align:center; padding:20px; font-size:0.8rem; color:var(--color-text-secondary);">Belum ada pesan.</div>`;
        return;
      }

      let html = '';
      convo.messages.forEach(m => {
        const isMe = m.sender === 'admin';
        html += `
          <div class="chat-msg ${isMe ? 'sent' : 'received'}">
            ${m.text}
            <span class="chat-msg-meta">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
          </div>
        `;
      });
      body.innerHTML = html;
    } else {
      title.innerHTML = `💬 CS Admin Console`;
      footer.style.display = 'none';

      if (history.length === 0) {
        body.innerHTML = `<div style="text-align:center; padding:40px 20px; font-size:0.8rem; color:var(--color-text-secondary);">Belum ada percakapan masuk dari pembeli.</div>`;
        return;
      }

      let html = '<div style="font-size:0.75rem; font-weight:700; color:var(--color-text-secondary); margin-bottom:8px;">DAFTAR CHAT MASUK:</div>';
      history.forEach(c => {
        const lastMsg = c.messages[c.messages.length - 1];
        const lastText = lastMsg ? lastMsg.text : 'No messages';
        html += `
          <div onclick="selectConvo('${c.senderId}')" style="background:white; border:1px solid var(--color-border); border-radius:6px; padding:12px; margin-bottom:8px; cursor:pointer; transition: var(--transition-smooth);">
            <div style="font-weight:700; font-size:0.82rem; color:var(--color-text-primary); display:flex; justify-content:space-between;">
              <span>👤 ${c.senderName}</span>
              <span style="font-size:0.65rem; color:var(--color-text-secondary); font-weight:normal;">${lastMsg ? new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}</span>
            </div>
            <div style="font-size:0.75rem; color:var(--color-text-secondary); margin-top:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${lastText}
            </div>
          </div>
        `;
      });
      body.innerHTML = html;
    }
  } else {
    const myId = currentUser ? currentUser.email : getVisitorId();
    const myName = currentUser ? currentUser.name : (currentLang === 'en' ? 'Guest' : 'Tamu');
    
    title.innerHTML = `💬 RUMA Customer Service`;
    footer.style.display = 'flex';

    const convo = history.find(c => c.senderId === myId);

    if (!convo || convo.messages.length === 0) {
      const welcome = currentLang === 'en'
        ? 'Welcome to RUMA! How can we assist you with our space-saving furniture today?'
        : 'Selamat datang di RUMA! Ada yang bisa kami bantu mengenai produk furniture hemat ruang hari ini?';
      body.innerHTML = `
        <div class="chat-msg received">
          ${welcome}
          <span class="chat-msg-meta">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `;
      return;
    }

    let html = '';
    convo.messages.forEach(m => {
      const isMe = m.sender === 'customer';
      html += `
        <div class="chat-msg ${isMe ? 'sent' : 'received'}">
          ${m.text}
          <span class="chat-msg-meta">${new Date(m.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </div>
      `;
    });
    body.innerHTML = html;
  }
}

function goBackToConvoList() {
  activeChatUserId = null;
  renderChatContent();
}

function selectConvo(userId) {
  activeChatUserId = userId;
  renderChatContent();
  setTimeout(() => {
    const body = document.getElementById('chat-body');
    if (body) body.scrollTop = body.scrollHeight;
  }, 100);
}

function handleChatEnter(event) {
  if (event.key === 'Enter') {
    sendChatMessage();
  }
}

function sendChatMessage() {
  const input = document.getElementById('chat-input');
  if (!input || !input.value.trim()) return;

  const text = input.value.trim();
  input.value = '';

  const isAdmin = currentUser && currentUser.role === 'admin';
  const history = getChatHistory();

  if (isAdmin) {
    if (!activeChatUserId) return;
    const convoIndex = history.findIndex(c => c.senderId === activeChatUserId);
    if (convoIndex > -1) {
      history[convoIndex].messages.push({
        sender: 'admin',
        text: text,
        timestamp: Date.now()
      });
      saveChatHistory(history);
      renderChatContent();
      
      setTimeout(() => {
        const body = document.getElementById('chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }, 50);
    }
  } else {
    const myId = currentUser ? currentUser.email : getVisitorId();
    const myName = currentUser ? currentUser.name : (currentLang === 'en' ? 'Guest' : 'Tamu');

    let convoIndex = history.findIndex(c => c.senderId === myId);
    if (convoIndex === -1) {
      history.push({
        senderId: myId,
        senderName: myName,
        messages: []
      });
      convoIndex = history.length - 1;
    }

    history[convoIndex].senderName = myName;
    history[convoIndex].messages.push({
      sender: 'customer',
      text: text,
      timestamp: Date.now()
    });

    saveChatHistory(history);
    renderChatContent();

    setTimeout(() => {
      const body = document.getElementById('chat-body');
      if (body) body.scrollTop = body.scrollHeight;
    }, 50);

    // Otomatis balas dummy dari CS jika admin tidak standby
    setTimeout(() => {
      const liveHistory = getChatHistory();
      const liveConvo = liveHistory.find(c => c.senderId === myId);
      const lastMsg = liveConvo.messages[liveConvo.messages.length - 1];
      
      if (lastMsg && lastMsg.sender === 'customer') {
        liveConvo.messages.push({
          sender: 'admin',
          text: currentLang === 'en'
            ? 'Thank you! Representative will respond to your chat shortly.'
            : 'Terima kasih! Penjual/Admin RUMA akan segera membalas chat Anda.',
          timestamp: Date.now()
        });
        saveChatHistory(liveHistory);
        renderChatContent();
        
        const body = document.getElementById('chat-body');
        if (body) body.scrollTop = body.scrollHeight;
      }
    }, 4000);
  }
}

// 12. Lacak Resi Pengiriman (Stubbed)
function trackPackage(event) {
  if (event) event.preventDefault();
}

function renderAdminPackagePanel() {}

// 13. Manajemen Pengumuman (Announcement Bar) Dismissible
function dismissAnnouncement() {
  const bars = document.querySelectorAll('.announcement-bar');
  bars.forEach(bar => {
    bar.style.display = 'none';
  });
  localStorage.setItem('ruma_announcement_dismissed', 'true');
}

function initAnnouncementBar() {
  if (localStorage.getItem('ruma_announcement_dismissed') === 'true') {
    const bars = document.querySelectorAll('.announcement-bar');
    bars.forEach(bar => {
      bar.style.display = 'none';
    });
  }
}

// 14. Event Listeners Awal saat Halaman Dimuat
document.addEventListener('DOMContentLoaded', () => {
  initAnnouncementBar();
  updateCartBadge();
  updateNavbarUserUI();
  updateCurrencyToggleUI();
  initNotifications();
  initChatWidget();
  
  const header = document.querySelector('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  trackGAEvent('Pageview', window.location.pathname);
});

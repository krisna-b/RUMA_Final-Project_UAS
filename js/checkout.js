/* ==========================================
   LOGIKA CHECKOUT & SIMULASI MIDTRANS - RUMA
   ========================================== */

let shippingCost = 25000; 
let assemblyCost = 0;

let checkoutEventsInitialized = false;

document.addEventListener('DOMContentLoaded', () => {
  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm && !checkoutEventsInitialized) {
    initCheckoutEvents();
    checkoutEventsInitialized = true;
  }
});

function initCheckoutPage() {
  if (!currentUser) {
    alert(currentLang === 'en' 
      ? 'You must login first to access the checkout page.' 
      : 'Anda harus login terlebih dahulu untuk mengakses halaman checkout.');
    window.location.hash = '#home';
    return;
  }

  // Ensure event listeners are bound
  if (!checkoutEventsInitialized) {
    initCheckoutEvents();
    checkoutEventsInitialized = true;
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    renderOrderSummary();
    autofillCheckoutForm(); // Auto-fill jika user sudah login
  }
}

// 1. Render Summary Belanja di Checkout (Bilingual)
function renderOrderSummary() {
  const container = document.getElementById('checkout-items-list');
  if (!container) return;

  if (cart.length === 0) {
    const emptyText = currentLang === 'en' ? 'Your cart is empty.' : 'Keranjang Anda kosong.';
    const ctaText = currentLang === 'en' ? 'Shop Now' : 'Belanja Sekarang';
    container.innerHTML = `
      <div style="text-align: center; padding: 20px 0;">
        <p>${emptyText}</p>
        <a href="#catalog" class="btn btn-primary" style="margin-top: 12px; display: inline-block;">${ctaText}</a>
      </div>
    `;
    updateCheckoutTotals(0, 0, 0, 0);
    const submitBtn = document.getElementById('submit-checkout-btn');
    if (submitBtn) submitBtn.disabled = true;
    return;
  }

  const submitBtn = document.getElementById('submit-checkout-btn');
  if (submitBtn) submitBtn.disabled = false;

  let html = '';
  cart.forEach(item => {
    const displayName = currentLang === 'en' ? (item.nama_en || item.nama) : item.nama;
    html += `
      <div class="summary-item-row">
        <img src="${item.gambar}" alt="${displayName}" class="summary-item-img">
        <div class="summary-item-info">
          <h4 class="summary-item-name">${displayName}</h4>
          <span class="summary-item-qty-price">${item.qty} x ${formatRupiah(item.harga)}</span>
        </div>
        <span class="summary-item-total">${formatRupiah(item.harga * item.qty)}</span>
      </div>
    `;
  });

  container.innerHTML = html;
  recalculateCheckout();
}

// Helper to calculate dynamic arrival date
function getEstimatedArrivalText(shippingMethod) {
  const today = new Date();
  let minDays = 3, maxDays = 5;
  if (shippingMethod === 'ekspres') {
    minDays = 1;
    maxDays = 2;
  }
  
  const minDate = new Date(today);
  minDate.setDate(today.getDate() + minDays);
  
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + maxDays);
  
  const options = { weekday: 'long', day: 'numeric', month: 'long' };
  const minDateStr = minDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'id-ID', options);
  const maxDateStr = maxDate.toLocaleDateString(currentLang === 'en' ? 'en-US' : 'id-ID', options);
  
  return currentLang === 'en' 
    ? `Estimated arrival: ${minDateStr} - ${maxDateStr}`
    : `Estimasi sampai: ${minDateStr} s.d. ${maxDateStr}`;
}

// 2. Kalkulasi Ulang Biaya & Jasa
function recalculateCheckout() {
  const totals = calculateTotals();
  
  const shippingSelect = document.getElementById('shipping-service');
  if (shippingSelect) {
    if (shippingSelect.value === 'ekspres') {
      shippingCost = 50000;
    } else {
      shippingCost = 25000;
    }
    
    // Update estimated delivery label
    const estDateEl = document.getElementById('shipping-est-date');
    if (estDateEl) {
      estDateEl.innerHTML = getEstimatedArrivalText(shippingSelect.value);
    }
  }

  const assemblyCheckbox = document.getElementById('assembly-service');
  if (assemblyCheckbox) {
    assemblyCost = assemblyCheckbox.checked ? 50000 : 0;
  }

  const grandTotal = totals.total + shippingCost + assemblyCost;
  updateCheckoutTotals(totals.subtotal, totals.discount, shippingCost + assemblyCost, grandTotal);
}

// 3. Update DOM Totals
function updateCheckoutTotals(subtotal, discount, shipping, grandTotal) {
  const subtotalEl = document.getElementById('checkout-subtotal');
  const discountEl = document.getElementById('checkout-discount');
  const discountRow = document.getElementById('checkout-discount-row');
  const shippingEl = document.getElementById('checkout-shipping');
  const totalEl = document.getElementById('checkout-total');

  if (subtotalEl) subtotalEl.textContent = formatRupiah(subtotal);
  
  if (discountEl && discountRow) {
    if (discount > 0) {
      discountRow.style.display = 'flex';
      discountEl.textContent = `-${formatRupiah(discount)}`;
    } else {
      discountRow.style.display = 'none';
    }
  }

  if (shippingEl) shippingEl.textContent = formatRupiah(shipping);
  if (totalEl) totalEl.textContent = formatRupiah(grandTotal);
}

// 4. Inisialisasi Listeners
function initCheckoutEvents() {
  const shippingSelect = document.getElementById('shipping-service');
  if (shippingSelect) {
    shippingSelect.addEventListener('change', () => {
      recalculateCheckout();
      trackGAEvent('Pilih Pengiriman', shippingSelect.value);
    });
  }

  const assemblyCheckbox = document.getElementById('assembly-service');
  if (assemblyCheckbox) {
    assemblyCheckbox.addEventListener('change', () => {
      recalculateCheckout();
      trackGAEvent('Pilih Jasa Perakitan', assemblyCheckbox.checked ? 'Ya' : 'Tidak');
    });
  }

  const checkoutForm = document.getElementById('checkout-form');
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert("DEBUG: Submit handler fired! Cart length = " + cart.length);
      
      if (cart.length === 0) {
        showToast(currentLang === 'en' ? 'Your cart is empty!' : 'Keranjang belanja Anda kosong!', 'danger');
        return;
      }

      const isValid = validateCheckoutForm();
      alert("DEBUG: Validation result = " + isValid);
      if (isValid) {
        openPaymentModal();
      }
    });
  }
}

// 5. Validasi Form Data Diri (Mendukung Bilingual Toast)
function validateCheckoutForm() {
  try {
    const nameEl = document.getElementById('cust-name');
    const emailEl = document.getElementById('cust-email');
    const phoneEl = document.getElementById('cust-phone');
    const addressEl = document.getElementById('cust-address');
    const cityEl = document.getElementById('cust-city');
    const zipEl = document.getElementById('cust-zip');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const phone = phoneEl ? phoneEl.value.trim() : '';
    const address = addressEl ? addressEl.value.trim() : '';
    const city = cityEl ? cityEl.value.trim() : '';
    const zip = zipEl ? zipEl.value.trim() : '';

    let isValid = true;

    if (name.length < 3) {
      const msg = currentLang === 'en' ? 'Full name must be at least 3 characters.' : 'Nama lengkap minimal harus 3 karakter.';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const msg = currentLang === 'en' ? 'Invalid email address format.' : 'Format alamat email tidak valid.';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    const cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      const msg = currentLang === 'en' ? 'Invalid phone number (must be 10-13 digits).' : 'Nomor HP tidak valid (harus 10-13 digit angka saja).';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    if (address.length < 10) {
      const msg = currentLang === 'en' ? 'Full shipping address must be at least 10 characters.' : 'Alamat lengkap pengiriman minimal harus 10 karakter.';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    if (city.length === 0) {
      const msg = currentLang === 'en' ? 'City must be filled.' : 'Kota pengiriman harus diisi.';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    const cleanZip = zip.replace(/[^0-9]/g, '');
    if (cleanZip.length !== 5) {
      const msg = currentLang === 'en' ? 'Invalid ZIP Code (must be 5 digits).' : 'Kode pos tidak valid (harus 5 digit angka).';
      alert("DEBUG Validation Error: " + msg);
      showToast(msg, 'danger');
      isValid = false;
    }

    return isValid;
  } catch (error) {
    alert("DEBUG validateCheckoutForm Error: " + error.message + "\nStack: " + error.stack);
    return false;
  }
}

// 6. Autofill Form Pengiriman
function autofillCheckoutForm() {
  if (currentUser) {
    const nameEl = document.getElementById('cust-name');
    const emailEl = document.getElementById('cust-email');
    const phoneEl = document.getElementById('cust-phone');
    const addressEl = document.getElementById('cust-address');
    const cityEl = document.getElementById('cust-city');
    const zipEl = document.getElementById('cust-zip');

    if (nameEl) nameEl.value = currentUser.name;
    if (emailEl) emailEl.value = currentUser.email;
    if (phoneEl) phoneEl.value = currentUser.phone || '';
    if (addressEl) addressEl.value = currentUser.address || '';
    if (cityEl) cityEl.value = currentUser.city || '';
    if (zipEl) zipEl.value = currentUser.zip || '';

    recalculateCheckout();
    console.log("🔐 [Checkout Autofill] Form data diri otomatis terisi oleh data login.");
  }
}

// 7. Kosongkan Form Pengiriman (Logout)
function clearCheckoutForm() {
  const nameEl = document.getElementById('cust-name');
  const emailEl = document.getElementById('cust-email');
  const phoneEl = document.getElementById('cust-phone');
  const addressEl = document.getElementById('cust-address');
  const cityEl = document.getElementById('cust-city');
  const zipEl = document.getElementById('cust-zip');

  if (nameEl) nameEl.value = '';
  if (emailEl) emailEl.value = '';
  if (phoneEl) phoneEl.value = '';
  if (addressEl) addressEl.value = '';
  if (cityEl) cityEl.value = '';
  if (zipEl) zipEl.value = '';

  recalculateCheckout();
}

// 8. Buka Popup Simulasi Midtrans (Bilingual & Multi-payment)
function openPaymentModal() {
  try {
    alert("DEBUG: openPaymentModal called!");
    const totals = calculateTotals();
    const grandTotal = totals.total + shippingCost + assemblyCost;
    
    const amountEl = document.getElementById('modal-payment-amount');
    if (amountEl) {
      amountEl.textContent = formatRupiah(grandTotal);
    }

    const selectedPaymentEl = document.querySelector('input[name="payment-method"]:checked');
    const selectedPayment = selectedPaymentEl ? selectedPaymentEl.value : 'bank-transfer';
    const paymentContent = document.getElementById('modal-payment-detail-content');
    
    // Update tombol sesuai bahasa
    const successBtn = document.querySelector('.payment-btn-success');
    const cancelBtn = document.querySelector('.payment-btn-cancel');

    if (successBtn) {
      successBtn.textContent = currentLang === 'en' ? 'Simulate Payment Success ✓' : 'Simulasikan Bayar Sukses ✓';
    }
    if (cancelBtn) {
      cancelBtn.textContent = currentLang === 'en' ? 'Cancel Transaction' : 'Batalkan Transaksi';
    }

    if (!paymentContent) return;

    if (selectedPayment === 'bank-transfer') {
      const phoneEl = document.getElementById('cust-phone');
      const phoneVal = phoneEl ? phoneEl.value.trim() : '';
      const randomVA = "880608" + (phoneVal.length > 6 ? phoneVal.slice(-6) : "123456");
      const title = currentLang === 'en' ? 'Please transfer to this Virtual Account:' : 'Lakukan transfer ke Virtual Account berikut:';
      const copyText = currentLang === 'en' ? 'Copy' : 'Salin';
      const descText = currentLang === 'en' 
        ? 'Use mobile banking or nearest ATM to complete payment before timeout.' 
        : 'Gunakan mobile banking atau ATM terdekat untuk melakukan transfer sebelum batas waktu berakhir.';

      paymentContent.innerHTML = `
        <div class="payment-instruction-title">${title}</div>
        <div class="va-box">
          <span class="va-number" id="simulated-va">${randomVA}</span>
          <button type="button" class="copy-va-btn" onclick="copyVA()">${copyText}</button>
        </div>
        <p style="font-size: 0.8rem; color: var(--color-text-secondary); margin-bottom: 20px;">
          ${descText}
        </p>
      `;
    } else if (selectedPayment === 'qris') {
      const title = currentLang === 'en' ? 'Scan the following QR Code with your E-Wallet app:' : 'Scan Kode QR berikut dengan aplikasi E-Wallet Anda:';
      const descText = currentLang === 'en'
        ? 'Open GoPay/OVO/Dana and scan the QR dummy code above.'
        : 'Buka aplikasi GoPay/OVO/Dana lalu arahkan kamera scanner ke kode QR di atas.';

      paymentContent.innerHTML = `
        <div class="qr-code-box">
          <div class="payment-instruction-title">${title}</div>
          <div class="qr-code-dummy"></div>
          <p style="font-size: 0.8rem; color: var(--color-text-secondary);">
            ${descText}
          </p>
        </div>
      `;
    } else if (selectedPayment === 'cc') {
      const ccTitle = currentLang === 'en' ? 'Simulated Credit Card details:' : 'Informasi Kartu Kredit Simulasi:';
      const holderLabel = currentLang === 'en' ? 'Cardholder Name' : 'Nama Pemegang Kartu';
      const nameEl = document.getElementById('cust-name');
      const nameVal = nameEl ? nameEl.value.trim() : '';
      paymentContent.innerHTML = `
        <div style="text-align: left; padding: 10px 0;">
          <div class="payment-instruction-title" style="margin-bottom: 8px;">${ccTitle}</div>
          <div style="margin-bottom: 12px; background: #2a3b68; color: white; padding: 15px; border-radius: 8px; font-family: monospace; letter-spacing: 2px; box-shadow: 0 4px 6px rgba(0,0,0,0.15);">
            <div style="font-size: 0.65rem; opacity: 0.8; margin-bottom: 6px;">CREDIT CARD SIMULATOR</div>
            <div style="font-size: 1.1rem; margin-bottom: 8px;" id="simulated-cc-number">4111 1111 1111 1111</div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
              <span>EXP: 12/29</span>
              <span>CVV: 123</span>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 15px;">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-secondary);">${holderLabel}</label>
            <input type="text" class="form-control" value="${nameVal}" readonly style="padding: 6px; font-size: 0.8rem; background-color: var(--color-bg-secondary);">
          </div>
        </div>
      `;
    } else if (selectedPayment === 'debit') {
      const dbTitle = currentLang === 'en' ? 'Simulated Secure GPN Online Debit:' : 'Debit Online GPN Simulasi:';
      const numLabel = currentLang === 'en' ? 'Card Number' : 'Nomor Kartu Debit';
      paymentContent.innerHTML = `
        <div style="text-align: left; padding: 10px 0;">
          <div class="payment-instruction-title" style="margin-bottom: 8px;">${dbTitle}</div>
          <div style="margin-bottom: 12px; background: #e0f2f1; border-left: 4px solid var(--color-accent); padding: 10px; font-size: 0.78rem; color: #004d40;">
            ${currentLang === 'en' ? 'GPN Online Debit simulator. OTP token will be automatically processed on confirmation.' : 'Simulasi Gerbang Debit Online GPN. Token OTP otomatis diproses ketika disetujui.'}
          </div>
          <div class="form-group">
            <label style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-secondary);">${numLabel}</label>
            <input type="text" class="form-control" value="1902 5019 0250 1902" readonly style="padding: 6px; font-size: 0.8rem; background-color: var(--color-bg-secondary);">
          </div>
        </div>
      `;
    } else if (selectedPayment === 'cod') {
      const codTitle = currentLang === 'en' ? 'Cash on Delivery (COD)' : 'Bayar di Tempat (COD)';
      const codDesc = currentLang === 'en'
        ? 'Please prepare exact cash amount to pay the courier on delivery. No advance online transfer required.'
        : 'Harap siapkan uang tunai pas saat kurir tiba mengantarkan barang. Tidak perlu melakukan pembayaran online di awal.';
      paymentContent.innerHTML = `
        <div style="text-align: center; padding: 15px 0;">
          <div style="font-size: 2.5rem; margin-bottom: 10px;">💵</div>
          <div class="payment-instruction-title" style="font-size: 1rem; margin-bottom: 6px;">${codTitle}</div>
          <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.5; margin: 0 10px 10px 10px;">
            ${codDesc}
          </p>
        </div>
      `;
    } else if (selectedPayment === 'offline') {
      const offTitle = currentLang === 'en' ? 'Payment Reference Code:' : 'Kode Pembayaran Retail:';
      const offDesc = currentLang === 'en'
        ? 'Present this transaction code or barcode to the Indomaret/Alfamart cashier to pay.'
        : 'Tunjukkan kode pembayaran atau barcode di atas kepada kasir Indomaret/Alfamart terdekat.';
      paymentContent.innerHTML = `
        <div style="text-align: center; padding: 15px 0;">
          <div style="font-size: 1.5rem; background: var(--color-bg-secondary); padding: 12px; border-radius: 4px; border: 1px dashed var(--color-border); letter-spacing: 2px; margin-bottom: 10px; display: inline-block; font-weight: 700; font-family: monospace;">RUMA-IND-209250190</div>
          <div class="payment-instruction-title" style="font-size: 0.85rem; margin-bottom: 6px;">${offTitle}</div>
          <p style="font-size: 0.8rem; color: var(--color-text-secondary); line-height: 1.4; margin: 0 10px 10px 10px;">
            ${offDesc}
          </p>
        </div>
      `;
    }

    const modal = document.getElementById('payment-modal');
    if (modal) {
      modal.classList.add('open');
    }
    
    trackGAEvent('Checkout Form Validated', selectedPayment, grandTotal);
  } catch (error) {
    alert("DEBUG openPaymentModal Error: " + error.message + "\nStack: " + error.stack);
  }
}

// 9. Tutup Modal
function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('open');
  }
}

// 10. Salin VA
function copyVA() {
  const vaText = document.getElementById('simulated-va').textContent;
  navigator.clipboard.writeText(vaText).then(() => {
    const successMsg = currentLang === 'en' 
      ? 'Virtual Account number copied to clipboard.' 
      : 'Nomor Virtual Account berhasil disalin ke clipboard.';
    showToast(successMsg, 'success');
  }).catch(err => {
    console.error('Gagal menyalin teks: ', err);
  });
}

// 11. Simulasikan Sukses Bayar (Bilingual, Stock Reduction & WhatsApp Confirmation Link)
function simulatePaymentSuccess() {
  const totals = calculateTotals();
  const grandTotal = totals.total + shippingCost + assemblyCost;

  trackGAEvent('Purchase Success', 'Pembelian Sukses Berhasil', grandTotal);

  // 1. Kurangi stok di database localStorage dinamis
  const currentDb = JSON.parse(localStorage.getItem('ruma_products_db')) || [];
  cart.forEach(item => {
    const dbProd = currentDb.find(p => p.id === item.id);
    if (dbProd) {
      dbProd.stok = Math.max(0, dbProd.stok - item.qty);
      dbProd.terjual = (dbProd.terjual || 0) + item.qty;
    }
  });
  localStorage.setItem('ruma_products_db', JSON.stringify(currentDb));
  
  // Sinkronisasikan ke runtime global array products
  if (typeof products !== 'undefined') {
    const newDb = JSON.parse(localStorage.getItem('ruma_products_db'));
    products.length = 0;
    newDb.forEach(p => products.push(p));
  }

  // 2. Buat Tautan WhatsApp Finalisasi
  const transactionId = "RUMA-" + Date.now().toString().slice(-6);
  const name = document.getElementById('cust-name').value.trim();
  const phone = document.getElementById('cust-phone').value.trim();
  const address = document.getElementById('cust-address').value.trim();
  const city = document.getElementById('cust-city').value.trim();
  const zip = document.getElementById('cust-zip').value.trim();
  
  const shippingSelect = document.getElementById('shipping-service');
  const shipMethod = shippingSelect ? shippingSelect.value.toUpperCase() : "REGULER";
  
  const assemblyCheckbox = document.getElementById('assembly-service');
  const needAssembly = assemblyCheckbox && assemblyCheckbox.checked ? "YA" : "TIDAK";
  
  const selectedPayment = document.querySelector('input[name="payment-method"]:checked').value;

  let itemsText = '';
  cart.forEach(item => {
    const displayName = currentLang === 'en' ? (item.nama_en || item.nama) : item.nama;
    itemsText += `\n  - ${item.qty}x ${displayName} (${formatRupiah(item.harga * item.qty)})`;
  });

  const totalText = formatRupiah(grandTotal);

  const message = `*FINALISASI TRANSAKSI RUMA*
--------------------------------------------
Halo Tim RUMA, saya ingin menyelesaikan pemesanan produk furniture minimalis saya. Berikut adalah rincian data transaksi saya:

*ID Transaksi*: \`${transactionId}\`
*Nama Penerima*: ${name}
*No. Telepon*: ${phone}
*Alamat Kirim*: ${address}, ${city} (${zip})

*DETAIL PESANAN*:${itemsText}

*LAYANAN & PERAKITAN*
- Pengiriman: ${shipMethod}
- Jasa Perakitan: ${needAssembly}

*PEMBAYARAN & NOMINAL*
- Metode: ${selectedPayment.toUpperCase()}
- Total Bayar: *${totalText}*
--------------------------------------------
Mohon segera diproses dan diinformasikan resi pengirimannya. Terima kasih!`;

  const waUrl = `https://wa.me/6282130713915?text=${encodeURIComponent(message)}`;
  const simulatedResi = "RUMA-12345";
  const itemsNotifText = cart.map(item => `${item.qty}x ${currentLang === 'en' ? (item.nama_en || item.nama) : item.nama}`).join(', ');
  
  const notifTitle = `Checkout Berhasil: ${transactionId}`;
  const notifTitleEn = `Checkout Success: ${transactionId}`;
  
  const notifDesc = `Pesanan Anda berisi ${itemsNotifText} dengan total ${formatRupiah(grandTotal)} telah berhasil dipesan. Terima kasih telah berbelanja di RUMA.`;
  const notifDescEn = `Your order of ${itemsNotifText} with total of ${formatRupiah(grandTotal)} was successfully placed. Thank you for shopping at RUMA.`;

  if (typeof addNotification === 'function') {
    addNotification(notifTitle, notifTitleEn, notifDesc, notifDescEn, 'checkout');
  }

  // Clear shopping cart immediately so it updates the navbar and local storage right away
  if (typeof clearCart === 'function') {
    clearCart();
  }

  // 3. Render layar sukses pembayaran
  const modalBody = document.querySelector('.payment-modal-body');
  if (modalBody) {
    const successTitle = currentLang === 'en' ? 'Payment Successful!' : 'Pembayaran Berhasil!';
    const successDesc = currentLang === 'en' 
      ? 'Thank you for shopping at RUMA. Your order has been received. Please click the button below to send details via WhatsApp.' 
      : 'Terima kasih telah berbelanja di RUMA. Pesanan Anda telah kami terima. Silakan klik tombol di bawah untuk kirim detail data ke WhatsApp.';
    const waBtnText = currentLang === 'en' ? 'Confirm & Finalize via WhatsApp' : 'Kirim Detail & Finalisasi ke WhatsApp';
    const backBtnText = currentLang === 'en' ? 'Back to Home' : 'Kembali ke Beranda';

    modalBody.innerHTML = `
      <div class="success-screen" style="text-align: center; padding: 10px 0;">
        <span style="display:inline-flex; width:54px; height:54px; border-radius:50%; background-color:#2e7d32; color:white; align-items:center; justify-content:center; font-size:1.6rem; font-weight:bold; margin-bottom:12px;">✓</span>
        <h3 style="font-family: var(--font-heading); font-size: 1.45rem; margin-bottom: 6px;">${successTitle}</h3>
        <p style="font-size:0.8rem; color:var(--color-text-secondary); line-height: 1.4; margin-bottom: 20px;">${successDesc}</p>
        
        <!-- WhatsApp Message Preview -->
        <div style="background-color: var(--color-bg-secondary); border: 1px solid var(--color-border); border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: left;">
          <div style="font-size: 0.72rem; font-weight: 700; color: var(--color-text-secondary); text-transform: uppercase; letter-spacing: 0.5px; border-bottom: 1px solid var(--color-border); padding-bottom: 6px; margin-bottom: 10px; display: flex; align-items: center; gap: 4px; font-family: var(--font-body);">
            <span>📱</span> Pratinjau Pesan / Message Preview
          </div>
          <div style="font-family: monospace; font-size: 0.76rem; line-height: 1.45; color: var(--color-text-primary); white-space: pre-wrap; word-break: break-word; background: #fff; padding: 12px; border-radius: 4px; border: 1px solid var(--color-border); max-height: 140px; overflow-y: auto;">
${message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}
          </div>
        </div>

        <a href="${waUrl}" target="_blank" class="btn" style="background: linear-gradient(135deg, #25d366, #128c7e); color: white; display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; margin-bottom: 12px; font-weight: 700; border-radius: 6px; padding: 14px 16px; font-size:0.85rem; border:none; text-decoration:none; box-shadow: 0 4px 12px rgba(37,211,102,0.3); transition: transform 0.2s, box-shadow 0.2s; font-family: var(--font-body);" onmouseover="this.style.transform='scale(1.01)';" onmouseout="this.style.transform='scale(1)';">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.601 2.326A7.854 7.854 0 0 0 8 0a7.854 7.854 0 0 0-7.563 5.687C.4 8.512 1.514 11.56 3.59 13.64l-.591 2.459 2.53-.664c1.667.455 3.51.35 5.093-.244a7.86 7.86 0 0 0 4.96-5.28c.452-1.63.385-3.415-.381-4.965zM8 14.158c-1.258 0-2.486-.33-3.568-.956l-.256-.149-1.492.39.398-1.455-.164-.26a6.51 6.51 0 0 1-1.008-3.454 6.51 6.51 0 0 1 4.792-6.29 6.51 6.51 0 0 1 6.29 1.637c1.565 1.565 2.129 3.824 1.47 5.922a6.51 6.51 0 0 1-5.184 4.542 6.47 6.47 0 0 1-1.282.114z"/></svg>
          <span>${waBtnText}</span>
        </a>
        
        <button type="button" class="btn btn-secondary" onclick="finishCheckoutProcess()" style="width: 100%; padding: 12px; font-size:0.85rem; border-radius: 6px; font-family: var(--font-body);">${backBtnText}</button>
      </div>
    `;
  }
  
  const closeBtn = document.querySelector('.payment-modal-header button');
  if (closeBtn) closeBtn.style.display = 'none';
}

// 12. Selesai
function finishCheckoutProcess() {
  window.location.hash = '#home';
  closePaymentModal();
}

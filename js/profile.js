// Profile Page SPA JavaScript Logic

const profileTranslations = {
  id: {
    "profile-auth-required-title": "Akses Terbatas 🔒",
    "profile-auth-required-desc": "Silakan masuk ke akun Anda terlebih dahulu untuk melihat informasi profil.",
    "profile-details-title": "Informasi Akun 👤",
    "profile-save-btn": "Simpan Perubahan ✔",
    "profile-history-title": "Riwayat Aktivitas & Transaksi 📜",
    "profile-empty-history": "Belum ada riwayat transaksi. Silakan checkout produk pilihan Anda!",
    "profile-empty-cta": "Mulai Belanja Sekarang",
    "profile-updated-toast": "Profil berhasil diperbarui!"
  },
  en: {
    "profile-auth-required-title": "Access Restricted 🔒",
    "profile-auth-required-desc": "Please login to your account first to access profile details.",
    "profile-details-title": "Account Information 👤",
    "profile-save-btn": "Save Changes ✔",
    "profile-history-title": "Activity & Transaction History 📜",
    "profile-empty-history": "No transactions found yet. Please checkout some items!",
    "profile-empty-cta": "Start Shopping Now",
    "profile-updated-toast": "Profile updated successfully!"
  }
};

// Hook window.setLanguage to update profile page details dynamically
const originalSetLanguage = window.setLanguage;
if (typeof originalSetLanguage === 'function') {
  window.setLanguage = function(lang) {
    originalSetLanguage(lang);
    if (typeof loadProfilePage === 'function') {
      loadProfilePage();
    }
  };
}

function loadProfilePage() {
  const unauthDiv = document.getElementById('profile-unauthorized');
  const authDiv = document.getElementById('profile-authorized');

  if (!currentUser) {
    if (unauthDiv) unauthDiv.style.display = 'block';
    if (authDiv) authDiv.style.display = 'none';
    return;
  }

  if (unauthDiv) unauthDiv.style.display = 'none';
  if (authDiv) authDiv.style.display = 'grid';

  // Set user values in fields
  const usernameInput = document.getElementById('prof-username');
  const emailInput = document.getElementById('prof-email');
  if (usernameInput) usernameInput.value = currentUser.name || '';
  if (emailInput) emailInput.value = currentUser.email || '';
  
  const initials = currentUser.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'U';
  const avatarEl = document.getElementById('avatar-initials');
  const nameEl = document.getElementById('card-fullname');
  if (avatarEl) avatarEl.textContent = initials;
  if (nameEl) nameEl.textContent = currentUser.name;

  const roleBadge = document.getElementById('card-role');
  const custFields = document.getElementById('prof-cust-fields');

  if (roleBadge) {
    if (currentUser.role === 'admin') {
      roleBadge.textContent = 'Administrator';
      roleBadge.className = 'profile-badge badge-admin';
      if (custFields) custFields.style.display = 'none';
      
      const historyCard = document.getElementById('profile-history-card');
      if (historyCard) historyCard.style.display = 'none';
      
      const adminCard = document.getElementById('profile-admin-card');
      if (adminCard) {
        adminCard.style.display = 'block';
        if (typeof renderAdminDashboardProfile === 'function') {
          renderAdminDashboardProfile();
        }
      }
    } else {
      roleBadge.textContent = 'Customer';
      roleBadge.className = 'profile-badge badge-user';
      if (custFields) custFields.style.display = 'grid';
      
      const phoneInput = document.getElementById('prof-phone');
      const addressInput = document.getElementById('prof-address');
      if (phoneInput) phoneInput.value = currentUser.phone || '';
      if (addressInput) addressInput.value = currentUser.address || '';
      
      const historyCard = document.getElementById('profile-history-card');
      if (historyCard) historyCard.style.display = 'block';
      
      const adminCard = document.getElementById('profile-admin-card');
      if (adminCard) adminCard.style.display = 'none';
      
      renderProfileHistory();
    }
  }

  // Load translations specific to this page
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'id';
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (profileTranslations[lang] && profileTranslations[lang][key]) {
      el.textContent = profileTranslations[lang][key];
    }
  });
}

function renderProfileHistory() {
  const historyContainer = document.getElementById('history-box');
  if (!historyContainer) return;

  const lang = typeof currentLang !== 'undefined' ? currentLang : 'id';
  const emptyText = profileTranslations[lang]["profile-empty-history"];
  const ctaText = profileTranslations[lang]["profile-empty-cta"];

  const notifs = JSON.parse(localStorage.getItem(getNotificationKey())) || [];
  const orderNotifs = notifs.filter(n => n.type === 'checkout');

  if (orderNotifs.length === 0) {
    historyContainer.innerHTML = `
      <div class="empty-history-box">
        <span style="font-size: 2.5rem; display: block; margin-bottom: 12px;">🛒</span>
        <p style="font-size: 0.85rem; color: var(--color-text-secondary); margin-bottom: 16px;">${emptyText}</p>
        <a href="#catalog" class="btn btn-secondary" style="font-size: 0.8rem; padding: 8px 16px;">${ctaText}</a>
      </div>
    `;
    return;
  }

  let html = '';
  orderNotifs.forEach(o => {
    const title = lang === 'en' ? (o.title_en || o.title) : o.title;
    const desc = lang === 'en' ? (o.content_en || o.content) : o.content;
    const dateObj = new Date(o.timestamp);
    const dateStr = dateObj.toLocaleDateString(lang === 'en' ? 'en-US' : 'id-ID', { year: 'numeric', month: 'long', day: 'numeric' });

    html += `
      <div style="border: 1px solid var(--color-border); border-radius: 6px; padding: 16px; margin-bottom: 12px; background-color: var(--color-bg-secondary);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px dashed var(--color-border); padding-bottom: 8px; margin-bottom: 10px;">
          <strong style="font-size: 0.85rem; color: var(--color-accent);">${title}</strong>
          <span style="font-size: 0.72rem; color: var(--color-text-secondary);">${dateStr}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--color-text-primary); margin: 0; line-height: 1.4;">${desc}</p>
      </div>
    `;
  });

  historyContainer.innerHTML = html;
}

function saveProfileChanges(event) {
  event.preventDefault();
  if (!currentUser) return;

  const usernameInput = document.getElementById('prof-username');
  const emailInput = document.getElementById('prof-email');
  const username = usernameInput ? usernameInput.value.trim() : '';
  const email = emailInput ? emailInput.value.trim() : '';

  currentUser.name = username;
  currentUser.email = email;

  if (currentUser.role !== 'admin') {
    const phoneInput = document.getElementById('prof-phone');
    const addressInput = document.getElementById('prof-address');
    currentUser.phone = phoneInput ? phoneInput.value.trim() : '';
    currentUser.address = addressInput ? addressInput.value.trim() : '';
  }

  localStorage.setItem('ruma_user', JSON.stringify(currentUser));
  
  loadProfilePage();
  if (typeof updateNavbarUserUI === 'function') {
    updateNavbarUserUI();
  }
  
  const lang = typeof currentLang !== 'undefined' ? currentLang : 'id';
  const successMsg = profileTranslations[lang]["profile-updated-toast"];
  showToast(successMsg, 'success');
  trackGAEvent('Update Profil', currentUser.name);
}

/**
 * Main Integration Script (js/main.js)
 * Menghubungkan modul Notes Management (Developer 1) dan Notes Organization (Developer 2)
 * serta mengelola interaksi DOM, state aplikasi, modal, dan notifikasi.
 */

import {
  STORAGE_KEY,
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  togglePinned,
  toggleFavorite,
  getNoteById,
  validateNoteData
} from './notes.js';

import {
  searchNotes,
  filterByCategory,
  filterFavorites,
  sortNotes
} from './organization.js';

// State aplikasi
const appState = {
  searchQuery: '',
  selectedCategory: 'All',
  favoritesOnly: false,
  sortBy: 'newest',
  noteToDeleteId: null,
  currentDetailId: null
};

// Elemen DOM
const dom = {
  notesGrid: document.getElementById('notes-grid'),
  emptyState: document.getElementById('empty-state'),
  emptyStateTitle: document.getElementById('empty-state-title'),
  emptyStateDesc: document.getElementById('empty-state-desc'),
  btnEmptyCreate: document.getElementById('btn-empty-create'),
  notesCount: document.getElementById('notes-count'),

  // Organization controls
  searchInput: document.getElementById('search-input'),
  categoryFilters: document.getElementById('category-filters'),
  btnFilterFavorite: document.getElementById('btn-filter-favorite'),
  sortSelect: document.getElementById('sort-select'),

  // Create button
  btnCreateNote: document.getElementById('btn-create-note'),

  // Form Modal
  modalForm: document.getElementById('modal-note-form'),
  formModalTitle: document.getElementById('form-modal-title'),
  noteForm: document.getElementById('note-form'),
  inputNoteId: document.getElementById('note-id'),
  inputTitle: document.getElementById('note-title'),
  inputCategory: document.getElementById('note-category'),
  inputContent: document.getElementById('note-content'),
  errorTitle: document.getElementById('error-title'),
  errorCategory: document.getElementById('error-category'),
  errorContent: document.getElementById('error-content'),

  // Detail Modal
  modalDetail: document.getElementById('modal-note-detail'),
  detailTitle: document.getElementById('detail-title'),
  detailCategory: document.getElementById('detail-category'),
  detailCreated: document.getElementById('detail-created'),
  detailUpdated: document.getElementById('detail-updated'),
  detailContent: document.getElementById('detail-content'),
  btnDetailEdit: document.getElementById('btn-detail-edit'),

  // Delete Modal
  modalDelete: document.getElementById('modal-delete-confirm'),
  deleteNoteTitle: document.getElementById('delete-note-title'),
  btnConfirmDelete: document.getElementById('btn-confirm-delete'),

  // Toast
  toastContainer: document.getElementById('toast-container')
};

/**
 * Menampilkan notifikasi toast singkat.
 */
function showToast(message, type = 'default') {
  const toast = document.createElement('div');
  toast.className = `toast ${type !== 'default' ? `toast-${type}` : ''}`;
  toast.textContent = message;
  dom.toastContainer.appendChild(toast);

  // Trigger transition
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 250);
  }, 3000);
}

/**
 * Memeriksa integritas LocalStorage saat aplikasi pertama kali dimuat (FR-10).
 */
function checkLocalStorageIntegrity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        showToast('Format data catatan tidak valid. Menggunakan data kosong.', 'error');
      }
    }
  } catch (err) {
    showToast('Data tersimpan rusak dan tidak dapat dibaca. Menggunakan data kosong.', 'error');
  }
}

/**
 * Format tanggal ISO ke format lokal Indonesia yang mudah dibaca.
 */
function formatDate(isoString) {
  if (!isoString) return '-';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Escape HTML untuk mencegah XSS saat merender konten catatan.
 */
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

/**
 * Mendapatkan class CSS badge berdasarkan kategori.
 */
function getCategoryBadgeClass(category) {
  const map = {
    Personal: 'badge-personal',
    Work: 'badge-work',
    Study: 'badge-study',
    Other: 'badge-other'
  };
  return map[category] || 'badge-other';
}

/**
 * Merender daftar catatan sesuai state filter, pencarian, dan sorting saat ini.
 */
function renderNotes() {
  const allNotes = getNotes();

  // Terapkan pipeline modul organization
  let processed = searchNotes(allNotes, appState.searchQuery);
  processed = filterByCategory(processed, appState.selectedCategory);
  processed = filterFavorites(processed, appState.favoritesOnly);
  processed = sortNotes(processed, appState.sortBy);

  // Update jumlah catatan
  dom.notesCount.textContent = `${processed.length} dari ${allNotes.length} catatan`;

  // Bersihkan grid
  dom.notesGrid.innerHTML = '';

  if (processed.length === 0) {
    dom.emptyState.classList.add('is-visible');
    if (allNotes.length === 0) {
      dom.emptyStateTitle.textContent = 'Belum Ada Catatan';
      dom.emptyStateDesc.textContent = 'Mulai mencatat ide, pekerjaan, atau daftar kegiatan Anda dengan mudah sekarang.';
      dom.btnEmptyCreate.style.display = 'inline-flex';
    } else {
      dom.emptyStateTitle.textContent = 'Tidak Ada Catatan yang Sesuai';
      dom.emptyStateDesc.textContent = 'Coba ubah kata kunci pencarian atau filter kategori/favorit Anda.';
      dom.btnEmptyCreate.style.display = 'none';
    }
    return;
  }

  dom.emptyState.classList.remove('is-visible');

  const fragment = document.createDocumentFragment();
  processed.forEach(note => {
    const card = document.createElement('article');
    card.className = `note-card ${note.isPinned ? 'is-pinned' : ''}`;
    card.dataset.id = note.id;

    const badgeClass = getCategoryBadgeClass(note.category);
    const pinActiveClass = note.isPinned ? 'active-pin' : '';
    const favActiveClass = note.isFavorite ? 'active-fav' : '';

    card.innerHTML = `
      <div class="note-card-header">
        <span class="note-badge ${badgeClass}">${escapeHtml(note.category)}</span>
        <div class="note-card-badges">
          <button 
            type="button" 
            class="btn-icon-toggle ${pinActiveClass}" 
            data-action="pin" 
            title="${note.isPinned ? 'Lepas Pin' : 'Pin Catatan'}"
            aria-label="${note.isPinned ? 'Lepas Pin' : 'Pin Catatan'}"
          >
            📌
          </button>
          <button 
            type="button" 
            class="btn-icon-toggle ${favActiveClass}" 
            data-action="favorite" 
            title="${note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}"
            aria-label="${note.isFavorite ? 'Hapus dari Favorit' : 'Tandai Favorit'}"
          >
            ${note.isFavorite ? '⭐' : '☆'}
          </button>
        </div>
      </div>

      <div class="note-card-body" data-action="detail">
        <h3 class="note-title">${escapeHtml(note.title)}</h3>
        <p class="note-snippet">${escapeHtml(note.content)}</p>
      </div>

      <div class="note-card-footer">
        <span class="note-date" title="Terakhir diperbarui">${formatDate(note.updatedAt)}</span>
        <div class="note-actions">
          <button type="button" class="btn-action btn-action-edit" data-action="edit">Edit</button>
          <button type="button" class="btn-action btn-action-delete" data-action="delete">Hapus</button>
        </div>
      </div>
    `;

    fragment.appendChild(card);
  });

  dom.notesGrid.appendChild(fragment);
}

/* ==========================================================================
   Manajemen Modal
   ========================================================================== */

function openModal(modalEl) {
  modalEl.classList.add('active');
}

function closeModal(modalEl) {
  modalEl.classList.remove('active');
}

function closeAllModals() {
  closeModal(dom.modalForm);
  closeModal(dom.modalDetail);
  closeModal(dom.modalDelete);
}

function clearFormErrors() {
  dom.inputTitle.classList.remove('is-invalid');
  dom.inputContent.classList.remove('is-invalid');
  dom.errorTitle.classList.remove('show');
  dom.errorCategory.classList.remove('show');
  dom.errorContent.classList.remove('show');
}

function openCreateModal() {
  clearFormErrors();
  dom.noteForm.reset();
  dom.inputNoteId.value = '';
  dom.inputCategory.value = 'Personal';
  dom.formModalTitle.textContent = 'Tambah Catatan Baru';
  openModal(dom.modalForm);
  dom.inputTitle.focus();
}

function openEditModal(id) {
  const note = getNoteById(id);
  if (!note) {
    showToast('Catatan tidak ditemukan.', 'error');
    return;
  }

  clearFormErrors();
  dom.inputNoteId.value = note.id;
  dom.inputTitle.value = note.title;
  dom.inputCategory.value = note.category;
  dom.inputContent.value = note.content;
  dom.formModalTitle.textContent = 'Edit Catatan';
  openModal(dom.modalForm);
  dom.inputTitle.focus();
}

function openDetailModal(id) {
  const note = getNoteById(id);
  if (!note) {
    showToast('Catatan tidak ditemukan.', 'error');
    return;
  }

  appState.currentDetailId = note.id;
  dom.detailTitle.textContent = note.title;
  dom.detailCategory.textContent = note.category;
  dom.detailCategory.className = `note-badge ${getCategoryBadgeClass(note.category)}`;
  dom.detailCreated.textContent = `Dibuat: ${formatDate(note.createdAt)}`;
  dom.detailUpdated.textContent = `Diperbarui: ${formatDate(note.updatedAt)}`;
  dom.detailContent.textContent = note.content;
  openModal(dom.modalDetail);
}

function openDeleteModal(id) {
  const note = getNoteById(id);
  if (!note) {
    showToast('Catatan tidak ditemukan.', 'error');
    return;
  }

  appState.noteToDeleteId = note.id;
  dom.deleteNoteTitle.textContent = note.title;
  openModal(dom.modalDelete);
}

/* ==========================================================================
   Event Listeners
   ========================================================================== */

function initEventListeners() {
  // Tombol Buat Catatan
  dom.btnCreateNote.addEventListener('click', openCreateModal);
  dom.btnEmptyCreate.addEventListener('click', openCreateModal);

  // Tutup modal lewat tombol close atau klik overlay
  document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal-overlay');
      if (modal) closeModal(modal);
    });
  });

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        closeModal(overlay);
      }
    });
  });

  // Tutup modal dengan tombol ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
    }
  });

  // Hapus pesan error saat mengetik
  dom.inputTitle.addEventListener('input', () => {
    if (dom.inputTitle.value.trim()) {
      dom.inputTitle.classList.remove('is-invalid');
      dom.errorTitle.classList.remove('show');
    }
  });

  dom.inputContent.addEventListener('input', () => {
    if (dom.inputContent.value.trim()) {
      dom.inputContent.classList.remove('is-invalid');
      dom.errorContent.classList.remove('show');
    }
  });

  // Submit form Tambah / Edit
  dom.noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearFormErrors();

    const noteData = {
      title: dom.inputTitle.value,
      category: dom.inputCategory.value,
      content: dom.inputContent.value
    };

    const validation = validateNoteData(noteData);
    if (!validation.isValid) {
      if (validation.errors.title) {
        dom.inputTitle.classList.add('is-invalid');
        dom.errorTitle.textContent = validation.errors.title;
        dom.errorTitle.classList.add('show');
      }
      if (validation.errors.content) {
        dom.inputContent.classList.add('is-invalid');
        dom.errorContent.textContent = validation.errors.content;
        dom.errorContent.classList.add('show');
      }
      if (validation.errors.category) {
        dom.errorCategory.textContent = validation.errors.category;
        dom.errorCategory.classList.add('show');
      }
      return;
    }

    const editId = dom.inputNoteId.value;
    try {
      if (editId) {
        updateNote(editId, noteData);
        showToast('Catatan berhasil diperbarui.', 'success');
      } else {
        createNote(noteData);
        showToast('Catatan baru berhasil dibuat.', 'success');
      }
      closeModal(dom.modalForm);
      renderNotes();
    } catch (error) {
      showToast(error.message || 'Gagal menyimpan catatan.', 'error');
    }
  });

  // Tombol Edit dari dalam Modal Detail
  dom.btnDetailEdit.addEventListener('click', () => {
    if (appState.currentDetailId) {
      const id = appState.currentDetailId;
      closeModal(dom.modalDetail);
      openEditModal(id);
    }
  });

  // Konfirmasi Hapus
  dom.btnConfirmDelete.addEventListener('click', () => {
    if (!appState.noteToDeleteId) return;

    const deleted = deleteNote(appState.noteToDeleteId);
    closeModal(dom.modalDelete);
    appState.noteToDeleteId = null;

    if (deleted) {
      showToast('Catatan berhasil dihapus.', 'success');
      renderNotes();
    } else {
      showToast('Gagal menghapus catatan.', 'error');
    }
  });

  // Delegasi event pada kartu catatan (Pin, Favorite, Edit, Delete, Detail)
  dom.notesGrid.addEventListener('click', (e) => {
    const card = e.target.closest('.note-card');
    if (!card) return;

    const id = card.dataset.id;
    const actionTarget = e.target.closest('[data-action]');
    const action = actionTarget ? actionTarget.dataset.action : 'detail';

    try {
      if (action === 'pin') {
        const updated = togglePinned(id);
        showToast(updated.isPinned ? 'Catatan disematkan di atas.' : 'Pin dilepas.');
        renderNotes();
      } else if (action === 'favorite') {
        const updated = toggleFavorite(id);
        showToast(updated.isFavorite ? 'Ditambahkan ke favorit.' : 'Dihapus dari favorit.');
        renderNotes();
      } else if (action === 'edit') {
        openEditModal(id);
      } else if (action === 'delete') {
        openDeleteModal(id);
      } else {
        openDetailModal(id);
      }
    } catch (error) {
      showToast(error.message, 'error');
    }
  });

  // Organization: Pencarian live
  dom.searchInput.addEventListener('input', (e) => {
    appState.searchQuery = e.target.value;
    renderNotes();
  });

  // Organization: Filter kategori
  dom.categoryFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-btn');
    if (!btn) return;

    dom.categoryFilters.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    appState.selectedCategory = btn.dataset.category;
    renderNotes();
  });

  // Organization: Filter favorit
  dom.btnFilterFavorite.addEventListener('click', () => {
    appState.favoritesOnly = !appState.favoritesOnly;
    dom.btnFilterFavorite.classList.toggle('active', appState.favoritesOnly);
    dom.btnFilterFavorite.setAttribute('aria-pressed', String(appState.favoritesOnly));
    renderNotes();
  });

  // Organization: Sorting
  dom.sortSelect.addEventListener('change', (e) => {
    appState.sortBy = e.target.value;
    renderNotes();
  });
}

// Inisialisasi Aplikasi
document.addEventListener('DOMContentLoaded', () => {
  checkLocalStorageIntegrity();
  initEventListeners();
  renderNotes();
});

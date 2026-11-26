/**
 * Modul Notes Organization (Developer 2)
 * Bertanggung jawab atas pencarian, penyaringan (kategori, favorit), dan pengurutan catatan.
 * Sesuai dengan spesifikasi PRD (FR-05, FR-06, FR-07, FR-08, FR-09).
 */

/**
 * Mencari catatan berdasarkan judul atau isi catatan (case-insensitive).
 * Mendukung pencarian aman saat field bernilai null/undefined atau array kosong.
 * @param {Array<Object>} notes
 * @param {string} query
 * @returns {Array<Object>}
 */
export function searchNotes(notes, query) {
  if (!Array.isArray(notes)) {
    return [];
  }
  if (!query || typeof query !== 'string' || !query.trim()) {
    return notes;
  }
  const q = query.toLowerCase().trim();
  return notes.filter(note => {
    if (!note) return false;
    const titleMatch = typeof note.title === 'string' && note.title.toLowerCase().includes(q);
    const contentMatch = typeof note.content === 'string' && note.content.toLowerCase().includes(q);
    return titleMatch || contentMatch;
  });
}

/**
 * Memfilter catatan berdasarkan kategori.
 * @param {Array<Object>} notes
 * @param {string} category
 * @returns {Array<Object>}
 */
export function filterByCategory(notes, category) {
  if (!Array.isArray(notes)) {
    return [];
  }
  if (!category || category === 'All' || category === 'all') {
    return notes;
  }
  return notes.filter(note => note && typeof note.category === 'string' && note.category.toLowerCase() === category.toLowerCase());
}

/**
 * Memfilter catatan yang ditandai sebagai favorit.
 * @param {Array<Object>} notes
 * @param {boolean} enabled
 * @returns {Array<Object>}
 */
export function filterFavorites(notes, enabled) {
  if (!Array.isArray(notes)) {
    return [];
  }
  if (!enabled) {
    return notes;
  }
  return notes.filter(note => Boolean(note && note.isFavorite));
}

/**
 * Mengurutkan catatan berdasarkan kriteria tertentu.
 * Catatan yang di-pin tetap berada di bagian paling atas;
 * sorting diterapkan di dalam kelompok catatan pinned dan non-pinned.
 * 
 * Pilihan sortBy:
 * - 'newest' (Terbaru diperbarui)
 * - 'oldest' (Terlama diperbarui)
 * - 'title-asc' (Judul A-Z)
 * - 'title-desc' (Judul Z-A)
 * 
 * @param {Array<Object>} notes
 * @param {string} sortBy
 * @returns {Array<Object>}
 */
export function sortNotes(notes, sortBy = 'newest') {
  if (!Array.isArray(notes)) {
    return [];
  }
  const list = [...notes].filter(Boolean);
  const pinned = list.filter(n => Boolean(n.isPinned));
  const unpinned = list.filter(n => !n.isPinned);

  const compareFn = (a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
      case 'title-asc':
        return (a.title || '').localeCompare(b.title || '', undefined, { sensitivity: 'base' });
      case 'title-desc':
        return (b.title || '').localeCompare(a.title || '', undefined, { sensitivity: 'base' });
      case 'newest':
      default:
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    }
  };

  pinned.sort(compareFn);
  unpinned.sort(compareFn);

  return [...pinned, ...unpinned];
}

/**
 * Modul Notes Management (Developer 1)
 * Bertanggung jawab atas pengelolaan data catatan dan LocalStorage.
 */

export const STORAGE_KEY = 'notes_app_data';

export const VALID_CATEGORIES = ['Personal', 'Work', 'Study', 'Other'];

/**
 * Validasi data input catatan.
 * Judul dan isi wajib diisi (tidak boleh kosong atau hanya spasi).
 * @param {Object} noteData
 * @returns {{ isValid: boolean, errors: { title?: string, content?: string, category?: string } }}
 */
export function validateNoteData(noteData) {
  const errors = {};

  if (!noteData || typeof noteData.title !== 'string' || !noteData.title.trim()) {
    errors.title = 'Judul catatan wajib diisi.';
  }

  if (!noteData || typeof noteData.content !== 'string' || !noteData.content.trim()) {
    errors.content = 'Isi catatan wajib diisi.';
  }

  if (noteData && noteData.category && !VALID_CATEGORIES.includes(noteData.category)) {
    errors.category = `Kategori harus salah satu dari: ${VALID_CATEGORIES.join(', ')}.`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Mengambil semua catatan dari LocalStorage.
 * Menangani error jika data corrupt/tidak valid dan fallback ke array kosong.
 * @returns {Array<Object>}
 */
export function getNotes() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    const parsed = JSON.parse(rawData);
    if (!Array.isArray(parsed)) {
      console.warn('Data LocalStorage tidak berupa array. Menggunakan data kosong sebagai fallback.');
      return [];
    }
    return parsed;
  } catch (error) {
    console.error('Gagal membaca data dari LocalStorage:', error);
    return [];
  }
}

/**
 * Menyimpan array catatan ke LocalStorage.
 * @param {Array<Object>} notes
 * @returns {boolean}
 */
function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    return true;
  } catch (error) {
    console.error('Gagal menyimpan data ke LocalStorage:', error);
    return false;
  }
}

/**
 * Membuat catatan baru.
 * @param {Object} noteData - { title, content, category }
 * @returns {Object} Catatan baru yang dibuat
 * @throws {Error} Jika validasi gagal
 */
export function createNote(noteData) {
  const validation = validateNoteData(noteData);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError);
  }

  const notes = getNotes();
  const now = new Date().toISOString();
  const category = (noteData.category && VALID_CATEGORIES.includes(noteData.category))
    ? noteData.category
    : 'Personal';

  const newNote = {
    id: 'note_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
    title: noteData.title.trim(),
    content: noteData.content.trim(),
    category: category,
    isPinned: false,
    isFavorite: false,
    createdAt: now,
    updatedAt: now
  };

  notes.unshift(newNote);
  saveNotes(notes);
  return newNote;
}

/**
 * Memperbarui catatan yang sudah ada.
 * @param {string} id
 * @param {Object} noteData - { title, content, category }
 * @returns {Object} Catatan yang sudah diperbarui
 * @throws {Error} Jika catatan tidak ditemukan atau validasi gagal
 */
export function updateNote(id, noteData) {
  const validation = validateNoteData(noteData);
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0];
    throw new Error(firstError);
  }

  const notes = getNotes();
  const index = notes.findIndex(n => n.id === id);

  if (index === -1) {
    throw new Error(`Catatan dengan ID "${id}" tidak ditemukan.`);
  }

  const existingNote = notes[index];
  const category = (noteData.category && VALID_CATEGORIES.includes(noteData.category))
    ? noteData.category
    : existingNote.category;

  const updatedNote = {
    ...existingNote,
    title: noteData.title.trim(),
    content: noteData.content.trim(),
    category: category,
    updatedAt: new Date().toISOString()
  };

  notes[index] = updatedNote;
  saveNotes(notes);
  return updatedNote;
}

/**
 * Menghapus catatan berdasarkan ID.
 * @param {string} id
 * @returns {boolean} True jika berhasil dihapus
 */
export function deleteNote(id) {
  const notes = getNotes();
  const filtered = notes.filter(n => n.id !== id);

  if (filtered.length === notes.length) {
    return false;
  }

  saveNotes(filtered);
  return true;
}

/**
 * Melakukan toggle status Pinned pada catatan.
 * @param {string} id
 * @returns {Object} Catatan yang diperbarui
 */
export function togglePinned(id) {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);

  if (!note) {
    throw new Error(`Catatan dengan ID "${id}" tidak ditemukan.`);
  }

  note.isPinned = !note.isPinned;
  note.updatedAt = new Date().toISOString();

  saveNotes(notes);
  return note;
}

/**
 * Melakukan toggle status Favorite pada catatan.
 * @param {string} id
 * @returns {Object} Catatan yang diperbarui
 */
export function toggleFavorite(id) {
  const notes = getNotes();
  const note = notes.find(n => n.id === id);

  if (!note) {
    throw new Error(`Catatan dengan ID "${id}" tidak ditemukan.`);
  }

  note.isFavorite = !note.isFavorite;
  note.updatedAt = new Date().toISOString();

  saveNotes(notes);
  return note;
}

/**
 * Mengambil catatan tunggal berdasarkan ID.
 * @param {string} id
 * @returns {Object|null}
 */
export function getNoteById(id) {
  const notes = getNotes();
  return notes.find(n => n.id === id) || null;
}

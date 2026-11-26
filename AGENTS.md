# Product Requirements Document (PRD)

## Notes App

**Versi:** 1.0\
**Status:** Draft\
**Platform:** Web\
**Teknologi:** HTML, CSS, Vanilla JavaScript, LocalStorage

------------------------------------------------------------------------

## 1. Ringkasan Produk

Notes App adalah aplikasi web sederhana untuk membuat, mengelola, dan
mengorganisasi catatan pribadi. Aplikasi berjalan sepenuhnya di browser
tanpa backend, database eksternal, maupun API.

Data catatan disimpan menggunakan `localStorage`, sehingga catatan tetap
tersedia ketika halaman dimuat ulang pada browser dan perangkat yang
sama.

Project ini juga dirancang sebagai latihan kolaborasi Git untuk dua
developer. Pekerjaan dibagi berdasarkan modul fitur agar kedua developer
dapat mengembangkan fitur secara paralel.

## 2. Tujuan Produk

-   Memudahkan pengguna membuat dan mengelola catatan.
-   Menyediakan pencarian, kategori, pin, favorite, dan pengurutan
    catatan.
-   Menyimpan data secara lokal di browser.
-   Menjadi project kolaborasi untuk mempraktikkan branch, commit, Pull
    Request, code review, dan merge.

## 3. Target Pengguna

Pengguna umum yang membutuhkan aplikasi catatan pribadi sederhana untuk
menyimpan ide, daftar, atau informasi singkat.

## 4. Ruang Lingkup

### 4.1 Fitur yang termasuk (In Scope)

1.  Membuat catatan.
2.  Melihat daftar catatan.
3.  Melihat detail catatan.
4.  Mengedit catatan.
5.  Menghapus catatan.
6.  Mencari catatan berdasarkan judul atau isi.
7.  Mengelompokkan catatan berdasarkan kategori.
8.  Pin dan unpin catatan.
9.  Menandai dan membatalkan favorite.
10. Mengurutkan catatan.
11. Menyimpan data menggunakan LocalStorage.

### 4.2 Fitur yang tidak termasuk (Out of Scope)

-   Registrasi dan login pengguna.
-   Sinkronisasi data antarperangkat.
-   Penyimpanan cloud atau backend.
-   Kolaborasi dan berbagi catatan antar pengguna.
-   Integrasi API pihak ketiga.
-   Upload lampiran atau gambar.
-   Editor teks kaya (rich text editor).

## 5. Kebutuhan Fungsional

### FR-01 --- Membuat Catatan

-   Pengguna dapat membuat catatan baru.
-   Catatan memiliki judul, isi, dan kategori.
-   Judul wajib diisi.
-   Isi catatan boleh kosong atau wajib diisi sesuai keputusan
    implementasi tim; rekomendasi: isi juga wajib diisi.
-   Sistem membuat ID unik serta waktu pembuatan dan pembaruan.
-   Catatan baru disimpan ke LocalStorage.

### FR-02 --- Melihat Catatan

-   Aplikasi menampilkan daftar catatan yang tersimpan.
-   Setiap item menampilkan judul, cuplikan isi, kategori, dan informasi
    tanggal.
-   Pengguna dapat membuka catatan untuk melihat detailnya.
-   Jika belum ada catatan, aplikasi menampilkan empty state.

### FR-03 --- Mengedit Catatan

-   Pengguna dapat membuka catatan yang sudah ada dan mengubah judul,
    isi, atau kategori.
-   Sistem memperbarui `updatedAt`.
-   Perubahan disimpan ke LocalStorage.

### FR-04 --- Menghapus Catatan

-   Pengguna dapat menghapus catatan.
-   Aplikasi meminta konfirmasi sebelum penghapusan.
-   Setelah dikonfirmasi, catatan dihapus dari daftar dan LocalStorage.

### FR-05 --- Mencari Catatan

-   Pengguna dapat mencari berdasarkan judul atau isi catatan.
-   Hasil pencarian diperbarui saat pengguna mengetik.
-   Pencarian tidak membedakan huruf besar dan kecil.
-   Pencarian dapat digunakan bersamaan dengan filter dan sorting.

### FR-06 --- Filter Kategori

-   Pengguna dapat menampilkan semua catatan atau catatan dari kategori
    tertentu.
-   Kategori awal yang disediakan: `Personal`, `Work`, `Study`, dan
    `Other`.
-   Filter kategori dapat digunakan bersamaan dengan pencarian.

### FR-07 --- Pin Catatan

-   Pengguna dapat melakukan pin atau unpin pada catatan.
-   Catatan yang di-pin ditampilkan pada bagian atas daftar.
-   Status pin disimpan di LocalStorage.

### FR-08 --- Favorite Catatan

-   Pengguna dapat menandai atau membatalkan tanda favorite.
-   Pengguna dapat memfilter daftar untuk menampilkan catatan favorite.
-   Status favorite disimpan di LocalStorage.

### FR-09 --- Sorting

Pengguna dapat mengurutkan catatan berdasarkan:

-   Terbaru diperbarui.
-   Terlama diperbarui.
-   Judul A--Z.
-   Judul Z--A.

Catatan yang di-pin tetap berada di bagian atas; sorting diterapkan di
dalam kelompok catatan pinned dan non-pinned.

### FR-10 --- Penyimpanan Lokal

-   Aplikasi menggunakan browser `localStorage`.
-   Data dimuat saat aplikasi dibuka.
-   Setiap perubahan data disimpan ke LocalStorage.
-   Aplikasi menangani kondisi ketika belum ada data tersimpan.
-   Jika data tersimpan tidak dapat dibaca atau formatnya tidak valid,
    aplikasi tidak boleh berhenti tanpa penjelasan; tampilkan pesan yang
    sesuai dan gunakan data kosong sebagai fallback.

## 6. Kebutuhan Non-Fungsional

-   Aplikasi harus berjalan pada browser modern.
-   Tampilan harus responsif untuk desktop dan perangkat mobile.
-   Tidak menggunakan framework JavaScript atau CSS.
-   Tidak menggunakan backend, database eksternal, maupun API.
-   Kode JavaScript dipisah ke dalam modul sesuai tanggung jawab.
-   Antarmuka mudah dipahami dan konsisten.
-   Data hanya tersedia pada browser dan origin tempat data disimpan.

## 7. Model Data

Setiap catatan menggunakan struktur data berikut:

``` javascript
{
  id: "unique-id",
  title: "Meeting Notes",
  content: "Discuss project requirements...",
  category: "Work",
  isPinned: false,
  isFavorite: false,
  createdAt: "2026-11-26T10:00:00.000Z",
  updatedAt: "2026-11-26T10:00:00.000Z"
}
```

### Ketentuan Data

  Field          Tipe        Wajib Keterangan
  -------------- --------- ------- ----------------------------------
  `id`           String         Ya ID unik catatan
  `title`        String         Ya Judul catatan
  `content`      String         Ya Isi catatan
  `category`     String         Ya Kategori catatan
  `isPinned`     Boolean        Ya Status pin
  `isFavorite`   Boolean        Ya Status favorite
  `createdAt`    String         Ya Waktu pembuatan dalam format ISO
  `updatedAt`    String         Ya Waktu pembaruan dalam format ISO

Nama key LocalStorage yang disepakati: `notes_app_data`.

## 8. Pembagian Tugas Tim

### Developer 1 --- Notes Management

Bertanggung jawab atas proses inti pengelolaan catatan.

**Fitur:** - Create note. - Read/list notes dan detail note. - Update
note. - Delete note. - Validasi form. - Integrasi penyimpanan dan
pembacaan LocalStorage.

**File utama:**

``` text
js/notes.js
css/notes.css
```

### Developer 2 --- Notes Organization

Bertanggung jawab atas fitur untuk mencari dan mengorganisasi catatan.

**Fitur:** - Search berdasarkan judul dan isi. - Filter kategori. -
Filter favorite. - Pin dan unpin. - Sorting catatan. - Tampilan kontrol
pencarian dan pengorganisasian.

**File utama:**

``` text
js/organization.js
css/organization.css
```

### File Integrasi Bersama

File berikut disiapkan sebagai fondasi dan kontraknya disepakati sebelum
kedua developer mulai bekerja:

``` text
index.html
css/main.css
js/main.js
```

Untuk menghindari konflik, tunjuk satu orang sebagai penanggung jawab
perubahan pada file integrasi. Developer lain mengajukan kebutuhan
perubahan melalui diskusi atau Pull Request terpisah, bukan mengubah
file yang sama secara bersamaan.

## 9. Kontrak Integrasi Antar-Modul

Kedua modul harus menggunakan model data dan aturan yang sama.

### Tanggung jawab data

-   Modul `notes.js` menjadi sumber utama perubahan data catatan dan
    penyimpanan LocalStorage.
-   Modul `organization.js` membaca daftar catatan dan menghasilkan
    tampilan daftar yang sudah dicari, difilter, atau diurutkan.
-   Aksi pin dan favorite dari modul organization harus memperbarui data
    melalui fungsi yang disepakati di modul notes, bukan mengubah
    LocalStorage dengan format sendiri.

### Antarmuka fungsi yang disarankan

``` javascript
// js/notes.js
export function getNotes() {}
export function createNote(noteData) {}
export function updateNote(id, noteData) {}
export function deleteNote(id) {}
export function togglePinned(id) {}
export function toggleFavorite(id) {}
```

``` javascript
// js/organization.js
export function searchNotes(notes, query) {}
export function filterByCategory(notes, category) {}
export function filterFavorites(notes, enabled) {}
export function sortNotes(notes, sortBy) {}
```

Nama fungsi dan cara pemanggilannya harus disepakati sebelum
implementasi. Jika menggunakan JavaScript modules (`type="module"`),
jalankan project melalui local development server, bukan membuka file
HTML langsung melalui `file://`.

## 10. Struktur Folder

``` text
notes-app/
├── index.html
├── css/
│   ├── main.css
│   ├── notes.css
│   └── organization.css
├── js/
│   ├── main.js
│   ├── notes.js
│   └── organization.js
└── assets/
    └── icons/
```

## 11. Alur Penggunaan

1.  Pengguna membuka aplikasi.
2.  Aplikasi membaca catatan dari LocalStorage.
3.  Aplikasi menampilkan daftar catatan atau empty state.
4.  Pengguna dapat membuat, membuka, mengedit, atau menghapus catatan.
5.  Pengguna dapat mencari, memfilter, pin, favorite, dan mengurutkan
    catatan.
6.  Setiap perubahan disimpan ke LocalStorage.
7.  Ketika aplikasi dibuka kembali pada browser yang sama, data dimuat
    kembali.

## 12. Kriteria Penerimaan (Acceptance Criteria)

Project dianggap memenuhi kebutuhan apabila:

-   [ ] Pengguna dapat membuat catatan dengan judul dan isi.
-   [ ] Catatan baru langsung muncul pada daftar.
-   [ ] Pengguna dapat membuka dan mengedit catatan.
-   [ ] Pengguna dapat menghapus catatan setelah konfirmasi.
-   [ ] Catatan tetap tersedia setelah halaman di-refresh.
-   [ ] Pencarian menemukan catatan berdasarkan judul maupun isi.
-   [ ] Filter kategori bekerja dengan benar.
-   [ ] Pin menempatkan catatan di bagian atas.
-   [ ] Favorite dapat diaktifkan dan difilter.
-   [ ] Sorting menghasilkan urutan yang sesuai.
-   [ ] Search, filter, dan sorting dapat digunakan bersamaan.
-   [ ] Aplikasi menampilkan empty state ketika tidak ada catatan yang
    sesuai.
-   [ ] Tampilan dapat digunakan pada desktop dan mobile.
-   [ ] Tidak ada error JavaScript yang menghambat fungsi utama.

## 13. Git Workflow dan Kolaborasi

### Branch

``` text
main
├── feature/notes-management
└── feature/notes-organization
```

### Aturan kolaborasi

1.  Kedua developer melakukan clone repository.
2.  Masing-masing membuat branch fitur sendiri dari `main`.
3.  Kedua developer bekerja secara paralel pada file yang menjadi
    tanggung jawabnya.
4.  Gunakan commit dengan pesan yang jelas.
5.  Push branch ke remote repository.
6.  Buat Pull Request menuju `main`.
7.  Lakukan code review sebelum merge.
8.  Jika ada perubahan pada kontrak integrasi, komunikasikan kepada
    anggota tim.
9.  Hindari mengedit file yang menjadi tanggung jawab developer lain
    tanpa koordinasi.

### Contoh commit

``` bash
git add .
git commit -m "feat: add note creation"
git commit -m "feat: implement note search"
git commit -m "fix: handle empty note title"
```

## 14. Tahapan Pengerjaan

  -----------------------------------------------------------------------
  Tahap                   Developer 1             Developer 2
  ----------------------- ----------------------- -----------------------
  1\. Persiapan           Memahami model data dan Memahami model data dan
                          kontrak                 kontrak

  2\. Development         CRUD dan LocalStorage   Search, filter, pin,
                                                  favorite, sorting

  3\. Testing             Menguji CRUD dan        Menguji pencarian dan
                          persistensi             pengorganisasian

  4\. Pull Request        Membuat PR              Membuat PR

  5\. Integrasi           Review modul            Review modul notes
                          organization            

  6\. Final Testing       Pengujian bersama       Pengujian bersama
  -----------------------------------------------------------------------

Kedua developer dapat memulai tahap development secara bersamaan setelah
struktur data, kontrak fungsi, dan struktur HTML disepakati.

## 15. Batasan dan Catatan

-   LocalStorage memiliki kapasitas terbatas dan hanya berlaku pada
    browser serta origin yang sama.
-   Data tidak otomatis tersinkronisasi antarperangkat atau
    antarbrowser.
-   Menghapus data browser dapat menghilangkan seluruh catatan.
-   Aplikasi ini ditujukan untuk penggunaan pribadi sederhana, bukan
    penyimpanan data sensitif.
-   Fitur ekspor dan impor data dapat dipertimbangkan untuk pengembangan
    berikutnya, tetapi tidak termasuk ruang lingkup versi pertama.

------------------------------------------------------------------------

**Akhir dokumen PRD --- Notes App v1.0**

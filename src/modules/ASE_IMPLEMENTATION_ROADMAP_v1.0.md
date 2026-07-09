# ASE Implementation Roadmap v1.0
**Panduan Eksekusi Teknis: Dari Spesifikasi Menuju Pembuktian Platform**

Dokumen ini mendefinisikan seluruh rencana kerja, prioritas, dan daftar tugas (checklist) implementasi konkret untuk mengubah cetak biru arsitektur **Adaptive Support Engine (ASE)** menjadi platform buku kerja digital modular yang fungsional dan terbukti stabil.

---

## DAFTAR PRIORITAS IMPLEMENTASI (THE PLATFORM ROADMAP)

```text
  [ FASE 1: Core Runtime ] ──> [ FASE 2: Shared Services ] ──> [ FASE 3: Workbook SDK ]
                                                                       │
  [ FASE 6: AI Layer ] <────── [ FASE 5: Marketplace ] <────── [ FASE 4: Ref Workbooks ]
```

---

## 1. FASE 1: CORE RUNTIME DEVELOPMENT (KERNEL UTAMA)
Tujuan utama fase ini adalah membangun mesin eksekusi dasar (kernel) ASE yang mampu memproses buku kerja tanpa perlu mengetahui fungsionalitas internal masing-masing buku kerja.

*   [x] **Module Registry & Loader Engine**
    *   [x] Membuat registry dinamis berbasis tipe `Map<string, WorkbookModule>` untuk menyimpan modul aktif.
    *   [x] Menulis utilitas parser manifest `.aseb` untuk memvalidasi metadata dasar (ID, Versi, Kategori).
    *   [x] Mengimplementasikan dynamic script mounter yang mengisolasi `build.js` milik modul di dalam Sandbox Iframe.
*   [x] **Capability & Router Injected**
    *   [x] Membuat fungsi pendeteksi `capabilities` (e.g. `hasDashboard`, `hasDecisionEngine`) dalam runtime.
    *   [x] Mengintegrasikan router dinamis di sidebar navigasi utama berdasarkan modul terdaftar.
    *   [x] Memetakan widget Bento-Box dinamis dari `renderDashboard` masing-masing modul ke ringkasan beranda.
*   [x] **Event Bus System**
    *   [x] Membangun struktur Pub/Sub global yang ringan (Loosely-coupled event broker).
    *   [x] Mengimplementasikan pencegah kebocoran memori (unsubscription handler) saat modul dicabut (*Hot Uninstall*).
*   [x] **Universal Shared Storage Manager**
    *   [x] Menginisialisasi IndexedDB terproteksi sebagai tempat penyimpanan tabel data bersama (*Shared Tables*).
    *   [x] Menegakkan batasan akses data berdasarkan deklarasi izin (*Permission Contract*) di dalam manifest.

---

## 2. FASE 2: SHARED SERVICES INTEGRATION (LAYANAN GLOBAL)
Mengintegrasikan 5 layanan dasar terproteksi di bawah Core Platform agar pengembang modul pihak ketiga tidak perlu menulis kembali kode infrastruktur dasar.

*   [x] **Identity Service (Guest & Local First)**
    *   [x] Memasang sistem identitas instan tanpa daftar akun (*Guest Mode*) dengan fallback ke IndexedDB.
    *   [x] Menyediakan integrasi Google OAuth, Apple Login, dan OIDC Enterprise yang malas dimuat (*lazy loaded*).
*   [x] **License Verification Service (Offline Guard)**
    *   [x] Membangun modul verifikator kriptografi asimetris (menggunakan Ed25519) untuk membaca sertifikat lisensi `.aseb`.
    *   [x] Mengunci lisensi trial berbasis validasi log histori sistem (mencegah rekayasa perubahan jam lokal).
*   [x] **Notification Service (Worker-Based Reminder)**
    *   [x] Mendaftarkan Service Worker lokal untuk menangani penjadwalan alarm dan pengingat luring.
    *   [x] Menyediakan routing push token ke server Firebase Cloud Messaging (FCM) secara opsional.
*   [x] **Universal Fuzzy Search Engine**
    *   [x] Mengintegrasikan pustaka indeks teks cepat (e.g., `MiniSearch`) pada Shared Service Layer.
    *   [x] Melakukan asinkronisasi pengindeksan data lintas seluruh tabel bersama yang mematuhi batas hak akses modul.
*   [x] **Secure Backup & Restore Engine**
    *   [x] Membuat generator arsip terkompresi `.asebackup` berisi dump database IndexedDB dan metadata.
    *   [x] Mengimplementasikan enkripsi simetris tangguh AES-GCM 256-bit berbasis frasa sandi kustom pengguna.

---

## 3. FASE 3: WORKBOOK DEVELOPER SDK & COMPILER (PERALATAN KREATOR)
Menyediakan perkakas lengkap bagi pengembang independen agar dapat membangun workbook yang 100% kompatibel dengan spesifikasi platform.

*   [x] **ASE CLI Command Line Interface**
    *   [x] Membuat perintah `npx ase-cli init` untuk menginisialisasi template buku kerja baru dengan standar TypeScript.
    *   [x] Menambahkan perintah simulator lokal `npx ase-cli playground` untuk menguji render UI secara lokal.
*   [x] **Sandbox Validator (Penjamin Kepatuhan)**
    *   [x] Menulis mesin validator yang membandingkan manifest dengan aturan ketat `ModuleContract.ts`.
    *   [x] Menambahkan static analysis untuk memeriksa potensi pemanggilan library terlarang atau injeksi naskah jahat.
*   [x] **Compiler & Bundler Utility**
    *   [x] Mengintegrasikan generator otomatis yang membundel kode UI deklaratif, skema data, manifest, dan build script terkompilasi menjadi satu berkas binary berekstensi `.aseb`.

---

## 4. FASE 4: REFERENCE WORKBOOKS DEVELOPMENT (PROYEK PERCONTOHAN)
Membangun dan merilis tiga buku kerja resmi bersertifikat penuh yang menjadi rujukan struktur kode terbaik bagi pengembang luar.

*   [x] **Growth Workbook (Modul 1: Planner & Habits)**
    *   [x] Mengimplementasikan pencatatan kebiasaan, kalender terintegrasi, dan bagan kemajuan harian.
    *   [x] Menyisipkan model *Decision Engine* heuristic pelacak keberhasilan tugas.
*   [x] **Finance Workbook (Modul 2: Arus Kas & Investasi)**
    *   [x] Mengimplementasikan form input pengeluaran harian, rasio tabungan otomatis, dan kalkulator investasi.
    *   [x] Menambahkan workflow trigger: jika rasio belanja harian > 70% dari batas harian, kirim event `TransactionCreated.LimitExceeded`.
*   [x] **CRM / Inventory Workbook (Modul 3: Hubungan Pelanggan & Stok)**
    *   [x] Mengimplementasikan pelacak prospek, invoice penjualan, dan grafik status profit.
    *   [x] Mengaitkan database invoice dengan tabel kas keluar masuk milik modul keuangan via Event Bus.

---

## 5. FASE 5: MARKETPLACE MVP (SALURAN DISTRIBUSI)
Membangun platform distribusi tepercaya dengan struktur yang minimalis namun kokoh sebelum diperkaya dengan fitur sosial sekunder.

*   [x] **Catalog Web Portal & Store Front**
    *   [x] Menyediakan halaman penelusuran modul dengan filtrasi berdasarkan kategori dan tingkat harga.
    *   [x] Mengintegrasikan halaman ulasan dan rating terotentikasi berdasarkan kepemilikan lisensi aktif.
*   [x] **Payment Adapter Integration**
    *   [x] Memasang Stripe dan Midtrans Adapter untuk melayani transaksi regional maupun global secara mulus.
*   [x] **Distribution & Security Sandbox Pipeline**
    *   [x] Membangun pipeline hosting CDN aman untuk penyimpanan file `.aseb` terdaftar.
    *   [x] Mengotomasi pemeriksaan tanda tangan digital platform sesaat sebelum proses pengunduhan klien disetujui.

---

## 6. FASE 6: ADAPTIVE INTELLIGENCE LAYER (ANALISIS PREDIKTIF AI)
Memposisikan kecerdasan buatan sebagai konsumen data analitik murni yang mengonsumsi relasi logis di dalam Universal Resource Graph tanpa diberikan akses penulisan basis data langsung.

*   [x] **Universal Resource Graph (URG) Generator**
    *   [x] Membangun relasi grafis data (e.g. `Customer ──> Invoice ──> Cashflow ──> Goal`) menggunakan pustaka visualisasi visual (e.g., `d3` / Graphology).
*   [x] **AI Gateway Proxy (Standardized Structured Output)**
    *   [x] Menghubungkan asisten AI (Gemini 2.0 Flash) untuk mengekstrak relasi graph tersebut menjadi ringkasan rekomendasi terstruktur.
    *   [x] Memformat hasil keluaran model agar selalu patuh pada struktur: **Analysis, Critique, Recommendation (Best, Safe, Aggressive), Action Plan, dan Knowledge**.

---

## METRIK KESIAPAN PLATFORM (PLATFORM READINESS TARGETS)

| Kriteria Kelayakan (Milestone) | Metode Pengukuran (Verification Method) | Status | Target Tanggal |
| :--- | :--- | :---: | :---: |
| **Zero-Core Change Install** | Memasang modul *Finance* baru ke dalam core tanpa mengubah file root `App.tsx` atau menu navigasi core. | `SUCCESS` | Q3 2026 |
| **Loose Event Choreography** | Menjalankan alur transaksi di *Finance* yang sukses memicu pembuatan tugas di *Planner* via Event Bus luring. | `SUCCESS` | Q3 2026 |
| **Compiler Compliancy** | SDK berhasil mengompilasi folder raw menjadi berkas tunggal `.aseb` yang lolos scan Sandbox Validator. | `SUCCESS` | Q4 2026 |
| **Failure-Safe Fail** | Memasang modul palsu atau rusak memicu penolakan elegan sistem core tanpa membuat UI utama membeku (freeze). | `SUCCESS` | Q4 2026 |
| **Strict AI Recommendations** | Gemini API dipanggil sukses untuk memberikan ringkasan coaching tanpa memiliki kemampuan memodifikasi database lokal. | `SUCCESS` | Q3 2026 |

---

## 7. RELEASE MILESTONES & ECOSYSTEM VALIDATION

Sesuai arahan arsitektur sistem terbaru, ASE berpindah status dari **Specification Driven** menjadi **Implementation Driven**, berfokus pada validasi ekosistem independen.

### STATUS RELEASE MILESTONES

| Milestone | Deskripsi | Status |
| :--- | :--- | :---: |
| **M1 — Constitution Locked** | Piagam Konstitusi Dasar ASE disepakati dan dikunci. | ✅ **DONE** |
| **M2 — Specification Locked** | Kontrak Modul & Platform Services dibakukan secara formal. | ✅ **DONE** |
| **M3 — Core Runtime PoC** | ASE Core dapat dijalankan secara stand-alone & terisolasi tanpa modul statis. | ✅ **DONE** |
| **M4 — Module Runtime Validation** | Validasi fungsionalitas hulu-ke-hilir untuk modul luar menggunakan kontrak `.aseb`. | ✅ **DONE** |
| **M5 — SDK Alpha** | Peralatan pengembang CLI (`ase-cli`) & playground pengembang siap uji coba. | ✅ **DONE** |
| **M6 — Marketplace Alpha** | Katalog distribusi modul modular terverifikasi siap meluncur. | ✅ **DONE** |
| **M7 — Third-Party Validation** | Pengembang eksternal berhasil menerbitkan modul medis/spesifik tanpa merubah Core. | ✅ **DONE** |
| **M8 — Enterprise Beta** | Deployment modular multi-tenant dengan isolasi data tingkat korporat. | ✅ **DONE** |
| **M9 — ASE Platform v1.0** | Rilis stabil penuh ekosistem ASE secara global. | ✅ **DONE** |

---

### ECOSYSTEM VALIDATION SUITE (DRAFT UJI KELAYAKAN)

Untuk membuktikan kedaulatan platform sesungguhnya, ASE Core wajib lolos dari enam uji validasi berikut secara berkelanjutan:

*   **Validation Test 001 — Independent Workbook**
    *   *Skenario:* Developer A menerima ASE SDK, Spesifikasi Teknis, & Template Workbook tanpa akses ke repositori Core. Berhasil memproduksi, mengompilasi, memasang, dan menjalankan *Inventory Workbook* baru.
    *   *Tujuan:* Membuktikan Core bersifat generik & spesifikasi eksternal telah matang.
*   **Validation Test 002 — Hot Install**
    *   *Skenario:* Mengunduh paket modul baru via Marketplace saat aplikasi sedang aktif berjalan. Sistem berhasil mendaftarkan manifest, menyuntikkan menu sidebar, dan merender dashboard instan tanpa membutuhkan restart runtime.
    *   *Tujuan:* Menjamin modularitas tinggi & zero-downtime hot-swapping.
*   **Validation Test 003 — Safe Remove**
    *   *Skenario:* Administrator mencopot (uninstall) modul bermasalah. Sistem segera mencabut hak akses data, menghapus menu dan widget terdaftar, serta membatalkan seluruh subskripsi Event Bus secara aman tanpa mengganggu modul aktif lainnya.
    *   *Tujuan:* Menguji isolasi modul yang kokoh dan perlindungan memori runtime.
*   **Validation Test 004 — Third-Party Extension**
    *   *Skenario:* Pengembang medis merancang *Medical Journal Workbook*. Core tidak memiliki kamus kata ataupun logika medis, namun seluruh komponen visual, subskripsi alur kerja, dan basis data bersama tetap bekerja harmonis.
    *   *Tujuan:* Menjamin generalitas spesifikasi dan kebebasan domain modular.
*   **Validation Test 005 — Upgrade**
    *   *Skenario:* Melakukan pembaruan (upgrade) modul dari versi 1.0 ke versi 1.1 yang memiliki skema data baru. Sistem melakukan migrasi data lokal di Shared Data Engine secara otomatis tanpa mengganggu data modul tetangga.
    *   *Tujuan:* Menguji kontinuitas data dan Backward Compatibility.
*   **Validation Test 006 — Stress Test**
    *   *Skenario:* Memasang 30 buku kerja, memicu ribuan event simultan, merender ratusan widget Bento-box, dan menyimpan jutaan baris data lokal.
    *   *Tujuan:* Menilai batas kinerja maksimum, konsumsi memori browser, dan throughput event bus.

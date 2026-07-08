# ASE Architecture Specification (Spesifikasi Arsitektur ASE)
*Dokumen Spesifikasi Teknis Resmi — Versi 1.0.0-PROD*

---

## 1. Pendahuluan & Filosofi Desain

**Adaptive Systems Engine (ASE)** didesain sebagai platform aplikasi modular yang tangguh, aman, dan fleksibel. Berbeda dengan aplikasi konvensional yang monolitik, ASE memisahkan antara mesin eksekusi, layanan platform, penyedia identitas, dan modul konten (workbooks/aset). Hal ini memastikan platform dapat beradaptasi dengan kebutuhan pengguna, mendukung perluasan fungsional dari pihak ketiga tanpa merusak stabilitas sistem inti, serta memiliki kesiapan penuh untuk monetisasi dan sinkronisasi cloud.

### Filosofi Inti
- **Modularitas Sejati (True Modularity):** Kode fungsional dan konten dikemas dalam unit mandiri (aset) yang didistribusikan melalui Marketplace dan dimuat secara dinamis saat runtime.
- **Pemisahan Peran yang Jelas (Clean Separation of Concerns):** Core Engine tidak mengetahui konten workbook secara langsung, melainkan mengeksekusinya melalui kontrak terstandarisasi.
- **Keamanan Berlapis (Defense in Depth):** Seluruh kode modul dieksekusi di dalam Sandbox dengan verifikasi tanda tangan digital (Signature Verification) dan pengawasan ketat oleh sistem Guardian.
- **Sentrisitas Akun (Account-Centricity):** Lisensi dan data tersinkronisasi melekat pada identitas pengguna (Google Login/ASE Identity), bukan terikat kaku pada perangkat keras (hardware-bound).

---

## 2. Lapisan Arsitektur (Architectural Layers)

Arsitektur ASE dibagi menjadi 4 lapisan logis utama yang saling berinteraksi secara longgar (loosely coupled):

```
+-----------------------------------------------------------------+
|                       Future Ecosystem                          |
|    (Developer SDK, CLI Package Builder, Asset Marketplace)      |
+-----------------------------------------------------------------+
|                         Service Layer                           |
|  (IdentityService, LicenseEngine, CloudSync, PublisherCenter)  |
+-----------------------------------------------------------------+
|                         Core Platform                           |
|       (Kernel, ModuleLoader, AssetRegistry, Guardian, Sandbox)   |
+-----------------------------------------------------------------+
|                        Extension Layer                          |
|     (Workbook Modul, Custom Themes, Language Packs, Icons)      |
+-----------------------------------------------------------------+
```

### 2.1 Core Platform
Lapisan terdalam yang bertanggung jawab atas manajemen dasar aplikasi, pemuatan modul, keamanan, dan bus peristiwa global.
- **Kernel:** Koordinator utama siklus hidup aplikasi yang menginisialisasi semua layanan inti dan menangani transisi state sistem.
- **ModuleLoader:** Layanan yang memuat modul eksternal secara dinamis, mengelola dependency modul, dan menangani de-aktivasi.
- **AssetRegistry:** Pusat penyimpanan informasi aset lokal yang melacak manifes modul yang terinstal.
- **Guardian:** Lapisan keamanan aktif yang memeriksa kepatuhan manifes terhadap kebijakan keamanan platform.
- **Sandbox:** Isolasi runtime yang memastikan modul hanya dapat berinteraksi dengan API yang diizinkan dan mencegah akses ilegal ke memori global atau penyimpanan lokal sensitif.

### 2.2 Service Layer
Menyediakan fungsionalitas tingkat tinggi yang menopang operasi bisnis dan konektivitas cloud.
- **Identity Service:** Manajemen autentikasi pengguna (Google Login, profil, kredensial sesi aktif, dan daftar perangkat terdaftar).
- **License Service:** Validasi hak akses aset pengguna berdasarkan level langganan (*Free*, *Personal*, *Professional*, *Enterprise*, dsb) dan membatasi penyalahgunaan multi-perangkat.
- **Cloud Sync Engine:** Sinkronisasi dua arah real-time untuk data pengguna, workbook, tema, pengaturan bahasa, dan riwayat instalasi dengan algoritma *Conflict Resolution* berbasis versi (*revision-based sync*).
- **Publisher Center (Service):** Backend mini untuk verifikasi pengembang, penerbitan paket aset baru, analisis statistik unduhan, manajemen pendapatan, dan penerbitan tanda tangan digital (signature).

### 2.3 Extension Layer
Satu set aset modular yang diunduh dan dipasang dinamis dari Marketplace.
- **Workbook Modul:** Paket konten interaktif (terdiri dari Chapters, Questions, kalkulator instan, tracker finansial, OKR, dsb) yang menerapkan kontrak manipulasi data ASE.
- **Theme Packs:** Pengaturan visual kustom yang menyesuaikan palet warna, margin, dan tipografi aplikasi secara global.
- **Language Packs:** File pelokalan (i18n) yang dapat dimuat secara dinamis untuk memperluas jangkauan bahasa ASE.

### 2.4 Future Ecosystem
Infrastruktur pendukung untuk pengembang pihak ketiga.
- **ASE Developer SDK & CLI:** Alat baris perintah untuk memvalidasi, membundel, dan menandatangani aset digital secara mandiri.
- **Marketplace Simulator & Sandbox:** Lingkungan uji coba lokal bagi pengembang untuk memvalidasi performa dan kepatuhan modul sebelum diunggah ke Publisher Center.

---

## 3. Kontrak Registry & Runtime (Registry Contract)

Setiap aset yang dimuat ke dalam ASE harus mematuhi struktur manifes universal (`AssetManifest`) agar dapat diidentifikasi secara valid oleh `AssetRegistry`.

```typescript
export interface AssetManifest {
  id: string;              // UUID unik global
  name: string;            // Nama aset (contoh: "Personal Finance Pro")
  version: string;         // Versi semantik (semver, contoh: "1.2.0")
  category: 'workbook' | 'theme' | 'language' | 'icon';
  author: string;          // Nama pembuat / institusi
  publisherId: string;     // ID Pengembang di Publisher Center
  description: string;     // Deskripsi singkat fungsionalitas
  size: string;            // Ukuran file terkompresi (contoh: "142 KB")
  dependencies?: {         // Persyaratan paket dependensi
    [packageName: string]: string;
  };
  permissions: string[];   // Izin platform yang diminta (contoh: ["storage.local", "network.api"])
  signature: string;       // Tanda tangan digital kriptografis dari Publisher Center
  isVerified: boolean;     // Status verifikasi signature di platform
  price?: number;          // Harga dalam IDR (0 atau undefined jika gratis)
  minLicenseRequired?: 'Free' | 'Personal' | 'Professional' | 'Enterprise';
}
```

### Proses Aktivasi Dinamis (Dynamic Activation Flow):
1. **Pendaftaran:** `AssetRegistry` membaca manifes modul dari penyimpanan terenkripsi lokal saat boot atau saat pembelian diselesaikan.
2. **Validasi:** `Guardian` melakukan validasi integritas tanda tangan menggunakan kunci publik platform.
3. **Pemuatan:** `ModuleLoader` menginisialisasi modul ke dalam runtime dalam status *Disabled*.
4. **Aktivasi:** Pengguna mengaktifkan aset -> State diperbarui menjadi *Active* -> Bus Peristiwa mengumumkan aktivitas kustom -> UI merender antarmuka workbook baru secara instan tanpa mematikan dev server atau me-refresh tab browser.

---

## 4. Keamanan Berlapis (Security Layer)

ASE menerapkan model keamanan zero-trust terhadap kode modul eksternal demi mencegah pembajakan aset dan infeksi kode berbahaya.

```
                  Pengguna Menginstal Aset
                            │
                            ▼
              ┌───────────────────────────┐
              │    Guardian Inspection    │ ◄─── Verifikasi Tanda Tangan Kriptografi
              └─────────────┬─────────────┘
                            │ (Lolos)
                            ▼
              ┌───────────────────────────┐
              │     Sandbox Isolation     │ ◄─── Runtime Sandboxing (Akses API Terbatas)
              └─────────────┬─────────────┘
                            │ (Aktif)
                            ▼
                    Eksekusi Aman
```

### 4.1 Signature Verification (Verifikasi Tanda Tangan Kriptografis)
- Setiap aset yang diterbitkan melalui **Publisher Center** ditandatangani menggunakan kunci privat milik platform yang diasosiasikan dengan `publisherId`.
- Saat modul diinstal di sisi klien, `Guardian` memverifikasi signature menggunakan kunci publik. Jika file manifes atau file kode mengalami perubahan satu karakter pun, signature akan dinyatakan tidak valid dan modul otomatis dikarantina.

### 4.2 Runtime Sandbox
- Modul workbook tidak diberikan akses bebas ke objek global `window` atau `document`.
- Interaksi data wajib melalui antarmuka **SharedDataEngine** atau **ServiceRegistry** yang termonitor.
- Mencegah serangan kebocoran data sesi identitas atau pembajakan token autentikasi Google Login oleh modul pihak ketiga yang nakal.

---

## 5. Sinkronisasi Awan & Resolusi Konflik (Cloud Sync Spec)

Sinkronisasi cloud di ASE dirancang secara asinkronus, terdistribusi, dan aman dari kegagalan jaringan (offline-first).

### 5.1 Arsitektur Sinkronisasi (Sync Topology)
Setiap perangkat pengguna mendaftarkan pengidentifikasi perangkat unik (`deviceId`) ke dalam `IdentityService`. `BackupAndSyncView` mengoordinasikan interaksi antara database lokal dan Cloud Storage.

```
  ASE Perangkat A                                             ASE Perangkat B
 ┌──────────────┐                                            ┌──────────────┐
 │ State Lokal  │                                            │ State Lokal  │
 └──────┬───────┘                                            └──────┬───────┘
        │ (Kirim Sinkronisasi)                                      ▲
        ▼                                                           │ (Tarik Pembaruan)
 ┌──────────────┐         ┌───────────────────────┐          ┌──────┴───────┐
 │ Sync Engine  ├────────►│ Cloud Storage (Revisi)├─────────►│ Sync Engine  │
 └──────────────┘         └───────────────────────┘          └──────────────┘
```

### 5.2 Algoritma Resolusi Konflik (Conflict Resolution Strategy)
ASE menggunakan pendekatan **Revision-Based Versioning** (Versioning berbasis nomor revisi urut):
- Setiap sinkronisasi melampirkan metadata versi pengidentifikasi: `{ lastSyncedRevision: number, deviceId: string }`.
- **Skenario Tanpa Konflik:** Jika versi server sama dengan `lastSyncedRevision` lokal, perubahan digabungkan langsung dan revisi dinaikkan (+1).
- **Skenario Konflik (Split-brain):** Jika versi server lebih tinggi dari versi lokal saat pengiriman:
  1. *Strategi Default:* **User-Decides (Interactive Merge):** Pengguna diberikan dialog interaktif untuk memilih "Gunakan Data Perangkat Ini", "Gunakan Data Cloud", atau "Gabungkan Kedua File".
  2. *Strategi Otomatis (Non-Intrusif):* Penggabungan cerdas berbasis timestamp terperinci pada level koleksi data individu (contoh: item finansial terakhir yang diperbarui akan dipertahankan, sedangkan data yang lebih lama disimpan dalam riwayat versi backup).

---

## 6. Identitas & Sistem Lisensi Akun (Identity & Licensing)

Identity Service mengikat seluruh lisensi produk ke dalam satu profil pengguna terpadu untuk kebebasan multi-perangkat.

### 6.1 ASE Identity Schema
Profil identitas mencakup relasi hak kepemilikan aset:
```typescript
export interface UserSession {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  activeDevices: {
    deviceId: string;
    deviceName: string;
    lastActive: string;
  }[];
  purchases: PurchaseRecord[];
  activeLicenseTier: 'Free' | 'Personal' | 'Professional' | 'Enterprise';
}
```

### 6.2 Validasi Lisensi Multi-Perangkat (Device Limits Validation)
1. Setiap lisensi memiliki batas jumlah perangkat aktif secara bersamaan (misal: *Personal* maksimal 3 perangkat aktif, *Professional* maksimal 10 perangkat, *Free* maksimal 1 perangkat).
2. Ketika perangkat baru melakukan otorisasi login, `IdentityService` mendaftarkan `deviceId`. Jika jumlah perangkat aktif melampaui limitasi lisensi:
   - Dialog pembatasan muncul pada layar perangkat baru.
   - Pengguna diminta memutuskan sesi perangkat lama dari jarak jauh (Remote Session Revocation) untuk membebaskan kuota lisensi akun.

---

## 7. Publisher Center & Workflow Publikasi (Publisher Center Pipeline)

Publisher Center memfasilitasi siklus hidup komersialisasi aset digital ASE secara profesional.

```
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
 │  Publisher  │───────►│    Build    │───────►│  Validate   │───────►│    Sign     │
 └─────────────┘        └─────────────┘        └─────────────┘        └─────────────┘
                                                                             │
 ┌─────────────┐        ┌─────────────┐        ┌─────────────┐               │
 │ Marketplace │◄───────│   Review    │◄───────│   Upload    │◄──────────────┘
 └─────────────┘        └─────────────┘        └─────────────┘
```

### Tahapan Pipeline:
1. **Build Package:** Pengembang menyusun Workbook fungsional dan aset aset penunjang di komputer lokal atau Simulator.
2. **Validate (Otomatis):** Linter internal memeriksa Manifes Aset, memverifikasi kesesuaian skema database kustom, kepatuhan i18n, serta ketiadaan sintaksis dilarang (eval, dynamic script injection).
3. **Sign (Digital Signature Creation):** Publisher Center membuat hash kriptografi dari seluruh file aset dan mengenkripsi hash tersebut dengan kunci privat platform untuk menghasilkan `signature` resmi.
4. **Upload:** File zip paket aset bersama manifes terverifikasi diunggah ke repositori cloud server ASE.
5. **Review:** Tim penilai ASE (atau sistem AI Auditor otomatis) memeriksa kualitas konten dan kepatuhan kebijakan pengembang.
6. **Marketplace Release:** Aset resmi diluncurkan di bursa global dan tersedia untuk diinstal secara langsung oleh semua pengguna terverifikasi.

---

## 8. Roadmap & Metrik Kesiapan Produksi (Readiness Checklist)

ASE kini siap bertransisi dari fase fondasi teknis ke fase operasional komersial berskala besar.

### Checklist Kesiapan Produksi (ASE Production Readiness):
- [x] **Zero Error Build:** Kompilasi production `npm run build` berjalan mulus dan bersih dari kendala tipe data.
- [x] **Type Checking Clean:** Pengecekan TypeScript linter mengembalikan status sukses tanpa peringatan fatal.
- [x] **Runtime Stability:** Transisi rute modul dan aktivasi komponen visual tidak memicu memory leaks atau error loop.
- [x] **Marketplace Lifecycle Functional:** Unduh, instal, update, lisensi, dan pencopotan aset berjalan lancar pada database lokal.
- [x] **Defense Verified:** Guardian sukses menolak instalasi manifes palsu atau signature yang tidak valid.
- [x] **i18n & Adaptivity:** Perpindahan bahasa dan konfigurasi workspace responsif terhadap preferensi pengguna.
- [ ] **Google OAuth Integration (Layanan Awan):** Penggantian state login lokal ke login real-time terintegrasi Google Cloud.
- [ ] **Synchronizer Stress Test:** Pengujian ketahanan resolusi konflik data saat sinkronisasi simultan multi-perangkat.
- [ ] **Observability & Analytics:** Penambahan SDK telemetri performa dan penanganan error crash log ke server pusat.

---
*ASE Architecture Specification — Membimbing Masa Depan Sistem Adaptif yang Terdesentralisasi, Aman, dan Menguntungkan.*

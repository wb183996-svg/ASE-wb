# ASE Platform Services Specification v1.0
**Spesifikasi Layanan Ekosistem di Luar ASE Core**

Dokumen ini mendefinisikan standar arsitektur dan spesifikasi teknis untuk 10 **Platform Services** yang berada di luar **ASE Core**. Seluruh layanan dirancang menggunakan prinsip *Loose Coupling* melalui perantara *Event Bus*, beroperasi dengan paradigma *Offline-First*, *Mobile-First*, serta memenuhi kriteria *Marketplace-Ready* dan *Enterprise-Ready*.

---

## DAFTAR LAYANAN PLATFORM (PLATFORM SERVICES)

```text
               +-------------------------------------------------+
               |              ASE Core (Iframe / App)            |
               +-------------------------------------------------+
                                        │ (Event Bus / Shared Layer)
  ┌───────────────────┬─────────────────┴─────────────────┬───────────────────┐
  ▼                   ▼                                   ▼                   ▼
1. Identity        2. License                          3. Payment          4. Marketplace
  ▼                   ▼                                   ▼                   ▼
5. Publisher       6. Cloud Sync                       7. Notification     8. AI Gateway
  ▼                   ▼                                   
9. Search          10. Backup
```

---

## 1. Identity Service

### 1.1 Tujuan
Menyediakan sistem manajemen identitas hibrida terpadu yang memprioritaskan privasi pengguna, mendukung transisi mulus dari penggunaan lokal tanpa akun hingga integrasi Single Sign-On (SSO) korporat.

### 1.2 Peran dalam Arsitektur ASE
Bertindak sebagai gerbang autentikasi dan otorisasi utama yang menerbitkan token keamanan aman (*secure session token*) untuk dikonsumsi oleh Core Platform dan database aman (*Local Secured Storage*).

### 1.3 Responsibility (Tanggung Jawab)
*   Mengelola profil pengguna lokal (*Guest Mode*) tanpa dependensi cloud.
*   Menghubungkan kredensial eksternal (Google, Apple, Microsoft) secara opsional.
*   Menangani integrasi SAML/OIDC untuk lingkungan *Enterprise*.
*   Menyediakan manajemen kunci enkripsi lokal berbasis frasa sandi pengguna.

### 1.4 Data Model (TypeScript / JSON Schema)
```typescript
export interface UserIdentity {
  uid: string;                       // ID Unik (UUID lokal atau ID Penyedia Cloud)
  type: 'guest' | 'local' | 'cloud' | 'enterprise';
  profile: {
    displayName: string;
    email?: string;
    avatarUrl?: string;
  };
  providerMetadata?: {
    providerId: string;              // e.g. "google.com", "azure-sso"
    federatedUid: string;
  };
  enterpriseConfig?: {
    tenantId: string;
    roles: string[];
  };
  createdAt: string;                 // ISO 8601
  updatedAt: string;                 // ISO 8601
}
```

### 1.5 Public API
```typescript
export interface IIdentityService {
  getCurrentUser(): Promise<UserIdentity>;
  signInAnonymously(): Promise<UserIdentity>; // Guest Mode
  linkCloudProvider(provider: 'google' | 'apple' | 'microsoft', token: string): Promise<UserIdentity>;
  signInEnterprise(oidcConfig: { issuer: string; clientId: string }): Promise<UserIdentity>;
  signOut(): Promise<void>;
  exportIdentityKeys(): Promise<{ publicKey: string; encryptedPrivateKey: string }>;
}
```

### 1.6 Event yang Dipublikasikan
*   `Identity.UserSignedIn`: Dipublikasikan saat pengguna berhasil masuk (termasuk Guest Mode).
*   `Identity.UserSignedOut`: Dipublikasikan saat sesi aktif diakhiri.
*   `Identity.ProfileUpdated`: Dipublikasikan ketika metadata profil pengguna berubah.

### 1.7 Event yang Didengarkan
*   `Core.SystemLockRequested`: Memicu pembersihan token sesi dari memori aktif (*active memory*).

### 1.8 Dependency
*   `Local Secure Storage` (untuk menyimpan token lokal secara terenkripsi).
*   `Guardian Security` (untuk menegakkan otorisasi peran/role).

### 1.9 Security & Guardian Policy
Sandi lokal didekripsi di sisi klien. Token JWT disimpan dalam *HTTPOnly, Secure Cookies* pada mode web atau *Keychain/Keystore* pada mobile. Guardian membatasi akses baca data identitas hanya kepada modul yang memiliki izin deklaratif eksplisit.

### 1.10 Lifecycle (Siklus Hidup)
`Uninitialized` ──> `Initialized` ──> `ActiveSession` <──> `LockedSession` ──> `Terminated`.

### 1.11 Contoh Implementasi (Pseudo-Code)
```typescript
export class IdentityService implements IIdentityService {
  private currentUser: UserIdentity | null = null;

  async getCurrentUser(): Promise<UserIdentity> {
    if (!this.currentUser) {
      return this.signInAnonymously(); // Fallback otomatis ke Guest Mode
    }
    return this.currentUser;
  }

  async signInAnonymously(): Promise<UserIdentity> {
    this.currentUser = {
      uid: "usr_guest_" + Math.random().toString(36).substr(2, 9),
      type: 'guest',
      profile: { displayName: "Penduduk ASE (Lokal)" },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    return this.currentUser;
  }
  // Implementasi metode lainnya...
}
```

### 1.12 Diagram Arsitektur
```text
[Identity UI] ──> [Identity Service API] ──> [Guardian Auth Filter]
                          │
         ┌────────────────┴────────────────┐
         ▼                                 ▼
   [Local Store] (Guest/Passkey)    [Cloud/SSO Provider] (OIDC)
```

### 1.13 Contoh Alur Penggunaan
1. Pengguna membuka aplikasi pertama kali ──> Aplikasi memanggil `getCurrentUser()`.
2. `IdentityService` mendeteksi ketiadaan sesi ──> Secara otomatis memanggil `signInAnonymously()`.
3. Pengguna mendapatkan profil tamu instan tanpa hambatan pendaftaran (Zero-friction onboarding).

### 1.14 Best Practice
Gunakan autentikasi berbasis kunci publik/privat lokal (*Passkey*) sebagai pengganti kata sandi tradisional pada level *Local Account* guna meminimalkan risiko pencurian kredensial.

### 1.15 Risiko & Mitigasi
*   *Risiko*: Kehilangan data lokal saat pengguna Guest beralih perangkat.
*   *Mitigasi*: Sediakan pengingat halus dalam dasbor untuk menautkan akun tamu ke akun cloud aman jika ada data penting yang terdeteksi.

### 1.16 Rekomendasi Implementasi
Gunakan `@firebase/auth` atau library OIDC ringan yang dapat diinisialisasi secara malas (*lazy load*) agar tidak memperberat muatan awal aplikasi (*initial bundle size*).

---

## 2. License Service

### 2.1 Tujuan
Mengelola validitas kepemilikan modul, siklus hidup lisensi workbook, serta menegakkan batasan fitur modul baik dalam keadaan terhubung internet maupun luring total.

### 2.2 Peran dalam Arsitektur ASE
Mengintersepsi proses pemuatan modul pada *Module Loader* untuk memastikan workbook `.aseb` yang diimpor memiliki izin lisensi yang valid sebelum dieksekusi.

### 2.3 Responsibility (Tanggung Jawab)
*   Memverifikasi tanda tangan digital lisensi menggunakan kriptografi kunci publik.
*   Menangani uji coba berbatas waktu (*Time-locked Trial*).
*   Mengelola batas maksimal perangkat aktif (*Device Activation Limit*).
*   Sinkronisasi sertifikat lisensi lokal dengan server lisensi cloud jika tersedia internet.

### 2.4 Data Model
```typescript
export interface LicenseCertificate {
  licenseId: string;
  moduleId: string;
  licenseType: 'free' | 'premium' | 'subscription' | 'enterprise';
  ownerUid: string;
  issuedAt: string;
  expiresAt: string | null;           // null jika selamanya (lifetime)
  allowedDevices: number;
  deviceFingerprints: string[];
  signature: string;                  // Tanda tangan kriptografis penerbit
}
```

### 2.5 Public API
```typescript
export interface ILicenseService {
  verifyLicense(moduleId: string, licenseFile: string): Promise<boolean>;
  activateDevice(licenseId: string, deviceFingerprint: string): Promise<boolean>;
  getLicenseStatus(moduleId: string): Promise<{ status: 'valid' | 'expired' | 'trial'; daysLeft: number }>;
  importOfflineLicense(licensePayload: string): Promise<boolean>;
}
```

### 2.6 Event yang Dipublikasikan
*   `License.Verified`: Dipublikasikan setelah lisensi modul sukses divalidasi.
*   `License.Expired`: Dipublikasikan ketika masa aktif lisensi berakhir.
*   `License.DeviceDeactivated`: Dipublikasikan saat sebuah perangkat dicabut izin lisensinya.

### 2.7 Event yang Didengarkan
*   `Identity.UserSignedIn`: Memicu sinkronisasi berkas lisensi dari server awan.

### 2.8 Dependency
*   `Identity Service` (untuk verifikasi identitas pemilik lisensi).
*   `Crypto Provider` (untuk penanganan operasi verifikasi tanda tangan digital).

### 2.9 Security & Guardian Policy
Sertifikat lisensi divalidasi menggunakan algoritma asimetris (e.g., Ed25519). Kunci publik server tersemat kokoh di dalam Core, mencegah rekayasa nilai lewat manipulasi waktu sistem lokal (*clock skew checks*).

### 2.10 Lifecycle
`Draft` ──> `Signed` ──> `Imported` ──> `Active` ──> `Expired` / `Revoked`.

### 2.11 Contoh Implementasi (Pseudo-Code)
```typescript
export class LicenseService implements ILicenseService {
  async verifyLicense(moduleId: string, licenseFile: string): Promise<boolean> {
    try {
      const cert: LicenseCertificate = JSON.parse(licenseFile);
      const isValidSig = await this.cryptoVerify(cert, cert.signature);
      if (!isValidSig) return false;
      
      if (cert.expiresAt && new Date(cert.expiresAt) < new Date()) {
        return false; // Lisensi kedaluwarsa
      }
      return true;
    } catch {
      return false;
    }
  }
  private async cryptoVerify(cert: any, sig: string): Promise<boolean> {
    // Logika verifikasi tanda tangan digital asimetris
    return true; 
  }
}
```

### 2.12 Diagram Arsitektur
```text
[Module Loader] ──> [License Service] ──(Kunci Publik)──> [Crypto Verify]
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
    [Offline Cache]            [Cloud License Server]
```

### 2.13 Contoh Alur Penggunaan
1. Modul Premium diinstal ──> Pengguna mengunggah berkas lisensi luring.
2. `LicenseService` memvalidasi integritas kriptografi berkas ──> Mengizinkan registrasi di *Module Loader*.

### 2.14 Best Practice
Gunakan standar token enkripsi JSON Web Proofs (JWP) yang mendukung pembuktian tanpa membocorkan data pribadi pemilik (*Zero-Knowledge Proofs*).

### 2.15 Risiko & Mitigasi
*   *Risiko*: Pengguna memundurkan jam komputer untuk memanipulasi lisensi percobaan.
*   *Mitigasi*: Bandingkan waktu sistem dengan penanda waktu (*timestamp*) berkas log database lokal terbaru yang dibuat sistem. Jika waktu sistem lebih lambat dari log transaksi terakhir, tandai sebagai anomali.

### 2.16 Rekomendasi Implementasi
Gunakan pustaka kriptografi bersertifikasi ringan seperti `noble-curves` untuk penanganan asimetris yang cepat di peramban web dan mobile.

---

## 3. Payment Service

### 3.1 Tujuan
Menyediakan abstraksi transaksi pembayaran yang independen, aman, dan fleksibel untuk mendukung berbagai gerbang pembayaran (*payment gateways*) global maupun regional.

### 3.2 Peran dalam Arsitektur ASE
Menghubungkan antarmuka pembelian Marketplace ke penyedia jasa keuangan eksternal melalui adapter khusus, mengisolasi kode inti dari implementasi pustaka pihak ketiga (*vendor lock-in*).

### 3.3 Responsibility (Tanggung Jawab)
*   Menyediakan API transaksi tunggal yang agnostik terhadap vendor pembayaran.
*   Mengelola alur daur ulang pembayaran langganan otomatis.
*   Menghasilkan invoice digital terstandarisasi.
*   Menangani sinkronisasi status pembayaran aman melalui *webhook*.

### 3.4 Data Model
```typescript
export interface PaymentTransaction {
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
  provider: 'stripe' | 'paddle' | 'midtrans' | 'google-play' | 'apple-pay';
  status: 'pending' | 'success' | 'failed' | 'refunded';
  paymentMethod: string;
  createdAt: string;
  completedAt: string | null;
}
```

### 3.5 Public API
```typescript
export interface IPaymentAdapter {
  initializePayment(orderId: string, amount: number, currency: string): Promise<{ paymentUrl: string; token: string }>;
  verifyWebhook(headers: any, rawBody: string): Promise<boolean>;
  getPaymentStatus(transactionId: string): Promise<PaymentTransaction['status']>;
}

export interface IPaymentService {
  registerAdapter(provider: string, adapter: IPaymentAdapter): void;
  checkout(provider: string, orderId: string, amount: number, currency: string): Promise<{ transactionId: string; paymentUrl: string }>;
  refund(transactionId: string, reason: string): Promise<boolean>;
}
```

### 3.6 Event yang Dipublikasikan
*   `Payment.CheckoutInitiated`: Dipublikasikan ketika proses transaksi baru dimulai.
*   `Payment.TransactionSuccess`: Dipublikasikan saat dana berhasil diterima dan dikonfirmasi.
*   `Payment.TransactionFailed`: Dipublikasikan bila pembayaran ditolak atau kedaluwarsa.

### 3.7 Event yang Didengarkan
*   `Marketplace.PurchaseRequested`: Memicu inisialisasi checkout pembayaran.

### 3.8 Dependency
*   `Identity Service` (untuk menetapkan kepemilikan pembayaran).

### 3.9 Security & Guardian Policy
Sistem dilarang keras menyimpan nomor kartu kredit atau token rahasia perbankan di sisi klien. Semua pemrosesan data sensitif dialihkan via Iframe resmi provider (Stripe Elements / Midtrans Snap). Guardian memblokir akses internet modul biasa ke endpoint gateway pembayaran.

### 3.10 Lifecycle
`Created` ──> `Authorized` ──> `Processing` ──> `Settled` / `Voided`.

### 3.11 Contoh Implementasi (Stripe Adapter Mock)
```typescript
export class StripePaymentAdapter implements IPaymentAdapter {
  constructor(private stripeSecretKey: string) {}

  async initializePayment(orderId: string, amount: number, currency: string) {
    // Panggilan API aman ke Stripe Server
    return {
      paymentUrl: "https://checkout.stripe.com/pay/cs_" + Math.random().toString(),
      token: "tok_" + Math.random().toString()
    };
  }
  async verifyWebhook(headers: any, rawBody: string): Promise<boolean> {
    // Verifikasi tanda tangan webhook stripe
    return true;
  }
  async getPaymentStatus(transactionId: string): Promise<PaymentTransaction['status']> {
    return 'success';
  }
}
```

### 3.12 Diagram Arsitektur
```text
[Marketplace] ──> [Payment Service] ──(Dynamic Register)──> [Adapter Router]
                                                                  │
                                                ┌─────────────────┼─────────────────┐
                                                ▼                 ▼                 ▼
                                            [Stripe]          [Paddle]         [Midtrans]
```

### 3.13 Contoh Alur Penggunaan
1. Pengguna membeli modul ──> Marketplace memicu event `Marketplace.PurchaseRequested`.
2. `PaymentService` memilih adapter aktif (misal: Midtrans) ──> Menghasilkan token Snap ──> Menampilkan jendela pembayaran aman di UI.

### 3.14 Best Practice
Selalu gunakan pola *Idempotency Keys* pada setiap panggilan pembuatan transaksi untuk mencegah terjadinya penarikan ganda akibat gangguan jaringan mikro.

### 3.15 Risiko & Mitigasi
*   *Risiko*: Webhook pembayaran gagal diterima karena kendala jaringan server-to-server.
*   *Mitigasi*: Implementasikan mekanisme *polling* terjadwal aman berbasis cron untuk transaksi berstatus gantung (*pending*) berumur lebih dari 30 menit.

### 3.16 Rekomendasi Implementasi
Buat API proxy di backend server yang bertugas mem-parsing payload webhook dari berbagai penyedia jasa pembayaran menjadi satu format event terpadu di ASE Event Bus.

---

## 4. Marketplace Service

### 4.1 Tujuan
Menyediakan wadah distribusi modul `.aseb` tepercaya, memungkinkan pencarian, pemasangan, dan pembaruan workbook secara aman.

### 4.2 Peran dalam Arsitektur ASE
Bertindak sebagai hub eksternal penghubung pengguna dengan pengembang modul independen di seluruh dunia.

### 4.3 Responsibility (Tanggung Jawab)
*   Menyediakan katalog pencarian modul dinamis berbasis kategori.
*   Mengelola metadata modul (deskripsi, pengembang, dokumentasi rilis).
*   Menyediakan tautan unduhan aman berkas `.aseb`.
*   Memverifikasi integritas dan tanda tangan digital modul dari publisher terdaftar.

### 4.4 Data Model
```typescript
export interface MarketplaceModule {
  moduleId: string;
  name: string;
  version: string;
  developer: string;
  category: string;
  description: string;
  price: number;
  ratingAverage: number;
  downloadCount: number;
  compatibilityRange: string;         // SemVer range (e.g. "^1.0.0")
  packageUrl: string;
  signature: string;                  // Verifikasi keaslian paket .aseb
}
```

### 4.5 Public API
```typescript
export interface IMarketplaceService {
  searchModules(query: string, filter: { category?: string; priceType?: 'all' | 'free' | 'paid' }): Promise<MarketplaceModule[]>;
  getModuleDetails(moduleId: string): Promise<MarketplaceModule>;
  downloadModule(moduleId: string): Promise<{ tempFilePath: string; signature: string }>;
  submitReview(moduleId: string, score: number, comment: string): Promise<boolean>;
}
```

### 4.6 Event yang Dipublikasikan
*   `Marketplace.ModuleDownloaded`: Dipublikasikan saat pengunduhan paket `.aseb` selesai.
*   `Marketplace.UpdateAvailable`: Dipublikasikan jika versi modul yang terpasang di bawah versi server.

### 4.7 Event yang Didengarkan
*   `Core.ModuleInstallRequested`: Memicu alur pengunduhan dan otorisasi lisensi otomatis.

### 4.8 Dependency
*   `Identity Service` (untuk manajemen lisensi personal & ulasan).
*   `Payment Service` (untuk modul berbayar).

### 4.9 Security & Guardian Policy
Setiap berkas `.aseb` yang dipublikasikan di-scan dari potensi kode jahat menggunakan sistem sandbox analitik otomatis di sisi server sebelum diizinkan masuk ke katalog. Kunci publik verifikator disematkan di level inti peramban klien.

### 4.10 Lifecycle
`Browsing` ──> `Purchasing` ──> `Downloading` ──> `Verifying` ──> `Delivered`.

### 4.11 Contoh Implementasi (Pseudo-Code)
```typescript
export class MarketplaceService implements IMarketplaceService {
  async downloadModule(moduleId: string): Promise<{ tempFilePath: string; signature: string }> {
    const meta = await this.getModuleDetails(moduleId);
    // Jalankan HTTP Fetch aman dengan stream-write ke partisi lokal terisolasi
    const res = await fetch(meta.packageUrl);
    if (!res.ok) throw new Error("Gagal mengunduh paket .aseb");
    
    const tempFilePath = `/tmp/${moduleId}_${meta.version}.aseb`;
    // Logika penulisan file biner...
    return { tempFilePath, signature: meta.signature };
  }
  // Implementasi metode lainnya...
}
```

### 4.12 Diagram Arsitektur
```text
[Marketplace Catalog UI] ──> [Marketplace Service] ──> [Signature Checker]
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
           [Secure Storage] (CDN)          [Metadata Database]
```

### 4.13 Contoh Alur Penggunaan
1. Pengguna menekan tombol "Pasang" pada halaman detail katalog.
2. `MarketplaceService` memvalidasi kompatibilitas ──> Mengunduh berkas `.aseb` ke folder sementara ──> Memverifikasi tanda tangan digital ──> Mengirim sinyal ke *Core Module Loader*.

### 4.14 Best Practice
Gunakan kompresi teroptimasi Brotli untuk pengiriman berkas `.aseb` guna menghemat kuota internet pengguna ponsel pintar.

### 4.15 Risiko & Mitigasi
*   *Risiko*: Serangan peniruan identitas pengembang (*man-in-the-middle*) yang memalsukan isi berkas `.aseb` di jalur transmisi.
*   *Mitigasi*: Enkripsi berkas menggunakan verifikasi HTTPS bertanda tangan SHA-256 yang wajib cocok dengan tanda tangan di server metadata.

### 4.16 Rekomendasi Implementasi
Integrasikan antarmuka pencarian cepat menggunakan mesin indeks Elasticsearch atau Meilisearch di sisi server untuk memberikan respons pencarian instan berlatensi rendah.

---

## 5. Publisher Service

### 5.1 Tujuan
Menyediakan portal mandiri bagi para kreator untuk merancang, mengunggah, menguji kelayakan teknis, menandatangani kode secara digital, dan memantau analitik performa dari modul buatan mereka.

### 5.2 Peran dalam Arsitektur ASE
Bertindak sebagai infrastruktur hulu penyuplai konten modul tepercaya ke dalam jaringan ekosistem *Marketplace*.

### 5.3 Responsibility (Tanggung Jawab)
*   Menyediakan simulator otomatis untuk uji kelayakan kontrak modul (*Contract Validator*).
*   Menangani proses penandatanganan digital kriptografis modul (*Code Signing*).
*   Menyajikan dasbor performa bisnis (analitik unduhan, retensi, pendapatan finansial).
*   Mengelola distribusi pembaruan versi (rilis alfa, beta, stabil).

### 5.4 Data Model
```typescript
export interface PublisherProfile {
  publisherId: string;
  companyName: string;
  website: string;
  verifiedStatus: boolean;
  publicKey: string;                 // Kunci publik terdaftar untuk verifikasi tanda tangan pengembang
  revenueBalance: number;
}
```

### 5.5 Public API
```typescript
export interface IPublisherService {
  uploadModulePackage(filePayload: any): Promise<{ uploadId: string; logs: string[] }>;
  signModule(uploadId: string, privateKey: string): Promise<{ signature: string }>;
  publishModule(uploadId: string, releaseType: 'alpha' | 'beta' | 'stable'): Promise<boolean>;
  getPublisherAnalytics(publisherId: string): Promise<{ downloads: number; earnings: number; activeInstalls: number }>;
}
```

### 5.6 Event yang Dipublikasikan
*   `Publisher.ModuleSubmitted`: Dipublikasikan saat pengembang selesai mengunggah workbook baru.
*   `Publisher.ValidationPassed`: Dipublikasikan setelah paket dinilai aman dan lolos uji standardisasi.
*   `Publisher.ValidationFailed`: Dipublikasikan apabila terjadi kecacatan manifest atau skema data salah.

### 5.7 Event yang Didengarkan
*   `Payment.TransactionSuccess`: Memicu pembagian margin keuntungan langsung ke dompet publisher.

### 5.8 Dependency
*   `Identity Service` (untuk otentikasi pengembang).
*   `Marketplace Service` (untuk sinkronisasi katalog publik).

### 5.9 Security & Guardian Policy
Seluruh proses penandatanganan biner `.aseb` menggunakan sistem persetujuan kunci ganda (Multi-sig: Kunci Pengembang & Kunci Platform ASE) untuk memastikan tidak ada perubahan kode tidak terdeteksi oleh peretas.

### 5.10 Lifecycle
`Draft` ──> `Validating` ──> `Approved` ──> `Signed` ──> `ActiveMarket`.

### 5.11 Contoh Implementasi (Validation Core Logic)
```typescript
export class PublisherValidator {
  validateManifest(manifest: any): string[] {
    const errors: string[] = [];
    if (!manifest.id) errors.push("ID Modul wajib diisi.");
    if (!manifest.version) errors.push("Versi modul (SemVer) tidak valid.");
    if (!manifest.capabilities) errors.push("Deklarasi Capability Contract tidak ditemukan.");
    return errors;
  }
}
```

### 5.12 Diagram Arsitektur
```text
[Developer CLI / Portal] ──> [Publisher Gateway API] ──> [Automated Sandbox Validator]
                                                                │
                                                ┌───────────────┴───────────────┐
                                                ▼                               ▼
                                       [Secure Signing HSM]             [Marketplace Core]
```

### 5.13 Contoh Alur Penggunaan
1. Pengembang mengunggah berkas `workbook.aseb` via portal web.
2. Server menjalankan `Automated Sandbox Validator` ──> Hasil validasi lolos ──> Server menerbitkan kunci enkripsi rilis.

### 5.14 Best Practice
Gunakan format manifest bertipe skema JSON kokoh (*strict JSON schema*) dengan penanganan autolinting di sisi VS Code Extension pengembang untuk meminimalkan kegagalan validasi hulu.

### 5.15 Risiko & Mitigasi
*   *Risiko*: Pengembang menyisipkan naskah jahat terenkripsi di dalam aset gambar atau naskah *build.js* yang lolos linter dasar.
*   *Mitigasi*: Batasi hak akses runtime modul secara luring penuh di sisi klien menggunakan sandboxing Iframe ketat dengan atribut pembatas (*sandbox context with no-same-origin*).

### 5.16 Rekomendasi Implementasi
Buat command line tool `ase-cli` berbasis Node.js yang mempermudah pengembang melakukan pengujian manifest di komputer lokal sebelum mengunggah.

---

## 6. Cloud Sync Service

### 6.1 Tujuan
Mengelola replikasi data database bersama antara media penyimpanan lokal aman dengan media penyimpanan cloud terenkripsi secara luring-pertama (*offline-first*).

### 6.2 Peran dalam Arsitektur ASE
Menjamin keutuhan data pengguna saat berganti perangkat tanpa mengompromikan performa luring aplikasi.

### 6.3 Responsibility (Tanggung Jawab)
*   Melacak perubahan mutasi data lokal menggunakan nomor urut log (*logical clocks / vector clocks*).
*   Menangani resolusi konflik otomatis (*Conflict-Free Replicated Data Types - CRDT*).
*   Menyediakan proses sinkronisasi bertahap hemat bandwidth (*Incremental Sync*).
*   Menerapkan enkripsi ujung-ke-ujung (*End-to-End Encryption - E2EE*) berbasis kunci privat pengguna sebelum data diunggah ke awan.

### 6.4 Data Model
```typescript
export interface SyncLog {
  logId: string;
  tableName: string;
  recordId: string;
  action: 'insert' | 'update' | 'delete';
  vectorClock: Record<string, number>; // e.g. { "deviceA": 12, "deviceB": 8 }
  encryptedPayload: string;            // Payload terenkripsi E2EE
  timestamp: string;
}
```

### 6.5 Public API
```typescript
export interface ICloudSyncService {
  queueLocalChange(change: Omit<SyncLog, 'logId' | 'vectorClock' | 'timestamp'>): Promise<void>;
  synchronize(): Promise<{ status: 'synced' | 'conflict_resolved' | 'error'; syncedCount: number }>;
  resolveConflict(conflictId: string, choice: 'local' | 'cloud' | 'merge'): Promise<void>;
  setEncryptionKey(keyPhrase: string): Promise<void>;
}
```

### 6.6 Event yang Dipublikasikan
*   `Sync.Started`: Dipublikasikan saat sinkronisasi data dimulai.
*   `Sync.Completed`: Dipublikasikan ketika replikasi data selesai sukses.
*   `Sync.ConflictDetected`: Dipublikasikan jika terdapat modifikasi bertabrakan dari dua perangkat berbeda.

### 6.7 Event yang Didengarkan
*   `Database.RecordChanged`: Memicu antrian log perubahan data baru.

### 6.8 Dependency
*   `Local Secure Storage` (untuk mengantre log sinkronisasi).
*   `Identity Service` (untuk penentuan jalur penyimpanan terisolasi milik user).

### 6.9 Security & Guardian Policy
Seluruh data dienkripsi menggunakan metode AES-256-GCM di sisi klien sebelum dikirim. Server cloud sama sekali tidak memiliki kemampuan membaca isi data mentah pengguna (*Zero-Knowledge Storage*).

### 6.10 Lifecycle
`Idle` ──> `Detecting` ──> `Encrypting/Decrypting` ──> `Syncing` ──> `Resolved`.

### 6.11 Contoh Implementasi (Vector Clock Resolver Mock)
```typescript
export class CloudSyncService implements ICloudSyncService {
  private localKey: string = "";

  async queueLocalChange(change: any) {
    const payload = await this.encryptAES(JSON.stringify(change.data), this.localKey);
    const log: SyncLog = {
      logId: "log_" + Math.random().toString(),
      tableName: change.tableName,
      recordId: change.recordId,
      action: change.action,
      vectorClock: { "thisDevice": 1 },
      encryptedPayload: payload,
      timestamp: new Date().toISOString()
    };
    await this.saveLogToLocalQueue(log);
  }
  private async encryptAES(data: string, key: string): Promise<string> {
    return "enc_" + btoa(data); // Penyederhanaan visual untuk arsitektur
  }
  async synchronize() { return { status: 'synced' as const, syncedCount: 0 }; }
  async resolveConflict() {}
  async setEncryptionKey(key: string) { this.localKey = key; }
  private async saveLogToLocalQueue(log: any) {}
}
```

### 6.12 Diagram Arsitektur
```text
[Local IndexedDB] ──> [Sync Queue Loader] ──(E2EE Encrypt)──> [HTTPS Gateway]
                                                                     │
                                                                     ▼
                                                             [Cloud Storage]
```

### 6.13 Contoh Alur Penggunaan
1. Pengguna menambahkan tugas di Planner saat di pesawat (luring) ──> Log disimpan di IndexedDB lokal.
2. Pengguna mendapatkan koneksi internet ──> `CloudSyncService` otomatis memicu `synchronize()`.
3. Log dikirim bertahap ──> Status berubah sukses terreplikasi.

### 6.14 Best Practice
Gunakan pustaka IndexedDB handal seperti `RxDB` atau `PouchDB` yang telah memiliki algoritma replikasi bawan berskala matang untuk peramban web.

### 6.15 Risiko & Mitigasi
*   *Risiko*: Kebocoran kunci privat E2EE oleh pengguna akibat lupa frasa sandi kunci.
*   *Mitigasi*: Sediakan mekanisme ekspor file kunci darurat (*Emergency Recovery Sheet*) fisik bercode QR saat pertama kali setup E2EE.

### 6.16 Rekomendasi Implementasi
Rancang database server menggunakan Google Cloud Firestore yang mendukung penuh integrasi offline-persistence serta sinkronisasi waktu riil (*real-time listener*) secara native.

---

## 7. Notification Service

### 7.1 Tujuan
Menghantarkan pengingat, notifikasi pemicu alur kerja, dan notifikasi analisis keputusan secara kontekstual, tepat waktu, dan tidak mengganggu produktivitas pengguna.

### 7.2 Peran dalam Arsitektur ASE
Menjadi saluran penyampaian hasil bimbingan *Coaching OS* dan analisis *Decision Engine* langsung ke perhatian pengguna.

### 7.3 Responsibility (Tanggung Jawab)
*   Mengelola jadwal pengingat lokal tanpa server (*Local Scheduled Notifications*).
*   Menangani integrasi Push Notification sistem operasi (FCM/APNs) saat daring.
*   Mengirim notifikasi ringkasan laporan analisis harian via email.
*   Mengatur prioritas pengiriman berdasarkan kategori (Darurat, Edukasi, Informasi).

### 7.4 Data Model
```typescript
export interface ASENotification {
  notificationId: string;
  title: string;
  body: string;
  category: 'critical_decision' | 'workflow_trigger' | 'scheduled_reminder' | 'coaching_insight';
  actionDeepLink?: string;            // Navigasi instan ke halaman modul terkait
  scheduledTime?: string;             // ISO 8601 untuk notifikasi tunda
  deliveryStatus: 'queued' | 'delivered' | 'read' | 'failed';
}
```

### 7.5 Public API
```typescript
export interface INotificationService {
  showLocalNotification(title: string, body: string, payload?: any): Promise<void>;
  scheduleNotification(notification: Omit<ASENotification, 'notificationId' | 'deliveryStatus'>): Promise<string>;
  cancelNotification(notificationId: string): Promise<boolean>;
  registerPushToken(token: string, platform: 'web' | 'android' | 'ios'): Promise<boolean>;
}
```

### 7.6 Event yang Dipublikasikan
*   `Notification.Delivered`: Dipublikasikan saat pesan sukses muncul di layar pengguna.
*   `Notification.Clicked`: Dipublikasikan saat pengguna menekan pesan notifikasi.

### 7.7 Event yang Didengarkan
*   `Workflow.ActionTriggered`: Memicu pembuatan notifikasi instruksi instan.
*   `Decision.InsightGenerated`: Memicu pengiriman ringkasan kritik penting ke panel notifikasi.

### 7.8 Dependency
*   `Identity Service` (untuk pengalamatan push token dan email).

### 7.9 Security & Guardian Policy
Isi notifikasi tidak boleh memuat data transaksi keuangan atau informasi rahasia secara gamblang tanpa perlindungan sensor privasi jika perangkat dalam kondisi layar terkunci.

### 7.10 Lifecycle
`Queued` ──> `Dispatched` ──> `Presented` ──> `Clicked` / `Dismissed`.

### 7.11 Contoh Implementasi (Service Worker Registration Web Mock)
```typescript
export class NotificationService implements INotificationService {
  async showLocalNotification(title: string, body: string, payload?: any): Promise<void> {
    if ('Notification' in window && Notification.permission === 'granted') {
      const reg = await navigator.serviceWorker.ready;
      await reg.showNotification(title, {
        body: body,
        icon: '/assets/icon_logo.png',
        tag: 'ase-notification',
        data: payload
      });
    }
  }
  async scheduleNotification(notif: any) { return "notif_id_" + Math.random().toString(); }
  async cancelNotification() { return true; }
  async registerPushToken() { return true; }
}
```

### 7.12 Diagram Arsitektur
```text
[Event / Decision Engine] ──> [Notification Service] ──> [Device Notification Manager]
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
         [Local Service Worker]          [Firebase Cloud Messaging]
```

### 7.13 Contoh Alur Penggunaan
1. Pengeluaran melebihi anggaran 70% ──> `WorkflowEngine` menangkap kejadian ──> Memanggil `scheduleNotification()`.
2. Pengguna menerima peringatan berprioritas tinggi di layar kunci HP.

### 7.14 Best Practice
Gunakan pengelompokan pesan (*Notification Channels / Categories*) agar pengguna memiliki kontrol penuh untuk mematikan notifikasi tipe non-kritis tanpa menonaktifkan notifikasi kritis.

### 7.15 Risiko & Mitigasi
*   *Risiko*: Pengguna merasa terganggu oleh jumlah notifikasi harian yang berlebihan (*notification fatigue*).
*   *Mitigasi*: Integrasikan fitur "Quiet Hours" bawaan di dalam pengaturan notifikasi global ASE.

### 7.16 Rekomendasi Implementasi
Gunakan Firebase Cloud Messaging (FCM) karena mendukung pengiriman push notification gratis berskala tinggi baik untuk platform web, android, maupun iOS secara seragam.

---

## 8. AI Gateway

### 8.1 Tujuan
Menyediakan gerbang komunikasi aman yang agnostik terhadap penyedia model kecerdasan buatan, mengontrol kuota penggunaan, mengawasi biaya token, serta memastikan AI hanya bertindak sebagai pembuat rekomendasi asisten tepercaya tanpa hak mutasi data langsung.

### 8.2 Peran dalam Arsitektur ASE
Bertindak sebagai satu-satunya jembatan penghubung modul-modul `.aseb` dengan model kecerdasan buatan eksternal (Gemini, OpenAI, Anthropic, Ollama lokal).

### 8.3 Responsibility (Tanggung Jawab)
*   Mengabstraksi sintaksis API model dari berbagai vendor menjadi satu API standar.
*   Mengawasi pemakaian jumlah token (*Token Usage Monitoring*) dan membatasi kuota harian.
*   Mencegah modifikasi data database pengguna secara langsung oleh AI (AI hanya mengembalikan rekomendasi berformat JSON).
*   Menyimpan riwayat naskah prompt terstandardisasi (*Prompt Templates*).

### 8.4 Data Model
```typescript
export interface AIChatCompletionRequest {
  modelName: string;
  provider: 'google' | 'openai' | 'anthropic' | 'ollama';
  messages: { role: 'system' | 'user' | 'assistant'; content: string }[];
  temperature?: number;
  maxTokens?: number;
}

export interface AICallLog {
  logId: string;
  moduleId: string;
  provider: string;
  modelUsed: string;
  tokensConsumed: { prompt: number; completion: number };
  estimatedCostUSD: number;
  timestamp: string;
}
```

### 8.5 Public API
```typescript
export interface IAIGateway {
  generateText(moduleId: string, request: AIChatCompletionRequest): Promise<{ content: string; usage: AICallLog['tokensConsumed'] }>;
  generateStructuredJSON<T>(moduleId: string, request: AIChatCompletionRequest, schema: any): Promise<{ data: T; usage: AICallLog['tokensConsumed'] }>;
  getModuleQuota(moduleId: string): Promise<{ limit: number; currentUsage: number }>;
}
```

### 8.6 Event yang Dipublikasikan
*   `AIGateway.CallInitiated`: Dipublikasikan sesaat sebelum muatan prompt dikirim ke API vendor.
*   `AIGateway.CallCompleted`: Dipublikasikan setelah jawaban asisten diterima lengkap beserta statistik token.
*   `AIGateway.QuotaExceeded`: Dipublikasikan apabila porsi jatah kueri bulanan pengembang habis.

### 8.7 Event yang Didengarkan
*   `Core.ModuleUninstalled`: Memicu pembersihan jatah alokasi memori context model terkait.

### 8.8 Dependency
*   `Identity Service` (untuk otorisasi lisensi pemakaian kueri premium).

### 8.9 Security & Guardian Policy
AI Gateway melarang keras pengiriman data identitas pribadi mentah (nama lengkap, NIK, kartu kredit) tanpa enkripsi atau masking pengaburan data di sisi klien sebelum data dikirim ke penyedia awan pihak ketiga.

### 8.10 Lifecycle
`RequestRecieved` ──> `PromptSanitization` ──> `Executing` ──> `TokenCounting` ──> `Delivered`.

### 8.11 Contoh Implementasi (Gemini SDK Decoupled Mock)
```typescript
export class AIGatewayService implements IAIGateway {
  async generateStructuredJSON<T>(moduleId: string, request: AIChatCompletionRequest, schema: any): Promise<{ data: T; usage: any }> {
    // Sanitisasi prompt dari data pribadi rahasia
    const sanitizedMessages = this.sanitizePrompt(request.messages);
    
    // Inisialisasi API aslinya menggunakan SDK (contoh: Google GenAI SDK)
    const rawResponse = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${process.env.GEMINI_API_KEY}` },
      body: JSON.stringify({ contents: sanitizedMessages, generationConfig: { responseMimeType: "application/json", responseSchema: schema } })
    });
    
    const result = await rawResponse.json();
    return {
      data: JSON.parse(result.candidates[0].content.parts[0].text) as T,
      usage: { prompt: 120, completion: 80 }
    };
  }
  private sanitizePrompt(messages: any[]) { return messages; }
  async generateText() { return { content: "", usage: { prompt: 0, completion: 0 }}; }
  async getModuleQuota() { return { limit: 100, currentUsage: 2 }; }
}
```

### 8.12 Diagram Arsitektur
```text
[Module Logic] ──> [AI Gateway API] ──(Anonymizer Filter)──> [HTTPS SDK Router]
                                                                   │
                                                ┌──────────────────┼──────────────────┐
                                                ▼                  ▼                  ▼
                                           [Gemini API]       [OpenAI API]      [Ollama Local]
```

### 8.13 Contoh Alur Penggunaan
1. `DecisionEngine` membutuhkan analisis anggaran bulanan ──> Memanggil `generateStructuredJSON()` ke AI Gateway.
2. AI Gateway mengaburkan data sensitif ──> Memanggil model Gemini ──> Mengembalikan analisis keputusan berformat JSON kokoh yang aman dipetakan ke UI.

### 8.14 Best Practice
Dukung pemrosesan kecerdasan buatan luring penuh menggunakan LLM berukuran kompak (misal: Google Gemma 2B atau Phi-3) melalui penanganan WebGPU (Ollama/WebLLM) pada peranti berspesifikasi memadai.

### 8.15 Risiko & Mitigasi
*   *Risiko*: Kebocoran kunci rahasia API Key server-side oleh modul pihak ketiga yang menyisipkan kueri bypass.
*   *Mitigasi*: Enkapsulasi seluruh rute kunci API di lapisan server backend terproteksi. Klien dilarang keras menyimpan kunci API utama.

### 8.16 Rekomendasi Implementasi
Gunakan pustaka `@google/genai` TypeScript SDK resmi untuk koneksi ke model Gemini, pasang validasi skema keluaran berbasis JSON Schema menggunakan zod.

---

## 9. Search Service

### 9.1 Tujuan
Menyediakan fungsionalitas pencarian universal satu pintu (*Universal Omni-Search*) berlatensi sangat rendah yang mampu mengindeks, mencocokkan, dan menampilkan hasil pencarian data dari seluruh modul aktif secara terintegrasi.

### 9.2 Peran dalam Arsitektur ASE
Mempermudah penemuan berkas data, target, insight, riwayat tindakan, dan catatan pembelajaran lintas workbook dari satu kolom pencarian terpusat.

### 9.3 Responsibility (Tanggung Jawab)
*   Membangun indeks pencarian asinkron dari seluruh database bersama (*Shared Database*).
*   Menyajikan pencarian berbasis pencocokan kemiripan teks (*Fuzzy Text Matching*).
*   Menghormati batasan izin baca (*Permission Contract*) dari masing-masing workbook.
*   Menyediakan kategorisasi instan hasil pencarian berdasarkan jenis resource.

### 9.4 Data Model
```typescript
export interface SearchResultItem {
  id: string;                        // ID asli record data
  moduleId: string;                  // Modul pemilik data
  resourceType: 'goal' | 'task' | 'transaction' | 'contact' | 'knowledge' | 'insight';
  title: string;
  subtitle?: string;
  score: number;                     // Skor relevansi pencarian (0.00 s/d 1.00)
  deepLink: string;                  // Tautan instan navigasi internal
  updatedAt: string;
}
```

### 9.5 Public API
```typescript
export interface ISearchService {
  search(query: string, options?: { limit?: number; moduleScope?: string[]; typeScope?: string[] }): Promise<SearchResultItem[]>;
  reindexAll(): Promise<void>;
  updateIndex(item: Omit<SearchResultItem, 'score'>): Promise<void>;
  removeFromIndex(itemId: string): Promise<void>;
}
```

### 9.6 Event yang Dipublikasikan
*   `Search.QueryExecuted`: Dipublikasikan sesaat setelah kueri pencarian diproses sukses.
*   `Search.IndexUpdated`: Dipublikasikan saat indeks pencarian mengalami penyegaran data baru.

### 9.7 Event yang Didengarkan
*   `Database.RecordInserted`: Memicu pembaruan indeks pencarian secara asinkron.
*   `Database.RecordDeleted`: Memicu pembersihan entri lama dari tabel indeks.

### 9.8 Dependency
*   `Local Secure Storage` (untuk penempatan tabel indeks teks cepat).

### 9.9 Security & Guardian Policy
Hasil pencarian wajib mematuhi aturan otorisasi aktif. Item data dari modul yang dinonaktifkan atau modul dengan izin baca tertutup dilarang keras muncul di halaman hasil pencarian.

### 10.10 Lifecycle
`OfflineReady` ──> `Indexing` ──> `Querying` ──> `Delivering`.

### 9.11 Contoh Implementasi (Fuzzy In-Memory Search Mock)
```typescript
export class InMemorySearchService implements ISearchService {
  private indexStore: Map<string, Omit<SearchResultItem, 'score'>> = new Map();

  async search(query: string): Promise<SearchResultItem[]> {
    const term = query.toLowerCase();
    const results: SearchResultItem[] = [];
    
    for (const [id, item] of this.indexStore.entries()) {
      if (item.title.toLowerCase().includes(term) || (item.subtitle && item.subtitle.toLowerCase().includes(term))) {
        results.push({
          ...item,
          score: 0.95 // Skor kemiripan tiruan
        });
      }
    }
    return results.sort((a, b) => b.score - a.score);
  }
  async updateIndex(item: any) { this.indexStore.set(item.id, item); }
  async removeFromIndex(itemId: string) { this.indexStore.delete(itemId); }
  async reindexAll() {}
}
```

### 9.12 Diagram Arsitektur
```text
[Universal Search Box] ──> [Search Service API] ──(Permission Check)──> [In-Memory Index Store]
                                                                              ▲
                                                                     (Async Pub/Sub Sync)
                                                                              │
                                                                     [All Module Records]
```

### 9.13 Contoh Alur Penggunaan
1. Pengguna mengetik kata "Investasi" di bilah pencarian utama.
2. `SearchService` menyisir indeks terintegrasi ──> Menghasilkan daftar berisi: Transaksi reksa dana dari *Finance*, Target pembelajaran dari *Planner*, dan catatan *Knowledge Engine* dari modul terkait.

### 9.14 Best Practice
Gunakan pengindeksan asinkron berbasis peramban peredam hentakan (*Debounced Async Indexing*) agar pemrosesan indeks pencarian tidak membekukan kelancaran render UI utama.

### 9.15 Risiko & Mitigasi
*   *Risiko*: Indeks pencarian membengkak secara drastis mengonsumsi memori ponsel pintar setelah ribuan log transaksi tersimpan.
*   *Mitigasi*: Batasi ukuran maksimal teks terindeks per item (*Token Truncation*) dan simpan indeks di dalam IndexedDB bukan di dalam memori statis RAM.

### 9.16 Rekomendasi Implementasi
Gunakan pustaka mesin pencari teks lengkap ringan `MiniSearch` atau `FlexSearch` yang diintegrasikan langsung di dalam *Shared Service Layer*.

---

## 10. Backup Service

### 10.1 Tujuan
Menyediakan jaminan keselamatan data maksimal melalui pembuatan berkas cadangan data terenkripsi secara luring maupun daring, memfasilitasi pemulihan sistem darurat tanpa mengancam kerahasiaan berkas pengguna.

### 10.2 Peran dalam Arsitektur ASE
Menjadi sistem pengaman tingkat dasar (*Safety Net*) yang menjamin kelangsungan ekosistem data pribadi pengguna di masa depan.

### 10.3 Responsibility (Tanggung Jawab)
*   Mengompilasi seluruh tabel data bersama dan skema workbook menjadi satu berkas cadangan (.asebackup).
*   Menyediakan opsi enkripsi berkas cadangan menggunakan kata sandi kustom pengguna.
*   Mengelola jadwal pembuatan cadangan berkala secara otomatis (harian/mingguan).
*   Melakukan verifikasi integritas struktur berkas cadangan sebelum melakukan pemulihan (*Restore integrity check*).

### 10.4 Data Model
```typescript
export interface BackupMetadata {
  backupId: string;
  fileName: string;
  fileSize: number;
  encrypted: boolean;
  versionCompatible: string;         // Versi core pembuat cadangan
  modulesSaved: string[];            // Daftar ID modul yang tercakup
  createdAt: string;
  integrityHash: string;             // Hash SHA-256 untuk deteksi korupsi berkas
}
```

### 10.5 Public API
```typescript
export interface IBackupService {
  createBackup(options?: { encrypt: boolean; password?: string }): Promise<{ backupFileBlob: Blob; meta: BackupMetadata }>;
  restoreFromBackup(backupFileBlob: Blob, password?: string): Promise<{ success: boolean; logs: string[] }>;
  listLocalBackups(): Promise<BackupMetadata[]>;
  deleteBackup(backupId: string): Promise<boolean>;
}
```

### 10.6 Event yang Dipublikasikan
*   `Backup.Created`: Dipublikasikan saat proses pengarsipan data sukses selesai.
*   `Backup.RestoreSuccess`: Dipublikasikan ketika sistem berhasil melakukan pemulihan penuh data.
*   `Backup.RestoreFailed`: Dipublikasikan jika proses pemulihan gagal akibat kunci enkripsi salah atau berkas rusak.

### 10.7 Event yang Didengarkan
*   `Core.DailyMaintenance`: Memicu pencadangan terjadwal otomatis di latar belakang.

### 10.8 Dependency
*   `Local Secure Storage` (untuk mengumpulkan data mentah database).
*   `Identity Service` (untuk verifikasi otorisasi pemilik data cadangan).

### 10.9 Security & Guardian Policy
Berkas cadangan yang diekspor menggunakan standar enkripsi simetris tangguh PBKDF2 dengan enkapsulasi kunci AES-GCM 256-bit, menjamin berkas cadangan tetap aman diletakkan di penyedia cloud publik mana pun.

### 10.10 Lifecycle
`Idle` ──> `DataGathering` ──> `Encrypting` ──> `Compacting` ──> `Archived`.

### 10.11 Contoh Implementasi (Export Engine Mock)
```typescript
export class BackupService implements IBackupService {
  async createBackup(options?: { encrypt: boolean; password?: string }) {
    const rawData = await this.dumpAllTables();
    let finalBlobPayload = JSON.stringify(rawData);
    
    if (options?.encrypt && options.password) {
      finalBlobPayload = await this.encryptPayload(finalBlobPayload, options.password);
    }
    
    const meta: BackupMetadata = {
      backupId: "bk_" + Math.random().toString(),
      fileName: `ase_backup_${new Date().toISOString().split('T')[0]}.asebackup`,
      fileSize: finalBlobPayload.length,
      encrypted: !!options?.encrypt,
      versionCompatible: "1.0.0",
      modulesSaved: ["wb-finance", "wb-planner"],
      createdAt: new Date().toISOString(),
      integrityHash: "sha256_hash_mock"
    };
    
    return {
      backupFileBlob: new Blob([finalBlobPayload], { type: 'application/octet-stream' }),
      meta
    };
  }
  private async dumpAllTables(): Promise<any> { return {}; }
  private async encryptPayload(payload: string, key: string): Promise<string> { return payload; }
  async restoreFromBackup() { return { success: true, logs: [] }; }
  async listLocalBackups() { return []; }
  async deleteBackup() { return true; }
}
```

### 10.12 Diagram Arsitektur
```text
[Backup Manager UI] ──> [Backup Service API] ──(Gather DB Tables)──> [Secure Compacter]
                                                                           │
                                                           ┌───────────────┴───────────────┐
                                                           ▼                               ▼
                                                 [Local File Export]               [Cloud Backup Push]
```

### 10.13 Contoh Alur Penggunaan
1. Jadwal mingguan tercapai ──> `BackupService` memicu `createBackup(encrypt: true, userPassword)`.
2. Hasil kompresi aman dikirim langsung ke folder "Download" lokal milik pengguna.

### 10.14 Best Practice
Terapkan batasan masa simpan cadangan (*Backup Retention Policy*) lokal maksimal 5 cadangan terbaru untuk mencegah kepenuhan ruang penyimpanan perangkat keras ponsel pintar.

### 10.15 Risiko & Mitigasi
*   *Risiko*: Berkas cadangan terpotong di tengah jalan (*corrupt backup file*) akibat memori peramban habis saat memproses data berukuran raksasa.
*   *Mitigasi*: Jalankan sistem pencadangan secara terpisah berarsitektur streaming (*Data Chunk Streaming*) daripada mengumpulkan data secara instan di memori RAM.

### 10.16 Rekomendasi Implementasi
Gunakan format data standardisasi SQLite, JSON, atau MessagePack sebagai basis struktur data cadangan biner (.asebackup) yang mudah dibaca di peramban dan mobile.

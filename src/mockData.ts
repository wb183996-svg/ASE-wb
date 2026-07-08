/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Workbook, 
  DailyActivity,
  FinanceRecord,
  TaskRecord,
  HabitRecord,
  CrmRecord,
  TradingRecord,
  OkrRecord,
  RelationshipRecord,
  SharedContact,
  Goal,
  TimelineItem
} from './types';

export const INITIAL_WORKBOOKS: Workbook[] = [
  {
    id: 'wb-keuangan',
    title: 'Keuangan Pribadi',
    description: 'Buku kerja digital untuk memetakan pendapatan, mengalokasikan anggaran bulanan secara cerdas (metode 50/30/20), membangun dana darurat, serta merencanakan masa depan finansial yang kokoh.',
    category: 'Keuangan',
    difficulty: 'Pemula',
    duration: '3 Jam',
    progress: 60,
    coverGradient: 'from-emerald-500 to-teal-700',
    author: 'ASE Finance Core Team',
    isDownloaded: true,
    rating: 4.9,
    totalChapters: 2,
    version: 'v1.1.2',
    developer: 'ASE Finance Core',
    size: '28 KB',
    icon: 'wallet',
    features: [
      'Alokasi Anggaran Otomatis (Metode 50/30/20)',
      'Kalkulator Dana Darurat Terpadu',
      'Peta Arus Kas Harian & Bulanan',
      'Visualisasi Alokasi & Pengeluaran'
    ],
    input: [
      'Pendapatan Bulanan Bersih',
      'Pengeluaran Kebutuhan Pokok (Needs)',
      'Pengeluaran Keinginan (Wants)',
      'Tabungan & Investasi Saat Ini'
    ],
    output: [
      'Rasio Kesehatan Finansial',
      'Rekomendasi Alokasi Dana Riil',
      'Proyeksi Pertumbuhan Dana Darurat'
    ],
    chapters: [
      {
        id: 'wb-keu-ch1',
        title: 'Bab 1: Menakar Anggaran dengan Aturan 50/30/20',
        subtitle: 'Membagi pendapatan secara seimbang untuk kebutuhan, keinginan, dan tabungan.',
        content: `Aturan anggaran 50/30/20 adalah salah satu metode pengelolaan keuangan paling sederhana namun sangat ampuh. Formula ini membagi penghasilan bersih bulanan Anda ke dalam tiga kategori utama:

1. 50% untuk Kebutuhan Pokok (Needs): Sewa rumah, cicilan, belanja dapur harian, transportasi, serta tagihan listrik dan air wajib.
2. 30% untuk Keinginan (Wants): Hiburan, rekreasi, makan di restoran kustom, hobi, serta langganan digital.
3. 20% untuk Tabungan & Investasi (Savings): Pengisian dana darurat, investasi reksa dana/saham, serta pelunasan utang.

Melalui Buku Kerja ini, data pendapatan yang dimasukkan akan secara otomatis terdistribusi ke dalam tiga pilar ini agar Anda tidak mengalami kondisi defisit keuangan di akhir bulan.`,
        completed: true,
        notes: 'Alokasi pendapatan saya bulan ini sudah tepat 50% untuk kebutuhan dasar.',
        questions: [
          {
            id: 'wb-keu-ch1-q1',
            text: 'Berapa persen alokasi pendapatan bersih yang disarankan untuk Kebutuhan Pokok (Needs) dalam metode 50/30/20?',
            options: [
              '20%',
              '30%',
              '50%',
              '80%'
            ],
            correctAnswerIndex: 2,
            selectedAnswerIndex: 2
          },
          {
            id: 'wb-keu-ch1-q2',
            text: 'Manakah di bawah ini yang tergolong dalam alokasi 30% Keinginan (Wants)?',
            options: [
              'Biaya sewa rumah tahunan',
              'Susu bayi dan kebutuhan dapur pokok',
              'Makan malam mewah di akhir pekan dan langganan streaming film',
              'Membayar tagihan listrik utama'
            ],
            correctAnswerIndex: 2,
            selectedAnswerIndex: 2
          }
        ]
      },
      {
        id: 'wb-keu-ch2',
        title: 'Bab 2: Formulasi Dana Darurat yang Aman',
        subtitle: 'Mengamankan jaring penyelamat finansial sebelum mulai berinvestasi aktif.',
        content: `Dana Darurat (Emergency Fund) adalah benteng pertahanan pertama Anda dari ketidakpastian hidup seperti pemutusan hubungan kerja, sakit, atau renovasi rumah mendadak.

Rasio ideal dana darurat:
- Lajang / Belum Berkeluarga: Cukup mengumpulkan 3-6 bulan pengeluaran bulanan.
- Menikah: Disarankan 6-9 bulan pengeluaran bulanan.
- Menikah dengan Anak: Disarankan 9-12 bulan pengeluaran bulanan.

Seluruh data dana darurat ini terhubung langsung dengan Data Bersama ASE Workbook, sehingga saat Anda memperbarui jumlah tabungan di buku kerja lain, jumlah dana darurat di sini juga akan otomatis tersinkronisasi.`,
        completed: false,
        questions: [
          {
            id: 'wb-keu-ch2-q1',
            text: 'Berapakah jumlah pengeluaran bulanan ideal yang harus dicadangkan sebagai dana darurat bagi individu lajang?',
            options: [
              '1 bulan saja',
              '3 sampai 6 bulan',
              '12 sampai 24 bulan',
              'Tidak perlu sama sekali jika sudah berinvestasi'
            ],
            correctAnswerIndex: 1,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-planner',
    title: 'Planner Harian & Time Blocking',
    description: 'Rancang agenda harian yang produktif dengan metode penentuan prioritas Matriks Eisenhower serta teknik Time Blocking demi meminimalkan distraksi.',
    category: 'Planner',
    difficulty: 'Pemula',
    duration: '2 Jam',
    progress: 40,
    coverGradient: 'from-green-600 to-emerald-800',
    author: 'ASE Productivity Team',
    isDownloaded: true,
    rating: 4.8,
    totalChapters: 2,
    version: 'v2.0.1',
    developer: 'ASE Productivity Lab',
    size: '22 KB',
    icon: 'calendar',
    features: [
      'Visualisasi Blok Waktu (Time Blocking)',
      'Matriks Prioritas Eisenhower (Penting vs Mendesak)',
      'Evaluasi Kepuasan & Energi Akhir Hari',
      'Sinkronisasi Kalender Tugas Bersama'
    ],
    input: [
      'Daftar Tugas Harian (To-Do List)',
      'Tingkat Urgensi & Kepentingan Tugas',
      'Jam Kerja Aktif'
    ],
    output: [
      'Jadwal Blok Waktu Terstruktur',
      'Skor Fokus Harian',
      'Rekomendasi Jam Kerja Paling Produktif'
    ],
    chapters: [
      {
        id: 'wb-plan-ch1',
        title: 'Bab 1: Mengenal Metode Time Blocking',
        subtitle: 'Mengatur waktu kerja berdasarkan blok fokus, bukan sekadar list tugas mengambang.',
        content: `Metode Time Blocking adalah merencanakan hari Anda dengan membagi jam-jam kerja ke dalam blok waktu yang spesifik. Setiap blok didedikasikan hanya untuk menyelesaikan satu tugas tertentu (atau sekelompok tugas sejenis).

Manfaat utama dari Time Blocking:
1. Meminimalkan kebiasaan menunda (prokrastinasi).
2. Membantu Anda fokus penuh (deep work) tanpa beralih-alih tugas (multitasking).
3. Memberikan gambaran realistis berapa banyak tugas yang benar-benar bisa diselesaikan dalam sehari.

Melalui lembar kerja ini, Anda akan menuliskan agenda dari jam ke jam dan mengisinya dengan blok aktivitas terstruktur.`,
        completed: true,
        notes: 'Sangat terbantu membagi waktu untuk pengerjaan project di pagi hari.',
        questions: [
          {
            id: 'wb-plan-ch1-q1',
            text: 'Bagaimana cara kerja metode Time Blocking?',
            options: [
              'Membuat daftar tugas sebanyak mungkin tanpa peduli waktu',
              'Membagi jam-jam kerja ke dalam blok waktu yang spesifik untuk tugas tertentu',
              'Bekerja secara multitasking sepanjang hari',
              'Hanya bekerja ketika suasana hati sedang mendukung'
            ],
            correctAnswerIndex: 1,
            selectedAnswerIndex: 1
          }
        ]
      },
      {
        id: 'wb-plan-ch2',
        title: 'Bab 2: Memilah Tugas Melalui Matriks Eisenhower',
        subtitle: 'Memisahkan antara hal yang benar-benar penting dan yang sekadar mendesak.',
        content: `Gunakan Matriks Eisenhower untuk membagi tugas ke dalam 4 kuadran:
- Kuadran I: Penting & Mendesak (Lakukan Sekarang!)
- Kuadran II: Penting & Tidak Mendesak (Rencanakan/Jadwalkan!)
- Kuadran III: Tidak Penting & Mendesak (Delegasikan!)
- Kuadran IV: Tidak Penting & Tidak Mendesak (Eliminasi!)

Tugas-tugas di Kuadran II (Penting & Tidak Mendesak) adalah kunci utama pertumbuhan jangka panjang Anda.`,
        completed: false,
        questions: [
          {
            id: 'wb-plan-ch2-q1',
            text: 'Tugas yang bersifat Penting namun Tidak Mendesak (Kuadran II) sebaiknya diperlakukan bagaimana?',
            options: [
              'Segera didelegasikan ke orang lain',
              'Dihapus dari daftar karena membuang-buang waktu',
              'Dijadwalkan di kalender/blok waktu untuk dikerjakan secara fokus',
              'Dikerjakan paling terakhir sambil lalu saja'
            ],
            correctAnswerIndex: 2,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-habit',
    title: 'Habit Tracker (Pembangun Kebiasaan)',
    description: 'Sistem buku kerja modular untuk melacak, mengevaluasi, dan membangun kebiasaan positif harian dengan pendekatan psikologi perilaku atomic habits.',
    category: 'Pribadi',
    difficulty: 'Pemula',
    duration: '2 Jam',
    progress: 0,
    coverGradient: 'from-emerald-400 to-green-600',
    author: 'ASE Life Science Team',
    isDownloaded: false,
    rating: 4.7,
    totalChapters: 1,
    version: 'v1.0.4',
    developer: 'ASE Life Engine',
    size: '18 KB',
    icon: 'activity',
    features: [
      'Kalender Pelacak Kebiasaan Harian',
      'Grafik Konsistensi Berkelanjutan (Streaks)',
      'Modul Identifikasi Pemicu (Cues) Habit Negatif',
      'Aturan 2 Menit (The Two-Minute Rule)'
    ],
    input: [
      'Nama Kebiasaan Baru yang Diinginkan',
      'Pemicu Spesifik & Lokasi Pelaksanaan',
      'Evaluasi Check-In Harian'
    ],
    output: [
      'Persentase Keberhasilan Mingguan',
      'Analisis Faktor Pemicu Kegagalan Habit',
      'Skor Pembentukan Karakter Baru'
    ],
    chapters: [
      {
        id: 'wb-hab-ch1',
        title: 'Bab 1: Menancapkan Habit dengan Aturan 2 Menit',
        subtitle: 'Mempermudah langkah awal agar kebiasaan baru tidak membebani mental Anda.',
        content: `Ketika Anda memulai kebiasaan baru, ia harus membutuhkan waktu kurang dari dua menit untuk dilakukan. 

Sebagai contoh:
- "Membaca buku sebelum tidur" diubah menjadi "Membaca satu halaman saja".
- "Melakukan yoga 30 menit" diubah menjadi "Mengeluarkan matras yoga".
- "Berlari 5 kilometer" diubah menjadi "Mengikat tali sepatu lari".

Dengan mempermudah langkah awal, hambatan mental untuk memulai (activation energy) akan mengecil secara dramatis. Setelah Anda mulai, jauh lebih mudah untuk terus melanjutkannya.`,
        completed: false,
        questions: [
          {
            id: 'wb-hab-ch1-q1',
            text: 'Apa tujuan utama dari Aturan Dua Menit dalam membangun kebiasaan baru?',
            options: [
              'Memastikan kita menyelesaikan seluruh pekerjaan dalam dua menit',
              'Memperkecil hambatan mental awal agar kebiasaan tersebut sangat mudah dimulai',
              'Membatasi waktu olahraga harian',
              'Menghukum diri jika terlambat bangun pagi'
            ],
            correctAnswerIndex: 1,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-crm',
    title: 'CRM Sederhana & Manajemen Pelanggan',
    description: 'Kombinasi lembar kerja bisnis untuk UMKM guna melacak prospek, database pelanggan loyal, riwayat transaksi, serta alur pipa penjualan (pipeline) secara teratur.',
    category: 'Bisnis',
    difficulty: 'Menengah',
    duration: '4 Jam',
    progress: 0,
    coverGradient: 'from-emerald-600 to-teal-800',
    author: 'ASE Business Suite Team',
    isDownloaded: false,
    rating: 4.8,
    totalChapters: 1,
    version: 'v1.3.0',
    developer: 'ASE Business Suite',
    size: '42 KB',
    icon: 'users',
    features: [
      'Visualisasi Saluran Penjualan (Sales Pipeline)',
      'Database Informasi Kontak & Kategori Pelanggan',
      'Pencatatan Log Interaksi Komunikasi',
      'Kalkulator Estimasi Pendapatan Mendatang'
    ],
    input: [
      'Nama Kontak & Nama Bisnis Pelanggan',
      'Nilai Potensial Kesepakatan (Deal Value)',
      'Status Tahapan Hubungan (Prospek, Negosiasi, Closing)'
    ],
    output: [
      'Total Nilai Pipa Penjualan Aktif',
      'Rasio Konversi Penjualan Bisnis',
      'Rata-rata Waktu Siklus Penjualan'
    ],
    chapters: [
      {
        id: 'wb-crm-ch1',
        title: 'Bab 1: Mengelola Corong Penjualan (Sales Pipeline)',
        subtitle: 'Memvisualisasikan perjalanan prospek dari sekadar bertanya hingga membeli produk Anda.',
        content: `Corong penjualan (Sales Pipeline) membantu Anda memantau seluruh transaksi aktif yang sedang berjalan di bisnis Anda. Sederhananya, ini adalah peta jalan bagi calon pembeli.

Tahapan dasar pipa penjualan yang umum digunakan:
1. Hubungi Awal (Lead): Kontak baru yang menyatakan minat pada produk Anda.
2. Penjajakan / Diskusi (Meeting/Proposal): Memberikan penawaran harga atau konsultasi kebutuhan.
3. Negosiasi (Negotiation): Membicarakan kesepakatan harga, bonus, dan syarat pembayaran.
4. Selesai Terjual (Won): Prospek resmi membayar dan menjadi pelanggan aktif.
5. Gagal / Tertunda (Lost): Transaksi dibatalkan atau tertunda dalam waktu lama.

Dengan memantau corong ini secara berkala, Anda tahu di tahapan mana transaksi bisnis Anda sering terhambat (bottleneck) dan bisa segera meresponsnya.`,
        completed: false,
        questions: [
          {
            id: 'wb-crm-ch1-q1',
            text: 'Apa fungsi utama dari melacak Sales Pipeline di bisnis Anda?',
            options: [
              'Untuk menghitung pajak tahunan otomatis',
              'Memvisualisasikan dan memantau status transaksi aktif calon pembeli di setiap tahapan',
              'Mendistribusikan brosur secara acak di media sosial',
              'Mengganti merek dagang secara berkala'
            ],
            correctAnswerIndex: 1,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-trading',
    title: 'Trading Journal & Analisis Emosi',
    description: 'Catat setiap transaksi saham atau kripto Anda. Analisis rasio risk-to-reward, evaluasi win-rate, serta kendalikan bias emosi (FOMO & Panic Selling) melalui log harian.',
    category: 'Trading',
    difficulty: 'Lanjutan',
    duration: '5 Jam',
    progress: 0,
    coverGradient: 'from-green-700 to-emerald-900',
    author: 'ASE Stock & Crypto Lab',
    isDownloaded: false,
    rating: 4.6,
    totalChapters: 1,
    version: 'v1.0.1',
    developer: 'ASE Analytics Lab',
    size: '35 KB',
    icon: 'trending-up',
    features: [
      'Log Transaksi (Entri, Exit, Volume, Posisi)',
      'Kalkulator Rasio Risk-To-Reward Otomatis',
      'Metrik Win Rate & Loss Rate Historis',
      'Pelacak Mood & Status Psikologi Saat Transaksi'
    ],
    input: [
      'Detail Transaksi (Harga Beli/Jual, Ukuran Posisi)',
      'Batas Stop Loss (SL) & Take Profit (TP)',
      'Kondisi Emosional (Takut, FOMO, Tenang, Netral)'
    ],
    output: [
      'Kurva Pertumbuhan Ekuitas Bersih',
      'Indeks Disiplin Rencana Trading (Plan Adherence)',
      'Analisis Jenis Emosi Pemicu Loss Terbesar'
    ],
    chapters: [
      {
        id: 'wb-trade-ch1',
        title: 'Bab 1: Disiplin Risk-to-Reward Ratio',
        subtitle: 'Mempertahankan rasio keuntungan yang sehat demi kelangsungan portofolio jangka panjang.',
        content: `Trading Journal bukan sekadar tabel pencatatan untung-rugi biasa, melainkan cermin dari kedisplinan rencana perdagangan (trading plan) Anda. 

Salah satu pilar paling krusial adalah mempertahankan Risk-to-Reward Ratio (RR) yang menguntungkan, misalnya minimal 1:2.
Artinya, jika Anda menoleransi kerugian (risk) sebesar Rp100.000 (lewat penempatan Stop Loss), maka potensi keuntungan (reward) yang Anda incar minimal harus sebesar Rp200.000.

Dengan rasio 1:2 ini, meskipun Anda hanya memenangkan 40% dari total transaksi Anda (Win Rate 40%), portofolio Anda secara keseluruhan akan tetap bertumbuh secara positif.`,
        completed: false,
        questions: [
          {
            id: 'wb-trade-ch1-q1',
            text: 'Jika Anda menggunakan rasio Risk-to-Reward 1:2 dan memasang Stop Loss senilai Rp150.000, berapa target Take Profit minimal yang harus ditetapkan?',
            options: [
              'Rp75.000',
              'Rp150.000',
              'Rp300.000',
              'Rp600.000'
            ],
            correctAnswerIndex: 2,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-growth',
    title: 'Growth OS (Sistem Pertumbuhan)',
    description: 'Metode pelacak sasaran OKR (Objectives and Key Results), pengelolaan pengetahuan pribadi, serta evaluasi kemajuan diri mingguan dalam satu sistem operasi terpadu.',
    category: 'Produktivitas',
    difficulty: 'Menengah',
    duration: '4 Jam',
    progress: 0,
    coverGradient: 'from-emerald-500 to-green-700',
    author: 'ASE Academy Core',
    isDownloaded: false,
    rating: 4.9,
    totalChapters: 1,
    version: 'v3.0.0',
    developer: 'ASE Academy',
    size: '50 KB',
    icon: 'zap',
    features: [
      'Sistem Pemetaan Sasaran & Hasil Utama (OKR)',
      'Kotak Pengetahuan Berbasis Peta Pikiran',
      'Formulir Refleksi & Review Mingguan',
      'Pelacak Kemajuan Keterampilan Baru'
    ],
    input: [
      'Sasaran Besar (Objectives) 3 Bulanan',
      'Indikator Keberhasilan Terukur (Key Results)',
      'Rencana Aksi Harian'
    ],
    output: [
      'Persentase Pencapaian OKR Riil',
      'Grafik Kecepatan Akumulasi Pengetahuan',
      'Umpan Balik Keseimbangan Hidup-Kerja'
    ],
    chapters: [
      {
        id: 'wb-growth-ch1',
        title: 'Bab 1: Menulis OKR yang Terukur',
        subtitle: 'Menghubungkan impian abstrak ke dalam tindakan konkret yang bisa dihitung.',
        content: `OKR (Objectives and Key Results) adalah kerangka kerja populer untuk menetapkan sasaran yang digunakan oleh raksasa teknologi seperti Google.

- Objective (O): APA yang ingin Anda capai? Harus bersifat ambisius, memotivasi, dan kualitatif. Contoh: "Menguasai dasar pengelolaan keuangan bisnis."
- Key Results (KR): BAGAIMANA Anda mengukur pencapaian tersebut? Harus kuantitatif, berjangka waktu, dan konkret. Contoh: "Membaca 2 buku tentang keuangan, menyelesaikan Buku Kerja Keuangan Pribadi, dan membuat anggaran bulanan."

Tinjau OKR Anda setiap minggu untuk menjaga fokus aksi Anda tetap selaras dengan arah tujuan akhir.`,
        completed: false,
        questions: [
          {
            id: 'wb-growth-ch1-q1',
            text: 'Manakah penulisan Key Result (KR) yang tepat dan terukur di bawah ini?',
            options: [
              'Belajar mengelola keuangan agar lebih kaya di masa depan',
              'Membaca buku sesering mungkin setiap hari luang',
              'Menyelesaikan 2 modul Buku Kerja dan menabung sebesar Rp1.000.000 bulan ini',
              'Mencoba hidup lebih teratur dan disiplin'
            ],
            correctAnswerIndex: 2,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  },
  {
    id: 'wb-relationship',
    title: 'Relationship OS (Manajemen Hubungan)',
    description: 'Buku kerja kustom untuk menata, melacak, dan merawat hubungan penting bersama pasangan, keluarga, atau sahabat melalui Love Language tracker dan jurnal kebersamaan.',
    category: 'Pribadi',
    difficulty: 'Pemula',
    duration: '2 Jam',
    progress: 0,
    coverGradient: 'from-teal-500 to-emerald-600',
    author: 'ASE Life Science Team',
    isDownloaded: false,
    rating: 4.8,
    totalChapters: 1,
    version: 'v1.0.0',
    developer: 'ASE Life Engine',
    size: '15 KB',
    icon: 'heart',
    features: [
      'Kalender Momen Berarti & Hari Spesial',
      'Pelacak Bahasa Kasih (Love Language) Pasangan',
      'Ide Aktivitas Kebersamaan (Date Night Planner)',
      'Kotak Aspirasi & Resolusi Konflik Bersama'
    ],
    input: [
      'Daftar Orang Terdekat & Tanggal Lahir/Penting',
      'Bahasa Kasih Utama Pasangan/Anak/Orang Tua',
      'Log Percakapan Berarti yang Dilakukan'
    ],
    output: [
      'Indeks Kedekatan Hubungan Emosional',
      'Rekomendasi Kado / Bahasa Kasih Pekan Ini',
      'Daftar Pengingat Momen Istimewa Terjadwal'
    ],
    chapters: [
      {
        id: 'wb-rel-ch1',
        title: 'Bab 1: Memahami 5 Bahasa Kasih (Love Languages)',
        subtitle: 'Mengungkapkan kasih sayang dengan bahasa yang dimengerti oleh orang tersayang.',
        content: `Berdasarkan teori Dr. Gary Chapman, ada 5 cara utama bagaimana orang menerima dan mengekspresikan kasih sayang:

1. Words of Affirmation (Kata-kata Apresiasi): Pujian, kalimat sayang, dan dukungan moral.
2. Quality Time (Waktu Berkualitas): Mengobrol tanpa distraksi HP, liburan berdua, atau makan malam intim.
3. Receiving Gifts (Menerima Hadiah): Kejutan kecil atau kado yang dipikirkan dengan matang.
4. Acts of Service (Tindakan Melayani): Membantu membersihkan rumah, memasak, atau mengantar jemput.
5. Physical Touch (Sentuhan Fisik): Gandengan tangan, pelukan hangat, atau usapan kepala.

Setiap orang memiliki bahasa kasih utama yang dominan. Memahami bahasa kasih orang terdekat akan menghindarkan kita dari salah paham emosional.`,
        completed: false,
        questions: [
          {
            id: 'wb-rel-ch1-q1',
            text: 'Jika bahasa kasih utama pasangan Anda adalah Quality Time, manakah bentuk perhatian yang paling berharga baginya?',
            options: [
              'Dibelikan hadiah barang bermerek yang sangat mahal',
              'Mendengarkan ceritanya dengan penuh perhatian tanpa memegang handphone',
              'Mendapatkan pujian lewat pesan singkat sepanjang hari',
              'Dibuatkan secangkir teh hangat di pagi hari'
            ],
            correctAnswerIndex: 1,
            selectedAnswerIndex: -1
          }
        ]
      }
    ]
  }
];

export const INITIAL_ACTIVITY: DailyActivity[] = [
  { day: 'Sen', minutes: 45, completedTasks: 2 },
  { day: 'Sel', minutes: 30, completedTasks: 1 },
  { day: 'Rab', minutes: 60, completedTasks: 3 },
  { day: 'Kam', minutes: 15, completedTasks: 0 },
  { day: 'Jum', minutes: 40, completedTasks: 2 },
  { day: 'Sab', minutes: 0, completedTasks: 0 },
  { day: 'Min', minutes: 25, completedTasks: 1 }
];

export const KATALIS_MOTIVASI = [
  "Satu aplikasi kecil, dengan sekumpulan buku kerja pembawa perubahan besar.",
  "Investasi terbaik dalam hidup adalah investasi pada peningkatan kapasitas diri sendiri.",
  "Setiap bab kecil yang Anda isi hari ini akan menjadi fondasi efisiensi esok hari.",
  "Disiplin bukanlah beban, melainkan kebebasan untuk mengontrol arah hidup Anda.",
  "Konsistensi dalam langkah kecil menghasilkan lompatan kemajuan yang luar biasa."
];

export const INITIAL_FINANCE_RECORDS: FinanceRecord[] = [
  { id: 'fin-1', type: 'pemasukan', category: 'Gaji Pokok', amount: 8500000, date: '2026-07-01', note: 'Gaji bulanan' },
  { id: 'fin-2', type: 'pengeluaran', category: 'Kebutuhan Pokok', amount: 3200000, date: '2026-07-02', note: 'Sewa & listrik' },
  { id: 'fin-3', type: 'pengeluaran', category: 'Keinginan', amount: 1500000, date: '2026-07-02', note: 'Makan mewah & cafe' },
  { id: 'fin-4', type: 'tabungan', category: 'Investasi', amount: 1000000, date: '2026-07-01', note: 'Reksadana bulanan' },
  { id: 'fin-5', type: 'hutang', category: 'Cicilan Laptop', amount: 800000, date: '2026-07-01', note: 'Sisa tenor 3 bulan' }
];

export const INITIAL_TASK_RECORDS: TaskRecord[] = [
  { id: 'task-1', taskName: 'Selesaikan Desain UI Mobile App', timeBlock: '09:00 - 11:00', priority: 'Penting-Mendesak', completed: true },
  { id: 'task-2', taskName: 'Analisis Portofolio Saham Mingguan', timeBlock: '13:00 - 14:30', priority: 'Penting-TidakMendesak', completed: false },
  { id: 'task-3', taskName: 'Balas Email Klien CRM Prospek', timeBlock: '15:00 - 15:30', priority: 'TidakPenting-Mendesak', completed: true },
  { id: 'task-4', taskName: 'Scroll Reels Instagram Unfaedah', timeBlock: '19:00 - 20:00', priority: 'TidakPenting-TidakMendesak', completed: false }
];

export const INITIAL_HABIT_RECORDS: HabitRecord[] = [
  { id: 'hab-1', habitName: 'Membaca Buku 10 Halaman', streak: 5, history: { 'Sen': true, 'Sel': true, 'Rab': true, 'Kam': true, 'Jum': true, 'Sab': false, 'Min': false } },
  { id: 'hab-2', habitName: 'Olahraga Angkat Beban / Cardio', streak: 2, history: { 'Sen': true, 'Sel': false, 'Rab': true, 'Kam': false, 'Jum': false, 'Sab': false, 'Min': false } },
  { id: 'hab-3', habitName: 'Tulis Jurnal & Evaluasi Harian', streak: 3, history: { 'Sen': false, 'Sel': true, 'Rab': true, 'Kam': true, 'Jum': false, 'Sab': false, 'Min': false } }
];

export const INITIAL_CRM_RECORDS: CrmRecord[] = [
  { id: 'crm-1', clientName: 'Budi Santoso', dealValue: 12500000, status: 'Negosiasi', notes: 'Klien berminat paket Enterprise, sedang meninjau proposal.', date: '2026-07-01' },
  { id: 'crm-2', clientName: 'Dewi Lestari', dealValue: 4500000, status: 'Won', notes: 'Selesai tanda tangan kontrak proyek branding.', date: '2026-07-02' },
  { id: 'crm-3', clientName: 'Andi Wijaya', dealValue: 7500000, status: 'Lead', notes: 'Pertemuan pertama lancar, butuh follow-up.', date: '2026-06-30' }
];

export const INITIAL_TRADING_RECORDS: TradingRecord[] = [
  { id: 'trd-1', pairOrStock: 'BTC/USDT', type: 'Buy', entryPrice: 62000, exitPrice: 63500, positionSize: 0.2, profit: 300, emotion: 'Tenang', date: '2026-07-01' },
  { id: 'trd-2', pairOrStock: 'BBRI.JK', type: 'Buy', entryPrice: 4800, exitPrice: 4650, positionSize: 10000, profit: -1500000, emotion: 'FOMO', date: '2026-07-02' },
  { id: 'trd-3', pairOrStock: 'AAPL', type: 'Sell', entryPrice: 185, exitPrice: 180, positionSize: 50, profit: 250, emotion: 'Tenang', date: '2026-06-29' }
];

export const INITIAL_OKR_RECORDS: OkrRecord[] = [
  { id: 'okr-1', objective: 'Mengakselerasi Pendapatan Bisnis Sampingan', keyResult: 'Mendapatkan 3 Klien Aktif di CRM', progress: 66 },
  { id: 'okr-2', objective: 'Meningkatkan Literasi Keuangan & Tabungan', keyResult: 'Menyimpan 15% Pendapatan ke Tabungan', progress: 80 },
  { id: 'okr-3', objective: 'Disiplin Kesehatan Mental & Fisik', keyResult: 'Konsisten Berolahraga Minimal 3 Kali Sepekan', progress: 50 }
];

export const INITIAL_RELATIONSHIP_RECORDS: RelationshipRecord[] = [
  { id: 'rel-1', name: 'Siti Nurhaliza (Istri)', loveLanguage: 'Quality Time', specialDate: '15 September (Anniversary)', statusMeter: 90 },
  { id: 'rel-2', name: 'Ibu', loveLanguage: 'Acts of Service', specialDate: '22 Desember (Hari Ibu)', statusMeter: 85 },
  { id: 'rel-3', name: 'Rian (Sahabat)', loveLanguage: 'Words of Affirmation', specialDate: '12 April (Ulang Tahun)', statusMeter: 70 }
];

export const INITIAL_SHARED_CONTACTS: SharedContact[] = [
  { id: 'con-1', name: 'Budi Santoso', phone: '0812-3456-7890', category: 'Klien' },
  { id: 'con-2', name: 'Dewi Lestari', phone: '0857-9988-7766', category: 'Klien' },
  { id: 'con-3', name: 'Siti Nurhaliza', phone: '0813-1122-3344', category: 'Keluarga' },
  { id: 'con-4', name: 'Rian Wijaya', phone: '0821-5544-3322', category: 'Teman' }
];

export const INITIAL_GOALS: Goal[] = [
  {
    id: 'goal-1',
    workbookId: 'wb-keuangan',
    workbookTitle: 'Keuangan Pribadi',
    name: 'Membangun Dana Darurat 6 Bulan',
    target: 'Rp 15.000.000 Tabungan',
    progress: 65,
    deadline: '31 Des 2026',
    status: 'Sedang Berjalan',
    recommendation: 'Alokasikan sisa pendapatan dari pos Keinginan ke Dana Darurat setiap akhir pekan.'
  },
  {
    id: 'goal-2',
    workbookId: 'wb-planner',
    workbookTitle: 'Planner Harian',
    name: 'Konsistensi Fokus Produktivitas Kerja',
    target: 'Menyelesaikan 80% Tugas Eisenhower',
    progress: 75,
    deadline: '15 Jul 2026',
    status: 'Sedang Berjalan',
    recommendation: 'Buka kerja di pagi hari untuk mengisi kuadran Do First (Q1) terlebih dahulu.'
  },
  {
    id: 'goal-3',
    workbookId: 'wb-crm',
    workbookTitle: 'CRM & Penjualan',
    name: 'Mencapai Omzet UMKM Bulanan',
    target: 'Won Deal Rp 20.000.000',
    progress: 40,
    deadline: '31 Jul 2026',
    status: 'Sedang Berjalan',
    recommendation: 'Follow-up prospek Negosiasi aktif Anda (Klien Budi Santoso) untuk menaikkan nilai deal.'
  }
];

export const INITIAL_TIMELINE: TimelineItem[] = [
  {
    id: 'time-1',
    workbookId: 'wb-keuangan',
    workbookTitle: 'Keuangan Pribadi',
    type: 'Input',
    title: 'Input Data Anggaran',
    detail: 'Mencatat pengeluaran pos Keinginan senilai Rp 1.500.000 untuk Makan Malam.',
    timestamp: '09:30'
  },
  {
    id: 'time-2',
    workbookId: 'wb-keuangan',
    workbookTitle: 'Keuangan Pribadi',
    type: 'Output',
    title: 'Output Saldo Anggaran',
    detail: 'Saldo bulanan dihitung ulang secara real-time menjadi Rp 2.000.000.',
    timestamp: '09:31'
  },
  {
    id: 'time-3',
    workbookId: 'wb-keuangan',
    workbookTitle: 'Keuangan Pribadi',
    type: 'Insight',
    title: 'Rekomendasi Pintar Terpicu',
    detail: 'Pemberitahuan: Rasio pengeluaran Keinginan Anda mendekati batas maksimal 30%!',
    timestamp: '09:32'
  },
  {
    id: 'time-4',
    workbookId: 'wb-planner',
    workbookTitle: 'Planner Harian',
    type: 'Perubahan',
    title: 'Perubahan Progres Sasaran',
    detail: 'Tugas "Selesaikan Desain UI Mobile App" ditandai selesai. Progres Planner naik ke 75%!',
    timestamp: '11:15'
  }
];

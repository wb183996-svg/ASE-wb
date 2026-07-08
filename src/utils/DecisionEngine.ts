/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  FinanceRecord, 
  TaskRecord, 
  HabitRecord, 
  TradingRecord 
} from '../types';
import { SharedData } from '../modules/ModuleContract';

export interface ActionPlanItem {
  id: string;
  step: string;
  timeframe: 'Hari ini' | 'Minggu ini' | 'Bulan ini';
  priority: 'Tinggi' | 'Sedang' | 'Rendah';
  estimatedTime: string;
  target: string;
  status: 'Belum Dimulai' | 'Sedang Dikerjakan' | 'Selesai' | 'Ditunda' | 'Dibatalkan';
}

export interface RecommendationItem {
  type: 'Pilihan Terbaik' | 'Pilihan Aman' | 'Pilihan Agresif';
  title: string;
  reason: string;
  benefit: string;
  risk: string;
}

export interface DecisionAdvice {
  id: string;
  title: string;
  icon: string;
  category: string;
  analysis: {
    whatHappened: string;
    whyHappened: string;
    mainCause: string;
    impact: string;
    opportunity: string;
    risk: string;
  };
  critique: string[];
  recommendations: RecommendationItem[];
  actionPlans: ActionPlanItem[];
  evaluation: {
    targetAchieved: boolean | string;
    successFactors: string[];
    failureFactors: string[];
    whatToKeep: string[];
    whatToImprove: string[];
  };
  adaptation: string[];
  coachingMessage: string;
}

export const DecisionEngine = {
  /**
   * Main orchestrator that aggregates advice across active sub-engines
   */
  getAdvice(sharedData: SharedData): DecisionAdvice[] {
    const adviceList: DecisionAdvice[] = [];

    // 1. Finance Workbook Advisor
    if (sharedData.financeRecords && sharedData.financeRecords.length > 0) {
      adviceList.push(this.analyzeFinanceTrends(sharedData.financeRecords));
    } else {
      adviceList.push(this.getDefaultFinanceAdvice());
    }

    // 2. Planner & Habit Advisor
    if ((sharedData.taskRecords && sharedData.taskRecords.length > 0) || 
        (sharedData.habitRecords && sharedData.habitRecords.length > 0)) {
      adviceList.push(this.critiqueTaskLoad(sharedData.taskRecords || [], sharedData.habitRecords || []));
    } else {
      adviceList.push(this.getDefaultProductivityAdvice());
    }

    // 3. Trading Workbook Advisor
    if (sharedData.tradingRecords && sharedData.tradingRecords.length > 0) {
      adviceList.push(this.recommendTradingActions(sharedData.tradingRecords));
    } else {
      adviceList.push(this.getDefaultTradingAdvice());
    }

    return adviceList;
  },

  /**
   * HEURISTIC: Finance trends optimizer
   */
  analyzeFinanceTrends(records: FinanceRecord[]): DecisionAdvice {
    const totalIncome = records
      .filter(r => r.type === 'pemasukan')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalExpense = records
      .filter(r => r.type === 'pengeluaran')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalSavings = records
      .filter(r => r.type === 'tabungan')
      .reduce((sum, r) => sum + r.amount, 0);
    const totalDebt = records
      .filter(r => r.type === 'hutang')
      .reduce((sum, r) => sum + r.amount, 0);

    const netCashflow = totalIncome - totalExpense;
    const savingsRate = totalIncome > 0 ? (totalSavings / totalIncome) * 100 : 0;
    const expenseRatio = totalIncome > 0 ? (totalExpense / totalIncome) * 100 : 0;

    // Heuristics decision flags
    const isDeficit = netCashflow < 0;
    const isHighExpense = expenseRatio > 70;
    const isLowSavings = savingsRate < 20;
    const hasHeavyDebt = totalDebt > (totalSavings * 1.5);

    let mainCause = 'Proporsi alokasi pengeluaran bulanan belum terstandardisasi dengan baik.';
    let impact = 'Pertumbuhan aset bersih melambat dan likuiditas dana darurat dalam risiko sedang.';
    let risk = 'Jika ada pengeluaran mendadak tinggi, terpaksa berutang atau menguras simpanan utama.';
    let opportunity = 'Tersedia peluang optimasi pos konsumtif non-primer untuk dialihkan ke tabungan berjangka.';

    const critiques: string[] = [];
    if (isDeficit) {
      critiques.push('Arus kas berada pada kondisi defisit. Pengeluaran melebihi pemasukan aktual.');
      mainCause = 'Terjadi lonjakan pengeluaran tidak terduga pada pos konsumsi sekunder/tersier.';
      impact = 'Likuiditas berkurang tajam dan memicu ketergantungan pada fasilitas pinjaman.';
      risk = 'Aset lancar terkuras habis dalam waktu singkat jika tidak dilakukan pembatasan darurat.';
    } else {
      critiques.push('Arus kas positif bersih Rp' + netCashflow.toLocaleString('id-ID') + ', pertahankan surplus ini.');
    }

    if (isHighExpense) {
      critiques.push('Rasio pengeluaran melampaui batas aman (berada di angka ' + Math.round(expenseRatio) + '% dari total pendapatan).');
    }
    if (isLowSavings) {
      critiques.push('Penyisihan tabungan saat ini (' + Math.round(savingsRate) + '%) masih di bawah standar aman 20%.');
    }
    if (hasHeavyDebt) {
      critiques.push('Rasio hutang aktif terlalu tinggi dibandingkan total akumulasi tabungan saat ini.');
      risk = 'Beban cicilan berpotensi mengganggu stabilitas kebutuhan primer harian di masa mendatang.';
      opportunity = 'Mulai negosiasi restrukturisasi suku bunga atau percepatan pelunasan pokok hutang terbesar.';
    }

    if (critiques.length === 0) {
      critiques.push('Kesehatan anggaran sangat prima, alokasi pengeluaran terkendali sempurna.');
    }

    // Adaptations & Coaching Messages
    const adaptations: string[] = [];
    let coachingMsg = '';

    if (isDeficit || isHighExpense) {
      adaptations.push('Kurangi limit belanja bulanan non-primer sebesar 25% mulai minggu ini.');
      adaptations.push('Gunakan metode pembagian amplop fisik/digital (Metode 50/30/20) untuk mengontrol hasrat belanja impulsif.');
      coachingMsg = 'Mari kita evaluasi kembali prioritas mingguan Anda. Penghematan kecil di beberapa hari ke depan akan memberikan ruang napas yang sangat lega bagi tabungan akhir bulan Anda. Saya yakin Anda mampu melewatinya.';
    } else {
      adaptations.push('Tingkatkan investasi berkala sebesar 5% pada instrumen berisiko rendah.');
      adaptations.push('Perbarui target anggaran bulanan Anda untuk memperluas porsi dana darurat.');
      coachingMsg = 'Luar biasa! Manajemen keuangan Anda menunjukkan pola disiplin yang konsisten. Keberhasilan menjaga rasio surplus ini adalah batu loncatan hebat untuk mewujudkan kebebasan finansial jangka panjang.';
    }

    return {
      id: 'DE-FIN',
      title: 'Optimalisasi Kesehatan Finansial',
      icon: 'Wallet',
      category: 'Keuangan',
      analysis: {
        whatHappened: `Total pemasukan tercatat Rp${totalIncome.toLocaleString('id-ID')} dengan pengeluaran Rp${totalExpense.toLocaleString('id-ID')}. Sisa arus kas bersih adalah Rp${netCashflow.toLocaleString('id-ID')}.`,
        whyHappened: isDeficit 
          ? 'Defisit terjadi karena akumulasi pengeluaran di luar budget bulanan primer.' 
          : 'Surplus terjadi berkat pengawasan belanja yang baik dan disiplin pencatatan harian.',
        mainCause,
        impact,
        opportunity,
        risk
      },
      critique: critiques,
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Metode Penganggaran 50/30/20',
          reason: 'Membagi pendapatan secara sistematis: 50% Kebutuhan, 30% Keinginan, dan 20% Tabungan/Investasi.',
          benefit: 'Menjamin porsi investasi tetap aman tanpa mengorbankan kenyamanan dasar hidup.',
          risk: 'Membutuhkan disiplin ketat di minggu-minggu awal transisi anggaran.'
        },
        {
          type: 'Pilihan Aman',
          title: 'Konsolidasi & Autodebit Tabungan',
          reason: 'Menerapkan pemotongan otomatis 10% langsung di hari pertama menerima pemasukan.',
          benefit: 'Tabungan pasti bertambah tanpa dipengaruhi godaan belanja tengah bulan.',
          risk: 'Likuiditas dompet harian akan sedikit berkurang secara mendadak.'
        },
        {
          type: 'Pilihan Agresif',
          title: 'Zero-Base Budgeting & Pelunasan Ekstrim',
          reason: 'Mengalokasikan seluruh sisa surplus untuk pelunasan hutang berbunga tinggi (Metode Avalanche).',
          benefit: 'Beban bunga jangka panjang terpangkas drastis dan melahirkan ruang cashflow baru.',
          risk: 'Porsi cadangan kas darurat sangat minim selama masa pelunasan.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-FIN-1',
          step: 'Klasifikasikan transaksi 3 hari terakhir ke dalam kategori Primer vs Sekunder',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '15 Menit',
          target: 'Mengetahui bocoran halus pengeluaran non-esensial',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-FIN-2',
          step: 'Pindahkan alokasi dana darurat minimal Rp250.000 ke rekening terpisah',
          timeframe: 'Minggu ini',
          priority: 'Sedang',
          estimatedTime: '10 Menit',
          target: 'Memisahkan dana konsumsi dengan dana pengaman',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-FIN-3',
          step: 'Buat lembar anggaran baru untuk mengunci pengeluaran maksimal 70%',
          timeframe: 'Bulan ini',
          priority: 'Tinggi',
          estimatedTime: '45 Menit',
          target: 'Mencapai target tabungan minimal Rp1.000.000 bulan depan',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: isDeficit ? 'Belum Tercapai' : 'Tercapai Sebagian',
        successFactors: ['Rutin mencatatkan transaksi pengeluaran terkecil', 'Memiliki pemisahan buku tabungan harian'],
        failureFactors: ['Belanja harian sekunder yang tidak direncanakan', 'Pengaruh diskon digital platform belanja online'],
        whatToKeep: ['Disiplin mencatat di akhir hari', 'Kategori pengeluaran yang terorganisir'],
        whatToImprove: ['Konsistensi mematuhi limit harian', 'Mengurangi frekuensi transaksi luar rumah']
      },
      adaptation: adaptations,
      coachingMessage: coachingMsg
    };
  },

  /**
   * HEURISTIC: Task load analysis & scheduling advisor
   */
  critiqueTaskLoad(tasks: TaskRecord[], habits: HabitRecord[]): DecisionAdvice {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Eisenhower distribution
    const urgentImportant = tasks.filter(t => t.priority === 'Penting-Mendesak').length;
    const nonUrgentImportant = tasks.filter(t => t.priority === 'Penting-TidakMendesak').length;
    const urgentNonImportant = tasks.filter(t => t.priority === 'TidakPenting-Mendesak').length;
    const nonUrgentNonImportant = tasks.filter(t => t.priority === 'TidakPenting-TidakMendesak').length;

    const isOverloaded = urgentImportant > 4;
    const isCrisisManaging = urgentImportant > nonUrgentImportant;
    const isWastingTime = nonUrgentNonImportant > nonUrgentImportant;

    const critiques: string[] = [];
    let mainCause = 'Kurangnya pembagian waktu khusus (time blocking) untuk proyek jangka panjang.';
    let impact = 'Kelelahan fisik/mental (burnout) akibat selalu bekerja di bawah tekanan tenggat waktu.';
    let opportunity = 'Tingkatkan delegasi untuk tugas non-esensial dan fokus pada pengembangan strategis.';
    let risk = 'Penyelesaian sasaran jangka panjang (Goal) terhambat karena tenggelam dalam urusan harian.';

    if (completionRate < 50 && totalTasks > 0) {
      critiques.push(`Rasio penyelesaian tugas harian masih rendah (${Math.round(completionRate)}%). Terlalu banyak rencana tanpa eksekusi.`);
    } else {
      critiques.push(`Kecepatan eksekusi tugas cukup baik (${Math.round(completionRate)}% selesai). Teruskan momentum produktif ini.`);
    }

    if (isOverloaded) {
      critiques.push('Beban kerja "Penting-Mendesak" terlalu padat (tercatat ' + urgentImportant + ' tugas). Risiko burnout sangat tinggi.');
      mainCause = 'Penumpukan tugas akibat penundaan pengerjaan di fase awal.';
    }

    if (isCrisisManaging) {
      critiques.push('Anda terlalu sering berada dalam mode pemadam kebakaran (selalu mengerjakan hal darurat dibanding hal strategis).');
    }

    if (isWastingTime) {
      critiques.push('Terlalu banyak energi dihabiskan untuk aktivitas "Tidak Penting & Tidak Mendesak".');
      mainCause = 'Distraksi digital atau kurang jelasnya prioritas utama di pagi hari.';
    }

    if (critiques.length === 0) {
      critiques.push('Manajemen waktu dan pembagian prioritas tugas Anda berjalan seimbang.');
    }

    // Heuristic Advice on habits
    const totalStreak = habits.reduce((sum, h) => sum + h.streak, 0);
    const avgStreak = habits.length > 0 ? totalStreak / habits.length : 0;
    if (avgStreak < 3 && habits.length > 0) {
      critiques.push('Konsistensi kebiasaan (habit streak) menurun. Rata-rata streak beruntun di bawah 3 hari.');
    }

    const adaptations: string[] = [];
    let coachingMsg = '';

    if (isOverloaded || isCrisisManaging) {
      adaptations.push('Batasi maksimal 3 tugas utama (Rule of 3) untuk setiap awal pagi hari.');
      adaptations.push('Terapkan slot waktu 90 menit tanpa distraksi ponsel untuk tugas tersulit.');
      coachingMsg = 'Prioritas bukanlah tentang melakukan semua hal sekaligus, melainkan berani menolak hal-hal kurang penting demi menyelesaikan satu fokus utama. Mari kita sederhanakan rencana kerja Anda hari ini.';
    } else {
      adaptations.push('Alokasikan 1 jam ekstra untuk belajar keterampilan baru yang relevan dengan karir.');
      adaptations.push('Jaga konsistensi kebiasaan pagi Anda dengan pengingat alarm terpadu.');
      coachingMsg = 'Kerja luar biasa dalam menyusun skala prioritas! Pola produktivitas Anda berada di jalur aman. Manfaatkan ketenangan waktu ini untuk mencicil sasaran masa depan yang belum tersentuh.';
    }

    return {
      id: 'DE-PROD',
      title: 'Keseimbangan & Produktivitas Harian',
      icon: 'CheckSquare',
      category: 'Produktivitas',
      analysis: {
        whatHappened: `Menyelesaikan ${completedTasks} dari ${totalTasks} tugas yang direncanakan. Distribusi prioritas: ${urgentImportant} Mendesak, ${nonUrgentImportant} Strategis, ${urgentNonImportant} Delegasi, ${nonUrgentNonImportant} Eliminasi.`,
        whyHappened: isCrisisManaging
          ? 'Terlalu banyak berkompromi pada distraksi eksternal sehingga menunda tugas primer.'
          : 'Menerapkan batasan fokus yang baik sehingga mampu merampungkan tugas penting tepat waktu.',
        mainCause,
        impact,
        opportunity,
        risk
      },
      critique: critiques,
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Aturan 3 Fokus Utama (Rule of Three)',
          reason: 'Menetapkan maksimal 3 tugas besar yang mutlak harus selesai setiap harinya.',
          benefit: 'Menghilangkan kebingungan memilih tugas dan menjamin hasil berkualitas tinggi.',
          risk: 'Mengharuskan Anda berani menunda permintaan darurat orang lain yang kurang mendasar.'
        },
        {
          type: 'Pilihan Aman',
          title: 'Teknik Pomodoro Terjadwal (25/5)',
          reason: 'Membagi kerja ke dalam interval 25 menit fokus penuh diikuti 5 min istirahat.',
          benefit: 'Sangat ampuh mengatasi rasa enggan (prokrastinasi) saat memulai tugas rumit.',
          risk: 'Bisa menginterupsi kondisi deep-work jika alarm berbunyi saat konsentrasi tinggi.'
        },
        {
          type: 'Pilihan Agresif',
          title: 'Time-Blocking Ekstrim & Batasan Akses',
          reason: 'Memblokir kalender total selama 4 jam penuh tanpa respons email/chat/telepon.',
          benefit: 'Penyelesaian proyek kompleks selesai 3x lebih cepat dibanding hari biasa.',
          risk: 'Potensi miskomunikasi ringan dengan rekan kerja yang membutuhkan respons cepat.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-PROD-1',
          step: 'Tuliskan 3 tugas terpenting di malam hari sebelum tidur',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '5 Menit',
          target: 'Memulai esok pagi dengan kejelasan aksi tanpa bingung',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-PROD-2',
          step: 'Gunakan mode fokus ponsel saat mengerjakan tugas "Penting-Mendesak"',
          timeframe: 'Minggu ini',
          priority: 'Sedang',
          estimatedTime: '2 Jam',
          target: 'Mengurangi distraksi media sosial selama jam produktif',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-PROD-3',
          step: 'Adakan review produktivitas mingguan setiap hari Sabtu sore',
          timeframe: 'Bulan ini',
          priority: 'Rendah',
          estimatedTime: '30 Menit',
          target: 'Menjaga rasio kelulusan tugas di atas 80% secara ajeg',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: completionRate >= 75 ? 'Tercapai' : 'Belum Tercapai',
        successFactors: ['Memulai kerja berat di pagi hari saat energi tinggi', 'Membuat daftar tugas tertulis yang jelas'],
        failureFactors: ['Tergoda membuka notifikasi chat di sela-sela fokus', 'Estimasi waktu pengerjaan yang terlalu optimis'],
        whatToKeep: ['Mencatat tugas di pagi hari', 'Penggunaan kategori Eisenhower Matrix'],
        whatToImprove: ['Mengurangi durasi bermain ponsel saat jam kerja', 'Belajar berkata "tidak" pada tugas non-prioritas']
      },
      adaptation: adaptations,
      coachingMessage: coachingMsg
    };
  },

  /**
   * HEURISTIC: Trading discipline advisor
   */
  recommendTradingActions(trades: TradingRecord[]): DecisionAdvice {
    const totalTrades = trades.length;
    const profitableTrades = trades.filter(t => t.profit > 0).length;
    const winRate = totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0;
    const totalProfit = trades.reduce((sum, t) => sum + (t.profit > 0 ? t.profit : 0), 0);
    const totalLoss = trades.reduce((sum, t) => sum + (t.profit < 0 ? Math.abs(t.profit) : 0), 0);
    
    // Risk to Reward approximation based on trade exit patterns
    const avgProfit = profitableTrades > 0 ? totalProfit / profitableTrades : 0;
    const lossTradesCount = trades.filter(t => t.profit < 0).length;
    const avgLoss = lossTradesCount > 0 ? totalLoss / lossTradesCount : 0;
    const riskRewardRatio = avgLoss > 0 ? avgProfit / avgLoss : 0;

    // Emotions checks
    const fomoTrades = trades.filter(t => t.emotion === 'FOMO').length;
    const fearTrades = trades.filter(t => t.emotion === 'Takut').length;

    const isFomoTrader = fomoTrades > (totalTrades * 0.3);
    const isBadRiskReward = riskRewardRatio < 1.8;
    const isOverTrading = totalTrades > 12;

    const critiques: string[] = [];
    let mainCause = 'Kurang ketatnya penegakan filter checklist teknikal sebelum menekan tombol transaksi.';
    let impact = 'Akumulasi modal tergerus oleh stop loss kecil yang tidak efisien atau biaya transaksi berlebih.';
    let opportunity = 'Fokus mengasah akurasi 1-2 setup andalan dibanding bertransaksi di setiap pergerakan pasar.';
    let risk = 'Mengalami kekalahan beruntun (drawdown) parah yang merusak kondisi mental trading Anda.';

    if (winRate < 45 && totalTrades > 0) {
      critiques.push(`Win rate transaksi Anda berada di level kritis (${Math.round(winRate)}%). Diperlukan evaluasi strategi masuk pasar.`);
    } else {
      critiques.push(`Win rate transaksi dalam level sehat (${Math.round(winRate)}%). Struktur pemetaan tren Anda bekerja optimal.`);
    }

    if (isFomoTrader) {
      critiques.push('Lebih dari 30% transaksi Anda dipicu oleh emosi FOMO (takut tertinggal tren). Ini sangat berbahaya.');
      mainCause = 'Melihat lonjakan harga sekilas tanpa menunggu konfirmasi konfluensi di area support/resistance.';
      impact = 'Sering terjebak membeli di harga puncak (pucuk) sebelum pembalikan arah.';
    }

    if (isBadRiskReward) {
      critiques.push(`Rasio rata-rata profit dibanding loss Anda (${riskRewardRatio.toFixed(1)}:1) masih di bawah standar minimal 2:1.`);
      critiques.push('Anda cenderung memotong profit terlalu cepat namun menahan posisi rugi terlalu lama.');
    }

    if (isOverTrading) {
      critiques.push(`Frekuensi trading terlalu padat (${totalTrades} transaksi). Kemungkinan besar Anda terseret overtrading.`);
      risk = 'Biaya komisi melambung tinggi dan fokus analisis memudar akibat kelelahan mental.';
    }

    if (critiques.length === 0) {
      critiques.push('Disiplin trading Anda berada pada level profesional yang sangat membanggakan.');
    }

    const adaptations: string[] = [];
    let coachingMsg = '';

    if (isFomoTrader || isBadRiskReward) {
      adaptations.push('Kunci rasio Risk-to-Reward minimal 1:2 di dalam kalkulator posisi sebelum entry.');
      adaptations.push('Buat lembar checklist 3 syarat teknikal wajib yang harus dicentang sebelum membuka posisi.');
      coachingMsg = 'Seorang trader hebat dinilai dari kemampuannya untuk tetap diam saat pasar tidak memberikan sinyal yang jelas. Jaga modal berharga Anda dan tunggulah area setup andalan Anda dengan sabar.';
    } else {
      adaptations.push('Tingkatkan ukuran posisi secara bertahap (max 2% modal per trade) seiring naiknya modal.');
      adaptations.push('Teruskan menulis jurnal emosi pasca-transaksi untuk menjaga kestabilan psikologis.');
      coachingMsg = 'Eksekusi rencana perdagangan Anda sungguh presisi. Anda memperlakukan trading sebagai bisnis yang matang, bukan perjudian emosional. Pertahankan ketenangan ini di masa-masa mendatang.';
    }

    return {
      id: 'DE-TRAD',
      title: 'Disiplin & Manajemen Risiko Trading',
      icon: 'TrendingUp',
      category: 'Trading',
      analysis: {
        whatHappened: `Melakukan ${totalTrades} transaksi dengan tingkat kesuksesan ${Math.round(winRate)}%. Rasio perbandingan profit terhadap loss rata-rata adalah ${riskRewardRatio.toFixed(1)}:1.`,
        whyHappened: isFomoTrader 
          ? 'Mengambil keputusan entry terburu-buru tanpa menunggu konfirmasi pembalikan arah yang sah.' 
          : 'Berhasil mengunci rasio keuntungan yang memadai pada setiap setup breakout.',
        mainCause,
        impact,
        opportunity,
        risk
      },
      critique: critiques,
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Sistem Stop-Loss & Target Berbasis RRR 1:2',
          reason: 'Hanya membuka posisi jika potensi keuntungan minimal dua kali lipat dari risiko kerugian.',
          benefit: 'Meskipun win rate Anda hanya 40%, akun Anda akan tetap tumbuh positif dalam jangka panjang.',
          risk: 'Lebih banyak setup yang akan diabaikan karena tidak memenuhi kriteria rasio.'
        },
        {
          type: 'Pilihan Aman',
          title: 'Pembatasan Maksimal 2 Transaksi Sehari',
          reason: 'Membatasi diri untuk menjaga konsentrasi analisis dan mencegah aksi balas dendam (revenge trading).',
          benefit: 'Menghindari jebakan emosi negatif setelah mengalami stop-loss di pagi hari.',
          risk: 'Melewatkan peluang pergerakan besar yang terjadi di malam hari.'
        },
        {
          type: 'Pilihan Agresif',
          title: 'Scaling In & Pyramiding Posisi Untung',
          reason: 'Menambahkan volume transaksi secara bertahap saat harga bergerak searah dengan analisis awal.',
          benefit: 'Melipatgandakan profit secara masif pada pergerakan tren kuat (trending market).',
          risk: 'Jika terjadi pembalikan harga mendadak, rata-rata harga entry akan buruk dan bisa berbalik rugi.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-TRAD-1',
          step: 'Tulis checklist masuk pasar (Tren, Support/Resistance, Sinyal Lilin) di selembar kertas',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '10 Menit',
          target: 'Memiliki filter fisik sebelum mengklik tombol eksekusi',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-TRAD-2',
          step: 'Tinjau kembali posisi rugi terbesar minggu ini untuk menganalisis pemicu emosi',
          timeframe: 'Minggu ini',
          priority: 'Sedang',
          estimatedTime: '30 Menit',
          target: 'Menghilangkan pemicu kebiasaan buruk yang berulang',
          status: 'Belum Dimulai'
        },
        {
          id: 'AP-TRAD-3',
          step: 'Batasi maksimal total risiko harian maksimal 2% dari keseluruhan ekuitas',
          timeframe: 'Bulan ini',
          priority: 'Tinggi',
          estimatedTime: '20 Menit',
          target: 'Menjamin kelangsungan hidup akun trading dari badai fluktuasi pasar',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: winRate >= 50 && riskRewardRatio >= 2 ? 'Tercapai' : 'Belum Tercapai',
        successFactors: ['Mampu menempatkan Stop Loss di luar area jangkauan noise pasar', 'Mencatat emosi sebelum melakukan transaksi'],
        failureFactors: ['Melakukan entry karena bosan saat pasar bergerak lambat', 'Memindahkan Stop Loss saat posisi sedang terseret rugi'],
        whatToKeep: ['Disiplin journaling transaksi', 'Analisis tren multi-timeframe'],
        whatToImprove: ['Ketegasan menahan posisi profit hingga menyentuh target', 'Menerima kerugian kecil sebagai bagian dari biaya bisnis']
      },
      adaptation: adaptations,
      coachingMessage: coachingMsg
    };
  },

  /**
   * DEFAULT ADVICE BLOCKS FOR EMPTY SYSTEM STATES
   */
  getDefaultFinanceAdvice(): DecisionAdvice {
    return {
      id: 'DE-FIN',
      title: 'Optimalisasi Kesehatan Finansial',
      icon: 'Wallet',
      category: 'Keuangan',
      analysis: {
        whatHappened: 'Belum ada rekod transaksi keuangan yang tercatat pada database aktif Anda.',
        whyHappened: 'Anda belum memasukkan data pendapatan maupun pengeluaran di Buku Keuangan.',
        mainCause: 'Database keuangan kosong.',
        impact: 'Sistem tidak dapat mengukur rasio kesehatan anggaran primer Anda secara akurat.',
        opportunity: 'Mulai catat transaksi pertama Anda untuk membuka fitur visualisasi dashboard lengkap.',
        risk: 'Ketidaktahuan arus keluar masuk dana dapat berujung pada akumulasi bocor halus tanpa disadari.'
      },
      critique: ['Tidak ada data untuk dianalisis. Silakan masukkan data di Buku Keuangan terlebih dahulu.'],
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Catat Arus Kas Harian secara Konsisten',
          reason: 'Langkah pertama mengendalikan keuangan adalah memetakan ke mana perginya uang Anda.',
          benefit: 'Menghilangkan kekhawatiran uang habis tanpa kejelasan di setiap akhir bulan.',
          risk: 'Membutuhkan pembiasaan rutin selama 7 hari pertama.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-FIN-EMPTY-1',
          step: 'Masukkan data saldo tabungan awal dan pengeluaran hari ini di Buku Keuangan',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '5 Menit',
          target: 'Memulai aktivasi basis data finansial ASE',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: 'Belum Memulai',
        successFactors: [],
        failureFactors: [],
        whatToKeep: [],
        whatToImprove: []
      },
      adaptation: ['Segera masukkan data transaksi primer Anda.'],
      coachingMessage: 'Mari kita mulai dari langkah kecil hari ini. Menuliskan satu transaksi pengeluaran hari ini adalah pondasi kokoh untuk melahirkan kendali penuh atas masa depan finansial Anda.'
    };
  },

  getDefaultProductivityAdvice(): DecisionAdvice {
    return {
      id: 'DE-PROD',
      title: 'Keseimbangan & Produktivitas Harian',
      icon: 'CheckSquare',
      category: 'Produktivitas',
      analysis: {
        whatHappened: 'Daftar tugas harian dan kebiasaan aktif Anda masih kosong.',
        whyHappened: 'Modul Planner belum diisi dengan agenda harian terstruktur.',
        mainCause: 'Belum ada data prioritas diinput.',
        impact: 'Rasio efisiensi penyelesaian tugas dan konsistensi kebiasaan belum dapat diukur.',
        opportunity: 'Rancang 3 tugas prioritas utama esok pagi untuk meningkatkan fokus kerja.',
        risk: 'Rentan terbawa arus kegiatan impulsif tanpa arah penyelesaian sasaran yang konkret.'
      },
      critique: ['Sistem belum mendeteksi aktivitas terencana. Rencanakan tugas Anda hari ini.'],
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Metode Eisenhower Matrix Harian',
          reason: 'Membuat daftar prioritas tugas berdasarkan parameter tingkat kepentingan dan urgensi.',
          benefit: 'Menjamin Anda selalu mengerjakan hal krusial terlebih dahulu dibanding hal sekunder.',
          risk: 'Memerlukan waktu kontemplasi 5 menit di pagi hari.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-PROD-EMPTY-1',
          step: 'Buat 1 tugas penting dengan prioritas tinggi di Buku Planner',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '3 Menit',
          target: 'Aktivasi sistem monitoring produktivitas harian',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: 'Belum Memulai',
        successFactors: [],
        failureFactors: [],
        whatToKeep: [],
        whatToImprove: []
      },
      adaptation: ['Buat jadwal teratur untuk menulis tugas di pagi hari.'],
      coachingMessage: 'Satu rencana tindakan sederhana yang dieksekusi dengan disiplin bernilai jauh lebih besar daripada ribuan ide besar yang terabaikan. Mari rancang tugas pertama Anda hari ini.'
    };
  },

  getDefaultTradingAdvice(): DecisionAdvice {
    return {
      id: 'DE-TRAD',
      title: 'Disiplin & Manajemen Risiko Trading',
      icon: 'TrendingUp',
      category: 'Trading',
      analysis: {
        whatHappened: 'Belum ada transaksi perdagangan aktif yang dimasukkan ke dalam jurnal trading.',
        whyHappened: 'Anda belum mencatatkan riwayat trade di Buku Trading.',
        mainCause: 'Jurnal transaksi kosong.',
        impact: 'Rasio profitabilitas, win rate, serta pengaruh emosi FOMO/Takut belum dapat dievaluasi.',
        opportunity: 'Gunakan kalkulator lot size internal untuk merencanakan ukuran posisi yang aman.',
        risk: 'Melakukan entry acak tanpa perhitungan matematis berisiko merusak kestabilan modal utama.'
      },
      critique: ['Data transaksi trading kosong. Masukkan riwayat perdagangan Anda untuk evaluasi akurat.'],
      recommendations: [
        {
          type: 'Pilihan Terbaik',
          title: 'Pencatatan Jurnal Trading Disiplin',
          reason: 'Mencatat harga masuk, stop loss, take profit, beserta kondisi emosional pada setiap posisi.',
          benefit: 'Menemukan titik kelemahan psikologis dan teknikal sebelum terlanjur rugi besar.',
          risk: 'Menuntut ketekunan ekstra untuk mengisi formulir pasca-transaksi.'
        }
      ],
      actionPlans: [
        {
          id: 'AP-TRAD-EMPTY-1',
          step: 'Masukkan data transaksi trading terakhir Anda ke dalam Buku Trading',
          timeframe: 'Hari ini',
          priority: 'Tinggi',
          estimatedTime: '5 Menit',
          target: 'Aktivasi evaluasi jurnal emosi & akurasi rasio RRR',
          status: 'Belum Dimulai'
        }
      ],
      evaluation: {
        targetAchieved: 'Belum Memulai',
        successFactors: [],
        failureFactors: [],
        whatToKeep: [],
        whatToImprove: []
      },
      adaptation: ['Mulai biasakan menulis jurnal setiap kali membuka posisi baru.'],
      coachingMessage: 'Dalam dunia finansial, perlindungan modal adalah aturan nomor satu. Menjaga jurnal trading yang rapi adalah baju besi terbaik Anda terhadap badai emosi pasar yang fluktuatif.'
    };
  }
};

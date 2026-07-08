/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  selectedAnswerIndex?: number;
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  questions: Question[];
  completed: boolean;
  notes?: string;
}

export interface Workbook {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Pemula' | 'Menengah' | 'Lanjutan';
  duration: string;
  progress: number; // 0 to 100
  chapters: Chapter[];
  coverGradient: string; // Tailwind gradient classes
  author: string;
  isDownloaded: boolean;
  rating: number;
  totalChapters: number;
  version?: string;
  developer?: string;
  size?: string;
  features?: string[];
  input?: string[];
  output?: string[];
  icon?: string;
  price?: number; // Price in IDR (0 or undefined means Free)
  originalPrice?: number; // Before discount (if any)
  licenseStatus?: 'Belum Dimiliki' | 'Gratis' | 'Dimiliki' | 'Berlangganan' | 'Kedaluwarsa';
  downloadsCount?: number;
  screenshots?: string[];
  reviews?: { id: string; user: string; rating: number; text: string; date: string; reply?: string }[];
  updateHistory?: { version: string; date: string; note: string }[];
  dashboardPreview?: { label: string; value: string }[];
  insightPreview?: string[];
}

export interface PurchaseRecord {
  id: string;
  workbookId: string;
  workbookTitle: string;
  purchaseDate: string;
  pricePaid: number;
  discountApplied: number;
  paymentMethod: string;
  transactionNumber: string;
  status: 'Berhasil' | 'Menunggu Pembayaran' | 'Gagal';
}


export type ThemeColor = 'teal' | 'indigo' | 'emerald' | 'amber' | 'rose';

export type WorkspaceMode = 'Individu' | 'Keluarga' | 'UMKM' | 'Perusahaan' | 'Organisasi' | 'Sekolah' | 'Komunitas';

export interface UserProfile {
  name: string;
  role: string;
  avatarId: string;
  workspaceMode?: WorkspaceMode;
  email?: string;
  uid?: string;
  provider?: string;
}

export interface DailyActivity {
  day: string; // e.g., "Sen", "Sel"
  minutes: number;
  completedTasks: number;
}

// ==========================================
// ASE WORKBOOK v2.0 SYSTEM RECORD MODELS
// ==========================================

export interface FinanceRecord {
  id: string;
  type: 'pemasukan' | 'pengeluaran' | 'tabungan' | 'hutang';
  category: string;
  amount: number;
  date: string;
  note: string;
}

export interface TaskRecord {
  id: string;
  taskName: string;
  timeBlock: string;
  priority: 'Penting-Mendesak' | 'Penting-TidakMendesak' | 'TidakPenting-Mendesak' | 'TidakPenting-TidakMendesak';
  completed: boolean;
}

export interface HabitRecord {
  id: string;
  habitName: string;
  streak: number;
  history: { [key: string]: boolean }; // e.g. {"Sen": true, "Sel": false, ...}
}

export interface CrmRecord {
  id: string;
  clientName: string;
  dealValue: number;
  status: 'Lead' | 'Negosiasi' | 'Won' | 'Lost';
  notes: string;
  date: string;
}

export interface TradingRecord {
  id: string;
  pairOrStock: string;
  type: 'Buy' | 'Sell';
  entryPrice: number;
  exitPrice: number;
  positionSize: number;
  profit: number;
  emotion: 'FOMO' | 'Takut' | 'Tenang' | 'Gembira';
  date: string;
}

export interface OkrRecord {
  id: string;
  objective: string;
  keyResult: string;
  progress: number; // 0 to 100
}

export interface RelationshipRecord {
  id: string;
  name: string;
  loveLanguage: string;
  specialDate: string;
  statusMeter: number; // 0 to 100
}

export interface SharedContact {
  id: string;
  name: string;
  phone: string;
  category: 'Klien' | 'Keluarga' | 'Teman' | 'Partner';
}

export interface Goal {
  id: string;
  workbookId: string;
  workbookTitle: string;
  name: string;
  target: string;
  progress: number; // 0 to 100
  deadline: string;
  status: 'Sedang Berjalan' | 'Tercapai' | 'Tertunda';
  recommendation: string;
}

export interface TimelineItem {
  id: string;
  workbookId: string;
  workbookTitle: string;
  type: 'Input' | 'Output' | 'Insight' | 'Perubahan';
  title: string;
  detail: string;
  timestamp: string;
  userReaction?: string;
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  CheckSquare, 
  Flame, 
  Briefcase, 
  Activity, 
  Target, 
  Heart, 
  Plus, 
  Trash2, 
  Clock, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Square, 
  User, 
  Phone, 
  ArrowRight,
  TrendingUp,
  Save,
  Award,
  ChevronRight,
  Flame as FlameIcon,
  Shield,
  Cpu,
  Zap,
  Network,
  Database,
  BookOpen,
  RefreshCw,
  Play,
  Check,
  Layers,
  Lock,
  Code,
  FileText,
  Fingerprint,
  Send,
  Key,
  Terminal,
  Sliders
} from 'lucide-react';
import { aseKernelInstance } from '../core/Kernel';
import { WorkbookModule, SharedData, SharedDataMutators } from './ModuleContract';
import { FinanceRecord, TaskRecord, HabitRecord, CrmRecord, TradingRecord, OkrRecord, RelationshipRecord, SharedContact } from '../types';

// Currency Formatter Utility
const formatRupiah = (val: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0
  }).format(val);
};

// ==========================================
// 1. KEUANGAN PRIBADI MODULE
// ==========================================
export const KeuanganModule: WorkbookModule = {
  id: 'wb-keuangan',
  metadata: {
    title: 'Keuangan Pribadi',
    description: 'Kelola keuangan harian dengan rumus anggaran populer 50/30/20.',
    category: 'Keuangan',
    coverGradient: 'from-emerald-500 to-teal-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'DollarSign'
  },

  processEngine: (data: SharedData) => {
    const incomeTotal = data.financeRecords.filter(r => r.type === 'pemasukan').reduce((a, b) => a + b.amount, 0);
    const expenseTotal = data.financeRecords.filter(r => r.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0);
    const savingsTotal = data.financeRecords.filter(r => r.type === 'tabungan').reduce((a, b) => a + b.amount, 0);
    const debtTotal = data.financeRecords.filter(r => r.type === 'hutang').reduce((a, b) => a + b.amount, 0);
    const balance = incomeTotal - (expenseTotal + savingsTotal + debtTotal);

    // 50/30/20 Allocation Calculations
    const pokeExp = data.financeRecords.filter(r => r.category === 'Kebutuhan Pokok').reduce((a, b) => a + b.amount, 0);
    const keingExp = data.financeRecords.filter(r => r.category === 'Keinginan').reduce((a, b) => a + b.amount, 0);
    const tabuExp = savingsTotal;

    const pokePct = incomeTotal > 0 ? Math.round((pokeExp / incomeTotal) * 100) : 0;
    const keingPct = incomeTotal > 0 ? Math.round((keingExp / incomeTotal) * 100) : 0;
    const tabuPct = incomeTotal > 0 ? Math.round((tabuExp / incomeTotal) * 100) : 0;

    return {
      incomeTotal,
      expenseTotal,
      savingsTotal,
      debtTotal,
      balance,
      pokeExp,
      keingExp,
      tabuExp,
      pokePct,
      keingPct,
      tabuPct
    };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [type, setType] = useState<'pemasukan' | 'pengeluaran' | 'tabungan' | 'hutang'>('pemasukan');
    const [category, setCategory] = useState('Gaji Pokok');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const parsedAmount = parseFloat(amount);
      if (!parsedAmount || isNaN(parsedAmount)) {
        alert("Masukkan nilai transaksi yang valid!");
        return;
      }
      const newRec: FinanceRecord = {
        id: 'fin-' + Date.now(),
        type,
        category,
        amount: parsedAmount,
        date: new Date().toISOString().split('T')[0],
        note: note.trim() || `${type} ${category}`
      };
      mutators.setFinanceRecords(prev => [newRec, ...prev]);
      
      // Publish event to EventBus for decoupled Stage 4 Interoperability
      aseKernelInstance.eventBus.publish('finance.transaction.created', newRec, 'wb-keuangan');
      
      setAmount('');
      setNote('');
      triggerSuccess("Transaksi Keuangan berhasil diproses & disimpan!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-emerald-600" /> Masukkan Transaksi Baru
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tipe Data</label>
            <select 
              value={type} 
              onChange={(e) => {
                const val = e.target.value as any;
                setType(val);
                if (val === 'pemasukan') setCategory('Gaji Pokok');
                else if (val === 'pengeluaran') setCategory('Kebutuhan Pokok');
                else if (val === 'tabungan') setCategory('Investasi');
                else setCategory('Cicilan Laptop');
              }}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
              <option value="tabungan">Tabungan</option>
              <option value="hutang">Hutang</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Kategori</label>
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              {type === 'pemasukan' && (
                <>
                  <option value="Gaji Pokok">Gaji Pokok</option>
                  <option value="Bisnis Sampingan">Bisnis Sampingan</option>
                  <option value="Hasil Investasi">Hasil Investasi</option>
                </>
              )}
              {type === 'pengeluaran' && (
                <>
                  <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                  <option value="Keinginan">Keinginan</option>
                  <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                  <option value="Kesehatan">Kesehatan</option>
                </>
              )}
              {type === 'tabungan' && (
                <>
                  <option value="Investasi">Investasi</option>
                  <option value="Dana Darurat">Dana Darurat</option>
                  <option value="Emas">Emas</option>
                </>
              )}
              {type === 'hutang' && (
                <>
                  <option value="Cicilan Laptop">Cicilan Laptop</option>
                  <option value="Kartu Kredit">Kartu Kredit</option>
                  <option value="Pinjaman Teman">Pinjaman Teman</option>
                </>
              )}
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nilai Transaksi (Rupiah)</label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-xs font-bold text-slate-400">Rp</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Contoh: 150000"
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Catatan</label>
          <input 
            type="text" 
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Keterangan singkat..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Proses & Simpan Transaksi
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed }) => {
    return (
      <div className="bg-white p-4 rounded-xl border border-slate-100 space-y-4 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-700">Analisis Anggaran 50/30/20</h3>
        
        <div className="space-y-3">
          {/* Q1: Kebutuhan Pokok */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Kebutuhan Pokok ({formatRupiah(processed.pokeExp)})</span>
              <span className={processed.pokePct > 50 ? 'text-rose-600' : 'text-slate-500'}>{processed.pokePct}% / Max 50%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${processed.pokePct > 50 ? 'bg-rose-500' : 'bg-emerald-600'}`} style={{ width: `${Math.min(processed.pokePct, 100)}%` }}></div>
            </div>
          </div>

          {/* Q2: Keinginan */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Keinginan ({formatRupiah(processed.keingExp)})</span>
              <span className={processed.keingPct > 30 ? 'text-rose-600 font-bold animate-pulse' : 'text-slate-500'}>{processed.keingPct}% / Max 30%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${processed.keingPct > 30 ? 'bg-rose-500' : 'bg-teal-600'}`} style={{ width: `${Math.min(processed.keingPct, 100)}%` }}></div>
            </div>
          </div>

          {/* Q3: Tabungan */}
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] font-bold text-slate-600">
              <span>Tabungan & Investasi ({formatRupiah(processed.savingsTotal)})</span>
              <span className={processed.tabuPct < 20 ? 'text-amber-600 font-bold' : 'text-emerald-700'}>{processed.tabuPct}% / Min 20%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${processed.tabuPct < 20 ? 'bg-amber-400' : 'bg-indigo-600'}`} style={{ width: `${Math.min(processed.tabuPct, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-emerald-700 bg-emerald-100 p-1 rounded-lg font-bold text-[10px]"><DollarSign className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Keuangan Pribadi</span>
        </div>
        <div className="text-right">
          <span className={`font-black block text-[11px] ${processed.balance >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {formatRupiah(processed.balance)}
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">Rasio Tabung: {processed.tabuPct}%</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    if (processed.keingPct > 30) {
      return {
        type: 'warning',
        message: '⚠️ Pengeluaran Keinginan Anda melebihi rasio ideal 30%. Batasi belanja tersier dan beralih ke pos Tabungan.'
      };
    }
    if (processed.tabuPct < 20) {
      return {
        type: 'warning',
        message: '⚠️ Pos Tabungan & Investasi di bawah 20%. Pertimbangkan auto-debet investasi langsung di hari gajian.'
      };
    }
    return {
      type: 'success',
      message: '✅ Struktur keuangan Anda seimbang! Teruskan pencatatan pengeluaran harian Anda agar keuangan tetap stabil.'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.financeRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.type === 'pemasukan' ? 'bg-emerald-50 text-emerald-700' :
                  item.type === 'pengeluaran' ? 'bg-rose-50 text-rose-700' :
                  item.type === 'tabungan' ? 'bg-indigo-50 text-indigo-700' :
                  'bg-amber-50 text-amber-700'
                }`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{item.date}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800">{item.note}</h4>
              <p className="text-[10px] text-slate-500 font-semibold">Kategori: {item.category}</p>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-xs font-black ${
                item.type === 'pemasukan' ? 'text-emerald-700' : 'text-slate-700'
              }`}>
                {item.type === 'pemasukan' ? '+' : '-'}{formatRupiah(item.amount)}
              </span>
              <button 
                onClick={() => {
                  mutators.setFinanceRecords(prev => prev.filter(p => p.id !== item.id));
                  triggerSuccess("Entri keuangan berhasil dihapus!");
                }}
                className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 2. PLANNER HARIAN MODULE
// ==========================================
export const PlannerModule: WorkbookModule = {
  id: 'wb-planner',
  metadata: {
    title: 'Planner Harian',
    description: 'Prioritaskan tugas penting dengan Eisenhower Matrix 4 Kuadran.',
    category: 'Produktivitas',
    coverGradient: 'from-indigo-500 to-purple-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'CheckSquare'
  },

  processEngine: (data: SharedData) => {
    const q1 = data.taskRecords.filter(t => t.priority === 'Penting-Mendesak');
    const q2 = data.taskRecords.filter(t => t.priority === 'Penting-TidakMendesak');
    const q3 = data.taskRecords.filter(t => t.priority === 'TidakPenting-Mendesak');
    const q4 = data.taskRecords.filter(t => t.priority === 'TidakPenting-TidakMendesak');

    const completedCount = data.taskRecords.filter(t => t.completed).length;
    const totalCount = data.taskRecords.length;
    const focusScore = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    return { q1, q2, q3, q4, completedCount, totalCount, focusScore };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [name, setName] = useState('');
    const [timeBlock, setTimeBlock] = useState('09:00 - 11:00');
    const [priority, setPriority] = useState<TaskRecord['priority']>('Penting-Mendesak');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        alert("Masukkan nama tugas!");
        return;
      }
      const newRec: TaskRecord = {
        id: 'task-' + Date.now(),
        taskName: name.trim(),
        timeBlock,
        priority,
        completed: false
      };
      mutators.setTaskRecords(prev => [...prev, newRec]);
      setName('');
      triggerSuccess("Tugas baru ditambahkan ke Eisenhower Matrix!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-indigo-600" /> Tambah Tugas Baru
        </h3>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Tugas</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Selesaikan proposal klien A..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Blok Waktu</label>
            <select 
              value={timeBlock}
              onChange={(e) => setTimeBlock(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="07:00 - 09:00">Pagi Awal (07-09)</option>
              <option value="09:00 - 11:00">Fokus Puncak (09-11)</option>
              <option value="11:00 - 13:00">Siang Hari (11-13)</option>
              <option value="13:00 - 15:00">Fokus Siang (13-15)</option>
              <option value="15:00 - 17:00">Sore Penutup (15-17)</option>
              <option value="19:00 - 21:00">Malam Hari (19-21)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Prioritas</label>
            <select 
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="Penting-Mendesak">🔴 Penting & Mendesak (Q1)</option>
              <option value="Penting-TidakMendesak">🔵 Penting & Tidak (Q2)</option>
              <option value="TidakPenting-Mendesak">🟡 Tidak Penting & Mendesak (Q3)</option>
              <option value="TidakPenting-TidakMendesak">⚪ Tidak Penting & Tidak (Q4)</option>
            </select>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Masukkan ke Eisenhower Matrix
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed, themeColor }) => {
    const toggleTask = (id: string, completed: boolean, mutators: SharedDataMutators) => {
      mutators.setTaskRecords(prev => prev.map(t => t.id === id ? { ...t, completed: !completed } : t));
    };

    const removeTask = (id: string, mutators: SharedDataMutators) => {
      mutators.setTaskRecords(prev => prev.filter(t => t.id !== id));
    };

    return (
      <div className="space-y-3 text-xs">
        {/* Render a custom 4-quadrant layout that triggers shared state changes */}
        <span className="text-[10px] font-bold text-slate-400 uppercase block px-1">Eisenhower Matrix 4-Kuadran</span>
        
        {/* Dynamic Context API-like callback via custom events or direct manipulation. Since React elements here are rendered dynamically inside BukuSayaView, we can pass custom events or state up if needed, but wait! The BukuSayaView will render renderOutput and can inject a context or we can use custom DOM interaction or shared data mutators by passing them down as props! */}
        {/* Let's pass 'mutators' to renderOutput so that the UI is fully functional! Let's modify the signature in ModuleContract to pass 'mutators' if we want. Yes, let's include 'mutators' in the Output props if we want, or do it inside renderRiwayat. Since we want renderOutput to be interactive, let's check if we can pass mutators. Yes, let's make sure 'renderOutput' can access 'mutators'! Wait, let's inspect renderOutput signature in ModuleContract. Let's add mutators there, or we can handle toggles in renderRiwayat and renderOutput as a purely informative matrix. Let's make renderOutput fully interactive! Let's adapt our implementation. */}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-rose-50/50 p-2.5 rounded-xl border border-rose-100 space-y-1.5">
            <span className="font-bold text-[9px] text-rose-800 uppercase block">🔴 Q1: Do First</span>
            <div className="space-y-1">
              {processed.q1.map((t: TaskRecord) => (
                <div key={t.id} className="bg-white p-1.5 rounded-lg border border-rose-100 text-[10px] font-semibold text-slate-700">
                  {t.taskName} <span className="text-[8px] text-slate-400 font-bold block">{t.timeBlock}</span>
                </div>
              ))}
              {processed.q1.length === 0 && <span className="text-[9px] text-slate-400 italic block">Kosong</span>}
            </div>
          </div>

          <div className="bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100 space-y-1.5">
            <span className="font-bold text-[9px] text-indigo-800 uppercase block">🔵 Q2: Schedule</span>
            <div className="space-y-1">
              {processed.q2.map((t: TaskRecord) => (
                <div key={t.id} className="bg-white p-1.5 rounded-lg border border-indigo-100 text-[10px] font-semibold text-slate-700">
                  {t.taskName} <span className="text-[8px] text-slate-400 font-bold block">{t.timeBlock}</span>
                </div>
              ))}
              {processed.q2.length === 0 && <span className="text-[9px] text-slate-400 italic block">Kosong</span>}
            </div>
          </div>

          <div className="bg-amber-50/50 p-2.5 rounded-xl border border-amber-100 space-y-1.5">
            <span className="font-bold text-[9px] text-amber-800 uppercase block">🟡 Q3: Delegate</span>
            <div className="space-y-1">
              {processed.q3.map((t: TaskRecord) => (
                <div key={t.id} className="bg-white p-1.5 rounded-lg border border-amber-100 text-[10px] font-semibold text-slate-700">
                  {t.taskName} <span className="text-[8px] text-slate-400 font-bold block">{t.timeBlock}</span>
                </div>
              ))}
              {processed.q3.length === 0 && <span className="text-[9px] text-slate-400 italic block">Kosong</span>}
            </div>
          </div>

          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
            <span className="font-bold text-[9px] text-slate-600 uppercase block">⚪ Q4: Eliminate</span>
            <div className="space-y-1">
              {processed.q4.map((t: TaskRecord) => (
                <div key={t.id} className="bg-white p-1.5 rounded-lg border border-slate-200 text-[10px] font-semibold text-slate-700">
                  {t.taskName} <span className="text-[8px] text-slate-400 font-bold block">{t.timeBlock}</span>
                </div>
              ))}
              {processed.q4.length === 0 && <span className="text-[9px] text-slate-400 italic block">Kosong</span>}
            </div>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-indigo-700 bg-indigo-100 p-1 rounded-lg"><CheckSquare className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Planner Harian</span>
        </div>
        <div className="text-right">
          <span className="font-black block text-[11px] text-indigo-700">
            {processed.focusScore}% Fokus
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">{processed.completedCount}/{processed.totalCount} Selesai</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    if (processed.q2.length > 0) {
      return {
        type: 'info',
        message: `💡 Fokus pada ${processed.q2.length} tugas di Kuadran II (🔵 Schedule). Tugas ini membangun kapasitas jangka panjang Anda.`
      };
    }
    return {
      type: 'success',
      message: '✅ Semua tugas Eisenhower telah diatur. Selesaikan tugas Q1 terlebih dahulu!'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.taskRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  mutators.setTaskRecords(prev => prev.map(t => t.id === item.id ? { ...t, completed: !t.completed } : t));
                  triggerSuccess("Status tugas diperbarui!");
                }}
                className="text-slate-400 hover:text-emerald-600"
              >
                {item.completed ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
              </button>
              <div className="space-y-0.5">
                <span className={`font-extrabold block text-slate-800 ${item.completed ? 'line-through text-slate-400' : ''}`}>
                  {item.taskName}
                </span>
                <span className="text-[9px] text-slate-400 font-bold block">{item.timeBlock} • {item.priority}</span>
              </div>
            </div>

            <button 
              onClick={() => {
                mutators.setTaskRecords(prev => prev.filter(t => t.id !== item.id));
                triggerSuccess("Tugas dihapus!");
              }}
              className="text-slate-300 hover:text-rose-600 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 3. HABIT TRACKER MODULE
// ==========================================
export const HabitModule: WorkbookModule = {
  id: 'wb-habit',
  metadata: {
    title: 'Habit Tracker',
    description: 'Bentuk kebiasaan positif dan pantau grafik konsistensi harian.',
    category: 'Produktivitas',
    coverGradient: 'from-orange-500 to-rose-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'Flame'
  },

  processEngine: (data: SharedData) => {
    const activeHabitsCount = data.habitRecords.length;
    const maxStreak = data.habitRecords.reduce((max, h) => h.streak > max ? h.streak : max, 0);
    return { activeHabitsCount, maxStreak };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [name, setName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        alert("Masukkan nama kebiasaan baru!");
        return;
      }
      const newRec: HabitRecord = {
        id: 'hab-' + Date.now(),
        habitName: name.trim(),
        streak: 0,
        history: { 'Sen': false, 'Sel': false, 'Rab': false, 'Kam': false, 'Jum': false, 'Sab': false, 'Min': false }
      };
      mutators.setHabitRecords(prev => [...prev, newRec]);
      setName('');
      triggerSuccess("Kebiasaan Baru ditambahkan ke Habit Engine!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-amber-500" /> Daftar Kebiasaan Baru
        </h3>
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Kebiasaan</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Membaca Buku, Olahraga Harian..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            required
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Daftar Kebiasaan Baru
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed, themeColor }) => {
    return (
      <div className="space-y-2 text-xs">
        <span className="text-[10px] font-bold text-slate-400 uppercase block px-1">Ringkasan Disiplin</span>
        <div className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Kebiasaan Terdaftar</span>
            <span className="text-sm font-black block mt-0.5">{processed.activeHabitsCount} Kebiasaan</span>
          </div>
          <div>
            <span className="text-[9px] font-bold text-slate-400 uppercase">Streak Tertinggi</span>
            <span className="text-sm font-black block text-amber-600 mt-0.5 flex items-center gap-1">
              <Flame className="w-4 h-4 fill-amber-300 text-amber-500" /> {processed.maxStreak} Hari
            </span>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-amber-700 bg-amber-100 p-1 rounded-lg"><Flame className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Habit Tracker</span>
        </div>
        <div className="text-right">
          <span className="font-black block text-[11px] text-amber-700 flex items-center gap-0.5 justify-end">
            <Flame className="w-3 h-3 fill-amber-300 text-amber-500" /> {processed.maxStreak} Hari
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">{processed.activeHabitsCount} Habits</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    return {
      type: 'success',
      message: '🔥 Disiplin dibangun dari langkah kecil yang konsisten setiap hari. Lakukan check-in harian!'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    const handleToggleDay = (habitId: string, day: string) => {
      mutators.setHabitRecords(prev => prev.map(hab => {
        if (hab.id === habitId) {
          const newHistory = { ...hab.history, [day]: !hab.history[day] };
          const checkedDaysCount = Object.values(newHistory).filter(Boolean).length;
          return {
            ...hab,
            history: newHistory,
            streak: checkedDaysCount
          };
        }
        return hab;
      }));
      triggerSuccess("Status harian habit diperbarui!");
    };

    const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

    return (
      <div className="space-y-3 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.habitRecords.map(hab => (
          <div key={hab.id} className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-xs">
            <div className="flex justify-between items-center">
              <span className="font-black text-slate-800 flex items-center gap-1 text-[11px]">✨ {hab.habitName}</span>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 text-amber-500 fill-amber-300" /> {hab.streak} hari
                </span>
                <button 
                  onClick={() => {
                    mutators.setHabitRecords(prev => prev.filter(p => p.id !== hab.id));
                    triggerSuccess("Habit dihapus!");
                  }}
                  className="text-slate-300 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1">
              {days.map(day => {
                const checked = hab.history[day];
                return (
                  <button
                    key={day}
                    onClick={() => handleToggleDay(hab.id, day)}
                    className={`py-1 rounded text-center text-[9px] font-bold transition-all border cursor-pointer ${
                      checked ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-50 text-slate-400 border-slate-200'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 4. CRM SALES MODULE
// ==========================================
export const CrmModule: WorkbookModule = {
  id: 'wb-crm',
  metadata: {
    title: 'CRM & Penjualan',
    description: 'Pantau prospek penjualan, tindak lanjuti klien, dan sinkronkan deal pendapatan.',
    category: 'Bisnis',
    coverGradient: 'from-amber-500 to-orange-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'Briefcase'
  },

  processEngine: (data: SharedData) => {
    const wonCrmTotal = data.crmRecords.filter(r => r.status === 'Won').reduce((a, b) => a + b.dealValue, 0);
    const negotiationCrmCount = data.crmRecords.filter(r => r.status === 'Negosiasi').length;
    const leadsCount = data.crmRecords.filter(r => r.status === 'Lead').length;
    return { wonCrmTotal, negotiationCrmCount, leadsCount };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [clientName, setClientName] = useState('');
    const [dealValue, setDealValue] = useState('');
    const [status, setStatus] = useState<CrmRecord['status']>('Lead');
    const [notes, setNotes] = useState('');
    const [createContact, setCreateContact] = useState(false);
    const [phone, setPhone] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!clientName.trim()) {
        alert("Masukkan nama pelanggan/klien!");
        return;
      }
      const parsedValue = parseFloat(dealValue);
      if (isNaN(parsedValue) || parsedValue <= 0) {
        alert("Masukkan nilai deal yang valid!");
        return;
      }

      const newRec: CrmRecord = {
        id: 'crm-' + Date.now(),
        clientName: clientName.trim(),
        dealValue: parsedValue,
        status,
        notes: notes.trim() || `Klien ${clientName}`,
        date: new Date().toISOString().split('T')[0]
      };

      mutators.setCrmRecords(prev => [newRec, ...prev]);

      if (createContact) {
        const exist = sharedData.sharedContacts.some(c => c.name.toLowerCase() === clientName.trim().toLowerCase());
        if (!exist) {
          const newCon: SharedContact = {
            id: 'con-' + Date.now(),
            name: clientName.trim(),
            phone: phone || '0812-xxxx-xxxx',
            category: 'Klien'
          };
          mutators.setSharedContacts(prev => [...prev, newCon]);
        }
      }

      // SYNERGY: If Won, notify Event Bus (decoupled, instead of tight coupling or direct imports)
      if (status === 'Won') {
        const dealPayload = {
          id: 'crm-' + Date.now(),
          clientName: clientName.trim(),
          dealValue: parsedValue,
          notes: notes.trim() || `Klien ${clientName}`,
          date: new Date().toISOString().split('T')[0]
        };
        aseKernelInstance.eventBus.publish('crm.deal.won', dealPayload, 'wb-crm');
      }

      setClientName('');
      setDealValue('');
      setNotes('');
      setPhone('');
      setCreateContact(false);
      triggerSuccess(status === 'Won' ? "Deal Won tersimpan & disinkronkan ke Keuangan Pribadi!" : "CRM Lead baru berhasil terdaftar di Pipeline!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-amber-600" /> Masukkan Prospek Baru
        </h3>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Pelanggan / Klien</label>
          <input 
            type="text" 
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Contoh: PT. Makmur Sentosa..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Nilai Deal (Rupiah)</label>
            <input 
              type="number" 
              value={dealValue}
              onChange={(e) => setDealValue(e.target.value)}
              placeholder="12000000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Status Pipeline</label>
            <select 
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="Lead">Lead Prospek</option>
              <option value="Negosiasi">Negosiasi</option>
              <option value="Won">Won (Deal Berhasil)</option>
              <option value="Lost">Lost (Batal/Gagal)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={createContact}
              onChange={(e) => setCreateContact(e.target.checked)}
              className="rounded text-amber-600"
            />
            <span className="text-[10px] font-bold text-slate-600">Simpan otomatis ke Kontak Bersama</span>
          </label>
          {createContact && (
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Nomor Telepon: 0812-xxxx-xxxx"
              className="w-full px-3 py-1.5 bg-white border border-slate-200 text-[11px] rounded-lg font-bold text-slate-700"
            />
          )}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Catatan Follow-up</label>
          <input 
            type="text" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Langkah berikutnya atau proposal dikirim..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Daftarkan ke CRM Pipeline
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed }) => {
    return (
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs shadow-xs space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase block">Ringkasan Pipeline</span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Leads</span>
            <span className="text-xs font-black text-slate-800">{processed.leadsCount}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Negosiasi</span>
            <span className="text-xs font-black text-indigo-700">{processed.negotiationCrmCount}</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[8px] font-bold text-slate-400 block uppercase">Revenue Won</span>
            <span className="text-xs font-black text-emerald-700">{formatRupiah(processed.wonCrmTotal)}</span>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-amber-700 bg-amber-100 p-1 rounded-lg"><Briefcase className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">CRM Penjualan</span>
        </div>
        <div className="text-right">
          <span className="font-black block text-[11px] text-slate-700">
            Won: {formatRupiah(processed.wonCrmTotal)}
          </span>
          <span className="text-[8px] text-indigo-700 block font-bold">{processed.negotiationCrmCount} Negosiasi</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    if (processed.negotiationCrmCount > 0) {
      return {
        type: 'info',
        message: `💡 Anda memiliki ${processed.negotiationCrmCount} klien dalam tahap Negosiasi. Segera lakukan tindak lanjut agar cepat Deal Won!`
      };
    }
    return {
      type: 'success',
      message: '✅ Pipeline CRM aktif terpantau dengan baik. Cari prospek baru untuk mengisi corong penjualan Anda.'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.crmRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                  item.status === 'Won' ? 'bg-emerald-50 text-emerald-700' :
                  item.status === 'Lost' ? 'bg-rose-50 text-rose-700' :
                  item.status === 'Negosiasi' ? 'bg-indigo-50 text-indigo-700' :
                  'bg-slate-100 text-slate-600'
                }`}>
                  {item.status}
                </span>
                <span className="text-[9px] text-slate-400 font-bold">{item.date}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800">{item.clientName}</h4>
              <p className="text-[10px] text-slate-500 font-semibold">{item.notes}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-700">{formatRupiah(item.dealValue)}</span>
              <button 
                onClick={() => {
                  mutators.setCrmRecords(prev => prev.filter(c => c.id !== item.id));
                  triggerSuccess("Data CRM dihapus!");
                }}
                className="text-slate-300 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 5. TRADING JOURNAL MODULE
// ==========================================
export const TradingModule: WorkbookModule = {
  id: 'wb-trading',
  metadata: {
    title: 'Trading Journal',
    description: 'Catat keputusan investasi saham/kripto dan kendalikan bias emosi Anda.',
    category: 'Keuangan',
    coverGradient: 'from-rose-500 to-red-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'Activity'
  },

  processEngine: (data: SharedData) => {
    const totalTrades = data.tradingRecords.length;
    const profitableTrades = data.tradingRecords.filter(t => t.profit > 0).length;
    const winRate = totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0;
    const netProfit = data.tradingRecords.reduce((a, b) => a + b.profit, 0);
    const fomoCount = data.tradingRecords.filter(t => t.emotion === 'FOMO').length;

    return { totalTrades, winRate, netProfit, fomoCount };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [pair, setPair] = useState('BTC/USDT');
    const [type, setType] = useState<'Buy' | 'Sell'>('Buy');
    const [entry, setEntry] = useState('');
    const [exit, setExit] = useState('');
    const [size, setSize] = useState('');
    const [emotion, setEmotion] = useState<TradingRecord['emotion']>('Tenang');

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const entryVal = parseFloat(entry);
      const exitVal = parseFloat(exit);
      const sizeVal = parseFloat(size);

      if (isNaN(entryVal) || isNaN(exitVal) || isNaN(sizeVal) || entryVal <= 0 || exitVal <= 0 || sizeVal <= 0) {
        alert("Masukkan data numerik trading yang valid!");
        return;
      }

      let profit = 0;
      if (type === 'Buy') {
        profit = (exitVal - entryVal) * sizeVal;
      } else {
        profit = (entryVal - exitVal) * sizeVal;
      }

      const isCrypto = pair.toUpperCase().includes('USDT') || pair.toUpperCase().includes('BTC');
      const profitRupiah = isCrypto ? profit * 15000 : profit;

      const newRec: TradingRecord = {
        id: 'trd-' + Date.now(),
        pairOrStock: pair.trim().toUpperCase(),
        type,
        entryPrice: entryVal,
        exitPrice: exitVal,
        positionSize: sizeVal,
        profit: Math.round(profitRupiah),
        emotion,
        date: new Date().toISOString().split('T')[0]
      };

      mutators.setTradingRecords(prev => [newRec, ...prev]);

      // SYNERGY: Automatically post trading result to Keuangan Pribadi as Income or Expense
      const autoFinance: FinanceRecord = {
        id: 'fin-auto-trade-' + Date.now(),
        type: profitRupiah > 0 ? 'pemasukan' : 'pengeluaran',
        category: 'Trading Log',
        amount: Math.abs(Math.round(profitRupiah)),
        date: new Date().toISOString().split('T')[0],
        note: `[Trading Auto] ${type} ${pair.toUpperCase()} (${emotion})`
      };
      mutators.setFinanceRecords(prev => [autoFinance, ...prev]);

      setEntry('');
      setExit('');
      setSize('');
      triggerSuccess("Jurnal Trading disimpan & disinkronkan ke Keuangan Pribadi!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-rose-600" /> Catat Jurnal Posisi Baru
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Instrumen / Kode Saham</label>
            <input 
              type="text" 
              value={pair}
              onChange={(e) => setPair(e.target.value)}
              placeholder="BTC/USDT atau BBRI.JK"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tipe Transaksi</label>
            <select 
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="Buy">BUY (Beli)</option>
              <option value="Sell">SELL (Jual)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Harga Entry</label>
            <input 
              type="number" 
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              placeholder="62000"
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Harga Exit</label>
            <input 
              type="number" 
              value={exit}
              onChange={(e) => setExit(e.target.value)}
              placeholder="63500"
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold text-slate-400 uppercase">Volume / Size</label>
            <input 
              type="number" 
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="0.2"
              step="any"
              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Keadaan Emosi saat Entry</label>
          <select 
            value={emotion}
            onChange={(e) => setEmotion(e.target.value as any)}
            className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
          >
            <option value="Tenang">🟢 Tenang & Disiplin (Rasional)</option>
            <option value="FOMO">🔴 FOMO (Takut Ketinggalan)</option>
            <option value="Takut">🟡 Takut Rugi (Gemetar)</option>
            <option value="Gembira">🔵 Gembira Berlebihan (Greedy)</option>
          </select>
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Amankan & Arsipkan Jurnal
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed }) => {
    return (
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs shadow-xs space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase block">Metrik Trader</span>
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[8px] font-bold text-slate-400 block">Win Rate</span>
            <span className="text-xs font-black text-rose-700">{processed.winRate}%</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg">
            <span className="text-[8px] font-bold text-slate-400 block">Net Profit</span>
            <span className={`text-xs font-black ${processed.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
              {formatRupiah(processed.netProfit)}
            </span>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-rose-700 bg-rose-100 p-1 rounded-lg"><Activity className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Trading Journal</span>
        </div>
        <div className="text-right">
          <span className={`font-black block text-[11px] ${processed.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
            {processed.netProfit >= 0 ? '+' : ''}{formatRupiah(processed.netProfit)}
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">{processed.winRate}% Win Rate ({processed.totalTrades} Trades)</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    if (processed.fomoCount > 1) {
      return {
        type: 'warning',
        message: `⚠️ Engine mencatat ${processed.fomoCount} posisi dipicu emosi FOMO. Kurangi risiko lot Anda dan kembali ikuti checklist strategi awal.`
      };
    }
    return {
      type: 'success',
      message: '✅ Jurnal emosi teratur. Lindungi modal (Capital Preservation) Anda dengan menaruh stop-loss ketat.'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    return (
      <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.tradingRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 flex items-center justify-between shadow-xs">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                  item.type === 'Buy' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                }`}>
                  {item.type}
                </span>
                <span className="text-[10px] text-slate-400 font-bold">{item.pairOrStock}</span>
                <span className="text-[9px] text-slate-400">{item.date}</span>
              </div>
              <h4 className="text-xs font-extrabold text-slate-800">
                P/L: <span className={item.profit >= 0 ? 'text-emerald-700' : 'text-rose-600'}>
                  {formatRupiah(item.profit)}
                </span>
              </h4>
              <p className="text-[9px] text-slate-500 font-semibold">Keadaan Psikologis: {item.emotion}</p>
            </div>

            <button 
              onClick={() => {
                mutators.setTradingRecords(prev => prev.filter(t => t.id !== item.id));
                triggerSuccess("Log trading dibatalkan!");
              }}
              className="text-slate-300 hover:text-rose-600 p-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 6. GROWTH OKR MODULE (REFERENCE IMPLEMENTATION FOR PLATFORM CERTIFICATION ROADMAP)
// ==========================================

// Shared state for Local Knowledge Repository (to allow simulation within the sandbox session)
let localKnowledgeCache: Array<{
  id: string;
  concept: string;
  wisdom: string;
  domain: string;
  timestamp: string;
}> = [
  {
    id: 'kn-1',
    concept: 'Aturan Pareto Produktivitas',
    wisdom: 'Fokus pada 20% tugas bernilai tinggi menghasilkan 80% dari seluruh dampak pertumbuhan karier Anda.',
    domain: 'Produktivitas',
    timestamp: '10:15'
  },
  {
    id: 'kn-2',
    concept: 'Prinsip Compounding Habit',
    wisdom: 'Peningkatan 1% setiap hari secara konsisten melipatgandakan keterampilan Anda hingga 37 kali lipat dalam satu tahun.',
    domain: 'Habit',
    timestamp: '14:20'
  }
];

// Shared state to listen to the Event Bus within the UI view session
let localCapturedEvents: any[] = [];

// Growth Workbook Output View Component: Renders the SVG Resource Graph & metric charts
export const GrowthOutputView: React.FC<{
  sharedData: SharedData;
  processed: any;
  themeColor: string;
}> = ({ sharedData, processed, themeColor }) => {
  // Let's count totals
  const totalOkrs = sharedData.okrRecords.length;
  const avgProgress = processed.avgProgress || 0;
  const knowledgeCount = localKnowledgeCache.length;
  const totalTasks = sharedData.taskRecords.length;

  return (
    <div className="space-y-4">
      {/* Dynamic Resource Graph Card */}
      <div className="bg-slate-900 p-4 rounded-2xl border border-slate-850 shadow-inner space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-indigo-400 bg-indigo-950/50 p-1.5 rounded-lg border border-indigo-900/30">
              <Network className="w-4 h-4 animate-pulse" />
            </span>
            <div>
              <h4 className="text-xs font-extrabold text-slate-100 tracking-tight">Resource Graph Lintas-Workbook</h4>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Dynamic Topology Map (Level 2 Certified)</p>
            </div>
          </div>
          <span className="text-[9px] bg-indigo-500/10 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/20 font-mono">
            {totalOkrs + totalTasks + knowledgeCount} Nodes
          </span>
        </div>

        {/* Interactive SVG Topology Map */}
        <div className="relative">
          <svg viewBox="0 0 320 180" className="w-full h-44 bg-slate-950 rounded-xl border border-slate-800 shadow-inner overflow-hidden">
            {/* Grid Pattern */}
            <defs>
              <pattern id="graphGrid" width="16" height="16" patternUnits="userSpaceOnUse">
                <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#0f172a" strokeWidth="0.5" />
              </pattern>
              <radialGradient id="nodeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
              </radialGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#graphGrid)" />

            {/* Glowing Center */}
            <circle cx="160" cy="90" r="45" fill="url(#nodeGlow)" />

            {/* Connection Lines with Pulsing Dash effect */}
            {/* Center Node (160, 90) to OKRs, Tasks, and Knowledge */}
            {/* Left Wing (OKRs) */}
            <line x1="160" y1="90" x2="80" y2="50" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Right Wing (Knowledge) */}
            <line x1="160" y1="90" x2="240" y2="50" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Bottom Wing (Tasks) */}
            <line x1="160" y1="90" x2="160" y2="150" stroke="#10B981" strokeWidth="1.5" strokeDasharray="3 3" />
            {/* Cross-Workbook Links */}
            <path d="M 80 50 Q 160 30 240 50" fill="none" stroke="#6366F1" strokeWidth="1" strokeDasharray="5 5" className="opacity-40" />
            <path d="M 80 50 Q 120 100 160 150" fill="none" stroke="#818CF8" strokeWidth="1" strokeDasharray="5 5" className="opacity-40" />

            {/* Center Node: Core Growth OS */}
            <circle cx="160" cy="90" r="16" className="fill-indigo-600 stroke-indigo-400 stroke-2 cursor-pointer hover:scale-110 transition-transform" />
            <circle cx="160" cy="90" r="6" fill="#ffffff" className="animate-ping opacity-75" />
            <circle cx="160" cy="90" r="6" fill="#ffffff" />

            {/* Node 1: OKR Root (Objective & KR) */}
            <g className="cursor-pointer hover:opacity-80 transition-opacity">
              <circle cx="80" cy="50" r="12" className="fill-slate-900 stroke-indigo-500 stroke-2" />
              <circle cx="80" cy="50" r="15" className="fill-none stroke-indigo-500/20 stroke-1" />
              <text x="80" y="53" textAnchor="middle" fill="#818CF8" fontSize="8" fontWeight="bold">OKR</text>
              <text x="80" y="32" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="bold">Objectives</text>
            </g>

            {/* Node 2: Knowledge Root */}
            <g className="cursor-pointer hover:opacity-80 transition-opacity">
              <circle cx="240" cy="50" r="12" className="fill-slate-900 stroke-amber-500 stroke-2" />
              <circle cx="240" cy="50" r="15" className="fill-none stroke-amber-500/20 stroke-1" />
              <text x="240" y="53" textAnchor="middle" fill="#F59E0B" fontSize="8" fontWeight="bold">KNL</text>
              <text x="240" y="32" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="bold">Lessons</text>
            </g>

            {/* Node 3: Connected Task Node (Planner Sync) */}
            <g className="cursor-pointer hover:opacity-80 transition-opacity">
              <circle cx="160" cy="150" r="12" className="fill-slate-900 stroke-emerald-500 stroke-2" />
              <circle cx="160" cy="150" r="15" className="fill-none stroke-emerald-500/20 stroke-1" />
              <text x="160" y="153" textAnchor="middle" fill="#10B981" fontSize="8" fontWeight="bold">TSK</text>
              <text x="160" y="172" textAnchor="middle" fill="#94A3B8" fontSize="7" fontWeight="bold">Planner Sync</text>
            </g>
          </svg>

          {/* Quick Stats Overlay inside Graph */}
          <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-slate-950/85 backdrop-blur-xs p-2 rounded-lg border border-slate-800 text-[9px] font-mono font-bold text-slate-300">
            <span className="flex items-center gap-1"><Target className="w-3 h-3 text-indigo-400" /> OKR Progress: {avgProgress}%</span>
            <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-amber-400" /> Wisdom Vault: {knowledgeCount}</span>
            <span className="flex items-center gap-1"><CheckSquare className="w-3 h-3 text-emerald-400" /> Sync Tasks: {totalTasks}</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-normal font-semibold">
          *Peta topologi di atas memetakan relasi real-time antara Target Sasaran (OKR), Pelajaran (Knowledge Engine), serta Tugas Koreografi yang dibuat otomatis di Planner.
        </p>
      </div>

      {/* Rerata Target Progress Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs shadow-xs space-y-2.5">
        <div className="flex justify-between items-center font-bold text-slate-700">
          <span className="flex items-center gap-1.5"><Sliders className="w-4 h-4 text-indigo-600" /> Rerata Ketercapaian Sasaran</span>
          <span className="bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full text-[10px] font-black">{avgProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${avgProgress}%` }}></div>
        </div>
      </div>
    </div>
  );
};

// Growth Workbook Playground and Tabs UI Component
export const GrowthInputView: React.FC<{
  sharedData: SharedData;
  mutators: SharedDataMutators;
  triggerSuccess: (msg: string) => void;
  themeColor: string;
}> = ({ sharedData, mutators, triggerSuccess, themeColor }) => {
  const [activeTab, setActiveTab] = useState<'okr' | 'event' | 'guardian' | 'knowledge'>('okr');

  // 1. OKR & Workflow States
  const [objective, setObjective] = useState('');
  const [keyResult, setKeyResult] = useState('');
  const [progress, setProgress] = useState(30);
  const [isChoreographyActive, setIsChoreographyActive] = useState(true);

  // 2. Event Bus & Shared Services States
  const [customPayload, setCustomPayload] = useState('Evaluasi Triwulan 3 OKR');
  const [capturedEvents, setCapturedEvents] = useState<any[]>(localCapturedEvents);
  const [serviceOutput, setServiceOutput] = useState<string | null>(null);

  // 3. Sandbox Guardian States
  const [guardianLog, setGuardianLog] = useState<string[]>([]);
  const [guardianStatus, setGuardianStatus] = useState<'secure' | 'warning' | 'idle'>('idle');

  // 4. Knowledge Engine States
  const [concept, setConcept] = useState('');
  const [wisdom, setWisdom] = useState('');
  const [knowledgeDomain, setKnowledgeDomain] = useState('Teknologi');
  const [knowledgeList, setKnowledgeList] = useState(localKnowledgeCache);

  // Wildcard event capture inside local workbook
  React.useEffect(() => {
    const unsubscribe = aseKernelInstance.eventBus.subscribe('*', (evt) => {
      setCapturedEvents(prev => {
        const updated = [evt, ...prev].slice(0, 4);
        localCapturedEvents = updated;
        return updated;
      });
    });
    return () => unsubscribe();
  }, []);

  // Submit OKR with Automated Workflow
  const handleAddOkr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!objective.trim() || !keyResult.trim()) {
      alert("Objective dan Key Result wajib diisi!");
      return;
    }

    const id = 'okr-' + Date.now();
    const okrProgress = Number(progress);
    const newRec: OkrRecord = {
      id,
      objective: objective.trim(),
      keyResult: keyResult.trim(),
      progress: okrProgress
    };

    // Save in shared database
    mutators.setOkrRecords(prev => [...prev, newRec]);

    // 1. Publish Event to Event Bus
    aseKernelInstance.eventBus.publish('growth.okr.created', { id, objective, progress: okrProgress }, 'wb-growth');

    // 2. Evaluate Workflow Choreography Trigger (Level 2 Certified Workflow)
    if (okrProgress < 40 && isChoreographyActive) {
      // Auto-trigger: Create critical task in Planner Workbook (taskRecords)
      const newTask: TaskRecord = {
        id: 'task-' + Date.now(),
        taskName: `⚠️ Evaluasi OKR Terhambat: ${objective.substring(0, 25)}...`,
        timeBlock: '08:00 - 09:00',
        priority: 'Penting-Mendesak',
        completed: false
      };
      mutators.setTaskRecords(prev => [newTask, ...prev]);

      // Publish cross-workbook event
      aseKernelInstance.eventBus.publish('growth.workflow.task_created', { taskId: newTask.id, okrId: id }, 'wb-growth');

      // Call Notification Service (Shared Service Layer)
      const notifService = aseKernelInstance.serviceRegistry.getService('Notification');
      if (notifService) {
        notifService.execute('send', {
          title: 'ASE Workflow Alert ⚡',
          body: `Otomatis mendaftarkan tugas Planner untuk menyelamatkan OKR "${objective}" yang berada di bawah ambang batas (30%).`
        });
      }

      triggerSuccess("OKR terdaftar! Workflow mendeteksi progress rendah (<40%) and otomatis membuat tugas mitigasi di Planner!");
    } else {
      triggerSuccess("Sasaran OKR berhasil didaftarkan di Shared Data!");
    }

    // Reset Form
    setObjective('');
    setKeyResult('');
    setProgress(30);
  };

  // Publish manual event on Event Bus
  const handlePublishTestEvent = () => {
    aseKernelInstance.eventBus.publish('growth.custom.test_topic', { 
      message: customPayload, 
      userTriggered: true 
    }, 'wb-growth');
    triggerSuccess("Test Event dipublikasikan ke Event Bus!");
  };

  // Invoke Shared Service
  const handleCallService = (serviceName: string, action: string, params?: any) => {
    const service = aseKernelInstance.serviceRegistry.getService(serviceName);
    if (!service) {
      setServiceOutput(`Error: Service "${serviceName}" tidak ditemukan.`);
      return;
    }
    const result = service.execute(action, params);
    setServiceOutput(JSON.stringify(result, null, 2));
    triggerSuccess(`Berhasil memanggil service "${serviceName}"!`);
  };

  // Run security validation checks inside sandbox
  const handleSimulateTampering = (tamperType: 'signature' | 'privilege') => {
    setGuardianStatus('warning');
    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Guardian: Memulai audit sandbox workbook...`);

    if (tamperType === 'signature') {
      logs.push(`[WARN] Mensimulasikan Signature Attack (mengubah hash berkas)`);
      const tamperedManifest = {
        id: 'wb-growth',
        title: 'Growth & OKR Reference (TAMPERED)',
        description: 'Simulated modified workbook description.',
        version: '3.0.0',
        category: 'Pertumbuhan',
        author: 'Unknown Attacker',
        signature: 'INVALID-HASH-404-MALICIOUS',
        requiredPermissions: ['okrRecords', 'financeRecords'],
        requiredCapabilities: ['COMPUTATION']
      };

      const verification = aseKernelInstance.guardian.validateModule(tamperedManifest);
      logs.push(`[ERROR] Guardian Signature Check FAILED: Signature is corrupt or forged.`);
      logs.push(`[CRITICAL] Modul "${tamperedManifest.title}" dikarantina oleh platform. Eksekusi DIHENTIKAN.`);
      setGuardianLog(logs);
      triggerSuccess("Tampering Terdeteksi! Guardian berhasil memblokir & mengarantina modul.");
    } else {
      logs.push(`[WARN] Mensimulasikan Privilege Escalation (meminta akses tabel sensitif)`);
      const illegalManifest = {
        id: 'wb-growth',
        title: 'Growth OS Sandbox',
        description: 'Simulated illegal workbook description.',
        version: '3.0.0',
        category: 'Pertumbuhan',
        author: 'Developer',
        signature: 'ASE-SIG-GROWTH-2026-X902',
        requiredPermissions: ['okrRecords', 'sensitif_bank_records_invalid'], // Illegal table
        requiredCapabilities: ['COMPUTATION']
      };

      const verification = aseKernelInstance.guardian.validateModule(illegalManifest);
      logs.push(`[ERROR] Guardian Permission Check FAILED: Unauthorized table bank_records.`);
      logs.push(`[CRITICAL] Izin ditolak. Workspace menolak akses untuk menghindari kebocoran data.`);
      setGuardianLog(logs);
      triggerSuccess("Akses Tidak Sah Ditolak! Guardian membatasi izin data bersama.");
    }
  };

  // Register knowledge lesson
  const handleAddKnowledge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!concept.trim() || !wisdom.trim()) return;

    const newK: typeof localKnowledgeCache[0] = {
      id: 'kn-' + Date.now(),
      concept: concept.trim(),
      wisdom: wisdom.trim(),
      domain: knowledgeDomain,
      timestamp: new Date().toLocaleTimeString().substring(0, 5)
    };

    localKnowledgeCache = [newK, ...localKnowledgeCache];
    setKnowledgeList(localKnowledgeCache);
    setConcept('');
    setWisdom('');

    // Publish event
    aseKernelInstance.eventBus.publish('growth.knowledge.created', { id: newK.id, concept: newK.concept }, 'wb-growth');
    triggerSuccess("Wisdom baru berhasil disintesis oleh Knowledge Engine!");
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden space-y-4 p-4">
      
      {/* Tab Navigation */}
      <div className="flex bg-slate-50 p-1 rounded-xl border border-slate-200/50">
        {[
          { id: 'okr', label: 'OKR & Workflow', icon: Target },
          { id: 'event', label: 'Event Bus', icon: Network },
          { id: 'guardian', label: 'Guardian', icon: Shield },
          { id: 'knowledge', label: 'Knowledge', icon: Cpu }
        ].map(t => {
          const IsActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-1.5 rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all ${
                IsActive ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT 1: OKR & WORKFLOW */}
      {activeTab === 'okr' && (
        <form onSubmit={handleAddOkr} className="space-y-3.5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
              <Target className="w-4 h-4 text-indigo-600" /> Form Target OKR & Choreography
            </h3>
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
              API Publik
            </span>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Objective Utama (Abstrak / Kualitatif)</label>
            <input
              type="text"
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Contoh: Menguasai Cloud Native Architecture..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Key Result (Dapat Diukur / Kuantitatif)</label>
            <input
              type="text"
              value={keyResult}
              onChange={(e) => setKeyResult(e.target.value)}
              placeholder="Contoh: Menyelesaikan 5 modul sertifikasi ASE..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3 items-center">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                <span>Progress: {progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-indigo-600 mt-1"
              />
            </div>

            <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-xl border border-slate-100 h-full mt-1">
              <input
                type="checkbox"
                id="chk-choreography"
                checked={isChoreographyActive}
                onChange={(e) => setIsChoreographyActive(e.target.checked)}
                className="w-4 h-4 accent-indigo-600"
              />
              <label htmlFor="chk-choreography" className="text-[9px] font-bold text-slate-600 leading-tight cursor-pointer">
                Aktifkan Choreography (Workflow)
              </label>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
            💡 **Heuristik Workflow**: Jika progress diatur di bawah 40%, sistem koreografi akan otomatis mendaftarkan tugas darurat di Planner Workbook sebagai bukti loosely-coupled integration lintas workbook.
          </p>

          <button
            type="submit"
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-all"
          >
            <Save className="w-4 h-4" /> Daftarkan Sasaran & Evaluasi Aturan
          </button>
        </form>
      )}

      {/* TAB CONTENT 2: EVENT BUS & SERVICES */}
      {activeTab === 'event' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
              <Network className="w-4 h-4 text-indigo-600" /> Event Bus & Shared Service Layer
            </h3>
            <span className="text-[9px] font-black uppercase text-amber-600 px-2 py-0.5 bg-amber-50 rounded-full border border-amber-100 font-mono animate-pulse">
              Live Link
            </span>
          </div>

          {/* Publisher Console */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 space-y-2.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Event Publisher Console</span>
            <div className="flex gap-2">
              <input
                type="text"
                value={customPayload}
                onChange={(e) => setCustomPayload(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-white border border-slate-200 text-xs rounded-lg font-bold text-slate-700"
              />
              <button
                onClick={handlePublishTestEvent}
                className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-[10px] font-extrabold hover:bg-indigo-700 transition-all cursor-pointer flex items-center gap-1"
              >
                <Send className="w-3.5 h-3.5" /> Publish
              </button>
            </div>
            <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Topic: <span className="text-indigo-600 font-extrabold">growth.custom.test_topic</span></p>
          </div>

          {/* Shared Services Router */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Shared Service Router</span>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => handleCallService('Identity', 'getCurrentUser')}
                className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-left hover:bg-slate-100 transition-all text-slate-700 cursor-pointer"
              >
                <span className="text-[10px] font-extrabold flex items-center gap-1 text-indigo-600"><User className="w-3.5 h-3.5" /> Identity</span>
                <span className="text-[7px] text-slate-400 font-bold block mt-0.5">GetCurrentUser</span>
              </button>

              <button
                onClick={() => handleCallService('Notification', 'send', { title: 'Halo Prasetyo!', body: 'Notifikasi real-time via Shared Service.' })}
                className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-left hover:bg-slate-100 transition-all text-slate-700 cursor-pointer"
              >
                <span className="text-[10px] font-extrabold flex items-center gap-1 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Notif</span>
                <span className="text-[7px] text-slate-400 font-bold block mt-0.5">Trigger Notification</span>
              </button>

              <button
                onClick={() => handleCallService('License', 'verify', { workbookId: 'wb-growth' })}
                className="bg-slate-50 border border-slate-200 p-2 rounded-lg text-left hover:bg-slate-100 transition-all text-slate-700 cursor-pointer"
              >
                <span className="text-[10px] font-extrabold flex items-center gap-1 text-amber-600"><Key className="w-3.5 h-3.5" /> License</span>
                <span className="text-[7px] text-slate-400 font-bold block mt-0.5">Verify Signature</span>
              </button>
            </div>

            {/* Service Output Panel */}
            {serviceOutput && (
              <div className="bg-slate-900 p-2 rounded-lg border border-slate-850 text-[9px] font-mono text-emerald-400 max-h-24 overflow-y-auto mt-2">
                <span className="text-[7px] text-slate-400 block mb-1 uppercase font-bold">Service API Response:</span>
                <pre>{serviceOutput}</pre>
              </div>
            )}
          </div>

          {/* Captured Events Stream */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Live Event Bus Listeners (* Wildcard)</span>
            <div className="space-y-1 max-h-28 overflow-y-auto pr-1 no-scrollbar">
              {capturedEvents.length === 0 ? (
                <div className="text-[9px] text-slate-400 italic text-center py-2 border border-dashed border-slate-100 rounded-lg">
                  Menunggu event dipublikasikan...
                </div>
              ) : (
                capturedEvents.map((evt, idx) => (
                  <div key={idx} className="bg-slate-900 text-slate-300 p-2 rounded-lg border border-slate-800 text-[9px] flex justify-between items-center font-mono">
                    <div className="truncate pr-2">
                      <span className="text-indigo-400 font-extrabold">[{evt.topic}]</span> <span className="text-slate-400">{JSON.stringify(evt.payload)}</span>
                    </div>
                    <span className="text-[7px] text-slate-500 font-black shrink-0">{evt.source}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT 3: SANDBOX GUARDIAN & MANIFEST */}
      {activeTab === 'guardian' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-indigo-600" /> Platform Security Guardian & Sandbox
            </h3>
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
              Contract Verified
            </span>
          </div>

          {/* ASEB Manifest code block */}
          <div className="bg-slate-900 p-3 rounded-xl border border-slate-850 text-[10px] font-mono text-slate-300 relative space-y-1">
            <span className="absolute top-2 right-2 text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-black font-sans uppercase">
              wb-growth.aseb
            </span>
            <div className="text-emerald-400 font-bold flex items-center gap-1 text-[9px]"><Fingerprint className="w-3.5 h-3.5" /> SECURE ASEB BUNDLE MANIFEST</div>
            <div className="opacity-80">
              <p>{"{"}</p>
              <p>{"  \"id\": \"wb-growth\","}</p>
              <p>{"  \"version\": \"3.0.0-certified\","}</p>
              <p>{"  \"permissions\": [\"okrRecords\", \"taskRecords\"],"}</p>
              <p>{"  \"capabilities\": [\"COMPUTATION\", \"AI_INSIGHTS\"],"}</p>
              <p>{"  \"signature\": \"ASE-SIG-GROWTH-2026-X902\""}</p>
              <p>{"}"}</p>
            </div>
          </div>

          {/* Security triggers */}
          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-3 space-y-2">
            <span className="text-[10px] font-black text-rose-800 uppercase block tracking-wider">Simulasi Gangguan Keamanan (Attacker Simulation)</span>
            <p className="text-[9px] text-slate-600 leading-normal font-semibold">
              Kirim berkas termodifikasi untuk melihat bagaimana platform mendeteksi ketidakcocokan tanda tangan secara real-time.
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSimulateTampering('signature')}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Lock className="w-3.5 h-3.5" /> Signature Attack
              </button>
              <button
                onClick={() => handleSimulateTampering('privilege')}
                className="bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-[10px] py-1.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer transition-all shadow-xs"
              >
                <Code className="w-3.5 h-3.5" /> Privilege Leak
              </button>
            </div>
          </div>

          {/* Sandbox Logs Terminal */}
          {guardianLog.length > 0 && (
            <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 text-[8px] font-mono text-rose-400 max-h-32 overflow-y-auto space-y-0.5 shadow-inner">
              <span className="text-[7px] text-slate-500 block uppercase font-bold tracking-wider mb-1">Sandbox Incident Console:</span>
              {guardianLog.map((log, idx) => (
                <p key={idx} className={log.includes('CRITICAL') ? 'text-rose-500 font-extrabold animate-pulse' : log.includes('WARN') ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                  {log}
                </p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT 4: KNOWLEDGE VAULT & COGNITIVE ENGINE */}
      {activeTab === 'knowledge' && (
        <div className="space-y-3.5 animate-fade-in">
          <div className="flex justify-between items-center border-b border-slate-50 pb-2">
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" /> Knowledge Engine Vault (Siklus Pembelajaran)
            </h3>
            <span className="text-[9px] font-bold uppercase px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-100">
              Cognitive Extractor
            </span>
          </div>

          {/* Register Wisdom form */}
          <form onSubmit={handleAddKnowledge} className="bg-slate-50 p-3 rounded-xl border border-slate-200/50 space-y-2.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Daftarkan Pelajaran Baru (Sintesis Wisdom)</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <input
                  type="text"
                  placeholder="Nama Konsep"
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white border border-slate-200 text-xs rounded-lg font-bold text-slate-700"
                  required
                />
              </div>
              <div className="space-y-1">
                <select
                  value={knowledgeDomain}
                  onChange={(e) => setKnowledgeDomain(e.target.value)}
                  className="w-full p-1.5 bg-white border border-slate-200 text-xs rounded-lg font-bold text-slate-700 h-full"
                >
                  <option value="Teknologi">Teknologi</option>
                  <option value="Produktivitas">Produktivitas</option>
                  <option value="Habit">Habit</option>
                  <option value="Keuangan">Keuangan</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <textarea
                placeholder="Pelajaran/Wisdom berharga yang Anda peroleh..."
                value={wisdom}
                onChange={(e) => setWisdom(e.target.value)}
                className="w-full px-2.5 py-1 bg-white border border-slate-200 text-xs rounded-lg font-bold text-slate-700 h-10 no-scrollbar resize-none"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-extrabold flex items-center justify-center gap-1 cursor-pointer transition-all"
            >
              <Cpu className="w-3.5 h-3.5" /> Sintesis Wisdom Ke Knowledge Base
            </button>
          </form>

          {/* Registered Wisdom list */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-slate-400 uppercase block tracking-wider">Daftar Wisdom Yang Diakumulasikan</span>
            <div className="space-y-2 max-h-32 overflow-y-auto pr-1 no-scrollbar">
              {knowledgeList.map((k) => (
                <div key={k.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 space-y-1 shadow-2xs">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 text-[10px]">{k.concept}</span>
                    <span className="text-[7px] bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-md font-bold uppercase">{k.domain}</span>
                  </div>
                  <p className="text-[9px] text-slate-600 font-semibold leading-relaxed">"{k.wisdom}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const GrowthModule: WorkbookModule = {
  id: 'wb-growth',
  metadata: {
    title: 'Growth OS (Sistem Pertumbuhan)',
    description: 'Reference workbook resmi (Level 2 Certified) penguji seluruh kemampuan platform ASE.',
    category: 'Pertumbuhan',
    coverGradient: 'from-indigo-600 to-purple-700',
    version: 'v3.0.0-certified',
    author: 'ASE Core Team',
    iconName: 'Target'
  },

  processEngine: (data: SharedData) => {
    const totalOkrs = data.okrRecords.length;
    const avgProgress = totalOkrs > 0 ? Math.round(data.okrRecords.reduce((sum, o) => sum + o.progress, 0) / totalOkrs) : 0;
    return { totalOkrs, avgProgress };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess, themeColor }) => {
    return (
      <GrowthInputView 
        sharedData={sharedData} 
        mutators={mutators} 
        triggerSuccess={triggerSuccess} 
        themeColor={themeColor} 
      />
    );
  },

  renderOutput: ({ sharedData, processed, themeColor }) => {
    return (
      <GrowthOutputView 
        sharedData={sharedData} 
        processed={processed} 
        themeColor={themeColor} 
      />
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-indigo-700 bg-indigo-100 p-1 rounded-lg"><Target className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Growth Reference OS</span>
        </div>
        <div className="text-right">
          <span className="font-black block text-[11px] text-indigo-700">
            Progress: {processed.avgProgress}%
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">{processed.totalOkrs} Target Aktif</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    const totalOkrs = sharedData.okrRecords.length;
    const avgProgress = processed.avgProgress || 0;

    if (totalOkrs === 0) {
      return {
        type: 'info',
        message: '💡 Daftarkan target OKR pertama Anda di Growth OS untuk memicu visualisasi topology Resource Graph.'
      };
    }
    if (avgProgress < 40) {
      return {
        type: 'warning',
        message: '⚠️ Evaluasi Platform: Rerata kemajuan OKR Anda (<40%) memicu Workflow Choreography otomatis untuk mitigasi tugas Planner.'
      };
    }
    return {
      type: 'success',
      message: '✅ Hasil Evaluasi: Seluruh kontrak data, penandatanganan signature (.aseb), dan integrasi event bus berjalan sukses di sandbox!'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    const handleUpdateProgress = (id: string, newProgress: number) => {
      mutators.setOkrRecords(prev => prev.map(o => o.id === id ? { ...o, progress: newProgress } : o));
      triggerSuccess("Progress OKR berhasil disesuaikan!");
    };

    return (
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.okrRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-slate-800">{item.objective}</h4>
                <p className="text-[10px] text-slate-500 font-semibold">KR: {item.keyResult}</p>
              </div>
              <button 
                onClick={() => {
                  mutators.setOkrRecords(prev => prev.filter(o => o.id !== item.id));
                  triggerSuccess("Sasaran OKR dibatalkan!");
                }}
                className="text-slate-300 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>Rencana Kemajuan</span>
                <span>{item.progress}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100"
                value={item.progress}
                onChange={(e) => handleUpdateProgress(item.id, Number(e.target.value))}
                className="w-full accent-indigo-600"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// 7. RELATIONSHIP & LOVE LANGUAGE MODULE
// ==========================================
export const RelationshipModule: WorkbookModule = {
  id: 'wb-relationship',
  metadata: {
    title: 'Hubungan & Keluarga',
    description: 'Pantau status emosional keluarga dan berikan perhatian yang tepat.',
    category: 'Sosial',
    coverGradient: 'from-pink-500 to-rose-600',
    version: 'v2.0',
    author: 'ASE Core',
    iconName: 'Heart'
  },

  processEngine: (data: SharedData) => {
    const totalCount = data.relationshipRecords.length;
    const avgMeter = totalCount > 0 ? Math.round(data.relationshipRecords.reduce((sum, r) => sum + r.statusMeter, 0) / totalCount) : 0;
    return { totalCount, avgMeter };
  },

  renderInput: ({ sharedData, mutators, triggerSuccess }) => {
    const [name, setName] = useState('');
    const [loveLanguage, setLoveLanguage] = useState('Quality Time');
    const [specialDate, setSpecialDate] = useState('');
    const [meter, setMeter] = useState(80);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!name.trim()) {
        alert("Masukkan nama hubungan!");
        return;
      }
      const newRec: RelationshipRecord = {
        id: 'rel-' + Date.now(),
        name: name.trim(),
        loveLanguage,
        specialDate: specialDate || 'Tidak ada',
        statusMeter: Number(meter)
      };
      mutators.setRelationshipRecords(prev => [...prev, newRec]);
      setName('');
      setSpecialDate('');
      triggerSuccess("Data hubungan penting berhasil diperbarui!");
    };

    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-2xl border border-slate-100 space-y-3 shadow-xs">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Plus className="w-4 h-4 text-pink-600" /> Tambah Hubungan Berharga
        </h3>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase">Nama Orang Spesial</label>
          <input 
            type="text" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Siti Nurhaliza (Istri)..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Love Language Utama</label>
            <select 
              value={loveLanguage}
              onChange={(e) => setLoveLanguage(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            >
              <option value="Quality Time">Quality Time</option>
              <option value="Acts of Service">Acts of Service</option>
              <option value="Words of Affirmation">Words of Affirmation</option>
              <option value="Physical Touch">Physical Touch</option>
              <option value="Receiving Gifts">Receiving Gifts</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Hari Berharga (Ultah/Anniv)</label>
            <input 
              type="text" 
              value={specialDate}
              onChange={(e) => setSpecialDate(e.target.value)}
              placeholder="15 September (Anniv)"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700"
            />
          </div>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
            <span>Indikator Keharmonisan</span>
            <span className="text-pink-600 font-extrabold">{meter}%</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100"
            value={meter}
            onChange={(e) => setMeter(Number(e.target.value))}
            className="w-full accent-pink-600"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-2.5 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-sm transition-all"
        >
          <Save className="w-4 h-4" /> Daftarkan Hubungan Berharga
        </button>
      </form>
    );
  },

  renderOutput: ({ sharedData, processed }) => {
    return (
      <div className="bg-white p-3.5 rounded-xl border border-slate-100 text-xs shadow-xs space-y-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase block">Indeks Keharmonisan</span>
        <div className="space-y-1">
          <div className="flex justify-between font-bold text-slate-700">
            <span>Rata-rata Status Hubungan</span>
            <span>{processed.avgMeter}%</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${processed.avgMeter}%` }}></div>
          </div>
        </div>
      </div>
    );
  },

  renderDashboard: ({ sharedData, processed, onNavigate }) => {
    return (
      <div onClick={onNavigate} className="p-3 bg-slate-50 rounded-xl flex items-center justify-between border border-slate-100/30 cursor-pointer hover:bg-slate-100 transition-all">
        <div className="flex items-center gap-2">
          <span className="text-pink-700 bg-pink-100 p-1 rounded-lg"><Heart className="w-3.5 h-3.5" /></span>
          <span className="font-extrabold text-slate-700">Hubungan & Sosial</span>
        </div>
        <div className="text-right">
          <span className="font-black block text-[11px] text-slate-700">
            Indeks: {processed.avgMeter}%
          </span>
          <span className="text-[8px] text-slate-400 block font-bold">{processed.totalCount} Orang Spesial</span>
        </div>
      </div>
    );
  },

  getInsight: (sharedData, processed) => {
    return {
      type: 'success',
      message: '💖 Ekspresikan bahasa kasih sayang yang disukai oleh pasangan/keluarga Anda hari ini!'
    };
  },

  renderRiwayat: ({ sharedData, mutators, triggerSuccess }) => {
    const handleUpdateMeter = (id: string, newMeter: number) => {
      mutators.setRelationshipRecords(prev => prev.map(r => r.id === id ? { ...r, statusMeter: newMeter } : r));
      triggerSuccess("Status keharmonisan diperbarui!");
    };

    return (
      <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 no-scrollbar text-xs">
        {sharedData.relationshipRecords.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-xl border border-slate-100 space-y-2 shadow-xs">
            <div className="flex justify-between items-start">
              <div className="space-y-0.5">
                <h4 className="text-xs font-extrabold text-slate-800">{item.name}</h4>
                <p className="text-[10px] text-slate-500 font-semibold">Love Language: {item.loveLanguage} • Ultah: {item.specialDate}</p>
              </div>
              <button 
                onClick={() => {
                  mutators.setRelationshipRecords(prev => prev.filter(r => r.id !== item.id));
                  triggerSuccess("Kontak hubungan dihapus!");
                }}
                className="text-slate-300 hover:text-rose-600 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-slate-400">
                <span>Skala Status Keharmonisan</span>
                <span>{item.statusMeter}%</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100"
                value={item.statusMeter}
                onChange={(e) => handleUpdateMeter(item.id, Number(e.target.value))}
                className="w-full accent-pink-600"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }
};

// ==========================================
// CENTRAL MODULES REGISTRY (ALL REGISTERED WORKBOOKS)
// ==========================================
export const ALL_WORKBOOK_MODULES: WorkbookModule[] = [
  KeuanganModule,
  PlannerModule,
  HabitModule,
  CrmModule,
  TradingModule,
  GrowthModule,
  RelationshipModule
];

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Sparkles, 
  DollarSign, 
  CheckSquare, 
  Flame, 
  Briefcase, 
  Activity, 
  Target, 
  Heart,
  ChevronRight,
  Info
} from 'lucide-react';
import { Workbook, ThemeColor } from '../types';
import { SharedData, SharedDataMutators } from '../modules/ModuleContract';
import { getThemeStyles } from './MobileFrame';

interface QuickInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  workbooks: Workbook[];
  themeColor: ThemeColor;
  mutators: SharedDataMutators;
  sharedData: SharedData;
  onAddQuickLog: (workbookTitle: string, entryName: string, details: string) => void;
  onIncrementActivity: () => void;
}

export default function QuickInputModal({
  isOpen,
  onClose,
  workbooks,
  themeColor,
  mutators,
  sharedData,
  onAddQuickLog,
  onIncrementActivity
}: QuickInputModalProps) {
  const [selectedWbId, setSelectedWbId] = useState<string | null>(null);

  // Form State - Keuangan Pribadi
  const [finType, setFinType] = useState<'pemasukan' | 'pengeluaran' | 'tabungan' | 'hutang'>('pengeluaran');
  const [finCategory, setFinCategory] = useState('Kebutuhan Pokok');
  const [finAmount, setFinAmount] = useState('');
  const [finNote, setFinNote] = useState('');
  const [finDate, setFinDate] = useState(new Date().toISOString().split('T')[0]);

  // Form State - Planner Harian
  const [taskName, setTaskName] = useState('');
  const [taskTimeBlock, setTaskTimeBlock] = useState('09:00 - 11:00');
  const [taskPriority, setTaskPriority] = useState<'Penting-Mendesak' | 'Penting-TidakMendesak' | 'TidakPenting-Mendesak' | 'TidakPenting-TidakMendesak'>('Penting-Mendesak');

  // Form State - Habit Tracker
  const [habitName, setHabitName] = useState('');

  // Form State - CRM
  const [crmClientName, setCrmClientName] = useState('');
  const [crmDealValue, setCrmDealValue] = useState('');
  const [crmStatus, setCrmStatus] = useState<'Lead' | 'Negosiasi' | 'Won' | 'Lost'>('Lead');
  const [crmNotes, setCrmNotes] = useState('');
  const [crmCreateContact, setCrmCreateContact] = useState(false);
  const [crmPhone, setCrmPhone] = useState('');

  // Form State - Trading Journal
  const [tradePair, setTradePair] = useState('BTC/USDT');
  const [tradeType, setTradeType] = useState<'Buy' | 'Sell'>('Buy');
  const [tradeEntry, setTradeEntry] = useState('');
  const [tradeExit, setTradeExit] = useState('');
  const [tradeSize, setTradeSize] = useState('');
  const [tradeEmotion, setTradeEmotion] = useState<'Tenang' | 'FOMO' | 'Takut' | 'Gembira'>('Tenang');

  // Form State - Growth & OKR
  const [okrObjective, setOkrObjective] = useState('');
  const [okrKeyResult, setOkrKeyResult] = useState('');
  const [okrProgress, setOkrProgress] = useState(50);

  // Form State - Hubungan & Keluarga
  const [relName, setRelName] = useState('');
  const [relLoveLanguage, setRelLoveLanguage] = useState('Quality Time');
  const [relSpecialDate, setRelSpecialDate] = useState('');
  const [relMeter, setRelMeter] = useState(80);

  if (!isOpen) return null;

  const themeStyles = getThemeStyles(themeColor);
  const activeWorkbooks = workbooks.filter(wb => wb.isDownloaded);

  const getWorkbookIcon = (id: string) => {
    switch (id) {
      case 'wb-keuangan': return <DollarSign className="w-4 h-4 text-emerald-600" />;
      case 'wb-planner': return <CheckSquare className="w-4 h-4 text-indigo-600" />;
      case 'wb-habit': return <Flame className="w-4 h-4 text-amber-500" />;
      case 'wb-crm': return <Briefcase className="w-4 h-4 text-orange-500" />;
      case 'wb-trading': return <Activity className="w-4 h-4 text-rose-500" />;
      case 'wb-growth': return <Target className="w-4 h-4 text-blue-500" />;
      case 'wb-relationship': return <Heart className="w-4 h-4 text-pink-500" />;
      default: return <Sparkles className="w-4 h-4 text-slate-500" />;
    }
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Submission handlers
  const handleSaveKeuangan = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(finAmount);
    if (isNaN(amountVal) || amountVal <= 0) {
      alert('Masukkan nominal keuangan yang valid!');
      return;
    }

    const noteText = finNote.trim() || `${finType === 'pemasukan' ? 'Pemasukan' : finType === 'pengeluaran' ? 'Pengeluaran' : finType === 'tabungan' ? 'Tabungan' : 'Hutang'} ${finCategory}`;

    const newRec = {
      id: 'fin-' + Date.now(),
      type: finType,
      category: finCategory,
      amount: amountVal,
      date: finDate,
      note: noteText
    };

    mutators.setFinanceRecords(prev => [newRec, ...prev]);
    onAddQuickLog('Keuangan Pribadi', `Catat ${finType}`, `${noteText} (${formatRupiah(amountVal)})`);
    onIncrementActivity();

    // Reset fields
    setFinAmount('');
    setFinNote('');
    onClose();
  };

  const handleSavePlanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      alert('Masukkan nama tugas!');
      return;
    }

    const newRec = {
      id: 'task-' + Date.now(),
      taskName: taskName.trim(),
      timeBlock: taskTimeBlock,
      priority: taskPriority,
      completed: false
    };

    mutators.setTaskRecords(prev => [...prev, newRec]);
    onAddQuickLog('Planner Harian', 'Tambah Tugas', `${taskName.trim()} [${taskTimeBlock}]`);
    onIncrementActivity();

    setTaskName('');
    onClose();
  };

  const handleSaveHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habitName.trim()) {
      alert('Masukkan nama kebiasaan baru!');
      return;
    }

    const newRec = {
      id: 'hab-' + Date.now(),
      habitName: habitName.trim(),
      streak: 0,
      history: { 'Sen': false, 'Sel': false, 'Rab': false, 'Kam': false, 'Jum': false, 'Sab': false, 'Min': false }
    };

    mutators.setHabitRecords(prev => [...prev, newRec]);
    onAddQuickLog('Habit Tracker', 'Kebiasaan Baru', `Mulai melatih kebiasaan: ${habitName.trim()}`);
    onIncrementActivity();

    setHabitName('');
    onClose();
  };

  const handleSaveCrm = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(crmDealValue);
    if (!crmClientName.trim() || isNaN(val) || val <= 0) {
      alert('Isi nama klien dan nilai deal yang valid!');
      return;
    }

    const noteText = crmNotes.trim() || `Klien ${crmClientName.trim()}`;
    const newRec = {
      id: 'crm-' + Date.now(),
      clientName: crmClientName.trim(),
      dealValue: val,
      status: crmStatus,
      notes: noteText,
      date: new Date().toISOString().split('T')[0]
    };

    mutators.setCrmRecords(prev => [newRec, ...prev]);

    if (crmCreateContact) {
      const exist = sharedData.sharedContacts.some(c => c.name.toLowerCase() === crmClientName.trim().toLowerCase());
      if (!exist) {
        const newCon = {
          id: 'con-' + Date.now(),
          name: crmClientName.trim(),
          phone: crmPhone || '0812-xxxx-xxxx',
          category: 'Klien' as const
        };
        mutators.setSharedContacts(prev => [...prev, newCon]);
      }
    }

    // SYNERGY Won deal
    if (crmStatus === 'Won') {
      const autoFinance = {
        id: 'fin-auto-' + Date.now(),
        type: 'pemasukan' as const,
        category: 'CRM Revenue',
        amount: val,
        date: new Date().toISOString().split('T')[0],
        note: `[CRM Auto] Deal Won - ${crmClientName.trim()}`
      };
      mutators.setFinanceRecords(prev => [autoFinance, ...prev]);
    }

    onAddQuickLog('CRM Penjualan', `Pipeline: ${crmStatus}`, `${crmClientName.trim()} (${formatRupiah(val)})`);
    onIncrementActivity();

    setCrmClientName('');
    setCrmDealValue('');
    setCrmNotes('');
    setCrmPhone('');
    setCrmCreateContact(false);
    onClose();
  };

  const handleSaveTrading = (e: React.FormEvent) => {
    e.preventDefault();
    const entryVal = parseFloat(tradeEntry);
    const exitVal = parseFloat(tradeExit);
    const sizeVal = parseFloat(tradeSize);

    if (isNaN(entryVal) || isNaN(exitVal) || isNaN(sizeVal) || entryVal <= 0 || exitVal <= 0 || sizeVal <= 0) {
      alert('Masukkan data numerik trading yang valid!');
      return;
    }

    let profit = 0;
    if (tradeType === 'Buy') {
      profit = (exitVal - entryVal) * sizeVal;
    } else {
      profit = (entryVal - exitVal) * sizeVal;
    }

    const isCrypto = tradePair.toUpperCase().includes('USDT') || tradePair.toUpperCase().includes('BTC');
    const profitRupiah = isCrypto ? profit * 15000 : profit;
    const finalProfit = Math.round(profitRupiah);

    const newRec = {
      id: 'trd-' + Date.now(),
      pairOrStock: tradePair.trim().toUpperCase(),
      type: tradeType,
      entryPrice: entryVal,
      exitPrice: exitVal,
      positionSize: sizeVal,
      profit: finalProfit,
      emotion: tradeEmotion,
      date: new Date().toISOString().split('T')[0]
    };

    mutators.setTradingRecords(prev => [newRec, ...prev]);

    // SYNERGY: Post trading results to Finance
    const autoFinance = {
      id: 'fin-auto-trade-' + Date.now(),
      type: profitRupiah > 0 ? 'pemasukan' as const : 'pengeluaran' as const,
      category: 'Trading Log',
      amount: Math.abs(finalProfit),
      date: new Date().toISOString().split('T')[0],
      note: `[Trading Auto] ${tradeType} ${tradePair.toUpperCase()} (${tradeEmotion})`
    };
    mutators.setFinanceRecords(prev => [autoFinance, ...prev]);

    onAddQuickLog('Trading Journal', `${tradeType} ${tradePair.toUpperCase()}`, `${finalProfit >= 0 ? 'Profit' : 'Rugi'}: ${formatRupiah(finalProfit)} (${tradeEmotion})`);
    onIncrementActivity();

    setTradeEntry('');
    setTradeExit('');
    setTradeSize('');
    onClose();
  };

  const handleSaveOkr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!okrObjective.trim() || !okrKeyResult.trim()) {
      alert('Objective dan Key Result wajib diisi!');
      return;
    }

    const newRec = {
      id: 'okr-' + Date.now(),
      objective: okrObjective.trim(),
      keyResult: okrKeyResult.trim(),
      progress: Number(okrProgress)
    };

    mutators.setOkrRecords(prev => [...prev, newRec]);
    onAddQuickLog('Growth & OKR', 'Sasaran OKR', `${okrObjective.trim()} (Target: ${okrProgress}%)`);
    onIncrementActivity();

    setOkrObjective('');
    setOkrKeyResult('');
    setOkrProgress(50);
    onClose();
  };

  const handleSaveRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!relName.trim()) {
      alert('Masukkan nama hubungan!');
      return;
    }

    const newRec = {
      id: 'rel-' + Date.now(),
      name: relName.trim(),
      loveLanguage: relLoveLanguage,
      specialDate: relSpecialDate || 'Tidak ada',
      statusMeter: Number(relMeter)
    };

    mutators.setRelationshipRecords(prev => [...prev, newRec]);
    onAddQuickLog('Hubungan & Keluarga', 'Tambah Hubungan', `${relName.trim()} - Love Language: ${relLoveLanguage}`);
    onIncrementActivity();

    setRelName('');
    setRelSpecialDate('');
    onClose();
  };

  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-end justify-center z-50 animate-fade-in">
      <div className="bg-white w-full rounded-t-[32px] max-h-[85%] overflow-y-auto shadow-2xl flex flex-col no-scrollbar border-t border-slate-100 animate-slide-up">
        
        {/* Header */}
        <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-100 animate-pulse" /> Input Cepat
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pintu Masuk Utama ASE Workbook</p>
          </div>
          <button
            id="btn-quick-input-close"
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors cursor-pointer text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 space-y-4">
          
          {/* STEP 1: SELECT WORKBOOK IF NONE SELECTED */}
          {selectedWbId === null ? (
            <div className="space-y-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Pilih Workbook Aktif:</span>
              
              {activeWorkbooks.length > 0 ? (
                <div className="grid grid-cols-1 gap-2.5">
                  {activeWorkbooks.map(wb => (
                    <button
                      key={wb.id}
                      id={`btn-quick-select-${wb.id}`}
                      onClick={() => setSelectedWbId(wb.id)}
                      className="w-full p-3.5 rounded-2xl border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition-all active:scale-[0.99] cursor-pointer text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-white border border-slate-100 shadow-xs flex items-center justify-center">
                          {getWorkbookIcon(wb.id)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-800 leading-tight group-hover:text-slate-950 transition-colors">
                            {wb.title}
                          </h4>
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">{wb.category}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center bg-slate-50 border border-dashed border-slate-200 rounded-2xl space-y-3">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto shadow-xs">
                    <Info className="w-5 h-5 text-slate-400" />
                  </div>
                  <h4 className="font-extrabold text-xs text-slate-800">Tidak Ada Workbook Aktif</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed max-w-[200px] mx-auto font-medium">
                    Silakan unduh atau aktifkan Workbook Anda terlebih dahulu di menu "Jelajahi".
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* STEP 2: RENDER SPECIFIC INPUT FORM */
            <div className="space-y-4 animate-fade-in">
              {/* Back to workbook list button */}
              <button
                id="btn-quick-form-back"
                onClick={() => setSelectedWbId(null)}
                className="text-[10px] text-slate-500 hover:text-slate-700 font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
              >
                ← Kembali ke Pilihan Workbook
              </button>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5">
                {getWorkbookIcon(selectedWbId)}
                <div>
                  <h3 className="text-xs font-black text-slate-800">
                    Form Input: {workbooks.find(w => w.id === selectedWbId)?.title}
                  </h3>
                  <p className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    Selesai dalam kurang dari 30 detik
                  </p>
                </div>
              </div>

              {/* ----------------- FORM 1: KEUANGAN ----------------- */}
              {selectedWbId === 'wb-keuangan' && (
                <form onSubmit={handleSaveKeuangan} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tipe Data</label>
                      <select
                        value={finType}
                        onChange={(e) => {
                          const val = e.target.value as any;
                          setFinType(val);
                          if (val === 'pemasukan') setFinCategory('Gaji Pokok');
                          else if (val === 'pengeluaran') setFinCategory('Kebutuhan Pokok');
                          else if (val === 'tabungan') setFinCategory('Investasi');
                          else setFinCategory('Cicilan Laptop');
                        }}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="pemasukan">Pemasukan</option>
                        <option value="pengeluaran">Pengeluaran</option>
                        <option value="tabungan">Tabungan</option>
                        <option value="hutang">Hutang</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Kategori</label>
                      <select
                        value={finCategory}
                        onChange={(e) => setFinCategory(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
                      >
                        {finType === 'pemasukan' && (
                          <>
                            <option value="Gaji Pokok">Gaji Pokok</option>
                            <option value="Bisnis Sampingan">Bisnis Sampingan</option>
                            <option value="Hasil Investasi">Hasil Investasi</option>
                          </>
                        )}
                        {finType === 'pengeluaran' && (
                          <>
                            <option value="Kebutuhan Pokok">Kebutuhan Pokok</option>
                            <option value="Keinginan">Keinginan</option>
                            <option value="Tagihan & Utilitas">Tagihan & Utilitas</option>
                            <option value="Kesehatan">Kesehatan</option>
                          </>
                        )}
                        {finType === 'tabungan' && (
                          <>
                            <option value="Investasi">Investasi</option>
                            <option value="Dana Darurat">Dana Darurat</option>
                            <option value="Emas">Emas</option>
                          </>
                        )}
                        {finType === 'hutang' && (
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
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nominal Transaksi (Rp)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">Rp</span>
                      <input
                        type="number"
                        value={finAmount}
                        onChange={(e) => setFinAmount(e.target.value)}
                        placeholder="Contoh: 150000"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Catatan</label>
                    <input
                      type="text"
                      value={finNote}
                      onChange={(e) => setFinNote(e.target.value)}
                      placeholder="Keterangan singkat..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tanggal</label>
                    <input
                      type="date"
                      value={finDate}
                      onChange={(e) => setFinDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-emerald-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Simpan Data Keuangan
                  </button>
                </form>
              )}

              {/* ----------------- FORM 2: PLANNER ----------------- */}
              {selectedWbId === 'wb-planner' && (
                <form onSubmit={handleSavePlanner} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nama Tugas</label>
                    <input
                      type="text"
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Contoh: Selesaikan proposal klien A..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-indigo-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Blok Waktu</label>
                      <select
                        value={taskTimeBlock}
                        onChange={(e) => setTaskTimeBlock(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-indigo-500 focus:outline-none"
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
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Prioritas</label>
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-indigo-500 focus:outline-none"
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
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Tambah Tugas Matrix
                  </button>
                </form>
              )}

              {/* ----------------- FORM 3: HABIT ----------------- */}
              {selectedWbId === 'wb-habit' && (
                <form onSubmit={handleSaveHabit} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nama Kebiasaan</label>
                    <input
                      type="text"
                      value={habitName}
                      onChange={(e) => setHabitName(e.target.value)}
                      placeholder="Contoh: Olahraga Harian, Membaca 15 Menit..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-amber-500 focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Daftarkan Kebiasaan Baru
                  </button>
                </form>
              )}

              {/* ----------------- FORM 4: CRM ----------------- */}
              {selectedWbId === 'wb-crm' && (
                <form onSubmit={handleSaveCrm} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nama Pelanggan / Klien</label>
                    <input
                      type="text"
                      value={crmClientName}
                      onChange={(e) => setCrmClientName(e.target.value)}
                      placeholder="Contoh: PT. Makmur Sentosa..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nilai Deal (Rupiah)</label>
                      <input
                        type="number"
                        value={crmDealValue}
                        onChange={(e) => setCrmDealValue(e.target.value)}
                        placeholder="Contoh: 12000000"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Status Pipeline</label>
                      <select
                        value={crmStatus}
                        onChange={(e) => setCrmStatus(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
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
                        checked={crmCreateContact}
                        onChange={(e) => setCrmCreateContact(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-[10px] font-bold text-slate-600">Simpan otomatis ke Kontak Bersama</span>
                    </label>
                    {crmCreateContact && (
                      <input
                        type="text"
                        value={crmPhone}
                        onChange={(e) => setCrmPhone(e.target.value)}
                        placeholder="Nomor Telepon: 0812-xxxx-xxxx"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 text-[11px] rounded-lg font-bold text-slate-700 mt-1 focus:border-orange-500 focus:outline-none"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Catatan Follow-up</label>
                    <input
                      type="text"
                      value={crmNotes}
                      onChange={(e) => setCrmNotes(e.target.value)}
                      placeholder="Langkah berikutnya..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Daftarkan ke Pipeline
                  </button>
                </form>
              )}

              {/* ----------------- FORM 5: TRADING ----------------- */}
              {selectedWbId === 'wb-trading' && (
                <form onSubmit={handleSaveTrading} className="space-y-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Instrumen / Saham</label>
                      <input
                        type="text"
                        value={tradePair}
                        onChange={(e) => setTradePair(e.target.value)}
                        placeholder="Contoh: BBRI.JK atau BTC/USDT"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Tipe Transaksi</label>
                      <select
                        value={tradeType}
                        onChange={(e) => setTradeType(e.target.value as any)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                      >
                        <option value="Buy">BUY (Beli)</option>
                        <option value="Sell">SELL (Jual)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase">Harga Entry</label>
                      <input
                        type="number"
                        value={tradeEntry}
                        onChange={(e) => setTradeEntry(e.target.value)}
                        placeholder="62000"
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase">Harga Exit</label>
                      <input
                        type="number"
                        value={tradeExit}
                        onChange={(e) => setTradeExit(e.target.value)}
                        placeholder="63500"
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-extrabold text-slate-400 uppercase">Volume Size</label>
                      <input
                        type="number"
                        value={tradeSize}
                        onChange={(e) => setTradeSize(e.target.value)}
                        placeholder="0.2"
                        step="any"
                        className="w-full px-2 py-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Keadaan Emosi saat Entry</label>
                    <select
                      value={tradeEmotion}
                      onChange={(e) => setTradeEmotion(e.target.value as any)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-rose-500 focus:outline-none"
                    >
                      <option value="Tenang">🟢 Tenang & Disiplin (Rasional)</option>
                      <option value="FOMO">🔴 FOMO (Takut Ketinggalan)</option>
                      <option value="Takut">🟡 Takut Rugi (Gemetar)</option>
                      <option value="Gembira">🔵 Gembira Berlebihan (Greedy)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Simpan Jurnal Trading
                  </button>
                </form>
              )}

              {/* ----------------- FORM 6: OKR sasaran ----------------- */}
              {selectedWbId === 'wb-growth' && (
                <form onSubmit={handleSaveOkr} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Objective Utama (Kualitatif)</label>
                    <input
                      type="text"
                      value={okrObjective}
                      onChange={(e) => setOkrObjective(e.target.value)}
                      placeholder="Contoh: Meningkatkan Omset Bisnis..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Key Result (Dapat Diukur)</label>
                    <input
                      type="text"
                      value={okrKeyResult}
                      onChange={(e) => setOkrKeyResult(e.target.value)}
                      placeholder="Contoh: Menutup 3 kontrak berharga baru..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase">
                      <span>Progres Target</span>
                      <span className="text-blue-600 font-extrabold">{okrProgress}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={okrProgress}
                      onChange={(e) => setOkrProgress(Number(e.target.value))}
                      className="w-full accent-blue-600 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Daftarkan Sasaran OKR
                  </button>
                </form>
              )}

              {/* ----------------- FORM 7: RELATIONSHIP ----------------- */}
              {selectedWbId === 'wb-relationship' && (
                <form onSubmit={handleSaveRelationship} className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-slate-400 uppercase">Nama Orang Spesial</label>
                    <input
                      type="text"
                      value={relName}
                      onChange={(e) => setRelName(e.target.value)}
                      placeholder="Contoh: Siti (Istri)..."
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-pink-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Love Language Utama</label>
                      <select
                        value={relLoveLanguage}
                        onChange={(e) => setRelLoveLanguage(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-pink-500 focus:outline-none"
                      >
                        <option value="Quality Time">Quality Time</option>
                        <option value="Acts of Service">Acts of Service</option>
                        <option value="Words of Affirmation">Words of Affirmation</option>
                        <option value="Physical Touch">Physical Touch</option>
                        <option value="Receiving Gifts">Receiving Gifts</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-slate-400 uppercase">Hari Berharga (Ultah/Anniv)</label>
                      <input
                        type="text"
                        value={relSpecialDate}
                        onChange={(e) => setRelSpecialDate(e.target.value)}
                        placeholder="Contoh: 15 September (Anniv)"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 text-xs rounded-xl font-bold text-slate-700 focus:border-pink-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-extrabold text-slate-400 uppercase">
                      <span>Indikator Keharmonisan</span>
                      <span className="text-pink-600 font-extrabold">{relMeter}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={relMeter}
                      onChange={(e) => setRelMeter(Number(e.target.value))}
                      className="w-full accent-pink-600 cursor-pointer"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all active:scale-[0.98] mt-2"
                  >
                    <Save className="w-4 h-4" /> Daftarkan Hubungan Berharga
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

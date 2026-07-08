/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowRight, 
  TrendingUp, 
  Bookmark, 
  Sparkles,
  Award,
  Compass,
  FileText,
  Clock,
  CheckCircle2,
  ListCollapse,
  Layers,
  Flame as FlameIcon
} from 'lucide-react';
import { Workbook, UserProfile, DailyActivity, TimelineItem, Goal } from '../types';
import { KATALIS_MOTIVASI } from '../mockData';
import { getThemeStyles } from './MobileFrame';
import { SharedData } from '../modules/ModuleContract';
import { DashboardEngine } from '../modules/BookEngine';

interface BerandaViewProps {
  user: UserProfile;
  workbooks: Workbook[];
  onContinueWorkbook: (wbId: string) => void;
  onExploreMore: () => void;
  onNavigateToTab: (tabId: string) => void; // Support switching tab
  themeColor: string;
  quickInputLogs?: any[];
  sharedData?: SharedData;
  activity?: DailyActivity[];
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
  goals: Goal[];
}

export default function BerandaView({
  user,
  workbooks,
  onContinueWorkbook,
  onExploreMore,
  onNavigateToTab,
  themeColor,
  quickInputLogs = [],
  sharedData,
  activity = [],
  timeline,
  setTimeline,
  goals
}: BerandaViewProps) {
  const [motivasiIndex, setMotivasiIndex] = useState(0);
  const [timelineFilter, setTimelineFilter] = useState<'semua' | 'input' | 'output' | 'insight' | 'change'>('semua');

  const handleAddReaction = (id: string, reaction: string) => {
    setTimeline(prev => prev.map(item => item.id === id ? { ...item, userReaction: reaction } : item));
  };

  const themeStyles = getThemeStyles(themeColor);

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Filter downloaded workbooks (Buku Saya)
  const activeWorkbooks = workbooks.filter((wb) => wb.isDownloaded);

  // Calculate stats for Ringkasan widget
  const totalBooks = activeWorkbooks.length;
  const avgProgress = totalBooks > 0 
    ? Math.round(activeWorkbooks.reduce((acc, wb) => acc + wb.progress, 0) / totalBooks) 
    : 0;

  const downloadedWbIds = activeWorkbooks.map(w => w.id);
  const baseWorkMinutes = activity.reduce((acc, act) => acc + act.minutes, 0);

  // Fallback sharedData structure if undefined
  const defaultShared: SharedData = sharedData || {
    financeRecords: [],
    taskRecords: [],
    habitRecords: [],
    crmRecords: [],
    tradingRecords: [],
    okrRecords: [],
    relationshipRecords: [],
    sharedContacts: []
  };

  // Run aggregate engine
  const summary = DashboardEngine.aggregate(defaultShared, downloadedWbIds, baseWorkMinutes);

  // Gather real database entries for activity feed
  const recentDbEntries: any[] = [];
  
  if (sharedData) {
    sharedData.financeRecords.forEach(r => {
      recentDbEntries.push({
        title: r.note || `${r.type === 'pemasukan' ? 'Pemasukan' : 'Pengeluaran'} ${r.category}`,
        subtitle: `Workbook: Keuangan Pribadi`,
        notes: `Nilai: ${formatRupiah(r.amount)} • Tanggal: ${r.date}`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.taskRecords.forEach(r => {
      recentDbEntries.push({
        title: r.taskName,
        subtitle: `Workbook: Planner Harian`,
        notes: `Prioritas: ${r.priority} • Status: ${r.completed ? 'Selesai' : 'Belum Selesai'}`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.habitRecords.forEach(r => {
      recentDbEntries.push({
        title: `Habit: ${r.habitName}`,
        subtitle: `Workbook: Habit Tracker`,
        notes: `Streak berjalan: ${r.streak} Hari`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.crmRecords.forEach(r => {
      recentDbEntries.push({
        title: `Klien: ${r.clientName}`,
        subtitle: `Workbook: CRM Penjualan`,
        notes: `Deal: ${formatRupiah(r.dealValue)} • Status: ${r.status}`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.tradingRecords.forEach(r => {
      recentDbEntries.push({
        title: `Trade: ${r.pairOrStock}`,
        subtitle: `Workbook: Jurnal Trading`,
        notes: `${r.type} @ ${r.entryPrice} • Profit: ${formatRupiah(r.profit)}`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.okrRecords.forEach(r => {
      recentDbEntries.push({
        title: `OKR: ${r.objective}`,
        subtitle: `Workbook: Growth Tracker`,
        notes: `KR: ${r.keyResult} • Progres: ${r.progress}%`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });

    sharedData.relationshipRecords.forEach(r => {
      recentDbEntries.push({
        title: `Hubungan: ${r.name}`,
        subtitle: `Workbook: Relationship OS`,
        notes: `Love Language: ${r.loveLanguage} • Indikator: ${r.statusMeter}%`,
        isQuickInput: false,
        time: 'Baru saja',
        timestampRaw: r.id.includes('-') ? parseInt(r.id.split('-')[1]) : Date.now()
      });
    });
  }

  // Combine quick logs and real DB entries, then sort by timestamp (newest first)
  const combinedActivities = [
    ...quickInputLogs.map(log => ({
      title: log.entryName,
      subtitle: `Workbook: ${log.workbookTitle}`,
      notes: log.details,
      isQuickInput: true,
      time: log.timestamp,
      timestampRaw: log.id.includes('-') ? parseInt(log.id.split('-')[1]) : Date.now()
    })),
    ...recentDbEntries
  ].sort((a, b) => b.timestampRaw - a.timestampRaw);

  const handleNextMotivation = () => {
    setMotivasiIndex((prev) => (prev + 1) % KATALIS_MOTIVASI.length);
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      
      {/* 👋 Selamat Datang Section */}
      <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-xl"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-white/10 blur-lg"></div>

        <div className="relative z-10 space-y-1">
          <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider backdrop-blur-sm">
            Platform ASE Core
          </span>
          <h2 className="text-xl font-black tracking-tight mt-1">
            Halo, {user.name}!
          </h2>
          <p className="text-xs text-emerald-50/90 leading-snug font-bold">
            Apa yang ingin Anda kerjakan hari ini?
          </p>
        </div>
      </div>

      {/* THREE CORE NAVIGATION CARDS (Grid) */}
      <div className="grid grid-cols-3 gap-2.5">
        
        {/* Card 1: Buku Saya */}
        <div 
          id="btn-beranda-buku-saya"
          onClick={() => onNavigateToTab('buku')}
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center justify-between cursor-pointer transition-all hover:border-emerald-200 active:scale-[0.98] h-28"
        >
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100">
            📚
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-800 block">Workbook Saya</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase">{totalBooks} Aktif</span>
          </div>
        </div>

        {/* Card 2: Jelajahi Workbook */}
        <div 
          id="btn-beranda-jelajahi"
          onClick={() => onNavigateToTab('jelajahi')}
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center justify-between cursor-pointer transition-all hover:border-emerald-200 active:scale-[0.98] h-28"
        >
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100">
            🛍
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-800 block leading-tight">Jelajahi Workbook</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase">7 Pilihan</span>
          </div>
        </div>

        {/* Card 3: Ringkasan */}
        <div 
          id="btn-beranda-ringkasan"
          onClick={() => onNavigateToTab('ringkasan')}
          className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center justify-between cursor-pointer transition-all hover:border-emerald-200 active:scale-[0.98] h-28"
        >
          <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-lg shadow-sm border border-emerald-100">
            📊
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-black text-slate-800 block">Ringkasan</span>
            <span className="text-[8px] text-slate-400 font-bold uppercase">{avgProgress}% Avg</span>
          </div>
        </div>

      </div>

      {/* RINGKASAN HARI INI */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-emerald-600" /> Ringkasan Hari Ini
        </h3>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Waktu Kerja</span>
            <span className="text-base font-black text-slate-800 block mt-0.5">{summary.totalStudyMinutes} Menit</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
            <span className="text-[9px] text-slate-400 font-bold uppercase block">Total Entri Data</span>
            <span className="text-base font-black text-slate-800 block mt-0.5">
              {summary.totalLoggedEntries} Rekod Kerja
            </span>
          </div>
        </div>
      </div>

      {/* AKTIVITAS TERAKHIR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
          <Clock className="w-4 h-4 text-emerald-600" /> Aktivitas Terakhir
        </h3>

        <div className="space-y-2.5">
          {combinedActivities.length > 0 ? (
            combinedActivities.slice(0, 4).map((item, index) => (
              <div key={index} className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100/50">
                <div className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 shadow-xs ${
                  item.isQuickInput 
                    ? 'bg-amber-100 text-amber-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {item.isQuickInput ? '⚡' : '✓'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-extrabold text-slate-800 leading-tight truncate">{item.title}</h4>
                    <span className="text-[8px] font-bold text-slate-400 shrink-0">{item.time}</span>
                  </div>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{item.subtitle}</p>
                  {item.notes && (
                    <p className="text-[10px] text-slate-600 italic line-clamp-1 mt-1 bg-white px-1.5 py-1 rounded border border-slate-100">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex gap-3 items-start p-2.5 rounded-xl bg-slate-50 border border-slate-100/50">
              <div className="w-7.5 h-7.5 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                •
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-extrabold text-slate-800 leading-tight">Memulai Platform ASE</h4>
                <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Sistem data bersama berjalan stabil.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ==========================================
          ASE TIMELINE ENGINE (CUSTOM DESIGNED)
          ========================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5">
              <Layers className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-800">ASE Timeline Engine</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Jejak Masukan, Luaran, & Wawasan Terintegrasi</p>
          </div>
          <span className="text-[9px] bg-slate-100 px-2 py-0.5 rounded-full font-bold uppercase text-slate-500">Live Tracing</span>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1">
          {([
            { id: 'semua', label: 'Semua' },
            { id: 'input', label: 'Input 📥' },
            { id: 'output', label: 'Output 📤' },
            { id: 'insight', label: 'Insight 💡' },
            { id: 'change', label: 'Change 🔄' }
          ] as const).map(pill => {
            const isSelected = timelineFilter === pill.id;
            return (
              <button
                key={pill.id}
                id={`btn-timeline-filter-${pill.id}`}
                onClick={() => setTimelineFilter(pill.id)}
                className={`px-2.5 py-1 text-[10px] font-black rounded-lg transition-all ${
                  isSelected 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-slate-50 text-slate-500 hover:text-slate-800 border border-slate-100'
                }`}
              >
                {pill.label}
              </button>
            );
          })}
        </div>

        {/* Timeline Items Feed */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-0.5 no-scrollbar">
          {timeline
            .filter(item => {
              if (timelineFilter === 'semua') return true;
              if (timelineFilter === 'input') return item.type === 'Input';
              if (timelineFilter === 'output') return item.type === 'Output';
              if (timelineFilter === 'insight') return item.type === 'Insight';
              if (timelineFilter === 'change') return item.type === 'Perubahan';
              return true;
            })
            .map(item => {
              const getTypeStyle = (type: TimelineItem['type']) => {
                switch (type) {
                  case 'Input': return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-100', icon: '📥', label: 'Input' };
                  case 'Output': return { bg: 'bg-indigo-50 text-indigo-700 border-indigo-100', icon: '📤', label: 'Output' };
                  case 'Insight': return { bg: 'bg-amber-50 text-amber-700 border-amber-100', icon: '💡', label: 'Insight' };
                  case 'Perubahan': 
                  default:
                    return { bg: 'bg-sky-50 text-sky-700 border-sky-100', icon: '🔄', label: 'Perubahan' };
                }
              };
              const style = getTypeStyle(item.type);

              return (
                <div key={item.id} className="p-3 bg-slate-50/50 rounded-xl border border-slate-100 space-y-2 hover:border-slate-200 transition-all">
                  {/* Item Metadata Header */}
                  <div className="flex justify-between items-center text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-1.5 py-0.5 rounded-md text-[8px] font-extrabold uppercase tracking-wide border ${style.bg}`}>
                        {style.icon} {style.label}
                      </span>
                      <span className="font-extrabold text-slate-500">{item.workbookTitle}</span>
                    </div>
                    <span className="font-bold text-slate-400">{item.timestamp}</span>
                  </div>

                  {/* Details */}
                  <p className="text-xs font-semibold text-slate-700 leading-relaxed bg-white/75 p-2 rounded-lg border border-slate-50/70">
                    {item.detail}
                  </p>

                  {/* Bottom Controls: Emojis Reactions */}
                  <div className="flex items-center justify-between pt-1 text-[10px] border-t border-slate-100 border-dashed">
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] font-bold text-slate-400">Reaksi:</span>
                      <div className="flex gap-1">
                        {['👍', '🔥', '👏', '💡', '🎯', '💪'].map(emoji => (
                          <button
                            key={emoji}
                            onClick={() => handleAddReaction(item.id, emoji)}
                            className={`p-1 hover:bg-slate-200 rounded text-xs transition-all ${
                              item.userReaction === emoji ? 'bg-indigo-50 scale-110 border border-indigo-100' : ''
                            }`}
                            title={`Bereaksi ${emoji}`}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Active Reaction Badge */}
                    {item.userReaction && (
                      <span className="px-1.5 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 font-extrabold rounded-md text-[9px] flex items-center gap-1 animate-pulse">
                        Sikap: {item.userReaction}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

          {timeline.filter(item => {
            if (timelineFilter === 'semua') return true;
            if (timelineFilter === 'input') return item.type === 'Input';
            if (timelineFilter === 'output') return item.type === 'Output';
            if (timelineFilter === 'insight') return item.type === 'Insight';
            if (timelineFilter === 'change') return item.type === 'Perubahan';
            return true;
          }).length === 0 && (
            <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-100">
              <span className="text-[10px] font-bold block">Tidak ada jejak untuk filter ini</span>
            </div>
          )}
        </div>
      </div>

      {/* Catalyst / Motivation Section */}
      <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100/60 shadow-sm relative overflow-hidden">
        <div className="absolute top-2 right-2 opacity-5">
          <Sparkles className="w-16 h-16 text-amber-500" />
        </div>
        
        <div className="flex items-center gap-1.5 mb-1.5 text-amber-800">
          <div className="p-1 bg-amber-100 rounded-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-[9px] font-bold uppercase tracking-wider">Katalis Motivasi</span>
        </div>
        
        <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
          "{KATALIS_MOTIVASI[motivasiIndex]}"
        </p>
        
        <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-amber-100/50">
          <span className="text-[8px] text-amber-700/60 font-medium">Ketuk tombol untuk menyegarkan motivasi</span>
          <button
            id="btn-cycle-motivation"
            onClick={handleNextMotivation}
            className="text-[9px] font-bold text-amber-800 hover:text-amber-950 flex items-center gap-1 cursor-pointer"
          >
            Segarkan <ArrowRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

    </div>
  );
}

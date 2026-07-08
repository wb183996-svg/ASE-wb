/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  ChevronRight,
  BookOpen as BookIcon
} from 'lucide-react';
import { 
  Workbook, 
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
} from '../types';
import { getThemeStyles } from './MobileFrame';
import { BookEngine } from '../modules/BookEngine';
import { SharedData, SharedDataMutators } from '../modules/ModuleContract';

interface BukuSayaViewProps {
  workbooks: Workbook[];
  onUpdateWorkbook: (updatedWb: Workbook) => void;
  selectedWbId: string | null;
  setSelectedWbId: (id: string | null) => void;
  themeColor: string;
  
  // ASE v2.0 Shared Data Engine State and Mutators
  financeRecords: FinanceRecord[];
  setFinanceRecords: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  taskRecords: TaskRecord[];
  setTaskRecords: React.Dispatch<React.SetStateAction<TaskRecord[]>>;
  habitRecords: HabitRecord[];
  setHabitRecords: React.Dispatch<React.SetStateAction<HabitRecord[]>>;
  crmRecords: CrmRecord[];
  setCrmRecords: React.Dispatch<React.SetStateAction<CrmRecord[]>>;
  tradingRecords: TradingRecord[];
  setTradingRecords: React.Dispatch<React.SetStateAction<TradingRecord[]>>;
  okrRecords: OkrRecord[];
  setOkrRecords: React.Dispatch<React.SetStateAction<OkrRecord[]>>;
  relationshipRecords: RelationshipRecord[];
  setRelationshipRecords: React.Dispatch<React.SetStateAction<RelationshipRecord[]>>;
  sharedContacts: SharedContact[];
  setSharedContacts: React.Dispatch<React.SetStateAction<SharedContact[]>>;
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  timeline: TimelineItem[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelineItem[]>>;
}

export default function BukuSayaView({
  workbooks,
  onUpdateWorkbook,
  selectedWbId,
  setSelectedWbId,
  themeColor,
  
  financeRecords,
  setFinanceRecords,
  taskRecords,
  setTaskRecords,
  habitRecords,
  setHabitRecords,
  crmRecords,
  setCrmRecords,
  tradingRecords,
  setTradingRecords,
  okrRecords,
  setOkrRecords,
  relationshipRecords,
  setRelationshipRecords,
  sharedContacts,
  setSharedContacts,
  goals,
  setGoals,
  timeline,
  setTimeline,
}: BukuSayaViewProps) {
  const [filter, setFilter] = useState<'semua' | 'aktif' | 'selesai'>('semua');
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  const downloadedWorkbooks = workbooks.filter((wb) => wb.isDownloaded);
  const themeStyles = getThemeStyles(themeColor);

  // Shared Data object matching the contract
  const sharedData: SharedData = {
    financeRecords,
    taskRecords,
    habitRecords,
    crmRecords,
    tradingRecords,
    okrRecords,
    relationshipRecords,
    sharedContacts
  };

  // Shared Data Mutators matching the contract
  const mutators: SharedDataMutators = {
    setFinanceRecords,
    setTaskRecords,
    setHabitRecords,
    setCrmRecords,
    setTradingRecords,
    setOkrRecords,
    setRelationshipRecords,
    setSharedContacts
  };

  // Filter list based on completed vs active
  const filteredWorkbooks = downloadedWorkbooks.filter((wb) => {
    if (filter === 'aktif') return wb.progress < 100;
    if (filter === 'selesai') return wb.progress === 100;
    return true;
  });

  const triggerSuccess = (msg: string) => {
    setSuccessFeedback(msg);
    setTimeout(() => setSuccessFeedback(null), 3000);
  };

  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getRecordCount = (wbId: string) => {
    switch (wbId) {
      case 'wb-keuangan': return financeRecords.length;
      case 'wb-planner': return taskRecords.length;
      case 'wb-habit': return habitRecords.length;
      case 'wb-crm': return crmRecords.length;
      case 'wb-trading': return tradingRecords.length;
      case 'wb-growth': return okrRecords.length;
      case 'wb-relationship': return relationshipRecords.length;
      default: return 0;
    }
  };

  // Find currently selected workbook metadata
  const currentWorkbook = downloadedWorkbooks.find((wb) => wb.id === selectedWbId);

  // =========================================================
  // DYNAMIC COMPONENT RENDERER FROM WORKBOOK ENGINE CONTRACT
  // =========================================================
  const renderWorkbookWorkspace = (wb: Workbook) => {
    const mod = BookEngine.getModuleById(wb.id);
    if (!mod) {
      return (
        <div className="p-8 text-center bg-white border border-slate-100 rounded-2xl text-slate-500 text-xs">
          Modul sistem kerja "{wb.title}" tidak ditemukan di registrasi Book Engine.
        </div>
      );
    }

    // Run active process engine
    const processed = mod.processEngine(sharedData);
    const insight = mod.getInsight(sharedData, processed);

    return (
      <div className="space-y-4 animate-fade-in pb-16">
        
        {/* Workspace Mini Banner */}
        <div className={`p-4 rounded-2xl text-white bg-gradient-to-r ${wb.coverGradient || mod.metadata.coverGradient} shadow-sm space-y-1 relative overflow-hidden`}>
          <div className="absolute top-2 right-2 opacity-15">
            <Sparkles className="w-16 h-16" />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[9px] bg-white/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
              {wb.category}
            </span>
            <span className="text-[10px] font-black text-white/90">
              {wb.version || mod.metadata.version}
            </span>
          </div>
          <h2 className="text-base font-black tracking-tight">{wb.title} Workspace</h2>
          <p className="text-[10px] text-white/90 font-bold">
            Tujuan: {wb.description}
          </p>
        </div>

        {/* Global Success Banner */}
        {successFeedback && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl animate-bounce flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            {successFeedback}
          </div>
        )}

        {/* 1. OUTPUT ANALISIS GRAPH / ENGINE METRIC */}
        {mod.renderOutput({ sharedData, processed, themeColor })}

        {/* 2. DYNAMIC INPUT FORM */}
        {mod.renderInput({ sharedData, mutators, triggerSuccess, themeColor })}

        {/* 3. CONTEXT-AWARE INSIGHT ALERT */}
        <div className={`p-3.5 rounded-xl border flex items-start gap-2.5 ${
          insight.type === 'warning' ? 'bg-amber-50/50 border-amber-100 text-amber-900' :
          insight.type === 'success' ? 'bg-emerald-50/50 border-emerald-100 text-emerald-900' :
          'bg-indigo-50/50 border-indigo-100 text-indigo-900'
        }`}>
          {insight.type === 'warning' ? (
            <AlertTriangle className="w-4.5 h-4.5 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <Sparkles className="w-4.5 h-4.5 text-indigo-600 shrink-0 mt-0.5" />
          )}
          <div className="space-y-0.5 text-xs">
            <span className="font-extrabold block uppercase tracking-wider text-[9px] text-slate-500">Rekomendasi Pintar</span>
            <p className="text-[11px] leading-relaxed text-slate-700 font-semibold">{insight.message}</p>
          </div>
        </div>

        {/* 4. DYNAMIC HISTORY LIST LOGS */}
        <div className="space-y-2 px-1">
          <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Arsip Log Transaksi</span>
          {mod.renderRiwayat({ sharedData, mutators, triggerSuccess })}
        </div>
      </div>
    );
  };

  // ==========================================
  // VIEW RENDER ENTRY POINT
  // ==========================================

  // 1. DETAIL WORKSPACE VIEW
  if (currentWorkbook) {
    return (
      <div className="p-4 space-y-4 animate-fade-in pb-12">
        {/* Workspace Title Header and Back button */}
        <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
          <button
            id="btn-workspace-back"
            onClick={() => setSelectedWbId(null)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer text-slate-600 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h1 className="text-sm font-black text-slate-800 tracking-tight truncate">
              {currentWorkbook.title}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Kembali ke Workbook Saya
            </p>
          </div>
        </div>

        {/* Workspace content renderer */}
        {renderWorkbookWorkspace(currentWorkbook)}
      </div>
    );
  }

  // 2. MAIN ACTIVE WORKBOOKS LIST VIEW (BUKU SAYA)
  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      {/* Category Filter Pills */}
      <div className="flex gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto no-scrollbar">
        {[
          { id: 'semua', label: 'Semua Workbook' },
          { id: 'aktif', label: 'Sedang Aktif' },
          { id: 'selesai', label: 'Telah Selesai' }
        ].map((item) => {
          const isActive = filter === item.id;
          let activeClass = '';
          
          if (isActive) {
            activeClass = themeStyles.buttonBg;
          } else {
            activeClass = 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50';
          }

          return (
            <button
              key={item.id}
              id={`btn-filter-wb-${item.id}`}
              onClick={() => setFilter(item.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all ${activeClass}`}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Grid/List of downloaded active workbooks */}
      {filteredWorkbooks.length > 0 ? (
        <div className="space-y-3.5">
          {filteredWorkbooks.map((wb) => {
            const mod = BookEngine.getModuleById(wb.id);
            const dataCount = getRecordCount(wb.id);
            let lastOutput = "Belum ada entri";

            if (mod) {
              const processed = mod.processEngine(sharedData);
              if (wb.id === 'wb-keuangan') {
                lastOutput = `Saldo: ${formatRupiah(processed.balance)}`;
              } else if (wb.id === 'wb-planner') {
                lastOutput = `Tugas: ${processed.completedCount}/${processed.totalCount} Selesai`;
              } else if (wb.id === 'wb-habit') {
                lastOutput = `${processed.activeHabitsCount} Habits | Streak: ${processed.maxStreak} Hari`;
              } else if (wb.id === 'wb-crm') {
                lastOutput = `Won: ${formatRupiah(processed.wonCrmTotal)}`;
              } else if (wb.id === 'wb-trading') {
                lastOutput = `Net Profit: ${formatRupiah(processed.netProfit)}`;
              } else if (wb.id === 'wb-growth') {
                lastOutput = `Avg OKR: ${processed.avgProgress}%`;
              } else if (wb.id === 'wb-relationship') {
                lastOutput = `Health: ${processed.avgMeter}%`;
              }
            }

            return (
              <div
                key={wb.id}
                id={`btn-wb-card-${wb.id}`}
                onClick={() => setSelectedWbId(wb.id)}
                className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm overflow-hidden flex flex-col cursor-pointer transition-all active:scale-[0.99] group"
              >
                {/* Accent line with cover color */}
                <div className={`h-2.5 bg-gradient-to-r ${wb.coverGradient}`}></div>
                
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black bg-slate-50 text-slate-500 border border-slate-150 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {wb.category}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {wb.version || (mod && mod.metadata.version) || 'v2.0'}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-slate-900 transition-colors line-clamp-1">
                      {wb.title}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                      Sistem Operasi: <span className="text-slate-500 font-bold">{wb.developer || 'ASE Lab'}</span>
                    </p>
                  </div>

                  {/* Operational stats live indicators */}
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100/30">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">Jumlah Entri</span>
                      <span className="text-[11px] font-black text-slate-700 block">{dataCount} Rekod Aktif</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block">Output Terakhir</span>
                      <span className="text-[10px] font-extrabold text-emerald-700 block truncate">{lastOutput}</span>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="pt-2 border-t border-slate-50 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-400 font-medium">
                      Status: <span className="text-emerald-700 font-bold">Terhubung ASE Core</span>
                    </span>
                    <button
                      id={`btn-open-active-${wb.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedWbId(wb.id);
                      }}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all cursor-pointer"
                    >
                      Buka Kerja
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl text-center border border-dashed border-slate-300 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
            <BookOpen className="w-6 h-6 text-slate-300" />
          </div>
          <h4 className="font-extrabold text-sm text-slate-800">Belum Ada Workbook Aktif</h4>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Silakan aktifkan workbook baru melalui menu 'Jelajahi' untuk memasang modul aplikasi kerja Anda.
          </p>
          <button
            id="btn-empty-explore-more"
            onClick={() => {
              const triggerExplore = document.getElementById('nav-item-jelajahi');
              if (triggerExplore) {
                triggerExplore.click();
              }
            }}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl cursor-pointer transition-all shadow-md inline-flex items-center gap-1"
          >
            Jelajahi Workbook
          </button>
        </div>
      )}
    </div>
  );
}

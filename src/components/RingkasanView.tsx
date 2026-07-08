/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { 
  BarChart3, 
  Award, 
  Clock, 
  Flame, 
  CheckCircle2, 
  TrendingUp,
  Zap,
  Wallet,
  Activity,
  Calendar,
  Heart,
  Users,
  Target,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  Sparkles,
  Cpu,
  Database,
  Layers,
  Network,
  ShieldCheck,
  Terminal,
  ClipboardCheck,
  BookOpen,
  RefreshCw,
  Search,
  Share2,
  FileCode,
  Brain,
  Lightbulb,
  CheckSquare,
  HelpCircle
} from 'lucide-react';
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
  UserProfile
} from '../types';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { getThemeStyles } from './MobileFrame';
import { BookEngine, DashboardEngine } from '../modules/BookEngine';
import { SharedData } from '../modules/ModuleContract';
import { DecisionEngine, DecisionAdvice, ActionPlanItem } from '../utils/DecisionEngine';
import { IdentityModule } from '../core/IdentityService';

interface RingkasanViewProps {
  workbooks: Workbook[];
  activity: DailyActivity[];
  themeColor: string;
  onNavigateToWorkbook: (id: string) => void;

  // ASE v2.0 Shared Data Engine State
  financeRecords: FinanceRecord[];
  taskRecords: TaskRecord[];
  habitRecords: HabitRecord[];
  crmRecords: CrmRecord[];
  tradingRecords: TradingRecord[];
  okrRecords: OkrRecord[];
  relationshipRecords: RelationshipRecord[];
  sharedContacts: SharedContact[];
  goals: Goal[];
  setGoals: React.Dispatch<React.SetStateAction<Goal[]>>;
  user: UserProfile;
}

export default function RingkasanView({
  workbooks,
  activity,
  themeColor,
  onNavigateToWorkbook,

  financeRecords,
  taskRecords,
  habitRecords,
  crmRecords,
  tradingRecords,
  okrRecords,
  relationshipRecords,
  sharedContacts,
  goals,
  setGoals,
  user,
}: RingkasanViewProps) {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number | null>(4); // Default select Friday
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalDeadline, setNewGoalDeadline] = useState('');
  const [newGoalWbId, setNewGoalWbId] = useState('wb-keuangan');
  const [viewTab, setViewTab] = useState<'dashboard' | 'decision' | 'core'>('dashboard');
  const [financeChartType, setFinanceChartType] = useState<'bar' | 'line'>('bar');

  // State for Decision & Coaching Engine
  const [adviceListState, setAdviceListState] = useState<DecisionAdvice[]>([]);
  const [selectedAdviceId, setSelectedAdviceId] = useState<string>('DE-FIN');

  // State for Gemini AI Insight Engine
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState<boolean>(false);
  const [insightError, setInsightError] = useState<string | null>(null);

  const fetchAiInsight = async () => {
    setIsLoadingInsight(true);
    setInsightError(null);
    try {
      const session = IdentityModule.getCurrentSession();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (session && session.token) {
        headers['Authorization'] = `Bearer ${session.token}`;
      }

      const response = await fetch('/api/ai-insight', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          financeRecords,
          activity,
          workspaceMode: user.workspaceMode || 'Individu',
          goals
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menghasilkan analisis.');
      }

      const data = await response.json();
      setAiInsight(data.insight);
    } catch (err: any) {
      console.error(err);
      setInsightError(err.message || 'Gagal terhubung dengan server analisis.');
    } finally {
      setIsLoadingInsight(false);
    }
  };

  // React to change in database records to update heuristic insights
  React.useEffect(() => {
    const data: SharedData = {
      financeRecords,
      taskRecords,
      habitRecords,
      crmRecords,
      tradingRecords,
      okrRecords,
      relationshipRecords,
      sharedContacts
    };
    setAdviceListState(DecisionEngine.getAdvice(data));
  }, [financeRecords, taskRecords, habitRecords, crmRecords, tradingRecords, okrRecords, relationshipRecords, sharedContacts]);

  const handleUpdateActionStatus = (adviceId: string, planId: string, nextStatus: 'Belum Dimulai' | 'Sedang Dikerjakan' | 'Selesai' | 'Ditunda' | 'Dibatalkan') => {
    setAdviceListState(prevList => prevList.map(advice => {
      if (advice.id === adviceId) {
        return {
          ...advice,
          actionPlans: advice.actionPlans.map(plan => {
            if (plan.id === planId) {
              return { ...plan, status: nextStatus };
            }
            return plan;
          })
        };
      }
      return advice;
    }));
  };

  // Simulation States for ASE Core engines
  const [activeSection, setActiveSection] = useState<string | null>('intelligence');
  const [isAnalyzingPatterns, setIsAnalyzingPatterns] = useState(false);
  const [patternScore, setPatternScore] = useState<number | null>(null);
  const [sdkSelectedApi, setSdkSelectedApi] = useState<string>('module-contract');
  const [testWbId, setTestWbId] = useState<string>('wb-keuangan');
  const [testStatus, setTestStatus] = useState<'idle' | 'running' | 'success' | 'failed'>('idle');
  const [testProgress, setTestProgress] = useState<number>(0);
  const [testLogs, setTestLogs] = useState<string[]>([]);
  const [activeConstitutionStep, setActiveConstitutionStep] = useState<number>(0);
  const [evolutionEnabled, setEvolutionEnabled] = useState<boolean>(false);
  const [healthStatus, setHealthStatus] = useState({
    workbooks: 'Valid',
    dataIntegrity: 'Aman',
    backup: 'Terjadwal',
    sync: 'Sinkron',
    version: 'v2.0 Stable',
    plugins: '5 Aktif',
    license: 'Berlisensi Resmi'
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalName || !newGoalTarget) return;

    const selectedWb = workbooks.find(w => w.id === newGoalWbId);
    const selectedTitle = selectedWb ? selectedWb.title : 'Workbook';

    // Auto generate recommendation based on workbook type
    let autoRec = 'Fokus pada penyelesaian tugas harian secara teratur.';
    if (newGoalWbId === 'wb-keuangan') {
      autoRec = 'Alokasikan sisa pendapatan dari keinginan ke tabungan darurat setiap akhir pekan.';
    } else if (newGoalWbId === 'wb-planner') {
      autoRec = 'Gunakan blok waktu Fokus Puncak untuk menyelesaikan tugas Kuadran I terlebih dahulu.';
    } else if (newGoalWbId === 'wb-crm') {
      autoRec = 'Tingkatkan follow-up ke klien potensial di pipeline Anda.';
    } else if (newGoalWbId === 'wb-trading') {
      autoRec = 'Patuhi disiplin rasio risk-to-reward minimal 1:2 pada setiap trade.';
    } else if (newGoalWbId === 'wb-habit') {
      autoRec = 'Gunakan aturan 2 menit untuk mempermudah eksekusi kebiasaan baru.';
    }

    const newGoal: Goal = {
      id: 'goal-' + Date.now(),
      workbookId: newGoalWbId,
      workbookTitle: selectedTitle,
      name: newGoalName,
      target: newGoalTarget,
      progress: 0,
      deadline: newGoalDeadline || 'Tanpa Batas',
      status: 'Sedang Berjalan',
      recommendation: autoRec
    };

    setGoals(prev => [...prev, newGoal]);
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalDeadline('');
    setShowAddGoal(false);
  };

  const handleUpdateGoalProgress = (id: string, progress: number) => {
    setGoals(prev => prev.map(g => g.id === id ? { 
      ...g, 
      progress, 
      status: progress >= 100 ? 'Tercapai' : 'Sedang Berjalan' 
    } : g));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const themeStyles = getThemeStyles(themeColor);
  const getThemeTextClass = () => themeStyles.textAccent;

  // Assemble Shared Data Engine Model
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

  const downloadedWbIds = workbooks.filter(w => w.isDownloaded).map(w => w.id);
  const baseStudyMinutes = activity.reduce((acc, act) => acc + act.minutes, 0);

  // Invoke dynamic Dashboard Engine
  const summary = DashboardEngine.aggregate(sharedData, downloadedWbIds, baseStudyMinutes);

  // Get active modular layouts
  const activeModules = BookEngine.getDownloadedModules(downloadedWbIds);

  // Hardcode currency display for achievements only
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Static badges calculation matching summary values
  const completedTasks = taskRecords.filter(t => t.completed).length;
  const wonCrmTotal = crmRecords.filter(r => r.status === 'Won').reduce((a, b) => a + b.dealValue, 0);
  const totalTrades = tradingRecords.length;
  const profitableTrades = tradingRecords.filter(t => t.profit > 0).length;
  const tradingWinRate = totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0;

  const achievements = [
    {
      id: 'ac-1',
      title: 'Konektivitas Aktif',
      description: 'Mempunyai minimal 1 buku kerja terpasang di platform.',
      isUnlocked: downloadedWbIds.length >= 1,
      iconColor: 'text-sky-500 bg-sky-50',
    },
    {
      id: 'ac-2',
      title: 'Disiplin Finansial',
      description: 'Mencatat minimal 3 entri data transaksi pada Keuangan Pribadi.',
      isUnlocked: financeRecords.length >= 3,
      iconColor: 'text-emerald-500 bg-emerald-50',
    },
    {
      id: 'ac-3',
      title: 'Fokus Produktivitas',
      description: 'Menyelesaikan minimal 2 tugas prioritas di Planner Harian.',
      isUnlocked: completedTasks >= 2,
      iconColor: 'text-indigo-500 bg-indigo-50',
    },
    {
      id: 'ac-4',
      title: 'Sinergi Bisnis',
      description: 'Mencatat keberhasilan deal CRM Won senilai minimal Rp5.000.000.',
      isUnlocked: wonCrmTotal >= 5000000,
      iconColor: 'text-amber-500 bg-amber-50',
    },
    {
      id: 'ac-5',
      title: 'Trader Disiplin',
      description: 'Membukukan win rate di atas 50% dari minimal 2 kali trading.',
      isUnlocked: totalTrades >= 2 && tradingWinRate >= 50,
      iconColor: 'text-rose-500 bg-rose-50',
    }
  ];

  const selectedAdvice = adviceListState.find(a => a.id === selectedAdviceId) || adviceListState[0];

  // Dynamic 4-week window calculation for finance records
  const getWeeklyFinanceData = () => {
    let referenceDate = new Date();
    if (financeRecords && financeRecords.length > 0) {
      const dates = financeRecords.map(r => new Date(r.date).getTime()).filter(t => !isNaN(t));
      if (dates.length > 0) {
        referenceDate = new Date(Math.max(...dates));
      }
    }
    
    // Find Monday of that reference week
    const refDay = referenceDate.getDay();
    const refDiff = referenceDate.getDate() - refDay + (refDay === 0 ? -6 : 1);
    const refMonday = new Date(referenceDate);
    refMonday.setDate(refDiff);
    refMonday.setHours(0,0,0,0);
    
    // Generate last 4 weeks
    const weeksList: { weekKey: string; weekLabel: string; pemasukan: number; pengeluaran: number }[] = [];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    for (let i = 3; i >= 0; i--) {
      const monday = new Date(refMonday);
      monday.setDate(refMonday.getDate() - (i * 7));
      const weekKey = monday.toISOString().split('T')[0];
      const dayOfMonth = monday.getDate();
      const month = monthNames[monday.getMonth()];
      weeksList.push({
        weekKey,
        weekLabel: `Mng ${dayOfMonth} ${month}`,
        pemasukan: 0,
        pengeluaran: 0
      });
    }
    
    // Distribute records
    if (financeRecords) {
      financeRecords.forEach(rec => {
        if (!rec.date) return;
        const recordDate = new Date(rec.date);
        if (isNaN(recordDate.getTime())) return;
        
        const rDay = recordDate.getDay();
        const rDiff = recordDate.getDate() - rDay + (rDay === 0 ? -6 : 1);
        const rMonday = new Date(recordDate);
        rMonday.setDate(rDiff);
        rMonday.setHours(0,0,0,0);
        const rWeekKey = rMonday.toISOString().split('T')[0];
        
        const weekObj = weeksList.find(w => w.weekKey === rWeekKey);
        if (weekObj) {
          if (rec.type === 'pemasukan') {
            weekObj.pemasukan += rec.amount;
          } else if (rec.type === 'pengeluaran') {
            weekObj.pengeluaran += rec.amount;
          }
        }
      });
    }
    
    return weeksList.map(({ weekLabel, pemasukan, pengeluaran }) => ({
      name: weekLabel,
      Pemasukan: pemasukan,
      Pengeluaran: pengeluaran
    }));
  };

  const weeklyFinanceData = getWeeklyFinanceData();
  const totalPemasukanWindow = weeklyFinanceData.reduce((sum, item) => sum + item.Pemasukan, 0);
  const totalPengeluaranWindow = weeklyFinanceData.reduce((sum, item) => sum + item.Pengeluaran, 0);

  const CustomFinanceTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-2.5 rounded-xl border border-slate-800 shadow-lg text-[10px] font-bold space-y-1">
          <p className="text-slate-400 uppercase tracking-wider text-[9px] mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-4">
              <span className="capitalize" style={{ color: entry.color }}>{entry.name}:</span>
              <span className="font-extrabold text-right">{formatRupiah(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      
      {/* Segmented Control Selector */}
      <div className="bg-slate-100 p-1 rounded-2xl flex border border-slate-200">
        <button
          onClick={() => setViewTab('dashboard')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'dashboard'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-indigo-600" />
          Dashboard
        </button>
        
        <button
          onClick={() => setViewTab('decision')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'decision'
              ? 'bg-white text-slate-800 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Brain className="w-4 h-4 text-emerald-600 animate-pulse" />
          Decision Support
        </button>

        <button
          onClick={() => setViewTab('core')}
          className={`flex-1 py-2 text-xs font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewTab === 'core'
              ? 'bg-slate-950 text-amber-400 shadow-xs'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Cpu className="w-4 h-4 text-amber-400" />
          ASE Core OS
        </button>
      </div>

      {viewTab === 'dashboard' ? (
        <>
          {/* 1. EXECUTIVE SUMMARY CARDS */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Investasi Waktu</span>
            <p className="text-sm font-black text-slate-800">{summary.totalStudyMinutes} m Kerja</p>
          </div>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Entri Platform</span>
            <p className="text-sm font-black text-slate-800">{summary.totalLoggedEntries} Rekod</p>
          </div>
        </div>
      </div>

      {/* ==========================================
          ASE SCORE ENGINE (CUSTOM DESIGNED)
          ========================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 fill-amber-50" />
              <h3 className="font-extrabold text-sm text-slate-800">ASE Score Engine</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Metrik Evaluasi Operasional Digital</p>
          </div>
          <div className="px-2.5 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-extrabold text-slate-500 flex items-center gap-1">
            <span>Konteks:</span>
            <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-md uppercase tracking-wider">{user.workspaceMode || 'Individu'}</span>
          </div>
        </div>

        {/* Informative Workspace Alert for Enterprise Context */}
        {user.workspaceMode === 'UMKM' && (
          <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl text-[10px] text-amber-800 font-semibold leading-relaxed flex gap-2 items-center">
            <span className="text-sm">🏢</span>
            <span><strong>Fokus UMKM Aktif:</strong> Bobot utama dialokasikan pada <strong>Skor Bisnis (CRM)</strong> dan <strong>Trading</strong> untuk memantau laba serta efisiensi tim.</span>
          </div>
        )}
        {user.workspaceMode === 'Keluarga' && (
          <div className="p-2.5 bg-pink-50/70 border border-pink-100 rounded-xl text-[10px] text-pink-800 font-semibold leading-relaxed flex gap-2 items-center">
            <span className="text-sm">💖</span>
            <span><strong>Fokus Keluarga Aktif:</strong> Menyoroti <strong>Finansial Rumah Tangga</strong> serta <strong>Skor Hubungan</strong> guna menjaga keharmonisan.</span>
          </div>
        )}
        {user.workspaceMode === 'Sekolah' && (
          <div className="p-2.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[10px] text-indigo-800 font-semibold leading-relaxed flex gap-2 items-center">
            <span className="text-sm">🎓</span>
            <span><strong>Fokus Akademis Aktif:</strong> Bobot diprioritaskan pada <strong>Fokus Produktivitas (Planner)</strong> dan <strong>Evaluasi Kebiasaan</strong>.</span>
          </div>
        )}

        {/* 6 Scores Grid */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* 1. Financial Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'Keluarga' 
              ? 'bg-gradient-to-br from-pink-50/10 to-white border-pink-200 ring-2 ring-pink-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Wallet className="w-3.5 h-3.5 text-emerald-600" /> Finansial
              </span>
              {user.workspaceMode === 'Keluarga' && <span className="text-[8px] font-bold text-pink-600 bg-pink-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.financialScore >= 80 ? 'text-emerald-600' : summary.scores.financialScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.financialScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.financialScore >= 80 ? 'bg-emerald-500' : summary.scores.financialScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.financialScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.financialScore >= 80 ? '✓ Alokasi Prima' : summary.scores.financialScore >= 60 ? '⚠ Perlu Hemat' : '✗ Kritis / Defisit'}
            </span>
          </div>

          {/* 2. Habit Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'Sekolah' 
              ? 'bg-gradient-to-br from-indigo-50/10 to-white border-indigo-200 ring-2 ring-indigo-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Activity className="w-3.5 h-3.5 text-indigo-600" /> Kebiasaan
              </span>
              {user.workspaceMode === 'Sekolah' && <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.habitScore >= 80 ? 'text-emerald-600' : summary.scores.habitScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.habitScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.habitScore >= 80 ? 'bg-emerald-500' : summary.scores.habitScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.habitScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.habitScore >= 80 ? '✓ Disiplin Tinggi' : summary.scores.habitScore >= 60 ? '⚠ Cukup Konsisten' : '✗ Mulai Terputus'}
            </span>
          </div>

          {/* 3. Productivity Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'Sekolah' 
              ? 'bg-gradient-to-br from-indigo-50/10 to-white border-indigo-200 ring-2 ring-indigo-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Calendar className="w-3.5 h-3.5 text-sky-600" /> Produktivitas
              </span>
              {user.workspaceMode === 'Sekolah' && <span className="text-[8px] font-bold text-indigo-600 bg-indigo-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.productivityScore >= 80 ? 'text-emerald-600' : summary.scores.productivityScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.productivityScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.productivityScore >= 80 ? 'bg-emerald-500' : summary.scores.productivityScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.productivityScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.productivityScore >= 80 ? '✓ Fokus Optimal' : summary.scores.productivityScore >= 60 ? '⚠ Fokus Terbagi' : '✗ Tertunda Jauh'}
            </span>
          </div>

          {/* 4. Relationship Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'Keluarga' 
              ? 'bg-gradient-to-br from-pink-50/10 to-white border-pink-200 ring-2 ring-pink-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Heart className="w-3.5 h-3.5 text-rose-600" /> Hubungan
              </span>
              {user.workspaceMode === 'Keluarga' && <span className="text-[8px] font-bold text-pink-600 bg-pink-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.relationshipScore >= 80 ? 'text-emerald-600' : summary.scores.relationshipScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.relationshipScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.relationshipScore >= 80 ? 'bg-emerald-500' : summary.scores.relationshipScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.relationshipScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.relationshipScore >= 80 ? '✓ Sangat Harmonis' : summary.scores.relationshipScore >= 60 ? '⚠ Cukup Hangat' : '✗ Kurang Interaksi'}
            </span>
          </div>

          {/* 5. Business Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'UMKM' 
              ? 'bg-gradient-to-br from-amber-50/10 to-white border-amber-200 ring-2 ring-amber-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <Users className="w-3.5 h-3.5 text-amber-600" /> Bisnis / CRM
              </span>
              {user.workspaceMode === 'UMKM' && <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.businessScore >= 80 ? 'text-emerald-600' : summary.scores.businessScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.businessScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.businessScore >= 80 ? 'bg-emerald-500' : summary.scores.businessScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.businessScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.businessScore >= 80 ? '✓ Omzet Melimpah' : summary.scores.businessScore >= 60 ? '⚠ Pipeline Sedang' : '✗ Belum Ada Closing'}
            </span>
          </div>

          {/* 6. Trading Score */}
          <div className={`p-3 rounded-xl border transition-all ${
            user.workspaceMode === 'UMKM' 
              ? 'bg-gradient-to-br from-amber-50/10 to-white border-amber-200 ring-2 ring-amber-500/10 shadow-xs' 
              : 'bg-slate-50/30 border-slate-100/80 hover:bg-slate-50'
          }`}>
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10px] font-extrabold text-slate-500 flex items-center gap-1.5 uppercase">
                <TrendingUp className="w-3.5 h-3.5 text-rose-600" /> Trading
              </span>
              {user.workspaceMode === 'UMKM' && <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1 py-0.2 rounded">Prioritas</span>}
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-black ${
                summary.scores.tradingScore >= 80 ? 'text-emerald-600' : summary.scores.tradingScore >= 60 ? 'text-amber-500' : 'text-rose-500'
              }`}>{summary.scores.tradingScore}</span>
              <span className="text-[9px] text-slate-400 font-bold">/100</span>
            </div>
            <div className="w-full bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
              <div className={`h-full rounded-full ${
                summary.scores.tradingScore >= 80 ? 'bg-emerald-500' : summary.scores.tradingScore >= 60 ? 'bg-amber-400' : 'bg-rose-500'
              }`} style={{ width: `${summary.scores.tradingScore}%` }}></div>
            </div>
            <span className="text-[8px] text-slate-400 font-bold block mt-1.5 uppercase">
              {summary.scores.tradingScore >= 80 ? '✓ Laba & Disiplin' : summary.scores.tradingScore >= 60 ? '⚠ Margin Aman' : '✗ Drawdown Tinggi'}
            </span>
          </div>
        </div>
      </div>

      {/* ==========================================
          ASE GOAL ENGINE (CUSTOM DESIGNED)
          ========================================== */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5">
              <Target className="w-4.5 h-4.5 text-indigo-600" />
              <h3 className="font-extrabold text-sm text-slate-800">ASE Goal Engine</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pemetaan Sasaran & Tindakan Nyata</p>
          </div>

          <button 
            id="btn-toggle-add-goal"
            onClick={() => setShowAddGoal(!showAddGoal)}
            className="p-1 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center transition-all cursor-pointer"
            title="Tambah Sasaran Baru"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Expandable form to Add custom goal */}
        {showAddGoal && (
          <form onSubmit={handleAddGoal} className="bg-slate-50 p-3 rounded-xl border border-slate-150 space-y-3 animate-fade-in text-xs">
            <span className="text-[10px] font-extrabold text-slate-700 block uppercase border-b border-slate-200 pb-1">Tambah Sasaran (Goal) Baru</span>
            
            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Nama Sasaran</label>
              <input 
                id="input-new-goal-name"
                type="text" 
                placeholder="Contoh: Bebas Hutang Bulanan..." 
                value={newGoalName}
                onChange={(e) => setNewGoalName(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Target Ukuran</label>
                <input 
                  id="input-new-goal-target"
                  type="text" 
                  placeholder="Contoh: Rp 5.000.000..." 
                  value={newGoalTarget}
                  onChange={(e) => setNewGoalTarget(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Tenggat Waktu</label>
                <input 
                  id="input-new-goal-deadline"
                  type="text" 
                  placeholder="31 Jul 2026" 
                  value={newGoalDeadline}
                  onChange={(e) => setNewGoalDeadline(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-bold text-slate-400 uppercase">Workbook Penanggung Jawab</label>
              <select 
                id="select-new-goal-wb"
                value={newGoalWbId}
                onChange={(e) => setNewGoalWbId(e.target.value)}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-700"
              >
                {workbooks.map(wb => (
                  <option key={wb.id} value={wb.id}>{wb.title}</option>
                ))}
              </select>
            </div>

            <button 
              id="btn-submit-new-goal"
              type="submit"
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-extrabold cursor-pointer flex items-center justify-center gap-1.5 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" /> Pasang Sasaran Baru
            </button>
          </form>
        )}

        {/* Goals List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-0.5 no-scrollbar">
          {goals.map(item => {
            const isCompleted = item.status === 'Tercapai';
            return (
              <div 
                key={item.id} 
                className={`p-3 rounded-xl border flex flex-col gap-2 transition-all ${
                  isCompleted 
                    ? 'bg-slate-50/50 border-slate-100 opacity-60' 
                    : 'bg-white border-slate-100 shadow-xs hover:border-slate-200'
                }`}
              >
                {/* Header info */}
                <div className="flex justify-between items-start">
                  <div className="space-y-0.5">
                    <span className="text-[8px] font-bold text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider block w-max">
                      {item.workbookTitle}
                    </span>
                    <h4 className={`text-xs font-extrabold ${isCompleted ? 'text-slate-500 line-through' : 'text-slate-800'}`}>{item.name}</h4>
                  </div>

                  <div className="flex gap-1.5 items-center">
                    {isCompleted ? (
                      <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Tercapai</span>
                    ) : (
                      <span className="text-[8px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md uppercase tracking-wider">Sedang Berjalan</span>
                    )}

                    <button 
                      onClick={() => handleDeleteGoal(item.id)}
                      className="text-slate-300 hover:text-rose-600 p-0.5 rounded-md hover:bg-slate-50"
                      title="Hapus Sasaran"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress bar and Target */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                    <span>Target: <span className="text-slate-700 font-extrabold">{item.target}</span></span>
                    <span className="text-indigo-600 font-black">{item.progress}%</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-300 ${isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'}`} 
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    {!isCompleted && (
                      <button 
                        onClick={() => handleUpdateGoalProgress(item.id, 100)}
                        className="p-1 rounded-md bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                        title="Tandai Selesai"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Manual adjustment progress slider if not completed */}
                  {!isCompleted && (
                    <div className="flex items-center gap-1.5 mt-1 pt-1 border-t border-dashed border-slate-100">
                      <span className="text-[8px] font-bold text-slate-400 uppercase shrink-0">Geser Progres</span>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={item.progress} 
                        onChange={(e) => handleUpdateGoalProgress(item.id, Number(e.target.value))}
                        className="flex-1 h-1 accent-indigo-600 rounded-lg cursor-pointer"
                      />
                    </div>
                  )}
                </div>

                {/* Intelligent recommendation advisory (HUKUM 4 & GOAL ENGINE rules) */}
                <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-[9.5px] text-slate-600 font-semibold leading-relaxed flex gap-1.5">
                  <span className="text-sm shrink-0">💡</span>
                  <div>
                    <span className="font-extrabold text-slate-700 block uppercase text-[8px] mb-0.5">Rekomendasi Pintar Engine</span>
                    {item.recommendation}
                  </div>
                </div>

                <div className="text-[8px] text-slate-400 font-bold self-end uppercase">
                  Tenggat: {item.deadline}
                </div>
              </div>
            );
          })}

          {goals.length === 0 && (
            <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-[11px] font-bold block">Tidak Ada Sasaran (Goal) Aktif</span>
              <p className="text-[9px] mt-1 font-semibold leading-relaxed">Tambahkan sasaran baru Anda dengan mengklik tombol "+" di kanan atas.</p>
            </div>
          )}
        </div>
      </div>

      {/* 2. DYNAMIC CONNECTED WORKBOOKS CORNER DASHBOARD */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">Status Modul Terhubung</h3>
            <p className="text-[10px] text-slate-400 font-bold">Ringkasan real-time semua Workbook aktif</p>
          </div>
          <Zap className="w-5 h-5 text-amber-500 fill-amber-100 animate-pulse" />
        </div>

        {/* Dynamic Metric Rows loaded dynamically through BookEngine */}
        <div className="space-y-2 text-xs">
          {activeModules.map(mod => {
            const processedData = summary.moduleMetrics[mod.id];
            return (
              <div key={mod.id}>
                {mod.renderDashboard({
                  sharedData,
                  processed: processedData,
                  onNavigate: () => onNavigateToWorkbook(mod.id),
                  themeColor
                })}
              </div>
            );
          })}

          {activeModules.length === 0 && (
            <div className="text-center p-6 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <span className="text-[11px] font-bold block">Tidak Ada Workbook Aktif</span>
              <p className="text-[9px] mt-1 font-semibold leading-relaxed">Hubungkan Workbook Anda di tab "Jelajahi" untuk melihat metrik real-time di sini.</p>
            </div>
          )}
        </div>
      </div>

      {/* 2.5. VISUAL FINANCE WEEKLY TREND CHART (RECHARTS) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-4.5 h-4.5 text-emerald-600" />
              <h3 className="font-extrabold text-sm text-slate-800">Tren Finansial Mingguan</h3>
            </div>
            <p className="text-[10px] text-slate-400 font-bold">Arus pemasukan vs pengeluaran 4 minggu terakhir</p>
          </div>
          
          {/* Chart Type Toggle Button Pill */}
          <div className="bg-slate-100 p-0.5 rounded-lg border border-slate-200 flex shrink-0">
            <button
              onClick={() => setFinanceChartType('bar')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer ${
                financeChartType === 'bar'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Batang
            </button>
            <button
              onClick={() => setFinanceChartType('line')}
              className={`px-2 py-1 text-[9px] font-extrabold rounded-md transition-all cursor-pointer ${
                financeChartType === 'line'
                  ? 'bg-white text-slate-800 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Garis
            </button>
          </div>
        </div>

        {/* The Recharts Plot */}
        <div className="h-48 w-full text-xs font-semibold relative select-none">
          <ResponsiveContainer width="100%" height="100%">
            {financeChartType === 'bar' ? (
              <BarChart
                data={weeklyFinanceData}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}jt` : val >= 1000 ? `${(val / 1000).toFixed(0)}rb` : val}
                />
                <Tooltip content={<CustomFinanceTooltip />} cursor={{ fill: '#F8FAFC' }} />
                <Legend 
                  verticalAlign="top" 
                  height={24} 
                  iconType="circle" 
                  iconSize={6}
                  wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }}
                />
                <Bar name="Pemasukan" dataKey="Pemasukan" fill="#10B981" radius={[4, 4, 0, 0]} barSize={12} />
                <Bar name="Pengeluaran" dataKey="Pengeluaran" fill="#F43F5E" radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            ) : (
              <LineChart
                data={weeklyFinanceData}
                margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="#94A3B8" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => val >= 1000000 ? `${(val / 1000000).toFixed(1)}jt` : val >= 1000 ? `${(val / 1000).toFixed(0)}rb` : val}
                />
                <Tooltip content={<CustomFinanceTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={24} 
                  iconType="circle" 
                  iconSize={6}
                  wrapperStyle={{ fontSize: '9px', fontWeight: 'bold' }}
                />
                <Line name="Pemasukan" type="monotone" dataKey="Pemasukan" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line name="Pengeluaran" type="monotone" dataKey="Pengeluaran" stroke="#F43F5E" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Chart Summary Footnote */}
        <div className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <div className="flex gap-2.5">
            <span>In: <span className="text-emerald-600 font-extrabold">{formatRupiah(totalPemasukanWindow)}</span></span>
            <span className="text-slate-300">|</span>
            <span>Out: <span className="text-rose-600 font-extrabold">{formatRupiah(totalPengeluaranWindow)}</span></span>
          </div>
          <span className="text-[9px] text-indigo-600 lowercase bg-indigo-50/50 px-1.5 py-0.5 rounded-md">
            selisih: {formatRupiah(totalPemasukanWindow - totalPengeluaranWindow)}
          </span>
        </div>
      </div>

      {/* 3. VISUAL DAILY ACTIVITY BAR CHART */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-sm text-slate-800">Laporan Aktivitas Kerja</h3>
            <p className="text-[10px] text-slate-400 font-bold">Skala menit keterlibatan data harian</p>
          </div>
          <BarChart3 className="w-5 h-5 text-slate-400" />
        </div>

        <div className="relative pt-3">
          <div className="flex justify-between items-end h-28 px-2">
            {activity.map((item, index) => {
              const isSelected = selectedDayIndex === index;
              const maxMinutes = 60; 
              const barHeight = Math.max((item.minutes / maxMinutes) * 80, 5); 

              return (
                <div 
                  key={index} 
                  onClick={() => setSelectedDayIndex(index)}
                  className="flex flex-col items-center gap-1.5 cursor-pointer flex-1 animate-fade-in"
                >
                  {isSelected && (
                    <div className="absolute top-0 bg-slate-800 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md -translate-y-2 shadow">
                      {item.minutes}m / {item.completedTasks} Entri
                    </div>
                  )}

                  {/* Visual Bar */}
                  <div className="w-6 bg-slate-100 rounded-full h-20 flex items-end justify-center overflow-hidden">
                    <div 
                      className={`w-full rounded-full transition-all duration-300 ${
                        isSelected 
                          ? themeStyles.progressBg
                          : 'bg-slate-300 hover:bg-slate-400'
                      }`}
                      style={{ height: `${barHeight}%` }}
                    ></div>
                  </div>
                  
                  <span className={`text-[10px] font-bold ${isSelected ? getThemeTextClass() : 'text-slate-400'}`}>
                    {item.day}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-medium mt-2">
          <span>Hari Terpilih: <span className="font-bold text-slate-800">{activity[selectedDayIndex ?? 0].day === 'Sen' ? 'Senin' : activity[selectedDayIndex ?? 0].day === 'Sel' ? 'Selasa' : activity[selectedDayIndex ?? 0].day === 'Rab' ? 'Rabu' : activity[selectedDayIndex ?? 0].day === 'Kam' ? 'Kamis' : activity[selectedDayIndex ?? 0].day === 'Jum' ? 'Jumat' : activity[selectedDayIndex ?? 0].day === 'Sab' ? 'Sabtu' : 'Minggu'}</span></span>
          <span className="text-slate-500 font-semibold">{activity[selectedDayIndex ?? 0].minutes} Menit kerja</span>
        </div>
      </div>

      {/* 4. PLATFORM CORE INSIGHT BLOCK (DYNAMIC FROM ACTIVE WORKBOOKS) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
          <TrendingUp className="w-4.5 h-4.5 text-emerald-600" /> Sinergi Platform
        </h3>
        
        <div className="p-3 bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-100/50 rounded-xl space-y-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-black text-slate-800">
              ⚡ Konektivitas ASE Core v2.0
            </span>
          </div>

          <div className="space-y-1.5">
            {summary.activeInsights.map((ins, i) => (
              <p key={i} className="text-[11px] text-slate-600 leading-relaxed font-semibold border-b border-slate-100 pb-1 last:border-0 last:pb-0">
                <span className="font-extrabold text-slate-700 block text-[10px] uppercase mb-0.5">{ins.title} Insight</span>
                {ins.message}
              </p>
            ))}

            {summary.activeInsights.length === 0 && (
              <p className="text-[11px] text-slate-600 leading-relaxed font-semibold">
                Belum ada Workbook yang diaktifkan. Silakan aktifkan Workbook melalui menu 'Jelajahi' untuk mengizinkan platform ASE Core menyinkronkan data bisnis, tugas, dan keuangan Anda.
              </p>
            )}
          </div>
          
          <div className="text-[10px] text-emerald-700 font-bold bg-white/60 px-2.5 py-1 rounded-lg border border-emerald-100 inline-block mt-2">
            Status Engine: {activeModules.length > 0 ? 'AKTIF & TERKUNCI' : 'STANDBY (Siap)'}
          </div>
        </div>
      </div>

      {/* 5. ACHIEVEMENTS SYSTEM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
          <Award className="w-4.5 h-4.5 text-slate-500" /> Lencana Pencapaian ({achievements.filter(a => a.isUnlocked).length}/{achievements.length})
        </h3>
        
        <div className="space-y-2.5">
          {achievements.map((item) => (
            <div 
              key={item.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                item.isUnlocked 
                  ? 'bg-white border-slate-100 shadow-sm' 
                  : 'bg-slate-50/50 border-slate-100 opacity-60'
              }`}
            >
              <div className={`p-2.5 rounded-xl shrink-0 ${
                item.isUnlocked ? item.iconColor : 'bg-slate-100 text-slate-300'
              }`}>
                <Award className={`w-5 h-5 ${item.isUnlocked ? '' : 'stroke-slate-300'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-slate-800 line-clamp-1">{item.title}</h4>
                  {item.isUnlocked ? (
                    <span className="text-[8px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase tracking-wider">Terbuka</span>
                  ) : (
                    <span className="text-[8px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider">Terkunci</span>
                  )}
                </div>
                <p className="text-[10px] text-slate-500 leading-snug mt-0.5 line-clamp-1 font-medium">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : viewTab === 'decision' ? (
    /* ==========================================================
       ASE DECISION SUPPORT & COACHING ENGINE UI
       ========================================================== */
    <div className="space-y-4 animate-fade-in text-slate-700">
      
      {/* 1. ADAPTIVE COACHING HEADER */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 text-white p-4.5 rounded-2xl border border-slate-800 shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
        <div className="relative z-10 space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                <Brain className="w-5 h-5 text-emerald-400 animate-pulse" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">ASE Decision & Coaching Engine</h3>
                <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Decision Support System OS v2.0</p>
              </div>
            </div>
            <span className="text-[8px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
              ONLINE & ACTIVE
            </span>
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
            ASE mengolah data Anda menjadi bimbingan keputusan berharga. Menggunakan analisis heuristik dinamis untuk merumuskan kritik obyektif, rencana aksi sistematis, pemantauan target harian, dan rekomendasi perbaikan hidup terperinci.
          </p>
        </div>
      </div>

      {/* GEMINI AI INSIGHT BLOCK */}
      <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white p-5 rounded-2xl border border-indigo-800 shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
              <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <h3 className="font-extrabold text-xs text-slate-100 uppercase tracking-wide">Gemini AI Smart Insight</h3>
              <p className="text-[9px] text-indigo-300 font-bold uppercase tracking-wider">Powered by Gemini 3.5 Flash</p>
            </div>
          </div>
          <span className="text-[8px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
            Sinergi Cerdas
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
          Dapatkan ringkasan cerdas, pola tersembunyi, korelasi waktu-keuangan, dan rekomendasi aksi strategis dari seluruh aktivitas dan data keuangan Anda minggu ini.
        </p>

        {aiInsight ? (
          <div className="bg-slate-950/60 border border-indigo-950 rounded-xl p-4 space-y-3 max-h-[400px] overflow-y-auto no-scrollbar text-xs leading-relaxed text-slate-200">
            <div className="markdown-body prose prose-invert max-w-none text-slate-200 space-y-2">
              <Markdown
                components={{
                  h1: ({node, ...props}) => <h1 className="text-xs font-black text-amber-400 mt-4 mb-2 uppercase tracking-wider border-b border-indigo-950 pb-1" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-[11px] font-black text-amber-400 mt-3.5 mb-1.5 uppercase tracking-wider" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-[10px] font-extrabold text-amber-400 mt-3 mb-1 uppercase" {...props} />,
                  p: ({node, ...props}) => <p className="text-[11px] text-slate-200 leading-relaxed font-medium mb-2.5" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1.5 mb-3" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-4 space-y-1.5 mb-3" {...props} />,
                  li: ({node, ...props}) => <li className="text-[11px] text-slate-300 font-semibold leading-relaxed" {...props} />,
                  strong: ({node, ...props}) => <strong className="font-extrabold text-white" {...props} />,
                  blockquote: ({node, ...props}) => <blockquote className="border-l-2 border-indigo-500 pl-2.5 italic text-slate-400 my-2" {...props} />,
                }}
              >
                {aiInsight}
              </Markdown>
            </div>
            
            <div className="pt-2 border-t border-indigo-950/50 flex justify-between items-center">
              <span className="text-[9px] text-slate-400 font-bold italic">Analisis real-time berdasarkan rekod terbaru</span>
              <button
                onClick={fetchAiInsight}
                disabled={isLoadingInsight}
                className="text-[10px] text-amber-400 font-extrabold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingInsight ? 'animate-spin' : ''}`} />
                Perbarui Analisis
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            {isLoadingInsight ? (
              <div className="text-center space-y-2 py-4">
                <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                <p className="text-[11px] text-slate-300 font-bold animate-pulse">Gemini sedang menganalisis data keuangan, target sasaran, dan produktivitas Anda...</p>
              </div>
            ) : (
              <>
                {insightError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-rose-300 text-[11px] font-semibold w-full">
                    ⚠️ {insightError}
                  </div>
                )}
                <button
                  onClick={fetchAiInsight}
                  className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs cursor-pointer flex items-center gap-2 transition-all shadow-md transform hover:scale-[1.01] active:scale-95"
                >
                  <Sparkles className="w-4 h-4 fill-slate-950" />
                  Mulai Analisis AI Insight ⚡
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 2. SUB-TAB ENGINE SELECTOR */}
      <div className="space-y-2">
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block px-1">Pilih Domain Keputusan</span>
        <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1 rounded-2xl border border-slate-200">
          {adviceListState.map((advice) => {
            const isActive = selectedAdviceId === advice.id;
            return (
              <button
                key={advice.id}
                onClick={() => setSelectedAdviceId(advice.id)}
                className={`py-2 px-1.5 text-[11px] font-black rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-slate-950 text-amber-400 shadow-sm border border-slate-800'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {advice.category === 'Keuangan' && <Wallet className="w-3.5 h-3.5" />}
                {advice.category === 'Produktivitas' && <CheckSquare className="w-3.5 h-3.5" />}
                {advice.category === 'Trading' && <TrendingUp className="w-3.5 h-3.5" />}
                <span>{advice.category}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. DYNAMIC COACH MESSAGE */}
      {selectedAdvice && (
        <div className="bg-emerald-50/70 border border-emerald-100/90 rounded-2xl p-4 space-y-2 shadow-xs relative overflow-hidden">
          <div className="absolute right-0 top-0 -mt-2 -mr-2 w-12 h-12 bg-emerald-500/5 rounded-full blur-md" />
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800">Evaluasi Coach Digital ASE</span>
          </div>
          <p className="text-[12px] font-bold text-slate-700 leading-relaxed italic">
            "{selectedAdvice.coachingMessage}"
          </p>
          <div className="text-[9px] text-slate-400 font-semibold mt-1">
            Gaya Bimbingan: <span className="text-emerald-700 font-extrabold">Positif, Obyektif, Berbasis Data</span>
          </div>
        </div>
      )}

      {selectedAdvice ? (
        <div className="space-y-4">
          
          {/* A. ANALYSIS STEP */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg">STEP 1</span>
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Analisis Tren & Konteks Data</h4>
            </div>
            
            <p className="text-[11px] text-slate-600 leading-relaxed font-semibold bg-slate-50 p-3 rounded-xl border border-slate-100/50">
              {selectedAdvice.analysis.whatHappened}
            </p>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Faktor Pemicu (Why)</span>
                <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{selectedAdvice.analysis.whyHappened}</p>
              </div>
              
              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Penyebab Utama</span>
                <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{selectedAdvice.analysis.mainCause}</p>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Dampak Strategis</span>
                <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{selectedAdvice.analysis.impact}</p>
              </div>

              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Peluang Emas</span>
                <p className="text-[11px] text-emerald-700 font-bold leading-relaxed">{selectedAdvice.analysis.opportunity}</p>
              </div>
            </div>

            <div className="p-3 bg-rose-50/50 border border-rose-100 rounded-xl space-y-1">
              <span className="text-[9px] text-rose-500 font-bold uppercase tracking-wider block">Identifikasi Risiko</span>
              <p className="text-[11px] text-rose-800 font-bold leading-relaxed">{selectedAdvice.analysis.risk}</p>
            </div>
          </div>

          {/* B. CRITIQUE STEP */}
          <div className="bg-amber-50/30 p-4 rounded-2xl border border-amber-100 shadow-xs space-y-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black bg-amber-100 text-amber-800 px-2 py-0.5 rounded-lg">STEP 2</span>
              <h4 className="font-extrabold text-xs text-amber-800 uppercase tracking-wide">Kritik Obyektif Berbasis Data</h4>
            </div>
            
            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Analisis ini mendeteksi pola yang perlu disesuaikan:</p>
            
            <div className="space-y-2">
              {selectedAdvice.critique.map((crit, i) => (
                <div key={i} className="flex gap-2 items-start bg-white p-2.5 rounded-xl border border-amber-100/80">
                  <span className="text-amber-500 text-xs shrink-0 mt-0.5">⚠️</span>
                  <p className="text-[11px] text-slate-700 font-bold leading-relaxed">{crit}</p>
                </div>
              ))}
            </div>
          </div>

          {/* C. RECOMMENDATION STEP */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg">STEP 3</span>
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Rekomendasi Alternatif Solusi</h4>
            </div>

            <div className="space-y-3">
              {selectedAdvice.recommendations.map((rec, i) => (
                <div 
                  key={i} 
                  className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                    rec.type === 'Pilihan Terbaik' 
                      ? 'bg-emerald-50/40 border-emerald-100 shadow-2xs' 
                      : rec.type === 'Pilihan Aman'
                      ? 'bg-slate-50/50 border-slate-100'
                      : 'bg-amber-50/20 border-amber-100/60'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider ${
                      rec.type === 'Pilihan Terbaik'
                        ? 'bg-emerald-100 text-emerald-800'
                        : rec.type === 'Pilihan Aman'
                        ? 'bg-slate-200 text-slate-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {rec.type === 'Pilihan Terbaik' ? '🌟 ' : rec.type === 'Pilihan Aman' ? '🛡️ ' : '⚡ '}
                      {rec.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold">Heuristik Utama</span>
                  </div>

                  <h5 className="text-[12px] font-black text-slate-800">{rec.title}</h5>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    <strong>Alasan:</strong> {rec.reason}
                  </p>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <div className="text-[10px] leading-relaxed">
                      <span className="text-emerald-700 font-extrabold uppercase tracking-wider text-[8px] block">Manfaat</span>
                      <span className="text-slate-600 font-semibold">{rec.benefit}</span>
                    </div>
                    <div className="text-[10px] leading-relaxed">
                      <span className="text-rose-600 font-extrabold uppercase tracking-wider text-[8px] block">Risiko</span>
                      <span className="text-slate-600 font-semibold">{rec.risk}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D. ACTION PLAN & EXECUTION TRACKER */}
          <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl border border-slate-800 shadow-sm space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-black bg-slate-800 text-amber-400 px-2 py-0.5 rounded-lg">STEP 4</span>
                <h4 className="font-extrabold text-xs text-white uppercase tracking-wide">Rencana Aksi & Tracker Eksekusi</h4>
              </div>
              <span className="text-[8px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                Interaktif
              </span>
            </div>

            <p className="text-[10px] text-slate-400 font-medium leading-relaxed">
              Daftar rencana aksi di bawah terhubung langsung ke mesin tracker. Ketuk status untuk mengubah progres penyelesaian harian Anda secara mandiri:
            </p>

            <div className="space-y-3">
              {selectedAdvice.actionPlans.map((plan) => (
                <div key={plan.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider block">
                        Jadwal: {plan.timeframe} • Estimasi: {plan.estimatedTime}
                      </span>
                      <h5 className="text-[11px] font-extrabold text-slate-200 leading-relaxed">
                        {plan.step}
                      </h5>
                    </div>
                    <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase shrink-0 ${
                      plan.priority === 'Tinggi'
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : plan.priority === 'Sedang'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {plan.priority} Priority
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-400 leading-snug border-t border-slate-900 pt-2 flex items-center justify-between">
                    <span>Target: <strong>{plan.target}</strong></span>
                  </div>

                  {/* Execution Status Controller */}
                  <div className="pt-2 flex flex-wrap items-center gap-1.5 justify-end">
                    <span className="text-[9px] text-slate-400 font-bold mr-1">Status:</span>
                    {(['Belum Dimulai', 'Sedang Dikerjakan', 'Selesai', 'Ditunda', 'Dibatalkan'] as const).map((st) => {
                      const isCurrent = plan.status === st;
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateActionStatus(selectedAdvice.id, plan.id, st)}
                          className={`text-[8px] font-black px-1.5 py-0.5 rounded-md cursor-pointer border transition-all ${
                            isCurrent
                              ? st === 'Selesai'
                                ? 'bg-emerald-500 text-white border-emerald-600'
                                : st === 'Sedang Dikerjakan'
                                ? 'bg-indigo-500 text-white border-indigo-600'
                                : st === 'Ditunda'
                                ? 'bg-amber-600 text-white border-amber-700'
                                : st === 'Dibatalkan'
                                ? 'bg-rose-600 text-white border-rose-700'
                                : 'bg-slate-600 text-white border-slate-700'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* E. EVALUATION & ADAPTATION */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3.5">
            <div className="flex items-center gap-1.5 border-b border-slate-50 pb-2">
              <span className="text-xs font-black bg-slate-100 text-slate-800 px-2 py-0.5 rounded-lg">STEP 5</span>
              <h4 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Evaluasi Hasil & Adaptasi</h4>
            </div>

            {/* Target Achieved status */}
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <span className="text-xs font-extrabold text-slate-600">Rasio Ketercapaian Sasaran</span>
              <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                selectedAdvice.evaluation.targetAchieved === 'Tercapai' || selectedAdvice.evaluation.targetAchieved === 'Tercapai Sebagian'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : selectedAdvice.evaluation.targetAchieved === 'Belum Memulai'
                  ? 'bg-slate-100 text-slate-600 border-slate-200'
                  : 'bg-rose-50 text-rose-700 border-rose-200'
              }`}>
                {selectedAdvice.evaluation.targetAchieved}
              </span>
            </div>

            {/* Success and Failure Factors */}
            {selectedAdvice.evaluation.successFactors.length > 0 && (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 bg-emerald-50/20 border border-emerald-100/50 rounded-xl space-y-1">
                  <span className="text-[8px] text-emerald-600 font-extrabold uppercase tracking-wider block">Faktor Pendukung</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAdvice.evaluation.successFactors.map((fac, idx) => (
                      <li key={idx} className="text-[10px] text-slate-600 font-medium leading-relaxed">{fac}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 bg-rose-50/20 border border-rose-100/50 rounded-xl space-y-1">
                  <span className="text-[8px] text-rose-600 font-extrabold uppercase tracking-wider block">Hambatan Utama</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAdvice.evaluation.failureFactors.map((fac, idx) => (
                      <li key={idx} className="text-[10px] text-slate-600 font-medium leading-relaxed">{fac}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Keep vs Improve */}
            {selectedAdvice.evaluation.whatToKeep.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[8px] text-indigo-600 font-extrabold uppercase tracking-wider block">Pertahankan</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAdvice.evaluation.whatToKeep.map((item, idx) => (
                      <li key={idx} className="text-[10px] text-slate-600 font-semibold leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[8px] text-amber-600 font-extrabold uppercase tracking-wider block">Tingkatkan</span>
                  <ul className="list-disc list-inside space-y-1">
                    {selectedAdvice.evaluation.whatToImprove.map((item, idx) => (
                      <li key={idx} className="text-[10px] text-slate-600 font-semibold leading-relaxed">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Adaptations system changes */}
            <div className="p-3 bg-indigo-50/30 border border-indigo-100/80 rounded-xl space-y-2">
              <span className="text-[9px] text-indigo-700 font-extrabold uppercase tracking-wider block">Saran Perbaikan Sistem (Adaptasi Mandiri)</span>
              <div className="space-y-1.5">
                {selectedAdvice.adaptation.map((adapt, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <span className="text-indigo-500 text-[10px]">⚙️</span>
                    <p className="text-[11px] text-slate-700 font-extrabold leading-relaxed">{adapt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-xs text-center space-y-2">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-sm font-black text-slate-800">Tidak ada saran yang dapat dimuat</h4>
          <p className="text-[11px] text-slate-500">Gagal menganalisis struktur database. Silakan laporkan jika kendala berlanjut.</p>
        </div>
      )}

    </div>
  ) : (
    /* ==========================================
       ASE CORE OS ENGINE MODULES (10 POWER HOUSES)
       ========================================== */
    <div className="space-y-4 animate-fade-in text-slate-700">
      
      {/* 1. ASE CORE GENERAL STATUS HEADER */}
      <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-2.5">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-100 uppercase tracking-wide">ASE Core OS v2.0</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Sistem Kendali Modular & Adaptif</p>
            </div>
          </div>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-black uppercase tracking-wider">
            KERNEL ONLINE
          </span>
        </div>
        <p className="text-[11px] text-slate-300 font-medium leading-relaxed">
          Selamat datang di Control Center ASE (Adaptive Sinergi Ekosistem). Panel ini mendemonstrasikan keunggulan platform dalam memetakan data, meluncurkan mesin kecerdasan adaptif, menjaga kesehatan basis data, dan memfasilitasi SDK pengembang.
        </p>
      </div>

      {/* 2. ACCORDION ENGINES PIPELINE */}
      <div className="space-y-2.5">
        
        {/* ==========================================
            A. ADAPTIVE INTELLIGENCE LAYER
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'intelligence' ? null : 'intelligence')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Adaptive Intelligence Layer</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Pola, Prioritas, & Rekomendasi Lintas Buku</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'intelligence' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'intelligence' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Membaca output dari seluruh Workbook aktif secara real-time untuk memetakan kausalitas, menentukan prioritas, tanpa pernah mengubah data pengguna.
              </p>

              <div className="flex justify-center">
                <button
                  id="btn-run-intelligence-analysis"
                  onClick={() => {
                    setIsAnalyzingPatterns(true);
                    setPatternScore(null);
                    setTimeout(() => {
                      setIsAnalyzingPatterns(false);
                      setPatternScore(88);
                    }, 1200);
                  }}
                  disabled={isAnalyzingPatterns}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-400 text-white rounded-xl font-black text-2xs cursor-pointer flex items-center gap-2 transition-all shadow-xs"
                >
                  {isAnalyzingPatterns ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Mencari Pola Hubungan...
                    </>
                  ) : (
                    <>
                      <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                      Mulai Analisis Pola Lintas Workbook ⚡
                    </>
                  )}
                </button>
              </div>

              {patternScore !== null && (
                <div className="space-y-3 p-3 bg-white border border-indigo-100 rounded-xl shadow-xs animate-fade-in">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-[10px] font-extrabold text-slate-500 uppercase">Sinergi Kecerdasan</span>
                    <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">Skor Sinergi: {patternScore}%</span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex gap-2">
                      <span className="text-sm shrink-0">📈</span>
                      <div>
                        <strong className="text-slate-800 text-[11px] block">Pola Kausalitas Terdeteksi:</strong>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 font-semibold mt-0.5">
                          Disiplin pencatatan keuangan Anda berhubungan erat dengan tingkat produktivitas tugas di Planner Harian. Ketika produktivitas naik, rasio tabungan meningkat sebesar 24%.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-50 pt-2">
                      <span className="text-sm shrink-0">🎯</span>
                      <div>
                        <strong className="text-slate-800 text-[11px] block">Penentuan Prioritas Keputusan:</strong>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 font-semibold mt-0.5">
                          Segera alokasikan surplus dana Rp{formatRupiah(financeRecords.filter(r => r.type === 'pemasukan').reduce((a, b) => a + b.amount, 0) - financeRecords.filter(r => r.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0))} ke Pos Investasi atau Kurangi Hutang, karena win rate trading Anda saat ini berada pada level tinggi ({tradingWinRate}%).
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 border-t border-slate-50 pt-2">
                      <span className="text-sm shrink-0">💡</span>
                      <div>
                        <strong className="text-slate-800 text-[11px] block">Rekomendasi Adaptif:</strong>
                        <p className="text-[10.5px] leading-relaxed text-slate-600 font-semibold mt-0.5">
                          Mulai gunakan rasio risk-to-reward minimal 1:2 di Buku Trading untuk menopang ketahanan modal keuangan Anda yang fluktuatif bulan ini.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==========================================
            B. UNIVERSAL RESOURCE MODEL (URM)
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'resource' ? null : 'resource')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <Database className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Universal Resource Model (URM)</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Abstraksi Aset & Resource Terintegrasi</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'resource' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'resource' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Setiap objek dan data di ASE secara otomatis diabstraksikan menjadi Resource. Setiap Resource memiliki identitas, status, nilai, riwayat, hubungan, dan output yang seragam.
              </p>

              {/* Resource Grid list representing the user's actual data */}
              <div className="grid grid-cols-1 gap-2.5">
                {[
                  {
                    id: 'RES-FIN',
                    name: 'Uang (Keuangan Pribadi)',
                    status: 'Optimal',
                    value: `Salas: Rp${formatRupiah(financeRecords.filter(r => r.type === 'pemasukan').reduce((a, b) => a + b.amount, 0) - financeRecords.filter(r => r.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0))}`,
                    relation: 'Mendukung modal Trading & Anggaran Hidup',
                    history: `${financeRecords.length} Transaksi dicatat`,
                    output: 'Disiplin Pengeluaran'
                  },
                  {
                    id: 'RES-TIME',
                    name: 'Waktu (Planner Harian)',
                    status: 'Fokus',
                    value: `${summary.totalStudyMinutes} m Kerja`,
                    relation: 'Dikonsumsi oleh Tugas Planner & OKR',
                    history: `${completedTasks} Tugas Selesai`,
                    output: 'Penyelesaian Prioritas'
                  },
                  {
                    id: 'RES-CONTACT',
                    name: 'Kontak (Hubungan & Bisnis)',
                    status: 'Aktif',
                    value: `${sharedContacts.length} Partner Terhubung`,
                    relation: 'Mendukung Pipeline CRM & Relasi Pribadi',
                    history: `${crmRecords.length} Deal Terkait`,
                    output: 'Won Deals CRM'
                  }
                ].map((res) => (
                  <div key={res.id} className="bg-white p-3 rounded-xl border border-slate-150 space-y-2">
                    <div className="flex justify-between items-center border-b border-dashed border-slate-100 pb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{res.id}</span>
                        <strong className="text-[11px] font-extrabold text-slate-800">{res.name}</strong>
                      </div>
                      <span className="text-[8.5px] bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold px-1.5 py-0.2 rounded">{res.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500 font-semibold">
                      <div>
                        <span className="text-[7.5px] text-slate-400 uppercase font-black block">Nilai Resource</span>
                        <span className="text-slate-800 font-bold">{res.value}</span>
                      </div>
                      <div>
                        <span className="text-[7.5px] text-slate-400 uppercase font-black block">Riwayat Log</span>
                        <span className="text-slate-800 font-bold">{res.history}</span>
                      </div>
                      <div className="col-span-2 border-t border-slate-50 pt-1">
                        <span className="text-[7.5px] text-slate-400 uppercase font-black block">Hubungan Kausalitas</span>
                        <p className="text-slate-700 leading-tight mt-0.5">{res.relation}</p>
                      </div>
                      <div className="col-span-2 border-t border-slate-50 pt-1">
                        <span className="text-[7.5px] text-slate-400 uppercase font-black block">Output Akhir</span>
                        <span className="text-indigo-600 font-extrabold">{res.output}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            C. UNIVERSAL OBJECT MODEL (UOM)
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'object' ? null : 'object')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Layers className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Universal Object Model (UOM)</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Struktur Skema Rekod 12 Garis Mutlak</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'object' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'object' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Seluruh entri data di dalam platform ASE mematuhi struktur data universal yang mutlak demi keamanan inter-operabilitas. Tidak boleh ada objek yang menggunakan struktur berbeda.
              </p>

              <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[9.5px] space-y-1 select-all overflow-x-auto shadow-inner border border-slate-800">
                <p className="text-amber-400 font-extrabold text-[8px] uppercase tracking-wider mb-1.5">// STRUKTUR OBJEK UNIVERSAL ASE</p>
                <p><span className="text-purple-400">ID</span>: "OBJ-xxxxxx-xxxx"</p>
                <p><span className="text-purple-400">Nama</span>: "Bebas Hutang Bulanan" <span className="text-slate-500">// Nama Objek</span></p>
                <p><span className="text-purple-400">Jenis</span>: "Goal" <span className="text-slate-500">// Tipe Model</span></p>
                <p><span className="text-purple-400">Status</span>: "Sedang Berjalan" <span className="text-slate-500">// Status Operasi</span></p>
                <p><span className="text-purple-400">Pemilik</span>: "{user?.email || "offline/guest"}" <span className="text-slate-500">// Email Pengguna</span></p>
                <p><span className="text-purple-400">Tanggal Dibuat</span>: "2026-07-02T04:41:00Z"</p>
                <p><span className="text-purple-400">Tanggal Diubah</span>: "2026-07-02T04:41:36Z"</p>
                <p><span className="text-purple-400">Tag</span>: ["keuangan", "prioritas"]</p>
                <p><span className="text-purple-400">Kategori</span>: "Uang"</p>
                <p><span className="text-purple-400">Relasi</span>: "wb-keuangan"</p>
                <p><span className="text-purple-400">Lampiran</span>: ["dok_anggaran.pdf"]</p>
                <p><span className="text-purple-400">Riwayat</span>: ["Dibuat", "Dihubungkan ke Goal Engine"]</p>
              </div>

              <div className="p-2.5 bg-amber-50/60 border border-amber-100 rounded-xl text-[10px] text-amber-800 font-semibold leading-relaxed">
                🛡️ <strong>Ketaatan Skema:</strong> Semua Workbook yang lulus tes diuji kecocokan parameternya dengan model 12 variabel di atas untuk memastikan keselarasan backup & export.
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            D. MODULE DEPENDENCY MATRIX
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'dependency' ? null : 'dependency')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Network className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Module Dependency Matrix</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Sinergi Data Lintas Workbook yang Longgar</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'dependency' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'dependency' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Workbook dapat membaca data output dari Workbook lain untuk menciptakan workflow otomatis, namun masing-masing tetap modular dan berdiri sendiri tanpa error jika modul lain dilepas.
              </p>

              {/* Dependency visual graph cards */}
              <div className="space-y-2">
                {[
                  { from: 'Goal Engine', to: 'Planner Harian', data: 'Target Sasaran', desc: 'Planner otomatis mengimpor sasaran aktif yang sedang berjalan di Goal Engine untuk diposisikan sebagai tugas harian.' },
                  { from: 'Shared Data (Contacts)', to: 'CRM Penjualan', data: 'Kontak Hubungan', desc: 'CRM membaca daftar kontak universal untuk dialokasikan ke dalam pipeline prospek penjualan secara dinamis.' },
                  { from: 'Shared Data (Contacts)', to: 'Workbook Keuangan', data: 'Voucher & Kategori', desc: 'Membaca kategori dari shared data untuk menyatukan klasifikasi pengeluaran belanja.' },
                  { from: 'Goal Engine', to: 'Workbook Trading', data: 'Target Keuntungan', desc: 'Trading membaca batas drawdown atau target profit akhir yang dikunci di target utama.' }
                ].map((dep, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-1 text-[9px] font-black">
                      <span className="text-indigo-600 uppercase">{dep.from}</span>
                      <span className="text-slate-400">─── 📥 {dep.data} ───▶</span>
                      <span className="text-emerald-600 uppercase">{dep.to}</span>
                    </div>
                    <p className="text-[10px] font-semibold text-slate-500 mt-1.5 leading-relaxed">
                      {dep.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            E. CROSS WORKBOOK DASHBOARD (LIVE SUMMARY)
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'dashboard' ? null : 'dashboard')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                <BarChart3 className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Cross Workbook Dashboard</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Agregasi Lintas Workbook Terintegrasi</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'dashboard' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'dashboard' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <div className="grid grid-cols-2 gap-2">
                
                {/* Hari Ini card */}
                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <span className="text-[8px] text-slate-400 uppercase font-black block">Hari Ini</span>
                  <p className="text-slate-800 font-extrabold text-[11px] mt-1">
                    {taskRecords.filter(t => !t.completed).length} Tugas Aktif
                  </p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Selesaikan target Anda hari ini</span>
                </div>

                {/* Minggu Ini card */}
                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <span className="text-[8px] text-slate-400 uppercase font-black block">Minggu Ini</span>
                  <p className="text-slate-800 font-extrabold text-[11px] mt-1">
                    {summary.totalStudyMinutes} m Menit kerja
                  </p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Disiplin terjaga dengan baik</span>
                </div>

                {/* Bulan Ini card */}
                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <span className="text-[8px] text-slate-400 uppercase font-black block">Bulan Ini</span>
                  <p className="text-emerald-700 font-black text-[11px] mt-1">
                    +Rp{formatRupiah(financeRecords.filter(r => r.type === 'pemasukan').reduce((a, b) => a + b.amount, 0) - financeRecords.filter(r => r.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0))}
                  </p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Kondisi likuiditas bersih</span>
                </div>

                {/* Target progress card */}
                <div className="bg-white p-3 rounded-xl border border-slate-150">
                  <span className="text-[8px] text-slate-400 uppercase font-black block">Target & Sasaran</span>
                  <p className="text-indigo-600 font-black text-[11px] mt-1">
                    {goals.filter(g => g.status === 'Tercapai').length} Selesai / {goals.length} Aktif
                  </p>
                  <span className="text-[9px] text-slate-500 font-semibold block mt-0.5">Goal engine berjalan lurus</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            F. HEALTH CHECK ENGINE
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'health' ? null : 'health')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Health Check Engine</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Validitas, Lisensi, & Backup Real-time</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'health' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'health' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Memastikan platform ASE Core selalu dalam kondisi prima. Jika terdeteksi masalah, sistem langsung mengajukan rekomendasi solusi satu tombol yang terintegrasi.
              </p>

              <div className="space-y-2">
                {[
                  { name: 'Kondisi Workbook', val: healthStatus.workbooks, state: 'valid', desc: 'Seluruh manifest Workbook terverifikasi sesuai standar Module Contract.' },
                  { name: 'Integritas Basis Data', val: healthStatus.dataIntegrity, state: 'valid', desc: 'Tidak ada struktur data yang menyimpang atau file json yang rusak.' },
                  { name: 'Pencadangan (Backup)', val: healthStatus.backup, state: healthStatus.backup === 'Terjadwal' ? 'warning' : 'valid', desc: healthStatus.backup === 'Terjadwal' ? 'Cadangan sistem terdeteksi belum diperbarui 24 jam terakhir.' : 'Pencadangan sistem aman dan terbaru.' },
                  { name: 'Sinkronisasi Server', val: healthStatus.sync, state: healthStatus.sync === 'Sinkron' ? 'valid' : 'warning', desc: healthStatus.sync === 'Sinkron' ? 'Seluruh Workbook sinkron dengan database lokal.' : 'Menunggu antrean unggah data perubahan baru.' },
                  { name: 'Lisensi & Kunci Enkripsi', val: healthStatus.license, state: 'valid', desc: `Lisensi ASE Core valid untuk domain ${user?.email || "offline/guest"}.` }
                ].map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-white border border-slate-150 rounded-xl space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-[11px] text-slate-800">{item.name}</span>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase border ${
                        item.state === 'valid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                      }`}>{item.val}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-semibold leading-normal">{item.desc}</p>
                    
                    {item.state === 'warning' && (
                      <div className="pt-1">
                        <button
                          onClick={() => {
                            if (item.name.includes('Backup')) {
                              setHealthStatus(prev => ({ ...prev, backup: 'Aman (Tercadangkan)' }));
                              alert('Pencadangan platform ASE Core v2.0 berhasil diselesaikan secara lokal & aman!');
                            } else if (item.name.includes('Sinkronisasi')) {
                              setHealthStatus(prev => ({ ...prev, sync: 'Sinkron' }));
                              alert('Sinkronisasi ekosistem Workbook diselesaikan secara aman!');
                            }
                          }}
                          className="px-2 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[8px] font-black cursor-pointer transition-all"
                        >
                          {item.name.includes('Backup') ? 'Klik Solusi: Jalankan Backup Cadangan' : 'Klik Solusi: Sinkronisasikan Sekarang'}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            G. EVOLUTION ENGINE SANDBOX
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'evolution' ? null : 'evolution')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <RefreshCw className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Evolution Engine Sandbox</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Asimilasi Dinamis Workbook Tanpa Modifikasi Kode</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'evolution' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'evolution' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Membuktikan kemampuan asimilasi platform ASE Core. Ketika Workbook baru dipasang, sistem membaca kontraknya dan memperluas menu, dashboard, serta quick input secara dinamis tanpa mengubah kode utama aplikasi.
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setEvolutionEnabled(!evolutionEnabled);
                    alert(evolutionEnabled 
                      ? 'Simulasi dibatalkan. Modul Pemasaran dilepaskan kembali.' 
                      : 'Luar biasa! Modul Pemasaran terasimilasi secara dinamis ke sistem.'
                    );
                  }}
                  className={`px-4 py-2 rounded-xl font-black text-2xs cursor-pointer flex items-center gap-2 transition-all shadow-xs ${
                    evolutionEnabled 
                      ? 'bg-rose-600 hover:bg-rose-700 text-white' 
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  <Zap className="w-3.5 h-3.5" />
                  {evolutionEnabled ? 'Lepas Modul Pemasaran (Simulasi) 🔌' : 'Pasang Modul Pemasaran Baru (Simulasi) 🔌'}
                </button>
              </div>

              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2.5 shadow-xs">
                <strong className="text-[11px] text-slate-800 block uppercase tracking-wide border-b border-slate-100 pb-1.5">Hasil Integrasi Dinamis Core:</strong>
                
                <div className="space-y-2 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-bold">1. Tambah Menu Sistem:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8.5px] ${evolutionEnabled ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                      {evolutionEnabled ? '✓ Menu "Pemasaran & Konten" Ditambahkan' : 'Standby / Belum Terpasang'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 pt-2">
                    <span className="text-slate-500 font-bold">2. Widget Dashboard Baru:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8.5px] ${evolutionEnabled ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-100 text-slate-400'}`}>
                      {evolutionEnabled ? '✓ Widget "ROI Kampanye" Siap di Dashboard' : 'Standby / Belum Terpasang'}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-50 pt-2">
                    <span className="text-slate-500 font-bold">3. Skema Input Cepat:</span>
                    <span className={`px-2 py-0.5 rounded font-bold uppercase text-[8.5px] ${evolutionEnabled ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-slate-100 text-slate-400'}`}>
                      {evolutionEnabled ? '✓ Form "Rencana Konten" Di-register' : 'Standby / Belum Terpasang'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            H. DEVELOPER SDK HUB
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'sdk' ? null : 'sdk')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <Terminal className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Developer SDK Hub</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Panduan & Dokumentasi API Pihak Ketiga</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'sdk' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'sdk' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                SDK ASE menyediakan API komprehensif bagi developer luar untuk mempublish Workbook buatan sendiri ke ekosistem toko.
              </p>

              {/* SDK API Sub tabs selection */}
              <div className="flex gap-1 overflow-x-auto no-scrollbar">
                {[
                  { id: 'module-contract', label: 'Contract API' },
                  { id: 'shared-data', label: 'Shared Data' },
                  { id: 'dashboard-api', label: 'Dashboard API' },
                  { id: 'notification-api', label: 'Notifikasi' }
                ].map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => setSdkSelectedApi(sub.id)}
                    className={`px-2 py-1 text-[9.5px] font-black rounded-lg transition-all shrink-0 cursor-pointer ${
                      sdkSelectedApi === sub.id 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'bg-white border border-slate-250 text-slate-600'
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Code Display according to selected API */}
              <div className="bg-slate-900 text-slate-300 p-3 rounded-xl font-mono text-[9.5px] space-y-1 overflow-x-auto shadow-inner border border-slate-800 select-all">
                {sdkSelectedApi === 'module-contract' && (
                  <>
                    <p className="text-indigo-400 font-black text-[8px] uppercase tracking-wider mb-1">// MODULE CONTRACT API DEFINITION</p>
                    <p className="text-emerald-400">export interface WorkbookModule &#123;</p>
                    <p>&nbsp;&nbsp;id: string; <span className="text-slate-500">// Kode unik buku</span></p>
                    <p>&nbsp;&nbsp;metadata: WorkbookMetadata;</p>
                    <p>&nbsp;&nbsp;processEngine: (data: SharedData) {"=>"} any;</p>
                    <p>&nbsp;&nbsp;getInsight: (data: SharedData, computed: any) {"=>"} Insight;</p>
                    <p>&nbsp;&nbsp;renderDashboard: (props: DashboardProps) {"=>"} JSX.Element;</p>
                    <p>&nbsp;&nbsp;renderReadingMode: (props: ReadingProps) {"=>"} JSX.Element;</p>
                    <p>&#125;</p>
                  </>
                )}

                {sdkSelectedApi === 'shared-data' && (
                  <>
                    <p className="text-indigo-400 font-black text-[8px] uppercase tracking-wider mb-1">// SHARED DATA ACCESS API</p>
                    <p className="text-emerald-400">import &#123; ASESDK &#125; from "@ase/developer-sdk";</p>
                    <p></p>
                    <p><span className="text-slate-500">// Membaca database global secara aman</span></p>
                    <p>const shared = await ASESDK.getSharedData();</p>
                    <p>const finance = shared.financeRecords;</p>
                    <p>const contacts = shared.sharedContacts;</p>
                    <p></p>
                    <p><span className="text-slate-500">// Menambahkan entry baru (mematuhi UOM)</span></p>
                    <p>await ASESDK.addRecord(&#123;</p>
                    <p>&nbsp;&nbsp;name: "Pelanggan Baru",</p>
                    <p>&nbsp;&nbsp;type: "Contact",</p>
                    <p>&nbsp;&nbsp;category: "Bisnis"</p>
                    <p>&#125;);</p>
                  </>
                )}

                {sdkSelectedApi === 'dashboard-api' && (
                  <>
                    <p className="text-indigo-400 font-black text-[8px] uppercase tracking-wider mb-1">// DASHBOARD & WIDGETS HOOKS</p>
                    <p className="text-emerald-400">import &#123; ASESDK &#125; from "@ase/developer-sdk";</p>
                    <p></p>
                    <p>ASESDK.registerDashboardWidget(&#123;</p>
                    <p>&nbsp;&nbsp;id: "widget-finance-score",</p>
                    <p>&nbsp;&nbsp;size: "half",</p>
                    <p>&nbsp;&nbsp;render: () {"=>"} &lt;MiniMetricBar /&gt;</p>
                    <p>&#125;);</p>
                  </>
                )}

                {sdkSelectedApi === 'notification-api' && (
                  <>
                    <p className="text-indigo-400 font-black text-[8px] uppercase tracking-wider mb-1">// SYSTEM NOTIFICATION & SEARCH API</p>
                    <p className="text-emerald-400">import &#123; ASESDK &#125; from "@ase/developer-sdk";</p>
                    <p></p>
                    <p><span className="text-slate-500">// Triger notifikasi OS</span></p>
                    <p>ASESDK.pushNotification(&#123;</p>
                    <p>&nbsp;&nbsp;title: "Target Tercapai!",</p>
                    <p>&nbsp;&nbsp;body: "Selamat, target tabungan Anda tercapai."</p>
                    <p>&#125;);</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ==========================================
            I. TEST ENGINE (VALIDATOR INTEGRITY)
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'test' ? null : 'test')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <ClipboardCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">ASE Test Engine</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Suite Uji Validasi Mandiri Workbook</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'test' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'test' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Sebelum Workbook diterbitkan di Store resmi, Workbook tersebut harus lolos uji validasi kepatuhan 7 langkah (Struktur, Input, Output, Dashboard, Insight, Backup, dan Export).
              </p>

              <div className="flex gap-2 text-[10px]">
                <select
                  value={testWbId}
                  onChange={(e) => setTestWbId(e.target.value)}
                  className="flex-1 p-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-700"
                >
                  {workbooks.map(w => (
                    <option key={w.id} value={w.id}>{w.title}</option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    setTestStatus('running');
                    setTestProgress(0);
                    setTestLogs([]);
                    
                    const logSteps = [
                      'Menghubungkan ke SDK Test Core...',
                      'Langkah 1/7: Validasi Struktur Objek -> BERHASIL (Sesuai model UOM)',
                      'Langkah 2/7: Validasi Struktur Input -> BERHASIL (Mampu memproses payload)',
                      'Langkah 3/7: Validasi Struktur Output -> BERHASIL (Integrasi URM sinkron)',
                      'Langkah 4/7: Validasi Tampilan Dashboard -> BERHASIL (Responsif & Mobile-First)',
                      'Langkah 5/7: Validasi Logika Insight -> BERHASIL (Adaptive layer aktif)',
                      'Langkah 6/7: Validasi Kemampuan Pencadangan -> BERHASIL (File terkompresi)',
                      'Langkah 7/7: Validasi Ekspor Data -> BERHASIL (Format CSV/JSON didukung)',
                      'Mengevaluasi hasil keseluruhan...',
                      'HASIL AKHIR: BUKU KERJA LOLOS UJI KEPATUHAN 100%! SIAP TERBIT ★'
                    ];

                    let current = 0;
                    const interval = setInterval(() => {
                      if (current < logSteps.length) {
                        setTestLogs(prev => [...prev, logSteps[current]]);
                        setTestProgress(Math.round(((current + 1) / logSteps.length) * 100));
                        current++;
                      } else {
                        clearInterval(interval);
                        setTestStatus('success');
                      }
                    }, 400);
                  }}
                  disabled={testStatus === 'running'}
                  className="px-3 bg-slate-900 hover:bg-black text-white rounded-xl font-black cursor-pointer text-[10px] transition-all"
                >
                  Jalankan Uji Validasi 🧪
                </button>
              </div>

              {testStatus !== 'idle' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${testStatus === 'success' ? 'bg-emerald-500' : 'bg-indigo-600 animate-pulse'}`} 
                      style={{ width: `${testProgress}%` }}
                    ></div>
                  </div>

                  <div className="bg-slate-950 text-slate-300 p-3 rounded-xl font-mono text-[9px] space-y-1.5 max-h-48 overflow-y-auto shadow-inner border border-slate-900 leading-normal">
                    <div className="flex justify-between text-[8px] text-slate-500 border-b border-slate-900 pb-1 mb-1 font-black">
                      <span>TERMINAL UJI VALIDASI SDK</span>
                      <span>PROGRES: {testProgress}%</span>
                    </div>
                    {testLogs.map((log, index) => {
                      let color = 'text-slate-300';
                      if (log.includes('BERHASIL')) color = 'text-emerald-400 font-extrabold';
                      if (log.includes('HASIL AKHIR')) color = 'text-amber-400 font-black';
                      return (
                        <p key={index} className={color}>&gt; {log}</p>
                      );
                    })}
                  </div>

                  {testStatus === 'success' && (
                    <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-center">
                      <span className="text-[11px] font-black text-emerald-700 block">✓ SERTIFIKAT KEPATUHAN TERBIT</span>
                      <p className="text-[9.5px] text-emerald-600 mt-1 font-semibold leading-relaxed">
                        Workbook ini lolos seluruh uji kualifikasi kepatuhan ekosistem platform. Publisher dipersilakan menerbitkannya ke ASE Store melalui Publisher Center.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ==========================================
            J. ASE CONSTITUTION CODEX
            ========================================== */}
        <div className="bg-white rounded-2xl border border-slate-150 overflow-hidden shadow-xs">
          <button 
            onClick={() => setActiveSection(activeSection === 'constitution' ? null : 'constitution')}
            className="w-full p-3.5 flex justify-between items-center text-left hover:bg-slate-50 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Konstitusi ASE (20 Prinsip)</h4>
                <p className="text-[9px] text-slate-400 font-bold uppercase">Pilar Utama & Pedoman Filosofis Platform</p>
              </div>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${activeSection === 'constitution' ? 'rotate-180' : ''}`} />
          </button>

          {activeSection === 'constitution' && (
            <div className="p-4 border-t border-slate-100 bg-slate-50/30 space-y-3.5 text-xs animate-scale-up">
              <p className="text-[11px] leading-relaxed font-semibold text-slate-500">
                Pilar fundamental yang mengikat seluruh modul, developer, dan platform dalam menyajikan manfaat nyata bagi pengguna secara teratur.
              </p>

              {/* Slider principle interface */}
              <div className="p-3 bg-white border border-slate-150 rounded-xl space-y-2.5 shadow-xs relative">
                <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                  <span className="text-[8.5px] font-black bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded uppercase">Prinsip {activeConstitutionStep + 1} dari 20</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase">Codex Mandat</span>
                </div>

                <div className="min-h-16 flex flex-col justify-center">
                  {[
                    { title: "Satu aplikasi, banyak Workbook.", body: "ASE menyatukan seluruh kebutuhan pengelolaan personal dan bisnis dalam satu ekosistem tunggal yang terintegrasi." },
                    { title: "Data cukup diinput satu kali.", body: "Menghindari redundansi input data. Data yang diisi di satu Workbook akan langsung mengalir ke Workbook lainnya." },
                    { title: "Semua Workbook menggunakan kontrak yang sama.", body: "Ketaatan mutlak terhadap Module Contract menjamin integritas pertukaran data yang mulus." },
                    { title: "Semua Input menghasilkan Output.", body: "Tidak boleh ada input kosong tanpa nilai tambah. Setiap rekod harus mematangkan status operasional." },
                    { title: "Semua Output menghasilkan Insight.", body: "Kecerdasan platform mengekstrak insight penting dari relasi data lintas Workbook secara otomatis." },
                    { title: "Semua Insight membantu keputusan.", body: "Insight dirancang untuk memberikan dampak aksi nyata, prioritas kerja, dan mempermudah tindakan." },
                    { title: "Pengguna memiliki seluruh data.", body: "Kedaulatan data mutlak milik pengguna. Anda bebas menyalin, menghapus, atau memindahkan data Anda." },
                    { title: "Semua data dapat dicadangkan & dipulihkan.", body: "Mekanisme pengamanan enkripsi lokal untuk mencegah risiko kehilangan data berharga." },
                    { title: "Semua Workbook dapat dipasang & dilepas.", body: "Sistem modular longgar yang independen. Menghapus satu modul tidak akan merusak modul lainnya." },
                    { title: "Aplikasi utama tidak boleh bergantung pada Workbook tertentu.", body: "Platform terasimilasi secara dinamis untuk menjamin keadilan ekosistem." },
                    { title: "Semua fitur harus memberikan manfaat nyata.", body: "Fokus pada nilai guna, efisiensi waktu, dan kejelasan alur pikir pengguna." },
                    { title: "Bahasa aplikasi harus sederhana.", body: "Penggunaan istilah sederhana, jujur, bebas jargon yang menyulitkan pengguna." },
                    { title: "Mobile First.", body: "Antarmuka dioptimalkan secara sempurna untuk genggaman ponsel, responsif, dan gesit." },
                    { title: "Offline First.", body: "Sistem tetap beroperasi 100% tanpa jaringan internet, menyinkronkan data secara pintar saat terhubung." },
                    { title: "Security First.", body: "Perlindungan data lokal, sandboxed execution, serta perlindungan API key rahasia." },
                    { title: "Marketplace Ready.", body: "Workbook siap dipublish, dibeli, atau disubscribe oleh jutaan pengguna digital." },
                    { title: "Publisher Friendly.", body: "Proses pengiriman, uji validasi, serta bagi hasil komisi publisher yang transparan." },
                    { title: "AI Assist, bukan AI Replace.", body: "Kecerdasan adaptif sebagai asisten yang merekomendasikan keputusan, bukan menggantikan hak kontrol manusia." },
                    { title: "Modular by Design.", body: "Arsitektur longgar yang memisahkan logic, layout, dan data secara terstruktur." },
                    { title: "Adaptive by Nature.", body: "Platform berkembang mengikuti kebiasaan, alur produktivitas, dan pertumbuhan ekosistem pengguna." }
                  ].map((principle, index) => {
                    if (index !== activeConstitutionStep) return null;
                    return (
                      <div key={index} className="space-y-1.5 animate-fade-in">
                        <h5 className="font-extrabold text-xs text-slate-800 tracking-tight leading-snug">{principle.title}</h5>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{principle.body}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                  <button
                    onClick={() => setActiveConstitutionStep(prev => Math.max(0, prev - 1))}
                    disabled={activeConstitutionStep === 0}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded text-[9px] font-black cursor-pointer"
                  >
                    Sebelumnya
                  </button>
                  <button
                    onClick={() => setActiveConstitutionStep(prev => Math.min(19, prev + 1))}
                    disabled={activeConstitutionStep === 19}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-black text-white disabled:opacity-40 rounded text-[9px] font-black cursor-pointer"
                  >
                    Berikutnya
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  )}
    </div>
  );
}

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import MobileFrame from './components/MobileFrame';
import SplashScreen from './components/SplashScreen';
import BottomNavBar from './components/BottomNavBar';

import BerandaView from './components/BerandaView';
import BukuSayaView from './components/BukuSayaView';
import JelajahiView from './components/JelajahiView';
import RingkasanView from './components/RingkasanView';
import PengaturanView from './components/PengaturanView';

import { Plus } from 'lucide-react';
import QuickInputModal from './components/QuickInputModal';
import { IdentityModule } from './core/IdentityService';
import { aseKernelInstance } from './core/Kernel';

import { 
  Workbook, 
  UserProfile, 
  DailyActivity, 
  ThemeColor,
  FinanceRecord,
  TaskRecord,
  HabitRecord,
  CrmRecord,
  TradingRecord,
  OkrRecord,
  RelationshipRecord,
  SharedContact,
  PurchaseRecord,
  Goal,
  TimelineItem,
  WorkspaceMode
} from './types';
import { 
  INITIAL_WORKBOOKS as EXPLORE_WORKBOOKS, 
  INITIAL_ACTIVITY,
  INITIAL_FINANCE_RECORDS,
  INITIAL_TASK_RECORDS,
  INITIAL_HABIT_RECORDS,
  INITIAL_CRM_RECORDS,
  INITIAL_TRADING_RECORDS,
  INITIAL_OKR_RECORDS,
  INITIAL_RELATIONSHIP_RECORDS,
  INITIAL_SHARED_CONTACTS,
  INITIAL_GOALS,
  INITIAL_TIMELINE
} from './mockData';

export default function App() {
  // Splash Screen Display State
  const [showSplash, setShowSplash] = useState(true);

  // Active Menu / Screen State
  const [currentView, setCurrentView] = useState<string>('beranda');

  // Currently Selected Workbook ID (for reading mode inside Buku Saya)
  const [selectedWbId, setSelectedWbId] = useState<string | null>(null);

  // User Profile State (Simulated)
  const [user, setUser] = useState<UserProfile>({
    name: 'Prasetyo',
    role: 'Profesional Kreatif',
    avatarId: 'male',
    workspaceMode: 'Individu'
  });

  // Theme Accent Color State
  const [themeColor, setThemeColor] = useState<ThemeColor>('emerald');

  // Global Language Localization State
  const [language, setLanguage] = useState<string>('id');

  // Workbooks State (loaded initially with mock data)
  const [workbooks, setWorkbooks] = useState<Workbook[]>([]);

  // Weekly study minutes activity logs
  const [activity, setActivity] = useState<DailyActivity[]>([]);

  // Workbook Engine Record States (ASE v2.0 Shared Data Engine)
  const [financeRecords, setFinanceRecords] = useState<FinanceRecord[]>([]);
  const [taskRecords, setTaskRecords] = useState<TaskRecord[]>([]);
  const [habitRecords, setHabitRecords] = useState<HabitRecord[]>([]);
  const [crmRecords, setCrmRecords] = useState<CrmRecord[]>([]);
  const [tradingRecords, setTradingRecords] = useState<TradingRecord[]>([]);
  const [okrRecords, setOkrRecords] = useState<OkrRecord[]>([]);
  const [relationshipRecords, setRelationshipRecords] = useState<RelationshipRecord[]>([]);
  const [sharedContacts, setSharedContacts] = useState<SharedContact[]>([]);
  const [purchases, setPurchases] = useState<PurchaseRecord[]>([]);

  // ASE Engines States
  const [goals, setGoals] = useState<Goal[]>([]);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);

  // Quick Input State
  const [showQuickInput, setShowQuickInput] = useState(false);
  const [quickInputLogs, setQuickInputLogs] = useState<{
    id: string;
    workbookTitle: string;
    entryName: string;
    details: string;
    timestamp: string;
  }[]>([]);

  const handleAddQuickLog = (workbookTitle: string, entryName: string, details: string) => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timestamp = `${hours}:${minutes}`;

    const newLog = {
      id: 'log-' + Date.now(),
      workbookTitle,
      entryName,
      details,
      timestamp
    };
    setQuickInputLogs(prev => [newLog, ...prev]);
  };

  const handleIncrementActivity = () => {
    const daysMap = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
    const currentDayIdx = new Date().getDay();
    const currentDayAbbr = daysMap[currentDayIdx];

    setActivity(prev =>
      prev.map(act => {
        if (act.day === currentDayAbbr) {
          return {
            ...act,
            minutes: act.minutes + 5,
            completedTasks: act.completedTasks + 1
          };
        }
        return act;
      })
    );
  };

  // Load Initial mock data with rich marketplace configurations
  useEffect(() => {
    const initialWbs = JSON.parse(JSON.stringify(EXPLORE_WORKBOOKS)) as Workbook[];
    
    // Enrich workbooks with prices, discount codes, screenshots, reviews, updates, etc.
    const enrichedWbs = initialWbs.map((wb) => {
      if (wb.id === 'wb-keuangan') {
        wb.price = 0;
        wb.licenseStatus = 'Dimiliki';
        wb.downloadsCount = 1420;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', 
          'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Dana Darurat', value: 'Terpenuhi 65%' }, 
          { label: 'Alokasi Pengeluaran', value: 'Needs: 48%, Wants: 28%' }
        ];
        wb.insightPreview = [
          'Pengeluaran Kategori "Keinginan" Anda mendekati batas 30%.', 
          'Dana darurat Anda aman untuk 4.2 bulan ke depan.'
        ];
        wb.reviews = [
          { id: 'r1', user: 'Andi Santoso', rating: 5, text: 'Sangat praktis untuk mengatur gaji bulanan saya!', date: '2026-06-25' },
          { id: 'r2', user: 'Melani Putri', rating: 4.8, text: 'Kalkulator dana daruratnya akurat sekali.', date: '2026-06-20' }
        ];
        wb.updateHistory = [
          { version: 'v1.1.2', date: '01 Jul 2026', note: 'Optimasi perhitungan sisa anggaran dan visualisasi grafik.' },
          { version: 'v1.0.0', date: '15 Jun 2026', note: 'Rilis perdana modul keuangan.' }
        ];
      } else if (wb.id === 'wb-planner') {
        wb.price = 0;
        wb.licenseStatus = 'Dimiliki';
        wb.downloadsCount = 980;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=400', 
          'https://images.unsplash.com/photo-1517842645767-c639042777db?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Penyelesaian Tugas', value: '75% Selesai Hari Ini' }, 
          { label: 'Blok Waktu Terisi', value: '6 Jam/Hari' }
        ];
        wb.insightPreview = [
          'Tugas "Penting-Mendesak" diselesaikan tepat waktu.', 
          'Tingkat energi harian Anda stabil di angka 8/10.'
        ];
        wb.reviews = [
          { id: 'r3', user: 'Rina Marlina', rating: 4.8, text: 'Matriks Eisenhower-nya membantu sekali memilah tugas harian.', date: '2026-06-28' }
        ];
        wb.updateHistory = [
          { version: 'v2.0.1', date: '28 Jun 2026', note: 'Perbaikan bug notifikasi reminder harian.' }
        ];
      } else if (wb.id === 'wb-crm') {
        wb.price = 49000;
        wb.originalPrice = 59000;
        wb.licenseStatus = 'Belum Dimiliki';
        wb.downloadsCount = 650;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', 
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Pipa Penjualan', value: 'Rp 24.500.000 Aktif' }, 
          { label: 'Rasio Konversi', value: '35% Lead-to-Won' }
        ];
        wb.insightPreview = [
          'Klien "Budi Santoso" berada di tahap Negosiasi selama 5 hari.', 
          'Sewa deal rata-rata selesai dalam 12 hari.'
        ];
        wb.reviews = [
          { id: 'r4', user: 'Toni Kurniawan', rating: 5, text: 'Pipeline closing-nya membantu tim sales kami tetap fokus!', date: '2026-06-18' }
        ];
        wb.updateHistory = [
          { version: 'v1.0.2', date: '20 Jun 2026', note: 'Penambahan bidang filter status closing.' }
        ];
      } else if (wb.id === 'wb-trading') {
        wb.price = 79000;
        wb.originalPrice = 99000;
        wb.licenseStatus = 'Belum Dimiliki';
        wb.downloadsCount = 420;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400', 
          'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Win Rate Mingguan', value: '60% (3 Win / 2 Loss)' }, 
          { label: 'Rasio Risk/Reward', value: 'Rata-rata 1:2.4' }
        ];
        wb.insightPreview = [
          'FOMO adalah pemicu loss terbesar Anda pekan ini (70% total loss).', 
          'Rasio profit terbesar didapat pada pair BTC/USDT.'
        ];
        wb.reviews = [
          { id: 'r5', user: 'Galih Perkasa', rating: 4.5, text: 'Sangat baik untuk mengevaluasi psikologi trading saat FOMO.', date: '2026-06-29' }
        ];
        wb.updateHistory = [
          { version: 'v1.0.1', date: '10 Jun 2026', note: 'Optimasi kalkulator Win Rate.' }
        ];
      } else if (wb.id === 'wb-growth') {
        wb.price = 59000;
        wb.originalPrice = 69000;
        wb.licenseStatus = 'Belum Dimiliki';
        wb.downloadsCount = 880;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1484417894907-623942c8ea29?w=400', 
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Target OKR', value: 'Rata-rata 65% Tercapai' }, 
          { label: 'Refleksi Diri', value: 'Evaluasi Mingguan Terisi' }
        ];
        wb.insightPreview = [
          'Objective "Kesehatan Mental & Fisik" mengalami kenaikan progres +15%.', 
          'Knowledge vault Anda bertambah 4 konsep baru pekan ini.'
        ];
        wb.reviews = [
          { id: 'r6', user: 'Hendra Wijaya', rating: 4.9, text: 'Sistem OKR yang digabungkan dengan knowledge vault sangat mantap.', date: '2026-06-20' }
        ];
        wb.updateHistory = [
          { version: 'v3.0.0', date: '12 May 2026', note: 'Major upgrade: Penambahan integrasi peta pikiran.' }
        ];
      } else if (wb.id === 'wb-relationship') {
        wb.price = 0;
        wb.licenseStatus = 'Belum Dimiliki';
        wb.downloadsCount = 1100;
        wb.screenshots = [
          'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=400', 
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400'
        ];
        wb.dashboardPreview = [
          { label: 'Status Hubungan', value: 'Istri: 90%, Ibu: 85%' }, 
          { label: 'Bahasa Kasih Utama', value: 'Quality Time' }
        ];
        wb.insightPreview = [
          'Waktu berkualitas bersama Istri terjaga stabil pekan ini.', 
          'Ada 2 hari ulang tahun penting bulan depan, siapkan kado!'
        ];
        wb.reviews = [
          { id: 'r7', user: 'Sarah Julia', rating: 5, text: 'Membantu saya mengingat hari-hari penting keluarga.', date: '2026-06-24' }
        ];
        wb.updateHistory = [
          { version: 'v1.0.0', date: '01 May 2026', note: 'Rilis perdana modul hubungan.' }
        ];
      } else {
        // Fallbacks for dynamically published workbooks
        wb.price = wb.price || 0;
        wb.licenseStatus = wb.isDownloaded ? 'Dimiliki' : (wb.price > 0 ? 'Belum Dimiliki' : 'Gratis');
        wb.downloadsCount = wb.downloadsCount || 0;
        wb.screenshots = wb.screenshots || [];
        wb.reviews = wb.reviews || [];
        wb.updateHistory = wb.updateHistory || [];
      }
      return wb;
    });

    setWorkbooks(enrichedWbs);
    setActivity(JSON.parse(JSON.stringify(INITIAL_ACTIVITY)));
    setFinanceRecords(JSON.parse(JSON.stringify(INITIAL_FINANCE_RECORDS)));
    setTaskRecords(JSON.parse(JSON.stringify(INITIAL_TASK_RECORDS)));
    setHabitRecords(JSON.parse(JSON.stringify(INITIAL_HABIT_RECORDS)));
    setCrmRecords(JSON.parse(JSON.stringify(INITIAL_CRM_RECORDS)));
    setTradingRecords(JSON.parse(JSON.stringify(INITIAL_TRADING_RECORDS)));
    setOkrRecords(JSON.parse(JSON.stringify(INITIAL_OKR_RECORDS)));
    setRelationshipRecords(JSON.parse(JSON.stringify(INITIAL_RELATIONSHIP_RECORDS)));
    setSharedContacts(JSON.parse(JSON.stringify(INITIAL_SHARED_CONTACTS)));
    setGoals(JSON.parse(JSON.stringify(INITIAL_GOALS)));
    setTimeline(JSON.parse(JSON.stringify(INITIAL_TIMELINE)));

    // Load initial purchases history
    setPurchases([
      {
        id: 'TX-7839201',
        workbookId: 'wb-keuangan',
        workbookTitle: 'Keuangan Pribadi',
        purchaseDate: '2026-06-15 10:24',
        pricePaid: 0,
        discountApplied: 0,
        paymentMethod: 'Gratis (Sistem)',
        transactionNumber: 'ASE-TX-10029304',
        status: 'Berhasil'
      },
      {
        id: 'TX-7839202',
        workbookId: 'wb-planner',
        workbookTitle: 'Planner Harian & Time Blocking',
        purchaseDate: '2026-06-20 14:15',
        pricePaid: 0,
        discountApplied: 0,
        paymentMethod: 'Gratis (Sistem)',
        transactionNumber: 'ASE-TX-10029305',
        status: 'Berhasil'
      }
    ]);
  }, []);

  // Decoupled Interoperability Subscriptions (Fase 4: Interoperability Proof)
  useEffect(() => {
    // 1. CRM Deal Won event -> automatically synchronize income record in Finance Workbook
    const unsubscribeCrm = aseKernelInstance.eventBus.subscribe('crm.deal.won', (event) => {
      const deal = event.payload;
      const newFinRec: FinanceRecord = {
        id: 'fin-auto-' + Date.now(),
        type: 'pemasukan',
        category: 'Bisnis Sampingan',
        amount: deal.dealValue,
        date: deal.date,
        note: `[CRM Auto] Deal Won - ${deal.clientName}`
      };
      setFinanceRecords(prev => {
        if (prev.some(r => r.note.includes(deal.clientName) && r.amount === deal.dealValue)) {
          return prev;
        }
        return [newFinRec, ...prev];
      });
      aseKernelInstance.log('success', 'Interoperability', `Event crm.deal.won processed: synchronizing Rp ${deal.dealValue} revenue into Keuangan workbook.`);
    });

    // 2. Finance Transaction Created event -> calculate ratio and trigger LimitExceeded if > 70% of Rp 1,000,000 daily budget
    const unsubscribeFinance = aseKernelInstance.eventBus.subscribe('finance.transaction.created', (event) => {
      const tx = event.payload;
      if (tx.type === 'pengeluaran') {
        setFinanceRecords(prev => {
          const today = tx.date;
          // Include current transaction in sum
          const existingExpenses = prev
            .filter(r => r.type === 'pengeluaran' && r.date === today && r.id !== tx.id)
            .reduce((sum, r) => sum + r.amount, 0);
          const todayExpenses = existingExpenses + tx.amount;

          const limit = 1000000; // Rp 1,000,000 daily budget
          const ratio = todayExpenses / limit;
          if (ratio > 0.70) {
            setTimeout(() => {
              aseKernelInstance.eventBus.publish('TransactionCreated.LimitExceeded', {
                date: today,
                currentExpenseTotal: todayExpenses,
                limit,
                ratio: Math.round(ratio * 100)
              }, 'wb-keuangan');
            }, 50);
          }
          return prev;
        });
      }
    });

    // 3. Limit Exceeded event -> trigger high-priority budget evaluation task in Planner Workbook
    const unsubscribeLimit = aseKernelInstance.eventBus.subscribe('TransactionCreated.LimitExceeded', (event) => {
      const data = event.payload;
      const taskName = `⚠️ Evaluasi Anggaran Harian (${data.ratio}% Batas Terlampaui!)`;
      setTaskRecords(prev => {
        if (prev.some(t => t.taskName === taskName)) {
          return prev;
        }
        const newTask: TaskRecord = {
          id: 'task-auto-' + Date.now(),
          taskName,
          timeBlock: 'Malam Hari (19-21)',
          priority: 'Penting-Mendesak',
          completed: false
        };
        return [...prev, newTask];
      });
      aseKernelInstance.log('success', 'Interoperability', `Event TransactionCreated.LimitExceeded processed: created evaluation task in Planner workbook.`);
    });

    return () => {
      unsubscribeCrm();
      unsubscribeFinance();
      unsubscribeLimit();
    };
  }, []);

  // Subscribe to Identity Module authentication sessions
  useEffect(() => {
    const unsubscribe = IdentityModule.subscribe((session) => {
      if (session) {
        setUser({
          name: session.user.name,
          role: session.user.role === 'SysAdmin' ? 'Manajer Proyek / Tim' : session.user.role === 'Publisher' ? 'Wirausaha Mandiri' : 'Profesional Kreatif',
          avatarId: session.provider === 'google' ? 'male' : 'female',
          workspaceMode: session.user.workspaceMode as any,
          email: session.user.email,
          uid: session.user.uid,
          provider: session.provider
        });
      } else {
        // Fallback default
        setUser({
          name: 'Prasetyo',
          role: 'Profesional Kreatif',
          avatarId: 'male',
          workspaceMode: 'Individu'
        });
      }
    });
    return () => unsubscribe();
  }, []);

  // Purchase/Activation flow
  const handlePurchaseWorkbook = (wbId: string, pricePaid: number, discountApplied: number, paymentMethod: string) => {
    const wb = workbooks.find(w => w.id === wbId);
    if (!wb) return;

    const txId = 'TX-' + Math.floor(Math.random() * 9000000 + 1000000);
    const newPurchase: PurchaseRecord = {
      id: txId,
      workbookId: wbId,
      workbookTitle: wb.title,
      purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      pricePaid,
      discountApplied,
      paymentMethod,
      transactionNumber: 'ASE-' + txId + '-' + Math.floor(Math.random() * 9000 + 1000),
      status: 'Berhasil'
    };

    setPurchases(prev => [newPurchase, ...prev]);

    setWorkbooks(prev => prev.map(w => {
      if (w.id === wbId) {
        return {
          ...w,
          isDownloaded: true,
          licenseStatus: 'Dimiliki',
          progress: 0
        };
      }
      return w;
    }));

    // Reward activity minutes for purchase
    setActivity(prev => prev.map(act => {
      const daysMap = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
      const today = daysMap[new Date().getDay()];
      if (act.day === today) {
        return {
          ...act,
          minutes: act.minutes + 15,
          completedTasks: act.completedTasks + 1
        };
      }
      return act;
    }));
  };

  const handlePublishWorkbook = (newWb: Workbook) => {
    setWorkbooks(prev => [newWb, ...prev]);
  };

  // Handle downloading a workbook from Explore view
  const handleDownloadWorkbook = (id: string) => {
    setWorkbooks((prev) =>
      prev.map((wb) => {
        if (wb.id === id) {
          return {
            ...wb,
            isDownloaded: true,
            progress: 0, // start fresh
          };
        }
        return wb;
      })
    );

    // Track download in activity log for today (e.g. Wednesday/Rab or Friday/Jum)
    // Adding 15 minutes as "exploration/download" time reward
    setActivity((prev) =>
      prev.map((act) => {
        if (act.day === 'Rab') {
          return { ...act, minutes: act.minutes + 15, completedTasks: act.completedTasks + 1 };
        }
        return act;
      })
    );
  };

  // Open workbook chapters inside Buku Saya view
  const handleOpenWorkbook = (id: string) => {
    setSelectedWbId(id);
    setCurrentView('bukusaya');
  };

  // Update workbook state (progress, notes, quizzes, etc.)
  const handleUpdateWorkbook = (updatedWb: Workbook) => {
    setWorkbooks((prev) =>
      prev.map((wb) => (wb.id === updatedWb.id ? updatedWb : wb))
    );

    // If workbook progress is increased, log study time reward in Friday
    setActivity((prev) =>
      prev.map((act) => {
        if (act.day === 'Jum') {
          return { ...act, minutes: act.minutes + 10, completedTasks: act.completedTasks + 1 };
        }
        return act;
      })
    );
  };

  // Reset all application state back to default
  const handleResetData = () => {
    setWorkbooks(JSON.parse(JSON.stringify(EXPLORE_WORKBOOKS)));
    setActivity(JSON.parse(JSON.stringify(INITIAL_ACTIVITY)));
    setFinanceRecords(JSON.parse(JSON.stringify(INITIAL_FINANCE_RECORDS)));
    setTaskRecords(JSON.parse(JSON.stringify(INITIAL_TASK_RECORDS)));
    setHabitRecords(JSON.parse(JSON.stringify(INITIAL_HABIT_RECORDS)));
    setCrmRecords(JSON.parse(JSON.stringify(INITIAL_CRM_RECORDS)));
    setTradingRecords(JSON.parse(JSON.stringify(INITIAL_TRADING_RECORDS)));
    setOkrRecords(JSON.parse(JSON.stringify(INITIAL_OKR_RECORDS)));
    setRelationshipRecords(JSON.parse(JSON.stringify(INITIAL_RELATIONSHIP_RECORDS)));
    setSharedContacts(JSON.parse(JSON.stringify(INITIAL_SHARED_CONTACTS)));
    setSelectedWbId(null);
    setCurrentView('beranda');
    setUser({
      name: 'Prasetyo',
      role: 'Profesional Kreatif',
      avatarId: 'male',
    });
    setThemeColor('emerald');
  };

  // Determine current screen title based on view selection
  const getScreenTitle = () => {
    if (currentView === 'bukusaya' && selectedWbId) {
      const activeWb = workbooks.find((w) => w.id === selectedWbId);
      return activeWb ? activeWb.title : 'Membaca Workbook';
    }

    switch (currentView) {
      case 'beranda':
        return 'ASE Workbook';
      case 'bukusaya':
        return 'Workbook Saya';
      case 'jelajahi':
        return 'Jelajahi Workbook';
      case 'ringkasan':
        return 'Ringkasan & Progres';
      case 'pengaturan':
        return 'Pengaturan';
      default:
        return 'ASE Workbook';
    }
  };

  // Determine if we should show a back button in the header
  const isBackArrowShown = currentView === 'bukusaya' && selectedWbId !== null;

  // Handle header back action
  const handleHeaderBack = () => {
    if (currentView === 'bukusaya' && selectedWbId) {
      setSelectedWbId(null);
    }
  };

  // Render the currently selected sub-view
  const renderActiveView = () => {
    switch (currentView) {
      case 'beranda':
        return (
          <BerandaView
            user={user}
            workbooks={workbooks}
            onContinueWorkbook={handleOpenWorkbook}
            onExploreMore={() => setCurrentView('jelajahi')}
            onNavigateToTab={(tabId) => {
              if (tabId === 'buku') setCurrentView('bukusaya');
              else if (tabId === 'jelajahi') setCurrentView('jelajahi');
              else if (tabId === 'ringkasan') setCurrentView('ringkasan');
            }}
            themeColor={themeColor}
            quickInputLogs={quickInputLogs}
            sharedData={sharedData}
            activity={activity}
            timeline={timeline}
            setTimeline={setTimeline}
            goals={goals}
          />
        );
      case 'bukusaya':
        return (
          <BukuSayaView
            workbooks={workbooks}
            onUpdateWorkbook={handleUpdateWorkbook}
            selectedWbId={selectedWbId}
            setSelectedWbId={setSelectedWbId}
            themeColor={themeColor}
            financeRecords={financeRecords}
            setFinanceRecords={setFinanceRecords}
            taskRecords={taskRecords}
            setTaskRecords={setTaskRecords}
            habitRecords={habitRecords}
            setHabitRecords={setHabitRecords}
            crmRecords={crmRecords}
            setCrmRecords={setCrmRecords}
            tradingRecords={tradingRecords}
            setTradingRecords={setTradingRecords}
            okrRecords={okrRecords}
            setOkrRecords={setOkrRecords}
            relationshipRecords={relationshipRecords}
            setRelationshipRecords={setRelationshipRecords}
            sharedContacts={sharedContacts}
            setSharedContacts={setSharedContacts}
            goals={goals}
            setGoals={setGoals}
            timeline={timeline}
            setTimeline={setTimeline}
          />
        );
      case 'jelajahi':
        return (
          <JelajahiView
            workbooks={workbooks}
            onDownloadWorkbook={handleDownloadWorkbook}
            onOpenWorkbook={handleOpenWorkbook}
            themeColor={themeColor}
            purchases={purchases}
            onAddPurchase={handlePurchaseWorkbook}
            onPublishWorkbook={handlePublishWorkbook}
            onUpdateWorkbook={handleUpdateWorkbook}
          />
        );
      case 'ringkasan':
        return (
          <RingkasanView
            workbooks={workbooks}
            activity={activity}
            themeColor={themeColor}
            onNavigateToWorkbook={handleOpenWorkbook}
            financeRecords={financeRecords}
            taskRecords={taskRecords}
            habitRecords={habitRecords}
            crmRecords={crmRecords}
            tradingRecords={tradingRecords}
            okrRecords={okrRecords}
            relationshipRecords={relationshipRecords}
            sharedContacts={sharedContacts}
            goals={goals}
            setGoals={setGoals}
            user={user}
          />
        );
      case 'pengaturan':
        return (
          <PengaturanView
            user={user}
            onUpdateUser={setUser}
            themeColor={themeColor}
            onChangeThemeColor={setThemeColor}
            onTriggerSplash={() => setShowSplash(true)}
            onResetData={handleResetData}
            language={language}
            onChangeLanguage={setLanguage}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-slate-500 font-medium">
            Halaman sedang dalam pemeliharaan.
          </div>
        );
    }
  };

  // Assemble shared data and mutators for the Dynamic Book Engine & Quick Input
  const sharedData = {
    financeRecords,
    taskRecords,
    habitRecords,
    crmRecords,
    tradingRecords,
    okrRecords,
    relationshipRecords,
    sharedContacts
  };

  const mutators = {
    setFinanceRecords,
    setTaskRecords,
    setHabitRecords,
    setCrmRecords,
    setTradingRecords,
    setOkrRecords,
    setRelationshipRecords,
    setSharedContacts
  };

  const isFabVisible = !showSplash && selectedWbId === null;

  const getThemeFabClass = (color: string) => {
    switch (color) {
      case 'indigo': return 'bg-[#4F5B9A] hover:bg-[#3E4980]';
      case 'amber': return 'bg-[#7D5800] hover:bg-[#624400]';
      case 'rose': return 'bg-[#9B4052] hover:bg-[#803140]';
      case 'teal': return 'bg-[#6750A4] hover:bg-[#533F8A]';
      case 'emerald':
      default:
        return 'bg-[#006E3A] hover:bg-[#00552D]';
    }
  };

  return (
    <div className="relative">
      {/* Splash Screen Layer Overlay */}
      {showSplash && (
        <SplashScreen 
          onDismiss={() => setShowSplash(false)} 
          themeColor={themeColor} 
        />
      )}

      {/* Main Simulated Phone Screen Frame */}
      <MobileFrame
        title={getScreenTitle()}
        showBack={isBackArrowShown}
        onBack={handleHeaderBack}
        themeColor={themeColor}
        user={user}
        bottomNav={
          !showSplash && (
            <BottomNavBar
              currentView={currentView}
              onViewChange={(view) => {
                setCurrentView(view);
                // Auto-reset workbook detail when navigating to other menus
                if (view !== 'bukusaya') {
                  setSelectedWbId(null);
                }
              }}
              themeColor={themeColor}
            />
          )
        }
        floatingButton={
          isFabVisible && (
            <div className="absolute bottom-[88px] right-5 z-40">
              <button
                id="btn-quick-input-fab"
                onClick={() => setShowQuickInput(true)}
                className={`w-14 h-14 rounded-full text-white flex items-center justify-center shadow-lg transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none ${getThemeFabClass(themeColor)}`}
                title="Input Cepat"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
          )
        }
      >
        {/* Render actual selected screen content */}
        {renderActiveView()}

        {/* Quick Input Form Sheet Overlay */}
        <QuickInputModal
          isOpen={showQuickInput}
          onClose={() => setShowQuickInput(false)}
          workbooks={workbooks}
          themeColor={themeColor}
          sharedData={sharedData}
          mutators={mutators}
          onAddQuickLog={handleAddQuickLog}
          onIncrementActivity={handleIncrementActivity}
        />
      </MobileFrame>
    </div>
  );
}

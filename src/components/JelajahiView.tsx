/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Star, 
  Clock, 
  SlidersHorizontal, 
  ArrowLeft, 
  Wallet, 
  Calendar, 
  Users, 
  TrendingUp, 
  Zap, 
  Heart, 
  Activity, 
  Download, 
  Database, 
  ArrowRightLeft, 
  Compass, 
  Sparkles, 
  FileText, 
  Tag, 
  CreditCard, 
  QrCode, 
  AlertCircle, 
  PlusCircle, 
  PlayCircle, 
  BadgePercent, 
  ChevronRight, 
  ShieldCheck, 
  Award, 
  BookOpen,
  Wifi,
  WifiOff,
  RefreshCw,
  HelpCircle,
  HelpCircle as FaqIcon,
  Globe,
  Palette,
  Layers
} from 'lucide-react';

import { Workbook, PurchaseRecord } from '../types';
import { LanguageRegistry } from '../lib/i18n';
import { IdentityModule } from '../core/IdentityService';

// Import our modular sub-components
import AdminConsoleView from './AdminConsoleView';
import PublisherCenterView from './PublisherCenterView';
import BackupAndSyncView from './BackupAndSyncView';
import BetaHubView from './BetaHubView';

interface JelajahiViewProps {
  workbooks: Workbook[];
  onDownloadWorkbook: (id: string) => void;
  onOpenWorkbook: (id: string) => void;
  themeColor: string;
  purchases?: PurchaseRecord[];
  onAddPurchase?: (wbId: string, pricePaid: number, discountApplied: number, paymentMethod: string) => void;
  onPublishWorkbook?: (newWb: Workbook) => void;
  onUpdateWorkbook?: (updatedWb: Workbook) => void;

  // Backup states with fallbacks
  financeRecords?: any[];
  setFinanceRecords?: (val: any[]) => void;
  taskRecords?: any[];
  setTaskRecords?: (val: any[]) => void;
  habitRecords?: any[];
  setHabitRecords?: (val: any[]) => void;
  crmRecords?: any[];
  setCrmRecords?: (val: any[]) => void;
  tradingRecords?: any[];
  setTradingRecords?: (val: any[]) => void;
  okrRecords?: any[];
  setOkrRecords?: (val: any[]) => void;
  relationshipRecords?: any[];
  setRelationshipRecords?: (val: any[]) => void;
  sharedContacts?: any[];
  setSharedContacts?: (val: any[]) => void;
  goals?: any[];
  setGoals?: (val: any[]) => void;
  activity?: any[];
  setActivity?: (val: any[]) => void;
}

export default function JelajahiView({
  workbooks,
  onDownloadWorkbook,
  onOpenWorkbook,
  themeColor,
  purchases = [],
  onAddPurchase = () => {},
  onPublishWorkbook = () => {},
  onUpdateWorkbook = () => {},

  // Backup state fallbacks
  financeRecords = [],
  setFinanceRecords = () => {},
  taskRecords = [],
  setTaskRecords = () => {},
  habitRecords = [],
  setHabitRecords = () => {},
  crmRecords = [],
  setCrmRecords = () => {},
  tradingRecords = [],
  setTradingRecords = () => {},
  okrRecords = [],
  setOkrRecords = () => {},
  relationshipRecords = [],
  setRelationshipRecords = () => {},
  sharedContacts = [],
  setSharedContacts = () => {},
  goals = [],
  setGoals = () => {},
  activity = [],
  setActivity = () => {}
}: JelajahiViewProps) {
  
  // Tab level state
  const [activeTab, setActiveTab] = useState<'store' | 'backup' | 'publisher' | 'admin' | 'beta'>('store');

  // Asset Marketplace types: workbook, langpack, themepack, iconpack
  const [assetType, setAssetType] = useState<'workbook' | 'langpack' | 'themepack' | 'iconpack'>('workbook');
  const [installedAssets, setInstalledAssets] = useState<string[]>(['ase-lang-id', 'ase-lang-en', 'ase-theme-midnight', 'ase-icon-minimal']);
  const [checkoutAsset, setCheckoutAsset] = useState<{ id: string; type: 'langpack' | 'themepack' | 'iconpack'; price: number; title: string; locale?: string } | null>(null);

  const mockLanguagePacks = [
    {
      id: 'ase-lang-id',
      name: 'Bahasa Indonesia',
      locale: 'id',
      version: '1.0.0',
      publisher: 'ASE Core Team',
      description: 'Standard Indonesian language localization package for the ASE workspace interface.',
      downloads: '12,400',
      rating: 4.9,
      price: 0,
      isCore: true
    },
    {
      id: 'ase-lang-en',
      name: 'English (Canonical)',
      locale: 'en',
      version: '1.0.0',
      publisher: 'ASE Core Team',
      description: 'Canonical baseline terminology and English UI layout controls.',
      downloads: '18,900',
      rating: 5.0,
      price: 0,
      isCore: true
    },
    {
      id: 'ase-lang-de',
      name: 'Deutsch (German)',
      locale: 'de',
      version: '1.1.2',
      publisher: 'Hans Schmidt',
      description: 'Complete German translation package with smart fallback-chain to English.',
      downloads: '3,200',
      rating: 4.8,
      price: 19000,
      originalPrice: 29000
    },
    {
      id: 'ase-lang-es',
      name: 'Español (Spanish)',
      locale: 'es',
      version: '1.0.5',
      publisher: 'Carlos Santana',
      description: 'Full Spanish translation package for the global ASE developer community.',
      downloads: '4,100',
      rating: 4.7,
      price: 19000,
      originalPrice: 25000
    },
    {
      id: 'ase-lang-ja',
      name: '日本語 (Japanese)',
      locale: 'ja',
      version: '2.0.1',
      publisher: 'Kenji Takahashi',
      description: 'Complete Japanese localization package for international enterprise workspaces.',
      downloads: '2,500',
      rating: 4.9,
      price: 29000
    }
  ];

  const mockThemePacks = [
    {
      id: 'ase-theme-midnight',
      name: 'Midnight Slate',
      publisher: 'ASE Design Team',
      description: 'Ultra-dark slate look with deep gold accents for late-night developers.',
      downloads: '8,400',
      rating: 4.8,
      price: 0
    },
    {
      id: 'ase-theme-nordic',
      name: 'Nordic Frost',
      publisher: 'Astrid Lindgren',
      description: 'Clean Scandinavian snow theme with pastel blue accents.',
      downloads: '5,200',
      rating: 4.9,
      price: 15000
    },
    {
      id: 'ase-theme-cyberpunk',
      name: 'Cyberpunk Neon',
      publisher: 'Neo Tokyo Devs',
      description: 'Retro-futurism neon theme with hot pink and cyan indicators.',
      downloads: '9,100',
      rating: 4.6,
      price: 25000,
      originalPrice: 35000
    }
  ];

  const mockIconPacks = [
    {
      id: 'ase-icon-minimal',
      name: 'Minimal Mono Line',
      publisher: 'Linus Torvalds',
      description: 'Super elegant single-line monochrome icons for focused environments.',
      downloads: '6,100',
      rating: 4.9,
      price: 0
    },
    {
      id: 'ase-icon-duotone',
      name: 'Duotone Pastel',
      publisher: 'Figma Lovers',
      description: 'Two-color soft pastel icons for a beautiful and friendly layout.',
      downloads: '4,800',
      rating: 4.8,
      price: 15000
    },
    {
      id: 'ase-icon-playful',
      name: 'Playful Bubble',
      publisher: 'Pixar Fan',
      description: 'Rounded bubbly friendly icons for gamified workspace models.',
      downloads: '3,200',
      rating: 4.7,
      price: 19000
    }
  ];

  // Network Offline/Online simulation state
  const [isOnline, setIsOnline] = useState(true);
  const [syncingState, setSyncingState] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Subscriptions Level
  const [subscriptionTier, setSubscriptionTier] = useState<'None' | 'Bulanan' | 'Tahunan' | 'Lifetime'>('None');
  const [subscriptionStatus, setSubscriptionStatus] = useState<'Inactive' | 'Active' | 'Trial'>('Inactive');

  // Interactive Banners State (Admin editable)
  const [banners, setBanners] = useState([
    { id: 'b1', title: '💥 FLASH SALE: Keuangan Pribadi Diskon 50%!', image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400', linkWbId: 'wb-keuangan' },
    { id: 'b2', title: '⭐ BUNDEL SUKSES UMKM: CRM + Growth OS Hemat 35%', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400', linkWbId: 'bundle-umkm' }
  ]);

  // Categories list State (Admin editable)
  const [categories, setCategories] = useState(['Semua', 'Keuangan', 'Produktivitas', 'Bisnis', 'Trading', 'Planner', 'Pribadi']);

  // Promo Code State (Admin editable)
  const [promoCodes, setPromoCodes] = useState([
    { code: 'DISKON20', type: 'percent' as const, value: 20, description: 'Potongan belanja 20% tanpa minimum.' },
    { code: 'HEMAT50', type: 'percent' as const, value: 50, description: 'Voucher spesial diskon 50% coret!' },
    { code: 'CASHBACK10', type: 'nominal' as const, value: 10000, description: 'Diskon langsung tunai Rp 10.000' },
    { code: 'FLASH15', type: 'percent' as const, value: 15, description: 'Diskon kilat flash sale 15% off.' },
    { code: 'EARLYACCESS', type: 'percent' as const, value: 10, description: 'Diskon khusus early access 10%.' },
    { code: 'GRATISSEMENTARA', type: 'percent' as const, value: 100, description: 'Lisensi gratis uji coba 100% discount.' }
  ]);

  // User Favorites (Bookmark)
  const [favorites, setFavorites] = useState<string[]>(['wb-keuangan']);

  // State filtering & catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [selectedCuration, setSelectedCuration] = useState<'Semua' | 'Rekomendasi' | 'Populer' | 'Terbaru' | 'Promo' | 'Bundle' | 'Favorit' | 'Trending'>('Semua');

  // Navigation focus view
  const [selectedWorkbookId, setSelectedWorkbookId] = useState<string | null>(null);
  const [selectedPublisherId, setSelectedPublisherId] = useState<string | null>(null);

  // Checkout Dialog State
  const [checkoutWbId, setCheckoutWbId] = useState<string | null>(null);
  const [appliedPromo, setAppliedPromo] = useState<string>('');
  const [promoError, setPromoError] = useState<string>('');
  const [promoDiscount, setPromoDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<string>('qris');

  // FAQ Accordion toggles
  const [faqOpenIdx, setFaqOpenIdx] = useState<number | null>(null);

  // Helper formatting IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Handle manual/auto Sync trigger
  const triggerAutoSync = () => {
    if (!isOnline) {
      alert('Anda sedang offline. Aktifkan internet terlebih dahulu!');
      return;
    }
    setSyncingState('syncing');
    setTimeout(() => {
      setSyncingState('success');
      setTimeout(() => setSyncingState('idle'), 2000);
    }, 1500);
  };

  // Subscribe Gold Pass Membership
  const handleUpgradeSubscription = (tier: 'Bulanan' | 'Tahunan' | 'Lifetime') => {
    setSubscriptionTier(tier);
    setSubscriptionStatus('Active');
    alert(`Selamat! Anda telah berlangganan Paket ${tier} Gold Pass. Semua buku kerja berbayar kini dapat langsung Anda aktifkan GRATIS!`);
  };

  // Toggle user bookmarked favorite
  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (favorites.includes(id)) {
      setFavorites(prev => prev.filter(item => item !== id));
    } else {
      setFavorites(prev => [...prev, id]);
    }
  };

  // Filter logic across Categories, Curations, and Search Queries
  const getFilteredWorkbooks = () => {
    return workbooks.filter((wb) => {
      // 1. Text Search matching title, author, category
      const matchesSearch = 
        wb.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        wb.category.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category Matching
      const matchesCategory = selectedCategory === 'Semua' || wb.category === selectedCategory;

      // 3. Curation tabs matching
      let matchesCuration = true;
      if (selectedCuration === 'Rekomendasi') {
        matchesCuration = wb.rating >= 4.8;
      } else if (selectedCuration === 'Populer') {
        matchesCuration = (wb.downloadsCount || 0) > 400 || wb.rating >= 4.9;
      } else if (selectedCuration === 'Terbaru') {
        matchesCuration = wb.version === 'v1.0.0' || wb.title.includes('OS') || wb.title.includes('Shared');
      } else if (selectedCuration === 'Promo') {
        matchesCuration = !!wb.originalPrice && wb.originalPrice > wb.price;
      } else if (selectedCuration === 'Favorit') {
        matchesCuration = favorites.includes(wb.id);
      } else if (selectedCuration === 'Trending') {
        matchesCuration = (wb.downloadsCount || 0) > 800 || wb.id === 'wb-keuangan';
      } else if (selectedCuration === 'Bundle') {
        // Special bundles display
        matchesCuration = wb.category === 'Bisnis' || wb.category === 'Keuangan';
      }

      // Hide withdrawn workbooks from the store view
      const isVisible = wb.licenseStatus !== 'Kedaluwarsa';

      return matchesSearch && matchesCategory && matchesCuration && isVisible;
    });
  };

  // Apply Coupon Code during Checkout
  const handleApplyPromoCode = () => {
    const codeClean = appliedPromo.trim().toUpperCase();
    const foundPromo = promoCodes.find(p => p.code === codeClean);
    if (foundPromo) {
      setPromoError('');
      setPromoDiscount(foundPromo.value);
    } else {
      setPromoError('Kode promo salah atau kedaluwarsa!');
      setPromoDiscount(0);
    }
  };

  // Complete Single Purchase checkout
  const handleConfirmPurchase = () => {
    if (!checkoutWbId) return;

    if (checkoutWbId === 'bundle-umkm') {
      // Handle custom bundle deal
      onAddPurchase('wb-crm', 39000, 10000, paymentMethod);
      onAddPurchase('wb-keuangan', 29000, 10000, paymentMethod);
      onDownloadWorkbook('wb-crm');
      onDownloadWorkbook('wb-keuangan');
      alert('Pembelian Bundel UMKM berhasil! Kedua modul (CRM & Keuangan) telah diaktifkan di perpustakaan Anda.');
      setCheckoutWbId(null);
      return;
    }

    const wb = workbooks.find(w => w.id === checkoutWbId);
    if (!wb) return;

    // Calculate final payment cost
    const basePrice = wb.price || 0;
    let finalCost = basePrice;
    let discountVal = 0;

    if (promoDiscount > 0) {
      const foundPromo = promoCodes.find(p => p.code === appliedPromo.toUpperCase());
      if (foundPromo) {
        if (foundPromo.type === 'percent') {
          discountVal = Math.round((basePrice * foundPromo.value) / 100);
          finalCost = Math.max(0, basePrice - discountVal);
        } else {
          discountVal = foundPromo.value;
          finalCost = Math.max(0, basePrice - discountVal);
        }
      }
    }

    onAddPurchase(wb.id, finalCost, discountVal, paymentMethod);
    onDownloadWorkbook(wb.id);

    setCheckoutWbId(null);
    setAppliedPromo('');
    setPromoDiscount(0);
    alert(`Transaksi Berhasil! Workbook "${wb.title}" telah diaktifkan secara resmi.`);
  };

  // Refund Purchase handler helper (Admin triggers this)
  const handleRefundPurchase = (txId: string) => {
    const matchTxIndex = purchases.findIndex(p => p.id === txId);
    if (matchTxIndex !== -1) {
      const tx = purchases[matchTxIndex];
      const updatedPurchases = [...purchases];
      updatedPurchases[matchTxIndex] = {
        ...tx,
        status: 'Gagal' // updates status to Gagal to flag refund
      };
      
      // Revoke ownership
      const wb = workbooks.find(w => w.id === tx.workbookId);
      if (wb) {
        onUpdateWorkbook({
          ...wb,
          isDownloaded: false,
          progress: 0
        });
      }
    }
  };

  // Dynamic values based on active focus book details
  const activeDetailWorkbook = workbooks.find(w => w.id === selectedWorkbookId);

  // Mock problems solved and faqs if missing
  const getWorkbookProblems = (wb: Workbook) => {
    // @ts-ignore
    if (wb.problemsSolved && wb.problemsSolved.length > 0) return wb.problemsSolved;
    if (wb.category === 'Keuangan') return ['Mengalami kebocoran anggaran kas bulanan', 'Impulse buying yang menguras tabungan', 'Kurangnya rekap dana darurat yang rapi'];
    if (wb.category === 'Produktivitas') return ['Sering menunda pekerjaan penting (Prokrastinasi)', 'Beban mental karena tumpukan tugas tak terarah', 'Kehilangan fokus harian'];
    return ['Kesulitan memonitor kemajuan secara berkala', 'Bekerja tanpa visualisasi data metrik riil', 'Pencatatan manual yang rentan hilang'];
  };

  const getWorkbookFaq = (wb: Workbook) => {
    // @ts-ignore
    if (wb.faq && wb.faq.length > 0) return wb.faq;
    return [
      { q: 'Apakah modul ini memerlukan koneksi internet?', a: 'Tidak. Modul ini offline-first, semua formula dan hitungan berjalan lokal di browser Anda.' },
      { q: 'Bagaimana cara melakukan ekspor/cetak laporan?', a: 'Gunakan tombol ekspor di menu atas buku kerja Anda untuk mengubah data menjadi format spreadsheet atau PDF.' }
    ];
  };

  return (
    <div className="bg-slate-50 min-h-screen font-sans">
      
      {/* OFFLINE NETWORK STATUS STRIP */}
      <div className="bg-slate-900 text-slate-100 py-1.5 px-3.5 flex justify-between items-center text-[10px] border-b border-slate-800">
        <div className="flex items-center gap-1.5 font-bold">
          {isOnline ? (
            <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5 text-emerald-500 animate-pulse" /> Online</span>
          ) : (
            <span className="flex items-center gap-1 text-amber-500"><WifiOff className="w-3.5 h-3.5" /> Offline-Mode</span>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {syncingState === 'syncing' ? (
            <span className="text-amber-400 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Auto-syncing...</span>
          ) : syncingState === 'success' ? (
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">✓ Cloud Synced</span>
          ) : (
            <button 
              onClick={triggerAutoSync}
              className="text-slate-400 hover:text-white font-extrabold text-[9px] uppercase cursor-pointer"
            >
              🔄 Sync
            </button>
          )}

          {/* Network Switcher button for immediate testing */}
          <button 
            onClick={() => {
              setIsOnline(!isOnline);
              if (!isOnline) {
                setSyncingState('syncing');
                setTimeout(() => {
                  setSyncingState('success');
                  setTimeout(() => setSyncingState('idle'), 2000);
                }, 1000);
              }
            }} 
            className="text-[8px] bg-slate-800 hover:bg-slate-700 px-1.5 py-0.5 rounded text-slate-300 font-black cursor-pointer"
          >
            TEST {isOnline ? 'OFFLINE' : 'ONLINE'}
          </button>
        </div>
      </div>

      {/* PERSISTENT HEADER NAV */}
      <div className="bg-white p-3.5 flex justify-between items-center border-b border-slate-200">
        <div>
          <h1 className="text-sm font-black tracking-tight text-slate-800 flex items-center gap-1 uppercase">
            <Compass className="w-4.5 h-4.5 text-emerald-600" /> ASE STORE
          </h1>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Workbook Marketplace</p>
        </div>

        {/* Global tab Switcher */}
        <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button
            onClick={() => {
              setActiveTab('store');
              setSelectedWorkbookId(null);
              setSelectedPublisherId(null);
            }}
            className={`py-1 px-2.5 text-[9px] font-black rounded-md transition-all ${
              activeTab === 'store' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            🏬 Store
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`py-1 px-2.5 text-[9px] font-black rounded-md transition-all ${
              activeTab === 'backup' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            🔄 Sync/Cloud
          </button>
          <button
            onClick={() => setActiveTab('publisher')}
            className={`py-1 px-2.5 text-[9px] font-black rounded-md transition-all ${
              activeTab === 'publisher' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            👨‍💻 Penerbit
          </button>
          <button
            onClick={() => setActiveTab('admin')}
            className={`py-1 px-2.5 text-[9px] font-black rounded-md transition-all ${
              activeTab === 'admin' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            🛡️ Admin
          </button>
          <button
            onClick={() => setActiveTab('beta')}
            className={`py-1 px-2.5 text-[9px] font-black rounded-md transition-all ${
              activeTab === 'beta' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500'
            }`}
          >
            📦 Beta Hub
          </button>
        </div>
      </div>

      {/* --- MOUNTED SUB VIEW RENDERER --- */}

      {/* 0. BETA PLATFORM HUB */}
      {activeTab === 'beta' && (
        <BetaHubView themeColor={themeColor} />
      )}
      
      {/* 1. CLOUD SYNC & BACKUP */}
      {activeTab === 'backup' && (
        <BackupAndSyncView
          workbooks={workbooks}
          onUpdateWorkbook={onUpdateWorkbook}
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
          themeColor={themeColor}
          goals={goals}
          setGoals={setGoals}
          activity={activity}
          setActivity={setActivity}
        />
      )}

      {/* 2. PUBLISHER CONSOLE */}
      {activeTab === 'publisher' && (
        <PublisherCenterView
          workbooks={workbooks}
          onPublishWorkbook={onPublishWorkbook}
          onUpdateWorkbook={onUpdateWorkbook}
          purchases={purchases}
          themeColor={themeColor}
          categories={categories}
        />
      )}

      {/* 3. ROOT ADMIN CONSOLE */}
      {activeTab === 'admin' && (
        <AdminConsoleView
          workbooks={workbooks}
          onUpdateWorkbook={onUpdateWorkbook}
          purchases={purchases}
          onRefundPurchase={handleRefundPurchase}
          categories={categories}
          onAddCategory={(newCat) => setCategories(prev => [...prev, newCat])}
          promoCodes={promoCodes}
          onAddPromoCode={(newPromo) => setPromoCodes(prev => [...prev, newPromo])}
          banners={banners}
          onAddBanner={(newBanner) => setBanners(prev => [...prev, newBanner])}
          onDeleteBanner={(id) => setBanners(prev => prev.filter(b => b.id !== id))}
          themeColor={themeColor}
        />
      )}

      {/* 4. MAIN STOREFRONT VIEW */}
      {activeTab === 'store' && (
        <>
          {/* VIEW: PUBLISHER PROFILE VIEW */}
          {selectedPublisherId && (
            <div className="p-4 space-y-4 animate-fade-in">
              <button 
                onClick={() => setSelectedPublisherId(null)}
                className="text-slate-500 font-extrabold text-[10px] flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI KE CATALOG
              </button>

              <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm space-y-4 text-center">
                <div className="w-16 h-16 bg-slate-900 text-emerald-400 rounded-full mx-auto flex items-center justify-center font-black text-lg">
                  {selectedPublisherId.substring(0, 2).toUpperCase()}
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-sm text-slate-800">{selectedPublisherId}</h3>
                  <span className="text-[9px] bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold border border-emerald-100">
                    Penerbit Terverifikasi ASE
                  </span>
                  <p className="text-[10px] text-slate-400 font-medium">Spesialis Modul Keuangan & Manajemen Alur Kerja Profesional.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-b border-slate-50 py-3 font-bold text-slate-500">
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase block">Total Modul</span>
                    <span className="text-slate-800 font-black text-xs">{workbooks.filter(w => w.author === selectedPublisherId).length}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase block">Rating Rata-rata</span>
                    <span className="text-slate-800 font-black text-xs">★ 4.9</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[8px] uppercase block">Jumlah Pengguna</span>
                    <span className="text-slate-800 font-black text-xs">4.2K+</span>
                  </div>
                </div>

                <div className="space-y-1 text-left text-[9px] text-slate-400 font-semibold leading-relaxed">
                  <p>🌐 Website: <strong className="text-slate-600">https://publisher.aseb.io</strong></p>
                  <p>📬 Kontak: <strong className="text-slate-600">contact@penerbit.ase</strong></p>
                  <p>📍 Lokasi: <strong className="text-slate-600">Jakarta, Indonesia</strong></p>
                </div>
              </div>

              {/* Publisher books list */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider pl-1">Modul Diterbitkan oleh {selectedPublisherId}</h4>
                <div className="grid grid-cols-2 gap-3">
                  {workbooks.filter(w => w.author === selectedPublisherId).map((wb) => (
                    <div 
                      key={wb.id} 
                      onClick={() => {
                        setSelectedWorkbookId(wb.id);
                        setSelectedPublisherId(null);
                      }}
                      className="bg-white p-3 rounded-2xl border border-slate-100 shadow-xs cursor-pointer hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[8px] bg-slate-100 text-slate-600 font-black px-1.5 py-0.5 rounded uppercase">{wb.category}</span>
                        <h5 className="font-extrabold text-[11px] text-slate-800 leading-tight">{wb.title}</h5>
                        <p className="text-[9px] text-slate-400 line-clamp-2">{wb.description}</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-50 text-[10px] font-extrabold text-slate-800">
                        <span>{wb.price === 0 ? 'Gratis' : formatRupiah(wb.price || 0)}</span>
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* VIEW: WORKBOOK DETAIL OVERLAY */}
          {selectedWorkbookId && activeDetailWorkbook && (
            <div className="p-4 space-y-4 animate-fade-in">
              <button 
                onClick={() => setSelectedWorkbookId(null)}
                className="text-slate-500 font-extrabold text-[10px] flex items-center gap-1 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> KEMBALI KE STORE
              </button>

              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                {/* Header Cover Banner */}
                <div className="bg-slate-900 text-white p-5 space-y-3 relative">
                  <div className="absolute top-0 right-0 p-12 bg-emerald-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">
                      {activeDetailWorkbook.category}
                    </span>
                    <button 
                      onClick={(e) => toggleFavorite(activeDetailWorkbook.id, e)}
                      className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Heart className={`w-4.5 h-4.5 ${favorites.includes(activeDetailWorkbook.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-sm font-black tracking-tight leading-tight">{activeDetailWorkbook.title}</h2>
                    <button 
                      onClick={() => {
                        setSelectedPublisherId(activeDetailWorkbook.author);
                        setSelectedWorkbookId(null);
                      }}
                      className="text-[9px] text-emerald-400 font-bold hover:underline block text-left"
                    >
                      Penerbit: {activeDetailWorkbook.author}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 text-[9px] text-slate-400 font-semibold pt-1">
                    <span>★ {activeDetailWorkbook.rating} ({activeDetailWorkbook.downloadsCount || 140} Pengguna)</span>
                    <span>Versi {activeDetailWorkbook.version}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Tentang Modul Ini</h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{activeDetailWorkbook.description}</p>
                  </div>

                  {/* MASALAH YANG DISELESAIKAN (PROBLEMS SOLVED) */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100/50 space-y-2">
                    <h4 className="text-[10px] font-black text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
                      <Zap className="w-4 h-4 text-amber-500" /> Masalah Yang Diselesaikan
                    </h4>
                    <ul className="space-y-1.5 text-[10px] text-slate-500 font-bold leading-relaxed pl-0.5">
                      {getWorkbookProblems(activeDetailWorkbook).map((prob: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-500 mt-0.5">•</span>
                          <span>{prob}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* KEY FEATURES */}
                  <div className="space-y-1.5">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Fitur Kunci</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {activeDetailWorkbook.features?.map((ft, fIdx) => (
                        <span key={fIdx} className="text-[9px] bg-slate-100 text-slate-600 font-extrabold px-2.5 py-1 rounded-lg">
                          ✓ {ft}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* INPUT / OUTPUT CONTRACT */}
                  <div className="grid grid-cols-2 gap-3 text-[9px] font-bold text-slate-600">
                    <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Input yang Dibutuhkan</span>
                      <p className="text-slate-800 mt-1 line-clamp-2">{activeDetailWorkbook.input?.join(', ') || '-'}</p>
                    </div>
                    <div className="border border-slate-100 p-3 rounded-2xl bg-slate-50/50">
                      <span className="text-[8px] text-slate-400 uppercase tracking-wider block">Output Analitis</span>
                      <p className="text-emerald-800 mt-1 line-clamp-2">{activeDetailWorkbook.output?.join(', ') || '-'}</p>
                    </div>
                  </div>

                  {/* COLLAPSIBLE ACCORDION FAQS */}
                  <div className="space-y-2 pt-1">
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Bantuan & FAQ</h3>
                    <div className="space-y-1.5">
                      {getWorkbookFaq(activeDetailWorkbook).map((faq: any, idx: number) => (
                        <div key={idx} className="border border-slate-100 rounded-xl overflow-hidden text-[10px] font-semibold">
                          <button
                            onClick={() => setFaqOpenIdx(faqOpenIdx === idx ? null : idx)}
                            className="w-full text-left p-3 bg-slate-50/60 hover:bg-slate-100 flex justify-between items-center text-slate-800 cursor-pointer"
                          >
                            <span>💡 {faq.q}</span>
                            <ChevronRight className={`w-3.5 h-3.5 text-slate-400 transition-transform ${faqOpenIdx === idx ? 'rotate-90' : ''}`} />
                          </button>
                          {faqOpenIdx === idx && (
                            <div className="p-3 bg-white border-t border-slate-100 text-slate-500 leading-relaxed font-medium">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* USER REVIEWS SECTION */}
                  <div className="space-y-3 pt-1 border-t border-slate-100">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Ulasan Pembeli ({activeDetailWorkbook.reviews?.length || 0})</h4>
                    
                    <div className="space-y-2.5">
                      {activeDetailWorkbook.reviews?.map((rev, rIdx) => (
                        <div key={rev.id || rIdx} className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 space-y-1.5">
                          <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-800">{rev.user}</span>
                            <span className="text-[8px] text-slate-400">{rev.date}</span>
                          </div>
                          
                          <div className="flex text-amber-500">
                            {Array.from({ length: 5 }).map((_, starIdx) => (
                              <Star key={starIdx} className={`w-2.5 h-2.5 ${starIdx < rev.rating ? 'fill-amber-500' : 'text-slate-200'}`} />
                            ))}
                          </div>
                          
                          <p className="text-[10px] text-slate-600 font-medium leading-relaxed">"{rev.text}"</p>

                          {/* Show Publisher response if any */}
                          {rev.reply && (
                            <div className="mt-2 p-2.5 bg-emerald-50 text-emerald-900 border border-emerald-100 rounded-xl text-[9px] font-semibold leading-relaxed">
                              💬 <strong>Balasan Penerbit:</strong> "{rev.reply}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CORE BUTTON ACTIONS */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      {activeDetailWorkbook.originalPrice && activeDetailWorkbook.originalPrice > activeDetailWorkbook.price ? (
                        <div className="space-y-0.5">
                          <span className="text-[8px] bg-red-100 text-red-600 font-black px-1.5 py-0.2 rounded uppercase">Hemat Sale!</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-black text-slate-800">{formatRupiah(activeDetailWorkbook.price || 0)}</span>
                            <span className="text-[9px] text-slate-400 font-bold line-through">{formatRupiah(activeDetailWorkbook.originalPrice)}</span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-slate-800 block">
                          {activeDetailWorkbook.price === 0 ? 'Gratis' : formatRupiah(activeDetailWorkbook.price || 0)}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      {/* If the book is already downloaded, open it */}
                      {activeDetailWorkbook.isDownloaded ? (
                        <button
                          onClick={() => {
                            onOpenWorkbook(activeDetailWorkbook.id);
                            setSelectedWorkbookId(null);
                          }}
                          className="px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black rounded-xl cursor-pointer transition-all flex items-center gap-1 shadow-sm"
                        >
                          <PlayCircle className="w-4.5 h-4.5 text-emerald-400" /> Buka Workbook
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            // Require authentication for commercial workbooks
                            if (activeDetailWorkbook.price > 0 && !IdentityModule.getCurrentSession()) {
                              alert('⚠️ Otentikasi Diperlukan!\nAnda harus melakukan login dengan Google terlebih dahulu di menu Pengaturan untuk dapat bertransaksi lisensi premium.');
                              return;
                            }
                            
                            // Gold membership bypasses normal checkout fees
                            if (subscriptionTier !== 'None' || activeDetailWorkbook.price === 0) {
                              onDownloadWorkbook(activeDetailWorkbook.id);
                              alert('Workbook berhasil diaktifkan secara instan!');
                            } else {
                              setCheckoutWbId(activeDetailWorkbook.id);
                            }
                          }}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-xl cursor-pointer transition-all shadow-md"
                        >
                          {subscriptionTier !== 'None' ? 'Aktifkan (Gold Pass)' : activeDetailWorkbook.price === 0 ? 'Aktifkan Workbook' : 'Beli & Aktifkan'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW: DEFAULT STORE GRID */}
          {!selectedWorkbookId && !selectedPublisherId && (
            <div className="p-4 space-y-4 animate-fade-in">
              
              {/* ASSET TYPE TAB SELECTOR */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  onClick={() => setAssetType('workbook')}
                  className={`flex-1 py-2 px-1 text-[9.5px] font-black rounded-xl transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                    assetType === 'workbook' ? 'bg-white text-slate-800 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  📚 Workbook
                </button>
                <button
                  onClick={() => setAssetType('langpack')}
                  className={`flex-1 py-2 px-1 text-[9.5px] font-black rounded-xl transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                    assetType === 'langpack' ? 'bg-white text-slate-800 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🌍 Paket Bahasa
                </button>
                <button
                  onClick={() => setAssetType('themepack')}
                  className={`flex-1 py-2 px-1 text-[9.5px] font-black rounded-xl transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                    assetType === 'themepack' ? 'bg-white text-slate-800 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🎨 Tema Visual
                </button>
                <button
                  onClick={() => setAssetType('iconpack')}
                  className={`flex-1 py-2 px-1 text-[9.5px] font-black rounded-xl transition-all flex items-center justify-center gap-0.5 cursor-pointer ${
                    assetType === 'iconpack' ? 'bg-white text-slate-800 shadow-xs border border-slate-150' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  🧩 Ikon Paket
                </button>
              </div>

              {assetType === 'workbook' && (
                <>
                  {/* STORE HIGHLIGHT BANNER CAROUSEL */}
                  <div className="overflow-hidden rounded-3xl relative border border-slate-200">
                    <div className="bg-slate-900 text-white p-4.5 flex items-center justify-between gap-4 relative">
                      <div className="space-y-1.5 relative z-10 max-w-[70%]">
                        <span className="text-[8px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-1.5 py-0.5 rounded font-black uppercase">
                          PROMO UNGGULAN
                        </span>
                        <h3 className="font-extrabold text-[11px] leading-tight text-white">{banners[0]?.title}</h3>
                        <p className="text-[8px] text-slate-400 font-semibold">Tingkatkan efisiensi pengelolaan kas Anda hari ini.</p>
                      </div>
                      <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-700 shrink-0">
                        <img src={banners[0]?.image} alt="Banner promotion" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    </div>
                  </div>

                  {/* SUBSCRIPTION PROMO CONTAINER (GOLD PASS) */}
                  <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4.5 rounded-3xl space-y-3 shadow-md relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 p-10 bg-white/10 rounded-full blur-xl"></div>
                    
                    <div className="flex justify-between items-start relative z-10">
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-black tracking-tight flex items-center gap-1">
                          <Award className="w-4.5 h-4.5 text-white" /> ASE GOLD PASS MEMBERSHIP
                        </h3>
                        <p className="text-[9px] text-amber-100 font-bold uppercase tracking-wider">Akses Tanpa Batas Modul Premium</p>
                      </div>
                      <span className="text-[8px] bg-slate-900/30 text-white border border-white/20 px-2 py-0.5 rounded uppercase font-extrabold">
                        GOLD PASS
                      </span>
                    </div>

                    <p className="text-[10px] text-amber-50 leading-relaxed font-semibold relative z-10">
                      Langganan keanggotaan Gold Pass untuk membuka seluruh katalog buku kerja premium tanpa bayar satuan!
                    </p>

                    {subscriptionTier !== 'None' ? (
                      <div className="p-2.5 bg-slate-900/10 rounded-xl flex justify-between items-center text-[9px] font-bold">
                        <span>✓ Status: Aktif ({subscriptionTier})</span>
                        <button 
                          onClick={() => {
                            setSubscriptionTier('None');
                            setSubscriptionStatus('Inactive');
                            alert('Berlangganan dibatalkan.');
                          }}
                          className="text-red-100 underline text-[8px]"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-4 gap-1.5 pt-1 relative z-10 font-bold text-[8px]">
                        <button
                          onClick={() => handleUpgradeSubscription('Bulanan')}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                        >
                          Bln (Rp 29k)
                        </button>
                        <button
                          onClick={() => handleUpgradeSubscription('Tahunan')}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                        >
                          Thn (Rp 199k)
                        </button>
                        <button
                          onClick={() => handleUpgradeSubscription('Lifetime')}
                          className="py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg cursor-pointer"
                        >
                          Life (Rp 499k)
                        </button>
                        <button
                          onClick={() => {
                            setSubscriptionTier('Bulanan');
                            setSubscriptionStatus('Trial');
                            alert('Selamat! Free trial 3 hari diaktifkan. Nikmati akses Gold Pass instan.');
                          }}
                          className="py-1.5 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-lg cursor-pointer font-black border border-amber-300"
                        >
                          Coba 3-Hari Free
                        </button>
                      </div>
                    )}
                  </div>

                  {/* SEARCH & FILTERS CONTROLLER */}
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari modul, penerbit, kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2.5 pl-9 pr-4 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none"
                      />
                    </div>

                    {/* Categories Scrollbar */}
                    <div className="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`py-1.5 px-3 text-[10px] font-black rounded-lg shrink-0 transition-all uppercase tracking-wider ${
                            selectedCategory === cat 
                              ? 'bg-slate-900 text-white shadow-xs' 
                              : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>

                    {/* CURATION BADGE TABS (Rekomendasi, Populer, dll.) */}
                    <div className="flex gap-1 overflow-x-auto no-scrollbar bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[8px] font-black">
                      {(['Semua', 'Rekomendasi', 'Populer', 'Terbaru', 'Promo', 'Bundle', 'Favorit', 'Trending'] as const).map((cur) => (
                        <button
                          key={cur}
                          onClick={() => setSelectedCuration(cur)}
                          className={`py-1 px-2.5 rounded-md shrink-0 transition-all ${
                            selectedCuration === cur 
                              ? 'bg-white text-slate-800 shadow-2xs' 
                              : 'text-slate-500'
                          }`}
                        >
                          {cur}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SPECIAL FEATURED BUNDLE PROMO BOX */}
                  {selectedCuration === 'Bundle' && (
                    <div className="bg-slate-900 text-white p-4 rounded-3xl border border-slate-800 space-y-3 shadow-md">
                      <span className="text-[7px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.5 rounded font-black uppercase">
                        PILIHAN BUNDEL UTAMA
                      </span>
                      <div>
                        <h4 className="font-extrabold text-xs text-white leading-tight">Bundel Sukses UMKM Profesional</h4>
                        <p className="text-[9px] text-slate-400 mt-0.5">Gabungan CRM Bisnis + Keuangan Sederhana untuk melipatgandakan omset.</p>
                      </div>
                      <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                        <div className="space-y-0.5">
                          <span className="text-xs font-black text-emerald-400">Rp 49.000</span>
                          <span className="text-[8px] text-slate-400 line-through block font-bold">Rp 68.000 (Hemat 35%)</span>
                        </div>
                        <button
                          onClick={() => setCheckoutWbId('bundle-umkm')}
                          className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black cursor-pointer transition-all"
                        >
                          Beli Bundel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* WORKBOOKS CATALOGUE GRID */}
                  <div className="grid grid-cols-2 gap-3">
                    {getFilteredWorkbooks().length > 0 ? (
                      getFilteredWorkbooks().map((wb) => {
                        const isDownloaded = wb.isDownloaded;
                        return (
                          <div
                            key={wb.id}
                            onClick={() => setSelectedWorkbookId(wb.id)}
                            className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-2xs hover:shadow-sm cursor-pointer transition-shadow flex flex-col justify-between space-y-2 relative"
                          >
                            {/* Bookmark favorite absolute top corner */}
                            <button 
                              onClick={(e) => toggleFavorite(wb.id, e)}
                              className="absolute top-2.5 right-2.5 text-slate-300 hover:text-red-500 transition-colors z-20 cursor-pointer"
                            >
                              <Heart className={`w-3.5 h-3.5 ${favorites.includes(wb.id) ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>

                            <div className="space-y-1.5">
                              <span className="text-[8px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase">
                                {wb.category}
                              </span>
                              
                              <h4 className="font-black text-[11px] text-slate-800 leading-tight pr-4 line-clamp-1">
                                {wb.title}
                              </h4>
                              
                              <span className="text-[8px] text-slate-400 font-bold block">
                                Oleh: {wb.author}
                              </span>

                              <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed">
                                {wb.description}
                              </p>
                            </div>

                            {/* Price footer bar */}
                            <div className="flex justify-between items-center pt-2.5 border-t border-slate-50 text-[10px] font-extrabold text-slate-800">
                              <div>
                                {wb.originalPrice && wb.originalPrice > wb.price ? (
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] text-slate-800">{formatRupiah(wb.price || 0)}</span>
                                    <span className="text-[8px] text-slate-400 line-through">{formatRupiah(wb.originalPrice)}</span>
                                  </div>
                                ) : (
                                  <span>{wb.price === 0 ? 'Gratis' : formatRupiah(wb.price || 0)}</span>
                                )}
                              </div>

                              <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                                isDownloaded 
                                  ? 'bg-emerald-50 text-emerald-700' 
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {isDownloaded ? 'TERPASANG' : 'DAPATKAN'}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="col-span-2 bg-white p-10 rounded-3xl border border-dashed border-slate-300 text-center space-y-2">
                        <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                        <h4 className="text-xs font-bold text-slate-700">Modul Tidak Ditemukan</h4>
                        <p className="text-[10px] text-slate-400 font-medium">Coba gunakan filter kata kunci lain.</p>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* LANGUAGE PACKS CATALOGUE */}
              {assetType === 'langpack' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-4.5 rounded-3xl space-y-2 border border-slate-800 shadow-md">
                    <span className="text-[7.5px] bg-indigo-500/30 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded font-black uppercase">
                      i18n Platform Service
                    </span>
                    <h3 className="font-extrabold text-xs text-white leading-tight">Paket Bahasa Ekosistem Platform</h3>
                    <p className="text-[9.5px] text-slate-300 leading-normal font-medium">
                      Pasang paket bahasa tambahan yang didesain secara modular oleh komunitas pengembang global. Setiap paket bahasa memisahkan terminology canonical dari runtime dengan label lokalisasi UI.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {mockLanguagePacks.map((pkg) => {
                      const isInstalled = installedAssets.includes(pkg.id);
                      return (
                        <div key={pkg.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs flex justify-between items-center gap-3">
                          <div className="space-y-1 max-w-[70%] text-left">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-[10px] bg-slate-100 text-slate-800 font-extrabold px-1.5 py-0.5 rounded">
                                {pkg.locale.toUpperCase()}
                              </span>
                              <h4 className="font-black text-xs text-slate-800 leading-tight">
                                {pkg.name}
                              </h4>
                              {pkg.isCore && (
                                <span className="text-[7px] bg-emerald-50 text-emerald-700 font-black px-1 py-0.2 rounded border border-emerald-100">
                                  CORE BASE
                                </span>
                              )}
                            </div>
                            <p className="text-[9px] text-slate-400 font-bold block">
                              Oleh: {pkg.publisher} • Versi {pkg.version}
                            </p>
                            <p className="text-[9px] text-slate-500 leading-normal font-medium">
                              {pkg.description}
                            </p>
                            <div className="text-[8px] text-slate-400 font-bold">
                              ★ {pkg.rating} • {pkg.downloads} Unduhan
                            </div>
                          </div>

                          <div className="text-right space-y-1 shrink-0">
                            <span className="text-xs font-black text-slate-800 block">
                              {pkg.price === 0 ? 'Gratis' : formatRupiah(pkg.price)}
                            </span>
                            {isInstalled ? (
                              <span className="inline-block text-[8px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-lg">
                                AKTIF
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (pkg.price === 0) {
                                    if (pkg.locale === 'de') {
                                      LanguageRegistry.registerLanguagePack({
                                        manifest: { id: "ase-lang-de", language: "de", version: "1.1.2", publisher: "Hans Schmidt" },
                                        translations: {
                                          "concept.workbook": "Arbeitsmappe",
                                          "concept.resource": "Ressource",
                                          "concept.workflow": "Arbeitsablauf",
                                          "concept.decisionEngine": "Entscheidungs-Engine",
                                          "concept.guardian": "Wächter (Guardian)",
                                          "concept.marketplace": "Marktplatz",
                                          "concept.dashboard": "Instrumententafel (Dashboard)",
                                          "concept.module": "Modul",
                                          "concept.api": "Schnittstelle (API)",
                                          "concept.runtime": "Laufzeit",
                                          "concept.sandbox": "Sandkasten",
                                          "concept.sdk": "SDK",
                                          "concept.cli": "Kommandozeile (CLI)",
                                          "workbook.install": "Arbeitsmappe installieren",
                                          "workbook.remove": "Arbeitsmappe entfernen",
                                          "workflow.run": "Workflow ausführen",
                                          "guardian.validation": "Wächter-Validierung",
                                          "screen.home": "Startseite",
                                          "screen.myWorkbooks": "Meine Arbeitsmappen",
                                          "screen.explore": "Marktplatz",
                                          "screen.summary": "Zusammenfassung",
                                          "screen.settings": "Einstellungen",
                                          "settings.language": "App-Sprache",
                                          "settings.selectLanguage": "Sprache auswählen"
                                        }
                                      });
                                    }
                                    setInstalledAssets(prev => [...prev, pkg.id]);
                                    alert(`Paket bahasa "${pkg.name}" berhasil diunduh dan dipasang secara instan di sandbox runtime!`);
                                  } else {
                                    if (!IdentityModule.getCurrentSession()) {
                                      alert('⚠️ Otentikasi Diperlukan!\nAnda harus melakukan login dengan Google terlebih dahulu di menu Pengaturan untuk dapat mengunduh paket bahasa premium.');
                                      return;
                                    }
                                    setCheckoutAsset({ id: pkg.id, type: 'langpack', price: pkg.price, title: pkg.name, locale: pkg.locale });
                                  }
                                }}
                                className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white text-[9px] font-black rounded-lg cursor-pointer transition-all"
                              >
                                Dapatkan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* THEME PACKS CATALOGUE */}
              {assetType === 'themepack' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-teal-900 to-slate-900 text-white p-4.5 rounded-3xl space-y-2 border border-slate-800 shadow-md">
                    <span className="text-[7.5px] bg-teal-500/30 text-teal-300 border border-teal-500/20 px-2 py-0.5 rounded font-black uppercase">
                      UI Visual Styling
                    </span>
                    <h3 className="font-extrabold text-xs text-white leading-tight">Tema Warna Modular</h3>
                    <p className="text-[9.5px] text-slate-300 leading-normal font-medium">
                      Bosan dengan tema standar? Unduh skema warna tambahan untuk mempersonalisasi lingkungan kerja Anda hulu ke hilir.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {mockThemePacks.map((pkg) => {
                      const isInstalled = installedAssets.includes(pkg.id);
                      return (
                        <div key={pkg.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs flex justify-between items-center gap-3">
                          <div className="space-y-1 max-w-[70%] text-left">
                            <h4 className="font-black text-xs text-slate-800 leading-tight">
                              {pkg.name}
                            </h4>
                            <p className="text-[9px] text-slate-400 font-bold block">
                              Oleh: {pkg.publisher}
                            </p>
                            <p className="text-[9px] text-slate-500 leading-normal font-medium">
                              {pkg.description}
                            </p>
                            <div className="text-[8px] text-slate-400 font-bold">
                              ★ 4.8 • {pkg.downloads} Unduhan
                            </div>
                          </div>

                          <div className="text-right space-y-1 shrink-0">
                            <span className="text-xs font-black text-slate-800 block">
                              {pkg.price === 0 ? 'Gratis' : formatRupiah(pkg.price)}
                            </span>
                            {isInstalled ? (
                              <span className="inline-block text-[8px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-lg">
                                AKTIF
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (pkg.price === 0) {
                                    setInstalledAssets(prev => [...prev, pkg.id]);
                                    alert(`Tema visual "${pkg.name}" berhasil diterapkan!`);
                                  } else {
                                    if (!IdentityModule.getCurrentSession()) {
                                      alert('⚠️ Otentikasi Diperlukan!\nAnda harus melakukan login dengan Google terlebih dahulu di menu Pengaturan untuk dapat mengunduh tema kustom premium.');
                                      return;
                                    }
                                    setCheckoutAsset({ id: pkg.id, type: 'themepack', price: pkg.price, title: pkg.name });
                                  }
                                }}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[9px] font-black rounded-lg cursor-pointer transition-all"
                              >
                                Dapatkan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ICON PACKS CATALOGUE */}
              {assetType === 'iconpack' && (
                <div className="space-y-3">
                  <div className="bg-gradient-to-br from-amber-900 to-slate-900 text-white p-4.5 rounded-3xl space-y-2 border border-slate-800 shadow-md">
                    <span className="text-[7.5px] bg-amber-500/30 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase">
                      Component Branded Icons
                    </span>
                    <h3 className="font-extrabold text-xs text-white leading-tight">Paket Ikon Kustom</h3>
                    <p className="text-[9.5px] text-slate-300 leading-normal font-medium">
                      Unduh dan ganti representasi ikon bawaan Lucide dengan karya kustom dari komunitas desainer eksternal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    {mockIconPacks.map((pkg) => {
                      const isInstalled = installedAssets.includes(pkg.id);
                      return (
                        <div key={pkg.id} className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-2xs flex justify-between items-center gap-3">
                          <div className="space-y-1 max-w-[70%] text-left">
                            <h4 className="font-black text-xs text-slate-800 leading-tight">
                              {pkg.name}
                            </h4>
                            <p className="text-[9px] text-slate-400 font-bold block">
                              Oleh: {pkg.publisher}
                            </p>
                            <p className="text-[9px] text-slate-500 leading-normal font-medium">
                              {pkg.description}
                            </p>
                            <div className="text-[8px] text-slate-400 font-bold">
                              ★ 4.9 • {pkg.downloads} Unduhan
                            </div>
                          </div>

                          <div className="text-right space-y-1 shrink-0">
                            <span className="text-xs font-black text-slate-800 block">
                              {pkg.price === 0 ? 'Gratis' : formatRupiah(pkg.price)}
                            </span>
                            {isInstalled ? (
                              <span className="inline-block text-[8px] bg-emerald-50 text-emerald-700 font-black px-2.5 py-1 rounded-lg">
                                AKTIF
                              </span>
                            ) : (
                              <button
                                onClick={() => {
                                  if (pkg.price === 0) {
                                    setInstalledAssets(prev => [...prev, pkg.id]);
                                    alert(`Paket ikon "${pkg.name}" berhasil dipasang!`);
                                  } else {
                                    if (!IdentityModule.getCurrentSession()) {
                                      alert('⚠️ Otentikasi Diperlukan!\nAnda harus melakukan login dengan Google terlebih dahulu di menu Pengaturan untuk dapat mengunduh paket ikon premium.');
                                      return;
                                    }
                                    setCheckoutAsset({ id: pkg.id, type: 'iconpack', price: pkg.price, title: pkg.name });
                                  }
                                }}
                                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-[9px] font-black rounded-lg cursor-pointer transition-all"
                              >
                                Dapatkan
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* --- CHECKOUT & BILLING DIALOG OVERLAY --- */}
      {checkoutWbId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-3xl max-w-sm w-full space-y-4 shadow-xl animate-scale-up text-xs font-bold text-slate-600">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-800 uppercase tracking-wide">Konfirmasi Pembelian</h3>
              <button 
                onClick={() => {
                  setCheckoutWbId(null);
                  setAppliedPromo('');
                  setPromoDiscount(0);
                }} 
                className="text-slate-400 hover:text-slate-800 font-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Workbook brief */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Workbook Yang Dibeli</span>
              <p className="text-slate-800 font-extrabold text-[11px]">
                {checkoutWbId === 'bundle-umkm' ? 'Bundel Sukses UMKM Profesional (CRM + Keuangan)' : workbooks.find(w => w.id === checkoutWbId)?.title}
              </p>
              <p className="text-[9px] text-slate-400 font-semibold">
                Satu kali bayar, akses penuh seumur hidup beserta pembaruan gratis.
              </p>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <label className="text-[8px] text-slate-400 font-extrabold uppercase pl-0.5">Kode Voucher Promo</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Masukkan Voucher (Contoh: DISKON20)"
                  value={appliedPromo}
                  onChange={(e) => setAppliedPromo(e.target.value)}
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold uppercase focus:outline-none"
                />
                <button
                  onClick={handleApplyPromoCode}
                  disabled={!appliedPromo.trim()}
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer"
                >
                  Gunakan
                </button>
              </div>
              {promoError && <span className="text-[8px] text-red-500 block">⚠️ {promoError}</span>}
              {promoDiscount > 0 && <span className="text-[8px] text-emerald-600 block">✓ Promo berhasil digunakan! Diskon terhitung.</span>}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[8px] text-slate-400 font-extrabold uppercase pl-0.5">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 border rounded-xl font-black ${
                    paymentMethod === 'qris' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  QRIS / DANA
                </button>
                <button
                  onClick={() => setPaymentMethod('gopay')}
                  className={`py-2 border rounded-xl font-black ${
                    paymentMethod === 'gopay' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  GOPAY
                </button>
                <button
                  onClick={() => setPaymentMethod('shopeepay')}
                  className={`py-2 border rounded-xl font-black ${
                    paymentMethod === 'shopeepay' ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  SHOPEEPAY
                </button>
              </div>
            </div>

            {/* Calculations recap */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[10px] leading-relaxed">
              <div className="flex justify-between font-semibold text-slate-400">
                <span>Harga Lisensi</span>
                <span>
                  {checkoutWbId === 'bundle-umkm' 
                    ? formatRupiah(49000) 
                    : formatRupiah(workbooks.find(w => w.id === checkoutWbId)?.price || 0)}
                </span>
              </div>
              
              {promoDiscount > 0 && (
                <div className="flex justify-between font-bold text-red-500">
                  <span>Diskon Promo</span>
                  <span>
                    {promoCodes.find(p => p.code === appliedPromo.toUpperCase())?.type === 'percent'
                      ? `-${promoDiscount}%`
                      : `-${formatRupiah(promoDiscount)}`}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-black text-slate-800 text-xs border-t border-dashed border-slate-100 pt-1.5 mt-1">
                <span>Total Bayar</span>
                <span className="text-emerald-700">
                  {(() => {
                    const basePrice = checkoutWbId === 'bundle-umkm' ? 49000 : (workbooks.find(w => w.id === checkoutWbId)?.price || 0);
                    if (promoDiscount > 0) {
                      const foundPromo = promoCodes.find(p => p.code === appliedPromo.toUpperCase());
                      if (foundPromo) {
                        if (foundPromo.type === 'percent') {
                          return formatRupiah(Math.max(0, basePrice - Math.round((basePrice * foundPromo.value) / 100)));
                        } else {
                          return formatRupiah(Math.max(0, basePrice - foundPromo.value));
                        }
                      }
                    }
                    return formatRupiah(basePrice);
                  })()}
                </span>
              </div>
            </div>

            <button
              onClick={handleConfirmPurchase}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-xl cursor-pointer transition-all shadow-md"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}

      {/* --- ASSET CHECKOUT & BILLING DIALOG OVERLAY --- */}
      {checkoutAsset && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-5 rounded-3xl max-w-sm w-full space-y-4 shadow-xl animate-scale-up text-xs font-bold text-slate-600">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-800 uppercase tracking-wide text-xs">Konfirmasi Aset</h3>
              <button 
                onClick={() => {
                  setCheckoutAsset(null);
                }} 
                className="text-slate-400 hover:text-slate-800 font-black text-sm"
              >
                ✕
              </button>
            </div>

            {/* Asset brief */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase">Aset Yang Dibeli</span>
              <p className="text-slate-800 font-extrabold text-[11px]">
                {checkoutAsset.title} ({checkoutAsset.type === 'langpack' ? 'Paket Bahasa' : checkoutAsset.type === 'themepack' ? 'Tema Visual' : 'Ikon Paket'})
              </p>
              <p className="text-[9px] text-slate-400 font-semibold">
                Satu kali bayar untuk mengaktifkan aset kustom ini di sandbox runtime.
              </p>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-1.5">
              <label className="text-[8px] text-slate-400 font-extrabold uppercase pl-0.5">Pilih Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2 text-center text-[9px]">
                <button
                  onClick={() => setPaymentMethod('qris')}
                  className={`py-2 border rounded-xl font-black cursor-pointer ${
                    paymentMethod === 'qris' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  QRIS / DANA
                </button>
                <button
                  onClick={() => setPaymentMethod('gopay')}
                  className={`py-2 border rounded-xl font-black cursor-pointer ${
                    paymentMethod === 'gopay' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  GOPAY
                </button>
                <button
                  onClick={() => setPaymentMethod('shopeepay')}
                  className={`py-2 border rounded-xl font-black cursor-pointer ${
                    paymentMethod === 'shopeepay' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 bg-slate-50 text-slate-500'
                  }`}
                >
                  SHOPEEPAY
                </button>
              </div>
            </div>

            {/* Calculations recap */}
            <div className="border-t border-slate-100 pt-3 space-y-1.5 text-[10px] leading-relaxed">
              <div className="flex justify-between font-semibold text-slate-400">
                <span>Harga Lisensi</span>
                <span>{formatRupiah(checkoutAsset.price)}</span>
              </div>
              <div className="flex justify-between font-black text-slate-800 text-xs border-t border-dashed border-slate-100 pt-1.5 mt-1">
                <span>Total Bayar</span>
                <span className="text-emerald-700">{formatRupiah(checkoutAsset.price)}</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (checkoutAsset.type === 'langpack') {
                  if (checkoutAsset.locale === 'de') {
                    LanguageRegistry.registerLanguagePack({
                      manifest: { id: "ase-lang-de", language: "de", version: "1.1.2", publisher: "Hans Schmidt" },
                      translations: {
                        "concept.workbook": "Arbeitsmappe",
                        "concept.resource": "Ressource",
                        "concept.workflow": "Arbeitsablauf",
                        "concept.decisionEngine": "Entscheidungs-Engine",
                        "concept.guardian": "Wächter (Guardian)",
                        "concept.marketplace": "Marktplatz",
                        "concept.dashboard": "Instrumententafel (Dashboard)",
                        "concept.module": "Modul",
                        "concept.api": "Schnittstelle (API)",
                        "concept.runtime": "Laufzeit",
                        "concept.sandbox": "Sandkasten",
                        "concept.sdk": "SDK",
                        "concept.cli": "Kommandozeile (CLI)",
                        "workbook.install": "Arbeitsmappe installieren",
                        "workbook.remove": "Arbeitsmappe entfernen",
                        "workflow.run": "Workflow ausführen",
                        "guardian.validation": "Wächter-Validierung",
                        "screen.home": "Startseite",
                        "screen.myWorkbooks": "Meine Arbeitsmappen",
                        "screen.explore": "Marktplatz",
                        "screen.summary": "Zusammenfassung",
                        "screen.settings": "Einstellungen",
                        "settings.language": "App-Sprache",
                        "settings.selectLanguage": "Sprache auswählen"
                      }
                    });
                  } else if (checkoutAsset.locale === 'es') {
                    LanguageRegistry.registerLanguagePack({
                      manifest: { id: "ase-lang-es", language: "es", version: "1.0.5", publisher: "Carlos Santana" },
                      translations: {
                        "concept.workbook": "Libro de trabajo",
                        "concept.resource": "Recurso",
                        "concept.workflow": "Flujo de trabajo",
                        "concept.decisionEngine": "Motor de Decisión",
                        "concept.guardian": "Guardián",
                        "concept.marketplace": "Mercado",
                        "concept.dashboard": "Tablero (Dashboard)",
                        "concept.module": "Módulo",
                        "concept.api": "Interfaz (API)",
                        "concept.runtime": "Tiempo de ejecución",
                        "concept.sandbox": "Caja de arena",
                        "concept.sdk": "SDK",
                        "concept.cli": "CLI",
                        "workbook.install": "Instalar Libro de Trabajo",
                        "workbook.remove": "Quitar Libro de Trabajo",
                        "workflow.run": "Ejecutar Flujo de Trabajo",
                        "guardian.validation": "Validación de Guardián",
                        "screen.home": "Inicio",
                        "screen.myWorkbooks": "Mis Libros de Trabajo",
                        "screen.explore": "Explorar Mercado",
                        "screen.summary": "Resumen",
                        "screen.settings": "Configuración",
                        "settings.language": "Idioma de la aplicação",
                        "settings.selectLanguage": "Seleccione el idioma"
                      }
                    });
                  } else if (checkoutAsset.locale === 'ja') {
                    LanguageRegistry.registerLanguagePack({
                      manifest: { id: "ase-lang-ja", language: "ja", version: "2.0.1", publisher: "Kenji Takahashi" },
                      translations: {
                        "concept.workbook": "ワークブック",
                        "concept.resource": "リソース",
                        "concept.workflow": "ワークフロー",
                        "concept.decisionEngine": "意思決定エンジン",
                        "concept.guardian": "ガーディアン",
                        "concept.marketplace": "マーケットプレイス",
                        "concept.dashboard": "ダッシュボード",
                        "concept.module": "モジュール",
                        "concept.api": "API",
                        "concept.runtime": "ランタイム",
                        "concept.sandbox": "サンドボックス",
                        "concept.sdk": "SDK",
                        "concept.cli": "CLI",
                        "workbook.install": "ワークブックをインストール",
                        "workbook.remove": "ワークブックを削除",
                        "workflow.run": "ワークフローを実行",
                        "guardian.validation": "ガーディアン検証",
                        "screen.home": "ホーム",
                        "screen.myWorkbooks": "マイワークブック",
                        "screen.explore": "マーケットプレイスを探索",
                        "screen.summary": "概要と進行状況",
                        "screen.settings": "設定",
                        "settings.language": "アプリの言語",
                        "settings.selectLanguage": "主言語を選択"
                      }
                    });
                  }
                }
                setInstalledAssets(prev => [...prev, checkoutAsset.id]);
                alert(`Pembelian Berhasil! Aset "${checkoutAsset.title}" telah diaktifkan secara resmi.`);
                setCheckoutAsset(null);
              }}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[10px] rounded-xl cursor-pointer transition-all shadow-md"
            >
              Bayar Sekarang
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

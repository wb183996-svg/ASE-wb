/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Shield, 
  Check, 
  X, 
  Trash2, 
  Plus, 
  Tag, 
  Users, 
  TrendingUp, 
  BadgePercent, 
  Image, 
  UserX, 
  RotateCcw, 
  Search,
  BookOpen,
  FolderPlus,
  ArrowRightLeft
} from 'lucide-react';
import { Workbook, PurchaseRecord } from '../types';
import { IdentityModule } from '../core/IdentityService';

interface AdminConsoleViewProps {
  workbooks: Workbook[];
  onUpdateWorkbook: (wb: Workbook) => void;
  purchases: PurchaseRecord[];
  onRefundPurchase: (txId: string) => void;
  categories: string[];
  onAddCategory: (category: string) => void;
  promoCodes: { code: string; type: 'percent' | 'nominal'; value: number; description: string }[];
  onAddPromoCode: (promo: { code: string; type: 'percent' | 'nominal'; value: number; description: string }) => void;
  banners: { id: string; title: string; image: string; linkWbId: string }[];
  onAddBanner: (banner: { id: string; title: string; image: string; linkWbId: string }) => void;
  onDeleteBanner: (id: string) => void;
  themeColor: string;
}

export default function AdminConsoleView({
  workbooks,
  onUpdateWorkbook,
  purchases,
  onRefundPurchase,
  categories,
  onAddCategory,
  promoCodes,
  onAddPromoCode,
  banners,
  onAddBanner,
  onDeleteBanner,
  themeColor
}: AdminConsoleViewProps) {
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'review' | 'publishers' | 'users' | 'transactions' | 'config'>('review');

  // Category State
  const [newCategoryName, setNewCategoryName] = useState('');

  // Promo State
  const [newPromoCode, setNewPromoCode] = useState('');
  const [newPromoType, setNewPromoType] = useState<'percent' | 'nominal'>('percent');
  const [newPromoValue, setNewPromoValue] = useState<number>(0);
  const [newPromoDesc, setNewPromoDesc] = useState('');

  // Banner State
  const [newBannerTitle, setNewBannerTitle] = useState('');
  const [newBannerImage, setNewBannerImage] = useState('');
  const [newBannerWbId, setNewBannerWbId] = useState('');

  // Publisher Search
  const [pubSearch, setPubSearch] = useState('');
  const [suspendedPublishers, setSuspendedPublishers] = useState<string[]>([]);

  // Rejection Modals
  const [rejectionWbId, setRejectionWbId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  // Pre-loaded simulated publishers
  const initialPublishers = [
    { id: 'p1', name: 'ASE Finance Core Team', mail: 'finance@ase.io', workbooks: 2, users: 1420, downloads: 3500, rating: 4.9 },
    { id: 'p2', name: 'ASE Productivity Team', mail: 'prod@ase.io', workbooks: 1, users: 980, downloads: 2100, rating: 4.8 },
    { id: 'p3', name: 'ASE Stock & Crypto Lab', mail: 'trading@ase.io', workbooks: 1, users: 420, downloads: 850, rating: 4.6 },
    { id: 'p4', name: 'Penerbit Mandiri (Anda)', mail: 'user@gmail.com', workbooks: 1, users: 0, downloads: 0, rating: 5.0 }
  ];

  // Pre-loaded simulated users
  const session = IdentityModule.getCurrentSession();
  const currentEmail = session?.user?.email || 'guest@ase.dev';
  const currentName = session?.user?.name || 'Prasetyo (Tamu)';
  const currentRole = session?.user?.role || 'Profesional Kreatif';

  const simulatedUsers = [
    { id: 'u1', name: `${currentName} (${currentEmail})`, role: currentRole, minutes: 190, activeBooks: 2, lastActive: 'Hari ini' },
    { id: 'u2', name: 'Andi Santoso', role: 'Pelajar / Mahasiswa', minutes: 340, activeBooks: 1, lastActive: 'Kemarin' },
    { id: 'u3', name: 'Rina Marlina', role: 'Ibu Rumah Tangga', minutes: 80, activeBooks: 1, lastActive: '3 Hari Lalu' },
    { id: 'u4', name: 'Toni Kurniawan', role: 'Wirausaha', minutes: 620, activeBooks: 3, lastActive: 'Hari ini' }
  ];

  // Helper formatting IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Handle Approve Workbook
  const handleApprove = (wb: Workbook) => {
    onUpdateWorkbook({
      ...wb,
      licenseStatus: wb.price && wb.price > 0 ? 'Belum Dimiliki' : 'Gratis',
      // We set version logs to confirm approval
      updateHistory: [
        { version: wb.version || 'v1.0.0', date: 'Hari ini', note: 'Modul disetujui oleh admin dan diterbitkan secara resmi.' },
        ...(wb.updateHistory || [])
      ]
    });
    alert(`Workbook "${wb.title}" telah disetujui dan diterbitkan di store!`);
  };

  // Handle Open Rejection Dialogue
  const handleOpenReject = (wbId: string) => {
    setRejectionWbId(wbId);
    setRejectionReason('');
  };

  // Handle Confirm Rejection
  const handleConfirmReject = () => {
    if (!rejectionWbId) return;
    const wb = workbooks.find(w => w.id === rejectionWbId);
    if (wb) {
      onUpdateWorkbook({
        ...wb,
        licenseStatus: 'Kedaluwarsa', // Serves as rejected/disabled marker in app
        version: `${wb.version || 'v1.0.0'} (Ditolak)`,
        updateHistory: [
          { version: 'Ditolak', date: 'Hari ini', note: `Ditolak Admin: ${rejectionReason || 'Tidak memenuhi kriteria kelayakan.'}` },
          ...(wb.updateHistory || [])
        ]
      });
      alert(`Workbook "${wb.title}" telah ditolak dengan alasan: ${rejectionReason}`);
    }
    setRejectionWbId(null);
    setRejectionReason('');
  };

  // Handle Toggle Deactivation of Active Book
  const handleToggleDeactivate = (wb: Workbook) => {
    const isCurrentlyDeactivated = wb.licenseStatus === 'Kedaluwarsa';
    onUpdateWorkbook({
      ...wb,
      licenseStatus: isCurrentlyDeactivated ? (wb.price && wb.price > 0 ? 'Belum Dimiliki' : 'Gratis') : 'Kedaluwarsa'
    });
    alert(`Workbook "${wb.title}" berhasil ${isCurrentlyDeactivated ? 'diaktifkan kembali' : 'dinonaktifkan'}!`);
  };

  // Handle Add Category
  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    if (categories.includes(newCategoryName.trim())) {
      alert('Kategori sudah ada!');
      return;
    }
    onAddCategory(newCategoryName.trim());
    setNewCategoryName('');
    alert('Kategori baru berhasil ditambahkan!');
  };

  // Handle Add Promo Code
  const handleAddPromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromoCode.trim() || newPromoValue <= 0) return;
    onAddPromoCode({
      code: newPromoCode.trim().toUpperCase(),
      type: newPromoType,
      value: newPromoValue,
      description: newPromoDesc || `${newPromoType === 'percent' ? `${newPromoValue}%` : formatRupiah(newPromoValue)} potongan belanja.`
    });
    setNewPromoCode('');
    setNewPromoValue(0);
    setNewPromoDesc('');
    alert(`Promo Code ${newPromoCode.toUpperCase()} berhasil dibuat!`);
  };

  // Handle Add Banner
  const handleAddBannerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBannerTitle.trim()) return;
    onAddBanner({
      id: 'banner-' + Date.now(),
      title: newBannerTitle.trim(),
      image: newBannerImage.trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400',
      linkWbId: newBannerWbId
    });
    setNewBannerTitle('');
    setNewBannerImage('');
    setNewBannerWbId('');
    alert('Banner promosi store berhasil ditambahkan!');
  };

  // Toggle Publisher block
  const handleToggleSuspendPublisher = (pubName: string) => {
    if (suspendedPublishers.includes(pubName)) {
      setSuspendedPublishers(prev => prev.filter(p => p !== pubName));
      alert(`Blokir terhadap Publisher "${pubName}" dicabut.`);
    } else {
      setSuspendedPublishers(prev => [...prev, pubName]);
      alert(`Publisher "${pubName}" berhasil ditangguhkan/diblokir.`);
    }
  };

  // Filtered reviews/approvals
  // In our app, books where ' Anda ' publishes or has pending review status.
  // Let's assume books are in review if they are either marked (Ditolak) or published by komunity, or let's show all books with option to manage.
  const reviewQueue = workbooks.filter(w => w.author.includes('Penerbit') || w.author.includes('Anda') || w.title.includes('Khas') || w.id.startsWith('wb-pub-'));

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* Admin Title Banner */}
      <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <div>
            <h2 className="text-sm font-black tracking-tight">KONSOL CONTROL ADMIN</h2>
            <p className="text-[9px] text-slate-400 font-bold">ASE Workbook Core Platform</p>
          </div>
        </div>
        <span className="text-[9px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded font-black uppercase">
          ROOT ACCESS
        </span>
      </div>

      {/* Admin Dashboard Sub Tabs */}
      <div className="bg-white border-b border-slate-200 p-1 flex gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveAdminSubTab('review')}
          className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg shrink-0 transition-all ${
            activeAdminSubTab === 'review' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          📥 Review Buku ({reviewQueue.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('publishers')}
          className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg shrink-0 transition-all ${
            activeAdminSubTab === 'publishers' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          👨‍💻 Publisher
        </button>
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg shrink-0 transition-all ${
            activeAdminSubTab === 'users' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          👥 Pengguna
        </button>
        <button
          onClick={() => setActiveAdminSubTab('transactions')}
          className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg shrink-0 transition-all ${
            activeAdminSubTab === 'transactions' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          💰 Transaksi ({purchases.length})
        </button>
        <button
          onClick={() => setActiveAdminSubTab('config')}
          className={`py-1.5 px-3 text-[10px] font-extrabold rounded-lg shrink-0 transition-all ${
            activeAdminSubTab === 'config' 
              ? 'bg-slate-900 text-white' 
              : 'text-slate-500 hover:bg-slate-100'
          }`}
        >
          ⚙️ Konten & Promo
        </button>
      </div>

      {/* SUB-SCREEN CONTENT */}
      <div className="p-4 space-y-4">
        {/* TAB 1: WORKBOOK REVIEW PIPELINE */}
        {activeAdminSubTab === 'review' && (
          <div className="space-y-3.5">
            <div className="bg-slate-100 p-3 rounded-xl border border-slate-200 flex gap-2">
              <Shield className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-600 leading-normal font-medium">
                Penerbit independen dapat mengirim modul ke pipeline ini. Tinjau kelayakan isi, parameter input/output, serta formula sebelum diterbitkan secara resmi ke ASE Store.
              </p>
            </div>

            {reviewQueue.length > 0 ? (
              <div className="space-y-3">
                {reviewQueue.map((wb) => {
                  const isRejected = wb.licenseStatus === 'Kedaluwarsa' || wb.version?.includes('Ditolak');
                  const isApproved = wb.licenseStatus !== 'Kedaluwarsa' && !wb.version?.includes('Ditolak') && wb.id.startsWith('wb-pub-');
                  
                  return (
                    <div key={wb.id} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase">
                            {wb.category}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-800 leading-tight mt-1">{wb.title}</h4>
                          <span className="text-[9px] text-slate-400 font-bold block mt-0.5">Penerbit: {wb.author} • v{wb.version || '1.0.0'}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          isRejected 
                            ? 'bg-red-50 text-red-600 border-red-200' 
                            : isApproved 
                              ? 'bg-emerald-50 text-emerald-600 border-emerald-200' 
                              : 'bg-amber-50 text-amber-600 border-amber-200 animate-pulse'
                        }`}>
                          {isRejected ? 'Ditolak' : isApproved ? 'Aktif' : 'Dalam Review'}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed bg-slate-50 p-2.5 rounded-xl">
                        {wb.description}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-500 leading-tight">
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="font-bold text-slate-400 uppercase block">Fitur Utama:</span>
                          <span className="line-clamp-1">{wb.features?.join(', ') || '-'}</span>
                        </div>
                        <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                          <span className="font-bold text-slate-400 uppercase block">Rasio/Harga:</span>
                          <span className="font-bold text-slate-700">{wb.price === 0 ? 'Gratis' : formatRupiah(wb.price || 0)}</span>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex justify-end gap-2 pt-1 border-t border-slate-100">
                        {isRejected ? (
                          <button
                            onClick={() => handleToggleDeactivate(wb)}
                            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black cursor-pointer transition-all"
                          >
                            <RotateCcw className="w-3 h-3 inline mr-1" /> Pulihkan Kembali
                          </button>
                        ) : isApproved ? (
                          <button
                            onClick={() => handleToggleDeactivate(wb)}
                            className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black cursor-pointer transition-all"
                          >
                            <UserX className="w-3 h-3 inline mr-1" /> Nonaktifkan
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={() => handleOpenReject(wb.id)}
                              className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg text-[9px] font-black cursor-pointer transition-all border border-red-100"
                            >
                              <X className="w-3 h-3 inline mr-1" /> Tolak Modul
                            </button>
                            <button
                              onClick={() => handleApprove(wb)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black cursor-pointer transition-all shadow-xs"
                            >
                              <Check className="w-3 h-3 inline mr-1" /> Setujui & Terbitkan
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <Shield className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Pipeline Bersih</h4>
                <p className="text-[10px] text-slate-400 font-medium">Tidak ada pengajuan modul workbook baru untuk direview saat ini.</p>
              </div>
            )}
          </div>
        )}

        {/* REJECTION POPUP */}
        {rejectionWbId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white p-4 rounded-2xl max-w-xs w-full space-y-3.5 shadow-xl animate-scale-up">
              <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wide">Tolak Workbook</h3>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-slate-400 block uppercase">Alasan Penolakan</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan feedback perbaikan, misal: Icon kurang jelas, formula input salah..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-medium focus:outline-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setRejectionWbId(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-bold"
                >
                  Batal
                </button>
                <button
                  onClick={handleConfirmReject}
                  disabled={!rejectionReason.trim()}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[9px] font-black"
                >
                  Kirim Penolakan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PUBLISHERS MANAGEMENT */}
        {activeAdminSubTab === 'publishers' && (
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari publisher berdasarkan nama..."
                value={pubSearch}
                onChange={(e) => setPubSearch(e.target.value)}
                className="w-full py-2 pl-9 pr-4 text-xs bg-white rounded-xl border border-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-3.5">
              {initialPublishers
                .filter(p => p.name.toLowerCase().includes(pubSearch.toLowerCase()))
                .map((pub) => {
                  const isBlocked = suspendedPublishers.includes(pub.name);
                  return (
                    <div key={pub.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-extrabold text-xs text-slate-800 leading-tight">{pub.name}</h4>
                          <span className="text-[9px] text-slate-400 block mt-0.5">{pub.mail}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-md ${
                          isBlocked ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isBlocked ? 'Ditangguhkan' : 'Aktif'}
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-1 pt-1.5 border-t border-slate-50 text-center text-[9px]">
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[7px]">Modul</span>
                          <span className="font-bold text-slate-700">{pub.workbooks}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[7px]">Aktif</span>
                          <span className="font-bold text-slate-700">{pub.users}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[7px]">Download</span>
                          <span className="font-bold text-slate-700">{pub.downloads}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-semibold uppercase text-[7px]">Rating</span>
                          <span className="font-bold text-slate-700">★ {pub.rating}</span>
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          onClick={() => handleToggleSuspendPublisher(pub.name)}
                          className={`px-3 py-1.5 rounded-lg text-[9px] font-black cursor-pointer transition-all ${
                            isBlocked 
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                              : 'bg-red-50 hover:bg-red-100 text-red-600'
                          }`}
                        >
                          {isBlocked ? 'Batalkan Blokir' : 'Blokir Publisher'}
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* TAB 3: USER MANAGEMENT */}
        {activeAdminSubTab === 'users' && (
          <div className="space-y-3">
            <div className="bg-slate-900 text-white p-3 rounded-2xl flex justify-between items-center">
              <div>
                <span className="text-[8px] text-slate-400 uppercase font-black block">Total Pengguna Terdaftar</span>
                <span className="text-sm font-black text-amber-400 mt-0.5 block">{simulatedUsers.length} Akun</span>
              </div>
              <Users className="w-5 h-5 text-amber-400" />
            </div>

            <div className="space-y-3">
              {simulatedUsers.map((userObj) => (
                <div key={userObj.id} className="bg-white p-3 rounded-xl border border-slate-100 shadow-xs space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-slate-800">{userObj.name}</span>
                    <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                      {userObj.role}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[9px] text-slate-400 pt-1.5 border-t border-slate-50 font-semibold">
                    <div>
                      <span>Belajar: </span>
                      <strong className="text-slate-700">{userObj.minutes} mnt</strong>
                    </div>
                    <div>
                      <span>Buku Aktif: </span>
                      <strong className="text-slate-700">{userObj.activeBooks}</strong>
                    </div>
                    <div className="text-right">
                      <span>Log: </span>
                      <strong className="text-slate-700">{userObj.lastActive}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: TRANSACTION & REFUNDS PIPELINE */}
        {activeAdminSubTab === 'transactions' && (
          <div className="space-y-3">
            <div className="bg-white p-4 rounded-2xl border border-slate-100 space-y-1.5 shadow-xs">
              <h3 className="text-[10px] font-extrabold text-slate-400 uppercase">Rekapitulasi Finansial Global</h3>
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase">Omset Transaksi</span>
                  <span className="text-sm font-black text-slate-800 mt-1 block">
                    {formatRupiah(purchases.reduce((acc, curr) => acc + curr.pricePaid, 0))}
                  </span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[8px] text-slate-400 font-bold block uppercase">Jumlah Sukses</span>
                  <span className="text-sm font-black text-slate-800 mt-1 block">{purchases.length} TX</span>
                </div>
              </div>
            </div>

            {purchases.length > 0 ? (
              <div className="space-y-3">
                {purchases.map((pur) => (
                  <div key={pur.id} className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
                    <div className="flex justify-between items-center text-[10px]">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold block uppercase">Transaksi ID</span>
                        <span className="font-extrabold text-slate-800 block">{pur.id}</span>
                      </div>
                      <span className={`text-[8px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                        pur.status === 'Berhasil' 
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                          : 'bg-red-50 text-red-600 border border-red-200'
                      }`}>
                        {pur.status}
                      </span>
                    </div>

                    <div className="text-[10px] font-semibold text-slate-600 leading-snug">
                      <p>Workbook: <strong className="text-slate-800">{pur.workbookTitle}</strong></p>
                      <p>Nominal Bayar: <strong className="text-emerald-700">{formatRupiah(pur.pricePaid)}</strong></p>
                      <p>Metode: <strong className="text-slate-800 uppercase">{pur.paymentMethod}</strong></p>
                      <p className="text-[8px] text-slate-400 mt-1">{pur.purchaseDate}</p>
                    </div>

                    {pur.status === 'Berhasil' && pur.pricePaid > 0 && (
                      <div className="flex justify-end pt-1 border-t border-slate-50">
                        <button
                          onClick={() => {
                            if (window.confirm(`Apakah Anda yakin ingin membatalkan/merefund transaksi ${pur.id}?`)) {
                              onRefundPurchase(pur.id);
                              alert('Transaksi berhasil di-refund, lisensi dicabut!');
                            }
                          }}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-[9px] font-black cursor-pointer border border-red-100"
                        >
                          <RotateCcw className="w-3 h-3 inline mr-1" /> Proses Refund / Batal
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <ArrowRightLeft className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Transaksi</h4>
                <p className="text-[10px] text-slate-400 font-medium">Seluruh log pembayaran terdaftar akan terekam di panel transaksi ini.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: CATEGORIES, PROMO CODE, BANNERS CONFIG */}
        {activeAdminSubTab === 'config' && (
          <div className="space-y-4">
            {/* MANAGE DYNAMIC CATEGORIES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase">
                <FolderPlus className="w-4.5 h-4.5 text-emerald-600" /> Kelola Kategori Store
              </h3>
              
              <form onSubmit={handleAddCategorySubmit} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Nama Kategori Baru"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer"
                >
                  Tambah Kategori
                </button>
              </form>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {categories.map((cat) => (
                  <span key={cat} className="text-[9px] bg-slate-100 border border-slate-200 text-slate-600 font-extrabold px-2 py-1 rounded-full uppercase">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            {/* MANAGE PROMO CODES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase">
                <BadgePercent className="w-4.5 h-4.5 text-emerald-600" /> Buat Kode Voucher Promo
              </h3>

              <form onSubmit={handleAddPromoSubmit} className="space-y-2.5 text-[9px] font-bold text-slate-600">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">KODE VOUCHER *</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: ASEMAX"
                      value={newPromoCode}
                      onChange={(e) => setNewPromoCode(e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold uppercase focus:outline-none"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">Tipe Diskon</label>
                    <select
                      value={newPromoType}
                      onChange={(e) => setNewPromoType(e.target.value as any)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    >
                      <option value="percent">Persentase (%)</option>
                      <option value="nominal">Nominal Tunai (Rp)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">Nilai Diskon *</label>
                    <input
                      type="number"
                      required
                      placeholder="Misal: 15 atau 25000"
                      value={newPromoValue || ''}
                      onChange={(e) => setNewPromoValue(parseInt(e.target.value) || 0)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">Keterangan Singkat</label>
                    <input
                      type="text"
                      placeholder="Hemat Rp 10rb"
                      value={newPromoDesc}
                      onChange={(e) => setNewPromoDesc(e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer transition-all"
                >
                  Terbitkan Voucher Promo Baru
                </button>
              </form>

              {/* Promo code list */}
              <div className="border border-slate-100 rounded-xl p-2.5 bg-slate-50/50 space-y-1.5 text-[9px] font-medium text-slate-500 max-h-32 overflow-y-auto">
                <span className="font-extrabold text-slate-400 uppercase block tracking-wider">Voucher Aktif Sistem</span>
                {promoCodes.map((pr) => (
                  <div key={pr.code} className="flex justify-between items-center border-b border-slate-100/60 pb-1 last:border-0">
                    <span className="font-black text-slate-800 bg-slate-200 px-1 py-0.2 rounded uppercase">{pr.code}</span>
                    <span>{pr.description}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* MANAGE PROMO BANNERS */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
              <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 uppercase">
                <Image className="w-4.5 h-4.5 text-emerald-600" /> Kelola Banner Promosi Store
              </h3>

              <form onSubmit={handleAddBannerSubmit} className="space-y-2.5 text-[9px] font-bold text-slate-600">
                <div className="space-y-0.5">
                  <label className="text-slate-400 uppercase">JUDUL BANNER *</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Diskon Flash 20% Akhir Bulan!"
                    value={newBannerTitle}
                    onChange={(e) => setNewBannerTitle(e.target.value)}
                    className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">Link URL Gambar (Opsional)</label>
                    <input
                      type="text"
                      placeholder="https://..."
                      value={newBannerImage}
                      onChange={(e) => setNewBannerImage(e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <label className="text-slate-400 uppercase">Tautkan ke Workbook</label>
                    <select
                      value={newBannerWbId}
                      onChange={(e) => setNewBannerWbId(e.target.value)}
                      className="w-full py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                    >
                      <option value="">Pilih Workbook</option>
                      {workbooks.map((wb) => (
                        <option key={wb.id} value={wb.id}>{wb.title}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer transition-all"
                >
                  Tambahkan Banner Baru
                </button>
              </form>

              {/* Banners List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                <span className="font-extrabold text-slate-400 uppercase block tracking-wider text-[9px]">Banner Aktif saat ini:</span>
                {banners.map((b) => (
                  <div key={b.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-xl border border-slate-100 text-[9px]">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-6 rounded bg-slate-200 overflow-hidden shrink-0">
                        <img src={b.image} alt={b.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div>
                        <p className="font-extrabold text-slate-800 leading-tight">{b.title}</p>
                        <span className="text-[7px] text-slate-400">Linked Workbook: {b.linkWbId || '-'}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteBanner(b.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

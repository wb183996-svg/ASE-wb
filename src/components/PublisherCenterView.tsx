/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  BarChart3, 
  PlusCircle, 
  Settings, 
  TrendingUp, 
  Star, 
  Clock, 
  CheckCircle2, 
  Database, 
  ArrowRightLeft, 
  HelpCircle, 
  ShieldCheck, 
  Users, 
  BadgePercent, 
  RotateCcw,
  BookOpen,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { Workbook, PurchaseRecord } from '../types';

interface PublisherCenterViewProps {
  workbooks: Workbook[];
  onPublishWorkbook: (newWb: Workbook) => void;
  onUpdateWorkbook: (wb: Workbook) => void;
  purchases: PurchaseRecord[];
  themeColor: string;
  categories: string[];
}

export default function PublisherCenterView({
  workbooks,
  onPublishWorkbook,
  onUpdateWorkbook,
  purchases,
  themeColor,
  categories
}: PublisherCenterViewProps) {
  const [publisherSubTab, setPublisherSubTab] = useState<'dashboard' | 'books' | 'create' | 'reviews'>('dashboard');

  // New book state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState(categories[1] || 'Keuangan');
  const [newDifficulty, setNewDifficulty] = useState<'Pemula' | 'Menengah' | 'Lanjutan'>('Pemula');
  const [newDuration, setNewDuration] = useState('3 Jam');
  const [newPrice, setNewPrice] = useState<number>(0);
  const [newOrigPrice, setNewOrigPrice] = useState<number>(0);
  const [newIcon, setNewIcon] = useState('zap');
  const [newFeatures, setNewFeatures] = useState('Kalkulator Cerdas, Cetak PDF, Sinkronisasi');
  const [newInputs, setNewInputs] = useState('Anggaran Bulanan, Pengeluaran Riil');
  const [newOutputs, setNewOutputs] = useState('Rasio Kesehatan, Batas Belanja harian');
  const [newProblemsSolved, setNewProblemsSolved] = useState('Bocor alus keuangan, Kesulitan menyisihkan dana darurat');
  const [newFaqQ, setNewFaqQ] = useState('Apakah modul ini bisa diakses offline?');
  const [newFaqA, setNewFaqA] = useState('Ya, semua data tersimpan lokal dan sinkron otomatis saat online.');

  // Edit book state
  const [editingWbId, setEditingWbId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>('');
  const [editDiscount, setEditDiscount] = useState<string>('');
  const [editVersion, setEditVersion] = useState<string>('');
  const [editReleaseNote, setEditReleaseNote] = useState<string>('');

  // Review Replies state
  const [replyInputMap, setReplyInputMap] = useState<{ [reviewId: string]: string }>({});

  // Helper formatting IDR
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // List only the workbooks written by "Penerbit Mandiri (Anda)" or custom published
  const publisherBooks = workbooks.filter(w => w.author.includes('Anda') || w.author.includes('Penerbit') || w.id.startsWith('wb-pub-'));

  // Calculate stats based on actual sales records
  // We can see if there are purchases of our published books
  const publisherBookIds = publisherBooks.map(b => b.id);
  const publisherSales = purchases.filter(p => publisherBookIds.includes(p.workbookId) && p.status === 'Berhasil');
  
  const earningsToday = publisherSales.length * 35000 + 49000; // base mock today
  const earningsThisMonth = publisherSales.reduce((acc, curr) => acc + curr.pricePaid, 0) + 1250000;
  const earningsTotal = publisherSales.reduce((acc, curr) => acc + curr.pricePaid, 0) + 3890000;
  const bestSeller = publisherBooks.length > 0 ? publisherBooks[0].title : 'Tidak ada';
  const refundCount = purchases.filter(p => publisherBookIds.includes(p.workbookId) && p.status === 'Gagal').length;
  const activeUsers = publisherBooks.reduce((acc, curr) => acc + (curr.downloadsCount || 120), 0);

  // Submit Draft to Review
  const handleSubmitForReview = (wb: Workbook) => {
    onUpdateWorkbook({
      ...wb,
      licenseStatus: 'Berlangganan' // Serves as "Dalam Review" marker internally
    });
    alert(`Workbook "${wb.title}" telah dikirim ke Admin untuk direview.`);
  };

  // Withdraw (Tarik) Workbook
  const handleWithdrawWorkbook = (wb: Workbook) => {
    onUpdateWorkbook({
      ...wb,
      licenseStatus: 'Kedaluwarsa' // Serves as "Ditarik" marker in store list (filters out from catalog)
    });
    alert(`Workbook "${wb.title}" telah ditarik dari peredaran.`);
  };

  // Publish Once Approved (or republish)
  const handlePublishWorkbookFromDraft = (wb: Workbook) => {
    onUpdateWorkbook({
      ...wb,
      licenseStatus: wb.price && wb.price > 0 ? 'Belum Dimiliki' : 'Gratis'
    });
    alert(`Workbook "${wb.title}" berhasil diterbitkan secara resmi!`);
  };

  // Submit New custom workbook
  const handleCreateNewWorkbookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const generatedId = 'wb-pub-' + Date.now();
    
    // Construct rich workbook with problems solved and accordion FAQs
    const newWbObj: Workbook = {
      id: generatedId,
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      difficulty: newDifficulty,
      duration: newDuration,
      progress: 0,
      coverGradient: 'from-slate-700 to-slate-900',
      author: 'Penerbit Mandiri (Anda)',
      isDownloaded: false,
      rating: 5.0,
      totalChapters: 1,
      version: 'v1.0.0',
      developer: 'Anda (Developer ASE)',
      size: '15 KB',
      icon: newIcon,
      features: newFeatures.split(',').map(s => s.trim()).filter(Boolean),
      input: newInputs.split(',').map(s => s.trim()).filter(Boolean),
      output: newOutputs.split(',').map(s => s.trim()).filter(Boolean),
      price: newPrice,
      originalPrice: newOrigPrice || undefined,
      licenseStatus: 'Berlangganan', // Sets status to "Dalam Review"
      downloadsCount: 0,
      screenshots: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'],
      dashboardPreview: [{ label: 'Modul Aktif', value: '100% Siap' }],
      insightPreview: ['Modul baru terpasang di sistem.'],
      reviews: [
        { id: 'rev-m1', user: 'Fajar Pratama', rating: 5, text: 'Konsep menarik dan sangat ditunggu peluncurannya!', date: 'Baru saja' }
      ],
      updateHistory: [{ version: 'v1.0.0', date: 'Hari ini', note: 'Pengajuan perdana modul baru.' }],
      // Custom extensions
      // @ts-ignore
      problemsSolved: newProblemsSolved.split(',').map(s => s.trim()).filter(Boolean),
      faq: [{ q: newFaqQ.trim(), a: newFaqA.trim() }]
    };

    onPublishWorkbook(newWbObj);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewPrice(0);
    setNewOrigPrice(0);
    
    setPublisherSubTab('books');
    alert(`Workbook "${newTitle}" berhasil dibuat sebagai DRAFT dan dikirim untuk review admin!`);
  };

  // Submit pricing / version changes
  const handleSaveEditBook = (wbId: string) => {
    const wb = workbooks.find(w => w.id === wbId);
    if (!wb) return;

    const updatedPrice = editPrice ? parseInt(editPrice) : wb.price;
    const updatedOrigPrice = editDiscount ? parseInt(editDiscount) : wb.originalPrice;
    const updatedVersion = editVersion ? editVersion : wb.version;

    const newHistory = wb.updateHistory ? [...wb.updateHistory] : [];
    if (editReleaseNote && editVersion) {
      newHistory.unshift({
        version: editVersion,
        date: 'Hari ini',
        note: editReleaseNote
      });
    }

    onUpdateWorkbook({
      ...wb,
      price: updatedPrice,
      originalPrice: updatedOrigPrice,
      version: updatedVersion,
      updateHistory: newHistory
    });

    setEditingWbId(null);
    setEditPrice('');
    setEditDiscount('');
    setEditVersion('');
    setEditReleaseNote('');
    alert('Buku kerja berhasil diperbarui!');
  };

  // Handle submitting a reply to a user review
  const handleReplyReview = (wbId: string, reviewId: string) => {
    const replyText = replyInputMap[reviewId];
    if (!replyText || !replyText.trim()) return;

    const wb = workbooks.find(w => w.id === wbId);
    if (!wb) return;

    const updatedReviews = wb.reviews?.map(rev => {
      if (rev.id === reviewId) {
        return {
          ...rev,
          reply: replyText.trim()
        };
      }
      return rev;
    });

    onUpdateWorkbook({
      ...wb,
      reviews: updatedReviews
    });

    setReplyInputMap(prev => ({ ...prev, [reviewId]: '' }));
    alert('Balasan ulasan berhasil dikirim!');
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      {/* Publisher center subtabs */}
      <div className="bg-white border-b border-slate-200 p-2.5 flex items-center justify-around text-xs font-extrabold shadow-xs">
        <button
          onClick={() => setPublisherSubTab('dashboard')}
          className={`pb-1 px-2 border-b-2 transition-all ${
            publisherSubTab === 'dashboard' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400'
          }`}
        >
          📈 Kinerja Keuangan
        </button>
        <button
          onClick={() => setPublisherSubTab('books')}
          className={`pb-1 px-2 border-b-2 transition-all ${
            publisherSubTab === 'books' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400'
          }`}
        >
          📚 Modul Saya ({publisherBooks.length})
        </button>
        <button
          onClick={() => setPublisherSubTab('create')}
          className={`pb-1 px-2 border-b-2 transition-all ${
            publisherSubTab === 'create' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400'
          }`}
        >
          ➕ Buat Workbook
        </button>
        <button
          onClick={() => setPublisherSubTab('reviews')}
          className={`pb-1 px-2 border-b-2 transition-all ${
            publisherSubTab === 'reviews' ? 'border-emerald-600 text-emerald-800' : 'border-transparent text-slate-400'
          }`}
        >
          💬 Ulasan & Balasan
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* TAB 1: INCOME & KPI DASHBOARD */}
        {publisherSubTab === 'dashboard' && (
          <div className="space-y-4">
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 bg-emerald-500/10 rounded-full blur-2xl"></div>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider font-extrabold relative z-10">
                Penerbit Terverifikasi ASE
              </span>
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">Total Estimasi Pendapatan</span>
                <h3 className="text-2xl font-black text-emerald-400 tracking-tight">{formatRupiah(earningsTotal)}</h3>
                <p className="text-[9px] text-slate-400 font-medium">Berdasarkan aktivasi lisensi digital, dikurangi bagi hasil platform.</p>
              </div>
            </div>

            {/* Income Grid Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[8px] text-slate-400 font-bold block uppercase">Pendapatan Hari Ini</span>
                <span className="text-sm font-black text-slate-800 block mt-1">{formatRupiah(earningsToday)}</span>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm">
                <span className="text-[8px] text-slate-400 font-bold block uppercase">Pendapatan Bulan Ini</span>
                <span className="text-sm font-black text-slate-800 block mt-1">{formatRupiah(earningsThisMonth)}</span>
              </div>
            </div>

            {/* Platform metrics */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 text-center">
                <span className="text-[7px] text-slate-400 font-bold uppercase block">Produk Terlaris</span>
                <span className="text-[9px] font-extrabold text-slate-700 block mt-1 truncate px-0.5">{bestSeller}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 text-center">
                <span className="text-[7px] text-slate-400 font-bold uppercase block">Pengguna Aktif</span>
                <span className="text-[11px] font-black text-slate-800 block mt-1">{activeUsers} Orang</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/80 text-center">
                <span className="text-[7px] text-slate-400 font-bold uppercase block">Retur / Refund</span>
                <span className="text-[11px] font-black text-slate-800 block mt-1">{refundCount} Buku</span>
              </div>
            </div>

            {/* Recent activation logs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2">
              <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Log Aktivasi Terbaru</h4>
              <div className="divide-y divide-slate-100">
                {publisherSales.length > 0 ? (
                  publisherSales.map((sale) => (
                    <div key={sale.id} className="py-2.5 flex justify-between items-center text-[10px]">
                      <div>
                        <span className="font-extrabold text-slate-800 block leading-tight">{sale.workbookTitle}</span>
                        <span className="text-[8px] text-slate-400 font-semibold">{sale.purchaseDate}</span>
                      </div>
                      <span className="font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded text-[9px]">
                        +{formatRupiah(sale.pricePaid)}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center text-slate-400 text-[10px] italic">
                    Belum ada rekod transaksi pembelian berbayar.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MY BOOKS MANAGER & DRAFTS */}
        {publisherSubTab === 'books' && (
          <div className="space-y-4">
            <h3 className="font-extrabold text-sm text-slate-800 pl-1">Daftar Workbook Anda</h3>

            {publisherBooks.length > 0 ? (
              <div className="space-y-3.5">
                {publisherBooks.map((wb) => {
                  // status check
                  // licenseStatus === 'Berlangganan' means Under Review
                  // licenseStatus === 'Kedaluwarsa' means Withdrawn/Rejected
                  const isUnderReview = wb.licenseStatus === 'Berlangganan';
                  const isWithdrawn = wb.licenseStatus === 'Kedaluwarsa' && !wb.version?.includes('Ditolak');
                  const isRejected = wb.version?.includes('Ditolak');
                  const isLive = wb.licenseStatus !== 'Berlangganan' && wb.licenseStatus !== 'Kedaluwarsa' && !isRejected;

                  return (
                    <div key={wb.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3 animate-fade-in">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[8px] bg-slate-100 text-slate-600 font-extrabold px-1.5 py-0.5 rounded uppercase">
                            {wb.category}
                          </span>
                          <h4 className="font-extrabold text-xs text-slate-800 leading-tight mt-1">{wb.title}</h4>
                          <span className="text-[9px] text-slate-400 block font-semibold mt-0.5">Versi: {wb.version} • Rating: ★ {wb.rating}</span>
                        </div>
                        <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full uppercase border ${
                          isUnderReview 
                            ? 'bg-amber-50 text-amber-700 border-amber-200' 
                            : isRejected 
                              ? 'bg-red-50 text-red-600 border-red-200' 
                              : isWithdrawn 
                                ? 'bg-slate-50 text-slate-500 border-slate-200' 
                                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}>
                          {isUnderReview ? 'Dalam Review' : isRejected ? 'Ditolak' : isWithdrawn ? 'Ditarik' : 'Diterbitkan (Store)'}
                        </span>
                      </div>

                      {/* Display feedback if rejected */}
                      {isRejected && (
                        <div className="p-2 bg-red-50 text-red-700 rounded-xl border border-red-100 text-[9px] font-medium leading-relaxed">
                          ⚠️ <strong>Feedback Admin:</strong> {wb.updateHistory?.[0]?.note || 'Perbaiki deskripsi atau formula.'}
                        </div>
                      )}

                      {/* Editing state */}
                      {editingWbId === wb.id ? (
                        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-[9px] font-semibold text-slate-600">
                          <span className="text-[8px] bg-slate-200 font-black px-1.5 py-0.5 rounded uppercase block w-max">Ubah Rincian Workbook</span>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-400 uppercase">Harga Baru (Rp)</label>
                              <input 
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                placeholder={wb.price?.toString()}
                                className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-400 uppercase">Harga Coret (Rp)</label>
                              <input 
                                type="number"
                                value={editDiscount}
                                onChange={(e) => setEditDiscount(e.target.value)}
                                placeholder={wb.originalPrice?.toString() || '0'}
                                className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-400 uppercase">Versi Baru</label>
                              <input 
                                type="text"
                                value={editVersion}
                                onChange={(e) => setEditVersion(e.target.value)}
                                placeholder={wb.version || 'v1.0.0'}
                                className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold"
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-bold text-slate-400 uppercase">Catatan Perubahan</label>
                              <input 
                                type="text"
                                value={editReleaseNote}
                                onChange={(e) => setEditReleaseNote(e.target.value)}
                                placeholder="Optimasi database modul..."
                                className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold"
                              />
                            </div>
                          </div>

                          <div className="flex gap-2 justify-end pt-1">
                            <button
                              onClick={() => setEditingWbId(null)}
                              className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 rounded-lg text-[8px] font-bold"
                            >
                              Batal
                            </button>
                            <button
                              onClick={() => handleSaveEditBook(wb.id)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[8px] font-black"
                            >
                              Simpan Perubahan
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex justify-between items-center pt-2.5 border-t border-slate-50">
                          <span className="text-[10px] text-slate-800 font-extrabold">
                            {wb.price === 0 ? 'Gratis' : formatRupiah(wb.price || 0)}
                          </span>

                          <div className="flex gap-1.5">
                            {/* Actions dependent on state */}
                            {isLive && (
                              <>
                                <button
                                  onClick={() => handleWithdrawWorkbook(wb)}
                                  className="px-2.5 py-1 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-[9px] font-black cursor-pointer"
                                >
                                  Tarik Buku
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingWbId(wb.id);
                                    setEditPrice(wb.price?.toString() || '0');
                                    setEditDiscount(wb.originalPrice?.toString() || '0');
                                    setEditVersion(wb.version || 'v1.0.0');
                                  }}
                                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[9px] font-black cursor-pointer"
                                >
                                  Ubah Rincian
                                </button>
                              </>
                            )}

                            {isUnderReview && (
                              <span className="text-[8px] text-slate-400 font-bold italic py-1">Tunggu tinjauan admin...</span>
                            )}

                            {(isWithdrawn || isRejected) && (
                              <button
                                onClick={() => handlePublishWorkbookFromDraft(wb)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black cursor-pointer shadow-xs"
                              >
                                Terbitkan Kembali
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Terbitan</h4>
                <p className="text-[10px] text-slate-400 font-medium">Anda belum menerbitkan workbook. Silakan gunakan tab 'Buat Workbook'.</p>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CREATE WORKBOOK FORM */}
        {publisherSubTab === 'create' && (
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
            <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-600" /> Daftarkan Modul Baru
            </h3>
            
            <form onSubmit={handleCreateNewWorkbookSubmit} className="space-y-3 text-[10px] font-semibold text-slate-600">
              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Nama Workbook *</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pengelolaan Kas Usaha Mikro"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                />
              </div>

              <div className="space-y-0.5">
                <label className="text-[9px] font-bold text-slate-400 uppercase">Deskripsi Modul *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Tuliskan kegunaan, target, dan rincian modul..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Kategori</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  >
                    {categories.filter(c => c !== 'Semua').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Ikon Display</label>
                  <select
                    value={newIcon}
                    onChange={(e) => setNewIcon(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  >
                    <option value="zap">Zap (Produktivitas)</option>
                    <option value="wallet">Wallet (Keuangan)</option>
                    <option value="calendar">Calendar (Planner)</option>
                    <option value="users">Users (Bisnis/CRM)</option>
                    <option value="trending-up">Trending Up (Trading)</option>
                    <option value="heart">Heart (Relationship/Pribadi)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Harga Lisensi (Rp)</label>
                  <input
                    type="number"
                    placeholder="0 untuk Gratis"
                    value={newPrice || ''}
                    onChange={(e) => setNewPrice(parseInt(e.target.value) || 0)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Harga Coret (Rp)</label>
                  <input
                    type="number"
                    placeholder="Optional, misal: 49000"
                    value={newOrigPrice || ''}
                    onChange={(e) => setNewOrigPrice(parseInt(e.target.value) || 0)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Masalah Yang Diselesaikan (Pisahkan koma)</label>
                  <input
                    type="text"
                    placeholder="Melacak kebocoran kas, Kesulitan rekap harian"
                    value={newProblemsSolved}
                    onChange={(e) => setNewProblemsSolved(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>

                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Fitur Kunci (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={newFeatures}
                    onChange={(e) => setNewFeatures(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* FAQ Section input */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="font-extrabold text-[9px] text-slate-500 uppercase block">Tambahkan FAQ Bantuan</span>
                <div className="space-y-2 text-[9px]">
                  <input
                    type="text"
                    placeholder="Pertanyaan FAQ"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-bold focus:outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Jawaban FAQ"
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full py-1.5 px-2 bg-white border border-slate-200 rounded-lg font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Input Parameter (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={newInputs}
                    onChange={(e) => setNewInputs(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>
                <div className="space-y-0.5">
                  <label className="text-[9px] font-bold text-slate-400 uppercase">Output Analitis (Pisahkan koma)</label>
                  <input
                    type="text"
                    value={newOutputs}
                    onChange={(e) => setNewOutputs(e.target.value)}
                    className="w-full py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-black rounded-xl transition-all cursor-pointer shadow-md mt-1"
              >
                Kirim Pengajuan Modul (Simpan Draft)
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: REVIEWS & REPLIES MANAGER */}
        {publisherSubTab === 'reviews' && (
          <div className="space-y-3.5">
            <h3 className="font-extrabold text-sm text-slate-800 pl-1">Kelola Ulasan Pengguna</h3>

            {publisherBooks.some(w => w.reviews && w.reviews.length > 0) ? (
              publisherBooks.flatMap(wb => (wb.reviews || []).map(rev => (
                <div key={rev.id} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-3 animate-fade-in">
                  <div className="flex justify-between items-start text-[10px]">
                    <div>
                      <span className="text-[8px] bg-slate-100 text-slate-500 font-bold px-1.5 py-0.5 rounded uppercase">
                        Buku: {wb.title}
                      </span>
                      <p className="font-extrabold text-slate-800 mt-1">{rev.user}</p>
                    </div>
                    <span className="text-[8px] text-slate-400 font-bold">{rev.date}</span>
                  </div>

                  <div className="flex items-center gap-0.5 text-amber-500">
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <Star key={starIdx} className={`w-3 h-3 ${starIdx < rev.rating ? 'fill-amber-500' : 'text-slate-200'}`} />
                    ))}
                  </div>

                  <p className="text-xs text-slate-600 leading-normal italic bg-slate-50 p-2.5 rounded-xl">
                    "{rev.text}"
                  </p>

                  {/* Display existing reply */}
                  {rev.reply ? (
                    <div className="p-2.5 bg-emerald-50/70 text-emerald-900 border border-emerald-100 rounded-xl text-[10px] leading-relaxed">
                      💬 <strong>Jawaban Penerbit (Anda):</strong> "{rev.reply}"
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-wide block">Tulis Jawaban Resmi</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Terima kasih atas masukannya, kami segera..."
                          value={replyInputMap[rev.id] || ''}
                          onChange={(e) => setReplyInputMap(prev => ({ ...prev, [rev.id]: e.target.value }))}
                          className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] focus:outline-none"
                        />
                        <button
                          onClick={() => handleReplyReview(wb.id, rev.id)}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer"
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )))
            ) : (
              <div className="bg-white p-8 rounded-2xl border border-dashed border-slate-300 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <h4 className="text-xs font-bold text-slate-700">Belum Ada Ulasan</h4>
                <p className="text-[10px] text-slate-400 font-medium">Ulasan dari pengguna yang membeli buku kerja Anda akan dicantumkan di sini.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

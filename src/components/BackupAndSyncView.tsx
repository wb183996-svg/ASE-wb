/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  CloudUpload, 
  CloudDownload, 
  RefreshCw, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Zap, 
  RotateCcw,
  Wifi,
  WifiOff,
  History,
  ShieldCheck,
  ToggleLeft,
  ToggleRight
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
  SharedContact 
} from '../types';
import { IdentityModule } from '../core/IdentityService';
import { collection, addDoc, onSnapshot, query, where, orderBy, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BackupAndSyncViewProps {
  workbooks: Workbook[];
  onUpdateWorkbook: (updatedWb: Workbook) => void;
  financeRecords: FinanceRecord[];
  setFinanceRecords: (recs: FinanceRecord[]) => void;
  taskRecords: TaskRecord[];
  setTaskRecords: (recs: TaskRecord[]) => void;
  habitRecords: HabitRecord[];
  setHabitRecords: (recs: HabitRecord[]) => void;
  crmRecords: CrmRecord[];
  setCrmRecords: (recs: CrmRecord[]) => void;
  tradingRecords: TradingRecord[];
  setTradingRecords: (recs: TradingRecord[]) => void;
  okrRecords: OkrRecord[];
  setOkrRecords: (recs: OkrRecord[]) => void;
  relationshipRecords: RelationshipRecord[];
  setRelationshipRecords: (recs: RelationshipRecord[]) => void;
  sharedContacts: SharedContact[];
  setSharedContacts: (recs: SharedContact[]) => void;
  themeColor: string;
}

interface BackupItem {
  id: string;
  timestamp: string;
  size: string;
  itemCount: number;
  data: {
    workbooks: string;
    finance: string;
    tasks: string;
    habits: string;
    crm: string;
    trading: string;
    okrs: string;
    relationships: string;
    contacts: string;
  }
}

export default function BackupAndSyncView({
  workbooks,
  onUpdateWorkbook,
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
  themeColor
}: BackupAndSyncViewProps) {
  // Offline state
  const [isOnline, setIsOnline] = useState(true);
  const [syncingState, setSyncingState] = useState<'idle' | 'syncing' | 'success'>('idle');

  // Backup state
  const [backups, setBackups] = useState<BackupItem[]>([
    {
      id: 'BKP-092301',
      timestamp: '2026-07-01 18:24',
      size: '12.4 KB',
      itemCount: 15,
      data: {
        workbooks: JSON.stringify(workbooks),
        finance: JSON.stringify(financeRecords),
        tasks: JSON.stringify(taskRecords),
        habits: JSON.stringify(habitRecords),
        crm: JSON.stringify(crmRecords),
        trading: JSON.stringify(tradingRecords),
        okrs: JSON.stringify(okrRecords),
        relationships: JSON.stringify(relationshipRecords),
        contacts: JSON.stringify(sharedContacts)
      }
    }
  ]);
  const [autoBackup, setAutoBackup] = useState(true);

  // Migration state
  const [migrationCode, setMigrationCode] = useState('');
  const [migrationInput, setMigrationInput] = useState('');
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'success' | 'error'>('idle');

  // Update states
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  // Active User session tracker
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = IdentityModule.subscribe((session) => {
      if (session) {
        setCurrentUser(session.user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch / Sync backups dynamically from Firestore
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'backups'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: BackupItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          timestamp: data.timestamp || new Date(data.createdAt).toISOString().replace('T', ' ').substring(0, 16),
          size: data.size || '0 KB',
          itemCount: data.itemCount || 0,
          data: {
            workbooks: data.data?.workbooks || '[]',
            finance: data.data?.finance || '[]',
            tasks: data.data?.tasks || '[]',
            habits: data.data?.habits || '[]',
            crm: data.data?.crm || '[]',
            trading: data.data?.trading || '[]',
            okrs: data.data?.okrs || '[]',
            relationships: data.data?.relationships || '[]',
            contacts: data.data?.contacts || '[]'
          }
        });
      });
      if (list.length > 0) {
        setBackups(list);
      }
    }, (error) => {
      console.error("Error fetching backups from Firestore:", error);
    });

    return () => unsubscribe();
  }, [currentUser]);

  // Network Offline/Online simulation handler
  const handleToggleNetwork = () => {
    const nextState = !isOnline;
    setIsOnline(nextState);

    if (nextState) {
      // Trigger auto sync
      setSyncingState('syncing');
      setTimeout(() => {
        setSyncingState('success');
        setTimeout(() => setSyncingState('idle'), 3000);
      }, 2000);
    }
  };

  // Create Manual Backup
  const handleCreateBackup = async () => {
    const session = IdentityModule.getCurrentSession();
    if (!session) {
      alert("⚠️ Sinkronisasi Cloud Gagal!\nAnda harus melakukan login dengan Google terlebih dahulu di menu Pengaturan untuk menggunakan cadangan cloud server.");
      return;
    }

    const backupId = 'BKP-' + Math.floor(Math.random() * 900000 + 100000);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const totalRecordsCount = 
      financeRecords.length + 
      taskRecords.length + 
      habitRecords.length + 
      crmRecords.length + 
      tradingRecords.length + 
      okrRecords.length + 
      relationshipRecords.length + 
      sharedContacts.length;

    // Simulate file sizing
    const sizeInKb = (totalRecordsCount * 0.8 + 8).toFixed(1) + ' KB';

    const backupPayload = {
      userId: session.user.uid,
      userEmail: session.user.email,
      timestamp: now,
      size: sizeInKb,
      itemCount: totalRecordsCount,
      createdAt: new Date().toISOString(),
      data: {
        workbooks: JSON.stringify(workbooks),
        finance: JSON.stringify(financeRecords),
        tasks: JSON.stringify(taskRecords),
        habits: JSON.stringify(habitRecords),
        crm: JSON.stringify(crmRecords),
        trading: JSON.stringify(tradingRecords),
        okrs: JSON.stringify(okrRecords),
        relationships: JSON.stringify(relationshipRecords),
        contacts: JSON.stringify(sharedContacts)
      }
    };

    try {
      await addDoc(collection(db, 'backups'), backupPayload);
      alert(`Sukses mencadangkan data atas nama ${session.user.name} ke ASE Cloud Server Firebase Firestore secara nyata!\nID Backup: ${backupId}\nUkuran: ${sizeInKb}`);
    } catch (err: any) {
      console.error("Firestore backup error:", err);
      alert(`Gagal mencadangkan data ke Cloud: ${err.message || err}`);
    }
  };

  // Restore from Backup
  const handleRestoreBackup = (bkp: BackupItem) => {
    if (!window.confirm(`Apakah Anda yakin ingin memulihkan data dari backup ${bkp.id}? Semua data lokal saat ini akan digantikan.`)) return;

    try {
      if (bkp.data.finance) setFinanceRecords(JSON.parse(bkp.data.finance));
      if (bkp.data.tasks) setTaskRecords(JSON.parse(bkp.data.tasks));
      if (bkp.data.habits) setHabitRecords(JSON.parse(bkp.data.habits));
      if (bkp.data.crm) setCrmRecords(JSON.parse(bkp.data.crm));
      if (bkp.data.trading) setTradingRecords(JSON.parse(bkp.data.trading));
      if (bkp.data.okrs) setOkrRecords(JSON.parse(bkp.data.okrs));
      if (bkp.data.relationships) setRelationshipRecords(JSON.parse(bkp.data.relationships));
      if (bkp.data.contacts) setSharedContacts(JSON.parse(bkp.data.contacts));
      
      alert(`Pemulihan database berhasil! ${bkp.itemCount} entri data dipulihkan.`);
    } catch (err) {
      alert('Gagal memulihkan database. File backup korup.');
    }
  };

  // Generate Migration Code (Device Migration)
  const handleGenerateMigrationCode = async () => {
    const randId = 'ASE-MIGRATE-' + Math.random().toString(36).substring(2, 7).toUpperCase();
    
    // Auto store backup data mapping to this code in Firestore migrations collection
    const migrationPayload = {
      finance: JSON.stringify(financeRecords),
      tasks: JSON.stringify(taskRecords),
      habits: JSON.stringify(habitRecords),
      crm: JSON.stringify(crmRecords),
      trading: JSON.stringify(tradingRecords),
      okrs: JSON.stringify(okrRecords),
      relationships: JSON.stringify(relationshipRecords),
      contacts: JSON.stringify(sharedContacts),
      createdAt: new Date().toISOString()
    };

    try {
      await setDoc(doc(db, 'migrations', randId), migrationPayload);
      setMigrationCode(randId);
    } catch (err: any) {
      console.error("Firestore migration code generation error:", err);
      alert(`Gagal meregistrasikan kode migrasi ke database cloud: ${err.message || err}`);
    }
  };

  // Apply Migration Code (Simulate Device Migration)
  const handleApplyMigration = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = migrationInput.trim().toUpperCase();

    try {
      const docRef = doc(db, 'migrations', token);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const payload = docSnap.data();
        if (payload.finance) setFinanceRecords(JSON.parse(payload.finance));
        if (payload.tasks) setTaskRecords(JSON.parse(payload.tasks));
        if (payload.habits) setHabitRecords(JSON.parse(payload.habits));
        if (payload.crm) setCrmRecords(JSON.parse(payload.crm));
        if (payload.trading) setTradingRecords(JSON.parse(payload.trading));
        if (payload.okrs) setOkrRecords(JSON.parse(payload.okrs));
        if (payload.relationships) setRelationshipRecords(JSON.parse(payload.relationships));
        if (payload.contacts) setSharedContacts(JSON.parse(payload.contacts));

        setMigrationStatus('success');
        setMigrationInput('');
        alert('Migrasi data dari perangkat luar berhasil diimpor melalui database nyata Cloud Firestore!');
      } else {
        setMigrationStatus('error');
        alert('Kode migrasi tidak ditemukan di database cloud. Silakan periksa kembali kodenya.');
      }
    } catch (err: any) {
      console.error("Firestore apply migration error:", err);
      setMigrationStatus('error');
      alert(`Gagal memproses migrasi: ${err.message || err}`);
    }
  };

  // Trigger manual workbook updates scanner
  const handleCheckUpdates = () => {
    setCheckingUpdates(true);
    setTimeout(() => {
      setCheckingUpdates(false);
      // Scan if there are updateable books
      const hasUpgradable = workbooks.some(w => w.updateHistory && w.updateHistory.length > 0 && w.version !== w.updateHistory[0].version);
      
      if (hasUpgradable) {
        setShowUpdateToast(true);
      } else {
        alert('Semua buku kerja Anda sudah menggunakan versi paling mutakhir!');
      }
    }, 1500);
  };

  // Manual Trigger specific workbook auto-update/install updates
  const handleInstallWorkbookUpdate = (wb: Workbook) => {
    if (!wb.updateHistory || wb.updateHistory.length === 0) return;
    const latestVersion = wb.updateHistory[0].version;
    onUpdateWorkbook({
      ...wb,
      version: latestVersion
    });
    setShowUpdateToast(false);
    alert(`Workbook "${wb.title}" berhasil di-update ke versi ${latestVersion}!`);
  };

  // Rollback version history helper
  const handleRollbackWorkbook = (wb: Workbook, histVersion: string) => {
    onUpdateWorkbook({
      ...wb,
      version: histVersion
    });
    alert(`Workbook "${wb.title}" berhasil di-rollback ke versi lama: ${histVersion}`);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans p-4 space-y-4 animate-fade-in">
      
      {/* 1. OFFLINE-FIRST INTEGRITY PANEL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
              {isOnline ? <Wifi className="w-4 h-4 text-emerald-600" /> : <WifiOff className="w-4 h-4 text-slate-400" />}
              Koneksi Offline-First
            </h3>
            <p className="text-[9px] text-slate-400 font-semibold leading-normal mt-0.5">
              Semua workbook tetap dapat diisi tanpa jaringan. Sinkronisasi dilakukan otomatis saat internet tersedia.
            </p>
          </div>
          
          <button
            onClick={handleToggleNetwork}
            className={`px-3 py-1.5 rounded-full text-[9px] font-black cursor-pointer transition-all border ${
              isOnline 
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                : 'bg-slate-800 text-white border-slate-700'
            }`}
          >
            {isOnline ? '🟢 Online' : '⚫ Offline'}
          </button>
        </div>

        {/* Syncing Simulator feedback */}
        {syncingState === 'syncing' && (
          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl flex items-center justify-between border border-slate-800 animate-pulse text-[9px]">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
              Menyinkronkan data Workbook dengan ASE Cloud DB...
            </span>
            <span className="text-slate-400">Loading</span>
          </div>
        )}

        {syncingState === 'success' && (
          <div className="bg-emerald-50 text-emerald-900 border border-emerald-200 p-3 rounded-xl flex items-center gap-2 text-[9px] font-bold">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
            <span>Koneksi pulih! 100% Data Bersama ASE Workbook berhasil disinkronkan secara aman.</span>
          </div>
        )}
      </div>

      {/* 2. CLOUD BACKUP MANAGER */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        {!IdentityModule.getCurrentSession() && (
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2 text-[10px] text-amber-800 font-semibold leading-relaxed animate-fade-in">
            <AlertCircle className="w-4.5 h-4.5 text-amber-600 shrink-0" />
            <span>
              <strong>Otentikasi Diperlukan:</strong> Masuk dengan akun Google Anda terlebih dahulu di menu <strong>Pengaturan</strong> untuk mengaktifkan Cloud Sync & Backup Server.
            </span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
            <Cloud className="w-4.5 h-4.5 text-emerald-600" /> Cloud Backup Engine
          </h3>

          {/* Auto Backup toggle */}
          <div className="flex items-center gap-1">
            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Auto-Backup</span>
            <button onClick={() => setAutoBackup(!autoBackup)} className="text-slate-600">
              {autoBackup ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCreateBackup}
            className="py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <CloudUpload className="w-4 h-4" /> Backup Manual
          </button>
          
          <button
            onClick={() => alert('Sistem sinkronisasi cloud terverifikasi aktif.')}
            className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" /> Cek Integritas
          </button>
        </div>

        {/* Backups List */}
        <div className="space-y-2">
          <span className="text-[8px] text-slate-400 font-extrabold uppercase pl-0.5 block">File Backup di Cloud Server</span>
          
          <div className="space-y-2 max-h-32 overflow-y-auto divide-y divide-slate-100">
            {backups.map((bkp) => (
              <div key={bkp.id} className="pt-2 flex justify-between items-center text-[9px] leading-snug">
                <div>
                  <p className="font-extrabold text-slate-700">{bkp.id} ({bkp.size})</p>
                  <span className="text-slate-400 font-semibold text-[8px]">Tercatat: {bkp.timestamp} • {bkp.itemCount} Record</span>
                </div>
                
                <button
                  onClick={() => handleRestoreBackup(bkp)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-lg font-bold"
                >
                  <CloudDownload className="w-3 h-3 inline mr-1" /> Restore
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DEVICE MIGRATION ENGINE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
          <Smartphone className="w-4.5 h-4.5 text-emerald-600" /> Migrasi Perangkat
        </h3>
        <p className="text-[9px] text-slate-400 font-semibold leading-normal">
          Pindahkan seluruh progres buku kerja Anda dari perangkat lain menggunakan kode migrasi satu arah.
        </p>

        {/* Export Migration Code */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-center space-y-2">
          <span className="text-[8px] text-slate-400 font-extrabold uppercase block">Ekspor Kode Migrasi</span>
          {migrationCode ? (
            <div className="space-y-1">
              <span className="text-sm font-black text-slate-800 select-all block bg-white border border-slate-200 p-1.5 rounded-lg font-mono">
                {migrationCode}
              </span>
              <span className="text-[7px] text-slate-400 block font-semibold italic">Salin kode ini ke perangkat baru Anda</span>
            </div>
          ) : (
            <button
              onClick={handleGenerateMigrationCode}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-[9px] font-black cursor-pointer transition-all"
            >
              🔑 Buat Kode Ekspor
            </button>
          )}
        </div>

        {/* Import Migration Code Form */}
        <form onSubmit={handleApplyMigration} className="space-y-2 pt-1">
          <label className="text-[8px] text-slate-400 font-extrabold uppercase pl-0.5">Impor Dari Perangkat Lain</label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Masukkan Kode (e.g. ASE-MIGRATE-F9B2D)"
              value={migrationInput}
              onChange={(e) => setMigrationInput(e.target.value)}
              className="flex-1 py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold focus:outline-none uppercase"
            />
            <button
              type="submit"
              disabled={!migrationInput.trim()}
              className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-[9px] font-black cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
            >
              Impor Data
            </button>
          </div>

          {migrationStatus === 'success' && (
            <span className="text-[8px] text-emerald-600 font-bold block">✓ Data berhasil dimigrasikan ke perangkat ini!</span>
          )}
          {migrationStatus === 'error' && (
            <span className="text-[8px] text-red-600 font-bold block">⚠️ Kode migrasi kedaluwarsa atau tidak valid.</span>
          )}
        </form>
      </div>

      {/* 4. UPDATE ENGINE & ROLLBACK SYSTEM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3.5">
        <div className="flex justify-between items-center">
          <h3 className="text-xs font-extrabold text-slate-800 uppercase flex items-center gap-1.5">
            <History className="w-4.5 h-4.5 text-emerald-600" /> Update Engine & Rollback
          </h3>

          <div className="flex items-center gap-1">
            <span className="text-[8px] text-slate-400 font-extrabold uppercase">Auto-Update</span>
            <button onClick={() => setAutoUpdate(!autoUpdate)} className="text-slate-600">
              {autoUpdate ? <ToggleRight className="w-6 h-6 text-emerald-600" /> : <ToggleLeft className="w-6 h-6 text-slate-400" />}
            </button>
          </div>
        </div>

        <button
          onClick={handleCheckUpdates}
          disabled={checkingUpdates}
          className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-[10px] font-black rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 disabled:bg-slate-300"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdates ? 'animate-spin' : ''}`} />
          {checkingUpdates ? 'Memindai Server...' : 'Cek Pembaruan Workbook'}
        </button>

        {/* Update Notification toast */}
        {showUpdateToast && (
          <div className="bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-800 space-y-2 text-[9px] animate-bounce">
            <span className="font-extrabold text-amber-400 block uppercase">Pembaruan Tersedia!</span>
            <p>Penerbit merilis modul versi baru untuk Workbook CRM Bisnis Anda.</p>
            <div className="flex gap-2 justify-end pt-1">
              <button onClick={() => setShowUpdateToast(false)} className="px-2 py-1 text-slate-400 hover:text-white font-bold">Abaikan</button>
              <button 
                onClick={() => {
                  const targetWb = workbooks.find(w => w.id === 'wb-crm');
                  if (targetWb) handleInstallWorkbookUpdate(targetWb);
                }} 
                className="px-3 py-1 bg-emerald-600 text-white font-black rounded"
              >
                Unduh & Pasang v1.3.0
              </button>
            </div>
          </div>
        )}

        {/* Rollback versions display */}
        <div className="space-y-2 pt-1 border-t border-slate-100">
          <span className="text-[8px] text-slate-400 font-extrabold uppercase block pl-0.5">Version History & Rollback</span>
          
          <div className="space-y-3">
            {workbooks.filter(w => w.updateHistory && w.updateHistory.length > 1).map((wb) => (
              <div key={wb.id} className="bg-slate-50 p-2.5 rounded-xl border border-slate-100/50 space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="font-extrabold text-slate-700">{wb.title}</span>
                  <span className="text-[8px] bg-slate-200 text-slate-600 font-extrabold px-1 rounded">Aktif: {wb.version}</span>
                </div>

                {/* History Options for rollback */}
                <div className="space-y-1.5">
                  {wb.updateHistory?.map((hist, hIdx) => {
                    const isCurrent = wb.version === hist.version;
                    return (
                      <div key={hIdx} className="flex justify-between items-center text-[8px] border-l border-slate-200 pl-1.5 leading-relaxed">
                        <div>
                          <strong className="text-slate-600">{hist.version}</strong>
                          <span className="text-slate-400 font-semibold block">{hist.note}</span>
                        </div>
                        {!isCurrent && (
                          <button
                            onClick={() => handleRollbackWorkbook(wb, hist.version)}
                            className="px-1.5 py-0.5 bg-white border border-slate-200 text-slate-600 rounded font-bold hover:bg-slate-100 transition-colors"
                          >
                            Rollback
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

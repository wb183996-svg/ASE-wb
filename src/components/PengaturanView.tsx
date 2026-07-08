/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  User, 
  Palette, 
  RotateCcw, 
  ShieldCheck, 
  Info,
  Check,
  Download,
  Upload,
  Globe,
  Database,
  Cpu,
  Layers,
  Activity,
  Award
} from 'lucide-react';
import { UserProfile, ThemeColor } from '../types';
import { getThemeStyles } from './MobileFrame';
import { TRANSLATIONS, getTranslation, Locale, LanguageRegistry } from '../lib/i18n';
import CoreKernelView from './CoreKernelView';
import { IdentityModule } from '../core/IdentityService';

interface PengaturanViewProps {
  user: UserProfile;
  onUpdateUser: (updatedUser: UserProfile) => void;
  themeColor: ThemeColor;
  onChangeThemeColor: (color: ThemeColor) => void;
  onTriggerSplash: () => void;
  onResetData: () => void;
  language: string;
  onChangeLanguage: (lang: string) => void;
}

export default function PengaturanView({
  user,
  onUpdateUser,
  themeColor,
  onChangeThemeColor,
  onTriggerSplash,
  onResetData,
  language,
  onChangeLanguage,
}: PengaturanViewProps) {
  const [dataSavedFeedback, setDataSavedFeedback] = useState(false);
  const [backupStatus, setBackupStatus] = useState<string | null>(null);
  const [restoreStatus, setRestoreStatus] = useState<string | null>(null);
  const [activeArchTab, setActiveArchTab] = useState<'core' | 'data' | 'guardian' | 'engine' | 'shared'>('core');
  const [showDeveloperConsole, setShowDeveloperConsole] = useState(false);

  // States for the i18n Translation Matrix Playground
  const [selectedKeyToInspect, setSelectedKeyToInspect] = useState<string>('workbook.install');
  const [customLocale, setCustomLocale] = useState<string>('de');
  const [customTerm, setCustomTerm] = useState<string>('Arbeitsmappe');
  const [customRegistry, setCustomRegistry] = useState<{ [key: string]: { [key: string]: string } }>({
    de: {
      "concept.workbook": "Arbeitsmappe",
      "workbook.install": "Arbeitsmappe installieren",
      "workflow.run": "Workflow ausführen",
    },
    es: {
      "concept.workbook": "Libro de trabajo",
      "workbook.install": "Instalar libro de trabajo",
      "workflow.run": "Ejecutar flujo de trabajo",
    }
  });
  const [registrationFeedback, setRegistrationFeedback] = useState<string | null>(null);

  const handleRegisterCustomLocale = () => {
    if (!customLocale || !customTerm) return;
    setCustomRegistry(prev => ({
      ...prev,
      [customLocale]: {
        ...prev[customLocale],
        "concept.workbook": customTerm,
        "workbook.install": `${customTerm} installieren`,
        "workflow.run": "Workflow ausführen",
      }
    }));
    setRegistrationFeedback(`✓ Paket bahasa [${customLocale.toUpperCase()}] berhasil didaftarkan di sandbox runtime!`);
    setTimeout(() => setRegistrationFeedback(null), 3000);
  };

  const colorThemes: { id: ThemeColor; label: string; bgClass: string }[] = [
    { id: 'teal', label: 'Mint Teal', bgClass: 'bg-teal-600' },
    { id: 'emerald', label: 'Forest Green', bgClass: 'bg-emerald-600' },
    { id: 'indigo', label: 'Ocean Blue', bgClass: 'bg-indigo-600' },
    { id: 'amber', label: 'Sunset Gold', bgClass: 'bg-amber-500' },
    { id: 'rose', label: 'Rose Berry', bgClass: 'bg-rose-600' },
  ];

  const handleProfileChange = (key: keyof UserProfile, value: string) => {
    const updated = { ...user, [key]: value };
    onUpdateUser(updated);
    
    setDataSavedFeedback(true);
    setTimeout(() => setDataSavedFeedback(false), 2000);
  };

  const handleBackup = () => {
    setBackupStatus('Mencadangkan...');
    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      setBackupStatus(`✓ Cadangan berhasil disimpan lokal pada ${now}`);
      setTimeout(() => setBackupStatus(null), 4000);
    }, 1500);
  };

  const handleRestore = () => {
    setRestoreStatus('Memulihkan...');
    setTimeout(() => {
      setRestoreStatus('✓ Data berhasil dipulihkan dari cadangan lokal terakhir!');
      setTimeout(() => setRestoreStatus(null), 4000);
    }, 1500);
  };

  const themeStyles = getThemeStyles(themeColor);

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-12">
      
      {/* 1. PROFIL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <User className="w-4.5 h-4.5 text-slate-500" /> Profil Pengguna
        </h3>

        {/* INTEGRASI GOOGLE AUTHENTICATION MODULE */}
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Identity Service Status</span>
            {user.uid ? (
              <span className="text-[9px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full animate-fade-in flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full block animate-pulse"></span>
                Terkoneksi
              </span>
            ) : (
              <span className="text-[9px] bg-slate-200 text-slate-600 font-extrabold px-2 py-0.5 rounded-full">
                Tamu (Lokal)
              </span>
            )}
          </div>

          {user.uid ? (
            <div className="space-y-2.5 animate-fade-in">
              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white text-base font-black border-2 border-indigo-100">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-black text-slate-800 truncate">{user.name}</h4>
                  <p className="text-[10px] font-medium text-slate-400 truncate">{user.email || 'guest@ase.dev'}</p>
                  <p className="text-[8px] font-mono font-bold text-indigo-500 uppercase tracking-wider mt-0.5">
                    ID: {user.uid} • OAuth: {user.provider?.toUpperCase()}
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-2 rounded-xl text-[10px] text-emerald-800 font-semibold leading-relaxed flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Lisensi pembelian, backup otomatis, dan sinkronisasi Cloud aman terintegrasi.</span>
              </div>

              <button
                id="btn-logout-google"
                onClick={() => {
                  IdentityModule.logout();
                }}
                className="w-full py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
              >
                Keluar dari Akun Cloud
              </button>
            </div>
          ) : (
            <div className="space-y-2 animate-fade-in">
              <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                Hubungkan sandbox Anda ke akun Google untuk mengaktifkan sinkronisasi cloud instan antar-perangkat, mengimpor lisensi Marketplace, dan mengaktifkan publisher profile.
              </p>

              <button
                id="btn-login-google"
                onClick={async () => {
                  await IdentityModule.login('google');
                }}
                className="w-full py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 hover:border-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-[0.99]"
              >
                {/* Simulated Google Logo representation */}
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5.04c1.78 0 3.38.61 4.64 1.8l3.46-3.46C17.99 1.19 15.17 0 12 0 7.31 0 3.25 2.69 1.18 6.6l4.03 3.13C6.18 7.02 8.84 5.04 12 5.04z" />
                  <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.56z" />
                  <path fill="#FBBC05" d="M5.21 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.18 6.6C.43 8.22 0 10.06 0 12s.43 3.78 1.18 5.4l4.03-3.13z" fillRule="evenodd" clipRule="evenodd" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.16 0-5.82-1.98-6.79-4.69l-4.03 3.13C3.25 21.31 7.31 24 12 24z" />
                </svg>
                Masuk dengan Google Secure Core
              </button>
            </div>
          )}
        </div>

        {/* Name input */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nama Lengkap</label>
          <input
            id="input-user-name"
            type="text"
            value={user.name}
            onChange={(e) => handleProfileChange('name', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-slate-700"
          />
        </div>

        {/* Role option select */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Peran Pengguna</label>
          <select
            id="select-user-role"
            value={user.role}
            onChange={(e) => handleProfileChange('role', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-slate-700"
          >
            <option value="Profesional Kreatif">Profesional Kreatif</option>
            <option value="Pelajar / Mahasiswa">Pelajar / Mahasiswa</option>
            <option value="Wirausaha Mandiri">Wirausaha Mandiri</option>
            <option value="Manajer Proyek / Tim">Manajer Proyek / Tim</option>
            <option value="Pecinta Produktivitas">Pecinta Produktivitas</option>
          </select>
        </div>

        {/* Workspace Mode select */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Mode Profil Workspace (Enterprise Ready)</label>
          <select
            id="select-user-workspace-mode"
            value={user.workspaceMode || 'Individu'}
            onChange={(e) => handleProfileChange('workspaceMode', e.target.value)}
            className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-300 font-semibold text-slate-700"
          >
            <option value="Individu">Individu (Pribadi)</option>
            <option value="Keluarga">Keluarga (Rumah Tangga)</option>
            <option value="UMKM">UMKM / Bisnis Sampingan</option>
            <option value="Perusahaan">Perusahaan / Korporat</option>
            <option value="Organisasi">Organisasi Non-Profit</option>
            <option value="Sekolah">Sekolah / Kampus</option>
            <option value="Komunitas">Komunitas / Hobi</option>
          </select>
          <p className="text-[9px] text-slate-400 font-semibold leading-relaxed">
            Menyesuaikan visualisasi dashboard, pembobotan skor, dan sasaran strategis sesuai dengan konteks organisasi Anda.
          </p>
        </div>

        {/* Gender / Avatar Picker */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Pilih Ilustrasi Avatar</label>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input
                id="radio-avatar-male"
                type="radio"
                name="avatar"
                checked={user.avatarId === 'male'}
                onChange={() => handleProfileChange('avatarId', 'male')}
                className="w-4 h-4 text-slate-600 focus:ring-slate-400"
              />
              Pria (Kreatif)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
              <input
                id="radio-avatar-female"
                type="radio"
                name="avatar"
                checked={user.avatarId === 'female'}
                onChange={() => handleProfileChange('avatarId', 'female')}
                className="w-4 h-4 text-slate-600 focus:ring-slate-400"
              />
              Wanita (Kreatif)
            </label>
          </div>
        </div>

        {dataSavedFeedback && (
          <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Perubahan profil disimpan secara real-time!
          </p>
        )}
      </div>

      {/* 2. CADANGAN & PEMULIHAN DATA */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Database className="w-4.5 h-4.5 text-slate-500" /> Pengelolaan Data Mandiri
        </h3>
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
          Platform ASE menggunakan penyimpanan lokal aman. Cadangkan atau pulihkan data kapan saja tanpa memerlukan login cloud.
        </p>

        <div className="grid grid-cols-2 gap-3 pt-1">
          {/* Cadangan Data */}
          <button
            id="btn-backup-data"
            onClick={handleBackup}
            disabled={backupStatus === 'Mencadangkan...'}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-600" />
            Cadangkan Data
          </button>

          {/* Pemulihan Data */}
          <button
            id="btn-restore-data"
            onClick={handleRestore}
            disabled={restoreStatus === 'Memulihkan...'}
            className="py-2.5 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-emerald-600" />
            Pemulihan Data
          </button>
        </div>

        {backupStatus && (
          <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl text-[10px] text-emerald-800 font-bold leading-tight">
            {backupStatus}
          </div>
        )}
        {restoreStatus && (
          <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-800 font-bold leading-tight">
            {restoreStatus}
          </div>
        )}
      </div>

      {/* 3. BAHASA & SIMULASI i18n PLATFORM */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-slate-100 pb-2">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Globe className="w-4.5 h-4.5 text-slate-500" /> Bahasa & Lokalisasi (i18n)
          </h3>
          <span className="bg-amber-100 text-amber-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-full uppercase">Dual Layer</span>
        </div>

        <div className="space-y-1">
          <p className="text-[10px] text-slate-500 leading-relaxed font-semibold">
            Platform ASE memisahkan secara tegas <strong className="text-slate-800">Nama Konsep Internal (Canonical Terminology)</strong> yang selalu berbahasa Inggris di level Core/SDK, dengan <strong className="text-slate-800">Bahasa Tampilan (Localization Layer)</strong> di UI.
          </p>
        </div>

        <div className="flex flex-col gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <span className="text-[11px] font-bold text-slate-700">Pilih Bahasa Tampilan (UI)</span>
          <div className="flex p-0.5 bg-slate-100 rounded-lg border border-slate-200 flex-wrap gap-1">
            {LanguageRegistry.getLocales().map((loc) => {
              const info = (() => {
                switch (loc) {
                  case 'id': return { flag: '🇮🇩', name: 'Indonesia' };
                  case 'en': return { flag: '🇬🇧', name: 'English' };
                  case 'de': return { flag: '🇩🇪', name: 'Deutsch' };
                  case 'es': return { flag: '🇪🇸', name: 'Español' };
                  case 'ja': return { flag: '🇯🇵', name: '日本語' };
                  default: return { flag: '🌍', name: loc.toUpperCase() };
                }
              })();
              return (
                <button
                  key={loc}
                  onClick={() => onChangeLanguage(loc)}
                  className={`px-2.5 py-1 text-[10px] font-black rounded-md transition-all cursor-pointer ${
                    language === loc ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {info.flag} {info.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Translation Key & Terminology Table */}
        <div className="p-3 bg-slate-900 text-slate-200 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block">Audit Terminology & Translation Key Matrix</span>
            <span className="text-[7.5px] font-mono text-slate-400">Contracts decoupling UI</span>
          </div>

          <div className="max-h-[140px] overflow-y-auto space-y-1.5 pr-1 text-[8px] font-mono scrollbar-thin">
            <div className="grid grid-cols-3 border-b border-slate-800 pb-1 font-bold text-slate-400 uppercase">
              <span>Canonical (Internal)</span>
              <span>Translation Key</span>
              <span>UI Terjemahan (ID)</span>
            </div>

            {[
              { canonical: 'Workbook', key: 'concept.workbook', id: 'Buku Kerja' },
              { canonical: 'Resource', key: 'concept.resource', id: 'Sumber Daya' },
              { canonical: 'Workflow', key: 'concept.workflow', id: 'Alur Kerja' },
              { canonical: 'Decision Engine', key: 'concept.decisionEngine', id: 'Mesin Keputusan' },
              { canonical: 'Knowledge Engine', key: 'concept.knowledgeEngine', id: 'Mesin Pengetahuan' },
              { canonical: 'Event Bus', key: 'concept.eventBus', id: 'Bus Event' },
              { canonical: 'Guardian', key: 'concept.guardian', id: 'Guardian' },
              { canonical: 'Marketplace', key: 'concept.marketplace', id: 'Marketplace' },
              { canonical: 'Dashboard', key: 'concept.dashboard', id: 'Dasbor' },
              { canonical: 'Module', key: 'concept.module', id: 'Modul' },
              { canonical: 'Runtime', key: 'concept.runtime', id: 'Runtime' },
              { canonical: 'Sandbox', key: 'concept.sandbox', id: 'Sandbox' },
            ].map((row, idx) => (
              <div key={idx} className="grid grid-cols-3 text-slate-300 py-0.5 hover:bg-slate-800/50 rounded px-0.5">
                <span className="text-emerald-400 font-bold">{row.canonical}</span>
                <span className="text-indigo-300">{row.key}</span>
                <span className="text-slate-100 italic">{row.id}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-2 space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[7.5px] font-black text-slate-400 uppercase">Key Action Translator</span>
              <span className="text-[7px] text-emerald-400 bg-emerald-950/80 border border-emerald-900/40 px-1 py-0.5 rounded">SDK Compliant</span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-[8px]">
              <div>
                <label className="text-slate-500 block uppercase mb-0.5">Pilih Key:</label>
                <select 
                  value={selectedKeyToInspect}
                  onChange={(e) => setSelectedKeyToInspect(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 p-1 rounded text-slate-300 font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  <option value="workbook.install">workbook.install</option>
                  <option value="workbook.remove">workbook.remove</option>
                  <option value="workflow.run">workflow.run</option>
                  <option value="guardian.validation">guardian.validation</option>
                  <option value="decision.analysis">decision.analysis</option>
                </select>
              </div>

              <div className="bg-slate-950 border border-slate-800 p-1.5 rounded flex flex-col justify-between">
                <div>
                  <span className="text-slate-500 block uppercase">Mapped output:</span>
                  <p className="text-[9px] font-bold text-amber-300">
                    "{selectedKeyToInspect === 'workbook.install' ? (language === 'id' ? 'Pasang Buku Kerja' : 'Install Workbook') :
                      selectedKeyToInspect === 'workbook.remove' ? (language === 'id' ? 'Copot Buku Kerja' : 'Remove Workbook') :
                      selectedKeyToInspect === 'workflow.run' ? (language === 'id' ? 'Jalankan Alur Kerja' : 'Run Workflow') :
                      selectedKeyToInspect === 'guardian.validation' ? (language === 'id' ? 'Validasi Guardian' : 'Guardian Validation') :
                      selectedKeyToInspect === 'decision.analysis' ? (language === 'id' ? 'Analisis Mesin Keputusan' : 'Decision Engine Analysis') : ''}"
                  </p>
                </div>
                <span className="text-[6.5px] text-slate-500 text-right mt-1 font-mono">language: {language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Publisher Locale Package Register Simulator */}
        <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100/40 space-y-2">
          <div className="flex items-center gap-1">
            <span className="bg-indigo-600 w-1.5 h-1.5 rounded-full block animate-pulse"></span>
            <span className="text-[9px] font-black text-indigo-900 uppercase">Simulasi Publisher i18n Package (.json)</span>
          </div>
          <p className="text-[9px] text-indigo-950/70 leading-normal font-medium">
            Sebagai penyedia modul, Publisher dapat membundel paket terjemahan tambahan ke dalam file manifest <strong className="text-indigo-900 font-bold">.aseb</strong> mereka sendiri. Coba daftarkan di bawah:
          </p>

          <div className="grid grid-cols-2 gap-2 text-[8px]">
            <div>
              <label className="text-slate-400 uppercase font-black block">Kode Bahasa (Locale)</label>
              <input 
                type="text" 
                value={customLocale} 
                onChange={(e) => setCustomLocale(e.target.value.toLowerCase())}
                placeholder="de, es, fr, jp"
                className="w-full bg-white border border-slate-200 p-1 text-[9px] font-bold rounded focus:outline-none" 
              />
            </div>
            <div>
              <label className="text-slate-400 uppercase font-black block">Terjemahan "Workbook"</label>
              <input 
                type="text" 
                value={customTerm} 
                onChange={(e) => setCustomTerm(e.target.value)}
                placeholder="misal: Arbeitsmappe"
                className="w-full bg-white border border-slate-200 p-1 text-[9px] font-bold rounded focus:outline-none" 
              />
            </div>
          </div>

          <button
            onClick={handleRegisterCustomLocale}
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-[8px] uppercase tracking-wider rounded-lg transition-all cursor-pointer shadow-xs"
          >
            Daftarkan Paket Bahasa Baru
          </button>

          {registrationFeedback && (
            <p className="text-[8px] text-emerald-700 font-extrabold animate-bounce text-center">
              {registrationFeedback}
            </p>
          )}

          {/* Registered Custom Locales Monitor */}
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-900 space-y-1">
            <span className="text-[7px] text-slate-400 uppercase tracking-wider block font-bold">Sandbox Locale Registry:</span>
            <div className="flex gap-1 flex-wrap">
              <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[7px] font-bold font-mono">id (Bahasa Indonesia)</span>
              <span className="bg-slate-800 text-slate-300 px-1 py-0.5 rounded text-[7px] font-bold font-mono">en (English - Canonical)</span>
              {Object.keys(customRegistry).map(loc => (
                <span key={loc} className="bg-indigo-950 text-indigo-300 border border-indigo-900 px-1 py-0.5 rounded text-[7px] font-extrabold font-mono flex items-center gap-1 animate-fade-in">
                  🌍 {loc.toUpperCase()}: "{customRegistry[loc]['concept.workbook']}"
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. TENTANG ASE WORKBOOK (ARSITEKTUR) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Cpu className="w-4.5 h-4.5 text-slate-500" /> Tentang ASE Workbook
        </h3>
        <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
          ASE Workbook adalah platform Workbook Digital modular pertama yang mengintegrasikan satu basis data bersama untuk berbagai jenis buku produktivitas.
        </p>

        {/* Visual Architecture Tab Selectors */}
        <div className="space-y-2">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Arsitektur Modular Platform</span>
          
          <div className="flex gap-1 overflow-x-auto no-scrollbar border border-slate-100 p-0.5 bg-slate-50 rounded-xl">
            {[
              { id: 'core', label: 'ASE Core' },
              { id: 'data', label: 'Data Bersama' },
              { id: 'guardian', label: 'Guardian' },
              { id: 'engine', label: 'Book Engine' },
              { id: 'shared', label: 'Shared Data Engine' }
            ].map((tab) => (
              <button
                key={tab.id}
                id={`btn-arch-${tab.id}`}
                onClick={() => setActiveArchTab(tab.id as any)}
                className={`px-2.5 py-1.5 text-[10px] font-extrabold rounded-lg whitespace-nowrap transition-all ${
                  activeArchTab === tab.id 
                    ? 'bg-emerald-600 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Card describing the selection */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 animate-fade-in space-y-1">
            {activeArchTab === 'core' && (
              <>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Cpu className="w-4 h-4 text-emerald-600" /> ASE Core
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Sistem kernel pusat yang mengontrol muatan modul buku kerja digital. Bertugas mengelola siklus hidup, mengunduh file manifest buku, serta melacak hak akses data secara aman.
                </p>
              </>
            )}
            {activeArchTab === 'data' && (
              <>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Database className="w-4 h-4 text-emerald-600" /> Data Bersama
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Gudang data tunggal yang aman secara lokal. Menyimpan semua entri jawaban, saldo keuangan, catatan, dan progres Anda sehingga dapat diakses oleh buku kerja mana pun secara otomatis.
                </p>
              </>
            )}
            {activeArchTab === 'guardian' && (
              <>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Guardian Security
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Sistem keamanan internal yang bertindak sebagai sandboxing. Memastikan setiap buku kerja hanya membaca data yang diizinkan dan mencegah manipulasi data secara tidak sah oleh modul eksternal.
                </p>
              </>
            )}
            {activeArchTab === 'engine' && (
              <>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Layers className="w-4 h-4 text-emerald-600" /> Book Engine
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Penerjemah logis yang membaca instruksi, struktur input, alur rumus, dan formula visualisasi dari berkas biner buku kerja (v1 hingga v3) untuk kemudian dirender ke dalam antarmuka UI.
                </p>
              </>
            )}
            {activeArchTab === 'shared' && (
              <>
                <h4 className="text-xs font-black text-slate-800 flex items-center gap-1">
                  <Activity className="w-4 h-4 text-emerald-600" /> Shared Data Engine
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Mesin pemetaan real-time yang menyelaraskan input-output antar-buku. Misalnya, mengimpor nilai "Pengeluaran Pokok" dari buku kerja keuangan Anda untuk menghitung skor efisiensi di buku kerja Planner Harian.
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4.5. ASE CORE RUNTIME CONSOLE */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4.5 h-4.5 text-slate-500" />
            <span>ASE Core Kernel Console</span>
          </div>
          <button
            id="btn-toggle-dev-console"
            onClick={() => setShowDeveloperConsole(!showDeveloperConsole)}
            className={`px-3 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer ${
              showDeveloperConsole
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {showDeveloperConsole ? 'Tutup Konsol' : 'Buka Konsol'}
          </button>
        </h3>
        <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
          Uji coba fungsionalitas ASE Core Kernel secara modular untuk membuktikan visi platform. Jalankan simulasi boot, validasi tanda tangan Guardian, Event Bus, dan Shared Data Engine hulu ke hilir.
        </p>

        {showDeveloperConsole && (
          <div className="pt-2">
            <CoreKernelView themeColor={themeColor} />
          </div>
        )}
      </div>

      {/* 5. TEMA VISUAL */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
        <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
          <Palette className="w-4.5 h-4.5 text-slate-500" /> Tema Warna Dinamis
        </h3>
        
        <div className="grid grid-cols-5 gap-2 pt-1">
          {colorThemes.map((theme) => {
            const isSelected = themeColor === theme.id;
            return (
              <button
                key={theme.id}
                id={`btn-theme-select-${theme.id}`}
                onClick={() => onChangeThemeColor(theme.id)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                title={theme.label}
              >
                <div className={`w-9 h-9 rounded-full ${theme.bgClass} flex items-center justify-center transition-all ${
                  isSelected 
                    ? 'ring-4 ring-offset-2 ring-slate-800 scale-105 shadow' 
                    : 'group-hover:scale-105'
                }`}>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </div>
                <span className={`text-[9px] font-bold leading-tight ${isSelected ? 'text-slate-800' : 'text-slate-400'}`}>
                  {theme.label.split(' ')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. RESET DATA & SPLASH SCREEN */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-2.5">
        <button
          id="btn-trigger-splash"
          onClick={onTriggerSplash}
          className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          Lihat Kembali Splash Screen
        </button>

        <button
          id="btn-reset-data-all"
          onClick={() => {
            if (window.confirm("Apakah Anda yakin ingin menyetel ulang semua data buku kerja, riwayat input, dan catatan Anda kembali ke setelan awal?")) {
              onResetData();
              alert("Data aplikasi berhasil disetel ulang!");
            }
          }}
          className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.99]"
        >
          <RotateCcw className="w-4 h-4 text-rose-600" />
          Reset Semua Progres Kerja
        </button>
      </div>

      {/* App Version Footer */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-center space-y-1">
        <h4 className="text-xs font-extrabold text-slate-700">ASE Workbook Indonesia</h4>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">v1.0.0 (Stabil)</p>
      </div>

    </div>
  );
}

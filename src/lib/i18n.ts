/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// 1. CANONICAL TERMINOLOGY DICTIONARY (User Guideline 8)
export const CANONICAL_DICTIONARY: Record<string, { definition: string; forbidden: string[] }> = {
  "Workbook": {
    definition: "Core modular productivity workbook structure carrying manifest specs (.aseb)",
    forbidden: ["Work Book", "BukuKerja", "WorkBook"]
  },
  "Resource": {
    definition: "Underlying data entity or asset consumed by workbook workflows",
    forbidden: ["Asset Resource", "Resurs", "Assets"]
  },
  "Workflow": {
    definition: "Automated sequence of triggers and decisions within the environment",
    forbidden: ["Work Flow", "Alur Kerja Manual"]
  },
  "Decision Engine": {
    definition: "Rule evaluation matrix engine determining operational branching",
    forbidden: ["Decision Matrix", "Engine Keputusan"]
  },
  "Guardian": {
    definition: "Sandbox security gatekeeper verifying schema adherence and preventing telemetry leaks",
    forbidden: ["Guardian Engine", "Security Guard", "Validator"]
  },
  "Marketplace": {
    definition: "The category platform repository for verified Workbooks and Language Packs",
    forbidden: ["Market Place", "Toko Buku"]
  }
};

// 2. TRANSLATION CONTRACTS (User Guideline 4)
export interface ILanguagePackageManifest {
  id: string;         // e.g. "ase-lang-id"
  language: string;   // e.g. "id-ID" or "de-DE"
  version: string;    // e.g. "1.0.0"
  publisher: string;  // e.g. "ASE Core Team"
}

export interface ITranslationProvider {
  getLocales(): string[];
  getTranslation(key: string, locale: string): string | null;
  getMetadata(locale: string): ILanguagePackageManifest | null;
  registerLanguagePack(pkg: ITranslationPackage): void;
}

export interface ITranslationPackage {
  manifest: ILanguagePackageManifest;
  translations: Record<string, string>;
}

// 3. BASE DICTIONARY FOR THE CORE UI (User Guideline 2)
export const BASE_CORE_TRANSLATIONS: Record<string, Record<string, string>> = {
  en: {
    // Concepts (Canonical Terminology)
    "concept.workbook": "Workbook",
    "concept.resource": "Resource",
    "concept.workflow": "Workflow",
    "concept.decisionEngine": "Decision Engine",
    "concept.knowledgeEngine": "Knowledge Engine",
    "concept.eventBus": "Event Bus",
    "concept.guardian": "Guardian",
    "concept.marketplace": "Marketplace",
    "concept.dashboard": "Dashboard",
    "concept.module": "Module",
    "concept.api": "API",
    "concept.runtime": "Runtime",
    "concept.sandbox": "Sandbox",
    "concept.sdk": "SDK",
    "concept.cli": "CLI",

    // Action Translation Keys (User Guideline 1)
    "workbook.install": "Install Workbook",
    "workbook.remove": "Remove Workbook",
    "workflow.run": "Run Workflow",
    "guardian.validation": "Guardian Validation",
    "decision.analysis": "Decision Engine Analysis",
    "knowledge.sync": "Knowledge Engine Sync",
    "event.broadcast": "Broadcast Event",
    
    // Screens
    "screen.home": "ASE Home",
    "screen.myWorkbooks": "My Workbooks",
    "screen.explore": "Explore Marketplace",
    "screen.summary": "Summary & Progress",
    "screen.settings": "Settings & Platform Specs",

    // Settings
    "settings.profile": "User Profile",
    "settings.fullName": "Full Name",
    "settings.userRole": "User Role",
    "settings.userWorkspace": "Workspace Profile Mode (Enterprise Ready)",
    "settings.dataManagement": "Independent Data Management",
    "settings.language": "App Language",
    "settings.selectLanguage": "Select Primary Language",
    "settings.about": "About ASE Workbook",
    "settings.architecture": "Platform Modular Architecture",
    "settings.backup": "Backup Data",
    "settings.restore": "Restore Data",
    "settings.backupSuccess": "✓ Backup saved locally successfully!",
    "settings.restoreSuccess": "✓ Data restored from local backup successfully!",
    "settings.realtimeSave": "Profile changes saved in real-time!",

    // Library descriptions
    "arch.core.title": "ASE Core Runtime",
    "arch.core.desc": "Central kernel system controlling modular workbook loading. Manages lifetime scopes, downloads workbook manifest contracts, and handles security boundaries.",
    "arch.data.title": "Unified Shared Database",
    "arch.data.desc": "A single, local secure data warehouse storing all form entries, balances, notes, and milestones, letting any workbook read and write safely.",
    "arch.guardian.title": "Guardian Security",
    "arch.guardian.desc": "Ensures absolute schema adherence. Scans .aseb binary payloads during installation to prevent data leak, unauthorized script injection, or telemetry spam.",
    "arch.engine.title": "Adaptive Workflow Engine",
    "arch.engine.desc": "Executes dynamic multi-step rules specified in workbook manifest contracts. Links user input triggers directly into automatic actions.",

    // Core kernel & SDK
    "sdk.runTest": "Run Extreme Load-Test",
    "sdk.eventBusFlood": "Event Bus Flood",
    "sdk.specLocked": "v1.0 SPEC LOCKED",
    "sdk.successDef": "🏆 ASE v1.0 Success Definition & Exit Criteria",
    "sdk.exitCriteria": "🛑 Exit Criteria v1.0 (Phase Completion Requirements)",
    "sdk.installSdk": "Install SDK",
    "sdk.createWb": "Create Workbook",
    "sdk.validation": "Validation",
    "sdk.buildAseb": "Build .aseb",
    "sdk.installAse": "Install to ASE",
    "sdk.wbRunning": "Workbook Running",
    "sdk.modifyCore": "Modify Core",
    "sdk.teamAssistance": "Core Team Help",
    "sdk.success": "✓ Successful",
    "sdk.noNeed": "✗ No Need (0)",
    "sdk.independent": "✗ No Need (Independent)",
  },
  id: {
    // Concepts (Indonesian Translation Layer)
    "concept.workbook": "Buku Kerja",
    "concept.resource": "Sumber Daya",
    "concept.workflow": "Alur Kerja",
    "concept.decisionEngine": "Mesin Keputusan",
    "concept.knowledgeEngine": "Mesin Pengetahuan",
    "concept.eventBus": "Bus Event",
    "concept.guardian": "Guardian",
    "concept.marketplace": "Marketplace",
    "concept.dashboard": "Dasbor",
    "concept.module": "Modul",
    "concept.api": "API",
    "concept.runtime": "Runtime",
    "concept.sandbox": "Sandbox",
    "concept.sdk": "SDK",
    "concept.cli": "CLI",

    // Action Translation Keys
    "workbook.install": "Pasang Buku Kerja",
    "workbook.remove": "Copot Buku Kerja",
    "workflow.run": "Jalankan Alur Kerja",
    "guardian.validation": "Validasi Guardian",
    "decision.analysis": "Analisis Mesin Keputusan",
    "knowledge.sync": "Sinkronisasi Mesin Pengetahuan",
    "event.broadcast": "Siarkan Event",

    // Screens
    "screen.home": "Beranda ASE",
    "screen.myWorkbooks": "Buku Kerja Saya",
    "screen.explore": "Jelajahi Marketplace",
    "screen.summary": "Ringkasan & Progres",
    "screen.settings": "Pengaturan & Spesifikasi",

    // Settings
    "settings.profile": "Profil Pengguna",
    "settings.fullName": "Nama Lengkap",
    "settings.userRole": "Peran Pengguna",
    "settings.userWorkspace": "Mode Profil Workspace (Enterprise Ready)",
    "settings.dataManagement": "Pengelolaan Data Mandiri",
    "settings.language": "Bahasa Aplikasi",
    "settings.selectLanguage": "Pilih Bahasa Utama",
    "settings.about": "Tentang ASE Workbook",
    "settings.architecture": "Arsitektur Modular Platform",
    "settings.backup": "Cadangkan Data",
    "settings.restore": "Pemulihan Data",
    "settings.backupSuccess": "✓ Cadangan berhasil disimpan secara lokal!",
    "settings.restoreSuccess": "✓ Data berhasil dipulihkan dari cadangan lokal!",
    "settings.realtimeSave": "Perubahan profil disimpan secara real-time!",

    // Library descriptions
    "arch.core.title": "ASE Core Runtime",
    "arch.core.desc": "Sistem kernel pusat yang mengontrol pemuatan modul buku kerja secara modular. Mengatur daur hidup, mengunduh kontrak manifes, dan menangani batas keamanan.",
    "arch.data.title": "Basis Data Bersama Terpadu",
    "arch.data.desc": "Gudang data lokal tunggal yang aman untuk menyimpan semua entri formulir, saldo, catatan, dan milestones, memungkinkan setiap buku kerja membaca dan menulis dengan aman.",
    "arch.guardian.title": "Keamanan Guardian",
    "arch.guardian.desc": "Menjamin ketaatan skema mutlak. Memindai muatan biner .aseb saat instalasi untuk mencegah kebocoran data, injeksi skrip tidak sah, atau spam telemetri.",
    "arch.engine.title": "Adaptive Workflow Engine",
    "arch.engine.desc": "Mengeksekusi aturan multi-langkah dinamis yang tercantum dalam kontrak manifes buku kerja. Menghubungkan pemicu input pengguna langsung dengan tindakan otomatis.",

    // Core kernel & SDK
    "sdk.runTest": "Jalankan Load-Test Ekstrem",
    "sdk.eventBusFlood": "Flooding Bus Event",
    "sdk.specLocked": "SPESIFIKASI DIKUNCI v1.0",
    "sdk.successDef": "🏆 Definisi Sukses & Syarat Keluar ASE v1.0",
    "sdk.exitCriteria": "🛑 Exit Criteria v1.0 (Syarat Keluar Fase)",
    "sdk.installSdk": "Pasang SDK",
    "sdk.createWb": "Membuat Buku Kerja",
    "sdk.validation": "Validasi",
    "sdk.buildAseb": "Build .aseb",
    "sdk.installAse": "Pasang ke ASE",
    "sdk.wbRunning": "Buku Kerja Berjalan",
    "sdk.modifyCore": "Modifikasi Core",
    "sdk.teamAssistance": "Bantuan Tim Inti",
    "sdk.success": "✓ Berhasil",
    "sdk.noNeed": "✗ Tidak Perlu (0)",
    "sdk.independent": "✗ Tidak Perlu (Mandiri)",
  }
};

// 4. LANGUAGE REGISTRY & LOADER ENGINE (User Guideline 1 & 2)
class LanguageRegistryClass implements ITranslationProvider {
  private packages: Map<string, ITranslationPackage> = new Map();

  constructor() {
    // Autoload base packages
    this.registerLanguagePack({
      manifest: { id: "ase-lang-en", language: "en", version: "1.0.0", publisher: "ASE Core Team" },
      translations: BASE_CORE_TRANSLATIONS.en
    });
    this.registerLanguagePack({
      manifest: { id: "ase-lang-id", language: "id", version: "1.0.0", publisher: "ASE Core Team" },
      translations: BASE_CORE_TRANSLATIONS.id
    });
  }

  public registerLanguagePack(pkg: ITranslationPackage): void {
    const loc = pkg.manifest.language.toLowerCase();
    this.packages.set(loc, pkg);
  }

  public getLocales(): string[] {
    return Array.from(this.packages.keys());
  }

  public getMetadata(locale: string): ILanguagePackageManifest | null {
    const pkg = this.packages.get(locale.toLowerCase());
    return pkg ? pkg.manifest : null;
  }

  // FALLBACK CHAIN RESOLUTION (User Guideline 5)
  // German -> English -> Canonical Translation Key
  public getTranslation(key: string, locale: string): string | null {
    const targetLoc = locale.toLowerCase();
    
    // Step 1: Check target locale translation
    const targetPkg = this.packages.get(targetLoc);
    if (targetPkg && targetPkg.translations[key]) {
      return targetPkg.translations[key];
    }

    // Step 2: Fallback to English (Global base language)
    const enPkg = this.packages.get("en");
    if (enPkg && enPkg.translations[key]) {
      return enPkg.translations[key];
    }

    // Step 3: Fallback to canonical translation key itself (Never return empty string)
    return key;
  }
}

// Instantiate Global Language Registry
export const LanguageRegistry = new LanguageRegistryClass();

// 5. TRANSLATION & LOCALE SERVICE (User Guideline 1, 3, & 6)
export const TranslationService = {
  /**
   * Translates a given key with target locale with fallbacks
   */
  t(key: string, locale: string = "id"): string {
    return LanguageRegistry.getTranslation(key, locale) || key;
  },

  /**
   * Formats currencies according to specific locale standard
   */
  formatCurrency(value: number, locale: string = "id"): string {
    if (locale === "id") {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(value);
    } else if (locale === "en") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
      }).format(value);
    } else if (locale === "de") {
      return new Intl.NumberFormat("de-DE", {
        style: "currency",
        currency: "EUR"
      }).format(value);
    } else {
      return `${value}`;
    }
  },

  /**
   * Formats numbers
   */
  formatNumber(value: number, locale: string = "id"): string {
    const tag = locale === "id" ? "id-ID" : locale === "en" ? "en-US" : "de-DE";
    return new Intl.NumberFormat(tag).format(value);
  },

  /**
   * Formats dates cleanly
   */
  formatDate(dateStr: string, locale: string = "id"): string {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const tag = locale === "id" ? "id-ID" : locale === "en" ? "en-US" : "de-DE";
    return new Intl.DateTimeFormat(tag, { dateStyle: "medium" }).format(date);
  },

  /**
   * Custom simple rules for Pluralization
   */
  pluralize(count: number, singularKey: string, pluralKey: string, locale: string = "id"): string {
    if (locale === "id") {
      // Indonesian has no plural word transformation (just repeat or prefix with count)
      return `${count} ${this.t(singularKey, locale)}`;
    }
    // English-like pluralization
    const key = count === 1 ? singularKey : pluralKey;
    return `${count} ${this.t(key, locale)}`;
  }
};

// 6. DEPRECATED OR BACKWARD COMPATIBLE EXPORTS
export const TRANSLATIONS = BASE_CORE_TRANSLATIONS;
export type Locale = 'en' | 'id';

export function getTranslation(key: string, lang: Locale = 'id'): string {
  return TranslationService.t(key, lang);
}

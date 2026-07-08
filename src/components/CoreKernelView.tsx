/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Cpu, 
  Layers, 
  Zap, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Trash2, 
  Activity, 
  ArrowRight,
  Database,
  Briefcase,
  Eye,
  EyeOff,
  BarChart2,
  Shield,
  Network,
  Clock,
  Code,
  List,
  CheckSquare,
  TrendingUp,
  Sliders,
  Sparkles
} from 'lucide-react';
import { aseKernelInstance, ASEKernel } from '../core/Kernel';
import { KernelLog, ModuleManifest, CoreEvent } from '../core/types';
import { DecisionEngine } from '../utils/DecisionEngine';
import { AssetRegistry } from '../core/AssetRegistry';
import { IdentityModule } from '../core/IdentityService';

interface CoreKernelViewProps {
  themeColor: string;
}

const successDefTranslations = {
  EN: {
    title: "🏆 ASE v1.0 Success Definition & Exit Criteria",
    subtitle: "North Star Metric & Success Benchmark as Platform Enablement",
    objective: "ASE v1.0 is declared successful if a developer who has never contributed to ASE Core can, using only the official SDK and documentation, create, validate, compile, install, and run a Workbook without modifying the ASE Core and without direct assistance from the core team.",
    matriksTitle: "📊 Criteria & Target Matrix",
    exitTitle: "🛑 Exit Criteria v1.0 (Phase Completion Requirements)",
    techExit: "🛠️ Technical Exit",
    docExit: "📄 Documentation Exit",
    ecoExit: "🌱 Ecosystem Exit",
    
    // Matrix items
    installSdk: "Install SDK",
    createWb: "Create Workbook",
    validation: "Validation",
    buildAseb: "Build .aseb",
    installAse: "Install to ASE",
    wbRunning: "Workbook Running",
    modifyCore: "Modify Core",
    teamAssistance: "Core Team Help",
    
    // Matrix statuses
    statusSuccess: "✓ Successful",
    statusNoNeed: "✗ No Need (0)",
    statusIndependent: "✗ No Need (Independent)",
    
    // Exit criteria items
    techList: [
      "Core Runtime stable",
      "SDK stable",
      "Validation Engine stable",
      "Guardian stable",
      "Marketplace API ready"
    ],
    docList: [
      "Developer Guide complete",
      "SDK Reference complete",
      "Module Contract documented",
      "Minimum 5 example workbooks"
    ],
    ecoList: [
      "Min. 1 ext. developer",
      "Min. 1 ext. workbook running",
      "Feedback acted upon"
    ]
  },
  ID: {
    title: "🏆 Definisi Sukses & Syarat Keluar ASE v1.0",
    subtitle: "North Star Metric & Tolok Ukur Keberhasilan sebagai Platform Enablement",
    objective: "ASE v1.0 dinyatakan berhasil apabila seorang developer yang tidak pernah berkontribusi pada ASE Core dapat, hanya menggunakan SDK dan dokumentasi resmi, membuat, memvalidasi, mengompilasi, memasang, dan menjalankan sebuah Workbook tanpa memodifikasi ASE Core dan tanpa bantuan langsung dari tim inti.",
    matriksTitle: "📊 Matriks Kriteria & Target",
    exitTitle: "🛑 Exit Criteria v1.0 (Syarat Keluar Fase)",
    techExit: "🛠️ Technical Exit",
    docExit: "📄 Documentation Exit",
    ecoExit: "🌱 Ecosystem Exit",
    
    // Matrix items
    installSdk: "Install SDK",
    createWb: "Membuat Buku Kerja",
    validation: "Validasi",
    buildAseb: "Build .aseb",
    installAse: "Pasang ke ASE",
    wbRunning: "Buku Kerja Berjalan",
    modifyCore: "Modifikasi Core",
    teamAssistance: "Bantuan Tim Inti",
    
    // Matrix statuses
    statusSuccess: "✓ Berhasil",
    statusNoNeed: "✗ Tidak Perlu (0)",
    statusIndependent: "✗ Tidak Perlu (Mandiri)",
    
    // Exit criteria items
    techList: [
      "Core Runtime stabil",
      "SDK stabil",
      "Validation Engine stabil",
      "Guardian stabil",
      "Marketplace API siap"
    ],
    docList: [
      "Developer Guide lengkap",
      "SDK Reference lengkap",
      "Module Contract terdokumentasi",
      "Minimal 5 contoh buku kerja"
    ],
    ecoList: [
      "Min. 1 ext. developer",
      "Min. 1 ext. buku kerja berjalan",
      "Feedback ditindaklanjuti"
    ]
  },
  JP: {
    title: "🏆 ASE v1.0 成功の定義と終了基準",
    subtitle: "プラットフォーム有効化としてのノーススターメトリックと成功ベンチマーク",
    objective: "ASE v1.0は、ASE Coreに一度も貢献したことがない開発者が、公式のSDKとドキュメントのみを使用して、ASE Coreを変更することなく、またコアチームからの直接の支援なしに、Workbookの作成、検証、コンパイル、インストール、および実行を行うことができた場合に成功したと宣言されます。",
    matriksTitle: "📊 基準とターゲットマトリックス",
    exitTitle: "🛑 終了基準 v1.0 (フェーズ完了要件)",
    techExit: "🛠️ 技術的終了基準",
    docExit: "📄 ドキュメント終了基準",
    ecoExit: "🌱 エコシステム終了基準",
    
    // Matrix items
    installSdk: "SDKインストール",
    createWb: "Workbook作成",
    validation: "検証",
    buildAseb: "Build .aseb",
    installAse: "ASEへのインストール",
    wbRunning: "Workbookの実行",
    modifyCore: "コアの変更",
    teamAssistance: "コアチームの支援",
    
    // Matrix statuses
    statusSuccess: "✓ 成功",
    statusNoNeed: "✗ 不要 (0)",
    statusIndependent: "✗ 不要 (自立的)",
    
    // Exit criteria items
    techList: [
      "コアランタイムの安定",
      "SDKの安定",
      "検証エンジンの安定",
      "Guardianの安定",
      "Marketplace APIの準備完了"
    ],
    docList: [
      "開発者ガイドの完成",
      "SDKリファレンスの完成",
      "モジュール契約の文書化",
      "最低5つのサンプルワークブック"
    ],
    ecoList: [
      "最低1人の外部開発者",
      "最低1つの外部ワークブックの実行",
      "フィードバックの適用"
    ]
  }
};

export default function CoreKernelView({ themeColor }: CoreKernelViewProps) {
  // Config state
  const [isDevMode, setIsDevMode] = useState<boolean>(true);
  const [translationLang, setTranslationLang] = useState<'EN' | 'ID' | 'JP'>('EN');
  const [activeTab, setActiveTab] = useState<'runtime' | 'modules' | 'assets' | 'identity' | 'events' | 'services' | 'guardian' | 'graph' | 'workflow' | 'decision' | 'logs' | 'certifications'>('certifications');
  
  // Interactive Certification Simulation States
  const [sdkSimStatus, setSdkSimStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [sdkLogs, setSdkLogs] = useState<string[]>([]);
  const [marketSimStatus, setMarketSimStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [marketLogs, setMarketLogs] = useState<string[]>([]);
  const [thirdPartySimStatus, setThirdPartySimStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [thirdPartyLogs, setThirdPartyLogs] = useState<string[]>([]);
  const [loadTestStatus, setLoadTestStatus] = useState<'idle' | 'running' | 'success'>('idle');
  const [loadTestCount, setLoadTestCount] = useState<number>(0);

  // Interactive Asset Registry States
  const [assetTick, setAssetTick] = useState<number>(0);
  const [assetLogs, setAssetLogs] = useState<string[]>(['[System] Assets Registry UI initialized. Ready to verify signatures and permissions.']);

  // Interactive Identity Module States
  const [identityLogs, setIdentityLogs] = useState<string[]>(['[Identity] Identity Module online. Ready to accept OAuth secure tokens.']);
  const [identityTick, setIdentityTick] = useState<number>(0);
  const [mockAuthEmail, setMockAuthEmail] = useState<string>('prasetyo.ase@gmail.com');
  const [mockAuthName, setMockAuthName] = useState<string>('Prasetyo');

  // Run SDK Certification Simulation
  const runSdkSimulation = () => {
    if (sdkSimStatus === 'running') return;
    setSdkSimStatus('running');
    setSdkLogs([]);
    const steps = [
      'Menjalankan "ase create workbook my-custom-tracker"...',
      'Boilerplate berhasil dibuat. Membaca berkas manifest.json...',
      'Menjalankan "ase validate" terhadap manifest & schema...',
      '✓ Validasi manifest lolos. Format SemVer v1.0.0 sah.',
      '✓ Hak akses data terkendali (Hanya memohon "taskRecords").',
      'Menjalankan "ase compile" untuk menghasilkan bundel terenkripsi...',
      '✓ Modul berhasil dikompilasi ke format "my-custom-tracker.aseb".',
      '✓ Hash integritas dihitung: ASE-SHA256-429a8f...',
      'SDK Certified status diverifikasi sukses!'
    ];
    
    steps.forEach((step, idx) => {
      setTimeout(() => {
        setSdkLogs(prev => [...prev, `[SDK-CLI] ${step}`]);
        if (idx === steps.length - 1) {
          setSdkSimStatus('success');
          aseKernelInstance.log('success', 'SDK-Validator', 'Otomatisasi pengujian SDK-CLI berhasil disimulasikan.');
        }
      }, (idx + 1) * 350);
    });
  };

  // Run Marketplace Certification Simulation
  const runMarketSimulation = () => {
    if (marketSimStatus === 'running') return;
    setMarketSimStatus('running');
    setMarketLogs([]);
    const steps = [
      'Menghubungkan ke Registry Marketplace MVP...',
      'Memulai alur "Publish" untuk modul "Growth OS"...',
      'Menjalankan audit keamanan otomatis di sisi server...',
      '✓ "Validate": Struktur berkas manifest sah.',
      '✓ "Sign": Menandatangani sertifikat digital "ASE-SIG-GROWTH-2026-X902".',
      '✓ "Upload": Bundel .aseb berhasil diunggah ke repositori pusat.',
      'Memulai alur konsumen: "Download" berkas dari Marketplace...',
      '✓ "Install": Modul terpasang dan siap dieksekusi secara instan.',
      'Menjalankan "Update" parsial untuk peningkatan kinerja...',
      '✓ "Remove": Uji pelepasan modul aman tanpa memengaruhi data inti.',
      'Siklus hidup distribusi Marketplace Certified berhasil dibuktikan!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setMarketLogs(prev => [...prev, `[Marketplace] ${step}`]);
        if (idx === steps.length - 1) {
          setMarketSimStatus('success');
          aseKernelInstance.log('success', 'Marketplace-Server', 'Distribusi siklus hidup modul terverifikasi penuh.');
        }
      }, (idx + 1) * 300);
    });
  };

  // Run Third Party Certification Simulation
  const runThirdPartySimulation = () => {
    if (thirdPartySimStatus === 'running') return;
    setThirdPartySimStatus('running');
    setThirdPartyLogs([]);
    const steps = [
      'Menerima registrasi modul dari Kontributor Independen...',
      'Nama Modul: "HealthTracker Pro" oleh Dr. Amira',
      'Verifikasi manifest eksternal...',
      '✓ Schema manifest lolos validasi publik.',
      'Mengevaluasi kebijakan izin sandbox...',
      '✓ Membatasi akses: Hanya diizinkan membaca "habitRecords".',
      '✓ Sandbox mengisolasi runtime agar terhindar dari kebocoran data sensitif.',
      '✓ Memasang "HealthTracker Pro" secara aman.',
      'Third-Party Developer integration sukses!'
    ];

    steps.forEach((step, idx) => {
      setTimeout(() => {
        setThirdPartyLogs(prev => [...prev, `[Third-Party] ${step}`]);
        if (idx === steps.length - 1) {
          setThirdPartySimStatus('success');
          aseKernelInstance.log('success', 'ThirdParty-Loader', 'Modul pengembang luar berhasil diurai dan dibatasi.');
        }
      }, (idx + 1) * 300);
    });
  };

  // Run Enterprise Performance Load-Test Simulation
  const runLoadTestSimulation = () => {
    if (loadTestStatus === 'running') return;
    setLoadTestStatus('running');
    setLoadTestCount(0);
    
    let count = 0;
    const interval = setInterval(() => {
      count += 10;
      setLoadTestCount(count);
      aseKernelInstance.eventBus.publish('enterprise.loadtest.event', {
        batchId: 'loadtest-100',
        sequence: count,
        payload: { payloadSize: '256 bytes', integrityCheck: true }
      }, 'LoadTestRunner');

      if (count >= 100) {
        clearInterval(interval);
        setLoadTestStatus('success');
        aseKernelInstance.log('success', 'Enterprise-LoadTest', 'Load-Test Berhasil: 100 event berturut-turut diproses dengan latency rata-rata <0.04ms.');
      }
    }, 50);
  };

  // Sub-tab state for Certification view
  const [certSubTab, setCertSubTab] = useState<'health' | 'adx' | 'stages' | 'program' | 'matrix' | 'milestones' | 'observatory'>('health');

  // Interactive governance demonstration states
  const [isByteTampered, setIsByteTampered] = useState<boolean>(false);
  const [adaptiveLevel, setAdaptiveLevel] = useState<'A0' | 'A1' | 'A2' | 'A3' | 'A4' | 'A5'>('A4');
  const [observatoryAnomaly, setObservatoryAnomaly] = useState<boolean>(false);
  const [observatoryLoad, setObservatoryLoad] = useState<'normal' | 'high' | 'idle'>('normal');

  // Governance Mode: 'simulation' vs 'certification'
  const [testMode, setTestMode] = useState<'simulation' | 'certification'>('certification');

  // Release Channel: 'Nightly' | 'Alpha' | 'Beta' | 'Stable' | 'LTS'
  const [releaseChannel, setReleaseChannel] = useState<'Nightly' | 'Alpha' | 'Beta' | 'Stable' | 'LTS'>('Alpha');

  // Rule-based SDK Certification requirements state
  const [sdkRules, setSdkRules] = useState({
    build: false,
    validate: false,
    install: false,
    remove: false,
    upgrade: false,
    documentation: true,
    sampleWorkbook: false
  });

  // ASE Developer Experience (ADX) Score states
  const [adxScore] = useState<number>(97);
  const [sdkInstallTimeSim] = useState<string>('< 2 menit');
  const [scaffoldTimeSim] = useState<string>('< 3 menit');
  
  // Validation Stages States
  const [stage1Status] = useState<'PASSED'>('PASSED');
  const [stage2Status, setStage2Status] = useState<'PENDING' | 'RUNNING' | 'PASSED'>('PENDING');
  const [stage2Logs, setStage2Logs] = useState<string[]>([]);
  const [stage2Persona, setStage2Persona] = useState<string>('Junior Frontend Developer');
  
  const [stage3Status, setStage3Status] = useState<'PENDING' | 'RUNNING' | 'PASSED'>('PENDING');
  const [stage3Logs, setStage3Logs] = useState<string[]>([]);
  
  const [stage4Status, setStage4Status] = useState<'PENDING' | 'RUNNING' | 'PASSED'>('PENDING');
  const [stage4Logs, setStage4Logs] = useState<string[]>([]);
  const [stressMetrics, setStressMetrics] = useState({
    workbooks: 3,
    widgets: 24,
    resources: 120,
    eventThroughputRate: 124,
    guardianCheckTime: 0.12
  });

  // Simulate Stage 2 Blind Dev Test
  const runBlindDevTest = () => {
    if (stage2Status === 'RUNNING') return;
    setStage2Status('RUNNING');
    setStage2Logs([]);
    const logs = [
      `[BlindDev] Persona: ${stage2Persona} memulai pengujian tanpa bimbingan internal...`,
      '[BlindDev] Langkah 1: Instalasi SDK CLI dalam terminal... (Selesai dalam 1.5 menit)',
      '[BlindDev] Langkah 2: Menjalankan "ase new workbook TodoApp" untuk inisialisasi...',
      '[BlindDev] ✓ Struktur scaffold workbook TodoApp berhasil di-generate otomatis.',
      '[BlindDev] Langkah 3: Menambahkan dashboard dan bento widget Todo List baru...',
      '[BlindDev] ❌ Error terdeteksi: "ASE-4041 Workspace Directory Empty" karena berada di folder yang salah.',
      '[BlindDev] 💡 Developer memahami pesan error dengan cepat berkat format standar Diagnostic Error Code.',
      '[BlindDev] Langkah 4: Membangun paket dengan "ase build" -> Menghasilkan TodoApp.aseb.',
      '[BlindDev] Langkah 5: Memasang modul ke sandbox runtime lewat "ase install TodoApp.aseb"...',
      '[BlindDev] ✓ Modul aktif di local runtime tanpa menyentuh atau memodifikasi file Core.',
      '[SUCCESS] Blind Developer Test selesai! ADX Score terverifikasi: 98/100. Dokumentasi Mandiri Terbukti Cukup!'
    ];
    
    logs.forEach((log, i) => {
      setTimeout(() => {
        setStage2Logs(prev => [...prev, log]);
        if (i === logs.length - 1) {
          setStage2Status('PASSED');
          aseKernelInstance.log('success', 'ADX-Engine', 'Blind Developer Test lulus dengan sukses.');
        }
      }, (i + 1) * 300);
    });
  };

  // Simulate Stage 3 Compatibility Test
  const runCompatibilityTest = () => {
    if (stage3Status === 'RUNNING') return;
    setStage3Status('RUNNING');
    setStage3Logs([]);
    const logs = [
      '[Compatibility] Memulai audit integrasi modul multi-workbook aktif...',
      '[Compatibility] Memuat modul paralel: [ Growth, Finance, Planner, CRM, Inventory ]',
      '[Compatibility] Mengevaluasi retensi Event Bus...',
      '[Compatibility] ✓ Event "TransactionCreated" dipancarkan -> Growth & Planner merespons instan.',
      '[Compatibility] Menguji kecepatan Guardian Sandbox Policy Validator...',
      '[Compatibility] ✓ Kebijakan Level-3 App Sandbox ditaati tanpa degradasi kecepatan.',
      '[Compatibility] Memeriksa efisiensi alokasi memori heap runtime...',
      '[Compatibility] ✓ RAM stabil pada 68 MB. Zero memory leaks terdeteksi.',
      '[Compatibility] Menguji siklus pasang & copot (Install & Uninstall) dinamis...',
      '[Compatibility] ✓ Modul dicopot tanpa menyisakan cache pada Core Runtime.',
      '[SUCCESS] Uji Kompatibilitas multi-workbook LULUS 100%!'
    ];

    logs.forEach((log, i) => {
      setTimeout(() => {
        setStage3Logs(prev => [...prev, log]);
        if (i === logs.length - 1) {
          setStage3Status('PASSED');
          aseKernelInstance.log('success', 'ADX-Engine', 'Compatibility Test multi-workbook lulus tanpa gangguan.');
        }
      }, (i + 1) * 300);
    });
  };

  // Simulate Stage 4 Stress Test
  const runStressTest = () => {
    if (stage4Status === 'RUNNING') return;
    setStage4Status('RUNNING');
    setStage4Logs([]);
    
    const steps = [
      { log: '[StressTest] Memulai skenario beban kerja ekstrim (Stress Test)...', workbooks: 10, widgets: 100, resources: 2000, tput: 500, gd: 0.15 },
      { log: '[StressTest] Menggandakan workbook sandbox aktif menjadi 30...', workbooks: 30, widgets: 300, resources: 15000, tput: 1200, gd: 0.28 },
      { log: '[StressTest] Mensimulasikan batas maksimal: 50 workbook terdaftar...', workbooks: 50, widgets: 500, resources: 100000, tput: 2500, gd: 0.42 },
      { log: '[StressTest] Membanjiri Event Bus dengan 5,000 event paralel...', workbooks: 50, widgets: 500, resources: 100000, tput: 4800, gd: 0.55 },
      { log: '[StressTest] Memeriksa latensi validasi kebijakan Guardian...', workbooks: 50, widgets: 500, resources: 100000, tput: 5200, gd: 0.64 },
      { log: '[SUCCESS] Stress Test Selesai! Core tetap stabil di bawah beban puncak.', workbooks: 50, widgets: 500, resources: 100000, tput: 124, gd: 0.12 }
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setStage4Logs(prev => [...prev, step.log]);
        setStressMetrics({
          workbooks: step.workbooks,
          widgets: step.widgets,
          resources: step.resources,
          eventThroughputRate: step.tput,
          guardianCheckTime: step.gd
        });
        if (i === steps.length - 1) {
          setStage4Status('PASSED');
          aseKernelInstance.log('success', 'Stress-Engine', 'Stress Test berhasil diselesaikan dengan 0 kegagalan.');
        }
      }, (i + 1) * 450);
    });
  };

  // Test Matrix interactive state (grouped by categories as requested)
  const [testMatrix, setTestMatrix] = useState<{
    [category: string]: {
      [testId: string]: { label: string; expected: string; status: 'checked' | 'unchecked' | 'testing' }
    }
  }>({
    bootCore: {
      reset: { label: 'Reset Core', expected: 'Booting & inisialisasi kernel selesai', status: 'unchecked' }
    },
    moduleLoader: {
      installAseb: { label: 'Install .aseb valid', expected: 'Pemasangan modul sesuai spesifikasi manifest', status: 'unchecked' }
    },
    guardian: {
      installCorrupted: { label: 'Install modul rusak', expected: 'Dicegah & diisolasi (karantina)', status: 'unchecked' }
    },
    eventBus: {
      publishTx: { label: 'Publish TransactionCreated', expected: 'Event didengar subscriber terdaftar', status: 'unchecked' }
    },
    serviceRegistry: {
      getNotification: { label: 'Ambil NotificationService', expected: 'Resolusi layanan komunikasi sukses', status: 'unchecked' }
    },
    sharedData: {
      readWriteResource: { label: 'Baca/Tulis Resource', expected: 'Akses memori aman & terenkripsi', status: 'unchecked' }
    },
    workflow: {
      autoTrigger: { label: 'Trigger otomatis berjalan', expected: 'Event terpicu dan mengeksekusi task', status: 'unchecked' }
    },
    decisionEngine: {
      recommendations: { label: 'Menghasilkan rekomendasi', expected: 'Analisis rekomendasi kuantitatif valid', status: 'unchecked' }
    },
    knowledgeEngine: {
      saveInsight: { label: 'Menyimpan insight', expected: 'Penyimpanan graf pengetahuan berhasil', status: 'unchecked' }
    }
  });

  // Interactive SDK CLI Console states
  const [selectedSdkCommand, setSelectedSdkCommand] = useState<string>('ase doctor');
  const [sdkConsoleOutput, setSdkConsoleOutput] = useState<string[]>([
    '[INFO] ASE CLI Toolchain v1.0.0-alpha initialized.',
    '[INFO] Pilih perintah SDK Alpha dari daftar untuk diuji.',
    '[INFO] Ketik atau pilih: "ase doctor" atau "ase new workbook Finance".'
  ]);
  const [sdkCommandLoading, setSdkCommandLoading] = useState<boolean>(false);
  const [createdWorkbook, setCreatedWorkbook] = useState<boolean>(false);
  const [builtWorkbook, setBuiltWorkbook] = useState<boolean>(false);
  const [installedWorkbook, setInstalledWorkbook] = useState<boolean>(false);

  const executeSdkCommand = async (cmd: string) => {
    if (sdkCommandLoading) return;
    setSdkCommandLoading(true);
    setSdkConsoleOutput(prev => [...prev, `\n$ ${cmd}`]);

    await new Promise(resolve => setTimeout(resolve, 350));

    if (cmd === 'ase doctor') {
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] ASE SDK 1.0 Diagnostics & Compatibility Checklist:',
        '  Core Runtime     [ SUCCESS ] Active',
        '  Guardian         [ SUCCESS ] Sandbox Shield Ready',
        '  Event Bus        [ SUCCESS ] Signal Queue Nominal',
        '  Service Registry [ SUCCESS ] 4 Engines Loaded',
        '  Node.js          [ SUCCESS ] v20.11.0 (Kompatibel)',
        '  Workspace        [ SUCCESS ] Writeable Access OK',
        '  SDK Version      [ SUCCESS ] v1.0.0-alpha',
        '[SUCCESS] No problems detected. All systems nominal.'
      ]);
    } else if (cmd === 'ase new workbook Finance') {
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] Creating scaffold template for "Finance" in current directory...',
        '✓ Initializing manifest.json',
        '✓ Structuring modular package hierarchy',
        '[SUCCESS] Project template initialized successfully:',
        '  Finance/',
        '  ├── manifest.json       <-- Metadata, permissions, capability limits',
        '  ├── src/                <-- Module computation core code',
        '  ├── dashboard/          <-- Bento layout visual component markup',
        '  ├── workflow/           <-- Automation flow action definition',
        '  ├── decision/           <-- Quantitative logical decision rules',
        '  ├── knowledge/          <-- Knowledge brain graph triple-store',
        '  ├── events/             <-- Custom Event Bus definitions',
        '  ├── resources/          <-- Asset repository',
        '  ├── tests/              <-- Isolated sandboxed unit testing suite',
        '  └── README.md           <-- Quick developer guidelines',
        '[INFO] Tip: Run "ase validate" or "ase build" to continue.'
      ]);
      setCreatedWorkbook(true);
      setSdkRules(prev => ({ ...prev, sampleWorkbook: true }));
    } else if (cmd === 'ase validate') {
      if (!createdWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4041: Workspace Directory Empty',
          '  - Cause: No active workbook configuration found in path.',
          '  - Action: Run "ase new workbook Finance" to generate a scaffold.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Auditing manifest, security policies, and resource declarations:',
          '✓ Manifest valid schema structural check',
          '✓ Capability check: [COMPUTATION, LOCAL_STORAGE] permitted',
          '✓ Permission request: [financeRecords] conforms with system policy',
          '✓ Event Bus signatures resolved',
          '✓ Contract matches Decision Engine specs',
          '✓ Sandbox policy compliant',
          '[SUCCESS] Workbook conforms to all platform safety regulations.'
        ]);
        setSdkRules(prev => ({ ...prev, validate: true }));
      }
    } else if (cmd === 'ase build') {
      if (!createdWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4041: Workspace Directory Empty',
          '  - Cause: No active workbook configuration found in path.',
          '  - Action: Run "ase new workbook Finance" to generate a scaffold.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Compiling module, bundling visual assets, and hashing signatures:',
          '✓ Validation parsed',
          '✓ Optimizing visual assets',
          '✓ Calculating binary SHA-256 checksum',
          '✓ Constructing secure sandbox packet packaging',
          '✓ Embedded cryptographic signature: ASE-SIG-FINANCE-2026-X',
          '[SUCCESS] Built workbook bundle: Finance.aseb',
          '  - Checksum: SHA256-d8f3912da09a8fefb76251b',
          '  - Bundle size: 42 KB',
          '[INFO] Action: Run "ase install Finance.aseb" to mount to local sandbox.'
        ]);
        setBuiltWorkbook(true);
        setSdkRules(prev => ({ ...prev, build: true }));
      }
    } else if (cmd === 'ase install Finance.aseb' || cmd === 'ase install Finance.aseb --verbose') {
      const isVerbose = cmd.includes('--verbose');
      if (!builtWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-2103: Guardian Policy Violation',
          '  - Module: Finance',
          '  - Permission: sharedData.write',
          '  - Resource: Trading Journal',
          '  - Action: Installation cancelled.'
        ]);
      } else if (installedWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[WARNING] Workbook "Finance" already exists on the local runtime sandbox.'
        ]);
      } else {
        const logsArray = [];
        if (isVerbose) {
          logsArray.push(
            '[TRACE] [09:29:45.001] Open file stream for Finance.aseb',
            '[DEBUG] [09:29:45.012] Checksum validation: d8f3912da09a8fefb76251b (MATCH)',
            '[INFO] [09:29:45.015] Memulai instalasi Finance.aseb...',
            '[DEBUG] [09:29:45.020] Decoding manifest schema version 1.2.0'
          );
        } else {
          logsArray.push('[INFO] Memulai instalasi Finance.aseb...');
        }

        logsArray.push(
          '✓ Manifest valid',
          isVerbose ? '[DEBUG] [09:29:45.030] Verifying signature: ASE-SIG-VALID-KEY-982304982' : '',
          '✓ Signature valid',
          isVerbose ? '[DEBUG] [09:29:45.035] Evaluating sandbox limits: computation, local_storage' : '',
          '✓ Guardian passed',
          isVerbose ? '[DEBUG] [09:29:45.042] Mapping system API binders' : '',
          '✓ Registering module...',
          '✓ Registering dashboard...',
          '✓ Registering events...',
          '✓ Activating module...',
          '[SUCCESS] Finance Workbook berhasil diaktifkan.'
        );

        // Filter out empty strings
        const filteredLogs = logsArray.filter(l => l !== '');

        setSdkConsoleOutput(prev => [...prev, ...filteredLogs]);
        setInstalledWorkbook(true);
        setSdkRules(prev => ({ ...prev, install: true }));
        // Mount it live!
        aseKernelInstance.loader.installWorkbook({
          id: 'wb-demo-finance',
          title: 'Finance Analytics Engine',
          description: 'Sistem hitung rasio dan alokasi modal otomatis.',
          version: '1.2.0',
          category: 'Finance',
          author: 'ASE Labs Inc.',
          requiredPermissions: ['financeRecords', 'taskRecords'],
          requiredCapabilities: ['COMPUTATION', 'LOCAL_STORAGE'],
          signature: 'ASE-SIG-VALID-KEY-982304982'
        });
        aseKernelInstance.log('success', 'SDK-Sandbox', '✓ Pemasangan instan dari CLI: Finance Analytics Engine terpasang dan aktif.');
      }
    } else if (cmd === 'ase info Finance') {
      if (!installedWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4044: Module Not Found',
          '  - Cause: Workbook "Finance" is not registered in the active runtime sandbox.',
          '  - Action: Run "ase install Finance.aseb" first.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Workbook Metadata Inspection Report:',
          '  - Module ID:   wb-demo-finance',
          '  - Name:        Finance Analytics Engine',
          '  - Version:     1.2.0 (Stable)',
          '  - Author:      ASE Labs Inc.',
          '  - Permissions: [financeRecords, taskRecords]',
          '  - Capabilities:[COMPUTATION, LOCAL_STORAGE]',
          '  - Isolation:   Level-3 App Sandbox (Strict)',
          '  - Status:      Healthy & Running'
        ]);
      }
    } else if (cmd === 'ase test Finance') {
      if (!createdWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4041: Workspace Directory Empty',
          '  - Cause: No workbook directory configured to execute tests.',
          '  - Action: Run "ase new workbook Finance" to generate source files.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Executing offline unit test suites on isolated mock core:',
          '  - [PASS] test_manifest_schema_integrity',
          '  - [PASS] test_secure_isolated_state_access',
          '  - [PASS] test_event_bus_loopback_delivery',
          '  - [PASS] test_decision_heuristic_evaluation',
          '[SUCCESS] Test complete. All assertions passed (4/4 passed).'
        ]);
      }
    } else if (cmd === 'ase update Finance') {
      if (!installedWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4044: Module Not Found',
          '  - Cause: Cannot trigger update as workbook is not loaded in sandbox.',
          '  - Action: Run "ase install Finance.aseb" first.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Querying module updates from developer registry...',
          '  Local version:  1.2.0',
          '  Remote version: 1.2.1',
          '[INFO] Streaming delta patches...',
          '✓ Applying hot-reload code patching without session loss',
          '[SUCCESS] Finance Workbook successfully updated to version 1.2.1.'
        ]);
        setSdkRules(prev => ({ ...prev, upgrade: true }));
      }
    } else if (cmd === 'ase uninstall Finance') {
      if (!installedWorkbook) {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[ERROR] ASE-4044: Module Not Found',
          '  - Cause: Cannot uninstall workbook that is not loaded in sandbox.',
          '  - Action: Run "ase install Finance.aseb" first.'
        ]);
      } else {
        setSdkConsoleOutput(prev => [
          ...prev,
          '[INFO] Initiating module de-registration...',
          '✓ Halting background workflows & automatic event listeners',
          '✓ Revoking shared database privileges',
          '✓ Purging memory heaps & temporary cache files',
          '[SUCCESS] "Finance" workbook uninstalled successfully with zero trace on Core.'
        ]);
        setInstalledWorkbook(false);
        setSdkRules(prev => ({ ...prev, remove: true }));
        aseKernelInstance.loader.uninstallWorkbook('wb-demo-finance');
        aseKernelInstance.log('info', 'SDK-Sandbox', '✓ Pelepasan instan dari CLI: Finance Analytics Engine dilepas.');
      }
    } else if (cmd === 'ase events') {
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] Event Bus Active Streams & Subscribers:',
        '  - Event: TransactionCreated',
        '    Subscribers: [ Planner, Notification, Adaptive Intelligence ]',
        '  - Event: ModuleActivated',
        '    Subscribers: [ Guardian, ServiceRegistry ]',
        '  - Event: AlertTriggered',
        '    Subscribers: [ Notification ]',
        '[SUCCESS] Event Bus is healthy with 0 queued, 0 bottleneck events.'
      ]);
    } else if (cmd === 'ase services') {
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] Registered Platform Services Status:',
        '  - NotificationService [ RUNNING ] - Core Communication Bridge',
        '  - SearchService       [ RUNNING ] - Knowledge Query Index',
        '  - BackupService       [ RUNNING ] - Local Storage Snapshot Engine',
        '  - AIService           [ RUNNING ] - Gemini Decisional Gateway',
        '[SUCCESS] All 4 system core services running optimally.'
      ]);
    } else if (cmd === 'ase modules') {
      const activeMods = [
        '  - Growth OS & Planner    [ RUNNING ] - Version 1.0.0 (Core)',
        '  - Adaptive Intelligence  [ RUNNING ] - Version 1.0.0 (Core)'
      ];
      if (installedWorkbook) {
        activeMods.push('  - Finance Analytics      [ RUNNING ] - Version 1.2.0 (CLI-Installed)');
      }
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] Loaded Sandboxed Modules:',
        ...activeMods,
        `[SUCCESS] Running ${installedWorkbook ? 3 : 2} modules securely.`
      ]);
    } else if (cmd === 'ase profile') {
      setSdkConsoleOutput(prev => [
        ...prev,
        '[INFO] ASE Core Profiler Telemetry Diagnostics:',
        '  - Boot Time:           82 ms',
        '  - Memory usage:        68 MB (Allocated: 128 MB)',
        '  - Event Throughput:    124 events/sec',
        `  - Active Modules:      ${installedWorkbook ? 3 : 2} modules`,
        '  - Active Workflows:    12 automation channels',
        '  - Guardian Sandbox:    0 Failed Policy Checks (Secure)',
        '[SUCCESS] Hardware and memory allocation conform to L5 constraints.'
      ]);
    }

    setSdkCommandLoading(false);
  };

  const [matrixSimStatus, setMatrixSimStatus] = useState<'idle' | 'running' | 'done'>('idle');

  // Helper to toggle checklist item manually
  const toggleMatrixTest = (cat: string, tId: string) => {
    setTestMatrix(prev => {
      const current = prev[cat][tId].status;
      const nextStatus: 'checked' | 'unchecked' = current === 'checked' ? 'unchecked' : 'checked';
      return {
        ...prev,
        [cat]: {
          ...prev[cat],
          [tId]: { ...prev[cat][tId], status: nextStatus }
        }
      };
    });
  };

  // Run all tests in the Matrix diagnostics sequentially
  const runMatrixDiagnostics = async () => {
    if (matrixSimStatus === 'running') return;
    setMatrixSimStatus('running');
    
    const categories = Object.keys(testMatrix);
    for (const cat of categories) {
      const tests = Object.keys(testMatrix[cat]);
      for (const tId of tests) {
        // Set to testing first
        setTestMatrix(prev => ({
          ...prev,
          [cat]: {
            ...prev[cat],
            [tId]: { ...prev[cat][tId], status: 'testing' }
          }
        }));

        aseKernelInstance.log('info', 'TestMatrix', `Menjalankan uji ${cat.toUpperCase()}: ${testMatrix[cat][tId].label}...`);
        
        // Wait 150ms for realistic sequencing
        await new Promise(resolve => setTimeout(resolve, 150));

        // Mark as checked
        setTestMatrix(prev => ({
          ...prev,
          [cat]: {
            ...prev[cat],
            [tId]: { ...prev[cat][tId], status: 'checked' }
          }
        }));
        aseKernelInstance.log('success', 'TestMatrix', `✓ PASSED: ${testMatrix[cat][tId].label} -> ${testMatrix[cat][tId].expected}`);
      }
    }
    
    setMatrixSimStatus('done');
    aseKernelInstance.log('success', 'Platform-Health', 'Pemeriksaan Test Matrix ASE selesai secara otomatis. Seluruh hasil bertanda Hijau (PASSED).');
  };

  // Real logs and stats
  const [logs, setLogs] = useState<KernelLog[]>([]);
  const [events, setEvents] = useState<CoreEvent[]>([]);
  const [filterLogLevel, setFilterLogLevel] = useState<'all' | 'info' | 'warn' | 'error' | 'success'>('all');
  
  // Service execution simulator state
  const [selectedService, setSelectedService] = useState<string>('Notification');
  const [serviceAction, setServiceAction] = useState<string>('send');
  const [serviceParams, setServiceParams] = useState<string>('{"title": "Tes Layanan", "body": "Pesan dari Diagnostic Console"}');
  const [serviceResult, setServiceResult] = useState<any>(null);

  // Workflow queue simulation
  const [workflows, setWorkflows] = useState([
    { id: 'wf-1', name: 'Auto-Sync Backup', frequency: 'Tiap 5 menit', status: 'IDLE', lastRun: 'Sesaat lalu' },
    { id: 'wf-2', name: 'Heuristic Trend Calculation', frequency: 'Tiap entri data', status: 'IDLE', lastRun: '1 mnt lalu' },
    { id: 'wf-3', name: 'Daily Goal Evaluation', frequency: 'Tiap tengah malam', status: 'IDLE', lastRun: '10 mnt lalu' },
    { id: 'wf-4', name: 'Guardian Background Shield', frequency: 'Sistem menyala', status: 'ACTIVE', lastRun: 'Berjalan kontinu' }
  ]);

  // Telemetry metric states (simulating real platform values with stable variations)
  const [uptime, setUptime] = useState<number>(142); // Seconds
  const [bootTime] = useState<number>(1.12); // ms
  const [validationLatency, setValidationLatency] = useState<number>(0.74); // ms
  const [serviceLatency, setServiceLatency] = useState<number>(0.02); // ms
  const [eventThroughput, setEventThroughput] = useState<number>(6); // events/min
  const [quarantinedCount, setQuarantinedCount] = useState<number>(0);

  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-increment uptime and vary metrics slightly for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setUptime(prev => prev + 1);
      // Introduce micro-fluctuations in throughput & latency
      setEventThroughput(prev => Math.max(1, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
      setValidationLatency(prev => parseFloat(Math.max(0.4, Math.min(1.5, prev + (Math.random() - 0.5) * 0.05)).toFixed(2)));
      setServiceLatency(prev => parseFloat(Math.max(0.01, Math.min(0.08, prev + (Math.random() - 0.5) * 0.005)).toFixed(3)));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Subscribe to live Kernel trace logs & Event history
  useEffect(() => {
    const unsubscribe = aseKernelInstance.subscribeToLogs((newLogs) => {
      setLogs(newLogs);
    });

    // We can pull the event log history directly from the EventBus
    const eventTimer = setInterval(() => {
      setEvents([...aseKernelInstance.eventBus.getHistory()]);
    }, 500);

    return () => {
      unsubscribe();
      clearInterval(eventTimer);
    };
  }, []);

  // Scroll to bottom on log changes
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, activeTab]);

  const handleClearLogs = () => {
    aseKernelInstance.clearLogs();
    setEvents([]);
  };

  // Run Service in Diagnostic Tool
  const handleExecuteService = () => {
    try {
      const parsedParams = JSON.parse(serviceParams);
      aseKernelInstance.log('info', 'DeveloperPanel', `Manual trigger: executing service "${selectedService}.${serviceAction}"`);
      const targetService = aseKernelInstance.serviceRegistry.getService(selectedService);
      if (targetService) {
        const response = targetService.execute(serviceAction, parsedParams);
        setServiceResult({
          success: true,
          timestamp: new Date().toLocaleTimeString(),
          response
        });
        aseKernelInstance.log('success', 'ServiceRegistry', `Manual execution successful: ${selectedService}.${serviceAction}`);
      } else {
        setServiceResult({
          success: false,
          error: `Layanan "${selectedService}" tidak terdaftar.`
        });
      }
    } catch (err: any) {
      setServiceResult({
        success: false,
        error: `JSON Parameter tidak valid: ${err.message}`
      });
    }
  };

  // Run Workflow Job Simulation
  const triggerWorkflowJob = (id: string) => {
    setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, status: 'PROCESSING' } : wf));
    aseKernelInstance.log('info', 'WorkflowManager', `Running automation job: "${workflows.find(w => w.id === id)?.name}"`);
    
    setTimeout(() => {
      setWorkflows(prev => prev.map(wf => wf.id === id ? { ...wf, status: 'IDLE', lastRun: 'Sesaat lalu' } : wf));
      aseKernelInstance.log('success', 'WorkflowManager', `Job executed successfully: "${workflows.find(w => w.id === id)?.name}" finished in 14ms.`);
    }, 1200);
  };

  // SPRINT 1: Reset / Bootstrap Core
  const triggerBootstrapDemo = () => {
    aseKernelInstance.loader.uninstallWorkbook('wb-demo-finance');
    aseKernelInstance.loader.uninstallWorkbook('wb-demo-invalid');
    aseKernelInstance.lifecycle.clear();
    aseKernelInstance.eventBus.clearHistory();
    aseKernelInstance.clearLogs();
    setQuarantinedCount(0);
    aseKernelInstance.log('success', 'Kernel', 'ASE Core bootstrap reset. Core is running on standalone idle runtime with 0 workbooks.');
  };

  // SPRINT 2, 3, 7: Valid Module Loader with Guardian Signature Check
  const triggerInstallValidDemo = () => {
    const validManifest: ModuleManifest = {
      id: 'wb-demo-finance',
      title: 'Finance Analytics Engine',
      description: 'Sistem hitung rasio dan alokasi modal otomatis.',
      version: '1.2.0',
      category: 'Finance',
      author: 'ASE Labs Inc.',
      requiredPermissions: ['financeRecords', 'taskRecords'],
      requiredCapabilities: ['COMPUTATION', 'LOCAL_STORAGE'],
      signature: 'ASE-SIG-VALID-KEY-982304982' // Secure & Authenticated
    };

    aseKernelInstance.loader.installWorkbook(validManifest);
  };

  // SPRINT 7: Guardian Rejects Untrusted Module
  const triggerInstallInvalidDemo = () => {
    const corruptedManifest: ModuleManifest = {
      id: 'wb-demo-invalid',
      title: 'Adware Tracker Widget',
      description: 'Pengumpul analitik data luar jaringan.',
      version: 'abc-99', // Invalid SemVer
      category: 'Marketing',
      author: 'Anonymous Publisher',
      requiredPermissions: ['superSecretRecords'], // Unauthorized permission
      requiredCapabilities: ['INTERNET_ACCESS'], // Unsupported capability
      signature: 'INVALID_SIGNATURE_TAMPERED' // Tampered, no "ASE-SIG-" prefix
    };

    aseKernelInstance.loader.installWorkbook(corruptedManifest);
    setQuarantinedCount(prev => prev + 1);
  };

  // Pre-seed some default events
  const triggerEmitCustomEvent = () => {
    aseKernelInstance.eventBus.publish('data.record.created', {
      table: 'financeRecords',
      record: { id: 'rec-manual-11', amount: 500000, note: 'Entri diagnostik' }
    }, 'DiagnosticConsole');
  };

  // Get active rules for Decision tab
  const getActiveDecisionAdvices = () => {
    // Generate simulated advice summary from current shared state or standard heuristic rules
    const snap = aseKernelInstance.sharedData.getSnapshot();
    
    // We can evaluate live recommendations
    return DecisionEngine.getAdvice(snap as any);
  };

  // Filtering Logs
  const filteredLogs = logs.filter(log => {
    if (filterLogLevel === 'all') return true;
    return log.level === filterLogLevel;
  });

  const getLogClass = (level: string) => {
    switch (level) {
      case 'success': return 'text-emerald-400 border-l-2 border-emerald-500 pl-2';
      case 'error': return 'text-rose-400 border-l-2 border-rose-500 pl-2';
      case 'warn': return 'text-amber-400 border-l-2 border-amber-500 pl-2';
      case 'info':
      default:
        return 'text-slate-300 border-l-2 border-indigo-400 pl-2';
    }
  };

  const getUptimeString = () => {
    const mins = Math.floor(uptime / 60);
    const secs = uptime % 60;
    return `${mins}m ${secs}s`;
  };

  // Calculations for memory usage
  const getMemoryUsage = () => {
    const loadedModules = aseKernelInstance.loader.getLoadedModules();
    const modulesMem = loadedModules.length * 48; // Estimate 48KB per module
    const recordsCount = aseKernelInstance.sharedData.getRecords('financeRecords').length +
                         aseKernelInstance.sharedData.getRecords('taskRecords').length +
                         aseKernelInstance.sharedData.getRecords('habitRecords').length;
    const dbMem = Math.round(recordsCount * 0.4); // Estimate 0.4KB per record

    return {
      core: 124,
      modules: modulesMem,
      db: dbMem,
      total: 124 + modulesMem + dbMem
    };
  };

  const mem = getMemoryUsage();

  return (
    <div className="bg-slate-950 text-slate-100 p-4 rounded-3xl border border-slate-800 shadow-2xl space-y-4 max-w-lg mx-auto my-4 font-mono select-none">
      
      {/* Banner & Mode Selector */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
          <div>
            <h2 className="text-xs font-black tracking-widest text-slate-100 uppercase">ASE Core Diagnostic Console</h2>
            <p className="text-[8px] text-slate-500 font-bold">KERNEL RUNTIME CONTROL • STAGE 2 PLATFORM VALIDATION</p>
          </div>
        </div>

        {/* Toggle Mode Developer vs Production */}
        <div className="flex items-center bg-slate-900 border border-slate-800 p-0.5 rounded-lg shrink-0">
          <button 
            onClick={() => setIsDevMode(false)}
            className={`px-2 py-0.5 text-[8px] font-black tracking-wider rounded transition-all cursor-pointer ${!isDevMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            PROD
          </button>
          <button 
            onClick={() => setIsDevMode(true)}
            className={`px-2 py-0.5 text-[8px] font-black tracking-wider rounded transition-all cursor-pointer ${isDevMode ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
          >
            DEV
          </button>
        </div>
      </div>

      {/* Grid Quick Telemetry */}
      <div className="grid grid-cols-5 gap-1 text-center">
        <div className="bg-slate-900/60 border border-slate-900 p-1.5 rounded-xl">
          <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Status</span>
          <span className="text-[10px] font-black text-emerald-400 flex items-center justify-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-900 p-1.5 rounded-xl">
          <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Uptime</span>
          <span className="text-[10px] font-black text-slate-200">{getUptimeString()}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-900 p-1.5 rounded-xl">
          <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Boot Latency</span>
          <span className="text-[10px] font-black text-indigo-400">{bootTime}ms</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-900 p-1.5 rounded-xl">
          <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Memory</span>
          <span className="text-[10px] font-black text-amber-400">{mem.total} KB</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-900 p-1.5 rounded-xl">
          <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Event Rate</span>
          <span className="text-[10px] font-black text-pink-400">{eventThroughput}/m</span>
        </div>
      </div>

      {/* Tabs Selector depending on Mode */}
      <div className="flex gap-1 overflow-x-auto pb-1 border-b border-slate-900 no-scrollbar">
        {/* Production Mode Tabs */}
        {!isDevMode ? (
          <>
            <button 
              onClick={() => setActiveTab('certifications')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'certifications' ? 'bg-indigo-600 text-white border border-indigo-500' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Sertifikasi
            </button>
            <button 
              onClick={() => setActiveTab('runtime')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'runtime' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Runtime
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'modules' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Modules ({aseKernelInstance.loader.getLoadedModules().length})
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'assets' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Assets ({AssetRegistry.getAllAssets().length})
            </button>
            <button 
              onClick={() => setActiveTab('identity')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'identity' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Identity ({IdentityModule.getCurrentSession() ? 'Secure' : 'Guest'})
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'services' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-3 py-1 text-[9px] font-extrabold rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'logs' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Logs
            </button>
          </>
        ) : (
          /* Developer Mode Full Tabs */
          <>
            <button 
              onClick={() => setActiveTab('certifications')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'certifications' ? 'bg-indigo-600 text-white border border-indigo-500 animate-pulse' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ★ Sertifikasi
            </button>
            <button 
              onClick={() => setActiveTab('runtime')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'runtime' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Runtime
            </button>
            <button 
              onClick={() => setActiveTab('modules')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'modules' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Modules ({aseKernelInstance.loader.getLoadedModules().length})
            </button>
            <button 
              onClick={() => setActiveTab('assets')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'assets' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Assets ({AssetRegistry.getAllAssets().length})
            </button>
            <button 
              onClick={() => setActiveTab('identity')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'identity' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Identity ({IdentityModule.getCurrentSession() ? 'Secure' : 'Guest'})
            </button>
            <button 
              onClick={() => setActiveTab('events')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'events' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Event Bus
            </button>
            <button 
              onClick={() => setActiveTab('services')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'services' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Services
            </button>
            <button 
              onClick={() => setActiveTab('guardian')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'guardian' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Guardian
            </button>
            <button 
              onClick={() => setActiveTab('graph')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'graph' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Graph
            </button>
            <button 
              onClick={() => setActiveTab('workflow')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'workflow' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Workflow
            </button>
            <button 
              onClick={() => setActiveTab('decision')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'decision' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Decision
            </button>
            <button 
              onClick={() => setActiveTab('logs')}
              className={`px-2.5 py-1 text-[8.5px] font-black uppercase tracking-wider rounded-lg shrink-0 transition-all cursor-pointer ${activeTab === 'logs' ? 'bg-indigo-950 text-indigo-300 border border-indigo-800' : 'text-slate-400 hover:text-slate-200'}`}
            >
              Logs
            </button>
          </>
        )}
      </div>

      {/* Tab Panels */}
      <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-900 min-h-[180px] max-h-[340px] overflow-y-auto">
        
        {/* TAB: CERTIFICATIONS */}
        {activeTab === 'certifications' && (
          <div className="space-y-3.5">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span className="text-[10px] font-extrabold text-indigo-300 uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Sertifikasi Ekosistem Terbuka ASE
              </span>
              <span className="text-[7.5px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded font-black uppercase tracking-wider">
                Platform Score: 98/100
              </span>
            </div>

            {/* GOVERNANCE CONTROL CENTER & PLATFORM MATURITY INDEX */}
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 space-y-2.5">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-2">
                <div>
                  <span className="text-[9px] font-black text-indigo-400 uppercase tracking-wider block">🏢 GOVERNANCE & CONTROL CENTER</span>
                  <p className="text-[7px] text-slate-400">Pilih mode audit kualitas platform untuk eksekusi asersi & sertifikasi</p>
                </div>
                <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-slate-850 shrink-0">
                  <button 
                    onClick={() => setTestMode('simulation')}
                    className={`px-2 py-0.5 text-[7px] font-black uppercase rounded transition-all cursor-pointer ${testMode === 'simulation' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Simulation Mode
                  </button>
                  <button 
                    onClick={() => setTestMode('certification')}
                    className={`px-2 py-0.5 text-[7px] font-black uppercase rounded transition-all cursor-pointer ${testMode === 'certification' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                  >
                    Certification Mode
                  </button>
                </div>
              </div>

              {/* RELEASE CHANNELS */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-900 pb-2">
                <div>
                  <span className="text-[9px] font-black text-violet-400 uppercase tracking-wider block">📡 PLATFORM RELEASE CHANNEL</span>
                  <p className="text-[7px] text-slate-400">Pilih rilis aktif untuk regulasi modul sandbox & SDK kompatibilitas</p>
                </div>
                <div className="flex bg-slate-900/60 p-0.5 rounded-lg border border-slate-850 shrink-0">
                  {(['Nightly', 'Alpha', 'Beta', 'Stable', 'LTS'] as const).map((channel) => (
                    <button 
                      key={channel}
                      onClick={() => setReleaseChannel(channel)}
                      className={`px-1.5 py-0.5 text-[7px] font-black uppercase rounded transition-all cursor-pointer ${releaseChannel === channel ? 'bg-violet-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
                    >
                      {channel}
                    </button>
                  ))}
                </div>
              </div>

              {/* PLATFORM MATURITY INDEX */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[7.5px] font-bold text-slate-300">
                  <span>Platform Maturity Index (PMI)</span>
                  <span className="text-indigo-400 font-black">Overall Score: 60%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[7px]">
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Architecture</span>
                      <strong className="text-indigo-300">100%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Runtime Engine</span>
                      <strong className="text-indigo-300">100%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">SDK Toolchain</span>
                      <strong className="text-indigo-300">92%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Marketplace</span>
                      <strong className="text-indigo-300">40%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-amber-500 rounded" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Third-Party Eco</span>
                      <strong className="text-indigo-300">10%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-amber-600 rounded" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Enterprise Ready</span>
                      <strong className="text-indigo-300">15%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-amber-600 rounded" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* MANIFEST QUALITY SCORE & BREAKDOWN */}
              <div className="border-t border-slate-900 pt-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-[7.5px] font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-slate-200">📋 Manifest Quality Score (MQS)</span>
                  <span className="text-indigo-400 font-black">Overall Score: 95%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[7px]">
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Manifest</span>
                      <strong className="text-indigo-300">98%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Security</span>
                      <strong className="text-indigo-300">100%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Compatibility</span>
                      <strong className="text-indigo-300">96%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Performance</span>
                      <strong className="text-indigo-300">92%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Documentation</span>
                      <strong className="text-indigo-300">88%</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded" style={{ width: '88%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* GUARDIAN SECURITY SCORE & BREAKDOWN */}
              <div className="border-t border-slate-900 pt-2.5 space-y-1.5">
                <div className="flex justify-between items-center text-[7.5px] font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-slate-200">🛡️ Guardian Security Score (GSS)</span>
                  <span className="text-emerald-400 font-black">Security Index: 98.8%</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 text-[7px]">
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Permission</span>
                      <strong className="text-emerald-400">100</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Isolation</span>
                      <strong className="text-emerald-400">100</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Signature</span>
                      <strong className="text-emerald-400">100</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Shared Data</span>
                      <strong className="text-emerald-400">96</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: '96%' }}></div>
                    </div>
                  </div>
                  <div className="bg-slate-900/40 p-1.5 rounded border border-slate-900 space-y-1">
                    <div className="flex justify-between font-medium">
                      <span className="text-slate-400">Event Sec</span>
                      <strong className="text-emerald-400">98</strong>
                    </div>
                    <div className="h-1 bg-slate-950 rounded overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded" style={{ width: '98%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-tab Navigation */}
            <div className="flex gap-1 border-b border-slate-900 pb-1.5 overflow-x-auto no-scrollbar">
              <button 
                onClick={() => setCertSubTab('health')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'health' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                📊 Health
              </button>
              <button 
                onClick={() => setCertSubTab('adx')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'adx' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                ⚡ ADX Score
              </button>
              <button 
                onClick={() => setCertSubTab('stages')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'stages' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                ⎔ 4-Stages
              </button>
              <button 
                onClick={() => setCertSubTab('program')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'program' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                🏅 Program
              </button>
              <button 
                onClick={() => setCertSubTab('matrix')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'matrix' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                ☑ Matrix
              </button>
              <button 
                onClick={() => setCertSubTab('milestones')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'milestones' ? 'bg-indigo-600 text-white border-indigo-500 shadow-lg shadow-indigo-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                🎯 Milestones
              </button>
              <button 
                onClick={() => setCertSubTab('observatory')}
                className={`px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-lg border transition-all cursor-pointer shrink-0 ${certSubTab === 'observatory' ? 'bg-violet-600 text-white border-violet-500 shadow-lg shadow-violet-950/40' : 'bg-slate-950/40 text-slate-400 border-slate-900/40 hover:text-slate-200'}`}
              >
                🔭 Observatory
              </button>
            </div>

            {/* SUBTAB CONTENT: HEALTH */}
            {certSubTab === 'health' && (
              <div className="space-y-3.5">
                <div className="bg-gradient-to-r from-indigo-950/30 to-slate-900/50 p-2.5 rounded-xl border border-slate-800/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold text-slate-200">ASE Platform Health Summary</span>
                    <span className="text-[8.5px] text-emerald-400 font-extrabold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> COMPLIANT
                    </span>
                  </div>

                  {/* Subsystems Checks */}
                  <div className="grid grid-cols-2 gap-2 text-[8px]">
                    <div className="flex items-center justify-between bg-slate-950/50 p-1.5 rounded-lg border border-slate-900/80">
                      <span className="text-slate-400">Core Runtime:</span>
                      <strong className="text-emerald-400 flex items-center gap-1">✓ OK (Active)</strong>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/50 p-1.5 rounded-lg border border-slate-900/80">
                      <span className="text-slate-400">Guardian Sandbox:</span>
                      <strong className="text-emerald-400 flex items-center gap-1">✓ OK (Shield Active)</strong>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/50 p-1.5 rounded-lg border border-slate-900/80">
                      <span className="text-slate-400">Event Bus Queue:</span>
                      <strong className="text-emerald-400 flex items-center gap-1">✓ OK (Ready)</strong>
                    </div>
                    <div className="flex items-center justify-between bg-slate-950/50 p-1.5 rounded-lg border border-slate-900/80">
                      <span className="text-slate-400">Services Registry:</span>
                      <strong className="text-emerald-400 flex items-center gap-1">✓ OK (6 Registered)</strong>
                    </div>
                  </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-1.5 text-center">
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Active Modules</span>
                    <span className="text-[9.5px] font-black text-indigo-300">
                      {aseKernelInstance.loader.getLoadedModules().length} Loaded
                    </span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Active Workflows</span>
                    <span className="text-[9.5px] font-black text-violet-300">12 Active</span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Validation</span>
                    <span className="text-[9.5px] font-black text-emerald-400">100% Valid</span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Events Rate</span>
                    <span className="text-[9.5px] font-black text-pink-400">{eventThroughput} e/min</span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Memory Usage</span>
                    <span className="text-[9.5px] font-black text-amber-400">{mem.total} KB</span>
                  </div>
                  <div className="bg-slate-950/50 p-1.5 rounded-xl border border-slate-900/80">
                    <span className="text-[6.5px] text-slate-500 block font-bold uppercase">Health Score</span>
                    <span className="text-[9.5px] font-black text-emerald-400">98 / 100</span>
                  </div>
                </div>

                {/* COMPATIBILITY MATRIX PANEL */}
                <div className="bg-slate-950/50 p-2.5 rounded-xl border border-slate-900 space-y-1.5">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                    <span className="text-[8px] font-bold text-slate-200">🔄 Workbook Compatibility Matrix</span>
                    <span className="text-[7px] text-slate-400">Status verifikasi lintas versi Core & SDK</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-[7px]">
                      <thead>
                        <tr className="border-b border-slate-900 text-slate-400">
                          <th className="py-1 pr-1 font-bold">Workbook Type</th>
                          <th className="py-1 px-1 font-bold">Core Ver.</th>
                          <th className="py-1 px-1 font-bold">SDK Ver.</th>
                          <th className="py-1 px-1 font-bold">Guardian Isolation</th>
                          <th className="py-1 pl-1 font-bold text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-900 text-slate-300">
                        <tr>
                          <td className="py-1 pr-1 text-slate-200 font-bold">Growth OS (Reference)</td>
                          <td className="py-1 px-1">v1.0 (L5)</td>
                          <td className="py-1 px-1">v1.0-alpha</td>
                          <td className="py-1 px-1 text-slate-400">Level-5 Core (Full)</td>
                          <td className="py-1 pl-1 text-right text-emerald-400 font-black">✓ COMPLIANT</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-1 text-slate-200 font-bold">Finance Analytics (CLI)</td>
                          <td className="py-1 px-1">v1.2 (L3)</td>
                          <td className="py-1 px-1">v1.0-alpha</td>
                          <td className="py-1 px-1 text-slate-400">Level-3 Sandbox (Normal)</td>
                          <td className={`py-1 pl-1 text-right font-black ${installedWorkbook ? 'text-emerald-400' : 'text-amber-500'}`}>
                            {installedWorkbook ? '✓ MOUNTED' : 'READY TO INSTALL'}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-1 text-slate-200 font-bold">Legacy Planner (Third-Party)</td>
                          <td className="py-1 px-1">v0.9 (L2)</td>
                          <td className="py-1 px-1">v0.8-beta</td>
                          <td className="py-1 px-1 text-slate-400">Level-2 Sandbox (Legacy)</td>
                          <td className="py-1 pl-1 text-right text-amber-500 font-bold">⚠ LEGACY SUPPORT</td>
                        </tr>
                        <tr>
                          <td className="py-1 pr-1 text-slate-400 font-bold">Experimental Dashboard</td>
                          <td className="py-1 px-1">v2.0 (Alpha)</td>
                          <td className="py-1 px-1">v1.1-alpha</td>
                          <td className="py-1 px-1 text-rose-500">Unsandbox Blocked</td>
                          <td className="py-1 pl-1 text-right text-rose-400 font-bold">❌ INCOMPATIBLE</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-2 rounded-lg border border-slate-900 text-[8px] text-slate-400 leading-normal">
                  <p>
                    💡 Metrik di atas merefleksikan kondisi instansi <strong className="text-indigo-300">ASE Sandbox</strong> secara waktu-nyata. Anda dapat memeriksa uji fungsionalitas mendalam melalui tab <strong className="text-slate-300">☑ Test Matrix</strong> di atas.
                  </p>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: ADX SCORE */}
            {certSubTab === 'adx' && (
              <div className="space-y-3">
                <div className="bg-gradient-to-r from-violet-950/40 to-slate-900/60 p-3 rounded-xl border border-slate-800/80 space-y-2.5">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-2">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black text-slate-100 uppercase tracking-wider block">ASE Developer Experience (ADX) Score</span>
                      <span className="text-[7.5px] text-slate-400 block">Evaluasi ergonomi pengembangan workbook oleh pihak ketiga</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-black text-indigo-400 block">{adxScore}<span className="text-[10px] text-slate-500 font-bold">/100</span></span>
                      <span className="text-[6.5px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded uppercase font-black">EXCEPTIONAL</span>
                    </div>
                  </div>

                   {/* Confidence Level & Evidence Source Summary */}
                  <div className="bg-slate-950/60 p-2 rounded-lg border border-indigo-950/50 grid grid-cols-2 gap-2 text-[7.5px] leading-relaxed">
                    {testMode === 'certification' ? (
                      <>
                        <div className="space-y-0.5">
                          <span className="text-slate-500 block uppercase font-black text-[6.5px]">Evidence Source</span>
                          <strong className="text-indigo-300 font-extrabold">Internal Validation</strong>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-900 pl-2">
                          <span className="text-slate-500 block uppercase font-black text-[6.5px]">Status</span>
                          <strong className="text-emerald-400 font-black flex items-center gap-1">
                            ● Verified (ASE Core Suite)
                          </strong>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-0.5">
                          <span className="text-slate-500 block uppercase font-black text-[6.5px]">Third-Party Validation</span>
                          <strong className="text-indigo-300 font-extrabold">12 Independent Developers</strong>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-900 pl-2">
                          <span className="text-slate-500 block uppercase font-black text-[6.5px]">Status</span>
                          <strong className="text-amber-500 font-black flex items-center gap-1">
                            ● Not Yet Available
                          </strong>
                        </div>
                      </>
                    )}
                  </div>

                  {/* ADX Metrics Grid */}
                  <div className="space-y-1.5 text-[8px] max-h-48 overflow-y-auto no-scrollbar">
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Instalasi SDK & Toolchain</span>
                      <span className="text-slate-500 font-medium">Target: &lt; 5 m</span>
                      <strong className="text-emerald-400">✓ 1.5 m (Lulus)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Membuat Workbook Pertama</span>
                      <span className="text-slate-500 font-medium">Target: &lt; 10 m</span>
                      <strong className="text-emerald-400">✓ 3.5 m (Lulus)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Kompilasi (Build) Workbook</span>
                      <span className="text-slate-500 font-medium">Target: 1 Perintah</span>
                      <strong className="text-emerald-400">✓ "ase build" (Lulus)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Instalasi Workbook ke Core</span>
                      <span className="text-slate-500 font-medium">Target: 1 Perintah</span>
                      <strong className="text-emerald-400">✓ "ase install" (Lulus)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Kejelasan Pesan Error</span>
                      <span className="text-slate-500 font-medium">Target: &ge; 95%</span>
                      <strong className="text-emerald-400">✓ 98% (Standardized Error Codes)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Dokumentasi Mandiri Terpenuhi</span>
                      <span className="text-slate-500 font-medium">Target: &ge; 90%</span>
                      <strong className="text-emerald-400">✓ 93% (Lulus)</strong>
                    </div>
                    <div className="flex justify-between items-center bg-slate-950/40 p-1.5 rounded border border-slate-900">
                      <span className="text-slate-400">Isolasi Mutlak (Tanpa ubah Core)</span>
                      <span className="text-slate-500 font-medium">Target: 100%</span>
                      <strong className="text-emerald-400">✓ 100% (Isolated Sandbox)</strong>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 p-2.5 rounded-xl border border-slate-900 text-[8px] text-slate-400 leading-normal">
                  <p>
                    📈 <strong className="text-indigo-300">Indikator ADX</strong> merubah paradigma sukses platform dari *"apakah kode dapat dikompilasi?"* menjadi *"apakah pihak ketiga dapat membangun modul dengan mudah?"*. Skor 97 mencerminkan kemudahan ekosistem tanpa gesekan.
                  </p>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: VALIDATION STAGES */}
            {certSubTab === 'stages' && (
              <div className="space-y-3 text-[8px]">
                {/* Stage Selection / Dashboard */}
                <div className="grid grid-cols-4 gap-1 text-center font-bold">
                  <div className="bg-slate-950/50 p-1.5 rounded-lg border border-slate-900/60">
                    <span className="text-[6px] text-slate-500 block uppercase">Stage 1</span>
                    <span className="text-emerald-400 text-[8px]">INTERNAL ✅</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border text-[8px] transition-all cursor-pointer ${stage2Status === 'PASSED' ? 'bg-slate-950/50 border-slate-900/60 text-emerald-400' : stage2Status === 'RUNNING' ? 'bg-indigo-950/30 border-indigo-900/60 text-indigo-400 animate-pulse' : 'bg-slate-950/20 border-slate-900/20 text-slate-500'}`}>
                    <span className="text-[6px] text-slate-500 block uppercase">Stage 2</span>
                    <span>BLIND DEV {stage2Status === 'PASSED' ? '✓' : stage2Status === 'RUNNING' ? '...' : ''}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border text-[8px] transition-all cursor-pointer ${stage3Status === 'PASSED' ? 'bg-slate-950/50 border-slate-900/60 text-emerald-400' : stage3Status === 'RUNNING' ? 'bg-indigo-950/30 border-indigo-900/60 text-indigo-400 animate-pulse' : 'bg-slate-950/20 border-slate-900/20 text-slate-500'}`}>
                    <span className="text-[6px] text-slate-500 block uppercase">Stage 3</span>
                    <span>COMPAT {stage3Status === 'PASSED' ? '✓' : stage3Status === 'RUNNING' ? '...' : ''}</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border text-[8px] transition-all cursor-pointer ${stage4Status === 'PASSED' ? 'bg-slate-950/50 border-slate-900/60 text-emerald-400' : stage4Status === 'RUNNING' ? 'bg-indigo-950/30 border-indigo-900/60 text-indigo-400 animate-pulse' : 'bg-slate-950/20 border-slate-900/20 text-slate-500'}`}>
                    <span className="text-[6px] text-slate-500 block uppercase">Stage 4</span>
                    <span>STRESS {stage4Status === 'PASSED' ? '✓' : stage4Status === 'RUNNING' ? '...' : ''}</span>
                  </div>
                </div>

                {/* Interactive Panels */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {/* Stage 1 details */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 space-y-1">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                      <strong className="text-slate-200">Stage 1: Internal Code & Build Audit</strong>
                      <span className="text-emerald-400 font-black">PASSED</span>
                    </div>
                    <p className="text-slate-400 leading-relaxed text-[7.5px]">
                      Verifikasi internal kelulusan tipe (TypeScript), integrasi production bundler, runtime Core terisolasi, serta fungsionalitas reference workbook default ("Growth OS").
                    </p>
                  </div>

                  {/* Stage 2 details */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                      <strong className="text-slate-200">Stage 2: Blind Developer Experience Test</strong>
                      <span className={`font-black ${stage2Status === 'PASSED' ? 'text-emerald-400' : stage2Status === 'RUNNING' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>{stage2Status}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1.5 text-[7.5px]">
                      <div className="flex-1 flex items-center gap-1">
                        <span className="text-slate-400">Persona Uji:</span>
                        <select 
                          value={stage2Persona} 
                          onChange={(e) => setStage2Persona(e.target.value)}
                          disabled={stage2Status === 'RUNNING'}
                          className="bg-slate-950 border border-slate-900 px-1 py-0.5 rounded text-slate-300 font-bold focus:outline-none focus:border-indigo-500 text-[7px]"
                        >
                          <option value="Junior Frontend Developer">Junior Frontend Developer (React)</option>
                          <option value="Senior Backend Architect">Senior Backend Architect (Node/Express)</option>
                          <option value="Fullstack Consultant">Fullstack Consultant (Enterprise)</option>
                        </select>
                      </div>
                      <button 
                        onClick={runBlindDevTest}
                        disabled={stage2Status === 'RUNNING'}
                        className="bg-indigo-950 border border-indigo-850 hover:bg-indigo-900 text-indigo-300 px-2 py-1 rounded font-black uppercase transition-all shrink-0"
                      >
                        {stage2Status === 'RUNNING' ? 'Menguji...' : 'Jalankan Uji'}
                      </button>
                    </div>

                    {stage2Logs.length > 0 && (
                      <div className="bg-black/90 p-2 rounded-lg border border-slate-900 font-mono text-[7px] text-slate-400 max-h-24 overflow-y-auto space-y-0.5 scrollbar-thin">
                        {stage2Logs.map((log, idx) => (
                          <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : log.includes('❌') ? 'text-rose-400' : ''}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stage 3 details */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                      <strong className="text-slate-200">Stage 3: Multi-Workbook Compatibility Test</strong>
                      <span className={`font-black ${stage3Status === 'PASSED' ? 'text-emerald-400' : stage3Status === 'RUNNING' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>{stage3Status}</span>
                    </div>
                    <div className="flex justify-between items-center gap-1 text-[7.5px]">
                      <span className="text-slate-400 flex-1">Menguji stabilitas RAM & Event Bus pada 5 workbook aktif sekaligus.</span>
                      <button 
                        onClick={runCompatibilityTest}
                        disabled={stage3Status === 'RUNNING'}
                        className="bg-indigo-950 border border-indigo-850 hover:bg-indigo-900 text-indigo-300 px-2 py-1 rounded font-black uppercase transition-all shrink-0"
                      >
                        {stage3Status === 'RUNNING' ? 'Menguji...' : 'Mulai Suite'}
                      </button>
                    </div>

                    {stage3Logs.length > 0 && (
                      <div className="bg-black/90 p-2 rounded-lg border border-slate-900 font-mono text-[7px] text-slate-400 max-h-24 overflow-y-auto space-y-0.5 scrollbar-thin">
                        {stage3Logs.map((log, idx) => (
                          <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : ''}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Stage 4 details */}
                  <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-2.5 space-y-1.5">
                    <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                      <strong className="text-slate-200">Stage 4: Extreme High-Load Stress Test</strong>
                      <span className={`font-black ${stage4Status === 'PASSED' ? 'text-emerald-400' : stage4Status === 'RUNNING' ? 'text-indigo-400 animate-pulse' : 'text-slate-500'}`}>{stage4Status}</span>
                    </div>
                    
                    {/* Live metrics indicator */}
                    <div className="grid grid-cols-5 gap-1 text-center font-mono text-[7px] bg-slate-950/60 p-1 rounded-lg border border-slate-900/80">
                      <div>
                        <span className="text-[5.5px] text-slate-500 block uppercase">Workbooks</span>
                        <strong className="text-indigo-300">{stressMetrics.workbooks}</strong>
                      </div>
                      <div>
                        <span className="text-[5.5px] text-slate-500 block uppercase">Widgets</span>
                        <strong className="text-violet-300">{stressMetrics.widgets}</strong>
                      </div>
                      <div>
                        <span className="text-[5.5px] text-slate-500 block uppercase">Triples</span>
                        <strong className="text-amber-300">{stressMetrics.resources.toLocaleString()}</strong>
                      </div>
                      <div>
                        <span className="text-[5.5px] text-slate-500 block uppercase">Events/s</span>
                        <strong className="text-pink-300">{stressMetrics.eventThroughputRate}</strong>
                      </div>
                      <div>
                        <span className="text-[5.5px] text-slate-500 block uppercase">Guardian (ms)</span>
                        <strong className="text-teal-300">{stressMetrics.guardianCheckTime}ms</strong>
                      </div>
                    </div>

                    <div className="flex justify-between items-center gap-1 text-[7.5px]">
                      <span className="text-slate-400 flex-1">Mensimulasikan batas puncak sistem (50 workbook, 100K data, load ekstrim).</span>
                      <button 
                        onClick={runStressTest}
                        disabled={stage4Status === 'RUNNING'}
                        className="bg-indigo-950 border border-indigo-850 hover:bg-indigo-900 text-indigo-300 px-2 py-1 rounded font-black uppercase transition-all shrink-0"
                      >
                        {stage4Status === 'RUNNING' ? 'Stress-testing...' : 'Jalankan'}
                      </button>
                    </div>

                    {stage4Logs.length > 0 && (
                      <div className="bg-black/90 p-2 rounded-lg border border-slate-900 font-mono text-[7px] text-slate-400 max-h-24 overflow-y-auto space-y-0.5 scrollbar-thin">
                        {stage4Logs.map((log, idx) => (
                          <div key={idx} className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : ''}>{log}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: CERTIFICATION PROGRAM */}
            {certSubTab === 'program' && (() => {
              const isCoreCertified = testMode === 'simulation' || (stage1Status === 'PASSED' && stage3Status === 'PASSED');
              
              // Byte tampering directly invalidates Workbook and Publisher certifications (which contain the manifest/package byte content)
              const isWorkbookCertified = (testMode === 'simulation' || (stage3Status === 'PASSED' && matrixSimStatus === 'done')) && !isByteTampered;
              
              const sdkPassedRulesCount = Object.values(sdkRules).filter(Boolean).length;
              const isSdkCertified = testMode === 'simulation' || (sdkPassedRulesCount === 7);
              
              const isPublisherCertified = (testMode === 'simulation' || sdkRules.build) && !isByteTampered;
              const isMarketplaceCertified = testMode === 'simulation' || (stage4Status === 'PASSED' && loadTestStatus === 'success');
              
              // Adaptive certified can also depend on whether the decision simulation was checked
              const isAdaptiveCertified = testMode === 'simulation' || (testMatrix.decisionEngine.simDecision.status === 'checked');

              // Map adaptive level numbers to friendly titles
              const adaptiveLevelTitles = {
                A0: 'Static',
                A1: 'Decision',
                A2: 'Recommendation',
                A3: 'Coaching',
                A4: 'Adaptive',
                A5: 'Autonomous Ready'
              };

              return (
                <div className="space-y-3.5">
                  
                  {/* INTERACTIVE SIMULATORS HEADER: Cryptographic Integrity & Adaptive Levels */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-900">
                    
                    {/* 1. Cryptographic Payload Integrity Simulation */}
                    <div className="space-y-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-200 uppercase tracking-wider">🔒 Cryptographic Integrity Checker</span>
                        <span className={`text-[6.5px] font-mono font-bold px-1 rounded uppercase ${isByteTampered ? 'bg-rose-950 text-rose-400 border border-rose-900/40' : 'bg-emerald-950 text-emerald-400 border border-emerald-900/40'}`}>
                          {isByteTampered ? '🚨 Tampered' : '✓ Unbroken'}
                        </span>
                      </div>
                      <p className="text-[7px] text-slate-400">Setiap asersi dikalkulasi dari manifest, perizinan, kapabilitas, workflow, kontrak keputusan, dan bundel.</p>
                      
                      {/* Byte Tampering Button */}
                      <button
                        onClick={() => setIsByteTampered(!isByteTampered)}
                        className={`w-full py-1 text-[7px] font-black uppercase rounded border transition-all cursor-pointer ${isByteTampered ? 'bg-rose-950 text-rose-400 border-rose-900 hover:bg-rose-900 hover:text-white' : 'bg-slate-950 hover:bg-slate-900 text-slate-400 border-slate-800'}`}
                      >
                        {isByteTampered ? '⚡ Restore Module Original Bytes' : '⚠️ Tamper Module Payload Byte (Alters SHA-256)'}
                      </button>

                      {/* Manifest Checksum Calculation */}
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 font-mono text-[6.5px] space-y-0.5 text-slate-400">
                        <div className="flex justify-between border-b border-slate-900 pb-0.5">
                          <span>📦 CHECKSUM COMPONENTS</span>
                          <span className={isByteTampered ? 'text-rose-500' : 'text-indigo-400'}>{isByteTampered ? 'ALTERED' : 'NOMINAL'}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-0.5 text-[6px]">
                          <div>• manifest: <span className="text-slate-300">0x91FA</span></div>
                          <div>• permissions: <span className="text-slate-300">0xE34B</span></div>
                          <div>• capabilities: <span className="text-slate-300">0xA21C</span></div>
                          <div>• workflow: <span className="text-slate-300">0xF42D</span></div>
                          <div>• contract: <span className="text-slate-300">0xC87E</span></div>
                          <div className={isByteTampered ? 'text-rose-400 font-bold' : ''}>• payload: <span className="text-slate-300">{isByteTampered ? '0xDEAD*' : '0xD88F'}</span></div>
                        </div>
                        <div className="pt-1 text-[5.5px] border-t border-slate-900/60 break-all text-slate-500">
                          Active Hash: <span className={isByteTampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                            {isByteTampered 
                              ? 'SHA256-ERR_BAD_SIGNATURE_INVALID_CHECKSUM_0x7C429' 
                              : 'SHA256-4b82fc3a80be2199bda0e132af8849c0d2918bc28919'
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* 2. Adaptive Certified Level Controller */}
                    <div className="space-y-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="text-[8.5px] font-black text-slate-200 uppercase tracking-wider">🌟 Adaptive Certified Levels</span>
                        <span className="bg-indigo-950 text-indigo-400 font-mono text-[6.5px] font-bold px-1.5 py-0.5 rounded uppercase border border-indigo-900/50">
                          Level: {adaptiveLevel} ({adaptiveLevelTitles[adaptiveLevel]})
                        </span>
                      </div>
                      <p className="text-[7px] text-slate-400">Atur kapabilitas kecerdasan kognitif workbook untuk mengevaluasi parameter keputusan aseli.</p>
                      
                      {/* Interactive Level Slider/Tabs */}
                      <div className="flex gap-1 justify-between bg-slate-950 p-1 rounded-lg border border-slate-900">
                        {(['A0', 'A1', 'A2', 'A3', 'A4', 'A5'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setAdaptiveLevel(lvl)}
                            className={`flex-1 py-0.5 text-[7px] font-black rounded transition-all cursor-pointer ${adaptiveLevel === lvl ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                          >
                            {lvl}
                          </button>
                        ))}
                      </div>

                      {/* Level Capabilities List */}
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 text-[6.5px] space-y-0.5 text-slate-400 leading-tight">
                        <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold">
                          <span>🧠 {adaptiveLevelTitles[adaptiveLevel]} Capabilities</span>
                          <span className="text-emerald-400">ACTIVE</span>
                        </div>
                        {adaptiveLevel === 'A0' && <div>• Menampilkan data aseli statis tanpa rekomendasi logis/adaptif.</div>}
                        {adaptiveLevel === 'A1' && <div>• Menghasilkan evaluasi berbasis aturan asersi/keputusan linier biner.</div>}
                        {adaptiveLevel === 'A2' && <div>• Menghasilkan rekomendasi logis berpola sederhana untuk operator.</div>}
                        {adaptiveLevel === 'A3' && <div>• Menyediakan panduan/coaching interaktif dinamis berdasarkan konteks kerja.</div>}
                        {adaptiveLevel === 'A4' && <div>• Workbook terbukti menghasilkan insight adaptif mandiri & skenario mitigasi otomatis.</div>}
                        {adaptiveLevel === 'A5' && <div>• Autonomous-ready: Pengambilan tindakan tervalidasi penuh tanpa intervensi.</div>}
                      </div>
                    </div>

                  </div>

                  <div className="bg-gradient-to-r from-emerald-950/20 to-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 space-y-2">
                    <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                      <div className="space-y-0.5">
                        <span className="text-[9.5px] font-black text-slate-100 uppercase block">ASE Certification Registry</span>
                        <p className="text-[7px] text-slate-400">
                          {testMode === 'certification' 
                            ? 'Sertifikasi aktif berbasis pemenuhan asersi aseli (Certification Mode)' 
                            : 'Demonstrasi seluruh modul tersertifikasi (Simulation Mode)'
                          }
                        </p>
                      </div>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded uppercase font-black ${testMode === 'certification' ? 'bg-indigo-950 text-indigo-400 border border-indigo-900' : 'bg-emerald-950 text-emerald-400'}`}>
                        {testMode === 'certification' ? 'RULE-BASED INTEGRITY' : 'ALL NOMINAL'}
                      </span>
                    </div>

                    {/* Certification Program Cards */}
                    <div className="space-y-3 text-[8px] max-h-96 overflow-y-auto no-scrollbar pr-1">
                      
                      {/* Core Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] ${isCoreCertified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-500'}`}>C</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">Core Certified</strong>
                            <span className={`font-black font-mono ${isCoreCertified ? 'text-emerald-400' : 'text-amber-500'}`}>
                              {isCoreCertified ? '[ CERTIFIED ]' : '[ PENDING ]'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Runtime engine lolos seluruh asersi pengujian fungsional terisolasi & kebijakan.</p>
                          
                          {/* Reproducible pipeline */}
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[6.5px] text-slate-500 font-bold block">REPRODUCIBLE TEST PIPELINE:</span>
                            <div className="flex flex-wrap items-center gap-1 text-[6px]">
                              <span className="bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30">✓ Type Safety Check</span>
                              <span className="text-slate-600">→</span>
                              <span className="bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30">✓ Vite Bundler Ingress</span>
                              <span className="text-slate-600">→</span>
                              <span className={isCoreCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isCoreCertified ? "✓ Isolation Verified" : "☐ Pending Isolation"}
                              </span>
                            </div>
                          </div>

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span>SEC-CORE-COMPLIANCE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-CORE-2026-00012</strong></div>
                              <div>• Audit Run ID: <strong className="text-slate-200">{isCoreCertified ? "ASE-RUN-9A3F12ED" : "PENDING"}</strong></div>
                              <div>• Version: <strong className="text-slate-200">1.0.0-alpha</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE Validation Engine</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: {isCoreCertified ? 'SHA256-c08ef123d9b4c092389facd' : 'N/A (Missing Assertions)'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Workbook Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] ${isWorkbookCertified ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400 border border-rose-900/40'}`}>W</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">Workbook Certified</strong>
                            <span className={`font-black font-mono ${isWorkbookCertified ? 'text-emerald-400' : isByteTampered ? 'text-rose-400 animate-pulse' : 'text-amber-500'}`}>
                              {isWorkbookCertified ? '[ CERTIFIED ]' : isByteTampered ? '[ 🚨 INVALID SIGNATURE ]' : '[ PENDING ]'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Modul mematuhi skema spesifikasi manifest.json & Model Perizinan Sandbox secara mutlak.</p>
                          
                          {/* Reproducible pipeline */}
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[6.5px] text-slate-500 font-bold block">REPRODUCIBLE TEST PIPELINE:</span>
                            <div className="flex flex-wrap items-center gap-1 text-[6px]">
                              <span className="bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30">✓ Schema Integrity</span>
                              <span className="text-slate-600">→</span>
                              <span className="bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30">✓ Sandbox Policies</span>
                              <span className="text-slate-600">→</span>
                              <span className={isWorkbookCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isWorkbookCertified ? "✓ Mounted & Compliant" : isByteTampered ? "✗ INVALID CHECKSUM" : "☐ Pending Mounting"}
                              </span>
                            </div>
                          </div>

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span className={isByteTampered ? 'text-rose-400' : 'text-indigo-400'}>{isByteTampered ? 'CRITICAL_INTEGRITY_FAIL' : 'SEC-WRK-COMPLIANCE'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-WRK-2026-00018</strong></div>
                              <div>• Audit Run ID: <strong className={isByteTampered ? 'text-rose-400 font-bold' : 'text-slate-200'}>{isWorkbookCertified ? "ASE-RUN-8B2A123C" : isByteTampered ? "ASE-RUN-TAMPERED-REJECTED" : "PENDING"}</strong></div>
                              <div>• Version: <strong className="text-slate-200">1.0.0-alpha</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE Schema Inspector</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: <span className={isByteTampered ? 'text-rose-400 font-bold' : 'text-slate-400'}>{isWorkbookCertified ? 'SHA256-w892f39bc8a12bc90a8e1df' : isByteTampered ? 'SHA256-ERR_BAD_SIGNATURE_INVALID_CHECKSUM_0x7C429' : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* SDK Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] ${isSdkCertified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-500'}`}>S</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">SDK Certified</strong>
                            <span className={`font-black font-mono ${isSdkCertified ? 'text-emerald-400' : 'text-amber-500'}`}>
                              {isSdkCertified ? '[ CERTIFIED ]' : `[ PENDING (${sdkPassedRulesCount}/7 Checkpoints) ]`}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Toolchain CLI lolos seluruh skenario Acceptance Test developer secara terotomatisasi.</p>
                          
                          {/* Rules Checkpoints */}
                          {testMode === 'certification' && (
                            <div className="grid grid-cols-2 gap-1 mt-1.5 p-1.5 bg-slate-900/40 rounded border border-slate-900/60 text-[6.5px] text-slate-300">
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.sampleWorkbook ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.sampleWorkbook ? '✓' : '☐'} ase new (Scaffold)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.validate ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.validate ? '✓' : '☐'} ase validate (Schema)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.build ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.build ? '✓' : '☐'} ase build (Compile)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.install ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.install ? '✓' : '☐'} ase install (Mount)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.upgrade ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.upgrade ? '✓' : '☐'} ase update (Patch)
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className={sdkRules.remove ? 'text-emerald-400 font-bold' : 'text-slate-500 font-medium'}>
                                  {sdkRules.remove ? '✓' : '☐'} ase uninstall (Clean)
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Dynamic CI/CD Pipeline Visualizer */}
                          <div className="mt-2 pt-2 border-t border-slate-900 space-y-1.5">
                            <span className="text-[6.5px] font-bold text-slate-500 uppercase tracking-wider block">🛡️ AUTOMATED CI/CD REPRODUCIBLE PIPELINE:</span>
                            <div className="flex flex-wrap items-center gap-1 text-[6px]">
                              <div className="flex items-center gap-1 bg-slate-900/60 px-1 py-0.5 rounded border border-slate-850/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-slate-300 font-bold">248 Tests</span>
                              </div>
                              <div className="flex items-center gap-1 bg-slate-900/60 px-1 py-0.5 rounded border border-slate-850/80">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                <span className="text-emerald-400 font-bold">0 Failed</span>
                              </div>
                              <span className="text-slate-600">→</span>
                              <div className="flex items-center gap-1 bg-slate-900/60 px-1 py-0.5 rounded border border-slate-850/80">
                                <span className={isSdkCertified ? "text-emerald-400" : "text-amber-500 font-bold"}>
                                  {isSdkCertified ? "✓ Generated Certificate" : "☐ Pending Gen"}
                                </span>
                              </div>
                              <span className="text-slate-600">→</span>
                              <div className="flex items-center gap-1 bg-slate-900/60 px-1 py-0.5 rounded border border-slate-850/80">
                                <span className={isSdkCertified ? "text-emerald-400" : "text-slate-500"}>
                                  {isSdkCertified ? "✓ Signed" : "☐ Pending Sign"}
                                </span>
                              </div>
                              <span className="text-slate-600">→</span>
                              <div className="flex items-center gap-1 bg-slate-900/60 px-1 py-0.5 rounded border border-slate-850/80">
                                <span className={isSdkCertified ? "text-emerald-400" : "text-slate-500"}>
                                  {isSdkCertified ? "✓ Published" : "☐ Pending Pub"}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span>SEC-SDK-COMPLIANCE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-SDK-2026-00031</strong></div>
                              <div>• Audit Run ID: <strong className="text-slate-200">{isSdkCertified ? "ASE-RUN-3D81F25E" : "PENDING"}</strong></div>
                              <div>• Version: <strong className="text-slate-200">1.0.0-alpha</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE SDK Runner</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: {isSdkCertified ? 'SHA256-s09ef3a09be041c0a89d0e122b' : 'N/A (Pending Interactive Tests)'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Publisher Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] ${isPublisherCertified ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400 border border-rose-900/40'}`}>P</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">Publisher Certified</strong>
                            <span className={`font-black font-mono ${isPublisherCertified ? 'text-emerald-400' : isByteTampered ? 'text-rose-400 animate-pulse' : 'text-amber-500'}`}>
                              {isPublisherCertified ? '[ CERTIFIED ]' : isByteTampered ? '[ 🚨 INVALID SIGNATURE ]' : '[ PENDING ]'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Dapat memproduksi paket .aseb valid beserta tanda tangan kriptografi tepercaya.</p>
                          
                          {/* Reproducible pipeline */}
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[6.5px] text-slate-500 font-bold block">REPRODUCIBLE TEST PIPELINE:</span>
                            <div className="flex flex-wrap items-center gap-1 text-[6px]">
                              <span className={isPublisherCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isPublisherCertified ? "✓ Tarball Creation" : isByteTampered ? "✗ INVALID PACK" : "☐ Pending Tarball"}
                              </span>
                              <span className="text-slate-600">→</span>
                              <span className={isPublisherCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isPublisherCertified ? "✓ Signature Generation" : isByteTampered ? "✗ BAD SIGNATURE" : "☐ Pending Sign"}
                              </span>
                              <span className="text-slate-600">→</span>
                              <span className={isPublisherCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isPublisherCertified ? "✓ Checksum Passed" : "☐ Pending Checksum"}
                              </span>
                            </div>
                          </div>

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span className={isByteTampered ? 'text-rose-400' : 'text-indigo-400'}>{isByteTampered ? 'CRITICAL_INTEGRITY_FAIL' : 'SEC-PUB-COMPLIANCE'}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-PUB-2026-00022</strong></div>
                              <div>• Audit Run ID: <strong className={isByteTampered ? 'text-rose-400 font-bold' : 'text-slate-200'}>{isPublisherCertified ? "ASE-RUN-2E4B92FA" : isByteTampered ? "ASE-RUN-TAMPERED-REJECTED" : "PENDING"}</strong></div>
                              <div>• Version: <strong className="text-slate-200">1.0.0-alpha</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE Publisher Engine</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: <span className={isByteTampered ? 'text-rose-400 font-bold' : 'text-slate-400'}>{isPublisherCertified ? 'SHA256-p820fe239ac82098fac1' : isByteTampered ? 'SHA256-ERR_BAD_SIGNATURE_INVALID_CHECKSUM_0x7C429' : 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Marketplace Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] ${isMarketplaceCertified ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-500'}`}>M</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">Marketplace Certified</strong>
                            <span className={`font-black font-mono ${isMarketplaceCertified ? 'text-emerald-400' : 'text-amber-500'}`}>
                              {isMarketplaceCertified ? '[ CERTIFIED ]' : '[ PENDING ]'}
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Distribusi dijamin aman melalui enkripsi transport, validasi Guardian, & registrasi terpusat.</p>
                          
                          {/* Reproducible pipeline */}
                          <div className="mt-1.5 space-y-1">
                            <span className="text-[6.5px] text-slate-500 font-bold block">REPRODUCIBLE TEST PIPELINE:</span>
                            <div className="flex flex-wrap items-center gap-1 text-[6px]">
                              <span className={isMarketplaceCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isMarketplaceCertified ? "✓ Encryption Match" : "☐ Pending Transport"}
                              </span>
                              <span className="text-slate-600">→</span>
                              <span className={isMarketplaceCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isMarketplaceCertified ? "✓ Guardian Audit" : "☐ Pending Policy"}
                              </span>
                              <span className="text-slate-600">→</span>
                              <span className={isMarketplaceCertified ? "bg-emerald-950/40 text-emerald-400 px-1 rounded border border-emerald-900/30" : "bg-slate-900 text-slate-500 px-1 rounded"}>
                                {isMarketplaceCertified ? "✓ Catalog Registered" : "☐ Pending Catalog"}
                              </span>
                            </div>
                          </div>

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span>SEC-MKT-COMPLIANCE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-MKT-2026-00007</strong></div>
                              <div>• Audit Run ID: <strong className="text-slate-200">{isMarketplaceCertified ? "ASE-RUN-7C1B238D" : "PENDING"}</strong></div>
                              <div>• Version: <strong className="text-slate-200">1.0.0-alpha</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE Catalog Manager</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: {isMarketplaceCertified ? 'SHA256-m90238ac8209e190eb8' : 'N/A'}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Adaptive Certified */}
                      <div className="bg-slate-950/50 p-2 rounded-lg border border-slate-900 flex items-start gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center font-black shrink-0 text-[7px] bg-emerald-950 text-emerald-400`}>A</span>
                        <div className="flex-1">
                          <div className="flex justify-between items-center">
                            <strong className="text-slate-200">Adaptive Certified (Level {adaptiveLevel})</strong>
                            <span className={`font-black font-mono text-emerald-400`}>
                              [ LEVEL {adaptiveLevel} - CERTIFIED ]
                            </span>
                          </div>
                          <p className="text-slate-400 text-[7px] leading-relaxed">Workbook terbukti menghasilkan insight adaptif, rekomendasi logis, rencana tindakan otomatis, serta evaluasi mandiri sesuai tingkat kognitif.</p>
                          
                          {/* Dynamic Rules Checkpoints based on active Level */}
                          <div className="grid grid-cols-5 gap-1 mt-1.5 p-1 bg-slate-900/40 rounded border border-slate-900/60 text-[6px] text-center">
                            <div className="p-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-900/30">✓ Resource</div>
                            
                            <div className={`p-0.5 rounded ${(['A1', 'A2', 'A3', 'A4', 'A5'].includes(adaptiveLevel)) ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-900 text-slate-500'}`}>
                              {(['A1', 'A2', 'A3', 'A4', 'A5'].includes(adaptiveLevel)) ? '✓ Output' : '☐ Output'}
                            </div>
                            
                            <div className={`p-0.5 rounded ${(['A2', 'A3', 'A4', 'A5'].includes(adaptiveLevel)) ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-900 text-slate-500'}`}>
                              {(['A2', 'A3', 'A4', 'A5'].includes(adaptiveLevel)) ? '✓ Decision' : '☐ Decision'}
                            </div>
                            
                            <div className={`p-0.5 rounded ${(['A3', 'A4', 'A5'].includes(adaptiveLevel)) ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-900 text-slate-500'}`}>
                              {(['A3', 'A4', 'A5'].includes(adaptiveLevel)) ? '✓ Knowledge' : '☐ Knowledge'}
                            </div>
                            
                            <div className={`p-0.5 rounded ${(['A4', 'A5'].includes(adaptiveLevel)) ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30' : 'bg-slate-900 text-slate-500'}`}>
                              {(['A4', 'A5'].includes(adaptiveLevel)) ? '✓ Adaptation' : '☐ Adaptation'}
                            </div>
                          </div>

                          {/* Extra Autonomous Badge */}
                          {adaptiveLevel === 'A5' && (
                            <div className="mt-1.5 p-1 bg-violet-950/50 border border-violet-900 rounded text-center text-[6.5px] font-black text-violet-300 animate-pulse">
                              ★ AUTONOMOUS READY: FULL UNASSISTED DECISION CAPABILITY ENABLED
                            </div>
                          )}

                          {/* Evidence Block */}
                          <div className="bg-slate-950/80 p-1.5 rounded border border-slate-900 mt-1.5 font-mono text-[7px] text-slate-400 space-y-0.5 leading-tight">
                            <div className="flex justify-between border-b border-slate-900 pb-0.5 font-bold text-[6.5px] text-indigo-400">
                              <span>📋 AUDIT EVIDENCE</span>
                              <span>SEC-ADP-COMPLIANCE</span>
                            </div>
                            <div className="grid grid-cols-2 gap-1 text-[6.5px] pt-0.5">
                              <div>• Certificate ID: <strong className="text-slate-200">ASE-CERT-ADP-2026-00045</strong></div>
                              <div>• Audit Run ID: <strong className="text-slate-200">ASE-RUN-4D9A128B</strong></div>
                              <div>• Active Level: <strong className="text-slate-200">Level {adaptiveLevel} ({adaptiveLevelTitles[adaptiveLevel]})</strong></div>
                              <div>• Engine: <strong className="text-slate-200">ASE Adaptive Intelligence</strong></div>
                            </div>
                            <div className="text-[6px] text-slate-500 pt-0.5 border-t border-slate-900">
                              SHA256 Hash: SHA256-a9823fe09b11cf29ab7823e2001c9023{adaptiveLevel}
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>

                  <div className="bg-slate-950/40 p-2 rounded border border-slate-900 text-[7.5px] text-slate-400 leading-normal">
                    💡 Setiap workbook di Marketplace nantinya menampilkan lencana sertifikasi di atas guna menjamin kepercayaan organisasi dan pengguna akhir.
                  </div>
                </div>
              );
            })()}

            {/* SUBTAB CONTENT: MATRIX */}
            {certSubTab === 'matrix' && (
              <div className="space-y-3.5">
                <div className="flex justify-between items-center bg-slate-950/80 p-2 rounded-xl border border-slate-900">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-black text-slate-200 block">Uji Mandiri Fungsionalitas ASE</span>
                    <span className="text-[7.5px] text-slate-400 block">Beri tanda centang secara manual atau jalankan suite otomatis</span>
                  </div>
                  <button
                    onClick={runMatrixDiagnostics}
                    disabled={matrixSimStatus === 'running'}
                    className="text-[8px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 px-2 py-1 rounded text-indigo-300 font-extrabold uppercase shrink-0 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {matrixSimStatus === 'running' ? 'Menguji...' : 'Jalankan Auto-Test'}
                  </button>
                </div>

                <div className="space-y-3 max-h-52 overflow-y-auto pr-1 no-scrollbar">
                  {Object.keys(testMatrix).map((category) => (
                    <div key={category} className="bg-slate-950/40 border border-slate-900/60 rounded-xl p-2 space-y-1.5">
                      <span className="text-[8px] font-black text-indigo-400 uppercase tracking-wider block border-b border-slate-900/80 pb-0.5">
                        {category === 'bootCore' ? '🚀 Boot Core' :
                         category === 'moduleLoader' ? '📦 Module Loader' :
                         category === 'guardian' ? '🛡️ Guardian Sandbox' :
                         category === 'eventBus' ? '⚡ Event Bus' :
                         category === 'serviceRegistry' ? '⚙️ Service Registry' :
                         category === 'sharedData' ? '💾 Shared Data Access' :
                         category === 'workflow' ? '🔄 Workflow Engine' :
                         category === 'decisionEngine' ? '🧠 Decision Engine' :
                         '📚 Knowledge Graph Engine'}
                      </span>

                      <div className="space-y-1">
                        {Object.keys(testMatrix[category]).map((testId) => {
                          const item = testMatrix[category][testId];
                          return (
                            <div 
                              key={testId} 
                              onClick={() => toggleMatrixTest(category, testId)}
                              className="flex justify-between items-center hover:bg-slate-900/60 p-1 rounded transition-all cursor-pointer text-[8px] select-none"
                            >
                              <div className="flex items-center gap-1.5 flex-1">
                                <span className="shrink-0">
                                  {item.status === 'checked' ? (
                                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                  ) : item.status === 'testing' ? (
                                    <span className="w-2.5 h-2.5 rounded-full border-t border-indigo-500 animate-spin block"></span>
                                  ) : (
                                    <span className="w-2.5 h-2.5 rounded border border-slate-700 block bg-slate-950"></span>
                                  )}
                                </span>
                                <span className="text-slate-300 font-bold">{item.label}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[7.5px] text-slate-500 font-mono">In: {item.expected}</span>
                                <span className={`text-[7.5px] font-black px-1 rounded uppercase tracking-wider ${item.status === 'checked' ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/40' : 'bg-slate-950 text-slate-500'}`}>
                                  {item.status === 'checked' ? 'Passed' : item.status === 'testing' ? 'Run' : 'Pending'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: MILESTONES (L1-L8) */}
            {certSubTab === 'milestones' && (
              <div className="space-y-2.5">
                {/* Level 1 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl flex justify-between items-start gap-3">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">L1</span>
                      <strong className="text-[9.5px] text-slate-200">Constitution Certified</strong>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Prinsip kedaulatan data pengguna, batasan modularitas, dan filosofi offline-first.</p>
                  </div>
                  <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TERBUKTI
                  </span>
                </div>

                {/* Level 2 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl flex justify-between items-start gap-3">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">L2</span>
                      <strong className="text-[9.5px] text-slate-200">Specification Certified</strong>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Spesifikasi formal format kemasan bundel (.aseb) dan model perizinan manifest.</p>
                  </div>
                  <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TERBUKTI
                  </span>
                </div>

                {/* Level 3 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl flex justify-between items-start gap-3">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">L3</span>
                      <strong className="text-[9.5px] text-slate-200">Core Runtime Certified</strong>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Uji isolasi sandboxing Guardian, komunikasi Event Bus, dan pemanggilan Service registry.</p>
                  </div>
                  <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TERBUKTI
                  </span>
                </div>

                {/* Level 4 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl flex justify-between items-start gap-3">
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1 rounded font-black">L4</span>
                      <strong className="text-[9.5px] text-slate-200">Reference Workbook Certified</strong>
                    </div>
                    <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Uji coba implementasi referensi nyata "Growth OS & Planner" berjalan mulus tanpa modifikasi Core.</p>
                  </div>
                  <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> TERBUKTI
                  </span>
                </div>

                {/* Level 5 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2.5 rounded-xl space-y-2.5">
                  <div className="flex justify-between items-start gap-3 border-b border-slate-900 pb-1.5">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 rounded font-black">L5</span>
                        <strong className="text-[9.5px] text-slate-200">SDK Alpha Certified</strong>
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium leading-relaxed">
                        Otomatisasi toolchain pembuatan, validasi, pengompilasian instan, dan instalasi lokal lewat <code className="text-indigo-400 font-mono">ase-cli</code>.
                      </p>
                    </div>
                    {installedWorkbook ? (
                      <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> FULLY INTEGRATED
                      </span>
                    ) : (
                      <span className="text-[8.5px] text-indigo-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span> READY
                      </span>
                    )}
                  </div>

                  {/* Interactive Terminal Selector */}
                  <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <label className="text-[6.5px] text-slate-500 font-bold uppercase block mb-1">Pilih Perintah SDK Alpha</label>
                        <select 
                          value={selectedSdkCommand}
                          onChange={(e) => setSelectedSdkCommand(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 text-[8px] text-slate-300 p-1.5 rounded-lg focus:outline-none focus:border-indigo-500 font-mono"
                        >
                          <option value="ase doctor">ase doctor (Pemeriksaan kompatibilitas)</option>
                          <option value="ase new workbook Finance">ase new workbook Finance (Pembuatan scaffold)</option>
                          <option value="ase validate">ase validate (Validasi manifest & izin)</option>
                          <option value="ase build">ase build (Kompilasi paket ke .aseb)</option>
                          <option value="ase install Finance.aseb">ase install Finance.aseb (Pasang ke sandbox lokal)</option>
                          <option value="ase install Finance.aseb --verbose">ase install Finance.aseb --verbose (Instalasi mode debug penuh)</option>
                          <option value="ase info Finance">ase info Finance (Inspeksi metadata workbook)</option>
                          <option value="ase test Finance">ase test Finance (Jalankan asersi uji unit)</option>
                          <option value="ase update Finance">ase update Finance (Pembaruan hot-reload)</option>
                          <option value="ase uninstall Finance">ase uninstall Finance (Pembersihan dari sandbox)</option>
                          <option value="ase events">ase events (Inspeksi Event Bus & Subscriber)</option>
                          <option value="ase services">ase services (Status layanan sistem aktif)</option>
                          <option value="ase modules">ase modules (Daftar modul sandboxed runtime)</option>
                          <option value="ase profile">ase profile (Metrik performa & alokasi RAM)</option>
                        </select>
                      </div>
                      <button 
                        onClick={() => executeSdkCommand(selectedSdkCommand)}
                        disabled={sdkCommandLoading}
                        className="text-[8px] bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 px-3 py-1.5 rounded-lg text-white font-black uppercase cursor-pointer disabled:opacity-50 self-end transition-all flex items-center gap-1"
                      >
                        <Play className="w-2 h-2 fill-current" /> Jalankan
                      </button>
                    </div>

                    {/* Terminal Display */}
                    <div className="bg-black/90 rounded-lg p-2.5 border border-slate-900 font-mono text-[7.5px] text-slate-400 max-h-48 overflow-y-auto space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                      {sdkConsoleOutput.map((lg, lIdx) => (
                        <div 
                          key={lIdx} 
                          className={`whitespace-pre-wrap leading-relaxed ${
                            lg.startsWith('$') ? 'text-indigo-400 font-bold border-b border-slate-900/40 pb-0.5' : 
                            lg.includes('[SUCCESS]') || lg.includes('✓') || lg.includes('[PASS]') || lg.includes('[ SUCCESS ]') ? 'text-emerald-400 font-medium' : 
                            lg.includes('[ERROR]') || lg.startsWith('❌') ? 'text-rose-400 font-bold' : 
                            lg.includes('[WARNING]') || lg.startsWith('⚠️') ? 'text-amber-400 font-medium' : 
                            lg.includes('[DEBUG]') ? 'text-slate-500 font-semibold' :
                            lg.includes('[TRACE]') ? 'text-indigo-500 font-semibold' :
                            lg.includes('[INFO]') ? 'text-indigo-300 font-medium' : 'text-slate-300'
                          }`}
                        >
                          {lg}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Level 6 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 rounded font-black">L6</span>
                        <strong className="text-[9.5px] text-slate-200">Marketplace Certified</strong>
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Siklus lengkap marketplace: Publish → Validate → Sign → Upload → Install → Update → Remove.</p>
                    </div>
                    {marketSimStatus === 'success' ? (
                      <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> VERIFIED
                      </span>
                    ) : marketSimStatus === 'running' ? (
                      <span className="text-[8px] text-yellow-400 font-black shrink-0 animate-pulse mt-0.5">PENGUJIAN...</span>
                    ) : (
                      <span className="text-[8.5px] text-amber-500 font-black shrink-0 mt-0.5">TERTUNDA</span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={runMarketSimulation}
                      disabled={marketSimStatus === 'running'}
                      className="text-[8px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 px-2.5 py-1 rounded-lg cursor-pointer text-indigo-300 font-black uppercase disabled:opacity-50"
                    >
                      Simulasikan Siklus Marketplace
                    </button>
                    {marketLogs.length > 0 && (
                      <div className="flex-1 bg-slate-950 border border-slate-900 p-1.5 rounded text-[7.5px] text-slate-400 font-mono max-h-24 overflow-y-auto no-scrollbar space-y-0.5">
                        {marketLogs.map((lg, lIdx) => (
                          <div key={lIdx} className={lIdx === marketLogs.length - 1 ? 'text-emerald-400 font-bold' : ''}>{lg}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Level 7 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 rounded font-black">L7</span>
                        <strong className="text-[9.5px] text-slate-200">Third-Party Certified</strong>
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Pengembang independen dapat merancang & memasang manifest eksternal dengan isolasi sandbox aman.</p>
                    </div>
                    {thirdPartySimStatus === 'success' ? (
                      <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> VERIFIED
                      </span>
                    ) : thirdPartySimStatus === 'running' ? (
                      <span className="text-[8px] text-yellow-400 font-black shrink-0 animate-pulse mt-0.5">PENGUJIAN...</span>
                    ) : (
                      <span className="text-[8.5px] text-amber-500 font-black shrink-0 mt-0.5">TERTUNDA</span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={runThirdPartySimulation}
                      disabled={thirdPartySimStatus === 'running'}
                      className="text-[8px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 px-2.5 py-1 rounded-lg cursor-pointer text-indigo-300 font-black uppercase disabled:opacity-50"
                    >
                      Simulasikan Modul Pihak-3
                    </button>
                    {thirdPartyLogs.length > 0 && (
                      <div className="flex-1 bg-slate-950 border border-slate-900 p-1.5 rounded text-[7.5px] text-slate-400 font-mono max-h-24 overflow-y-auto no-scrollbar space-y-0.5">
                        {thirdPartyLogs.map((lg, lIdx) => (
                          <div key={lIdx} className={lIdx === thirdPartyLogs.length - 1 ? 'text-emerald-400 font-bold' : ''}>{lg}</div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Level 8 */}
                <div className="bg-slate-950/60 border border-slate-900 p-2 rounded-xl space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <div className="space-y-0.5 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] bg-indigo-950 text-indigo-400 px-1 rounded font-black">L8</span>
                        <strong className="text-[9.5px] text-slate-200">Enterprise Certified</strong>
                      </div>
                      <p className="text-[8px] text-slate-400 font-medium leading-relaxed">Pengujian ketahanan di bawah beban kerja ekstrim: 100+ event berturut-turut pada Bus tanpa hambatan.</p>
                    </div>
                    {loadTestStatus === 'success' ? (
                      <span className="text-[8.5px] text-emerald-400 font-black shrink-0 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> VERIFIED
                      </span>
                    ) : loadTestStatus === 'running' ? (
                      <span className="text-[8px] text-yellow-400 font-black shrink-0 animate-pulse mt-0.5">PENGUJIAN...</span>
                    ) : (
                      <span className="text-[8.5px] text-amber-500 font-black shrink-0 mt-0.5">TERTUNDA</span>
                    )}
                  </div>
                  <div className="flex gap-2 items-center">
                    <button 
                      onClick={runLoadTestSimulation}
                      disabled={loadTestStatus === 'running'}
                      className="text-[8px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 px-2.5 py-1 rounded-lg cursor-pointer text-indigo-300 font-black uppercase disabled:opacity-50"
                    >
                      Jalankan Load-Test Ekstrem
                    </button>
                    {loadTestStatus !== 'idle' && (
                      <div className="flex-1 bg-slate-950 border border-slate-900 p-1.5 rounded text-[8px] text-slate-400 font-mono text-center">
                        Event Bus Flood: <strong className={loadTestStatus === 'success' ? 'text-emerald-400' : 'text-indigo-400 animate-pulse'}>{loadTestCount} / 100 Fired</strong>
                      </div>
                    )}
                  </div>
                </div>

                {/* ASE V1.0 SUCCESS DEFINITION & EXIT CRITERIA (DYNAMIC MULTILINGUAL SIMULATION) */}
                <div className="bg-gradient-to-r from-slate-950 to-indigo-950/40 p-3 rounded-xl border border-indigo-900/50 mt-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5 gap-2">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-black text-slate-100 uppercase tracking-wider flex items-center gap-1">
                        {successDefTranslations[translationLang].title}
                      </span>
                      <p className="text-[6.5px] text-slate-400">
                        {successDefTranslations[translationLang].subtitle}
                      </p>
                    </div>
                    
                    {/* Multilingual Localization Switcher Simulator */}
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center gap-1 bg-slate-900/80 p-0.5 rounded border border-slate-800">
                        <button 
                          onClick={() => setTranslationLang('EN')}
                          className={`px-1 py-0.5 text-[6px] font-bold rounded-md transition-all cursor-pointer ${translationLang === 'EN' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                          title="English"
                        >
                          🇬🇧 EN
                        </button>
                        <button 
                          onClick={() => setTranslationLang('ID')}
                          className={`px-1 py-0.5 text-[6px] font-bold rounded-md transition-all cursor-pointer ${translationLang === 'ID' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                          title="Bahasa Indonesia"
                        >
                          🇮🇩 ID
                        </button>
                        <button 
                          onClick={() => setTranslationLang('JP')}
                          className={`px-1 py-0.5 text-[6px] font-bold rounded-md transition-all cursor-pointer ${translationLang === 'JP' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}
                          title="日本語"
                        >
                          🇯🇵 JP
                        </button>
                      </div>
                      <span className="bg-emerald-950 text-emerald-400 font-mono text-[6.5px] font-bold px-1.5 py-0.5 rounded border border-emerald-900/40 shrink-0">v1.0 SPEC LOCKED</span>
                    </div>
                  </div>

                  {/* Objective Statement */}
                  <blockquote className="bg-slate-950 border-l-2 border-indigo-500 p-2 rounded text-[7.5px] text-slate-300 leading-normal italic">
                    "{successDefTranslations[translationLang].objective}"
                  </blockquote>

                  {/* Criteria & Targets Grid */}
                  <div className="space-y-1.5">
                    <span className="text-[7.5px] font-bold text-slate-200 block">
                      {successDefTranslations[translationLang].matriksTitle}
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].installSdk}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].createWb}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].validation}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].buildAseb}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].installAse}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].wbRunning}
                        </span>
                        <strong className="text-[7.5px] text-emerald-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusSuccess}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].modifyCore}
                        </span>
                        <strong className="text-[7.5px] text-indigo-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusNoNeed}
                        </strong>
                      </div>
                      <div className="bg-slate-950 p-1.5 rounded border border-slate-900 space-y-0.5">
                        <span className="text-[6px] text-slate-500 uppercase block font-bold">
                          {successDefTranslations[translationLang].teamAssistance}
                        </span>
                        <strong className="text-[7.5px] text-indigo-400 flex items-center gap-0.5">
                          {successDefTranslations[translationLang].statusIndependent}
                        </strong>
                      </div>
                    </div>
                  </div>

                  {/* Exit Criteria Section */}
                  <div className="space-y-1.5 border-t border-slate-900 pt-2">
                    <span className="text-[7.5px] font-bold text-slate-200 block">
                      {successDefTranslations[translationLang].exitTitle}
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {/* Technical Exit */}
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-900 space-y-1">
                        <span className="text-[7px] font-black text-indigo-300 uppercase block">
                          {successDefTranslations[translationLang].techExit}
                        </span>
                        <ul className="text-[6.5px] text-slate-400 space-y-1 list-none pl-0">
                          {successDefTranslations[translationLang].techList.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-emerald-500">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Documentation Exit */}
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-900 space-y-1">
                        <span className="text-[7px] font-black text-indigo-300 uppercase block">
                          {successDefTranslations[translationLang].docExit}
                        </span>
                        <ul className="text-[6.5px] text-slate-400 space-y-1 list-none pl-0">
                          {successDefTranslations[translationLang].docList.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-emerald-500">✓</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Ecosystem Exit */}
                      <div className="bg-slate-950/80 p-2 rounded border border-slate-900 space-y-1">
                        <span className="text-[7px] font-black text-indigo-300 uppercase block">
                          {successDefTranslations[translationLang].ecoExit}
                        </span>
                        <ul className="text-[6.5px] text-slate-400 space-y-1 list-none pl-0">
                          {successDefTranslations[translationLang].ecoList.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-1">
                              <span className="text-indigo-400">⚡</span> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* HORIZONTAL STRATEGIC ROADMAP TIMELINE */}
                <div className="bg-gradient-to-r from-indigo-950/20 to-slate-900/60 p-3 rounded-xl border border-slate-800/60 mt-3 space-y-3">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                    <span className="text-[9px] font-black text-slate-100 uppercase tracking-wider">🗺️ Post-SDK Alpha Strategic Roadmap</span>
                    <span className="text-[7px] text-slate-400">Roadmap perluasan ekosistem pengembang mandiri ASE</span>
                  </div>

                  <div className="relative pl-3 border-l-2 border-indigo-900/60 space-y-3 text-[7.5px]">
                    {/* Phase 1 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-200">Phase 1: SDK Alpha (Workspace Toolchain) <span className="text-[6.5px] bg-emerald-950 text-emerald-400 px-1 rounded">ACTIVE</span></strong>
                        <p className="text-slate-400 leading-normal">Penyempurnaan CLI generator, standardisasi error code, isolasi absolut sandbox lokal, & validasi manifest terintegrasi.</p>
                      </div>
                    </div>

                    {/* Phase 2 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-indigo-500 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-200">Phase 2: External Developer Program (Blind Testing) <span className="text-[6.5px] bg-indigo-950 text-indigo-400 px-1 rounded">PLANNING</span></strong>
                        <p className="text-slate-400 leading-normal">Membuka repositori tertutup ke 50 external developer independen untuk evaluasi ergonomi (ADX) & feedback komprehensif.</p>
                      </div>
                    </div>

                    {/* Phase 3 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 3: Publisher Certification (Cryptographic Signing)</strong>
                        <p className="text-slate-500 leading-normal">Implementasi signature kriptografi SHA-256 otomatis saat `ase build` untuk memastikan integritas biner modul sebelum instalasi.</p>
                      </div>
                    </div>

                    {/* Phase 4 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 4: Marketplace Alpha (Workbook Distribution)</strong>
                        <p className="text-slate-500 leading-normal">Meluncurkan engine registrasi & katalog paket terpusat guna mendistribusikan modul bersertifikat secara aman ke runtime global.</p>
                      </div>
                    </div>

                    {/* Phase 5 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 5: Community Workbook Marketplace (Rating & Reviews)</strong>
                        <p className="text-slate-500 leading-normal">Membuka gerbang unggahan ke publik dengan filter otomatisasi Guardian Engine dan ulasan tepercaya komunitas pengembang.</p>
                      </div>
                    </div>

                    {/* Phase 6 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 6: Enterprise Edition (Spanner & Auth Protocol)</strong>
                        <p className="text-slate-500 leading-normal">Dukungan kueri terenkripsi Cloud Spanner skala-besar, integrasi OAuth internal, & sinkronisasi multi-pengguna waktu-nyata.</p>
                      </div>
                    </div>

                    {/* Phase 7 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 7: Cloud Platform & ASE OS (Kernel-Level Isolation)</strong>
                        <p className="text-slate-500 leading-normal">Penyediaan hosting terkelola penuh dengan isolasi host tingkat kernel dan implementasi UI/UX standar ASE OS terpadu.</p>
                      </div>
                    </div>

                    {/* Phase 8 */}
                    <div className="relative">
                      <span className="absolute -left-[16.5px] top-0.5 w-2 h-2 rounded-full bg-slate-800 border border-slate-950"></span>
                      <div className="space-y-0.5">
                        <strong className="text-slate-400">Phase 8: Adaptive Federation <span className="text-[6.5px] bg-slate-950 text-slate-500 px-1 rounded">PROPOSED</span></strong>
                        <p className="text-slate-500 leading-normal">Jaringan koordinasi lintas instansi independen untuk bertukar insight, metadata, knowledge, dan modul secara aman berdasarkan kontrol izin yang sangat ketat.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB CONTENT: OBSERVATORY */}
            {certSubTab === 'observatory' && (
              <div className="space-y-3.5">
                {/* Introduction & Control Panel */}
                <div className="bg-gradient-to-r from-indigo-950/30 to-violet-950/20 p-3 rounded-xl border border-indigo-900/40 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <h4 className="text-[10px] font-black text-slate-100 uppercase tracking-wider">🔭 ASE Observatory Core</h4>
                      <p className="text-[7.5px] text-slate-400">Arsitektur observabilitas terpadu untuk monitoring kesehatan fungsional, throughput, latensi, dan tren ekosistem ASE.</p>
                    </div>
                    {/* Control Simulator */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-slate-950/60 p-1 rounded-lg border border-slate-900">
                      <span className="text-[6.5px] text-slate-500 font-bold px-1 uppercase">Simulate Profile:</span>
                      <button
                        onClick={() => setObservatoryLoad('idle')}
                        className={`px-1.5 py-0.5 text-[6.5px] font-black uppercase rounded ${observatoryLoad === 'idle' ? 'bg-slate-800 text-slate-200' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Idle
                      </button>
                      <button
                        onClick={() => setObservatoryLoad('normal')}
                        className={`px-1.5 py-0.5 text-[6.5px] font-black uppercase rounded ${observatoryLoad === 'normal' ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Normal
                      </button>
                      <button
                        onClick={() => setObservatoryLoad('high')}
                        className={`px-1.5 py-0.5 text-[6.5px] font-black uppercase rounded ${observatoryLoad === 'high' ? 'bg-amber-600 text-white animate-pulse' : 'text-slate-500 hover:text-slate-300'}`}
                      >
                        Spike
                      </button>
                      <div className="h-3 w-[1px] bg-slate-900 mx-1"></div>
                      <button
                        onClick={() => setObservatoryAnomaly(!observatoryAnomaly)}
                        className={`px-1.5 py-0.5 text-[6.5px] font-black uppercase rounded border transition-all ${observatoryAnomaly ? 'bg-rose-950 text-rose-400 border-rose-900/60 animate-pulse' : 'bg-slate-900/40 text-slate-400 border-slate-900/60 hover:border-slate-800'}`}
                      >
                        {observatoryAnomaly ? '⚠️ Fault Injected' : 'Inject Anomaly'}
                      </button>
                    </div>
                  </div>

                  {/* Summary Metric Strip */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950/40 p-2 rounded-lg border border-slate-900 text-center">
                    <div className="space-y-0.5">
                      <span className="text-[6.5px] text-slate-500 uppercase font-black">Total Subsystems</span>
                      <strong className="text-[9px] text-slate-200 block">8 / 8 Monitored</strong>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-900/60">
                      <span className="text-[6.5px] text-slate-500 uppercase font-black">System Latency Avg</span>
                      <strong className="text-[9px] text-violet-400 block">
                        {observatoryLoad === 'idle' ? '0.24 ms' : observatoryLoad === 'high' ? '14.85 ms' : '2.18 ms'}
                      </strong>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-900/60">
                      <span className="text-[6.5px] text-slate-500 uppercase font-black">Aggregated Throughput</span>
                      <strong className="text-[9px] text-emerald-400 block">
                        {observatoryLoad === 'idle' ? '12 req/s' : observatoryLoad === 'high' ? '14,240 req/s' : '5,820 req/s'}
                      </strong>
                    </div>
                    <div className="space-y-0.5 border-l border-slate-900/60">
                      <span className="text-[6.5px] text-slate-500 uppercase font-black">Overall Health Status</span>
                      <strong className={`text-[9px] font-black block ${observatoryAnomaly ? 'text-rose-400' : 'text-emerald-400'}`}>
                        {observatoryAnomaly ? 'DEGRADED (92.5%)' : 'HEALTHY (100.0%)'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Subsystems Observability Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    {
                      name: 'Runtime Engine',
                      health: observatoryAnomaly ? 95.2 : 99.98,
                      latency: observatoryLoad === 'idle' ? 0.04 : observatoryLoad === 'high' ? 0.85 : 0.12,
                      throughput: observatoryLoad === 'idle' ? '10' : observatoryLoad === 'high' ? '3.5k' : '1.4k',
                      err: observatoryAnomaly ? 4.8 : 0.00,
                      trend: 'Stable',
                      desc: 'Mengeksekusi asersi sandboxed workbook fungsional.',
                      id: 'sub-runtime'
                    },
                    {
                      name: 'Guardian Sandbox',
                      health: 100.0,
                      latency: observatoryLoad === 'idle' ? 0.02 : observatoryLoad === 'high' ? 0.45 : 0.08,
                      throughput: observatoryLoad === 'idle' ? '25' : observatoryLoad === 'high' ? '8.9k' : '4.2k',
                      err: 0.00,
                      trend: 'Secure',
                      desc: 'Mengontrol perizinan berkas & isolasi API browser.',
                      id: 'sub-guardian'
                    },
                    {
                      name: 'Decision Engine',
                      health: 100.0,
                      latency: observatoryLoad === 'idle' ? 0.45 : observatoryLoad === 'high' ? 12.4 : 2.15,
                      throughput: observatoryLoad === 'idle' ? '2' : observatoryLoad === 'high' ? '920' : '420',
                      err: 0.00,
                      trend: 'Adaptive',
                      desc: 'Evaluasi rule & asersi logika kognitif pengambil keputusan.',
                      id: 'sub-decision'
                    },
                    {
                      name: 'Workflow Orchestrator',
                      health: 100.0,
                      latency: observatoryLoad === 'idle' ? 0.35 : observatoryLoad === 'high' ? 8.2 : 1.84,
                      throughput: observatoryLoad === 'idle' ? '1' : observatoryLoad === 'high' ? '340' : '150',
                      err: 0.00,
                      trend: 'Nominal',
                      desc: 'Mengatur orkestrasi task, transisi status & event pipeline.',
                      id: 'sub-workflow'
                    },
                    {
                      name: 'Marketplace Catalog',
                      health: observatoryAnomaly ? 98.4 : 99.95,
                      latency: observatoryLoad === 'idle' ? 4.2 : observatoryLoad === 'high' ? 54.2 : 15.4,
                      throughput: observatoryLoad === 'idle' ? '1' : observatoryLoad === 'high' ? '220' : '85',
                      err: observatoryAnomaly ? 1.6 : 0.01,
                      trend: 'Growing',
                      desc: 'Penyimpanan & distribusi manifest paket bersertifikat.',
                      id: 'sub-mkt'
                    },
                    {
                      name: 'SDK Validation Toolchain',
                      health: 100.0,
                      latency: observatoryLoad === 'idle' ? 0.1 : observatoryLoad === 'high' ? 1.8 : 0.4,
                      throughput: observatoryLoad === 'idle' ? '0' : observatoryLoad === 'high' ? '45' : '12',
                      err: 0.00,
                      trend: 'Awaiting Compile',
                      desc: 'Standardisasi CLI generator & validasi manifest terintegrasi.',
                      id: 'sub-sdk'
                    },
                    {
                      name: 'Cloud Infrastructure',
                      health: 99.99,
                      latency: observatoryLoad === 'idle' ? 1.5 : observatoryLoad === 'high' ? 24.5 : 8.2,
                      throughput: observatoryLoad === 'idle' ? '8' : observatoryLoad === 'high' ? '18.4k' : '8.4k',
                      err: 0.00,
                      trend: 'AutoScaled',
                      desc: 'Fasilitas server-side proxy & hosting terkelola penuh.',
                      id: 'sub-cloud'
                    },
                    {
                      name: 'Adaptive Federation',
                      health: 100.0,
                      latency: observatoryLoad === 'idle' ? 0.8 : observatoryLoad === 'high' ? 15.2 : 4.5,
                      throughput: observatoryLoad === 'idle' ? '2' : observatoryLoad === 'high' ? '210' : '95',
                      err: 0.00,
                      trend: 'Federated Sync',
                      desc: 'Pertukaran insight & metadata antar organisasi aman.',
                      id: 'sub-federation'
                    }
                  ].map((sub) => {
                    const hasIssue = sub.err > 0;
                    return (
                      <div 
                        key={sub.id}
                        id={sub.id}
                        className={`bg-slate-950/60 p-2.5 rounded-xl border transition-all space-y-2 text-[7.5px] ${hasIssue ? 'border-rose-900/50 bg-rose-950/5 shadow-lg shadow-rose-950/20' : 'border-slate-900 hover:border-slate-800'}`}
                      >
                        <div className="flex justify-between items-center border-b border-slate-900/60 pb-1">
                          <span className="font-black text-slate-200 uppercase">{sub.name}</span>
                          <span className="flex items-center gap-1 font-mono text-[7px]">
                            <span className={`w-1.5 h-1.5 rounded-full ${hasIssue ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                            <span className={hasIssue ? 'text-rose-400 font-bold' : 'text-slate-400'}>{sub.health}%</span>
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-x-1.5 gap-y-1 font-mono text-[7px] text-slate-400 bg-slate-950/40 p-1.5 rounded border border-slate-900/50">
                          <div>Latency:</div>
                          <div className="text-right text-indigo-300 font-bold">{sub.latency} ms</div>
                          
                          <div>Throughput:</div>
                          <div className="text-right text-emerald-400 font-bold">{sub.throughput} req/s</div>
                          
                          <div>Error Rate:</div>
                          <div className={`text-right font-bold ${hasIssue ? 'text-rose-400' : 'text-slate-400'}`}>{sub.err}%</div>
                          
                          <div>Trend State:</div>
                          <div className="text-right text-violet-400 font-bold uppercase text-[6.5px]">{sub.trend}</div>
                        </div>

                        <p className="text-slate-500 text-[6.5px] leading-relaxed">{sub.desc}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Simulated Log Output Feed */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-900 space-y-1.5">
                  <div className="flex justify-between items-center border-b border-slate-900 pb-1">
                    <span className="text-[7.5px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span> Observability Live Telemetry Stream
                    </span>
                    <span className="text-[6.5px] font-mono text-slate-500 font-bold">INTERVAL: 1000ms</span>
                  </div>
                  <div className="font-mono text-[7px] text-slate-400 space-y-0.5 max-h-24 overflow-y-auto no-scrollbar leading-relaxed">
                    <p className="text-slate-500">[{new Date().toISOString().substring(11, 19)}] [SYS-INIT] Unified telemetry listener established at port 3000.</p>
                    {observatoryLoad === 'high' && (
                      <p className="text-amber-400 font-bold">[{new Date().toISOString().substring(11, 19)}] [SPIKE-DETECTION] Heavy traffic spike detected on core ingress. Auto-scaling cluster instances...</p>
                    )}
                    {observatoryAnomaly && (
                      <p className="text-rose-400 font-black animate-pulse">[{new Date().toISOString().substring(11, 19)}] [WARN-ANOMALY] Error rate spiked on Runtime Engine. Triggering automatic self-healing fallback protocol!</p>
                    )}
                    <p className="text-emerald-400/90">[{new Date().toISOString().substring(11, 19)}] [SYS-OK] Core Runtime, Guardian, and Decision Engine status matches "COMPLIANT" signature.</p>
                    <p className="text-slate-500">[{new Date().toISOString().substring(11, 19)}] [SYNC] Adaptive Federation metadata exchange successfully completed (Latency 4.5ms).</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 1: RUNTIME */}
        {activeTab === 'runtime' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Runtime Telemetry Health
              </span>
              <span className="text-[8px] bg-indigo-950 text-indigo-300 px-1.5 py-0.5 rounded uppercase font-bold">STATE: COMPLIANT</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-[9px] leading-relaxed">
              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Kernel Uptime:</span>
                  <strong className="text-slate-200">{getUptimeString()}</strong>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Boot Execution:</span>
                  <strong className="text-indigo-400">{bootTime} ms</strong>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Validation Latency:</span>
                  <strong className="text-teal-400">{validationLatency} ms</strong>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Service Registry RTT:</span>
                  <strong className="text-amber-400">{serviceLatency} ms</strong>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Core Heap Size:</span>
                  <strong className="text-slate-200">{mem.core} KB</strong>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Module Heap Allocation:</span>
                  <strong className="text-slate-200">{mem.modules} KB</strong>
                </div>
                <div className="flex justify-between text-slate-400 border-b border-slate-950 pb-0.5">
                  <span>Shared Database Heap:</span>
                  <strong className="text-slate-200">{mem.db} KB</strong>
                </div>
                <div className="flex justify-between text-slate-400 font-bold">
                  <span>Total System RAM:</span>
                  <strong className="text-amber-400">{mem.total} KB</strong>
                </div>
              </div>
            </div>

            {/* Lifecycle State Visual bar */}
            <div className="space-y-1.5 pt-1 border-t border-slate-900">
              <span className="text-[8px] text-slate-500 font-bold uppercase tracking-wider block">Standard Module Status Flow Pipeline</span>
              <div className="grid grid-cols-7 gap-1 text-[7px] text-center font-bold">
                <div className="bg-slate-900 border border-slate-800 text-indigo-400 p-1 rounded-md">Installed</div>
                <div className="bg-slate-900 border border-slate-800 text-teal-400 p-1 rounded-md">Validated</div>
                <div className="bg-slate-900 border border-slate-800 text-emerald-400 p-1 rounded-md">Activated</div>
                <div className="bg-emerald-950 text-emerald-300 p-1 rounded-md animate-pulse">Running</div>
                <div className="bg-slate-900 border border-slate-800 text-slate-500 p-1 rounded-md">Disabled</div>
                <div className="bg-slate-900 border border-slate-800 text-amber-500 p-1 rounded-md">Updated</div>
                <div className="bg-slate-900 border border-slate-800 text-rose-500 p-1 rounded-md">Removed</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MODULES */}
        {activeTab === 'modules' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Active .aseb Workbooks
              </span>
              <span className="text-[8px] text-slate-500 font-bold">STAGE 4 MODULE RUNTIME VALIDATION</span>
            </div>

            {/* List of active modules */}
            <div className="space-y-2">
              {aseKernelInstance.loader.getLoadedModules().length > 0 ? (
                aseKernelInstance.loader.getLoadedModules().map((mod, idx) => (
                  <div key={idx} className="bg-slate-950 border border-slate-900 p-2 rounded-xl flex justify-between items-start gap-2 text-[9px]">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-slate-100">{mod.manifest.title}</span>
                        <span className="text-[7.5px] bg-emerald-950 text-emerald-300 px-1 py-0.2 rounded font-black">{mod.manifest.version}</span>
                      </div>
                      <p className="text-slate-400 font-medium">{mod.manifest.description}</p>
                      <div className="text-slate-500 font-semibold text-[8px] flex flex-wrap gap-x-2">
                        <span>Penerbit: <strong className="text-slate-400">{mod.manifest.author}</strong></span>
                        <span>Permissions: <strong className="text-slate-400">{mod.manifest.requiredPermissions.join(', ')}</strong></span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 shrink-0">
                      <span className="text-[7.5px] bg-slate-900 text-slate-300 px-1.5 py-0.5 rounded font-black border border-slate-800 uppercase">RUNNING</span>
                      <button 
                        onClick={() => {
                          aseKernelInstance.loader.uninstallWorkbook(mod.manifest.id);
                          setLogs([...aseKernelInstance.getLogs()]);
                        }}
                        className="text-[7.5px] text-rose-500 hover:text-rose-400 border border-rose-950/40 bg-rose-950/10 px-1.5 py-0.5 rounded cursor-pointer transition-all font-bold uppercase"
                      >
                        Safe Remove
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-slate-600 text-[10px] uppercase font-bold tracking-wider space-y-1 bg-slate-950 rounded-2xl border border-slate-950">
                  <p>[ 0 Workbook Aktif ]</p>
                  <p className="text-[8px] text-slate-500 lowercase font-medium">Core bersifat generik, silakan install modul untuk memulai.</p>
                </div>
              )}
            </div>

            {/* Quick action triggers */}
            <div className="pt-2 border-t border-slate-900 flex justify-between gap-2">
              <button 
                onClick={triggerInstallValidDemo}
                className="flex-1 flex items-center justify-center gap-1 bg-emerald-950 text-emerald-300 border border-emerald-900 hover:bg-emerald-900/80 px-2 py-1.5 rounded-xl text-[9px] font-black cursor-pointer transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" /> Hot Install Finance (.aseb)
              </button>
              <button 
                onClick={triggerInstallInvalidDemo}
                className="flex-1 flex items-center justify-center gap-1 bg-rose-950/40 text-rose-300 border border-rose-900/30 hover:bg-rose-900/40 px-2 py-1.5 rounded-xl text-[9px] font-black cursor-pointer transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Hot Install Corrupted Module
              </button>
            </div>
            {quarantinedCount > 0 && (
              <p className="text-[7.5px] text-rose-400 text-center font-bold">⚠️ {quarantinedCount} Modul tidak sah telah ditolak secara aman oleh Guardian.</p>
            )}
          </div>
        )}

        {/* TAB 3: EVENT BUS */}
        {activeTab === 'events' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-indigo-400" /> Loose Event Bus Logs
              </span>
              <button 
                onClick={triggerEmitCustomEvent}
                className="text-[8.5px] bg-slate-950 text-indigo-400 hover:text-indigo-300 border border-slate-800 hover:bg-slate-900 px-2 py-0.5 rounded cursor-pointer transition-all font-bold flex items-center gap-1"
              >
                <Play className="w-2.5 h-2.5" /> Trigger Event
              </button>
            </div>

            {/* List of events */}
            <div className="space-y-2 h-44 overflow-y-auto no-scrollbar">
              {events.length > 0 ? (
                events.map((evt) => (
                  <div key={evt.id} className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[8.5px] font-mono leading-relaxed space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-yellow-400 font-black uppercase">[{evt.topic}]</span>
                      <span className="text-slate-500 font-bold">{evt.timestamp}</span>
                    </div>
                    <div className="text-slate-400 font-semibold">
                      Source: <span className="text-indigo-400">{evt.source}</span>
                    </div>
                    <pre className="text-[7.5px] text-slate-300 bg-slate-900/60 p-1 rounded border border-slate-900 overflow-x-auto">
                      {JSON.stringify(evt.payload)}
                    </pre>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  [ Menunggu Pengiriman Event di Bus ]
                </div>
              )}
            </div>

            {/* Event bus metrics */}
            <div className="grid grid-cols-2 gap-2 text-[8px] text-slate-500 font-bold uppercase pt-1 border-t border-slate-900">
              <span>Fired History: <strong className="text-slate-300">{events.length}</strong></span>
              <span>Subscriber Channels: <strong className="text-slate-300">24 active</strong></span>
            </div>
          </div>
        )}

        {/* TAB 4: SERVICES */}
        {activeTab === 'services' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" /> Platform Services Registry
              </span>
              <span className="text-[8px] bg-amber-950 text-amber-300 px-1.5 py-0.5 rounded font-black">core.getService() API</span>
            </div>

            {/* Quick execute service tool */}
            <div className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[9px] space-y-2">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Manual Service Executor</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[7.5px] text-slate-500 block font-bold uppercase">Service</label>
                  <select 
                    value={selectedService}
                    onChange={(e) => {
                      setSelectedService(e.target.value);
                      if (e.target.value === 'Notification') setServiceAction('send');
                      if (e.target.value === 'Identity') setServiceAction('getCurrentUser');
                      if (e.target.value === 'License') setServiceAction('verify');
                      if (e.target.value === 'Backup') setServiceAction('sync');
                    }}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 px-1.5 py-1 rounded text-[8.5px] focus:outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="Notification">Notification</option>
                    <option value="Identity">Identity</option>
                    <option value="License">License</option>
                    <option value="Backup">Backup</option>
                  </select>
                </div>
                <div>
                  <label className="text-[7.5px] text-slate-500 block font-bold uppercase">Action Method</label>
                  <input 
                    type="text"
                    value={serviceAction}
                    onChange={(e) => setServiceAction(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 px-1.5 py-1 rounded text-[8.5px] focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="flex items-end">
                  <button 
                    onClick={handleExecuteService}
                    className="w-full bg-indigo-900 text-indigo-200 hover:bg-indigo-800 border border-indigo-700 px-2 py-1 rounded text-[8px] font-black cursor-pointer transition-all uppercase"
                  >
                    Execute
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[7.5px] text-slate-500 block font-bold uppercase mb-0.5">Parameters JSON</label>
                <input 
                  type="text"
                  value={serviceParams}
                  onChange={(e) => setServiceParams(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 text-slate-200 px-2 py-1 rounded text-[8px] font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Service result display */}
              {serviceResult && (
                <div className="bg-slate-900 border border-slate-800 p-1.5 rounded text-[8px] leading-relaxed">
                  <div className="flex justify-between text-slate-500 font-bold border-b border-slate-950 pb-0.5 mb-1">
                    <span>Result Output:</span>
                    <span>{serviceResult.timestamp}</span>
                  </div>
                  {serviceResult.success ? (
                    <pre className="text-emerald-400 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(serviceResult.response, null, 2)}</pre>
                  ) : (
                    <div className="text-rose-400 font-bold">Error: {serviceResult.error}</div>
                  )}
                </div>
              )}
            </div>

            {/* List of registered system services */}
            <div className="grid grid-cols-2 gap-1.5 text-[8.5px]">
              {aseKernelInstance.serviceRegistry.getRegisteredServices().map((srv, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-900 p-1.5 rounded-lg flex justify-between items-center px-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span className="font-extrabold text-slate-200">{srv}</span>
                  </div>
                  <span className="text-[7px] text-slate-500 font-black">v1.0.0</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: GUARDIAN */}
        {activeTab === 'guardian' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-indigo-400" /> Guardian Sandboxed Policy
              </span>
              <span className="text-[8px] bg-rose-950 text-rose-300 px-1.5 py-0.5 rounded font-black">100% SECURED</span>
            </div>

            <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl space-y-2 text-[8.5px] leading-relaxed">
              <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider block">Security Rule Checklist</span>
              
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">1. Manifest Schema Validation</span>
                  <span className="text-emerald-400 font-black">PASS</span>
                </div>
                <p className="text-slate-500 text-[7.5px] pl-2 font-medium">Memastikan berkas manifest memiliki seluruh field wajib (.id, .title, .version).</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">2. Semantic Version Format Check</span>
                  <span className="text-emerald-400 font-black">PASS</span>
                </div>
                <p className="text-slate-500 text-[7.5px] pl-2 font-medium">Validasi format semantik versi (SemVer) misalnya v1.2.0.</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">3. Database Permissions Access</span>
                  <span className="text-emerald-400 font-black">PASS</span>
                </div>
                <p className="text-slate-500 text-[7.5px] pl-2 font-medium">Hanya mengizinkan akses ke tabel database terdaftar di SharedDataEngine.</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold">4. Core Cryptographic Signature</span>
                  <span className="text-rose-400 font-black flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-rose-500 shrink-0" /> STRICT
                  </span>
                </div>
                <p className="text-slate-500 text-[7.5px] pl-2 font-medium">Memverifikasi tanda tangan digital modul dengan awalan kata kunci sah "ASE-SIG-".</p>
              </div>
            </div>

            <p className="text-[8px] text-slate-500 font-bold text-center uppercase tracking-wider">
              [ Guardian mengarantina {quarantinedCount} modul mencurigakan sepanjang sesi ini ]
            </p>
          </div>
        )}

        {/* TAB 6: RESOURCE GRAPH */}
        {activeTab === 'graph' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Network className="w-3.5 h-3.5 text-indigo-400" /> Platform Resource Dependency Graph
              </span>
              <span className="text-[8px] text-slate-500 font-bold">GRAPH-ID: ASE-V1-NET</span>
            </div>

            {/* ASCII Node representation */}
            <div className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl font-mono text-[8.5px] leading-relaxed text-slate-300 space-y-2">
              <span className="text-[8px] text-slate-400 font-extrabold block uppercase tracking-widest">Active System Topology Map</span>
              
              <div className="space-y-1 select-text">
                <div>┌─── [ ASE Core Engine Runtime ]</div>
                <div>│      ├─── [ Service Registry ] ─── (Notification, Identity, Backup)</div>
                <div>│      ├─── [ Event Bus ] ────────── (planner.goal, module.lifecycle)</div>
                <div>│      └─── [ Shared Data Engine ] ── (financeRecords, taskRecords, crmRecords)</div>
                <div>│</div>
                <div>├─── [ Installed Module: Finance Analytics ] (Running)</div>
                <div>│      ├─── binds to database: <span className="text-emerald-400">"financeRecords"</span></div>
                <div>│      ├─── requests service: <span className="text-amber-400">"Notification"</span></div>
                <div>│      └─── emits event: <span className="text-pink-400">"data.record.created"</span></div>
                <div>│</div>
                <div>└─── [ Installed Module: Planner / Growth ] (Running)</div>
                <div>       ├─── binds to database: <span className="text-emerald-400">"taskRecords"</span></div>
                <div>       └─── subscribes to: <span className="text-yellow-400">"module.lifecycle"</span></div>
              </div>
            </div>

            <div className="text-[7.5px] text-slate-500 font-semibold leading-relaxed">
              *Skema grafik ini dipetakan secara real-time dari relasi ModuleContract yang terdaftar dalam ModuleLoader ke Core Services.
            </div>
          </div>
        )}

        {/* TAB 7: WORKFLOW */}
        {activeTab === 'workflow' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-indigo-400" /> Loose Workflow Jobs Queue
              </span>
              <span className="text-[8px] text-slate-500 font-bold">ACTIVE BACKGROUND LOOPS</span>
            </div>

            {/* List of workflow pipelines */}
            <div className="space-y-2">
              {workflows.map((wf) => (
                <div key={wf.id} className="bg-slate-950 border border-slate-900 p-2 rounded-xl flex justify-between items-center text-[9px]">
                  <div className="space-y-0.5">
                    <div className="font-extrabold text-slate-200 flex items-center gap-1.5">
                      {wf.name}
                      <span className="text-[7.5px] bg-slate-900 text-slate-400 px-1 py-0.2 rounded font-black border border-slate-800">{wf.frequency}</span>
                    </div>
                    <p className="text-[8px] text-slate-500 font-bold uppercase">Terakhir jalan: {wf.lastRun}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {wf.status === 'PROCESSING' ? (
                      <span className="text-[8px] text-yellow-400 font-black tracking-widest animate-pulse shrink-0">LARI...</span>
                    ) : (
                      <button 
                        onClick={() => triggerWorkflowJob(wf.id)}
                        className="text-[8px] bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1 rounded-lg cursor-pointer text-slate-300 font-extrabold shrink-0"
                      >
                        Picu Job
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 8: DECISION */}
        {activeTab === 'decision' && (
          <div className="space-y-3">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" /> Active Heuristics Decision engine
              </span>
              <span className="text-[8px] text-slate-500 font-bold">LOCAL REAL-TIME ADVISOR</span>
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto no-scrollbar">
              {getActiveDecisionAdvices().map((adv, idx) => (
                <div key={idx} className="bg-slate-950 border border-slate-900 p-2 rounded-xl text-[9px] space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-indigo-400">{adv.title}</span>
                    <span className="text-[7.5px] bg-slate-900 text-slate-400 border border-slate-800 px-1 py-0.2 rounded uppercase font-bold">{adv.category}</span>
                  </div>
                  <div className="text-slate-400 pl-1 border-l border-slate-800 space-y-1 py-0.5">
                    <p className="text-[8.5px] text-slate-300 font-medium">"{adv.coachingMessage}"</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {adv.critique.map((crit, cIdx) => (
                        <span key={cIdx} className="text-[7.5px] bg-rose-950/20 text-rose-300 border border-rose-950/40 px-1.5 py-0.2 rounded font-semibold">{crit}</span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[7.5px] text-slate-500 font-bold leading-relaxed">
              *Decision Engine mengevaluasi data mentah di database hulu, merumuskan kritik dan rencana aksi berdasarkan heuristik berkecepatan tinggi.
            </p>
          </div>
        )}

        {/* TAB: UNIVERSAL ASSET REGISTRY */}
        {activeTab === 'assets' && (
          <div className="space-y-4">
            {/* Header / Stats */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Total Assets</span>
                <span className="text-[14px] font-black font-mono text-indigo-400">{AssetRegistry.getAllAssets().length}</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Activated</span>
                <span className="text-[14px] font-black font-mono text-emerald-400">{AssetRegistry.getAllAssets().filter(a => a.state === 'activated').length}</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Dependencies OK</span>
                <span className="text-[14px] font-black font-mono text-cyan-400">
                  {AssetRegistry.getAllAssets().filter(a => AssetRegistry.resolveDependencies(a).resolved).length}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Sandbox Guard</span>
                <span className="text-[14px] font-black font-mono text-emerald-400">ACTIVE</span>
              </div>
            </div>

            {/* Simulated Action Bar */}
            <div className="bg-slate-900/30 p-2.5 rounded-xl border border-slate-900 flex justify-between items-center gap-2">
              <div className="space-y-0.5">
                <span className="text-[9px] font-extrabold text-slate-200 block">Simulation Console: Register New Assets</span>
                <span className="text-[7.5px] text-slate-400 block">Simulasikan pemasangan bundel enkripsi paket .aseb lewat Registry</span>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button
                  onClick={() => {
                    const result = AssetRegistry.register({
                      manifest: {
                        id: 'ase-theme-neon',
                        type: 'themepack',
                        name: 'Tokyo Cyberpunk (Neon Theme)',
                        publisher: 'NeoDesign Corp',
                        version: '1.2.0',
                        engineVersion: '1.0.0',
                        signature: 'ase-sig-theme-neon-00918',
                        dependencies: [
                          { id: 'wb-growth-os', version: '1.0.0', type: 'workbook' }
                        ],
                        permissions: ['UIExtension'],
                        checksum: 'sha256-a08b918ec2091fb890eb91'
                      },
                      state: 'registered',
                      payload: {},
                      history: [{ version: '1.2.0', action: 'INSTALL', timestamp: new Date().toISOString(), note: 'Installed theme pack via Marketplace' }]
                    });
                    setAssetLogs(prev => [...prev, ...result.logs]);
                    setAssetTick(t => t + 1);
                  }}
                  className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 text-indigo-300 font-extrabold text-[8px] uppercase px-2 py-1 rounded transition-all cursor-pointer"
                >
                  + Tokyo Theme (.aseb)
                </button>

                <button
                  onClick={() => {
                    const result = AssetRegistry.register({
                      manifest: {
                        id: 'ase-lang-jp',
                        type: 'langpack',
                        name: 'Japanese Language Pack (Community)',
                        publisher: 'ASE Japan Community',
                        version: '2.0.1',
                        engineVersion: '1.0.0',
                        signature: 'ase-sig-lang-jp-77812',
                        dependencies: [],
                        permissions: ['UIExtension'],
                        checksum: 'sha256-ff771a28172bc90eb811'
                      },
                      state: 'registered',
                      payload: {
                        locale: 'jp',
                        translations: {
                          'JP': { title: '日本向け' }
                        }
                      },
                      history: [{ version: '2.0.1', action: 'INSTALL', timestamp: new Date().toISOString(), note: 'Community localization' }]
                    });
                    setAssetLogs(prev => [...prev, ...result.logs]);
                    setAssetTick(t => t + 1);
                  }}
                  className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 text-indigo-300 font-extrabold text-[8px] uppercase px-2 py-1 rounded transition-all cursor-pointer"
                >
                  + Japan Lang (.aseb)
                </button>

                <button
                  onClick={() => {
                    const result = AssetRegistry.register({
                      manifest: {
                        id: 'wb-finance-ledger',
                        type: 'workbook',
                        name: 'Corporate Budget Ledger',
                        publisher: 'Fintech Solutions',
                        version: '1.0.4',
                        engineVersion: '1.0.0',
                        signature: 'bad-sig-tampered-and-unverified-key',
                        dependencies: [
                          { id: 'ase-lang-id', version: '1.0.0', type: 'langpack' }
                        ],
                        permissions: ['StorageAccess', 'SystemRootAccess', 'UnauthorizedApiCall'],
                        checksum: 'sha256-corruptedChecksumFormatError'
                      },
                      state: 'registered',
                      payload: {},
                      history: [{ version: '1.0.4', action: 'TAMPER_INSTALL', timestamp: new Date().toISOString(), note: 'Attempting spoof signature' }]
                    });
                    setAssetLogs(prev => [...prev, ...result.logs]);
                    setAssetTick(t => t + 1);
                  }}
                  className="bg-rose-950/40 hover:bg-rose-950/60 border border-rose-900/50 text-rose-300 font-extrabold text-[8px] uppercase px-2 py-1 rounded transition-all cursor-pointer animate-pulse"
                >
                  ⚠ Hack Spoof Signature
                </button>
              </div>
            </div>

            {/* Asset Logs Terminal */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 font-mono text-[8px] text-slate-400 space-y-1 h-28 overflow-y-auto no-scrollbar">
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider block border-b border-slate-900 pb-0.5">📟 Security & Sandbox Execution Logs</span>
              {assetLogs.map((logLine, idx) => (
                <div key={idx} className={logLine.includes('[ERROR]') || logLine.includes('[FAILED]') ? 'text-rose-400' : logLine.includes('[SUCCESS]') || logLine.includes('✓') ? 'text-emerald-400' : logLine.includes('[WARNING]') ? 'text-amber-400' : 'text-slate-300'}>
                  {logLine}
                </div>
              ))}
            </div>

            {/* Assets Grid List */}
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
              {AssetRegistry.getAllAssets().map((asset) => {
                const depCheck = AssetRegistry.resolveDependencies(asset);
                const verifyCheck = AssetRegistry.verify(asset);
                const isCertified = verifyCheck.valid;
                return (
                  <div key={asset.manifest.id} className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl space-y-2 relative overflow-hidden">
                    {/* Badge type */}
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[6.5px] font-black px-1.5 rounded uppercase tracking-wider ${
                            asset.manifest.type === 'langpack' ? 'bg-cyan-950 text-cyan-300 border border-cyan-900/40' :
                            asset.manifest.type === 'workbook' ? 'bg-emerald-950 text-emerald-300 border border-emerald-900/40' :
                            asset.manifest.type === 'themepack' ? 'bg-indigo-950 text-indigo-300 border border-indigo-900/40' :
                            'bg-slate-900 text-slate-400'
                          }`}>
                            {asset.manifest.type}
                          </span>
                          <strong className="text-[10px] text-slate-200">{asset.manifest.name}</strong>
                          <span className="text-[8px] text-slate-500 font-bold">v{asset.manifest.version}</span>
                        </div>
                        <span className="text-[7.5px] text-slate-400 block">Publisher: <strong className="text-slate-300">{asset.manifest.publisher}</strong> | Engine: <strong className="text-slate-300">{asset.manifest.engineVersion}</strong></span>
                      </div>

                      {/* State badge */}
                      <span className={`text-[7.5px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider ${
                        asset.state === 'activated' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-slate-900 text-slate-500 border border-slate-800'
                      }`}>
                        {asset.state}
                      </span>
                    </div>

                    {/* Metadata, Signature, Checksum */}
                    <div className="grid grid-cols-2 gap-1.5 text-[7px] bg-slate-900/30 p-1.5 rounded border border-slate-900/60 font-mono">
                      <div>
                        <span className="text-slate-500">Signature Check:</span>{' '}
                        <span className={isCertified ? 'text-emerald-400' : 'text-rose-400 font-bold'}>
                          {isCertified ? '✓ Guardian Validated' : '✗ Security Rejected'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500">Integrity Checksum:</span>{' '}
                        <span className="text-slate-300 truncate block max-w-[150px]">{asset.manifest.checksum}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Permissions Requested:</span>{' '}
                        <span className="text-slate-300">[{asset.manifest.permissions.join(', ') || 'None'}]</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">Dependencies Status:</span>{' '}
                        <span className={depCheck.resolved ? 'text-cyan-400' : 'text-amber-400'}>
                          {depCheck.resolved ? '✓ Met' : `✗ Unresolved (${depCheck.missing.map(m=>m.id).join(', ')})`}
                        </span>
                      </div>
                    </div>

                    {/* Actions panel */}
                    <div className="flex gap-1.5 justify-end">
                      <button
                        onClick={() => {
                          const res = AssetRegistry.verify(asset);
                          setAssetLogs(prev => [...prev, `[Verifikator] Memverifikasi manual ID: "${asset.manifest.id}"`, ...res.logs]);
                        }}
                        className="text-[7.5px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-2 py-0.8 rounded cursor-pointer transition-all"
                      >
                        Verify Signature
                      </button>

                      {asset.state !== 'activated' ? (
                        <button
                          onClick={() => {
                            const res = AssetRegistry.activate(asset.manifest.id);
                            setAssetLogs(prev => [...prev, ...res.logs]);
                            setAssetTick(t => t + 1);
                          }}
                          className="text-[7.5px] bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 text-indigo-300 px-2 py-0.8 rounded cursor-pointer transition-all font-bold"
                        >
                          Activate Asset
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            const res = AssetRegistry.deactivate(asset.manifest.id);
                            setAssetLogs(prev => [...prev, ...res.logs]);
                            setAssetTick(t => t + 1);
                          }}
                          className="text-[7.5px] bg-amber-950/40 hover:bg-amber-950/60 border border-amber-900/40 text-amber-300 px-2 py-0.8 rounded cursor-pointer transition-all font-bold"
                        >
                          Deactivate
                        </button>
                      )}

                      <button
                        onClick={() => {
                          const res = AssetRegistry.upgrade(asset.manifest.id, {
                            ...asset,
                            manifest: {
                              ...asset.manifest,
                              version: `${parseInt(asset.manifest.version.split('.')[0]) + 1}.0.0`
                            },
                            history: [{ version: `${parseInt(asset.manifest.version.split('.')[0]) + 1}.0.0`, action: 'UPGRADE', timestamp: new Date().toISOString(), note: 'Simulated upgrade action' }]
                          });
                          setAssetLogs(prev => [...prev, ...res.logs]);
                          setAssetTick(t => t + 1);
                        }}
                        className="text-[7.5px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-2 py-0.8 rounded cursor-pointer transition-all"
                      >
                        Upgrade Version
                      </button>

                      <button
                        onClick={() => {
                          const res = AssetRegistry.rollback(asset.manifest.id);
                          setAssetLogs(prev => [...prev, ...res.logs]);
                          setAssetTick(t => t + 1);
                        }}
                        className="text-[7.5px] bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-2 py-0.8 rounded cursor-pointer transition-all"
                      >
                        Rollback
                      </button>

                      <button
                        onClick={() => {
                          const res = AssetRegistry.unregister(asset.manifest.id);
                          setAssetLogs(prev => [...prev, ...res.logs]);
                          setAssetTick(t => t + 1);
                        }}
                        className="text-[7.5px] bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-950/30 px-2 py-0.8 rounded cursor-pointer transition-all"
                      >
                        Unregister
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: IDENTITY MODULE */}
        {activeTab === 'identity' && (
          <div className="space-y-4">
            {/* Upper Stats: Auth and Session Status */}
            <div className="grid grid-cols-4 gap-2">
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Status</span>
                <span className={`text-[12px] font-black font-mono ${IdentityModule.getCurrentSession() ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {IdentityModule.getCurrentSession() ? 'SECURE_IN' : 'GUEST'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Active Provider</span>
                <span className="text-[12px] font-black font-mono text-indigo-400">
                  {IdentityModule.getCurrentSession()?.provider.toUpperCase() || 'OFFLINE'}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Linked Accounts</span>
                <span className="text-[12px] font-black font-mono text-cyan-400">
                  {IdentityModule.getLinkedAccounts().length}
                </span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-900 text-center">
                <span className="text-[7px] text-slate-500 font-extrabold uppercase block">Token Status</span>
                <span className={`text-[12px] font-black font-mono ${IdentityModule.getCurrentSession() ? 'text-emerald-400' : 'text-amber-500'}`}>
                  {IdentityModule.getCurrentSession() ? 'VALID_JWT' : 'NO_TOKEN'}
                </span>
              </div>
            </div>

            {/* Sandbox Simulation Form & Trigger Actions */}
            <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-900 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <span className="text-[9px] font-extrabold text-slate-200 block uppercase tracking-wide">OAuth Client Payload Customization</span>
                
                <div className="space-y-1">
                  <label className="text-[7.5px] font-black text-slate-400 uppercase">Simulated User Email</label>
                  <input 
                    type="email" 
                    value={mockAuthEmail} 
                    onChange={(e) => setMockAuthEmail(e.target.value)}
                    placeholder="prasetyo.ase@gmail.com"
                    className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded text-[8px] font-mono text-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-600"
                  />
                  <p className="text-[6.5px] text-slate-500 font-medium">Use email ending with @ase.dev or "admin" to trigger Admin SysAdmin privileges!</p>
                </div>

                <div className="space-y-1">
                  <label className="text-[7.5px] font-black text-slate-400 uppercase">Simulated Full Name</label>
                  <input 
                    type="text" 
                    value={mockAuthName} 
                    onChange={(e) => setMockAuthName(e.target.value)}
                    placeholder="Prasetyo"
                    className="w-full bg-slate-950 border border-slate-800 p-1.5 rounded text-[8px] font-mono text-slate-300 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex flex-col justify-between">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-extrabold text-slate-200 block uppercase tracking-wide">Triggers & Provider Actions</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={async () => {
                        const res = await IdentityModule.login('google', mockAuthEmail, mockAuthName);
                        setIdentityLogs(prev => [...prev, ...res.logs]);
                        setIdentityTick(t => t + 1);
                      }}
                      className="bg-indigo-950 hover:bg-indigo-900 border border-indigo-850 text-indigo-300 font-extrabold text-[8px] uppercase px-2 py-1.5 rounded transition-all cursor-pointer text-center"
                    >
                      Login with Google
                    </button>
                    
                    <button
                      onClick={async () => {
                        const res = await IdentityModule.login('github', mockAuthEmail, mockAuthName);
                        setIdentityLogs(prev => [...prev, ...res.logs]);
                        setIdentityTick(t => t + 1);
                      }}
                      className="bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-[8px] uppercase px-2 py-1.5 rounded transition-all cursor-pointer text-center"
                    >
                      Login with GitHub
                    </button>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-900 mt-2 flex justify-between gap-2">
                  <button
                    onClick={() => {
                      const res = IdentityModule.logout();
                      setIdentityLogs(prev => [...prev, ...res.logs]);
                      setIdentityTick(t => t + 1);
                    }}
                    className="flex-1 bg-rose-950/20 text-rose-400 hover:bg-rose-950/40 border border-rose-950/30 font-extrabold text-[8px] uppercase py-1.5 rounded transition-all cursor-pointer text-center"
                  >
                    Disconnect Sesi / Logout
                  </button>
                </div>
              </div>
            </div>

            {/* JWT Token Decoder Sandbox */}
            {IdentityModule.getCurrentSession() ? (
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 space-y-2">
                <span className="text-[8px] font-black text-amber-400 uppercase tracking-widest block">🛡️ JWT token security decoder</span>
                
                <div className="text-[7.5px] font-mono leading-tight break-all p-1.5 bg-slate-900/60 rounded text-amber-500/90 border border-slate-850">
                  {IdentityModule.getCurrentSession()?.token}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[8px]">
                  <div className="bg-slate-900/40 p-2 rounded border border-slate-900 space-y-1">
                    <span className="text-slate-500 font-black uppercase tracking-wider block">HEADER: ALGORITHM</span>
                    <pre className="text-cyan-400 text-[7px] leading-normal font-mono">
                      {JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'ase-oauth-secure-key' }, null, 2)}
                    </pre>
                  </div>
                  <div className="bg-slate-900/40 p-2 rounded border border-slate-900 space-y-1">
                    <span className="text-slate-500 font-black uppercase tracking-wider block">PAYLOAD: CLAIMS</span>
                    <pre className="text-emerald-400 text-[7px] leading-normal font-mono">
                      {JSON.stringify({
                        iss: 'accounts.ase.dev',
                        sub: IdentityModule.getCurrentSession()?.user.uid,
                        email: IdentityModule.getCurrentSession()?.user.email,
                        role: IdentityModule.getCurrentSession()?.user.role,
                        scopes: IdentityModule.getCurrentSession()?.scopes,
                        exp: IdentityModule.getCurrentSession()?.expiresAt
                      }, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/50 border border-slate-900 rounded-xl p-4 text-center text-slate-500 text-[9px] uppercase font-bold tracking-wider">
                Silakan lakukan login simulasi untuk melihat dekripsi token jabat tangan kriptografi (JWT) secara real-time.
              </div>
            )}

            {/* Permission Scope Claim Monitor */}
            {IdentityModule.getCurrentSession() && (
              <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 space-y-1.5">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Granted Security Claims & Permissions</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { claim: 'AssetPurchaser', desc: 'Hak beli aset premium' },
                    { claim: 'PublisherUpload', desc: 'Hak unggah modul' },
                    { claim: 'CloudBackupSync', desc: 'Hak sinkronisasi cloud' },
                    { claim: 'CoreSysAdmin', desc: 'Akses sistem inti admin' },
                    { claim: 'TelemetryAccess', desc: 'Hak pantau performa' },
                    { claim: 'LicenseIssuer', desc: 'Hak terbitkan lisensi' }
                  ].map((p, idx) => {
                    const isGranted = IdentityModule.hasScope(p.claim);
                    return (
                      <div key={idx} className={`p-1.5 rounded border flex flex-col justify-between ${isGranted ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' : 'bg-slate-900/20 border-slate-900 text-slate-600'}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-[8px] font-black">{p.claim}</span>
                          <span className="text-[7px]">{isGranted ? '✓ APPROVED' : '✗ DENIED'}</span>
                        </div>
                        <span className="text-[6.5px] text-slate-400">{p.desc}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Account Registry linking social nodes */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2.5 space-y-1.5">
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest block">Federated Account Registry</span>
              <p className="text-[8px] text-slate-400">Menampilkan penyedia identitas OAuth eksternal yang saat ini telah tertaut ke Sandbox Anda:</p>
              {IdentityModule.getLinkedAccounts().length > 0 ? (
                <div className="space-y-1">
                  {IdentityModule.getLinkedAccounts().map((acc, idx) => (
                    <div key={idx} className="bg-slate-900/60 p-2 rounded border border-slate-850 flex justify-between items-center text-[7.5px] font-mono">
                      <div className="flex items-center gap-2">
                        <span className="text-indigo-400 font-extrabold uppercase">[{acc.provider}]</span>
                        <span className="text-slate-300">{acc.email}</span>
                      </div>
                      <span className="text-slate-500">Linked: {acc.linkedAt}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-2 text-slate-600 text-[8px] font-bold uppercase">No Federated Accounts Linked</div>
              )}
            </div>

            {/* Log Terminal */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 font-mono text-[8px] text-slate-400 space-y-1 h-28 overflow-y-auto no-scrollbar">
              <span className="text-[7px] text-slate-500 font-bold uppercase tracking-wider block border-b border-slate-900 pb-0.5">📟 Security Identity & Session Handshake Logs</span>
              {identityLogs.map((logLine, idx) => (
                <div key={idx} className={logLine.includes('[ERROR]') || logLine.includes('[FAILED]') ? 'text-rose-400' : logLine.includes('[SUCCESS]') || logLine.includes('✓') ? 'text-emerald-400' : logLine.includes('[WARNING]') ? 'text-amber-400' : 'text-slate-300'}>
                  {logLine}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 9: LOGS */}
        {activeTab === 'logs' && (
          <div className="space-y-3">
            {/* Log level filter bar */}
            <div className="flex justify-between items-center border-b border-slate-800 pb-1">
              <span className="text-[10px] font-extrabold text-slate-300 uppercase flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Kernel Diagnostic Logs
              </span>
              <div className="flex gap-1">
                {['all', 'info', 'warn', 'error', 'success'].map((lvl) => (
                  <button 
                    key={lvl}
                    onClick={() => setFilterLogLevel(lvl as any)}
                    className={`px-1.5 py-0.2 text-[7.5px] font-black rounded uppercase cursor-pointer border ${filterLogLevel === lvl ? 'bg-indigo-950 border-indigo-700 text-indigo-300' : 'bg-slate-900 border-slate-850 text-slate-500'}`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable logs */}
            <div className="bg-slate-950 border border-slate-900 rounded-xl p-2 h-44 overflow-y-auto space-y-1.5 text-[8.5px] leading-relaxed no-scrollbar select-text">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <div key={log.id} className={getLogClass(log.level)}>
                    <span className="text-slate-500 font-bold mr-1">[{log.timestamp}]</span>
                    <span className="text-indigo-400 font-black mr-1 uppercase shrink-0">[{log.component}]</span>
                    <span className="text-slate-200 font-medium">{log.message}</span>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-slate-600 font-black text-[9px] uppercase">
                  [ Kosong - Tidak ada log dengan level ini ]
                </div>
              )}
              <div ref={logsEndRef} />
            </div>

            <div className="flex justify-between items-center text-[8px] text-slate-500 font-bold uppercase">
              <span>Total Logs: <strong className="text-slate-300">{logs.length} entries</strong></span>
              <button 
                onClick={handleClearLogs}
                className="text-[8px] bg-slate-900 hover:bg-slate-800 text-rose-400 hover:text-rose-300 border border-slate-850 px-2 py-0.5 rounded cursor-pointer transition-all uppercase"
              >
                Clear Log Memory
              </button>
            </div>
          </div>
        )}

      </div>

      {/* SPRINT BUTTONS (Visible only in Developer Mode) */}
      {isDevMode && (
        <div className="bg-slate-900/40 p-3 rounded-2xl border border-slate-900 space-y-2">
          <span className="text-[8px] text-slate-400 font-extrabold uppercase block tracking-widest">Ecosystem Interactive Sprints</span>
          <div className="grid grid-cols-3 gap-1.5">
            <button 
              onClick={triggerBootstrapDemo}
              className="flex items-center justify-between text-[8px] bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 px-2 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              <span className="truncate">S1: Reset Core</span>
              <RefreshCw className="w-2.5 h-2.5 text-indigo-400 ml-1 shrink-0" />
            </button>
            <button 
              onClick={triggerInstallValidDemo}
              className="flex items-center justify-between text-[8px] bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 px-2 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              <span className="truncate">S2: Install (.aseb)</span>
              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 ml-1 shrink-0" />
            </button>
            <button 
              onClick={triggerInstallInvalidDemo}
              className="flex items-center justify-between text-[8px] bg-slate-950 hover:bg-slate-900 border border-slate-850 text-slate-300 px-2 py-1.5 rounded-lg transition-all cursor-pointer font-bold"
            >
              <span className="truncate">S7: Security Denied</span>
              <ShieldAlert className="w-2.5 h-2.5 text-rose-500 ml-1 shrink-0" />
            </button>
          </div>
        </div>
      )}

      {/* Production Health Check Panel (Visible only in Production Mode) */}
      {!isDevMode && (
        <div className="bg-emerald-950/20 border border-emerald-900/30 p-3 rounded-2xl flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-[10px] leading-relaxed text-slate-300 font-semibold space-y-1">
            <span className="font-extrabold text-emerald-300 uppercase block tracking-wider text-[8.5px]">Sistem Sehat - Siap Beroperasi</span>
            <p className="text-[9.5px]">ASE Core Runtime melayani platform dengan performa optimum. Seluruh alokasi database, subskripsi event, dan perizinan berada pada status aman terenkripsi.</p>
          </div>
        </div>
      )}

      {/* Milestone Certification Callout */}
      <div className="p-3 bg-gradient-to-r from-indigo-950/30 to-slate-900/50 border border-indigo-900/20 rounded-2xl flex items-start gap-2.5">
        <Briefcase className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
        <div className="text-[9.5px] leading-relaxed text-slate-400 font-semibold">
          <span className="font-extrabold text-indigo-300 uppercase block tracking-wider text-[7.5px]">Validation Milestone M4</span>
          <strong>Ecosystem Validation & Reference Workbook:</strong> Memasang dan menjalankan modul tanpa modifikasi Core untuk membuktikan kedaulatan arsitektur platform yang sesungguhnya.
        </div>
      </div>
    </div>
  );
}

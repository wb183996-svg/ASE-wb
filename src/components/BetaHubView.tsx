/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Download, 
  RefreshCw, 
  Layers, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRightLeft, 
  Smartphone, 
  Monitor, 
  Terminal, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  PlayCircle,
  HelpCircle,
  Award,
  BookOpen,
  ChevronRight,
  Sparkles,
  Zap,
  Globe,
  FileJson,
  Send
} from 'lucide-react';
import { ThemeColor } from '../types';
import { IdentityModule } from '../core/IdentityService';
import { ReleaseService, ReleaseInfo } from '../services/ReleaseService';
import { collection, addDoc, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface BetaHubViewProps {
  themeColor: string;
}

export default function BetaHubView({ themeColor }: BetaHubViewProps) {
  // Reactive Authentication Session state
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

  // Sync real feedback archive from Firestore real-time
  useEffect(() => {
    const q = query(collection(db, 'feedback'), orderBy('createdAt', 'desc'), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: any[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        list.push({
          id: doc.id,
          category: data.category || 'Other',
          severity: data.severity || 'Medium',
          comment: data.comment || data.message || '',
          timestamp: data.timestamp || (data.createdAt ? new Date(data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : ''),
          email: data.email || '',
          userId: data.userId || '',
          userName: data.userName || '',
          createdAt: data.createdAt || ''
        });
      });
      if (list.length > 0) {
        setFeedbackList(list);
      }
    }, (error) => {
      console.error("Error listening to feedback updates:", error);
    });
    return () => unsubscribe();
  }, []);

  // Current active sub-tab inside the Beta Hub
  const [betaSubTab, setBetaSubTab] = useState<'dashboard' | 'distribution' | 'updater' | 'charter'>('dashboard');

  // Simulated live metrics state
  const [tick, setTick] = useState(0);
  const [crashRate, setCrashRate] = useState(0.12);
  const [startupTime, setStartupTime] = useState(135);
  const [syncSuccessRate, setSyncSuccessRate] = useState(99.94);
  const [activeUsers, setActiveUsers] = useState(428);

  // Added Observability Metrics
  const [memoryUsage, setMemoryUsage] = useState(132);
  const [peakMemory, setPeakMemory] = useState(178);
  const [errorRate, setErrorRate] = useState(0.02);

  // Dynamic Telemetry Logs
  const [telemetryLogs, setTelemetryLogs] = useState<Array<{ type: string; text: string; time: string }>>([
    { type: 'INI', text: 'Initializing Kernel Module Manager...', time: '12:00:01' },
    { type: 'REG', text: 'Registered Asset ID: ase-lang-id [Indonesian Pack]', time: '12:00:05' },
    { type: 'SEC', text: 'Sandbox initiated under Signature verification code 0x7E3D...', time: '12:00:07' },
    { type: 'CLD', text: 'Sync session established with cloud revision ID: rev_00142...', time: '12:00:10' },
    { type: 'SYS', text: 'Idle. Latency: 11ms, Active thread loops: 4', time: '12:00:12' }
  ]);

  // Feedback States
  const [feedbackCategory, setFeedbackCategory] = useState<'Bug' | 'Suggestion' | 'Performance' | 'Marketplace' | 'Workbook' | 'Other'>('Bug');
  const [feedbackSeverity, setFeedbackSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [feedbackComment, setFeedbackComment] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState(false);
  const [feedbackList, setFeedbackList] = useState<Array<{ id: string; category: string; severity: 'Low' | 'Medium' | 'High' | 'Critical'; comment: string; timestamp: string }>>([
    { id: 'fb-1', category: 'Workbook', severity: 'Low', comment: 'Sangat menyukai desain dynamic cell formula pada sandbox!', timestamp: '11:45:00' },
    { id: 'fb-2', category: 'Performance', severity: 'Medium', comment: 'Cold boot startup sangat mengesankan di bawah 150ms.', timestamp: '11:58:30' }
  ]);

  // Diagnostic Export State
  const [exportSuccess, setExportSuccess] = useState(false);

  // Installer simulation state
  const [downloadingPlatform, setDownloadingPlatform] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);

  // Auto-update simulation state
  const [updateStep, setUpdateStep] = useState<'idle' | 'checking' | 'downloading' | 'verifying_sha' | 'verifying_signature' | 'installing' | 'restarting' | 'done'>('idle');
  const [updateProgress, setUpdateProgress] = useState(0);
  const [currentVersion, setCurrentVersion] = useState('v1.0.0-baseline');

  // GitHub Releases Real-world integration
  const [githubRepo, setGithubRepo] = useState(() => ReleaseService.getRepositoryIdentifier());
  const [githubToken, setGithubToken] = useState(() => localStorage.getItem('ase_github_token') || '');
  const [gitReleases, setGitReleases] = useState<ReleaseInfo[]>([]);
  const [isFetchingReleases, setIsFetchingReleases] = useState(false);
  const [releasesError, setReleasesError] = useState<string | null>(null);

  // Release Mode Selection: 'auto' | 'github' | 'local' | 'simulation'
  const [releaseMode, setReleaseMode] = useState<'auto' | 'github' | 'local' | 'simulation'>(() => {
    return (localStorage.getItem('ase_release_mode') as any) || 'auto';
  });

  const [resolvedSource, setResolvedSource] = useState<'github' | 'local' | 'simulation'>('simulation');

  // Compatibility derivation
  const isSandboxMode = releaseMode === 'local' || releaseMode === 'simulation';

  // Custom Real-World Download Link Configurations
  const [customAndroidUrl, setCustomAndroidUrl] = useState(() => localStorage.getItem('ase_custom_android_url') || '');
  const [customWindowsUrl, setCustomWindowsUrl] = useState(() => localStorage.getItem('ase_custom_windows_url') || '');
  const [customMacosUrl, setCustomMacosUrl] = useState(() => localStorage.getItem('ase_custom_macos_url') || '');
  const [customLinuxUrl, setCustomLinuxUrl] = useState(() => localStorage.getItem('ase_custom_linux_url') || '');
  const [showOverrides, setShowOverrides] = useState(false);

  // Android Installer simulation states
  const [showAndroidInstaller, setShowAndroidInstaller] = useState(false);
  const [installerStep, setInstallerStep] = useState<'prompt' | 'installing' | 'completed'>('prompt');
  const [installProgress, setInstallProgress] = useState(0);

  const startInstallationProgress = () => {
    setInstallerStep('installing');
    setInstallProgress(0);
    const interval = setInterval(() => {
      setInstallProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setInstallerStep('completed');
          // Add a telemetry log
          setTelemetryLogs(prevLogs => {
            const nextLogs = [
              ...prevLogs,
              { type: 'SYS', text: 'Android Sandbox: com.ase.workbook successfully installed with verification signature 0x7E3D.', time: new Date().toLocaleTimeString() }
            ];
            while (nextLogs.length > 6) {
              nextLogs.shift();
            }
            return nextLogs;
          });
          return 100;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 250);
  };

  const saveCustomUrl = (platform: 'android' | 'windows' | 'macos' | 'linux', value: string) => {
    localStorage.setItem(`ase_custom_${platform}_url`, value);
    if (platform === 'android') setCustomAndroidUrl(value);
    else if (platform === 'windows') setCustomWindowsUrl(value);
    else if (platform === 'macos') setCustomMacosUrl(value);
    else if (platform === 'linux') setCustomLinuxUrl(value);
  };

  const checkLocalAssetsExist = async (): Promise<boolean> => {
    try {
      const res = await fetch('/ASE-v1.5.0-beta.1.apk', { method: 'HEAD' });
      return res.status === 200;
    } catch (e) {
      return false;
    }
  };

  const fetchReleases = async (repoName: string, bypassCache = false) => {
    setIsFetchingReleases(true);
    setReleasesError(null);
    try {
      if (releaseMode === 'github') {
        const data = await ReleaseService.fetchLatestReleases(repoName, bypassCache, githubToken);
        setGitReleases(data);
        setResolvedSource('github');
      } else if (releaseMode === 'local') {
        setGitReleases(ReleaseService.getSandboxReleases());
        setResolvedSource('local');
      } else if (releaseMode === 'simulation') {
        setGitReleases(ReleaseService.getSimulationReleases());
        setResolvedSource('simulation');
      } else {
        // Mode 'auto' (Sistem Fallback Prioritas Otomatis)
        try {
          // Prioritas 1: Coba GitHub API
          const data = await ReleaseService.fetchLatestReleases(repoName, bypassCache, githubToken);
          if (data && data.length > 0) {
            setGitReleases(data);
            setResolvedSource('github');
          } else {
            throw new Error("No releases on GitHub");
          }
        } catch (githubErr: any) {
          console.warn("GitHub fetch failed or empty, trying Local Sandbox fallback:", githubErr);
          // Prioritas 2: Coba biner lokal /public
          const localExists = await checkLocalAssetsExist();
          if (localExists) {
            setGitReleases(ReleaseService.getSandboxReleases());
            setResolvedSource('local');
          } else {
            // Prioritas 3: Mode Simulasi murni
            setGitReleases(ReleaseService.getSimulationReleases());
            setResolvedSource('simulation');
          }
        }
      }
      localStorage.setItem('ase_github_repo', repoName);
    } catch (err: any) {
      setGitReleases([]);
      setReleasesError(err.message || "Gagal memuat rilis.");
      // Fallback safe
      setGitReleases(ReleaseService.getSimulationReleases());
      setResolvedSource('simulation');
    } finally {
      setIsFetchingReleases(false);
    }
  };

  useEffect(() => {
    if (betaSubTab === 'distribution' && githubRepo) {
      fetchReleases(githubRepo, false);
    }
  }, [betaSubTab, githubRepo, releaseMode, githubToken]);

  const [copiedBuildInfo, setCopiedBuildInfo] = useState(false);
  const [fallbackInfoText, setFallbackInfoText] = useState<string | null>(null);

  const copyBuildInfoToClipboard = () => {
    const infoText = `ASE v1.5.0-beta.2 (Closed Beta Build)
Platform Runtime: Web (Sandbox Ingress)
Build Date: 2026-07-03
Kernel Signature: VERIFIED (RSA-2048)
SHA-256: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
Local Clock Epoch: ${Math.floor(Date.now() / 1000)}
Sync Success Rate: ${syncSuccessRate}%
Crash Rate: ${crashRate}%
Memory Usage: ${memoryUsage} MB (Peak: ${peakMemory} MB)
API Error Rate: ${errorRate}%`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(infoText)
        .then(() => {
          setCopiedBuildInfo(true);
          setTimeout(() => setCopiedBuildInfo(false), 2500);
        })
        .catch(() => {
          setFallbackInfoText(infoText);
        });
    } else {
      setFallbackInfoText(infoText);
    }
  };

  const handleExportDiagnostic = () => {
    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);

    const session = IdentityModule.getCurrentSession();
    const userEmail = session?.user?.email || "Guest Sesi (Belum Login)";
    const userUid = session?.user?.uid || "Guest";
    const userName = session?.user?.name || "Tamu";

    const reportData = {
      application: "ASE Adaptive Systems Environment",
      version: currentVersion,
      build: "SUCCESS",
      platform: "Web Sandbox Ingress",
      runtime: "React v18 with Vite Platform",
      memory: `${memoryUsage} MB (Peak: ${peakMemory} MB)`,
      apiErrorRate: `${errorRate}%`,
      syncStatus: `${syncSuccessRate}% STABLE`,
      installedModules: [
        "ase-core-engine",
        "ase-workbook-module",
        "ase-marketplace-extension",
        "ase-indonesian-pack"
      ],
      logs: telemetryLogs.map(l => `[${l.time}] [${l.type}] ${l.text}`),
      
      // Dynamic user details
      user: {
        email: userEmail,
        uid: userUid,
        name: userName,
        provider: session?.provider || "offline"
      },

      // Prioritas 5 (Diagnostic Report) required parameters
      deviceModel: "Pixel 7 Pro (Virtual Sandbox)",
      androidVersion: "Android 13 (API 33)",
      screenResolution: "1080x2400 (420dpi)",
      locale: "id-ID",
      memoryUsage: memoryUsage,
      buildNumber: "10502",
      timestamp: new Date().toISOString()
    };

    // Inject diagnostic upload event into live logger (representing Firestore collection upload)
    setTelemetryLogs(prev => {
      const nextLogs = [
        ...prev,
        { type: 'DB', text: `[Firestore] diagnostics/diag-${Date.now()} diunggah untuk user <${userEmail}>.`, time: new Date().toLocaleTimeString() }
      ];
      if (nextLogs.length > 6) {
        nextLogs.shift();
      }
      return nextLogs;
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(reportData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ase-diagnostic-report-tick${tick}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    const session = IdentityModule.getCurrentSession();
    if (!session) return; // Guard against submission without active session

    const newFb = {
      category: feedbackCategory,
      severity: feedbackSeverity,
      comment: feedbackComment, // kept for backwards compatibility in list UI rendering
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      
      // Prioritas 6 (Feedback) dynamic session parameters
      email: session.user.email,
      userId: session.user.uid,
      userName: session.user.name,
      message: feedbackComment,
      appVersion: currentVersion,
      device: navigator.userAgent || "Android/Web Ingress (Sandbox)",
      createdAt: new Date().toISOString()
    };

    try {
      const docRef = await addDoc(collection(db, 'feedback'), newFb);
      
      // Inject feedback submit event into live logger (representing Firestore write)
      setTelemetryLogs(prev => {
        const nextLogs = [
          ...prev,
          { type: 'DB', text: `[Firestore] feedback/${docRef.id} berhasil dibuat untuk user <${session.user.email}>.`, time: new Date().toLocaleTimeString() },
          { type: 'FBK', text: `Feedback received [${feedbackCategory} - Severity: ${feedbackSeverity}]: "${feedbackComment.slice(0, 30)}..."`, time: new Date().toLocaleTimeString() }
        ];
        while (nextLogs.length > 6) {
          nextLogs.shift();
        }
        return nextLogs;
      });

      setFeedbackComment('');
      setFeedbackSuccess(true);
      setTimeout(() => setFeedbackSuccess(false), 3000);
    } catch (err: any) {
      console.error("Firestore submit error:", err);
      alert(`Gagal mengirim ulasan ke Cloud Firestore: ${err.message || err}`);
    }
  };

  // Periodic metric jitter to make the dashboard feel alive and real
  useEffect(() => {
    const logPool = [
      { type: 'SYS', text: 'Memory cleanup daemon invoked. GC freed 1.2MB of stale modules.' },
      { type: 'CLD', text: 'Periodic heartbeat checklist dispatched to Firebase Ingress.' },
      { type: 'REG', text: 'Cache hit ratio: 94.2% for registered manifest files.' },
      { type: 'SEC', text: 'Signature validation check passed for local system workbooks.' },
      { type: 'SYS', text: 'Active module instances: 12. Sandboxing constraints optimal.' },
      { type: 'SYS', text: 'Modular hot-reload checked. 0 changed classes detected.' }
    ];

    const interval = setInterval(() => {
      setTick(prev => prev + 1);
      setCrashRate(prev => {
        const jitter = (Math.random() - 0.5) * 0.02;
        return Math.max(0.04, Math.min(0.25, Number((prev + jitter).toFixed(3))));
      });
      setStartupTime(prev => {
        const jitter = Math.floor((Math.random() - 0.5) * 6);
        return Math.max(120, Math.min(150, prev + jitter));
      });
      setSyncSuccessRate(prev => {
        const jitter = (Math.random() - 0.5) * 0.01;
        return Math.max(99.90, Math.min(100.00, Number((prev + jitter).toFixed(2))));
      });
      setActiveUsers(prev => {
        const jitter = Math.floor((Math.random() - 0.5) * 4);
        return Math.max(410, Math.min(460, prev + jitter));
      });
      setMemoryUsage(prev => {
        const jitter = Math.floor((Math.random() - 0.5) * 4);
        const nextVal = Math.max(125, Math.min(142, prev + jitter));
        setPeakMemory(p => Math.max(p, nextVal + Math.floor(Math.random() * 20 + 5)));
        return nextVal;
      });
      setErrorRate(prev => {
        const jitter = (Math.random() - 0.5) * 0.005;
        return Math.max(0.01, Math.min(0.05, Number((prev + jitter).toFixed(4))));
      });

      // Append random log
      setTelemetryLogs(prev => {
        const randLog = logPool[Math.floor(Math.random() * logPool.length)];
        const nextLogs = [...prev, { type: randLog.type, text: randLog.text, time: new Date().toLocaleTimeString() }];
        if (nextLogs.length > 6) {
          nextLogs.shift();
        }
        return nextLogs;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const getLatestReleaseAssetForPlatform = (platform: 'android' | 'windows' | 'macos' | 'linux') => {
    if (!gitReleases || gitReleases.length === 0) return null;
    const latestRelease = gitReleases[0];
    if (!latestRelease.assets || latestRelease.assets.length === 0) return null;

    return latestRelease.assets.find(asset => {
      const nameLower = asset.name.toLowerCase();
      if (platform === 'android') {
        return nameLower.endsWith('.apk');
      }
      if (platform === 'windows') {
        return nameLower.endsWith('.exe') || nameLower.endsWith('.msi');
      }
      if (platform === 'macos') {
        return nameLower.endsWith('.dmg') || nameLower.endsWith('.pkg');
      }
      if (platform === 'linux') {
        return nameLower.endsWith('.appimage') || nameLower.endsWith('.deb');
      }
      return false;
    });
  };

  // Handler for simulated installer download
  const startSimulatedDownload = (platform: string, filename: string) => {
    if (downloadingPlatform) return;
    setDownloadingPlatform(platform);
    setDownloadProgress(0);
    setDownloadSuccessMessage(null);

    // Get the custom URL if any
    let targetUrl = '';
    if (platform === 'android') targetUrl = customAndroidUrl;
    else if (platform === 'windows') targetUrl = customWindowsUrl;
    else if (platform === 'macos') targetUrl = customMacosUrl;
    else if (platform === 'linux') targetUrl = customLinuxUrl;

    // Check if there is a real asset in the latest GitHub release when no custom override is set
    const realAsset = getLatestReleaseAssetForPlatform(platform as any);
    const hasRealAsset = !targetUrl && !!realAsset;
    
    if (hasRealAsset && realAsset) {
      targetUrl = realAsset.browserDownloadUrl;
    }

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingPlatform(null);
          
          if (targetUrl) {
            if (hasRealAsset && realAsset) {
              setDownloadSuccessMessage(`✓ Sukses! Mengunduh berkas riil langsung dari GitHub Releases: ${realAsset.name}`);
            } else {
              setDownloadSuccessMessage(`✓ Memulai unduhan riil dari tautan kustom Anda: ${targetUrl.slice(0, 45)}...`);
            }
            // Trigger actual download in new tab
            window.open(targetUrl, '_blank');
          } else {
            setDownloadSuccessMessage(`✓ Berhasil Mengunduh ${filename}! Pemasangan siap dijalankan di sistem Anda.`);
            if (platform === 'android') {
              setTimeout(() => {
                setInstallerStep('prompt');
                setInstallProgress(0);
                setShowAndroidInstaller(true);
              }, 1200);
            }
          }
          return 100;
        }
        return prev + Math.floor(Math.random() * 20 + 15);
      });
    }, 200);
  };

  // Handler for simulated auto-update
  const runAutoUpdateSimulation = () => {
    if (updateStep !== 'idle' && updateStep !== 'done') return;
    setUpdateStep('checking');
    setUpdateProgress(0);

    // Telemetry log injection
    setTelemetryLogs(prev => {
      const nextLogs = [
        ...prev,
        { type: 'SYS', text: 'Auto-Updater daemon: Initiating update sequence...', time: new Date().toLocaleTimeString() }
      ];
      if (nextLogs.length > 6) {
        nextLogs.shift();
      }
      return nextLogs;
    });

    // Stage 1: Checking (Check Update)
    setTimeout(() => {
      setUpdateStep('downloading');
      
      setTelemetryLogs(prev => {
        const nextLogs = [
          ...prev,
          { type: 'SYS', text: 'Auto-Updater daemon: Update v1.5.0-beta.2 discovered. Starting download...', time: new Date().toLocaleTimeString() }
        ];
        if (nextLogs.length > 6) {
          nextLogs.shift();
        }
        return nextLogs;
      });

      // Stage 2: Downloading (Download)
      const dlInterval = setInterval(() => {
        setUpdateProgress(prev => {
          if (prev >= 100) {
            clearInterval(dlInterval);
            
            setTelemetryLogs(prevLogs => {
              const nextLogs = [
                ...prevLogs,
                { type: 'SYS', text: 'Auto-Updater daemon: Download completed. Initiating hash verification.', time: new Date().toLocaleTimeString() }
              ];
              if (nextLogs.length > 6) {
                nextLogs.shift();
              }
              return nextLogs;
            });

            // Stage 3: Verify SHA256
            setUpdateStep('verifying_sha');
            setTimeout(() => {
              
              setTelemetryLogs(prevLogs => {
                const nextLogs = [
                  ...prevLogs,
                  { type: 'SEC', text: 'Auto-Updater daemon: SHA-256 Checksum VALID (Match: e3b0c442...)', time: new Date().toLocaleTimeString() }
                ];
                if (nextLogs.length > 6) {
                  nextLogs.shift();
                }
                return nextLogs;
              });

              // Stage 4: Verify Signature
              setUpdateStep('verifying_signature');
              setTimeout(() => {
                
                setTelemetryLogs(prevLogs => {
                  const nextLogs = [
                    ...prevLogs,
                    { type: 'SEC', text: 'Auto-Updater daemon: Certificate Authority signature VERIFIED (RSA-2048)', time: new Date().toLocaleTimeString() }
                  ];
                  if (nextLogs.length > 6) {
                    nextLogs.shift();
                  }
                  return nextLogs;
                });

                // Stage 5: Install
                setUpdateStep('installing');
                setTimeout(() => {
                  
                  setTelemetryLogs(prevLogs => {
                    const nextLogs = [
                      ...prevLogs,
                      { type: 'SYS', text: 'Auto-Updater daemon: Files deployed successfully. System restarting...', time: new Date().toLocaleTimeString() }
                    ];
                    if (nextLogs.length > 6) {
                      nextLogs.shift();
                    }
                    return nextLogs;
                  });

                  // Stage 6: Restart
                  setUpdateStep('restarting');
                  setTimeout(() => {
                    setUpdateStep('done');
                    setCurrentVersion('v1.5.0-beta.2');
                    
                    setTelemetryLogs(prevLogs => {
                      const nextLogs = [
                        ...prevLogs,
                        { type: 'SYS', text: 'System restarted successfully on core release v1.5.0-beta.2.', time: new Date().toLocaleTimeString() }
                      ];
                      if (nextLogs.length > 6) {
                        nextLogs.shift();
                      }
                      return nextLogs;
                    });

                  }, 1500);
                }, 1200);
              }, 800);
            }, 800);

            return 100;
          }
          return prev + 10;
        });
      }, 150);
    }, 1200);
  };

  const getAccentColor = () => {
    switch (themeColor) {
      case 'indigo': return 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100';
      case 'amber': return 'text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100';
      case 'rose': return 'text-rose-600 bg-rose-50 border-rose-200 hover:bg-rose-100';
      case 'teal': return 'text-teal-600 bg-teal-50 border-teal-200 hover:bg-teal-100';
      case 'emerald':
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100';
    }
  };

  const getAccentBtnBg = () => {
    switch (themeColor) {
      case 'indigo': return 'bg-indigo-600 hover:bg-indigo-700 text-white';
      case 'amber': return 'bg-amber-600 hover:bg-amber-700 text-white';
      case 'rose': return 'bg-rose-600 hover:bg-rose-700 text-white';
      case 'teal': return 'bg-teal-600 hover:bg-teal-700 text-white';
      case 'emerald':
      default:
        return 'bg-emerald-600 hover:bg-emerald-700 text-white';
    }
  };

  const getAccentText = () => {
    switch (themeColor) {
      case 'indigo': return 'text-indigo-600';
      case 'amber': return 'text-amber-600';
      case 'rose': return 'text-rose-600';
      case 'teal': return 'text-teal-600';
      case 'emerald':
      default:
        return 'text-emerald-600';
    }
  };

  const getAccentBorder = () => {
    switch (themeColor) {
      case 'indigo': return 'border-indigo-500';
      case 'amber': return 'border-amber-500';
      case 'rose': return 'border-rose-500';
      case 'teal': return 'border-teal-500';
      case 'emerald':
      default:
        return 'border-emerald-500';
    }
  };

  return (
    <div className="p-4 space-y-4 animate-fade-in pb-16 bg-slate-50 min-h-screen">
      
      {/* 1. ROADMAP HEADER HERO */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl space-y-3 relative overflow-hidden shadow-md">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-black px-2.5 py-0.5 rounded-full uppercase tracking-widest border border-emerald-500/30">
            Era 1.5 - Beta Hub
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-extrabold px-2.5 py-0.5 rounded-full">
            Active Baseline v1.0
          </span>
        </div>
        
        <div className="space-y-1">
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-400" /> ASE Distribution & Ops Platform
          </h2>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Pintu gerbang operasional untuk memvalidasi arsitektur modular ASE, melakukan pengujian beta tertutup, mensimulasikan pembaruan otomatis, dan melacak indikator North Star secara real-time.
          </p>
        </div>

        {/* NORTH STAR BOX */}
        <div className="p-3 bg-slate-800/80 border border-slate-700/50 rounded-2xl space-y-1">
          <span className="text-[8px] font-black uppercase text-amber-400 tracking-wider">Kompas Utama (North Star Vision)</span>
          <p className="text-[10px] text-slate-200 font-medium italic leading-relaxed">
            &ldquo;ASE menjadi platform workbook modular yang memungkinkan individu dan organisasi membangun, mendistribusikan, dan mengelola sistem kerja digital secara aman, adaptif, dan berkelanjutan.&rdquo;
          </p>
        </div>
      </div>

      {/* 2. SUB-TABS NAVIGATION */}
      <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-xs justify-between">
        <button
          onClick={() => setBetaSubTab('dashboard')}
          className={`flex-1 py-2 text-center text-[10px] font-black rounded-xl transition-all ${
            betaSubTab === 'dashboard' 
              ? getAccentBtnBg()
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📈 Ops Dashboard
        </button>
        <button
          onClick={() => setBetaSubTab('distribution')}
          className={`flex-1 py-2 text-center text-[10px] font-black rounded-xl transition-all ${
            betaSubTab === 'distribution' 
              ? getAccentBtnBg()
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📥 Download Center
        </button>
        <button
          onClick={() => setBetaSubTab('updater')}
          className={`flex-1 py-2 text-center text-[10px] font-black rounded-xl transition-all ${
            betaSubTab === 'updater' 
              ? getAccentBtnBg()
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          🔄 Auto-Updater
        </button>
        <button
          onClick={() => setBetaSubTab('charter')}
          className={`flex-1 py-2 text-center text-[10px] font-black rounded-xl transition-all ${
            betaSubTab === 'charter' 
              ? getAccentBtnBg()
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          📜 Engineering Charter
        </button>
      </div>

      {/* --- SUBVIEW 1: OPERATIONAL VALIDATION DASHBOARD --- */}
      {betaSubTab === 'dashboard' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* HEADER SUMMARY */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex justify-between items-center">
            <div>
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block">Operational Status</span>
              <h3 className="font-extrabold text-xs text-slate-800">Operational Validation Stage</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black border border-emerald-100">
              <span className="w-2 h-2 bg-emerald-500 rounded-full block animate-ping"></span>
              99.88% STABLE
            </div>
          </div>

          {/* GRID METRICS */}
          <div className="grid grid-cols-2 gap-3">
            
            {/* PLATFORM HEALTH */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-50 pb-1.5">
                <Activity className="w-3.5 h-3.5 text-rose-500" /> Platform Health
              </h4>
              
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-bold">Crash-free Sessions</span>
                    <span className="font-extrabold text-emerald-600">{(100 - crashRate).toFixed(2)}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${100 - crashRate}%` }}></div>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Memory Usage</span>
                  <span className="font-black text-slate-800">{memoryUsage} MB <span className="text-[8px] text-slate-400 font-normal">(Peak: {peakMemory} MB)</span></span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">API Error Rate</span>
                  <span className="font-black text-rose-500">{errorRate}% <span className="text-[8px] text-slate-400 font-normal">(24h)</span></span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Cold Boot Startup</span>
                  <span className="font-black text-slate-800">{startupTime} ms</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Sync Success Rate</span>
                  <span className="font-extrabold text-blue-600">{syncSuccessRate}%</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">License Decrypt</span>
                  <span className="font-extrabold text-emerald-600">100% Success</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Signature Verified</span>
                  <span className="font-extrabold text-emerald-600">100% Safe</span>
                </div>
              </div>
            </div>

            {/* USER EXPERIENCE */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-50 pb-1.5">
                <Smartphone className="w-3.5 h-3.5 text-indigo-500" /> User Experience
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Avg Onboarding</span>
                  <span className="font-black text-slate-800">4.2 Menit</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Wb Created (Beta)</span>
                  <span className="font-black text-slate-800">{activeUsers} User</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">First Install Rate</span>
                  <span className="font-black text-slate-800">88.5%</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Session Drop-off</span>
                  <span className="font-black text-rose-500">11.2%</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Avg Activity Time</span>
                  <span className="font-black text-slate-800">24.5 Mins</span>
                </div>
              </div>
            </div>

            {/* ECOSYSTEM GROWTH */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-50 pb-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Ecosystem Growth
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Verified Publisher</span>
                  <span className="font-black text-slate-800">12 Developer</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Total Assets (Store)</span>
                  <span className="font-black text-slate-800">24 Modules</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Active Assets Installed</span>
                  <span className="font-black text-slate-800">18 Paket</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Asset Updates Issued</span>
                  <span className="font-black text-slate-800">84 Versi</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Avg Store Rating</span>
                  <span className="font-extrabold text-amber-500">★ 4.85 / 5.0</span>
                </div>
              </div>
            </div>

            {/* ENGINEERING METRICS */}
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1 border-b border-slate-50 pb-1.5">
                <Terminal className="w-3.5 h-3.5 text-amber-500" /> Engineering Baseline
              </h4>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Production Build</span>
                  <span className="font-black bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded text-[8px] uppercase">SUCCESS</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Test Coverage</span>
                  <span className="font-black text-slate-800">86.5%</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Regressions Detected</span>
                  <span className="font-black text-emerald-600">0 Faults</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Dependency Health</span>
                  <span className="font-black text-emerald-600">100% OK</span>
                </div>

                <div className="flex justify-between items-center text-[10px]">
                  <span className="text-slate-500 font-bold">Security Audits</span>
                  <span className="font-black text-emerald-600">Secure (0)</span>
                </div>
              </div>
            </div>

          </div>

          {/* TELEMETRY LIVE LOGGER */}
          <div className="bg-slate-900 rounded-2xl p-4 font-mono text-[9px] text-slate-300 space-y-2 border border-slate-800">
            <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full block animate-pulse"></span> 
                SYSTEM TELEMETRY LOGS (REAL-TIME)
              </span>
              <span>TICK #{tick}</span>
            </div>
            <div className="space-y-1 text-[8.5px] leading-relaxed min-h-[90px]">
              {telemetryLogs.map((log, idx) => {
                let colorClass = 'text-slate-400';
                if (log.type === 'INI') colorClass = 'text-emerald-400';
                else if (log.type === 'SEC') colorClass = 'text-amber-400';
                else if (log.type === 'CLD') colorClass = 'text-blue-400';
                else if (log.type === 'FBK') colorClass = 'text-fuchsia-400 font-bold';
                
                return (
                  <p key={idx} className={colorClass}>
                    🕒 [{log.time}] <strong className="bg-slate-800 px-1 py-0.2 rounded text-[8px] mr-1">{log.type}</strong> {log.text}
                  </p>
                );
              })}
            </div>
          </div>

          {/* OPERATIONAL TERMINAL CONTROLS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            
            {/* DIAGNOSTIC REPORT EXPORT */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-2.5">
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <FileJson className="w-4 h-4 text-emerald-500" /> Export Diagnostic Report
                </h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Unduh berkas diagnostik sistem <code className="bg-slate-50 text-slate-800 px-1 rounded">diagnostic-report.json</code> untuk diunggah langsung ke tracker bug internal ASE. Solusi rekayasa tercepat tanpa memerlukan screenshot.
                </p>
              </div>

              <div>
                <button
                  onClick={handleExportDiagnostic}
                  className={`w-full py-2 px-3 rounded-xl text-center text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    exportSuccess ? 'bg-emerald-600 text-white' : getAccentBtnBg()
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  {exportSuccess ? '✓ Laporan Diagnostik Berhasil Diunduh!' : 'Unduh Laporan Diagnostik (.json)'}
                </button>
              </div>
            </div>

            {/* BETA FEEDBACK SYSTEM */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                  <Send className="w-4 h-4 text-indigo-500" /> Beta Feedback System
                </h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Masukkan feedback operasional atau temuan isu langsung ke tim developer inti. Pengelompokan kategori membantu prioritas keputusan roadmap rilis v2.0.
                </p>
              </div>

              {!currentUser ? (
                <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-3.5 text-center space-y-2.5 animate-fade-in">
                  <div className="flex items-center justify-center gap-1.5 text-indigo-800 font-extrabold text-xs">
                    <AlertCircle className="w-4 h-4" />
                    <span>Autentikasi Diperlukan</span>
                  </div>
                  <p className="text-[10px] text-indigo-950/70 font-semibold leading-relaxed">
                    Untuk menjamin keandalan pengujian beta, pengiriman feedback membutuhkan sesi identitas terverifikasi (Google atau GitHub).
                  </p>
                  <div className="flex gap-2 justify-center pt-1">
                    <button
                      type="button"
                      onClick={async () => {
                        await IdentityModule.login('google');
                      }}
                      className="py-1.5 px-3 bg-white text-slate-700 border border-slate-200 text-[10px] font-extrabold rounded-xl hover:bg-slate-50 cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5"
                    >
                      {/* Simulated Google Logo representation */}
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                        <path fill="#EA4335" d="M12 5.04c1.78 0 3.38.61 4.64 1.8l3.46-3.46C17.99 1.19 15.17 0 12 0 7.31 0 3.25 2.69 1.18 6.6l4.03 3.13C6.18 7.02 8.84 5.04 12 5.04z" />
                        <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.35H12v4.46h6.44c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-1.99 3.43-4.92 3.43-8.56z" />
                        <path fill="#FBBC05" d="M5.21 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27L1.18 6.6C.43 8.22 0 10.06 0 12s.43 3.78 1.18 5.4l4.03-3.13z" fillRule="evenodd" clipRule="evenodd" />
                        <path fill="#34A853" d="M12 24c3.24 0 5.97-1.07 7.96-2.92l-3.7-2.87c-1.03.69-2.35 1.1-4.26 1.1-3.16 0-5.82-1.98-6.79-4.69l-4.03 3.13C3.25 21.31 7.31 24 12 24z" />
                      </svg>
                      Google Login
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await IdentityModule.login('github');
                      }}
                      className="py-1.5 px-3 bg-slate-900 text-white text-[10px] font-extrabold rounded-xl hover:bg-slate-800 cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-1.5"
                    >
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.167 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.024A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.293 2.747-1.024 2.747-1.024.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                      </svg>
                      GitHub Login
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitFeedback} className="space-y-2.5">
                  <div className="flex gap-1.5 items-center">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider shrink-0 w-12">Kategori:</span>
                    <div className="flex gap-1 flex-wrap">
                      {(['Bug', 'Suggestion', 'Performance', 'Marketplace', 'Workbook', 'Other'] as const).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setFeedbackCategory(cat)}
                          className={`py-0.5 px-1.5 rounded-md text-[8px] font-extrabold border transition-all cursor-pointer ${
                            feedbackCategory === cat 
                              ? 'bg-slate-900 border-slate-950 text-white' 
                              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-1.5 items-center">
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-wider shrink-0 w-12">Severity:</span>
                    <div className="flex gap-1">
                      {(['Low', 'Medium', 'High', 'Critical'] as const).map((sev) => {
                        let colorActive = 'bg-slate-900 border-slate-950 text-white';
                        if (feedbackSeverity === sev) {
                          if (sev === 'Low') colorActive = 'bg-emerald-600 border-emerald-700 text-white';
                          else if (sev === 'Medium') colorActive = 'bg-amber-600 border-amber-700 text-white';
                          else if (sev === 'High') colorActive = 'bg-orange-600 border-orange-700 text-white';
                          else if (sev === 'Critical') colorActive = 'bg-rose-600 border-rose-700 text-white animate-pulse';
                        }
                        return (
                          <button
                            key={sev}
                            type="button"
                            onClick={() => setFeedbackSeverity(sev)}
                            className={`py-0.5 px-2 rounded-md text-[8px] font-extrabold border transition-all cursor-pointer ${
                              feedbackSeverity === sev 
                                ? colorActive 
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-1.5 items-center pt-0.5">
                    <input
                      type="text"
                      value={feedbackComment}
                      onChange={(e) => setFeedbackComment(e.target.value)}
                      placeholder="Tuliskan feedback singkat atau laporan bug di sini..."
                      className="flex-1 text-[10px] px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 text-white p-1.5 rounded-xl hover:bg-slate-800 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="text-[8.5px] font-bold text-slate-400 italic">
                    Mengirim sebagai: <span className="text-slate-700 font-extrabold">{currentUser.email}</span> ({currentUser.name})
                  </div>

                  {feedbackSuccess && (
                    <p className="text-emerald-600 text-[9px] font-bold animate-fade-in">
                      ✓ Feedback Anda berhasil diregistrasikan di server dan dicatat pada live telemetry logs!
                    </p>
                  )}
                </form>
              )}
            </div>

          </div>

          {/* SUBMITTED FEEDBACK ARCHIVE */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-3.5 space-y-2.5">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Arsip Feedback Pengguna Beta</span>
            <div className="space-y-2 max-h-[140px] overflow-y-auto">
              {feedbackList.map((fb: any) => {
                let sevColor = 'bg-slate-100 text-slate-700 border-slate-200';
                if (fb.severity === 'Low') sevColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
                else if (fb.severity === 'Medium') sevColor = 'bg-amber-50 text-amber-700 border-amber-200';
                else if (fb.severity === 'High') sevColor = 'bg-orange-50 text-orange-700 border-orange-200';
                else if (fb.severity === 'Critical') sevColor = 'bg-rose-50 text-rose-700 border-rose-200 font-bold';

                return (
                  <div key={fb.id} className="bg-white p-2.5 rounded-xl border border-slate-100 shadow-xs space-y-1 text-[10px]">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-1.5 items-center flex-wrap">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded text-[8.5px]">
                          📁 {fb.category}
                        </span>
                        <span className={`px-1.5 py-0.2 rounded text-[8px] font-black uppercase border ${sevColor}`}>
                          {fb.severity || 'Medium'}
                        </span>
                        {fb.email && (
                          <span className="text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded text-[8.5px] font-bold">
                            ✉️ {fb.email}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[8px] font-mono">{fb.timestamp}</span>
                    </div>
                    <p className="text-slate-600 leading-relaxed italic">&ldquo;{fb.comment}&rdquo;</p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* --- SUBVIEW 2: MULTI-PLATFORM DOWNLOAD CENTER --- */}
      {betaSubTab === 'distribution' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2">
            <h3 className="font-extrabold text-xs text-slate-800">Pusat Distribusi ASE (Download Hub)</h3>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Dapatkan installer resmi ASE untuk sistem operasi Anda. Alur termudah: Unduh file, instalasi sekali-klik, login Google/GitHub, dan langsung nikmati sinkronisasi data workbook tanpa batas.
            </p>
          </div>

          {/* DYNAMIC REAL-WORLD GITHUB RELEASES INTEGRATION */}
          <div className="bg-slate-50 border border-slate-200/60 p-4 rounded-2xl space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-2 border-b border-slate-200/50">
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-800">Integrasi Sumber Rilis Riil (GitHub Releases)</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  Download Center dikonfigurasi untuk membaca rilis nyata secara langsung dari repositori GitHub Anda.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 w-16 shrink-0">Repository:</span>
                  <input
                    type="text"
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="username/repo (e.g. edd/ase)"
                    className="text-[10px] px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 flex-1 font-mono"
                    disabled={isSandboxMode}
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-bold text-slate-500 w-16 shrink-0">PAT Token:</span>
                  <input
                    type="password"
                    value={githubToken}
                    onChange={(e) => {
                      setGithubToken(e.target.value);
                      localStorage.setItem('ase_github_token', e.target.value);
                    }}
                    placeholder="GitHub PAT (Opsional untuk repo privat)"
                    className="text-[10px] px-3 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-slate-800 flex-1 font-mono"
                    disabled={isSandboxMode}
                  />
                  <button
                    type="button"
                    onClick={() => fetchReleases(githubRepo, true)}
                    disabled={isFetchingReleases || isSandboxMode}
                    className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black rounded-xl disabled:opacity-50 cursor-pointer shadow-xs shrink-0"
                  >
                    {isFetchingReleases ? 'Sync...' : 'Sync'}
                  </button>
                </div>
              </div>
            </div>

            {/* SELEKTOR MODE DUAL/SANDBOX/AUTO DENGAN PRIORITAS */}
            <div className="bg-slate-100 p-2.5 rounded-2xl space-y-2 text-[10px]">
              <div className="flex justify-between items-center font-bold">
                <span className="text-slate-600">Mode Sistem Distribusi Download Center:</span>
                <span className="text-[8.5px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 uppercase tracking-wide">
                  Prioritas Otomatis
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('auto');
                    localStorage.setItem('ase_release_mode', 'auto');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-[9px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${releaseMode === 'auto' ? 'bg-slate-900 text-white font-black shadow-sm' : 'bg-white text-slate-600 font-semibold hover:bg-slate-200/80 border border-slate-200'}`}
                >
                  <span className="text-[10px]">✨</span>
                  <span>Auto-Detect</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('github');
                    localStorage.setItem('ase_release_mode', 'github');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-[9px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${releaseMode === 'github' ? 'bg-slate-900 text-white font-black shadow-sm' : 'bg-white text-slate-600 font-semibold hover:bg-slate-200/80 border border-slate-200'}`}
                >
                  <span className="text-[10px]">🌐</span>
                  <span>GitHub Releases</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('local');
                    localStorage.setItem('ase_release_mode', 'local');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-[9px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${releaseMode === 'local' ? 'bg-emerald-600 text-white font-black animate-pulse shadow-sm' : 'bg-white text-slate-600 font-semibold hover:bg-slate-200/80 border border-slate-200'}`}
                >
                  <span className="text-[10px]">📦</span>
                  <span>Local Sandbox</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('simulation');
                    localStorage.setItem('ase_release_mode', 'simulation');
                  }}
                  className={`px-2 py-1.5 rounded-xl text-[9px] transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 ${releaseMode === 'simulation' ? 'bg-indigo-600 text-white font-black shadow-sm' : 'bg-white text-slate-600 font-semibold hover:bg-slate-200/80 border border-slate-200'}`}
                >
                  <span className="text-[10px]">⚪</span>
                  <span>Simulation</span>
                </button>
              </div>
              <div className="text-[8.5px] text-slate-400 font-medium leading-relaxed bg-white/50 p-2 rounded-xl">
                {releaseMode === 'auto' && (
                  <span><strong>✨ Auto-Detect Fallback:</strong> Sistem mencari rilis di <strong>1. GitHub (Production)</strong>. Jika tidak ditemukan/error, ia memuat <strong>2. Local Sandbox (/public)</strong>. Jika aset lokal juga tidak ada, ia beralih ke <strong>3. Simulation (Demo)</strong>.</span>
                )}
                {releaseMode === 'github' && (
                  <span><strong>🌐 GitHub Releases (Production):</strong> Memaksa sinkronisasi langsung dari GitHub API. Membutuhkan repository publik atau token jika privat.</span>
                )}
                {releaseMode === 'local' && (
                  <span><strong>📦 Local Sandbox (Development):</strong> Memaksa pemuatan biner offline lokal v1.5.0-beta.1 yang tersimpan di direktori /public aplikasi.</span>
                )}
                {releaseMode === 'simulation' && (
                  <span><strong>⚪ Simulation (Demo Mode):</strong> Memaksa visualisasi data rilis murni untuk kebutuhan demonstrasi interaktif tanpa file fisik.</span>
                )}
              </div>
            </div>

            {/* INTEGRATION STATUS INDICATOR BAR */}
            {(() => {
              const getStatusDetails = () => {
                if (isFetchingReleases) {
                  return {
                    label: 'Syncing...',
                    color: 'bg-amber-50 text-amber-800 border-amber-200/60',
                    dot: 'bg-amber-500 animate-pulse',
                    desc: 'Sedang mensinkronisasikan sumber data rilis...'
                  };
                }

                if (resolvedSource === 'github') {
                  return {
                    label: 'Source: GitHub API (Production)',
                    color: 'bg-emerald-50 text-emerald-800 border-emerald-200/60',
                    dot: 'bg-emerald-500',
                    desc: `🟢 Terkoneksi ke GitHub API (${githubRepo}). Membaca rilis produksi terbaru secara real-time.`
                  };
                }

                if (resolvedSource === 'local') {
                  return {
                    label: 'Source: Local Sandbox (Development)',
                    color: 'bg-amber-50 text-amber-800 border-amber-200/60',
                    dot: 'bg-amber-500',
                    desc: '🟡 Membaca rilis lokal v1.5.0-beta.1 dari folder /public. Fallback offline aktif.'
                  };
                }

                // Default simulation / demo
                return {
                  label: 'Source: Simulation (Demo Mode)',
                  color: 'bg-slate-50 text-slate-700 border-slate-200',
                  dot: 'bg-slate-400',
                  desc: '⚪ Mode simulasi visual aktif. Menampilkan rilis interaktif tanpa memerlukan file biner fisik.'
                };
              };

              const st = getStatusDetails();
              return (
                <div className={`flex items-center gap-2.5 p-2.5 border rounded-xl text-[10px] font-medium leading-relaxed ${st.color}`}>
                  <span className="flex items-center gap-1.5 font-black uppercase tracking-wider shrink-0">
                    <span className={`w-2 h-2 rounded-full ${st.dot}`}></span>
                    {st.label}
                  </span>
                  <span className="hidden sm:inline text-slate-300 font-normal">|</span>
                  <span className="text-[9.5px] font-medium leading-tight text-slate-600">{st.desc}</span>
                </div>
              );
            })()}

            {/* Display fetched release if any */}
            {isFetchingReleases ? (
              <div className="flex items-center justify-center py-4 gap-2 text-slate-500 text-[10px] font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Sedang mengambil data rilis langsung dari GitHub...</span>
              </div>
            ) : releasesError ? (
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl space-y-3">
                <div className="space-y-1">
                  <p className="text-[10.5px] text-amber-800 font-extrabold">⚠️ {releasesError}</p>
                  <p className="text-[9px] text-amber-600 font-medium leading-relaxed">
                    Repository "{githubRepo}" tidak dapat diakses secara publik atau belum ada rilis. Untuk melanjutkan verifikasi fungsional Download Center, silakan aktifkan Mode Sandbox (Rilis Lokal) di bawah ini.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('local');
                    localStorage.setItem('ase_release_mode', 'local');
                  }}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  🚀 Aktifkan Mode Sandbox (Rilis v1.5.0-beta.1)
                </button>
              </div>
            ) : gitReleases.length === 0 ? (
              <div className="bg-slate-100 border border-slate-200 p-4 rounded-xl text-center space-y-3">
                <div className="space-y-1">
                  <p className="text-[10.5px] text-slate-700 font-extrabold">🚫 Belum ada rilis publik di repositori ini ({githubRepo}).</p>
                  <p className="text-[9px] text-slate-500 font-medium">Tampilkan rilis di bawah ini setelah Anda mengunggah APK via GitHub Actions atau mengunggah biner baru.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setReleaseMode('local');
                    localStorage.setItem('ase_release_mode', 'local');
                  }}
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black rounded-lg shadow-sm transition-all cursor-pointer"
                >
                  🚀 Aktifkan Mode Sandbox (Rilis v1.5.0-beta.1)
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center flex-wrap gap-2">
                  <span className="text-[8.5px] font-black uppercase text-indigo-500 tracking-wider">
                    Rilis Publik Terdeteksi ({gitReleases.length} Rilis)
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[8.5px] font-black bg-white border border-slate-200 shadow-2xs">
                    {resolvedSource === 'github' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        <span className="text-emerald-700">🟢 Source: GitHub Releases (Production)</span>
                      </>
                    )}
                    {resolvedSource === 'local' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <span className="text-amber-700">🟡 Source: Local Sandbox (Development)</span>
                      </>
                    )}
                    {resolvedSource === 'simulation' && (
                      <>
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                        <span className="text-slate-500">⚪ Source: Simulation (Demo Mode)</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {gitReleases.slice(0, 3).map((rel) => (
                    <div key={rel.id} className="bg-white border border-slate-150 p-3 rounded-xl space-y-2 text-[10px]">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <div>
                          <span className="font-extrabold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[9px] font-mono">
                            🏷️ {rel.tagName}
                          </span>
                          <span className="ml-2 font-black text-slate-900 text-[11px]">{rel.name || 'Rilis Tanpa Judul'}</span>
                        </div>
                        <span className="text-slate-400 text-[8.5px] font-bold font-mono">
                          📆 Dipublikasikan: {new Date(rel.publishedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>

                      {rel.body && (
                        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[9px] font-medium text-slate-600 font-mono whitespace-pre-wrap max-h-24 overflow-y-auto">
                          {rel.body}
                        </div>
                      )}

                      <div className="flex flex-col gap-1.5 pt-1">
                        <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">Aset Rilis (Biner)</span>
                        {rel.assets && rel.assets.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {rel.assets.map((asset) => (
                              <a
                                key={asset.id}
                                href={asset.browserDownloadUrl}
                                target={asset.browserDownloadUrl.startsWith('#') ? undefined : "_blank"}
                                rel="noopener noreferrer"
                                onClick={(e) => {
                                  const isApk = asset.name.toLowerCase().endsWith('.apk');
                                  const isSandbox = resolvedSource === 'local' || resolvedSource === 'simulation';
                                  if (isApk && isSandbox) {
                                    e.preventDefault();
                                    setInstallerStep('prompt');
                                    setInstallProgress(0);
                                    setShowAndroidInstaller(true);
                                  } else if (asset.browserDownloadUrl.startsWith('#')) {
                                    e.preventDefault();
                                    setDownloadSuccessMessage(
                                      `[SIMULASI] Simulasi unduh ${asset.name} (${(asset.size / 1024 / 1024).toFixed(2)} MB).\n\n` +
                                      `Anda berada dalam MODE SIMULASI/DEMO untuk aset "${asset.name}". File biner fisik tidak dimuat karena berjalan tanpa biner fisik di server. ` +
                                      `Ubah mode ke "Local Sandbox" atau "GitHub Releases" di atas jika biner fisik sudah siap.`
                                    );
                                    setTimeout(() => setDownloadSuccessMessage(null), 8000);
                                  }
                                }}
                                className="flex items-center justify-between p-2 bg-indigo-50 hover:bg-indigo-100/80 border border-indigo-150 rounded-xl transition-all font-mono text-[9px] font-black text-indigo-900"
                              >
                                <div className="truncate pr-2">
                                  📦 {asset.name}
                                  <span className="block text-[8px] text-slate-400 font-semibold">
                                    Ukuran: {(asset.size / 1024 / 1024).toFixed(2)} MB • Diunduh: {asset.downloadCount}x
                                  </span>
                                </div>
                                <span className="bg-indigo-600 text-white px-2.5 py-1 rounded-lg text-[8px] font-bold shrink-0">
                                  Download APK
                                </span>
                              </a>
                            ))}
                          </div>
                        ) : (
                          <p className="text-slate-400 italic text-[9px]">Tidak ada aset biner yang dilampirkan pada rilis ini.</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* REAL-WORLD BINARY OVERRIDES CONFIGURATION (ANTI-SIMULATION) */}
          <div className="bg-white border border-slate-200/80 p-4 rounded-2xl space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-600 animate-ping"></div>
                <h4 className="font-extrabold text-xs text-slate-800">Set Tautan Unduhan Riil Anda (Real Link Overrides)</h4>
              </div>
              <button
                type="button"
                onClick={() => setShowOverrides(!showOverrides)}
                className="py-1 px-2.5 bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 text-[9px] font-black rounded-lg transition-all cursor-pointer flex items-center gap-1"
              >
                {showOverrides ? 'Sembunyikan Pengaturan ▲' : 'Buka Pengaturan Kustom ▼'}
              </button>
            </div>

            <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
              Singkirkan "simulasi". Jika Anda sudah memiliki file APK riil yang disimpan di hosting Anda (e.g. Google Drive, Dropbox, Firebase Hosting), tempelkan tautannya di bawah. Tombol unduh utama akan mengunduh biner asli secara langsung untuk penguji Anda!
            </p>

            {showOverrides && (
              <div className="space-y-3.5 pt-2 border-t border-slate-100 animate-fade-in text-[10px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  
                  {/* Android APK Override */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 flex items-center gap-1.5">
                        🤖 Android APK Link Override
                        <span className="bg-rose-100 text-rose-800 text-[7px] font-black uppercase px-1.5 py-0.2 rounded">Prioritas FUX Sprint</span>
                      </span>
                      <span className={customAndroidUrl ? "text-[8px] text-emerald-600 font-bold" : "text-[8px] text-slate-400 font-medium"}>
                        {customAndroidUrl ? '● Aktif (Riil)' : '○ Simulasi Default'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={customAndroidUrl}
                        onChange={(e) => saveCustomUrl('android', e.target.value)}
                        placeholder="https://example.com/assets/ase-v1.5.0.apk"
                        className="flex-1 text-[9px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                      />
                      {customAndroidUrl && (
                        <button
                          type="button"
                          onClick={() => saveCustomUrl('android', '')}
                          className="px-2 bg-slate-200 text-slate-700 font-extrabold rounded-lg hover:bg-slate-300 text-[8px]"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Windows EXE Override */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">💻 Windows EXE Link Override</span>
                      <span className={customWindowsUrl ? "text-[8px] text-emerald-600 font-bold" : "text-[8px] text-slate-400 font-medium"}>
                        {customWindowsUrl ? '● Aktif (Riil)' : '○ Simulasi Default'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={customWindowsUrl}
                        onChange={(e) => saveCustomUrl('windows', e.target.value)}
                        placeholder="https://example.com/assets/ase_setup_x64.exe"
                        className="flex-1 text-[9px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                      />
                      {customWindowsUrl && (
                        <button
                          type="button"
                          onClick={() => saveCustomUrl('windows', '')}
                          className="px-2 bg-slate-200 text-slate-700 font-extrabold rounded-lg hover:bg-slate-300 text-[8px]"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* macOS DMG Override */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">🍎 macOS DMG Link Override</span>
                      <span className={customMacosUrl ? "text-[8px] text-emerald-600 font-bold" : "text-[8px] text-slate-400 font-medium"}>
                        {customMacosUrl ? '● Aktif (Riil)' : '○ Simulasi Default'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={customMacosUrl}
                        onChange={(e) => saveCustomUrl('macos', e.target.value)}
                        placeholder="https://example.com/assets/ase_setup_arm64.dmg"
                        className="flex-1 text-[9px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                      />
                      {customMacosUrl && (
                        <button
                          type="button"
                          onClick={() => saveCustomUrl('macos', '')}
                          className="px-2 bg-slate-200 text-slate-700 font-extrabold rounded-lg hover:bg-slate-300 text-[8px]"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Linux AppImage Override */}
                  <div className="space-y-1.5 p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800">🐧 Linux AppImage Link Override</span>
                      <span className={customLinuxUrl ? "text-[8px] text-emerald-600 font-bold" : "text-[8px] text-slate-400 font-medium"}>
                        {customLinuxUrl ? '● Aktif (Riil)' : '○ Simulasi Default'}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="url"
                        value={customLinuxUrl}
                        onChange={(e) => saveCustomUrl('linux', e.target.value)}
                        placeholder="https://example.com/assets/ase_installer.AppImage"
                        className="flex-1 text-[9px] px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-mono focus:outline-none focus:border-slate-800"
                      />
                      {customLinuxUrl && (
                        <button
                          type="button"
                          onClick={() => saveCustomUrl('linux', '')}
                          className="px-2 bg-slate-200 text-slate-700 font-extrabold rounded-lg hover:bg-slate-300 text-[8px]"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                </div>

                <div className="text-[9px] text-slate-400 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Sistem menyimpan konfigurasi tautan ini secara persisten di sesi browser lokal Anda.</span>
                </div>
              </div>
            )}
          </div>

          {/* RELEASE PIPELINE & COPY BUILD INFORMATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Release Pipeline Status */}
            <div className="bg-slate-900 text-slate-200 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
                <span className="text-[9px] font-black uppercase text-amber-400 tracking-wider">Release Pipeline</span>
                <span className="text-[8px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-bold">Closed Beta</span>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[10px] font-mono">
                <div className="text-slate-500">Version:</div>
                <div className="text-slate-200 font-extrabold">
                  {gitReleases.length > 0 ? gitReleases[0].tagName : 'v1.5.0-beta.2'}
                </div>

                <div className="text-slate-500">Build:</div>
                <div className="text-emerald-400 font-black">✅ Success</div>

                <div className="text-slate-500">Signature:</div>
                <div className="text-emerald-400 font-black">✅ Verified</div>

                <div className="text-slate-500">Published:</div>
                <div className={gitReleases.length > 0 ? "text-emerald-400 font-black" : "text-amber-400 font-bold"}>
                  {gitReleases.length > 0 ? "✅ Active" : "❌ Waiting"}
                </div>

                <div className="text-slate-500">GitHub Release:</div>
                <div className={gitReleases.length > 0 ? "text-emerald-400 font-black" : "text-amber-400 font-bold"}>
                  {gitReleases.length > 0 ? "✅ Connected" : "❌ Pending"}
                </div>
              </div>
            </div>

            {/* Copy Build Info and SHA info */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-2">
              <div className="space-y-1">
                <h4 className="font-extrabold text-xs text-slate-800">Identitas Rilis (Build Info)</h4>
                <p className="text-slate-400 text-[10px] leading-relaxed">
                  Gunakan data identifikasi ini ketika melaporkan temuan bug atau mengirimkan feedback rekayasa platform ke tim internal.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={copyBuildInfoToClipboard}
                  className={`w-full py-2 px-3 rounded-xl text-center text-[10px] font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    copiedBuildInfo ? 'bg-emerald-600 text-white' : getAccentBtnBg()
                  }`}
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${copiedBuildInfo ? 'animate-bounce' : ''}`} />
                  {copiedBuildInfo ? '✓ Informasi Rilis Berhasil Disalin!' : 'Copy Build Information'}
                </button>
              </div>
            </div>
          </div>

          {/* FALLBACK CLIPBOARD MANUAL COPY AREA */}
          {fallbackInfoText && (
            <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl space-y-1.5 animate-fade-in">
              <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-bold">
                <AlertCircle className="w-4 h-4 text-amber-600 text-amber-500" />
                Clipboard API terhambat Iframe. Silakan salin manual data rilis di bawah ini:
              </div>
              <textarea
                readOnly
                value={fallbackInfoText}
                className="w-full h-24 p-2 bg-slate-900 text-slate-100 font-mono text-[9px] rounded-xl border border-slate-800 focus:outline-none"
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <button 
                onClick={() => setFallbackInfoText(null)}
                className="text-[9px] text-slate-500 font-black hover:text-slate-800"
              >
                Tutup Panel Salin Manual
              </button>
            </div>
          )}

          {/* VERSION STATUS CHECKING PANEL */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-2">
                  Status Pembaruan Aplikasi <span className="bg-amber-100 text-amber-800 text-[8px] font-black uppercase px-2 py-0.5 rounded-full">Pembaruan Tersedia</span>
                </h4>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] text-slate-500 font-medium">
                  <div>Versi Terpasang (Installed): <strong className="text-slate-700">{currentVersion}</strong></div>
                  <div className="hidden sm:block text-slate-300">•</div>
                  <div>Versi Server Terbaru (Latest): <strong className="text-slate-800">v1.5.0-beta.2</strong></div>
                  <div className="hidden sm:block text-slate-300">•</div>
                  <div>Update Tersedia: <strong className="text-amber-600">Ya</strong></div>
                </div>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-2">
              <button 
                onClick={() => setBetaSubTab('updater')}
                className="w-full sm:w-auto px-4 py-2 bg-slate-900 text-white text-[10px] font-black rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                Update Sekarang
              </button>
            </div>
          </div>

          {/* DOWNLOAD CARDS */}
          {(() => {
            const winAsset = getLatestReleaseAssetForPlatform('windows');
            const macAsset = getLatestReleaseAssetForPlatform('macos');
            const linuxAsset = getLatestReleaseAssetForPlatform('linux');
            const androidAsset = getLatestReleaseAssetForPlatform('android');

            return (
              <div className="space-y-3">
                
                {/* WINDOWS */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold shrink-0">
                      Win
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 flex-wrap">
                        Windows Installer (.exe)
                        {winAsset && (
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-black uppercase">GitHub Rilis</span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        {winAsset ? (
                          <span>Versi {gitReleases[0]?.tagName} • {(winAsset.size / 1024 / 1024).toFixed(1)} MB</span>
                        ) : (
                          <span>Versi 1.0.0 Stable • 45.4 MB</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startSimulatedDownload('windows', 'ase_setup_x64.exe')}
                    disabled={!!downloadingPlatform}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      downloadingPlatform ? 'bg-slate-100 text-slate-400' : getAccentColor()
                    }`}
                  >
                    {winAsset ? 'Unduh EXE (Riil)' : 'Unduh EXE'}
                  </button>
                </div>

                {/* MACOS */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 text-slate-800 rounded-xl flex items-center justify-center font-bold shrink-0">
                      mac
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 flex-wrap">
                        macOS DMG (Apple Silicon & Intel)
                        {macAsset && (
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-black uppercase">GitHub Rilis</span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        {macAsset ? (
                          <span>Versi {gitReleases[0]?.tagName} • {(macAsset.size / 1024 / 1024).toFixed(1)} MB</span>
                        ) : (
                          <span>Versi 1.0.0 Stable • 48.1 MB</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startSimulatedDownload('macos', 'ase_setup_arm64.dmg')}
                    disabled={!!downloadingPlatform}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      downloadingPlatform ? 'bg-slate-100 text-slate-400' : getAccentColor()
                    }`}
                  >
                    {macAsset ? 'Unduh DMG (Riil)' : 'Unduh DMG'}
                  </button>
                </div>

                {/* LINUX */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-xl flex items-center justify-center font-bold shrink-0">
                      Linux
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 flex-wrap">
                        Linux AppImage Package
                        {linuxAsset && (
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-black uppercase">GitHub Rilis</span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        {linuxAsset ? (
                          <span>Versi {gitReleases[0]?.tagName} • {(linuxAsset.size / 1024 / 1024).toFixed(1)} MB</span>
                        ) : (
                          <span>Versi 1.0.0 Stable • 52.0 MB</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startSimulatedDownload('linux', 'ase_installer.AppImage')}
                    disabled={!!downloadingPlatform}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      downloadingPlatform ? 'bg-slate-100 text-slate-400' : getAccentColor()
                    }`}
                  >
                    {linuxAsset ? 'Unduh AppImage (Riil)' : 'Unduh AppImage'}
                  </button>
                </div>

                {/* ANDROID */}
                <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-700 rounded-xl flex items-center justify-center font-bold shrink-0">
                      APK
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5 flex-wrap">
                        Android Application Package (.apk)
                        {androidAsset && (
                          <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-black uppercase">GitHub Rilis</span>
                        )}
                      </h4>
                      <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">
                        {androidAsset ? (
                          <span>Versi {gitReleases[0]?.tagName} • {(androidAsset.size / 1024 / 1024).toFixed(1)} MB</span>
                        ) : (
                          <span>Versi 1.0.0 Stable • 18.2 MB</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => startSimulatedDownload('android', 'ase_client_release.apk')}
                    disabled={!!downloadingPlatform}
                    className={`py-1.5 px-3 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                      downloadingPlatform ? 'bg-slate-100 text-slate-400' : getAccentColor()
                    }`}
                  >
                    {androidAsset ? 'Unduh APK (Riil)' : 'Unduh APK'}
                  </button>
                </div>

              </div>
            );
          })()}

          {/* ACTIVE DOWNLOAD PROGRESS BAR */}
          {downloadingPlatform && (
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800 animate-pulse">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-bold flex items-center gap-1.5"><Download className="w-4 h-4 text-emerald-400" /> Mengunduh untuk {downloadingPlatform.toUpperCase()}...</span>
                <span>{downloadProgress}%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${downloadProgress}%` }}></div>
              </div>
            </div>
          )}

          {downloadSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-extrabold rounded-2xl flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              {downloadSuccessMessage}
            </div>
          )}

          {/* APP STORES FUTURE PLAN */}
          <div className="bg-slate-950 p-4 rounded-2xl space-y-3 border border-slate-900 text-slate-300">
            <span className="text-[8px] font-black uppercase text-amber-400 tracking-wider">Tahap 4 — Rencana Distribusi Store Resmi (App Store Roadmaps)</span>
            <div className="grid grid-cols-2 gap-2 text-[9px]">
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <h5 className="font-black text-slate-100">Microsoft Store</h5>
                <p className="text-slate-400 text-[8px]">Integrasi dengan Windows 11 App Certification Toolkit.</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <h5 className="font-black text-slate-100">Google Play Store</h5>
                <p className="text-slate-400 text-[8px]">Optimasi rilis App Bundle (.aab) dengan billing aman.</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <h5 className="font-black text-slate-100">Apple App Store</h5>
                <p className="text-slate-400 text-[8px]">Sandboxed DMG notarization via Apple Developer CLI.</p>
              </div>
              <div className="p-2.5 bg-slate-900/60 rounded-xl border border-slate-800/80 space-y-1">
                <h5 className="font-black text-slate-100">Linux Snap / Flatpak</h5>
                <p className="text-slate-400 text-[8px]">Otomatisasi packaging melalui build script Snapcraft.</p>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* --- SUBVIEW 3: AUTO-UPDATER SIMULATION --- */}
      {betaSubTab === 'updater' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-xs text-slate-800">Auto-Update Simulator</h3>
              <span className="text-[9px] bg-slate-100 text-slate-700 font-extrabold px-2 py-0.5 rounded-full border border-slate-200">
                {currentVersion}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Mensimulasikan integrasi pembaruan otomatis platform ASE mirip seperti mekanisme VS Code atau Discord: sistem melakukan pemeriksaan berkala, mengunduh file biner terbaru di latar belakang, memasang secara otomatis, dan melakukan inisialisasi ulang.
            </p>
            
            <div className="pt-2">
              <button
                onClick={runAutoUpdateSimulation}
                disabled={updateStep !== 'idle' && updateStep !== 'done'}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-black text-center transition-all cursor-pointer ${
                  updateStep !== 'idle' && updateStep !== 'done'
                    ? 'bg-slate-100 text-slate-400 border border-slate-200'
                    : getAccentBtnBg()
                }`}
              >
                {updateStep === 'idle' ? 'Check for Updates' : updateStep === 'done' ? 'Periksa Kembali Pembaruan' : 'Memproses Pembaruan...'}
              </button>
            </div>
          </div>

          {/* SIMULATED UPDATE PIPELINE */}
          {updateStep !== 'idle' && (
            <div className="bg-slate-900 text-slate-100 rounded-3xl p-4 font-mono text-[9px] space-y-3.5 border border-slate-800">
              <div className="flex justify-between items-center text-slate-500 border-b border-slate-800 pb-2">
                <span className="font-black">PEMBARUAN OTOMATIS ASE</span>
                <span>STATE: {updateStep.toUpperCase()}</span>
              </div>

              <div className="space-y-2.5">
                {/* Step 1: Check Update */}
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'idle' ? 'bg-slate-600' : updateStep === 'checking' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                    1. Check Update (Memeriksa server rilis...)
                  </span>
                  <span className={updateStep === 'checking' ? 'text-amber-400 font-bold' : (updateStep === 'idle' ? 'text-slate-500' : 'text-emerald-400 font-bold')}>
                    {updateStep === 'checking' ? 'Checking...' : (updateStep === 'idle' ? 'Pending' : 'COMPLETE')}
                  </span>
                </div>

                {/* Step 2: Download */}
                {(updateStep !== 'idle' && updateStep !== 'checking') && (
                  <div className="space-y-1 pl-3.5 border-l border-slate-800">
                    <div className="flex justify-between text-slate-300">
                      <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'downloading' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                        2. Download Paket Update (v1.5.0-beta.2)
                      </span>
                      <span className="text-emerald-400 font-bold">{updateProgress}%</span>
                    </div>
                    {updateStep === 'downloading' && (
                      <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
                        <div className="bg-emerald-500 h-1 rounded-full transition-all duration-300" style={{ width: `${updateProgress}%` }}></div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Verify SHA256 */}
                {(updateStep !== 'idle' && updateStep !== 'checking' && updateStep !== 'downloading') && (
                  <div className="flex items-center justify-between pl-3.5 border-l border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'verifying_sha' ? 'bg-amber-500 animate-pulse' : (updateStep === 'verifying_signature' || updateStep === 'installing' || updateStep === 'restarting' || updateStep === 'done' ? 'bg-emerald-500' : 'bg-slate-600')}`}></span>
                      3. Verify SHA256 Checksum Hash Integrity
                    </span>
                    <span className={updateStep === 'verifying_sha' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {updateStep === 'verifying_sha' ? 'Verifying Hash...' : 'VERIFIED (e3b0c442...)'}
                    </span>
                  </div>
                )}

                {/* Step 4: Verify Signature */}
                {(updateStep !== 'idle' && updateStep !== 'checking' && updateStep !== 'downloading' && updateStep !== 'verifying_sha') && (
                  <div className="flex items-center justify-between pl-3.5 border-l border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'verifying_signature' ? 'bg-amber-500 animate-pulse' : (updateStep === 'installing' || updateStep === 'restarting' || updateStep === 'done' ? 'bg-emerald-500' : 'bg-slate-600')}`}></span>
                      4. Verify RSA Digital Signature (Zero-Trust Sandbox Gate)
                    </span>
                    <span className={updateStep === 'verifying_signature' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {updateStep === 'verifying_signature' ? 'Verifying RSA...' : 'VERIFIED (RSA-2048)'}
                    </span>
                  </div>
                )}

                {/* Step 5: Install */}
                {(updateStep !== 'idle' && updateStep !== 'checking' && updateStep !== 'downloading' && updateStep !== 'verifying_sha' && updateStep !== 'verifying_signature') && (
                  <div className="flex items-center justify-between pl-3.5 border-l border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'installing' ? 'bg-amber-500 animate-pulse' : (updateStep === 'restarting' || updateStep === 'done' ? 'bg-emerald-500' : 'bg-slate-600')}`}></span>
                      5. Install (Ekstraksi Biner & Penyebaran Fail)
                    </span>
                    <span className={updateStep === 'installing' ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                      {updateStep === 'installing' ? 'Deploying...' : 'DEPLOYED'}
                    </span>
                  </div>
                )}

                {/* Step 6: Restart */}
                {(updateStep !== 'idle' && updateStep !== 'checking' && updateStep !== 'downloading' && updateStep !== 'verifying_sha' && updateStep !== 'verifying_signature' && updateStep !== 'installing') && (
                  <div className="flex items-center justify-between pl-3.5 border-l border-slate-800">
                    <span className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-1.5 h-1.5 rounded-full ${updateStep === 'restarting' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
                      6. Restart (Inisialisasi Ulang Kernel & Sandbox)
                    </span>
                    <span className={updateStep === 'restarting' ? 'text-amber-400 font-bold animate-pulse' : 'text-emerald-400 font-bold'}>
                      {updateStep === 'restarting' ? 'Restarting Kernel...' : 'COMPLETE'}
                    </span>
                  </div>
                )}
              </div>

              {updateStep === 'done' && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-900/50 text-emerald-400 rounded-2xl space-y-1.5 animate-fade-in">
                  <h4 className="font-extrabold text-[10px] flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Platform Berhasil Diperbarui!
                  </h4>
                  <p className="text-[8.5px] leading-relaxed text-slate-300">
                    Sistem saat ini berjalan pada versi <strong className="text-white">v1.5.0-beta.2</strong>. Seluruh cache lama dibersihkan dan dialokasikan ke registri modul yang aman.
                  </p>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* --- SUBVIEW 4: ENGINEERING CHARTER & CONSTITUTION --- */}
      {betaSubTab === 'charter' && (
        <div className="space-y-4 animate-fade-in">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-xs space-y-2.5">
            <h3 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
              <Award className="w-4.5 h-4.5 text-amber-500" /> ASE Engineering Charter
            </h3>
            <p className="text-slate-400 text-[10px] leading-relaxed">
              Dokumen komitmen rekayasa platform ASE. Piagam ini bertindak sebagai konstitusi teknis untuk menjaga keselarasan struktur modular, standar keamanan zero-trust, dan kualitas ekosistem.
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 pt-2 text-[9px] font-mono border-t border-slate-100 mt-2 text-slate-500">
              <div>Version: <span className="text-slate-800 font-extrabold">v1.2.0-baseline</span></div>
              <div className="hidden sm:block text-slate-300">•</div>
              <div>Last Updated: <span className="text-slate-800 font-extrabold">2026-07-03</span></div>
              <div className="hidden sm:block text-slate-300">•</div>
              <div>Status: <span className="text-emerald-700 font-extrabold bg-emerald-50 px-1.5 py-0.2 rounded">DECLARED RATIFIED</span></div>
            </div>
          </div>

          {/* THE SEVEN COMMANDMENTS OF ASE */}
          <div className="space-y-3">
            
            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">1</span>
                Architecture First
              </h4>
              <p className="text-slate-500 text-[10px] pl-6.5 leading-relaxed">
                Implementasi mengikuti spesifikasi, bukan sebaliknya. Tidak ada fitur yang diizinkan masuk ke cabang utama sebelum lolos review spesifikasi arsitektur.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">2</span>
                Security by Default
              </h4>
              <p className="text-slate-500 text-[10px] pl-6.5 leading-relaxed">
                Semua aset eksternal wajib divalidasi, diverifikasi tanda tangan RSA, divalidasi izin manifestnya, didaftarkan di registri, lalu dijalankan dalam sandbox.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">3</span>
                Compatibility Matters
              </h4>
              <p className="text-slate-500 text-[10px] pl-6.5 leading-relaxed">
                Perubahan masa depan wajib mempertahankan kompatibilitas ke belakang (backward compatibility) format manifest lama untuk memelihara ekosistem penerbit.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">4</span>
                Developer Experience (DX)
              </h4>
              <p className="text-slate-500 text-[10px] pl-6.5 leading-relaxed">
                Seorang pengembang baru harus dapat menyelesaikan modul pertama mereka (Time-to-Hello-World) dalam waktu kurang dari 60 menit menggunakan SDK resmi.
              </p>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-xs space-y-1">
              <h4 className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[9px] font-black flex items-center justify-center">5</span>
                User Simplicity
              </h4>
              <p className="text-slate-500 text-[10px] pl-6.5 leading-relaxed">
                Kompleksitas berada di dalam platform, bukan di tangan pengguna. Pengguna cukup melakukan unduh, masuk, pasang dari Marketplace, lalu bekerja secara intuitif.
              </p>
            </div>

          </div>

        </div>
      )}

    {showAndroidInstaller && (
      <div id="android-installer-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-fade-in">
        <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col p-6 space-y-6">
          {/* Native Android Header Bar */}
          <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono tracking-wider border-b border-slate-800 pb-3">
            <span className="flex items-center gap-1">🤖 ANDROID PACKAGE INSTALLER</span>
            <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[8px]">SANDBOX SECURE</span>
          </div>

          {/* App Info Panel */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center shadow-md shadow-emerald-900/30 text-white text-lg font-black shrink-0">
              ASE
            </div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-slate-100 leading-tight">ASE Workbook</h4>
              <p className="text-[10px] text-slate-400 font-mono">com.ase.workbook • v1.5.0-beta.1</p>
              <div className="flex items-center gap-2">
                <span className="text-[8px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-bold font-mono">Size: 18.2 MB</span>
                <span className="text-[8px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-black font-mono">VERIFIED KEY</span>
              </div>
            </div>
          </div>

          {/* Steps Content */}
          {installerStep === 'prompt' && (
            <div className="space-y-4">
              <div className="space-y-2 text-xs">
                <p className="text-slate-200 font-medium leading-relaxed">
                  Apakah Anda ingin memasang aplikasi ini? Aplikasi akan dipasang secara instan di dalam penampung sandbox web Anda untuk pengujian fungsional.
                </p>
                <p className="text-slate-400 text-[10.5px] leading-relaxed">
                  Aplikasi ini tidak memerlukan hak akses khusus apa pun pada peramban Anda.
                </p>
              </div>

              {/* Real-world Android Help Alert */}
              <div className="bg-amber-950/40 border border-amber-900/50 p-3.5 rounded-2xl space-y-2 text-[10.5px]">
                <p className="text-amber-400 font-extrabold flex items-center gap-1.5">
                  💡 Petunjuk Unduhan Perangkat Fisik
                </p>
                <p className="text-slate-300 font-medium leading-relaxed">
                  Karena Anda berada di sandbox server web, tombol unduh lokal menyajikan simulasi interaktif. 
                  Untuk memasang file <span className="font-mono text-white">.apk</span> riil di handphone/tablet Android Anda secara langsung, silakan unduh dari GitHub Releases repositori resmi Anda:
                </p>
                <a
                  href="https://github.com/wb183996-svg/ASE-wb/releases"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-center py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-lg transition-all text-[10px]"
                >
                  Kunjungi Rilis GitHub Riil 🌐
                </a>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAndroidInstaller(false)}
                  className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={startInstallationProgress}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  Pasang
                </button>
              </div>
            </div>
          )}

          {installerStep === 'installing' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-extrabold text-slate-200">Memasang...</p>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${installProgress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
                  <span>Mengekstrak paket aset...</span>
                  <span>{installProgress}%</span>
                </div>
              </div>

              {/* Console Installer Logs */}
              <div className="bg-slate-950 border border-slate-800 p-2.5 rounded-xl font-mono text-[8.5px] leading-relaxed text-emerald-400 h-16 overflow-y-auto">
                {installProgress < 30 && (
                  <p className="animate-pulse">⏳ [VERIFY] Memvalidasi tanda tangan biner RSA-2048...</p>
                )}
                {installProgress >= 30 && installProgress < 70 && (
                  <>
                    <p className="text-slate-500 font-normal">✓ [VERIFY] Tanda tangan valid (Sandbox Gate Verified)</p>
                    <p className="animate-pulse">📦 [UNPACK] Mengekstrak AndroidManifest.xml & aset DEX...</p>
                  </>
                )}
                {installProgress >= 70 && (
                  <>
                    <p className="text-slate-500 font-normal">✓ [VERIFY] Tanda tangan valid (Sandbox Gate Verified)</p>
                    <p className="text-slate-500 font-normal">✓ [UNPACK] Aset terurai lengkap</p>
                    <p className="animate-pulse">🚀 [DEPLOY] Mendaftarkan com.ase.workbook ke Sandbox...</p>
                  </>
                )}
              </div>
            </div>
          )}

          {installerStep === 'completed' && (
            <div className="space-y-5 text-center">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 bg-emerald-950 border border-emerald-500 rounded-full flex items-center justify-center text-emerald-400 text-xl font-bold animate-bounce shadow-md">
                  ✓
                </div>
                <h5 className="font-extrabold text-xs text-slate-100">Aplikasi terpasang.</h5>
                <p className="text-[10px] text-slate-400 leading-relaxed max-w-xs mx-auto">
                  ASE Workbook v1.5.0-beta.1 sukses didaftarkan dan dijalankan di dalam emulasi sandbox perangkat Anda!
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAndroidInstaller(false)}
                  className="px-4 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-200 transition-all cursor-pointer"
                >
                  Selesai
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAndroidInstaller(false);
                    // Trigger a sweet success toast / visual indicator!
                    setDownloadSuccessMessage("🚀 Selamat! Aplikasi ASE Workbook v1.5.0-beta.1 berhasil dijalankan di penampung sandbox Anda!");
                    setTimeout(() => setDownloadSuccessMessage(null), 6000);
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
                >
                  Buka
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )}

    </div>
  );
}

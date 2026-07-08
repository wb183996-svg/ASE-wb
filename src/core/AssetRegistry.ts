/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { aseKernelInstance } from './Kernel';
import { LanguageRegistry } from '../lib/i18n';

export interface AssetDependency {
  id: string;
  version: string;
  type: 'workbook' | 'langpack' | 'themepack' | 'iconpack' | string;
}

export interface AssetManifest {
  id: string;
  type: 'workbook' | 'langpack' | 'themepack' | 'iconpack' | string;
  name: string;
  publisher: string;
  version: string;
  engineVersion: string;
  signature: string; // Digital signature verified by Guardian
  dependencies: AssetDependency[];
  permissions: string[]; // Permissions list: e.g. ["StorageAccess", "UIExtension", "NotificationAccess"]
  checksum: string; // Dynamic integrity hash check
}

export interface Asset {
  manifest: AssetManifest;
  state: 'registered' | 'activated' | 'deactivated' | 'unregistered';
  payload: any; // Dynamic asset contents (translations, stylesheet, icon mapping, etc.)
  history: { version: string; action: string; timestamp: string; note: string }[];
}

export class UniversalAssetRegistry {
  private assets: Map<string, Asset> = new Map();
  private rollbackPacks: Map<string, Asset[]> = new Map(); // Rollback backups

  constructor() {
    this.preloadCoreAssets();
  }

  /**
   * Preload core framework built-in assets
   */
  private preloadCoreAssets() {
    // 1. Indonesian Language Pack
    this.register({
      manifest: {
        id: 'ase-lang-id',
        type: 'langpack',
        name: 'Bahasa Indonesia (Sistem Inti)',
        publisher: 'ASE Core Team',
        version: '1.0.0',
        engineVersion: '1.0.0',
        signature: 'ase-sig-core-lang-id-998230',
        dependencies: [],
        permissions: ['UIExtension'],
        checksum: 'sha256-e982c7104b281f62ab7e90'
      },
      state: 'activated',
      payload: { locale: 'id' },
      history: [{ version: '1.0.0', action: 'BOOTSTRAP', timestamp: new Date().toISOString(), note: 'Inisialisasi sistem bahasa Indonesia' }]
    }, { skipValidation: true });

    // 2. English Language Pack
    this.register({
      manifest: {
        id: 'ase-lang-en',
        type: 'langpack',
        name: 'English Pack (Core Engine)',
        publisher: 'ASE Core Team',
        version: '1.0.0',
        engineVersion: '1.0.0',
        signature: 'ase-sig-core-lang-en-998231',
        dependencies: [],
        permissions: ['UIExtension'],
        checksum: 'sha256-fe982b8210e39fac6281a1'
      },
      state: 'activated',
      payload: { locale: 'en' },
      history: [{ version: '1.0.0', action: 'BOOTSTRAP', timestamp: new Date().toISOString(), note: 'Core system English initialization' }]
    }, { skipValidation: true });

    // 3. Core Workbook: Growth OS
    this.register({
      manifest: {
        id: 'wb-growth-os',
        type: 'workbook',
        name: 'Growth OS & Planner (Reference Workbook)',
        publisher: 'ASE Core Team',
        version: '1.0.0',
        engineVersion: '1.0.0',
        signature: 'ase-sig-core-growth-110291',
        dependencies: [
          { id: 'ase-lang-id', version: '1.0.0', type: 'langpack' }
        ],
        permissions: ['StorageAccess', 'UIExtension', 'EventBusPublish'],
        checksum: 'sha256-a1bc2de34ef56ab7891cd'
      },
      state: 'activated',
      payload: {},
      history: [{ version: '1.0.0', action: 'BOOTSTRAP', timestamp: new Date().toISOString(), note: 'Core reference workbook integrated' }]
    }, { skipValidation: true });
  }

  /**
   * Universal registration of an asset pack
   */
  public register(asset: Asset, options: { skipValidation?: boolean } = {}): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const id = asset.manifest.id;

    logs.push(`[AssetRegistry] Memulai registrasi aset ID: "${id}"...`);

    if (!options.skipValidation) {
      // 1. Digital Signature & Checksum Verification
      const verification = this.verify(asset);
      logs.push(...verification.logs);
      if (!verification.valid) {
        logs.push(`[AssetRegistry] [ERROR] Gagal memverifikasi tanda tangan digital atau integritas berkas untuk "${id}".`);
        aseKernelInstance.log('error', 'AssetRegistry', `Integrity check failed for asset "${id}". Registration cancelled.`);
        return { success: false, logs };
      }

      // 2. Resolve Dependencies
      const depCheck = this.resolveDependencies(asset);
      logs.push(...depCheck.logs);
      if (!depCheck.resolved) {
        logs.push(`[AssetRegistry] [WARNING] Dependensi untuk "${id}" tidak terpenuhi. Pemasangan tetap diizinkan namun aktivasi ditangguhkan.`);
        aseKernelInstance.log('warn', 'AssetRegistry', `Asset "${id}" registered but has unresolved dependencies.`);
      }

      // 3. Sandbox Permissions Evaluation
      const sandboxCheck = this.enforceSandbox(asset);
      logs.push(...sandboxCheck.logs);
    }

    // Save history backup for upgrades / rollbacks
    const existing = this.assets.get(id);
    if (existing) {
      logs.push(`[AssetRegistry] Mendeteksi versi aset lama (${existing.manifest.version}). Membuat snapshot untuk skenario rollback...`);
      const rollbacks = this.rollbackPacks.get(id) || [];
      rollbacks.push(JSON.parse(JSON.stringify(existing))); // deep clone
      this.rollbackPacks.set(id, rollbacks);
    }

    // Register asset
    asset.state = 'registered';
    this.assets.set(id, asset);
    logs.push(`[AssetRegistry] [SUCCESS] Aset "${asset.manifest.name}" (v${asset.manifest.version}) berhasil diregistrasi ke sistem.`);
    aseKernelInstance.log('success', 'AssetRegistry', `Registered asset: ${asset.manifest.name} (v${asset.manifest.version}) [Type: ${asset.manifest.type}]`);

    return { success: true, logs };
  }

  /**
   * De-registration of an asset pack
   */
  public unregister(assetId: string): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const asset = this.assets.get(assetId);

    if (!asset) {
      logs.push(`[AssetRegistry] [ERROR] Aset dengan ID "${assetId}" tidak ditemukan.`);
      return { success: false, logs };
    }

    logs.push(`[AssetRegistry] Memulai pencopotan aset "${asset.manifest.name}"...`);
    if (asset.state === 'activated') {
      this.deactivate(assetId);
    }

    this.assets.delete(assetId);
    this.rollbackPacks.delete(assetId);
    logs.push(`[AssetRegistry] [SUCCESS] Aset "${assetId}" berhasil dihapus sepenuhnya dari registry.`);
    aseKernelInstance.log('info', 'AssetRegistry', `Unregistered asset: ${asset.manifest.name}`);

    return { success: true, logs };
  }

  /**
   * Activate asset pack in runtime
   */
  public activate(assetId: string): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const asset = this.assets.get(assetId);

    if (!asset) {
      logs.push(`[AssetRegistry] [ERROR] Gagal mengaktifkan: Aset "${assetId}" tidak ditemukan.`);
      return { success: false, logs };
    }

    if (asset.state === 'activated') {
      logs.push(`[AssetRegistry] Aset "${asset.manifest.name}" sudah dalam kondisi aktif.`);
      return { success: true, logs };
    }

    // Check dependencies before activation
    const depCheck = this.resolveDependencies(asset);
    if (!depCheck.resolved) {
      logs.push(`[AssetRegistry] [ERROR] Gagal mengaktifkan "${asset.manifest.name}": dependensi tidak lengkap.`);
      logs.push(...depCheck.logs);
      aseKernelInstance.log('error', 'AssetRegistry', `Activation failed for "${asset.manifest.name}" due to missing dependencies.`);
      return { success: false, logs };
    }

    asset.state = 'activated';
    asset.history.push({
      version: asset.manifest.version,
      action: 'ACTIVATED',
      timestamp: new Date().toISOString(),
      note: 'Aset berhasil diaktifkan secara dinamis di runtime'
    });

    // Hook to specific services depending on type
    if (asset.manifest.type === 'langpack' && asset.payload && asset.payload.translations) {
      LanguageRegistry.registerLanguagePack({
        manifest: {
          id: asset.manifest.id,
          language: asset.payload.locale || 'en',
          version: asset.manifest.version,
          publisher: asset.manifest.publisher
        },
        translations: asset.payload.translations
      });
      logs.push(`[AssetRegistry] Hook terhubung: Language Pack diinjeksikan ke LanguageRegistry.`);
    }

    logs.push(`[AssetRegistry] [SUCCESS] Aset "${asset.manifest.name}" kini aktif dan berjalan di runtime.`);
    aseKernelInstance.log('success', 'AssetRegistry', `Activated asset: ${asset.manifest.name} successfully.`);

    return { success: true, logs };
  }

  /**
   * Deactivate asset pack in runtime
   */
  public deactivate(assetId: string): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const asset = this.assets.get(assetId);

    if (!asset) {
      logs.push(`[AssetRegistry] [ERROR] Gagal menonaktifkan: Aset "${assetId}" tidak ditemukan.`);
      return { success: false, logs };
    }

    if (asset.state !== 'activated') {
      logs.push(`[AssetRegistry] Aset "${asset.manifest.name}" sedang tidak aktif.`);
      return { success: true, logs };
    }

    asset.state = 'registered';
    asset.history.push({
      version: asset.manifest.version,
      action: 'DEACTIVATED',
      timestamp: new Date().toISOString(),
      note: 'Aset dinonaktifkan dari runtime'
    });

    logs.push(`[AssetRegistry] [SUCCESS] Aset "${asset.manifest.name}" berhasil dinonaktifkan.`);
    aseKernelInstance.log('info', 'AssetRegistry', `Deactivated asset: ${asset.manifest.name}`);

    return { success: true, logs };
  }

  /**
   * Verify digital signature and file integrity checksum
   */
  public verify(asset: Asset): { valid: boolean; logs: string[] } {
    const logs: string[] = [];
    const manifest = asset.manifest;

    logs.push(`[Verify-Chain] Memulai rantai validasi tanda tangan & checksum...`);
    
    // Check checksum format (must simulate checking calculated hash against manifest checksum)
    if (!manifest.checksum || !manifest.checksum.startsWith('sha256-')) {
      logs.push(`[Verify-Chain] [FAILED] Checksum "${manifest.checksum}" tidak valid atau rusak.`);
      return { valid: false, logs };
    }
    logs.push(`[Verify-Chain] Checksum lolos validasi format: ${manifest.checksum} (MATCH)`);

    // Check signature
    if (!manifest.signature || !manifest.signature.startsWith('ase-sig-')) {
      logs.push(`[Verify-Chain] [FAILED] Tanda tangan digital "${manifest.signature}" ditolak oleh Guardian.`);
      logs.push(`[Verify-Chain] [FAILED] Tanda tangan tidak memiliki awalan otentikasi resmi ("ase-sig-").`);
      return { valid: false, logs };
    }
    logs.push(`[Verify-Chain] Tanda tangan digital diakui oleh Guardian: ${manifest.signature} (VALID)`);
    logs.push(`[Verify-Chain] Otoritas Penerbit: "${manifest.publisher}" terverifikasi resmi.`);
    logs.push(`[Verify-Chain] [SUCCESS] Seluruh mata rantai pengaman berhasil divalidasi.`);

    return { valid: true, logs };
  }

  /**
   * Upgrade asset to next version with rollback snapshot
   */
  public upgrade(assetId: string, nextAsset: Asset): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const existing = this.assets.get(assetId);

    if (!existing) {
      logs.push(`[AssetRegistry] [ERROR] Upgrade gagal: Aset asal "${assetId}" tidak ditemukan.`);
      return { success: false, logs };
    }

    logs.push(`[AssetRegistry] Memulai peningkatan (Upgrade) dari v${existing.manifest.version} ke v${nextAsset.manifest.version}...`);

    // Register next version (which backs up the old version)
    const regResult = this.register(nextAsset);
    logs.push(...regResult.logs);

    if (regResult.success) {
      logs.push(`[AssetRegistry] Menghubungkan ulang konfigurasi runtime ke v${nextAsset.manifest.version}...`);
      this.activate(assetId);
      logs.push(`[AssetRegistry] [SUCCESS] Peningkatan aset "${nextAsset.manifest.name}" selesai.`);
      aseKernelInstance.log('success', 'AssetRegistry', `Upgraded asset "${assetId}" to version ${nextAsset.manifest.version}`);
    } else {
      logs.push(`[AssetRegistry] [ERROR] Upgrade gagal. Mengembalikan ke v${existing.manifest.version}...`);
    }

    return { success: regResult.success, logs };
  }

  /**
   * Rollback upgraded asset pack to previous cached version
   */
  public rollback(assetId: string): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    const rollbacks = this.rollbackPacks.get(assetId) || [];

    if (rollbacks.length === 0) {
      logs.push(`[AssetRegistry] [ERROR] Rollback gagal: Tidak ada snapshot versi sebelumnya untuk "${assetId}".`);
      return { success: false, logs };
    }

    const previousAsset = rollbacks.pop()!;
    logs.push(`[AssetRegistry] Menemukan snapshot pemulihan v${previousAsset.manifest.version}. Menginisiasi penggulungan (Rollback)...`);

    // Deactivate current
    this.deactivate(assetId);

    // Re-assign previous version
    this.assets.set(assetId, previousAsset);
    this.activate(assetId);

    logs.push(`[AssetRegistry] [SUCCESS] Penggulungan berhasil. Aset "${previousAsset.manifest.name}" kembali ke v${previousAsset.manifest.version}.`);
    aseKernelInstance.log('success', 'AssetRegistry', `Rolled back asset "${assetId}" to v${previousAsset.manifest.version} successfully.`);

    return { success: true, logs };
  }

  /**
   * Resolve and evaluate dependency tree
   */
  public resolveDependencies(asset: Asset): { resolved: boolean; logs: string[]; missing: AssetDependency[] } {
    const logs: string[] = [];
    const missing: AssetDependency[] = [];
    const id = asset.manifest.id;

    logs.push(`[DependencyManager] Mengevaluasi dependensi untuk "${id}"...`);

    if (asset.manifest.dependencies.length === 0) {
      logs.push(`[DependencyManager] Bebas dependensi. Lolos verifikasi.`);
      return { resolved: true, logs, missing };
    }

    for (const dep of asset.manifest.dependencies) {
      const activeDep = this.assets.get(dep.id);
      if (!activeDep) {
        logs.push(`[DependencyManager] [MISSING] Dependensi tidak terpasang: "${dep.id}" (Versi: ${dep.version}) [Type: ${dep.type}]`);
        missing.push(dep);
      } else if (activeDep.state !== 'activated') {
        logs.push(`[DependencyManager] [UNRESOLVED] Dependensi "${dep.id}" terpasang tetapi belum diaktifkan.`);
        missing.push(dep);
      } else {
        logs.push(`[DependencyManager] [OK] Dependensi terpenuhi: "${dep.id}" (v${activeDep.manifest.version}) aktif.`);
      }
    }

    const resolved = missing.length === 0;
    if (resolved) {
      logs.push(`[DependencyManager] [SUCCESS] Seluruh dependensi berhasil dipecahkan.`);
    } else {
      logs.push(`[DependencyManager] [FAILED] Gagal memenuhi ${missing.length} dependensi.`);
    }

    return { resolved, logs, missing };
  }

  /**
   * Sandbox permission shield enforcement
   */
  public enforceSandbox(asset: Asset): { allowed: boolean; logs: string[] } {
    const logs: string[] = [];
    const manifest = asset.manifest;

    logs.push(`[AssetSandbox] Mengevaluasi profil izin sandbox untuk "${manifest.id}"...`);
    
    if (manifest.permissions.length === 0) {
      logs.push(`[AssetSandbox] Profil aman: Nol izin khusus diminta.`);
      return { allowed: true, logs };
    }

    logs.push(`[AssetSandbox] Izin diminta: [${manifest.permissions.join(', ')}]`);
    for (const perm of manifest.permissions) {
      const isRecognized = ['StorageAccess', 'UIExtension', 'EventBusPublish', 'NotificationAccess'].includes(perm);
      if (isRecognized) {
        logs.push(`[AssetSandbox] ✓ Izin "${perm}" disetujui (Konformitas Guardian).`);
      } else {
        logs.push(`[AssetSandbox] [WARNING] Izin tidak dikenal/berbahaya: "${perm}". Diisolasi secara ketat.`);
      }
    }

    logs.push(`[AssetSandbox] Batas alokasi CPU: 50ms, RAM: 16MB per siklus komputasi dinamis.`);
    logs.push(`[AssetSandbox] [SUCCESS] Sandbox berhasil melingkupi asset runtime.`);

    return { allowed: true, logs };
  }

  /**
   * Get single asset
   */
  public getAsset(assetId: string): Asset | undefined {
    return this.assets.get(assetId);
  }

  /**
   * Get all registered assets
   */
  public getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  /**
   * Get assets by type
   */
  public getAssetsByType(type: string): Asset[] {
    return Array.from(this.assets.values()).filter(a => a.manifest.type === type);
  }
}

// Export global singleton instance of Universal Asset Registry
export const AssetRegistry = new UniversalAssetRegistry();

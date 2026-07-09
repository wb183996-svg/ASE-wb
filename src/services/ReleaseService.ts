/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ReleaseAsset {
  id: number;
  name: string;
  size: number;
  downloadCount: number;
  browserDownloadUrl: string;
}

export interface ReleaseInfo {
  id: number;
  tagName: string;
  name: string;
  publishedAt: string;
  body: string;
  assets: ReleaseAsset[];
  isSandbox?: boolean;
}

export class ReleaseService {
  private static cache: { [key: string]: { data: ReleaseInfo[]; timestamp: number } } = {};
  private static CACHE_DURATION_MS = 5 * 60 * 1000; // 5 menit cache

  /**
   * Mengembalikan rilis simulasi/sandbox berkualitas tinggi untuk pengujian offline dan verifikasi MOR.
   */
  public static getSandboxReleases(): ReleaseInfo[] {
    return [
      {
        id: 1500,
        tagName: 'v1.5.0-beta.1',
        name: 'ASE v1.5.0-beta.1 (Beta Operational)',
        publishedAt: '2026-07-03T14:24:17Z',
        body: `### Build pertama untuk Operational Validation.

*   Download Center menggunakan GitHub Releases.
*   Fokus pada stabilitas dan feedback pengguna.
*   Feature Freeze aktif.

*Catatan: Mengunduh dari repositori lokal (Mode Sandbox) untuk mempermudah pengujian end-to-end tanpa hambatan autentikasi GitHub.*`,
        isSandbox: true,
        assets: [
          {
            id: 9901,
            name: 'ASE-v1.5.0-beta.1.apk',
            size: 19084000, // ~18.2 MB
            downloadCount: 42,
            browserDownloadUrl: '/ASE-v1.5.0-beta.1.apk'
          },
          {
            id: 9902,
            name: 'ASE-web.zip',
            size: 4718592, // ~4.5 MB
            downloadCount: 128,
            browserDownloadUrl: '/ASE-web.zip'
          },
          {
            id: 9903,
            name: 'ASE-v1.5.0-beta.1-x64.exe',
            size: 47600000, // ~45.4 MB
            downloadCount: 89,
            browserDownloadUrl: '/ASE-web.zip'
          },
          {
            id: 9904,
            name: 'ASE-v1.5.0-beta.1-arm64.dmg',
            size: 50400000, // ~48.1 MB
            downloadCount: 56,
            browserDownloadUrl: '/ASE-web.zip'
          },
          {
            id: 9905,
            name: 'ASE-v1.5.0-beta.1.AppImage',
            size: 54500000, // ~52.0 MB
            downloadCount: 31,
            browserDownloadUrl: '/ASE-web.zip'
          }
        ]
      }
    ];
  }

  /**
   * Mengembalikan rilis simulasi murni untuk pengujian demo visual tanpa file biner apa pun.
   */
  public static getSimulationReleases(): ReleaseInfo[] {
    return [
      {
        id: 1400,
        tagName: 'v1.5.0-demo',
        name: 'ASE v1.5.0-demo (Simulation Mode)',
        publishedAt: '2026-07-03T14:24:17Z',
        body: `### Simulasikan Alur Pengunduhan Biner.

*   Aplikasi berjalan dalam mode demonstrasi tanpa file biner fisik di server.
*   Digunakan untuk memverifikasi fungsionalitas UI, deteksi ukuran, dan versi.
*   Beralih ke mode GitHub atau Sandbox Lokal di atas untuk mengunduh biner asli.`,
        isSandbox: false,
        assets: [
          {
            id: 9801,
            name: 'ASE-v1.5.0-simulated-demo.apk',
            size: 19084000, // ~18.2 MB
            downloadCount: 7,
            browserDownloadUrl: '#simulation-apk'
          },
          {
            id: 9802,
            name: 'ASE-web-simulated-demo.zip',
            size: 4718592, // ~4.5 MB
            downloadCount: 15,
            browserDownloadUrl: '#simulation-zip'
          },
          {
            id: 9803,
            name: 'ASE-v1.5.0-simulated-demo-x64.exe',
            size: 47600000, // ~45.4 MB
            downloadCount: 22,
            browserDownloadUrl: '#simulation-exe'
          },
          {
            id: 9804,
            name: 'ASE-v1.5.0-simulated-demo-arm64.dmg',
            size: 50400000, // ~48.1 MB
            downloadCount: 14,
            browserDownloadUrl: '#simulation-dmg'
          },
          {
            id: 9805,
            name: 'ASE-v1.5.0-simulated-demo.AppImage',
            size: 54500000, // ~52.0 MB
            downloadCount: 9,
            browserDownloadUrl: '#simulation-appimage'
          }
        ]
      }
    ];
  }

  /**
   * Mengambil nama repositori GitHub dari environment atau localStorage.
   * Prioritas:
   * 1. import.meta.env.VITE_GITHUB_REPOSITORY
   * 2. import.meta.env.VITE_GITHUB_OWNER + '/' + import.meta.env.VITE_GITHUB_REPO
   * 3. localStorage.getItem('ase_github_repo')
   * 4. Fallback default: 'wb183996-svg/ASE-wb'
   */
  public static getRepositoryIdentifier(): string {
    // Membaca dari environment variables Vite jika diset
    const metaEnv = (import.meta as any).env || {};
    const envRepo = metaEnv.VITE_GITHUB_REPOSITORY;
    if (envRepo && envRepo.trim() !== '') {
      return envRepo.trim();
    }

    const envOwner = metaEnv.VITE_GITHUB_OWNER;
    const envName = metaEnv.VITE_GITHUB_REPO;
    if (envOwner && envName && envOwner.trim() !== '' && envName.trim() !== '') {
      return `${envOwner.trim()}/${envName.trim()}`;
    }

    // Membaca dari localStorage jika ada konfigurasi dinamis dari user di UI
    const localRepo = localStorage.getItem('ase_github_repo');
    if (localRepo && localRepo.trim() !== '') {
      return localRepo.trim();
    }

    // Fallback default (Repositori riil pengguna)
    return 'wb183996-svg/ASE-wb';
  }

  /**
   * Mengambil rilis riil dari GitHub API berdasarkan konfigurasi repositori saat ini atau repositori spesifik.
   * @param repositoryName Nama repositori opsional (format: owner/repo)
   * @param bypassCache Jika true, abaikan cache dan paksa panggil API
   * @param token GitHub Personal Access Token opsional untuk repositori privat
   * @returns List rilis publik yang terpetakan ke interface ReleaseInfo.
   */
  public static async fetchLatestReleases(repositoryName?: string, bypassCache = false, token?: string): Promise<ReleaseInfo[]> {
    const repository = repositoryName || this.getRepositoryIdentifier();
    const url = `https://api.github.com/repos/${repository}/releases`;

    // Cek cache jika tidak di-bypass
    if (!bypassCache && !token && this.cache[repository]) {
      const cached = this.cache[repository];
      if (Date.now() - cached.timestamp < this.CACHE_DURATION_MS) {
        console.log(`[ReleaseService] Membaca data rilis dari cache untuk ${repository}`);
        return cached.data;
      }
    }

    try {
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github+json'
      };

      if (token && token.trim() !== '') {
        headers['Authorization'] = `token ${token.trim()}`;
      }

      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(
            `Repositori "${repository}" tidak ditemukan atau bersifat PRIVATE. ` +
            `Jika ini repositori privat, masukkan Personal Access Token (PAT) GitHub Anda di bawah ini, atau ubah visibilitas repositori menjadi PUBLIC di pengaturan GitHub.`
          );
        }
        if (response.status === 401) {
          throw new Error(`Personal Access Token (PAT) GitHub yang Anda masukkan tidak valid atau telah kedaluwarsa.`);
        }
        if (response.status === 403) {
          throw new Error(
            `Batas pemanggilan (Rate Limit) GitHub API terlampaui atau akses ditolak (Status: 403). Silakan coba beberapa saat lagi.`
          );
        }
        throw new Error(`Gagal memuat rilis dari GitHub API (Status: ${response.status}).`);
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        return [];
      }

      const releases: ReleaseInfo[] = data.map((raw: any) => ({
        id: raw.id,
        tagName: raw.tag_name || '',
        name: raw.name || '',
        publishedAt: raw.published_at || '',
        body: raw.body || '',
        assets: Array.isArray(raw.assets) 
          ? raw.assets.map((asset: any) => ({
              id: asset.id,
              name: asset.name || '',
              size: asset.size || 0,
              downloadCount: asset.download_count || 0,
              browserDownloadUrl: asset.browser_download_url || '',
            }))
          : [],
      }));

      // Simpan hasil ke cache
      this.cache[repository] = {
        data: releases,
        timestamp: Date.now()
      };

      return releases;
    } catch (error: any) {
      console.error('Error fetching releases in ReleaseService:', error);
      throw error;
    }
  }

  /**
   * Membuat rilis baru di GitHub.
   */
  public static async createRelease(
    repositoryName: string,
    token: string,
    tag: string,
    name: string,
    body: string,
    draft: boolean,
    prerelease: boolean
  ): Promise<ReleaseInfo> {
    const repository = repositoryName || this.getRepositoryIdentifier();
    const url = `https://api.github.com/repos/${repository}/releases`;

    if (!token || token.trim() === '') {
      throw new Error("Token Akses Pribadi (PAT) GitHub diperlukan untuk membuat rilis baru.");
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `token ${token.trim()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          tag_name: tag,
          name: name,
          body: body,
          draft: draft,
          prerelease: prerelease
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Gagal membuat rilis (Status: ${response.status})`);
      }

      const raw = await response.json();
      return {
        id: raw.id,
        tagName: raw.tag_name || '',
        name: raw.name || '',
        publishedAt: raw.published_at || new Date().toISOString(),
        body: raw.body || '',
        assets: Array.isArray(raw.assets)
          ? raw.assets.map((asset: any) => ({
              id: asset.id,
              name: asset.name || '',
              size: asset.size || 0,
              downloadCount: asset.download_count || 0,
              browserDownloadUrl: asset.browser_download_url || '',
            }))
          : [],
      };
    } catch (error: any) {
      console.error('Error creating release in ReleaseService:', error);
      throw error;
    }
  }

  /**
   * Menghapus rilis di GitHub.
   */
  public static async deleteRelease(repositoryName: string, token: string, releaseId: number): Promise<void> {
    const repository = repositoryName || this.getRepositoryIdentifier();
    const url = `https://api.github.com/repos/${repository}/releases/${releaseId}`;

    if (!token || token.trim() === '') {
      throw new Error("Token Akses Pribadi (PAT) GitHub diperlukan untuk menghapus rilis.");
    }

    try {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `token ${token.trim()}`
        }
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Gagal menghapus rilis (Status: ${response.status})`);
      }
    } catch (error: any) {
      console.error('Error deleting release in ReleaseService:', error);
      throw error;
    }
  }

  /**
   * Mengunggah aset biner ke rilis GitHub tertentu.
   */
  public static async uploadReleaseAsset(
    repositoryName: string,
    token: string,
    releaseId: number,
    fileName: string,
    fileData: Blob | File
  ): Promise<any> {
    const repository = repositoryName || this.getRepositoryIdentifier();
    
    // GitHub asset uploads use uploads.github.com instead of api.github.com
    const url = `https://uploads.github.com/repos/${repository}/releases/${releaseId}/assets?name=${encodeURIComponent(fileName)}`;

    if (!token || token.trim() === '') {
      throw new Error("Token Akses Pribadi (PAT) GitHub diperlukan untuk mengunggah aset.");
    }

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/vnd.github+json',
          'Authorization': `token ${token.trim()}`,
          'Content-Type': fileData.type || 'application/octet-stream',
          'Content-Length': fileData.size.toString()
        },
        body: fileData
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || `Gagal mengunggah aset "${fileName}" (Status: ${response.status})`);
      }

      return await response.json();
    } catch (error: any) {
      console.error('Error uploading release asset in ReleaseService:', error);
      throw error;
    }
  }
}

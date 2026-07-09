/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { aseKernelInstance } from './Kernel';

export interface UserAuthProfile {
  uid: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'Guest' | 'User' | 'Publisher' | 'SysAdmin';
  workspaceMode: string;
  organization?: string;
  createdAt: string;
  lastLoginAt: string;
}

export interface AuthSession {
  token: string;
  expiresAt: string;
  user: UserAuthProfile;
  provider: 'google' | 'github' | 'apple' | 'offline';
  scopes: string[];
}

export interface LinkedAccount {
  provider: string;
  accountId: string;
  email: string;
  linkedAt: string;
}

// 1. Decoupled Provider Contract (ASE Constitution)
export interface IAuthProvider {
  getProviderId(): string;
  getProviderName(): string;
  authenticate(mockEmail?: string, mockName?: string): Promise<{ success: boolean; user: UserAuthProfile; rawToken: string }>;
}

// 2. Google OAuth Provider Implementation
export class GoogleAuthProvider implements IAuthProvider {
  public getProviderId(): string { return 'google'; }
  public getProviderName(): string { return 'Google Identity Secure Core'; }

  public async authenticate(mockEmail = 'prasetyo.ase@gmail.com', mockName = 'Prasetyo'): Promise<{ success: boolean; user: UserAuthProfile; rawToken: string }> {
    // Simulate real OAuth secure popups network delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Construct profile returned by Google OAuth userinfo endpoint
    const user: UserAuthProfile = {
      uid: 'g-user-' + Math.floor(Math.random() * 89999 + 10000),
      name: mockName,
      email: mockEmail,
      avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
      role: mockEmail.endsWith('@ase.dev') || mockEmail.includes('admin') ? 'SysAdmin' : mockEmail.includes('publisher') ? 'Publisher' : 'User',
      workspaceMode: 'Individu',
      organization: mockEmail.split('@')[1] || 'ASE Ecosystem',
      createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().substring(0, 10), // Joined 30 days ago
      lastLoginAt: new Date().toISOString()
    };

    const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'google-pubkey-4a92b' }));
    const payload = btoa(JSON.stringify({
      iss: 'accounts.google.com',
      sub: user.uid,
      aud: 'ase-app-5c4d2e15',
      email: user.email,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiration
      iat: Math.floor(Date.now() / 1000)
    }));
    const signature = 'ase_oauth_sec_jwt_' + Math.random().toString(36).substr(2, 16);
    const rawToken = `${header}.${payload}.${signature}`;

    return { success: true, user, rawToken };
  }
}

// Alternative Provider: GitHub OAuth Provider (for demonstrating pluggability)
export class GitHubAuthProvider implements IAuthProvider {
  public getProviderId(): string { return 'github'; }
  public getProviderName(): string { return 'GitHub Dev Identity'; }

  public async authenticate(mockEmail = 'prasetyo@github.com', mockName = 'Prasetyo Developer'): Promise<{ success: boolean; user: UserAuthProfile; rawToken: string }> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user: UserAuthProfile = {
      uid: 'git-user-' + Math.floor(Math.random() * 89999 + 10000),
      name: mockName,
      email: mockEmail,
      avatarUrl: 'https://github.com/identicons/default.png',
      role: 'Publisher',
      workspaceMode: 'UMKM',
      organization: 'GitHub OpenSource',
      createdAt: new Date(Date.now() - 60 * 24 * 3600 * 1000).toISOString().substring(0, 10),
      lastLoginAt: new Date().toISOString()
    };

    const rawToken = `github_oauth_sec_token_${Math.random().toString(36).substr(2, 16)}`;
    return { success: true, user, rawToken };
  }
}

// 3. Central Identity Service coordinating all Sub-modules
export class IdentityService {
  private currentSession: AuthSession | null = null;
  private providers: Map<string, IAuthProvider> = new Map();
  private linkedAccounts: LinkedAccount[] = [];
  private listeners: Set<(session: AuthSession | null) => void> = new Set();

  constructor() {
    // Register Default Providers (Open Architecture)
    this.registerProvider(new GoogleAuthProvider());
    this.registerProvider(new GitHubAuthProvider());

    // Try auto-login from localStorage if persistent session exists
    this.loadPersistedSession();
  }

  /**
   * Pluggable registry for Identity Providers
   */
  public registerProvider(provider: IAuthProvider) {
    this.providers.set(provider.getProviderId(), provider);
    aseKernelInstance.log('info', 'IdentityModule', `Identity Provider "${provider.getProviderName()}" successfully registered to Core AccountRegistry.`);
  }

  /**
   * Subscribe to auth status changes
   */
  public subscribe(listener: (session: AuthSession | null) => void): () => void {
    this.listeners.add(listener);
    listener(this.currentSession);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentSession));
  }

  /**
   * Get all registered login providers
   */
  public getRegisteredProviders(): IAuthProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Login using a specific provider
   */
  public async login(providerId: string, customEmail?: string, customName?: string): Promise<{ success: boolean; logs: string[] }> {
    const logs: string[] = [];
    logs.push(`[IdentityService] Memulai rantai otentikasi menggunakan provider: "${providerId}"...`);

    const provider = this.providers.get(providerId);
    if (!provider) {
      logs.push(`[IdentityService] [ERROR] Provider "${providerId}" tidak terdaftar di AccountRegistry.`);
      return { success: false, logs };
    }

    try {
      logs.push(`[IdentityService] Mengalihkan ke OAuth Consent Portal untuk "${provider.getProviderName()}"...`);
      const authResult = await provider.authenticate(customEmail, customName);

      if (authResult.success) {
        logs.push(`[IdentityService] Callback OAuth diterima dengan sukses. Memvalidasi JWT Token...`);
        
        // Token verification simulation (Secure Handshake)
        const tokenVerified = this.verifyTokenSignature(authResult.rawToken);
        if (!tokenVerified) {
          logs.push(`[IdentityService] [ERROR] Tanda tangan tanda pengenal kriptografis (JWT) rusak atau gagal divalidasi.`);
          return { success: false, logs };
        }
        logs.push(`[IdentityService] JWT Token terverifikasi oleh TokenManager (Masa berlaku: 1 jam).`);

        // Construct Session
        const session: AuthSession = {
          token: authResult.rawToken,
          expiresAt: new Date(Date.now() + 3600000).toISOString(), // 1 hour
          user: authResult.user,
          provider: providerId as any,
          scopes: this.getPermissionsForRole(authResult.user.role)
        };

        this.currentSession = session;
        
        // Link Account
        this.addLinkedAccount(providerId, session.user.uid, session.user.email);
        
        // Persist session locally
        localStorage.setItem('ase_auth_session', JSON.stringify(session));

        logs.push(`[IdentityService] [SUCCESS] Otentikasi Berhasil. Selamat Datang, ${session.user.name}!`);
        logs.push(`[IdentityService] Role Akses: [${session.user.role}] | Izin Scope: [${session.scopes.join(', ')}]`);
        
        aseKernelInstance.log('success', 'IdentityModule', `User "${session.user.name}" authenticated successfully via ${providerId.toUpperCase()}.`);

        this.notifyListeners();
        return { success: true, logs };
      } else {
        logs.push(`[IdentityService] [ERROR] Autentikasi ditolak oleh Identity Provider.`);
        return { success: false, logs };
      }
    } catch (err: any) {
      logs.push(`[IdentityService] [ERROR] Gagal melakukan jabat tangan OAuth: ${err.message || err}`);
      return { success: false, logs };
    }
  }

  /**
   * Logout user and restore default Guest session
   */
  public logout(): { success: boolean; logs: string[] } {
    const logs: string[] = [];
    logs.push(`[IdentityService] Mengakhiri sesi aktif pengguna...`);
    
    if (this.currentSession) {
      const name = this.currentSession.user.name;
      this.currentSession = null;
      localStorage.removeItem('ase_auth_session');
      logs.push(`[IdentityService] Sesi untuk "${name}" berhasil dihapus dari memori.`);
      logs.push(`[IdentityService] [SUCCESS] Kembali ke sesi Guest (Tamu). Seluruh hak akses online dicabut.`);
      aseKernelInstance.log('info', 'IdentityModule', `User "${name}" logged out.`);
    } else {
      logs.push(`[IdentityService] Tidak ada sesi aktif yang terdeteksi.`);
    }

    this.notifyListeners();
    return { success: true, logs };
  }

  /**
   * Mock secure signature checking on OAuth payload token
   */
  private verifyTokenSignature(token: string): boolean {
    if (!token) return false;
    // Check if it's our mocked JWT token
    if (token.startsWith('github_oauth_sec_token_') || token.includes('ase_oauth_sec_jwt_')) {
      return true;
    }
    return false;
  }

  /**
   * Permission Manager: Maps Role to Scopes
   */
  public getPermissionsForRole(role: 'Guest' | 'User' | 'Publisher' | 'SysAdmin'): string[] {
    switch (role) {
      case 'SysAdmin':
        return ['AssetPurchaser', 'PublisherUpload', 'CloudBackupSync', 'CoreSysAdmin', 'TelemetryAccess', 'LicenseIssuer'];
      case 'Publisher':
        return ['AssetPurchaser', 'PublisherUpload', 'CloudBackupSync', 'AnalyticsRead'];
      case 'User':
        return ['AssetPurchaser', 'CloudBackupSync'];
      default:
        return [];
    }
  }

  /**
   * Check if active session has a specific scope claim
   */
  public hasScope(scope: string): boolean {
    if (!this.currentSession) return false;
    return this.currentSession.scopes.includes(scope);
  }

  /**
   * AccountRegistry: Multi-account Linking
   */
  private addLinkedAccount(provider: string, accountId: string, email: string) {
    const exists = this.linkedAccounts.some(acc => acc.provider === provider && acc.accountId === accountId);
    if (!exists) {
      this.linkedAccounts.push({
        provider,
        accountId,
        email,
        linkedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
      });
    }
  }

  public getLinkedAccounts(): LinkedAccount[] {
    return this.linkedAccounts;
  }

  public getCurrentSession(): AuthSession | null {
    return this.currentSession;
  }

  private loadPersistedSession() {
    try {
      const saved = localStorage.getItem('ase_auth_session');
      if (saved) {
        const session: AuthSession = JSON.parse(saved);
        // Verify expiry
        if (new Date(session.expiresAt) > new Date()) {
          this.currentSession = session;
          this.addLinkedAccount(session.provider, session.user.uid, session.user.email);
          aseKernelInstance.log('success', 'IdentityModule', `Auto-loaded active session for "${session.user.name}" via ${session.provider.toUpperCase()}.`);
        } else {
          localStorage.removeItem('ase_auth_session');
          aseKernelInstance.log('info', 'IdentityModule', 'Stored session expired. User reset to Guest.');
        }
      } else {
        // Auto-activate cloud session for default user to ensure cloud features are enabled out of the box
        const defaultUser: UserAuthProfile = {
          uid: 'g-user-default',
          name: 'Prasetyo',
          email: 'prasetyo.ase@gmail.com',
          avatarUrl: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
          role: 'User',
          workspaceMode: 'Individu',
          organization: 'ASE Ecosystem',
          createdAt: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString().substring(0, 10),
          lastLoginAt: new Date().toISOString()
        };
        const header = btoa(JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: 'google-pubkey-4a92b' }));
        const payload = btoa(JSON.stringify({
          iss: 'accounts.google.com',
          sub: defaultUser.uid,
          aud: 'ase-app-5c4d2e15',
          email: defaultUser.email,
          name: defaultUser.name,
          role: defaultUser.role,
          exp: Math.floor(Date.now() / 1000) + 3600,
          iat: Math.floor(Date.now() / 1000)
        }));
        const signature = 'ase_oauth_sec_jwt_auto';
        const rawToken = `${header}.${payload}.${signature}`;

        const session: AuthSession = {
          token: rawToken,
          expiresAt: new Date(Date.now() + 3600000).toISOString(),
          user: defaultUser,
          provider: 'google',
          scopes: ['AssetPurchaser', 'CloudBackupSync']
        };
        this.currentSession = session;
        this.addLinkedAccount('google', defaultUser.uid, defaultUser.email);
        localStorage.setItem('ase_auth_session', JSON.stringify(session));
        aseKernelInstance.log('success', 'IdentityModule', `Auto-activated cloud secure session for default user "${defaultUser.name}" via GOOGLE.`);
      }
    } catch (e) {
      console.error('Failed to parse persistent auth session:', e);
    }
  }
}

export const IdentityModule = new IdentityService();

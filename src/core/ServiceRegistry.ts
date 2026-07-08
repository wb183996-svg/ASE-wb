/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Service } from './types';

export class ServiceRegistry {
  private services: Map<string, Service> = new Map();
  private onLog: (level: 'info' | 'warn' | 'success', message: string) => void;

  constructor(logCallback: (level: 'info' | 'warn' | 'success', message: string) => void) {
    this.onLog = logCallback;
    this.bootstrapDefaultServices();
  }

  /**
   * Register a service in the registry
   */
  register(service: Service): void {
    this.services.set(service.name, service);
    this.onLog('success', `Service Registered: "${service.name}" (${service.version})`);
  }

  /**
   * Get a service by name
   */
  getService(name: string): Service | undefined {
    const service = this.services.get(name);
    if (!service) {
      this.onLog('warn', `Service Lookup Failed: "${name}" is not registered`);
      return undefined;
    }
    this.onLog('info', `Service Resolved: "${name}" requested by module`);
    return service;
  }

  /**
   * Check if a service exists
   */
  hasService(name: string): boolean {
    return this.services.has(name);
  }

  /**
   * Return list of registered service names
   */
  getRegisteredServices(): string[] {
    return Array.from(this.services.keys());
  }

  /**
   * Bootstrap core platform services
   */
  private bootstrapDefaultServices(): void {
    // 1. Notification Service
    this.register({
      name: 'Notification',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'send') {
          console.log(`[Notification Service] ${params.title}: ${params.body}`);
          return { status: 'sent', id: 'notif-' + Date.now() };
        }
        return null;
      }
    });

    // 2. Identity Service
    this.register({
      name: 'Identity',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'getCurrentUser') {
          return { id: 'usr-001', name: 'Prasetyo', role: 'Profesional Kreatif', workspaceMode: 'Individu' };
        }
        return null;
      }
    });

    // 3. License Service
    this.register({
      name: 'License',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'verify') {
          const { workbookId } = params;
          // In our app, mock verify based on the list of downloaded or licensed books
          return { status: 'valid', expiresAt: '2027-12-31' };
        }
        return null;
      }
    });

    // 4. Search Service
    this.register({
      name: 'Search',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'query') {
          return { results: [], query: params.query };
        }
        return null;
      }
    });

    // 5. Backup Service
    this.register({
      name: 'Backup',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'sync') {
          return { status: 'synchronized', timestamp: new Date().toISOString() };
        }
        return null;
      }
    });

    // 6. AI Gateway Service
    this.register({
      name: 'AIGateway',
      version: '1.0.0',
      execute: (action: string, params?: any) => {
        if (action === 'generateInsight') {
          return { insight: `Rekomendasi Pintar dianalisis secara otomatis oleh model lokal.` };
        }
        return null;
      }
    });
  }
}

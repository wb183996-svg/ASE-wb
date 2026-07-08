/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KernelLog, CoreEvent, ModuleManifest, LifecycleState } from './types';
import { EventBus } from './EventBus';
import { ServiceRegistry } from './ServiceRegistry';
import { Guardian } from './Guardian';
import { LifecycleManager } from './LifecycleManager';
import { SharedDataEngine } from './SharedDataEngine';
import { ModuleLoader } from './ModuleLoader';

export class ASEKernel {
  public eventBus: EventBus;
  public serviceRegistry: ServiceRegistry;
  public guardian: Guardian;
  public lifecycle: LifecycleManager;
  public sharedData: SharedDataEngine;
  public loader: ModuleLoader;

  private logs: KernelLog[] = [];
  private maxLogs: number = 300;
  private onLogListeners: Set<(logs: KernelLog[]) => void> = new Set();

  constructor() {
    this.eventBus = new EventBus((evt) => {
      this.log('info', 'EventBus', `Fired Topic "${evt.topic}" (from source: ${evt.source})`);
    });

    this.serviceRegistry = new ServiceRegistry((level, msg) => {
      this.log(level, 'ServiceRegistry', msg);
    });

    this.guardian = new Guardian((level, msg) => {
      this.log(level, 'Guardian', msg);
    });

    this.lifecycle = new LifecycleManager(this.eventBus, (level, msg) => {
      this.log(level, 'LifecycleManager', msg);
    });

    this.sharedData = new SharedDataEngine(this.eventBus, (level, msg) => {
      this.log(level, 'SharedDataEngine', msg);
    });

    this.loader = new ModuleLoader(this.guardian, this.lifecycle, (level, msg) => {
      this.log(level, 'ModuleLoader', msg);
    });

    this.log('success', 'Kernel', 'ASE Core Runtime kernel initialized successfully without any workbook context.');
  }

  /**
   * Add a log entry to system memory
   */
  public log(level: 'info' | 'warn' | 'success' | 'error', component: string, message: string): void {
    const logEntry: KernelLog = {
      id: 'log-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(11, 19),
      level,
      component,
      message
    };

    this.logs.unshift(logEntry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    this.notifyLogListeners();
  }

  /**
   * Subscribe to live kernel logs
   */
  public subscribeToLogs(listener: (logs: KernelLog[]) => void): () => void {
    this.onLogListeners.add(listener);
    // Provide initial values
    listener([...this.logs]);

    return () => {
      this.onLogListeners.delete(listener);
    };
  }

  private notifyLogListeners(): void {
    const currentLogs = [...this.logs];
    this.onLogListeners.forEach(listener => {
      try {
        listener(currentLogs);
      } catch (err) {
        console.error('Error in kernel log listener:', err);
      }
    });
  }

  public getLogs(): KernelLog[] {
    return this.logs;
  }

  public clearLogs(): void {
    this.logs = [];
    this.notifyLogListeners();
    this.log('info', 'Kernel', 'Kernel diagnostic trace logs cleared by administrator.');
  }
}

// Export a singleton instance of the Kernel
export const aseKernelInstance = new ASEKernel();

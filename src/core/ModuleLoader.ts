/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ModuleManifest, ASEModuleContract } from './types';
import { Guardian } from './Guardian';
import { LifecycleManager } from './LifecycleManager';

export class ModuleLoader {
  private modules: Map<string, ASEModuleContract> = new Map();
  private guardian: Guardian;
  private lifecycle: LifecycleManager;
  private onLog: (level: 'info' | 'warn' | 'success' | 'error', message: string) => void;

  constructor(
    guardian: Guardian,
    lifecycle: LifecycleManager,
    logCallback: (level: 'info' | 'warn' | 'success' | 'error', message: string) => void
  ) {
    this.guardian = guardian;
    this.lifecycle = lifecycle;
    this.onLog = logCallback;
  }

  /**
   * The core 5-stage Module Loader pipeline:
   * 1. Install
   * 2. Read Manifest
   * 3. Validate
   * 4. Register
   * 5. Activate
   */
  installWorkbook(manifest: ModuleManifest, moduleCode?: any): { success: boolean; errors: string[] } {
    const moduleId = manifest.id;
    this.onLog('info', `ModuleLoader: Beginning installation pipeline for workbook package [${moduleId}]...`);

    // Stage 1: Install
    this.lifecycle.transitionTo(moduleId, 'Installed');
    this.onLog('info', `Stage 1 [INSTALL]: Package registered in temporary storage.`);

    // Stage 2: Read Manifest
    this.onLog('info', `Stage 2 [READ MANIFEST]: Extracting workbook configuration structure...`);
    this.onLog('info', `Manifest read - Title: "${manifest.title}", Version: "${manifest.version}", Author: "${manifest.author}"`);

    // Stage 3: Validate (Guardian)
    const validationResult = this.guardian.validateModule(manifest);
    if (!validationResult.success) {
      this.lifecycle.transitionTo(moduleId, 'Removed');
      this.onLog('error', `Stage 3 [VALIDATE]: Guardian rejected package! Installation aborted.`);
      return { success: false, errors: validationResult.errors };
    }
    this.lifecycle.transitionTo(moduleId, 'Validated');
    this.onLog('success', `Stage 3 [VALIDATE]: Package successfully verified by security Guardian.`);

    // Stage 4: Register
    const moduleContract: ASEModuleContract = {
      manifest,
      onStateChange: (state) => {
        this.onLog('info', `Module Hook: [${moduleId}] responded to state change to ${state}`);
      }
    };
    this.modules.set(moduleId, moduleContract);
    this.lifecycle.transitionTo(moduleId, 'Activated');
    this.onLog('success', `Stage 4 [REGISTER]: Module contract added to dynamic service memory allocation.`);

    // Stage 5: Activate
    this.lifecycle.transitionTo(moduleId, 'Running');
    this.onLog('success', `Stage 5 [ACTIVATE]: Module is running and ready to handle event subscriptions.`);

    return { success: true, errors: [] };
  }

  /**
   * Remove a workbook module
   */
  uninstallWorkbook(moduleId: string): void {
    if (this.modules.has(moduleId)) {
      this.lifecycle.transitionTo(moduleId, 'Disabled');
      this.lifecycle.transitionTo(moduleId, 'Removed');
      this.modules.delete(moduleId);
      this.onLog('warn', `ModuleLoader: Workbook "${moduleId}" was uninstalled and all memory scopes were garbage-collected.`);
    }
  }

  getLoadedModules(): ASEModuleContract[] {
    return Array.from(this.modules.values());
  }

  hasModule(moduleId: string): boolean {
    return this.modules.has(moduleId);
  }
}

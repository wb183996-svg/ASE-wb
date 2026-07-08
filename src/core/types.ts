/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type LifecycleState = 
  | 'Installed'
  | 'Validated'
  | 'Activated'
  | 'Running'
  | 'Disabled'
  | 'Updated'
  | 'Removed';

export interface ModuleManifest {
  id: string;
  title: string;
  description: string;
  version: string;
  category: string;
  author: string;
  coverGradient?: string;
  requiredPermissions: string[];
  requiredCapabilities: string[];
  signature: string; // Used by Guardian to verify source authenticity
}

export interface Service {
  name: string;
  version: string;
  execute: (action: string, params?: any) => any;
}

export interface CoreEvent {
  id: string;
  topic: string;
  payload: any;
  timestamp: string;
  source: string;
}

export interface KernelLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  component: string;
  message: string;
}

export interface ASEModuleContract {
  manifest: ModuleManifest;
  onStateChange?: (state: LifecycleState) => void;
  onEvent?: (event: CoreEvent) => void;
}

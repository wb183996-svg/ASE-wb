/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LifecycleState } from './types';
import { EventBus } from './EventBus';

export class LifecycleManager {
  private moduleStates: Map<string, LifecycleState> = new Map();
  private onLog: (level: 'info' | 'warn' | 'success', message: string) => void;
  private eventBus: EventBus;

  constructor(
    eventBus: EventBus,
    logCallback: (level: 'info' | 'warn' | 'success', message: string) => void
  ) {
    this.eventBus = eventBus;
    this.onLog = logCallback;
  }

  /**
   * Set the lifecycle state of a module
   */
  transitionTo(moduleId: string, newState: LifecycleState): void {
    const oldState = this.moduleStates.get(moduleId);
    if (oldState === newState) return;

    // Optional: Validate transition path
    // e.g. from Installed -> Validated -> Activated -> Running
    if (newState === 'Running' && oldState !== 'Activated' && oldState !== 'Running') {
      this.onLog('warn', `Lifecycle: Module "${moduleId}" transitioning to "Running" without proper activation first (previous state: "${oldState}").`);
    }

    this.moduleStates.set(moduleId, newState);
    this.onLog('info', `Lifecycle: Module "${moduleId}" changed state from "${oldState || 'None'}" to "${newState}"`);

    // Publish event onto Event Bus
    this.eventBus.publish(`module.lifecycle`, {
      moduleId,
      oldState: oldState || 'None',
      newState
    }, 'LifecycleManager');
  }

  /**
   * Get the current state of a module
   */
  getState(moduleId: string): LifecycleState | undefined {
    return this.moduleStates.get(moduleId);
  }

  /**
   * Get all managed module states
   */
  getAllStates(): { [moduleId: string]: LifecycleState } {
    const states: { [moduleId: string]: LifecycleState } = {};
    this.moduleStates.forEach((state, id) => {
      states[id] = state;
    });
    return states;
  }

  /**
   * Reset all module states
   */
  clear(): void {
    this.moduleStates.clear();
  }
}

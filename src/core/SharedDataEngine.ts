/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { EventBus } from './EventBus';

export class SharedDataEngine {
  private data: Map<string, any[]> = new Map();
  private eventBus: EventBus;
  private onLog: (level: 'info' | 'warn' | 'success', message: string) => void;

  constructor(
    eventBus: EventBus,
    logCallback: (level: 'info' | 'warn' | 'success', message: string) => void
  ) {
    this.eventBus = eventBus;
    this.onLog = logCallback;
    this.initializeTables();
  }

  /**
   * Initialize standard record tables
   */
  private initializeTables(): void {
    const tables = [
      'financeRecords',
      'taskRecords',
      'habitRecords',
      'crmRecords',
      'tradingRecords',
      'okrRecords',
      'relationshipRecords',
      'sharedContacts'
    ];
    tables.forEach(table => this.data.set(table, []));
  }

  /**
   * Load baseline datasets from external state
   */
  loadBaseline(baseline: { [table: string]: any[] }): void {
    Object.keys(baseline).forEach(table => {
      if (this.data.has(table)) {
        this.data.set(table, [...baseline[table]]);
      }
    });
    this.onLog('success', `SharedDataEngine: Base datasets synchronized (${Object.keys(baseline).length} tables)`);
  }

  /**
   * Get all records for a table
   */
  getRecords(table: string): any[] {
    return this.data.get(table) || [];
  }

  /**
   * Get complete database snapshot
   */
  getSnapshot(): { [table: string]: any[] } {
    const snapshot: { [table: string]: any[] } = {};
    this.data.forEach((val, key) => {
      snapshot[key] = val;
    });
    return snapshot;
  }

  /**
   * Add a new record
   */
  addRecord(table: string, record: any, source: string = 'User'): void {
    const records = this.data.get(table);
    if (!records) {
      this.onLog('warn', `SharedDataEngine: Attempted to write to non-existent table "${table}"`);
      return;
    }

    const completeRecord = {
      id: record.id || `rec-${Math.random().toString(36).substr(2, 9)}-${Date.now()}`,
      ...record
    };

    records.unshift(completeRecord);
    this.onLog('success', `SharedDataEngine: Record inserted into "${table}"`);

    // Fire Event Bus topic
    this.eventBus.publish(`data.record.created`, {
      table,
      record: completeRecord
    }, source);
  }

  /**
   * Remove a record by ID
   */
  deleteRecord(table: string, id: string, source: string = 'User'): void {
    const records = this.data.get(table);
    if (!records) return;

    const index = records.findIndex(r => r.id === id);
    if (index !== -1) {
      const removed = records.splice(index, 1)[0];
      this.onLog('success', `SharedDataEngine: Record deleted from "${table}"`);

      // Fire Event Bus topic
      this.eventBus.publish(`data.record.deleted`, {
        table,
        record: removed
      }, source);
    }
  }
}

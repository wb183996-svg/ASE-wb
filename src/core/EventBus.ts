/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CoreEvent } from './types';

type EventCallback = (event: CoreEvent) => void;

export class EventBus {
  private subscribers: Map<string, Set<EventCallback>> = new Map();
  private history: CoreEvent[] = [];
  private maxHistory: number = 100;
  private logCallback?: (event: CoreEvent) => void;

  constructor(onLog?: (event: CoreEvent) => void) {
    this.logCallback = onLog;
  }

  /**
   * Subscribe to a specific topic
   */
  subscribe(topic: string, callback: EventCallback): () => void {
    if (!this.subscribers.has(topic)) {
      this.subscribers.set(topic, new Set());
    }
    this.subscribers.get(topic)!.add(callback);

    // Return an unsubscribe function
    return () => {
      const subs = this.subscribers.get(topic);
      if (subs) {
        subs.delete(callback);
        if (subs.size === 0) {
          this.subscribers.delete(topic);
        }
      }
    };
  }

  /**
   * Publish an event to subscribers of a topic
   */
  publish(topic: string, payload: any, source: string): void {
    const event: CoreEvent = {
      id: 'evt-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now(),
      topic,
      payload,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      source
    };

    // Store in history
    this.history.unshift(event);
    if (this.history.length > this.maxHistory) {
      this.history.pop();
    }

    if (this.logCallback) {
      this.logCallback(event);
    }

    // Call subscribers
    const exactSubs = this.subscribers.get(topic);
    if (exactSubs) {
      exactSubs.forEach(callback => {
        try {
          callback(event);
        } catch (err) {
          console.error(`Error in event callback for topic ${topic}:`, err);
        }
      });
    }

    // Call wildcard subscribers (if topic is e.g. "finance.record.created", match "finance.*" or "*")
    this.subscribers.forEach((subs, subTopic) => {
      if (subTopic === '*') {
        subs.forEach(callback => callback(event));
      } else if (subTopic.endsWith('.*')) {
        const prefix = subTopic.slice(0, -2);
        if (topic.startsWith(prefix)) {
          subs.forEach(callback => callback(event));
        }
      }
    });
  }

  getHistory(): CoreEvent[] {
    return this.history;
  }

  clearHistory(): void {
    this.history = [];
  }
}

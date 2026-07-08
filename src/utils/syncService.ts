/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FinanceRecord, Goal, DailyActivity } from '../types';

/**
 * Frontend Service for synchronizing local state with Cloud SQL via the backend API.
 */
export class SyncService {
  private static getHeaders(token: string) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  /**
   * Sync and register/verify user profile with backend
   */
  public static async syncUserProfile(token: string): Promise<any> {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'GET',
        headers: this.getHeaders(token)
      });
      if (!response.ok) {
        throw new Error(`Failed to sync user profile: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Error syncing user profile:', error);
      throw error;
    }
  }

  /**
   * Fetch all finance records for the authenticated user from Cloud SQL
   */
  public static async fetchFinanceRecords(token: string): Promise<FinanceRecord[]> {
    try {
      const response = await fetch('/api/finance', {
        method: 'GET',
        headers: this.getHeaders(token)
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch finance records: ${response.statusText}`);
      }
      const data = await response.json();
      return data.records || [];
    } catch (error) {
      console.error('Error fetching finance records:', error);
      throw error;
    }
  }

  /**
   * Save a finance record to Cloud SQL
   */
  public static async saveFinanceRecord(token: string, record: FinanceRecord): Promise<FinanceRecord> {
    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(record)
      });
      if (!response.ok) {
        throw new Error(`Failed to save finance record: ${response.statusText}`);
      }
      const data = await response.json();
      return data.record;
    } catch (error) {
      console.error('Error saving finance record:', error);
      throw error;
    }
  }

  /**
   * Fetch all goals for the authenticated user from Cloud SQL
   */
  public static async fetchGoals(token: string): Promise<Goal[]> {
    try {
      const response = await fetch('/api/goals', {
        method: 'GET',
        headers: this.getHeaders(token)
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch goals: ${response.statusText}`);
      }
      const data = await response.json();
      return data.goals || [];
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  /**
   * Save a goal to Cloud SQL
   */
  public static async saveGoal(token: string, goal: Goal): Promise<Goal> {
    try {
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify(goal)
      });
      if (!response.ok) {
        throw new Error(`Failed to save goal: ${response.statusText}`);
      }
      const data = await response.json();
      return data.goal;
    } catch (error) {
      console.error('Error saving goal:', error);
      throw error;
    }
  }

  /**
   * Fetch all daily activities for the authenticated user from Cloud SQL
   */
  public static async fetchActivities(token: string): Promise<DailyActivity[]> {
    try {
      const response = await fetch('/api/activities', {
        method: 'GET',
        headers: this.getHeaders(token)
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch activities: ${response.statusText}`);
      }
      const data = await response.json();
      return data.activities || [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      throw error;
    }
  }

  /**
   * Save all daily activities to Cloud SQL
   */
  public static async saveActivities(token: string, activities: DailyActivity[]): Promise<void> {
    try {
      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: this.getHeaders(token),
        body: JSON.stringify({ activities })
      });
      if (!response.ok) {
        throw new Error(`Failed to sync activities: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error saving activities:', error);
      throw error;
    }
  }

  /**
   * Trigger complete full-sync of all models to/from Cloud SQL
   */
  public static async performFullSync(
    token: string,
    localState: {
      financeRecords: FinanceRecord[];
      goals: Goal[];
      activity: DailyActivity[];
    },
    stateUpdaters: {
      setFinanceRecords: (recs: FinanceRecord[]) => void;
      setGoals: (goals: Goal[]) => void;
      setActivity: (acts: DailyActivity[]) => void;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      // 1. Sync User Profile with Backend (auto registers in Postgres users table if not exists)
      await this.syncUserProfile(token);

      // 2. Bidirectional sync: Push local data to server first (safe because of server-side upserts)
      if (localState.financeRecords.length > 0) {
        for (const record of localState.financeRecords) {
          await this.saveFinanceRecord(token, record);
        }
      }

      if (localState.goals.length > 0) {
        for (const goal of localState.goals) {
          await this.saveGoal(token, goal);
        }
      }

      if (localState.activity.length > 0) {
        await this.saveActivities(token, localState.activity);
      }

      // 3. Pull unified, authoritative state from the server
      const [serverFinance, serverGoals, serverActivities] = await Promise.all([
        this.fetchFinanceRecords(token),
        this.fetchGoals(token),
        this.fetchActivities(token)
      ]);

      // 4. Update the client-side state
      stateUpdaters.setFinanceRecords(serverFinance);
      stateUpdaters.setGoals(serverGoals);
      stateUpdaters.setActivity(serverActivities);

      return { success: true, message: 'Sinkronisasi dua arah dengan Cloud SQL PostgreSQL berhasil dilakukan!' };
    } catch (error: any) {
      console.error('Full Sync failed:', error);
      return { success: false, message: error.message || 'Gagal menyinkronkan data.' };
    }
  }
}

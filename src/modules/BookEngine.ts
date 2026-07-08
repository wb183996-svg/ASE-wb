/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ALL_WORKBOOK_MODULES } from './WorkbookModules';
import { WorkbookModule, SharedData } from './ModuleContract';

export const BookEngine = {
  /**
   * Get all registered modules in the system
   */
  getAllModules(): WorkbookModule[] {
    return ALL_WORKBOOK_MODULES;
  },

  /**
   * Find a registered workbook module by ID
   */
  getModuleById(id: string): WorkbookModule | undefined {
    return ALL_WORKBOOK_MODULES.find(module => module.id === id);
  },

  /**
   * Filters the module registry for only those installed/downloaded by the user
   */
  getDownloadedModules(downloadedWbIds: string[]): WorkbookModule[] {
    return ALL_WORKBOOK_MODULES.filter(module => downloadedWbIds.includes(module.id));
  }
};

export interface AggregatedDashboard {
  totalLoggedEntries: number;
  totalStudyMinutes: number;
  unlockedBadgesCount: number;
  moduleMetrics: { [moduleId: string]: any };
  activeInsights: { moduleId: string; title: string; type: 'success' | 'warning' | 'info'; message: string }[];
  scores: {
    financialScore: number;
    habitScore: number;
    productivityScore: number;
    relationshipScore: number;
    businessScore: number;
    tradingScore: number;
  };
}

export const DashboardEngine = {
  /**
   * Aggregates Outputs across all active workbook modules to generate
   * the high-level Executive Summary state in a single Ringkasan.
   */
  aggregate(sharedData: SharedData, downloadedWbIds: string[], baseStudyMinutes: number): AggregatedDashboard {
    let totalLoggedEntries = 
      sharedData.financeRecords.length + 
      sharedData.taskRecords.length + 
      sharedData.habitRecords.length + 
      sharedData.crmRecords.length + 
      sharedData.tradingRecords.length +
      sharedData.okrRecords.length +
      sharedData.relationshipRecords.length;

    // Time investment matches logged entries (5 mins per logged entry) + base training tracker
    let totalStudyMinutes = baseStudyMinutes + (totalLoggedEntries * 5);

    // Compute metrics for each installed module dynamically using each module's processEngine
    const moduleMetrics: { [moduleId: string]: any } = {};
    const activeInsights: { moduleId: string; title: string; type: 'success' | 'warning' | 'info'; message: string }[] = [];

    const activeModules = BookEngine.getDownloadedModules(downloadedWbIds);
    
    activeModules.forEach(mod => {
      // Run modular process engine
      const processed = mod.processEngine(sharedData);
      moduleMetrics[mod.id] = processed;

      // Extract modular insight dynamically
      const insight = mod.getInsight(sharedData, processed);
      activeInsights.push({
        moduleId: mod.id,
        title: mod.metadata.title,
        type: insight.type,
        message: insight.message
      });
    });

    // Compute ASE Scores
    // 1. Financial Score
    const fin = moduleMetrics['wb-keuangan'];
    let financialScore = 75; // default fallback
    if (fin) {
      const savingContribution = Math.min((fin.tabuPct || 0) / 20, 1) * 40;
      const wantsContribution = Math.max(1 - Math.max((fin.keingPct || 0) - 30, 0) / 30, 0) * 30;
      const balanceContribution = fin.balance >= 0 ? 30 : Math.max(10, 30 + (fin.balance / 1000000));
      financialScore = Math.round(savingContribution + wantsContribution + balanceContribution);
    } else if (sharedData.financeRecords.length > 0) {
      const income = sharedData.financeRecords.filter(r => r.type === 'pemasukan').reduce((a, b) => a + b.amount, 0);
      const expense = sharedData.financeRecords.filter(r => r.type === 'pengeluaran').reduce((a, b) => a + b.amount, 0);
      financialScore = income >= expense ? 85 : 55;
    }

    // 2. Habit Score
    const hab = moduleMetrics['wb-habit'];
    let habitScore = 60; // default
    if (sharedData.habitRecords.length > 0) {
      const maxStreak = hab ? hab.maxStreak : 0;
      habitScore = Math.round(Math.min(sharedData.habitRecords.length * 15, 55) + Math.min(maxStreak * 8, 45));
    }

    // 3. Productivity Score
    const plan = moduleMetrics['wb-planner'];
    let productivityScore = 70; // default
    if (plan && plan.totalCount > 0) {
      productivityScore = plan.focusScore;
    } else if (sharedData.taskRecords.length > 0) {
      const completed = sharedData.taskRecords.filter(t => t.completed).length;
      productivityScore = Math.round((completed / sharedData.taskRecords.length) * 100);
    }

    // 4. Relationship Score
    const rel = moduleMetrics['wb-relationship'];
    let relationshipScore = 80; // default
    if (rel && rel.totalCount > 0) {
      relationshipScore = rel.avgMeter;
    } else if (sharedData.relationshipRecords.length > 0) {
      const totalMeter = sharedData.relationshipRecords.reduce((acc, r) => acc + r.statusMeter, 0);
      relationshipScore = Math.round(totalMeter / sharedData.relationshipRecords.length);
    }

    // 5. Business Score (CRM)
    const crm = moduleMetrics['wb-crm'];
    let businessScore = 50; // default
    if (crm) {
      const wonValue = crm.wonCrmTotal || 0;
      const wonContribution = Math.min(wonValue / 10000000, 1) * 60;
      const pipelineContribution = Math.min((sharedData.crmRecords.length) * 15, 40);
      businessScore = Math.round(wonContribution + pipelineContribution);
    } else if (sharedData.crmRecords.length > 0) {
      const won = sharedData.crmRecords.filter(r => r.status === 'Won').length;
      businessScore = Math.round((won / sharedData.crmRecords.length) * 100);
    }

    // 6. Trading Score
    const trd = moduleMetrics['wb-trading'];
    let tradingScore = 50; // default
    if (trd) {
      const totalTradesCount = sharedData.tradingRecords.length;
      const wins = sharedData.tradingRecords.filter(t => t.profit > 0).length;
      const wr = totalTradesCount > 0 ? (wins / totalTradesCount) * 100 : 0;
      tradingScore = Math.round(wr * 0.6 + Math.min(totalTradesCount * 10, 40));
    } else if (sharedData.tradingRecords.length > 0) {
      const totalT = sharedData.tradingRecords.length;
      const wins = sharedData.tradingRecords.filter(t => t.profit > 0).length;
      tradingScore = Math.round(((wins / totalT) * 60) + Math.min(totalT * 10, 40));
    }

    // Compute achievements (badges) unlocked dynamically
    // 1. Connectivity badge (is active workbooks > 0)
    // 2. Finance discipline (records >= 3)
    // 3. Planner focus (completed tasks >= 2)
    // 4. CRM synergy (won deal >= 5M)
    // 5. Trader discipline (total trades >= 2 and win rate >= 50%)
    let unlockedBadgesCount = 0;
    if (downloadedWbIds.length >= 1) unlockedBadgesCount++;
    if (sharedData.financeRecords.length >= 3) unlockedBadgesCount++;
    const completedTasks = sharedData.taskRecords.filter(t => t.completed).length;
    if (completedTasks >= 2) unlockedBadgesCount++;
    const wonCrmTotal = sharedData.crmRecords.filter(r => r.status === 'Won').reduce((a, b) => a + b.dealValue, 0);
    if (wonCrmTotal >= 5000000) unlockedBadgesCount++;
    const totalTrades = sharedData.tradingRecords.length;
    const profitableTrades = sharedData.tradingRecords.filter(t => t.profit > 0).length;
    const tradingWinRate = totalTrades > 0 ? Math.round((profitableTrades / totalTrades) * 100) : 0;
    if (totalTrades >= 2 && tradingWinRate >= 50) unlockedBadgesCount++;

    return {
      totalLoggedEntries,
      totalStudyMinutes,
      unlockedBadgesCount,
      moduleMetrics,
      activeInsights,
      scores: {
        financialScore,
        habitScore,
        productivityScore,
        relationshipScore,
        businessScore,
        tradingScore
      }
    };
  }
};

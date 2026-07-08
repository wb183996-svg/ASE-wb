/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  FinanceRecord, 
  TaskRecord, 
  HabitRecord, 
  CrmRecord, 
  TradingRecord, 
  OkrRecord, 
  RelationshipRecord, 
  SharedContact 
} from '../types';

export interface SharedData {
  financeRecords: FinanceRecord[];
  taskRecords: TaskRecord[];
  habitRecords: HabitRecord[];
  crmRecords: CrmRecord[];
  tradingRecords: TradingRecord[];
  okrRecords: OkrRecord[];
  relationshipRecords: RelationshipRecord[];
  sharedContacts: SharedContact[];
}

export interface SharedDataMutators {
  setFinanceRecords: React.Dispatch<React.SetStateAction<FinanceRecord[]>>;
  setTaskRecords: React.Dispatch<React.SetStateAction<TaskRecord[]>>;
  setHabitRecords: React.Dispatch<React.SetStateAction<HabitRecord[]>>;
  setCrmRecords: React.Dispatch<React.SetStateAction<CrmRecord[]>>;
  setTradingRecords: React.Dispatch<React.SetStateAction<TradingRecord[]>>;
  setOkrRecords: React.Dispatch<React.SetStateAction<OkrRecord[]>>;
  setRelationshipRecords: React.Dispatch<React.SetStateAction<RelationshipRecord[]>>;
  setSharedContacts: React.Dispatch<React.SetStateAction<SharedContact[]>>;
}

export interface WorkbookModule {
  id: string;
  metadata: {
    title: string;
    description: string;
    category: string;
    coverGradient: string;
    version: string;
    author: string;
    iconName: string; // e.g. 'DollarSign', 'CheckSquare', 'Flame', etc.
  };

  // 1. Process Engine: Computes statistics and key metrics from the shared database
  processEngine: (sharedData: SharedData) => any;

  // 2. Input Component: Renders forms to record data
  renderInput: (props: {
    sharedData: SharedData;
    mutators: SharedDataMutators;
    triggerSuccess: (msg: string) => void;
    themeColor: string;
  }) => React.ReactNode;

  // 3. Output Component: Shows primary analysis, charts, calculations
  renderOutput: (props: {
    sharedData: SharedData;
    processed: any;
    themeColor: string;
  }) => React.ReactNode;

  // 4. Dashboard (Compact Widget): Mini card view displayed in Ringkasan Dashboard
  renderDashboard: (props: {
    sharedData: SharedData;
    processed: any;
    onNavigate: () => void;
    themeColor: string;
  }) => React.ReactNode;

  // 5. Insight: Context-aware recommendations or triggers based on process output
  getInsight: (sharedData: SharedData, processed: any) => {
    type: 'success' | 'warning' | 'info';
    message: string;
  };

  // 6. Riwayat (History): Lists the workbook's historical transactions with delete capabilities
  renderRiwayat: (props: {
    sharedData: SharedData;
    mutators: SharedDataMutators;
    triggerSuccess: (msg: string) => void;
  }) => React.ReactNode;
}

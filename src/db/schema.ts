import { pgTable, serial, text, integer, boolean, timestamp, doublePrecision } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define the 'users' table (linked to Firebase Auth UID)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'module_registry' table (mandated by platform spec / SQL proofs)
export const moduleRegistry = pgTable('module_registry', {
  id: text('id').primaryKey(), // UUID/unique key
  name: text('name').notNull(),
  version: text('version').notNull(),
  category: text('category').notNull(), // 'workbook' | 'theme' | 'language' | 'icon'
  author: text('author').notNull(),
  publisherId: text('publisher_id').notNull(),
  description: text('description'),
  size: text('size'),
  permissions: text('permissions'), // JSON-string of array
  signature: text('signature'),
  isVerified: boolean('is_verified').default(false),
  price: integer('price').default(0),
  minLicenseRequired: text('min_license_required'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'shared_service_registry' table (mandated by platform spec / SQL proofs)
export const sharedServiceRegistry = pgTable('shared_service_registry', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  serviceType: text('service_type').notNull(), // e.g. 'Identity', 'License', etc.
  endpoint: text('endpoint'),
  status: text('status').default('active'),
  metadata: text('metadata'), // JSON-string of custom key-values
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'finance_records' table
export const financeRecords = pgTable('finance_records', {
  id: text('id').primaryKey(), // ID prefixed with 'fin-'
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  type: text('type').notNull(), // 'pemasukan' | 'pengeluaran' | 'tabungan' | 'hutang'
  category: text('category').notNull(),
  amount: doublePrecision('amount').notNull(),
  date: text('date').notNull(), // YYYY-MM-DD
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'goals' table
export const goals = pgTable('goals', {
  id: text('id').primaryKey(), // ID prefixed with 'goal-'
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  workbookId: text('workbook_id').notNull(),
  workbookTitle: text('workbook_title').notNull(),
  name: text('name').notNull(),
  target: text('target').notNull(),
  progress: integer('progress').default(0).notNull(), // 0 to 100
  deadline: text('deadline').notNull(), // YYYY-MM-DD
  status: text('status').default('Sedang Berjalan').notNull(), // 'Sedang Berjalan' | 'Tercapai' | 'Tertunda'
  recommendation: text('recommendation'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define 'daily_activities' table
export const dailyActivities = pgTable('daily_activities', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  day: text('day').notNull(), // 'Sen', 'Sel', etc.
  minutes: integer('minutes').default(0).notNull(),
  completedTasks: integer('completed_tasks').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relations for each table
export const usersRelations = relations(users, ({ many }) => ({
  financeRecords: many(financeRecords),
  goals: many(goals),
  dailyActivities: many(dailyActivities),
}));

export const financeRecordsRelations = relations(financeRecords, ({ one }) => ({
  user: one(users, {
    fields: [financeRecords.userId],
    references: [users.id],
  }),
}));

export const goalsRelations = relations(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id],
  }),
}));

export const dailyActivitiesRelations = relations(dailyActivities, ({ one }) => ({
  user: one(users, {
    fields: [dailyActivities.userId],
    references: [users.id],
  }),
}));

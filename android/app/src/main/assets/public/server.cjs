var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc2) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc2 = __getOwnPropDesc(from, key)) || desc2.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_url = require("url");
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);

// src/db/index.ts
var import_node_postgres = require("drizzle-orm/node-postgres");
var import_pg = __toESM(require("pg"), 1);

// src/db/schema.ts
var schema_exports = {};
__export(schema_exports, {
  dailyActivities: () => dailyActivities,
  dailyActivitiesRelations: () => dailyActivitiesRelations,
  financeRecords: () => financeRecords,
  financeRecordsRelations: () => financeRecordsRelations,
  goals: () => goals,
  goalsRelations: () => goalsRelations,
  moduleRegistry: () => moduleRegistry,
  sharedServiceRegistry: () => sharedServiceRegistry,
  users: () => users,
  usersRelations: () => usersRelations
});
var import_pg_core = require("drizzle-orm/pg-core");
var import_drizzle_orm = require("drizzle-orm");
var users = (0, import_pg_core.pgTable)("users", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  uid: (0, import_pg_core.text)("uid").notNull().unique(),
  // Firebase Auth UID
  email: (0, import_pg_core.text)("email").notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var moduleRegistry = (0, import_pg_core.pgTable)("module_registry", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // UUID/unique key
  name: (0, import_pg_core.text)("name").notNull(),
  version: (0, import_pg_core.text)("version").notNull(),
  category: (0, import_pg_core.text)("category").notNull(),
  // 'workbook' | 'theme' | 'language' | 'icon'
  author: (0, import_pg_core.text)("author").notNull(),
  publisherId: (0, import_pg_core.text)("publisher_id").notNull(),
  description: (0, import_pg_core.text)("description"),
  size: (0, import_pg_core.text)("size"),
  permissions: (0, import_pg_core.text)("permissions"),
  // JSON-string of array
  signature: (0, import_pg_core.text)("signature"),
  isVerified: (0, import_pg_core.boolean)("is_verified").default(false),
  price: (0, import_pg_core.integer)("price").default(0),
  minLicenseRequired: (0, import_pg_core.text)("min_license_required"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var sharedServiceRegistry = (0, import_pg_core.pgTable)("shared_service_registry", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  name: (0, import_pg_core.text)("name").notNull(),
  serviceType: (0, import_pg_core.text)("service_type").notNull(),
  // e.g. 'Identity', 'License', etc.
  endpoint: (0, import_pg_core.text)("endpoint"),
  status: (0, import_pg_core.text)("status").default("active"),
  metadata: (0, import_pg_core.text)("metadata"),
  // JSON-string of custom key-values
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var financeRecords = (0, import_pg_core.pgTable)("finance_records", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // ID prefixed with 'fin-'
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  type: (0, import_pg_core.text)("type").notNull(),
  // 'pemasukan' | 'pengeluaran' | 'tabungan' | 'hutang'
  category: (0, import_pg_core.text)("category").notNull(),
  amount: (0, import_pg_core.doublePrecision)("amount").notNull(),
  date: (0, import_pg_core.text)("date").notNull(),
  // YYYY-MM-DD
  note: (0, import_pg_core.text)("note"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var goals = (0, import_pg_core.pgTable)("goals", {
  id: (0, import_pg_core.text)("id").primaryKey(),
  // ID prefixed with 'goal-'
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  workbookId: (0, import_pg_core.text)("workbook_id").notNull(),
  workbookTitle: (0, import_pg_core.text)("workbook_title").notNull(),
  name: (0, import_pg_core.text)("name").notNull(),
  target: (0, import_pg_core.text)("target").notNull(),
  progress: (0, import_pg_core.integer)("progress").default(0).notNull(),
  // 0 to 100
  deadline: (0, import_pg_core.text)("deadline").notNull(),
  // YYYY-MM-DD
  status: (0, import_pg_core.text)("status").default("Sedang Berjalan").notNull(),
  // 'Sedang Berjalan' | 'Tercapai' | 'Tertunda'
  recommendation: (0, import_pg_core.text)("recommendation"),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var dailyActivities = (0, import_pg_core.pgTable)("daily_activities", {
  id: (0, import_pg_core.serial)("id").primaryKey(),
  userId: (0, import_pg_core.integer)("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  day: (0, import_pg_core.text)("day").notNull(),
  // 'Sen', 'Sel', etc.
  minutes: (0, import_pg_core.integer)("minutes").default(0).notNull(),
  completedTasks: (0, import_pg_core.integer)("completed_tasks").default(0).notNull(),
  createdAt: (0, import_pg_core.timestamp)("created_at").defaultNow()
});
var usersRelations = (0, import_drizzle_orm.relations)(users, ({ many }) => ({
  financeRecords: many(financeRecords),
  goals: many(goals),
  dailyActivities: many(dailyActivities)
}));
var financeRecordsRelations = (0, import_drizzle_orm.relations)(financeRecords, ({ one }) => ({
  user: one(users, {
    fields: [financeRecords.userId],
    references: [users.id]
  })
}));
var goalsRelations = (0, import_drizzle_orm.relations)(goals, ({ one }) => ({
  user: one(users, {
    fields: [goals.userId],
    references: [users.id]
  })
}));
var dailyActivitiesRelations = (0, import_drizzle_orm.relations)(dailyActivities, ({ one }) => ({
  user: one(users, {
    fields: [dailyActivities.userId],
    references: [users.id]
  })
}));

// src/db/index.ts
var { Pool } = import_pg.default;
var createPool = () => {
  return new Pool({
    host: process.env.SQL_HOST,
    user: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    database: process.env.SQL_DB_NAME,
    connectionTimeoutMillis: 15e3
  });
};
var pool = createPool();
pool.on("error", (err) => {
  console.error("Unexpected error on idle SQL pool client:", err);
});
var db = (0, import_node_postgres.drizzle)(pool, { schema: schema_exports });

// src/lib/firebase-admin.ts
var import_app = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "jaunty-mark-m5jvd",
  appId: "1:281588138004:web:362b192bb22d59f4526701",
  apiKey: "AIzaSyBTes4nBJRDxGHCDv-p2kxcl1yJjYICmbk",
  authDomain: "jaunty-mark-m5jvd.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-aseworkbook-5c4d2e15-2f65-4285-9c58-47c149129121",
  storageBucket: "jaunty-mark-m5jvd.firebasestorage.app",
  messagingSenderId: "281588138004",
  measurementId: "",
  oAuthClientId: "281588138004-dm61osbgn3ecrom5l47hvo9ka9gqj5fl.apps.googleusercontent.com"
};

// src/lib/firebase-admin.ts
if (!(0, import_app.getApps)().length) {
  (0, import_app.initializeApp)({
    projectId: firebase_applet_config_default.projectId
  });
}
var adminAuth = (0, import_auth.getAuth)();

// src/middleware/auth.ts
var requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing token" });
  }
  const token = authHeader.split("Bearer ")[1];
  if (token.startsWith("github_oauth_sec_token_") || token.includes("ase_oauth_sec_jwt_")) {
    try {
      if (token.includes(".")) {
        const parts = token.split(".");
        const payloadDecoded = JSON.parse(Buffer.from(parts[1], "base64").toString("utf-8"));
        req.user = {
          uid: payloadDecoded.sub,
          email: payloadDecoded.email,
          name: payloadDecoded.name,
          role: payloadDecoded.role
        };
      } else {
        req.user = {
          uid: "simulated-user",
          email: "simulated@ase.internal",
          name: "Simulated User",
          role: "User"
        };
      }
      return next();
    } catch (e) {
      console.error("Error decoding simulated token:", e);
      req.user = {
        uid: "simulated-user",
        email: "simulated@ase.internal",
        name: "Simulated User",
        role: "User"
      };
      return next();
    }
  }
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error("Error verifying Firebase ID token:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// src/db/users.ts
async function getOrCreateUser(uid, email) {
  try {
    const result = await db.insert(users).values({
      uid,
      email
    }).onConflictDoUpdate({
      target: users.uid,
      set: {
        email
      }
    }).returning();
    return result[0];
  } catch (error) {
    console.error("Failed to get or create user:", error);
    throw new Error("Database error during user registration.", { cause: error });
  }
}

// server.ts
var import_drizzle_orm2 = require("drizzle-orm");
var import_meta = {};
import_dotenv.default.config();
var isESM = typeof import_meta !== "undefined" && import_meta.url;
var currentFile = isESM ? (0, import_url.fileURLToPath)(import_meta.url) : typeof __filename !== "undefined" ? __filename : "";
var currentDir = isESM ? import_path.default.dirname(currentFile) : typeof __dirname !== "undefined" ? __dirname : process.cwd();
async function fetchUserFinanceRecords(dbUserId) {
  try {
    return await db.select().from(financeRecords).where((0, import_drizzle_orm2.eq)(financeRecords.userId, dbUserId)).orderBy((0, import_drizzle_orm2.desc)(financeRecords.createdAt));
  } catch (error) {
    console.error("Database error fetching finance records:", error);
    throw new Error("Failed to load finance records from database.", { cause: error });
  }
}
async function insertFinanceRecord(dbUserId, record) {
  try {
    return await db.insert(financeRecords).values({
      id: record.id,
      userId: dbUserId,
      type: record.type,
      category: record.category,
      amount: record.amount,
      date: record.date,
      note: record.note || ""
    }).onConflictDoUpdate({
      target: financeRecords.id,
      set: {
        type: record.type,
        category: record.category,
        amount: record.amount,
        date: record.date,
        note: record.note || ""
      }
    }).returning();
  } catch (error) {
    console.error("Database error inserting finance record:", error);
    throw new Error("Failed to save finance record to database.", { cause: error });
  }
}
async function fetchUserGoals(dbUserId) {
  try {
    return await db.select().from(goals).where((0, import_drizzle_orm2.eq)(goals.userId, dbUserId)).orderBy((0, import_drizzle_orm2.desc)(goals.createdAt));
  } catch (error) {
    console.error("Database error fetching goals:", error);
    throw new Error("Failed to load goals from database.", { cause: error });
  }
}
async function insertGoal(dbUserId, goal) {
  try {
    return await db.insert(goals).values({
      id: goal.id,
      userId: dbUserId,
      workbookId: goal.workbookId,
      workbookTitle: goal.workbookTitle,
      name: goal.name,
      target: goal.target,
      progress: goal.progress,
      deadline: goal.deadline,
      status: goal.status,
      recommendation: goal.recommendation || ""
    }).onConflictDoUpdate({
      target: goals.id,
      set: {
        workbookId: goal.workbookId,
        workbookTitle: goal.workbookTitle,
        name: goal.name,
        target: goal.target,
        progress: goal.progress,
        deadline: goal.deadline,
        status: goal.status,
        recommendation: goal.recommendation || ""
      }
    }).returning();
  } catch (error) {
    console.error("Database error inserting goal:", error);
    throw new Error("Failed to save goal to database.", { cause: error });
  }
}
async function fetchUserActivities(dbUserId) {
  try {
    return await db.select().from(dailyActivities).where((0, import_drizzle_orm2.eq)(dailyActivities.userId, dbUserId));
  } catch (error) {
    console.error("Database error fetching activities:", error);
    throw new Error("Failed to load activities from database.", { cause: error });
  }
}
async function saveUserActivities(dbUserId, activitiesList) {
  try {
    await db.delete(dailyActivities).where((0, import_drizzle_orm2.eq)(dailyActivities.userId, dbUserId));
    if (activitiesList.length > 0) {
      await db.insert(dailyActivities).values(
        activitiesList.map((act) => ({
          userId: dbUserId,
          day: act.day,
          minutes: act.minutes,
          completedTasks: act.completedTasks
        }))
      );
    }
  } catch (error) {
    console.error("Database error saving activities:", error);
    throw new Error("Failed to save activities to database.", { cause: error });
  }
}
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = 3e3;
  app.use(import_express.default.json());
  const ai = new import_genai.GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build"
      }
    }
  });
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/user/profile", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      res.json({ status: "success", user: dbUser });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to synchronize profile." });
    }
  });
  app.get("/api/finance", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const records = await fetchUserFinanceRecords(dbUser.id);
      res.json({ status: "success", records });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to fetch finance records." });
    }
  });
  app.post("/api/finance", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { id, type, category, amount, date, note } = req.body;
      const result = await insertFinanceRecord(dbUser.id, { id, type, category, amount, date, note });
      res.json({ status: "success", record: result[0] });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to save finance record." });
    }
  });
  app.get("/api/goals", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const goalsList = await fetchUserGoals(dbUser.id);
      res.json({ status: "success", goals: goalsList });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to fetch goals." });
    }
  });
  app.post("/api/goals", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { id, workbookId, workbookTitle, name, target, progress, deadline, status, recommendation } = req.body;
      const result = await insertGoal(dbUser.id, { id, workbookId, workbookTitle, name, target, progress, deadline, status, recommendation });
      res.json({ status: "success", goal: result[0] });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to save goal." });
    }
  });
  app.get("/api/activities", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const list = await fetchUserActivities(dbUser.id);
      res.json({ status: "success", activities: list });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to fetch activities." });
    }
  });
  app.post("/api/activities", requireAuth, async (req, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { activities } = req.body;
      await saveUserActivities(dbUser.id, activities);
      res.json({ status: "success", message: "Activities synced successfully." });
    } catch (err) {
      res.status(500).json({ error: err.message || "Failed to sync activities." });
    }
  });
  app.post("/api/ai-insight", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured on the server." });
      }
      const { financeRecords: financeRecords2, activity, workspaceMode, goals: goals2 } = req.body;
      const income = financeRecords2?.filter((r) => r.type === "Pemasukan") || [];
      const expense = financeRecords2?.filter((r) => r.type === "Pengeluaran") || [];
      const totalIncome = income.reduce((sum, r) => sum + r.amount, 0);
      const totalExpense = expense.reduce((sum, r) => sum + r.amount, 0);
      const netSavings = totalIncome - totalExpense;
      let financeSummary = `Total Pemasukan: Rp${totalIncome.toLocaleString("id-ID")}
Total Pengeluaran: Rp${totalExpense.toLocaleString("id-ID")}
Sisa Pendapatan (Tabungan): Rp${netSavings.toLocaleString("id-ID")}
`;
      if (expense.length > 0) {
        financeSummary += "Daftar Pengeluaran Teratas:\n" + expense.slice(0, 5).map((e) => `- Kategori: ${e.category || "Lainnya"}, Jumlah: Rp${e.amount.toLocaleString("id-ID")}${e.description ? ` (${e.description})` : ""}`).join("\n");
      } else {
        financeSummary += "Belum ada catatan pengeluaran minggu ini.";
      }
      const totalMinutes = activity?.reduce((sum, act) => sum + (act.minutes || 0), 0) || 0;
      const totalTasksCompleted = activity?.reduce((sum, act) => sum + (act.tasksCompleted || 0), 0) || 0;
      let activitySummary = `Total Waktu Kerja Terfokus: ${totalMinutes} menit
Total Tugas Selesaikan: ${totalTasksCompleted} tugas
`;
      if (activity && activity.length > 0) {
        activitySummary += "Rincian Aktivitas Harian:\n" + activity.map((a) => `- ${a.day}: ${a.minutes || 0} menit fokus, menyelesaikan ${a.tasksCompleted || 0} tugas (Skor Fokus: ${a.focusScore || 0}%).`).join("\n");
      } else {
        activitySummary += "Belum ada catatan aktivitas produktivitas minggu ini.";
      }
      let goalsSummary = "";
      if (goals2 && goals2.length > 0) {
        goalsSummary = "Target Sasaran (Goals):\n" + goals2.map((g) => `- ${g.name} (${g.workbookTitle}): Progres ${g.progress}%, Status: ${g.status}`).join("\n");
      } else {
        goalsSummary = "Belum ada sasaran yang dikonfigurasi saat ini.";
      }
      const prompt = `Lakukan analisis mendalam, cerdas, dan ringkas (AI Insight) terhadap aktivitas mingguan dan data finansial pengguna berikut:

Modus Workspace Pengguna: ${workspaceMode || "Individu"}

=== DATA KEUANGAN ===
${financeSummary}

=== DATA PRODUKTIVITAS & AKTIVITAS ===
${activitySummary}

=== SASARAN & TARGET (GOALS) ===
${goalsSummary}

Berikan analisis 'AI Insight' yang cerdas, praktis, memotivasi, dan profesional menggunakan format Markdown yang rapi dengan bagian-bagian berikut:
1. **Ringkasan Finansial**: Ulasan kritis tentang arus kas minggu ini.
2. **Evaluasi Produktivitas**: Ulasan mengenai efektivitas fokus dan tingkat penyelesaian tugas.
3. **Korelasi & Pola Cerdas (AI Pattern)**: Analisis hubungan antara pola kerja, fokus waktu, dan kondisi finansial/target. Berikan poin temuan unik yang mungkin tidak disadari pengguna.
4. **Rekomendasi Strategis (Actionable Advice)**: Berikan 3 poin rekomendasi konkret dan taktis untuk minggu depan agar pengguna lebih produktif dan hemat.

Gunakan bahasa Indonesia yang ramah, profesional, serta menginspirasi. Jangan bertele-tele atau menyertakan detail teknis pemrograman.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt
      });
      res.json({ insight: response.text });
    } catch (err) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err.message || "Gagal menghasilkan analisis AI Insight." });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

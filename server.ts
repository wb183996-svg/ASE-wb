import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Import database, schemas, helpers, and auth middleware
import { db } from "./src/db/index.ts";
import { users, financeRecords, goals, dailyActivities } from "./src/db/schema.ts";
import { requireAuth, AuthRequest } from "./src/middleware/auth.ts";
import { getOrCreateUser } from "./src/db/users.ts";
import { eq, desc } from "drizzle-orm";

// Load environment variables
dotenv.config();

// Support both ESM and CJS safely
const isESM = typeof import.meta !== "undefined" && import.meta.url;
const currentFile = isESM ? fileURLToPath(import.meta.url) : (typeof __filename !== "undefined" ? __filename : "");
const currentDir = isESM ? path.dirname(currentFile) : (typeof __dirname !== "undefined" ? __dirname : process.cwd());

// Database query layer helpers with robust error handling
async function fetchUserFinanceRecords(dbUserId: number) {
  try {
    return await db.select()
      .from(financeRecords)
      .where(eq(financeRecords.userId, dbUserId))
      .orderBy(desc(financeRecords.createdAt));
  } catch (error) {
    console.error("Database error fetching finance records:", error);
    throw new Error("Failed to load finance records from database.", { cause: error });
  }
}

async function insertFinanceRecord(dbUserId: number, record: { id: string, type: string, category: string, amount: number, date: string, note?: string }) {
  try {
    return await db.insert(financeRecords)
      .values({
        id: record.id,
        userId: dbUserId,
        type: record.type,
        category: record.category,
        amount: record.amount,
        date: record.date,
        note: record.note || '',
      })
      .onConflictDoUpdate({
        target: financeRecords.id,
        set: {
          type: record.type,
          category: record.category,
          amount: record.amount,
          date: record.date,
          note: record.note || '',
        }
      })
      .returning();
  } catch (error) {
    console.error("Database error inserting finance record:", error);
    throw new Error("Failed to save finance record to database.", { cause: error });
  }
}

async function fetchUserGoals(dbUserId: number) {
  try {
    return await db.select()
      .from(goals)
      .where(eq(goals.userId, dbUserId))
      .orderBy(desc(goals.createdAt));
  } catch (error) {
    console.error("Database error fetching goals:", error);
    throw new Error("Failed to load goals from database.", { cause: error });
  }
}

async function insertGoal(dbUserId: number, goal: { id: string, workbookId: string, workbookTitle: string, name: string, target: string, progress: number, deadline: string, status: string, recommendation?: string }) {
  try {
    return await db.insert(goals)
      .values({
        id: goal.id,
        userId: dbUserId,
        workbookId: goal.workbookId,
        workbookTitle: goal.workbookTitle,
        name: goal.name,
        target: goal.target,
        progress: goal.progress,
        deadline: goal.deadline,
        status: goal.status,
        recommendation: goal.recommendation || '',
      })
      .onConflictDoUpdate({
        target: goals.id,
        set: {
          workbookId: goal.workbookId,
          workbookTitle: goal.workbookTitle,
          name: goal.name,
          target: goal.target,
          progress: goal.progress,
          deadline: goal.deadline,
          status: goal.status,
          recommendation: goal.recommendation || '',
        }
      })
      .returning();
  } catch (error) {
    console.error("Database error inserting goal:", error);
    throw new Error("Failed to save goal to database.", { cause: error });
  }
}

async function fetchUserActivities(dbUserId: number) {
  try {
    return await db.select()
      .from(dailyActivities)
      .where(eq(dailyActivities.userId, dbUserId));
  } catch (error) {
    console.error("Database error fetching activities:", error);
    throw new Error("Failed to load activities from database.", { cause: error });
  }
}

async function saveUserActivities(dbUserId: number, activitiesList: { day: string, minutes: number, completedTasks: number }[]) {
  try {
    await db.delete(dailyActivities).where(eq(dailyActivities.userId, dbUserId));
    if (activitiesList.length > 0) {
      await db.insert(dailyActivities).values(
        activitiesList.map(act => ({
          userId: dbUserId,
          day: act.day,
          minutes: act.minutes,
          completedTasks: act.completedTasks,
        }))
      );
    }
  } catch (error) {
    console.error("Database error saving activities:", error);
    throw new Error("Failed to save activities to database.", { cause: error });
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser for JSON
  app.use(express.json());

  // Initialize Gemini client using official SDK guidelines
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API Endpoint: Health Check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Endpoint: Authenticated Profile & User Sync
  app.get("/api/user/profile", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      res.json({ status: "success", user: dbUser });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to synchronize profile." });
    }
  });

  // API Endpoint: Get and Create Finance Records
  app.get("/api/finance", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const records = await fetchUserFinanceRecords(dbUser.id);
      res.json({ status: "success", records });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch finance records." });
    }
  });

  app.post("/api/finance", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { id, type, category, amount, date, note } = req.body;
      const result = await insertFinanceRecord(dbUser.id, { id, type, category, amount, date, note });
      res.json({ status: "success", record: result[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save finance record." });
    }
  });

  // API Endpoint: Get and Create Goals
  app.get("/api/goals", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const goalsList = await fetchUserGoals(dbUser.id);
      res.json({ status: "success", goals: goalsList });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch goals." });
    }
  });

  app.post("/api/goals", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { id, workbookId, workbookTitle, name, target, progress, deadline, status, recommendation } = req.body;
      const result = await insertGoal(dbUser.id, { id, workbookId, workbookTitle, name, target, progress, deadline, status, recommendation });
      res.json({ status: "success", goal: result[0] });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to save goal." });
    }
  });

  // API Endpoint: Get and Save Daily Activities
  app.get("/api/activities", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const list = await fetchUserActivities(dbUser.id);
      res.json({ status: "success", activities: list });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to fetch activities." });
    }
  });

  app.post("/api/activities", requireAuth, async (req: AuthRequest, res) => {
    try {
      const email = req.user.email || `${req.user.uid}@ase.internal`;
      const dbUser = await getOrCreateUser(req.user.uid, email);
      const { activities } = req.body;
      await saveUserActivities(dbUser.id, activities);
      res.json({ status: "success", message: "Activities synced successfully." });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to sync activities." });
    }
  });

  // API Endpoint: AI Insight Generator
  app.post("/api/ai-insight", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured on the server." });
      }

      const { financeRecords, activity, workspaceMode, goals } = req.body;

      // Compile financial records summary
      const income = financeRecords?.filter((r: any) => r.type === 'Pemasukan') || [];
      const expense = financeRecords?.filter((r: any) => r.type === 'Pengeluaran') || [];
      const totalIncome = income.reduce((sum: number, r: any) => sum + r.amount, 0);
      const totalExpense = expense.reduce((sum: number, r: any) => sum + r.amount, 0);
      const netSavings = totalIncome - totalExpense;

      let financeSummary = `Total Pemasukan: Rp${totalIncome.toLocaleString('id-ID')}\nTotal Pengeluaran: Rp${totalExpense.toLocaleString('id-ID')}\nSisa Pendapatan (Tabungan): Rp${netSavings.toLocaleString('id-ID')}\n`;
      if (expense.length > 0) {
        financeSummary += "Daftar Pengeluaran Teratas:\n" + expense.slice(0, 5).map((e: any) => `- Kategori: ${e.category || 'Lainnya'}, Jumlah: Rp${e.amount.toLocaleString('id-ID')}${e.description ? ` (${e.description})` : ''}`).join('\n');
      } else {
        financeSummary += "Belum ada catatan pengeluaran minggu ini.";
      }

      // Compile activity and focus minutes
      const totalMinutes = activity?.reduce((sum: number, act: any) => sum + (act.minutes || 0), 0) || 0;
      const totalTasksCompleted = activity?.reduce((sum: number, act: any) => sum + (act.tasksCompleted || 0), 0) || 0;
      
      let activitySummary = `Total Waktu Kerja Terfokus: ${totalMinutes} menit\nTotal Tugas Selesaikan: ${totalTasksCompleted} tugas\n`;
      if (activity && activity.length > 0) {
        activitySummary += "Rincian Aktivitas Harian:\n" + activity.map((a: any) => `- ${a.day}: ${a.minutes || 0} menit fokus, menyelesaikan ${a.tasksCompleted || 0} tugas (Skor Fokus: ${a.focusScore || 0}%).`).join('\n');
      } else {
        activitySummary += "Belum ada catatan aktivitas produktivitas minggu ini.";
      }

      // Compile goals
      let goalsSummary = "";
      if (goals && goals.length > 0) {
        goalsSummary = "Target Sasaran (Goals):\n" + goals.map((g: any) => `- ${g.name} (${g.workbookTitle}): Progres ${g.progress}%, Status: ${g.status}`).join('\n');
      } else {
        goalsSummary = "Belum ada sasaran yang dikonfigurasi saat ini.";
      }

      const prompt = `Lakukan analisis mendalam, cerdas, dan ringkas (AI Insight) terhadap aktivitas mingguan dan data finansial pengguna berikut:

Modus Workspace Pengguna: ${workspaceMode || 'Individu'}

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
        contents: prompt,
      });

      res.json({ insight: response.text });
    } catch (err: any) {
      console.error("Gemini API error:", err);
      res.status(500).json({ error: err.message || "Gagal menghasilkan analisis AI Insight." });
    }
  });

  // Serve static assets / Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

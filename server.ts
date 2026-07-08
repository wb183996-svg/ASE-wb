import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Support both ESM and CJS safely
const isESM = typeof import.meta !== "undefined" && import.meta.url;
const currentFile = isESM ? fileURLToPath(import.meta.url) : (typeof __filename !== "undefined" ? __filename : "");
const currentDir = isESM ? path.dirname(currentFile) : (typeof __dirname !== "undefined" ? __dirname : process.cwd());

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

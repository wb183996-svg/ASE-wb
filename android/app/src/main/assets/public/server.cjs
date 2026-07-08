var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
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
var import_meta = {};
import_dotenv.default.config();
var __filename = (0, import_url.fileURLToPath)(import_meta.url);
var __dirname = import_path.default.dirname(__filename);
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
  app.post("/api/ai-insight", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is not configured on the server." });
      }
      const { financeRecords, activity, workspaceMode, goals } = req.body;
      const income = financeRecords?.filter((r) => r.type === "Pemasukan") || [];
      const expense = financeRecords?.filter((r) => r.type === "Pengeluaran") || [];
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
      if (goals && goals.length > 0) {
        goalsSummary = "Target Sasaran (Goals):\n" + goals.map((g) => `- ${g.name} (${g.workbookTitle}): Progres ${g.progress}%, Status: ${g.status}`).join("\n");
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

import React from 'react';
import { BookOpen, Database, BarChart3, ChevronRight, PlusCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface SplashScreenProps {
  onDismiss: () => void;
  themeColor: string;
}

export default function SplashScreen({ onDismiss }: SplashScreenProps) {
  return (
    <div className="absolute inset-0 bg-white flex flex-col justify-between p-6 z-50 overflow-hidden">
      {/* Top Graphic Background Ornaments - soft green blobs */}
      <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-50 blur-xl"></div>
      <div className="absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-emerald-50/50 blur-2xl"></div>

      {/* Header Logo & Slogan */}
      <div className="pt-12 text-center relative z-10 flex flex-col items-center">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center border border-emerald-400 mb-4 shadow-md shadow-emerald-200"
        >
          <BookOpen className="w-11 h-11 text-white" />
        </motion.div>
        
        <motion.h1 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-3xl font-extrabold tracking-tight text-slate-800"
        >
          ASE Workbook
        </motion.h1>
        
        <motion.p 
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-emerald-600 text-sm mt-2 max-w-xs font-semibold tracking-wide"
        >
          "Satu Aplikasi, Banyak Workbook"
        </motion.p>
      </div>

      {/* Feature Slider / Highlights */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100 mx-2 shadow-sm"
      >
        <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
          Tiga Fitur Utama
        </h3>

        {/* Feature 1 */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0">
            <PlusCircle className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">1. Tambahkan Workbook</h4>
            <p className="text-xs text-slate-500 mt-0.5">Tambahkan berbagai workbook modular sesuai kebutuhan hidup dan pekerjaan Anda.</p>
          </div>
        </div>

        {/* Feature 2 */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0">
            <Database className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">2. Data Terhubung</h4>
            <p className="text-xs text-slate-500 mt-0.5">Seluruh catatan, riwayat input, dan data terhubung terintegrasi secara otomatis.</p>
          </div>
        </div>

        {/* Feature 3 */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-100 rounded-xl shrink-0">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
          </div>
          <div>
            <h4 className="text-sm font-extrabold text-slate-800">3. Ringkasan Otomatis</h4>
            <p className="text-xs text-slate-500 mt-0.5">Dapatkan ringkasan performa kerja, evaluasi target, dan keputusan strategis secara berkala.</p>
          </div>
        </div>
      </motion.div>

      {/* Bottom Button Action */}
      <div className="pb-8 flex flex-col items-center gap-3 relative z-10">
        <motion.button
          id="btn-splash-continue"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          whileTap={{ scale: 0.98 }}
          onClick={onDismiss}
          className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-center flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 transition-all cursor-pointer"
        >
          Mulai
          <ChevronRight className="w-5 h-5" />
        </motion.button>
        
        <span className="text-[10px] text-slate-400 font-bold tracking-wider">
          ASE WORKBOOK • MODULAR PLATFORM
        </span>
      </div>
    </div>
  );
}

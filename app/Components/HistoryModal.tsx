"use client";
import React from "react";
import {
  X,
  History as HistoryIcon,
  Calendar,
  ArrowDownCircle,
  TrendingUp,
} from "lucide-react";
import { motion } from "framer-motion";

/**
 * HISTORY MODAL COMPONENT (STANDALONE)
 *
 * Instructions:
 * 1. Import this into your main page.
 * 2. Use <AnimatePresence> around it for smooth transitions.
 * 3. Pass the 'history' array and 'onClose' function.
 *
 * Data Format:
 * history = [{ payBy: string, amountPaid: number, createdAt: string }]
 */

export const HistoryModal = ({
  history,
  onClose,
}: {
  history: any[];
  onClose: () => void;
}) => {
  const totalCollected =
    history?.reduce((acc, curr) => acc + Number(curr.amountPaid || 0), 0) || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      className="relative w-full max-w-lg bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="p-8 max-h-[85vh] flex flex-col">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <HistoryIcon size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Payment History</h3>
              <p className="text-sm text-muted-foreground leading-tight">
                Detailed collection records
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          >
            <X size={20} />
          </button>
        </div>

        {/* Stats Summary (Mini) */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">
              Total Collected
            </p>
            <p className="text-xl font-black text-emerald-600">
              ₱{totalCollected}
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">
              Transactions
            </p>
            <p className="text-xl font-black text-primary">
              {history?.length || 0}
            </p>
          </div>
        </div>

        {/* List Section */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
          {history && history.length > 0 ? (
            history
              .sort((a, b) => {
                if (b.createdAt < a.createdAt) return -1;
                if (b.createdAt > a.createdAt) return 1;
                return 0;
              })
              .map((record, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group flex items-center justify-between p-4 rounded-2xl bg-secondary/20 border border-transparent hover:border-primary/20 hover:bg-secondary/40 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <ArrowDownCircle size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold">
                          {record.payBy || "Anonymous"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                        <Calendar size={12} />
                        <span className="text-[11px] font-medium">
                          {/* Specified Format: April 14 2026 */}
                          {new Date(record.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            },
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-black text-emerald-600">
                      +₱{(record.amountPaid || 0).toFixed(2)}
                    </p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-tighter">
                      Verified
                    </p>
                  </div>
                </motion.div>
              ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center opacity-30">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <HistoryIcon size={32} strokeWidth={1} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest">
                No history yet
              </p>
            </div>
          )}
        </div>

        {/* Bottom Action */}
        <div className="mt-8 pt-4">
          <button
            onClick={onClose}
            className="w-full py-4 bg-secondary hover:bg-secondary/80 rounded-2xl font-bold text-sm transition-all active:scale-[0.98]"
          >
            Back to Dashboard
          </button>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
      `}</style>
    </motion.div>
  );
};

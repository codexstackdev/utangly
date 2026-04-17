"use client";

import { useState } from "react";
import {
  Edit2,
  Plus,
  CreditCard,
  CheckCircle2,
  Tag,
  Trash2,
  ShoppingBag,
  X,
  PlusCircle,
  Clock,
  ArrowDownRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type HistoryProps = {
  payBy: string;
  amountPaid: number;
  createdAt: string;
};

const formatCurrency = new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "PHP",
      trailingZeroDisplay: 'stripIfInteger'
    })

export const PersonCard = ({
  name,
  totalDebt,
  items,
  status,
  history,
  onPay,
}: {
  name: string;
  totalDebt: number;
  items: any[];
  status: "paid" | "not paid";
  history: HistoryProps[];
  onPay: () => void;
}) => {
  const isPaid = status === "paid";
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`bg-card border rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-all ${
          isPaid ? "border-emerald-500/30 shadow-emerald-500/5" : "border-border"
        }`}
      >
        <div
          className={`p-6 border-b flex items-center justify-between transition-colors ${
            isPaid
              ? "bg-emerald-500/5 border-emerald-500/20"
              : "bg-secondary/10 border-border"
          }`}
        >
          <div className="flex items-center gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-lg transition-all ${
                isPaid
                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                  : "bg-primary text-primary-foreground shadow-primary/10"
              }`}
            >
              {isPaid ? <CheckCircle2 size={28} /> : name.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-lg leading-none flex items-center gap-2">
                {name}
                {isPaid && (
                  <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Paid
                  </span>
                )}
              </h3>
              <p
                className={`font-bold text-sm mt-1.5 transition-colors ${
                  isPaid ? "text-emerald-600" : "text-rose-500"
                }`}
              >
                {isPaid ? "Fully Settled" : `${formatCurrency.format(totalDebt)}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2.5 rounded-xl hover:bg-secondary transition-colors text-muted-foreground">
              <Edit2 size={18} />
            </button>
          </div>
        </div>

        <div className="p-6 flex-1">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {isPaid ? "Last Transaction" : "Current Dues"}
            </h4>
            {!isPaid && (
              <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline bg-primary/5 px-3 py-1.5 rounded-full">
                <Plus size={14} /> Add Item
              </button>
            )}
          </div>
          <div className="space-y-4">
            {items.length > 0 ? (
              items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between group/item"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold border border-border/50">
                      {item.quantity}x
                    </div>
                    <p
                      className={`text-sm font-semibold ${isPaid ? "text-muted-foreground line-through" : ""}`}
                    >
                      {item.itemName}
                    </p>
                  </div>
                  <p
                    className={`text-sm font-bold ${isPaid ? "text-muted-foreground" : ""}`}
                  >
                    {formatCurrency.format(item.price)}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center opacity-30">
                <ShoppingBag size={32} strokeWidth={1.5} />
                <p className="text-[10px] font-bold mt-2 uppercase tracking-widest">
                  No active dues
                </p>
              </div>
            )}
          </div>
        </div>

        <div
          className={`p-5 border-t flex gap-3 transition-colors ${
            isPaid
              ? "bg-emerald-500/5 border-emerald-500/10"
              : "bg-secondary/5 border-border"
          }`}
        >
          <button
            onClick={onPay}
            disabled={isPaid}
            className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
              isPaid
                ? "bg-secondary text-muted-foreground cursor-not-allowed shadow-none"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-emerald-600/10"
            }`}
          >
            {isPaid ? <CheckCircle2 size={18} /> : <CreditCard size={18} />}
            <span>{isPaid ? "All Paid" : "Pay Debt"}</span>
          </button>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors text-muted-foreground active:scale-[0.98]"
          >
            <History size={20} />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHistoryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsHistoryOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 pb-0 flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Payment History</h3>
                    <p className="text-sm text-muted-foreground leading-tight">
                      {name}'s transactions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="p-2 rounded-xl hover:bg-secondary transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-6 pt-5">
                <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-2xl border border-border/50">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Total Payments
                    </p>
                    <p className="text-2xl font-black text-primary mt-0.5">
                      {history.length}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Amount Paid
                    </p>
                    <p className="text-2xl font-black text-emerald-600 mt-0.5">
                      {formatCurrency.format(history
                        .reduce((sum, h) => sum + h.amountPaid, 0))}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 max-h-72 overflow-y-auto custom-scrollbar">
                {history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((entry, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-border/50 hover:bg-secondary/60 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                            <ArrowDownRight size={18} />
                          </div>
                          <div>
                            <p className="text-sm font-bold">{entry.payBy}</p>
                            <p className="text-[10px] text-muted-foreground mt-0.5">
                              {new Date(entry.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm font-black text-emerald-600">
                          +{formatCurrency.format(entry.amountPaid)}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                    <Clock size={40} strokeWidth={1.5} />
                    <p className="text-xs font-bold mt-3 uppercase tracking-widest">
                      No payment history
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Payments will appear here
                    </p>
                  </div>
                )}
              </div>

              <div className="p-5 border-t border-border">
                <button
                  onClick={() => setIsHistoryOpen(false)}
                  className="w-full py-4 rounded-2xl bg-secondary text-foreground font-bold hover:bg-secondary/80 transition-all active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const ItemCard = ({
  itemName,
  quantity,
  price,
  onEdit,
}: {
  itemName: string;
  quantity: number;
  price: number;
  onEdit: () => void;
}) => {
  const isSoldOut = quantity <= 0;

  return (
    <motion.div
      whileHover={{ x: isSoldOut ? 0 : 4 }}
      className={`relative flex items-center justify-between p-4 rounded-xl border transition-all group overflow-hidden ${
        isSoldOut
          ? "bg-secondary/20 border-border opacity-60 grayscale"
          : "bg-card border-border hover:border-primary/30 cursor-pointer"
      }`}
    >
      <div className="flex items-center gap-3 relative z-10">
        <div
          className={`p-2.5 rounded-lg transition-colors ${isSoldOut ? "bg-muted" : "bg-secondary group-hover:bg-primary/10"}`}
        >
          <Tag
            size={16}
            className={
              isSoldOut
                ? "text-muted-foreground"
                : "group-hover:text-primary transition-colors"
            }
          />
        </div>
        <div>
          <p
            className={`text-sm font-semibold leading-none ${isSoldOut ? "line-through text-muted-foreground" : ""}`}
          >
            {itemName}
          </p>
          <div className="flex items-center gap-2 mt-1.5">
            <p className="text-xs font-bold text-primary">
              {formatCurrency.format(price)}
            </p>
            <span className="text-[10px] text-muted-foreground">•</span>
            <p
              className={`text-[10px] font-bold ${isSoldOut ? "text-rose-500" : "text-muted-foreground"}`}
            >
              {isSoldOut ? "SOLD OUT" : `${quantity} in stock`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 relative z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit();
          }}
          className="p-2.5 rounded-lg text-primary bg-primary/5 border border-primary/10 hover:bg-primary/20 transition-all sm:opacity-0 sm:group-hover:opacity-100 opacity-100"
        >
          <Edit2 size={16} />
        </button>
      </div>

      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[40px] font-black text-foreground/3 rotate-12 select-none uppercase tracking-tighter">
            Sold Out
          </span>
        </div>
      )}
    </motion.div>
  );
};

export const EditItemModal = ({
  item,
  onClose,
  onDelete,
  onUpdate,
}: {
  item: any;
  onClose: () => void;
  onDelete: () => void;
  onUpdate: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
  >
    <div className="flex justify-between items-start mb-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
          <ShoppingBag size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Edit Item</h3>
          <p className="text-sm text-muted-foreground leading-tight">
            Update product details
          </p>
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-2 rounded-xl hover:bg-secondary transition-colors"
      >
        <X size={20} />
      </button>
    </div>

    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold ml-1">Item Name</label>
          <input
            defaultValue={item?.itemName}
            type="text"
            className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Price</label>
            <input
              defaultValue={item?.price}
              type="number"
              className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold ml-1">Stock</label>
            <input
              defaultValue={item?.quantity}
              type="number"
              className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={onUpdate}
          className="w-full bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
        >
          <PlusCircle size={24} /> <span>Update Item</span>
        </button>
        <button
          onClick={onDelete}
          className="w-full bg-rose-500/10 text-rose-500 py-4 rounded-[1.5rem] font-bold hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center gap-2"
        >
          <Trash2 size={18} />
          <span>Delete Item</span>
        </button>
      </div>
    </div>
  </motion.div>
);

const History = ({ size, className }: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M12 7v5l4 2" />
  </svg>
);
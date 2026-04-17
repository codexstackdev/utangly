"use client";

import { useState } from "react";
import { Tag, Trash2, PencilIcon, X, Save, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { deleteItem, editItem } from "../hooks/actions";
import { toast } from "sonner";
import { setUserStore } from "../store";

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
  userId: string;
};

type ItemDataProps = {
  price: number;
  quantity: number;
  _id: string;
};

const ItemCard = ({ itemName, quantity, price, _id, userId }: ItemProps) => {
  const isSoldOut = quantity <= 0;
  const removeItem = setUserStore((s) => s.removeItem);

  const editStateItem = setUserStore((s) => s.editItem);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editPrice, setEditPrice] = useState(price);
  const [editQuantity, setEditQuantity] = useState(quantity);
  const [loading, setLoading] = useState(false);
  const formatCurrency = new Intl.NumberFormat('en-US', {
      style: "currency",
      currency: "PHP",
      trailingZeroDisplay: 'stripIfInteger'
    })

  const handleDeleteItem = async () => {
    setLoading(true);
    try {
      const data = await deleteItem(_id, userId);
      if (data.success) {
        removeItem(_id);
        toast.success(data.message);
        setIsDeleteOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditItem = async () => {
    if (editPrice <= 0 || editQuantity <= 0) {
      toast.error("Values cannot be negative");
      return;
    }
    setLoading(true);
    try {
      const data = await editItem(editPrice, editQuantity, _id, userId);
      if (data.success) {
        const replaceItem:ItemDataProps = {
          price: editPrice,
          quantity: editQuantity,
          _id: _id,
        }
        toast.success(data.message);
        editStateItem(replaceItem);
        setIsEditOpen(false);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update item");
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    setEditPrice(price);
    setEditQuantity(quantity);
    setIsEditOpen(true);
  };

  return (
    <>
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
              <p className="text-xs font-bold text-primary">{formatCurrency.format(price)}</p>
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
            onClick={openEdit}
            className="p-2 rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all "
          >
            <PencilIcon size={16} />
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all "
          >
            <Trash2 size={16} />
          </button>
        </div>

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-[40px] font-black text-foreground/3 rotate-12 select-none">
              OUT OF STOCK
            </span>
          </div>
        )}
      </motion.div>

      {/* EDIT MODAL */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsEditOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-5 border-b border-border">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    Edit Item
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {itemName}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Price (₱)
                  </label>
                  <input
                    type="string"
                    value={editPrice}
                    onChange={(e) => setEditPrice(Number(e.target.value) | 1)}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Quantity
                  </label>
                  <input
                    type="string"
                    value={editQuantity}
                    onChange={(e) => setEditQuantity(Number(e.target.value) | 1)}
                    className="mt-1.5 w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-sm font-medium text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 p-5 pt-0">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditItem}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Save size={14} />
                  {loading ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isDeleteOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsDeleteOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-sm bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 text-center space-y-3">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    damping: 15,
                    stiffness: 200,
                    delay: 0.1,
                  }}
                  className="mx-auto w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center"
                >
                  <AlertTriangle size={22} className="text-rose-500" />
                </motion.div>
                <h2 className="text-base font-bold text-foreground">
                  Delete Item
                </h2>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                    {itemName}
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>

              <div className="flex items-center gap-2 p-5 pt-0">
                <button
                  onClick={() => setIsDeleteOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteItem}
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500 text-white text-sm font-semibold hover:bg-rose-600 disabled:opacity-50 transition-colors"
                >
                  <Trash2 size={14} />
                  {loading ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ItemCard;

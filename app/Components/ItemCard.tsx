"use client";
import { Tag, Trash2, PencilIcon } from "lucide-react";
import { motion } from "motion/react";
import { deleteItem } from "../hooks/actions";
import { toast } from "sonner";
import { setUserStore } from "../store";

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
  userId: string;
};

const ItemCard = ({ itemName, quantity, price, _id, userId }: ItemProps) => {
  const isSoldOut = quantity <= 0;
  const removeItem = setUserStore((s) => s.removeItem);
  const replaceUser = setUserStore((s) => s.setUser);

  const handleDeleteItem = async () => {
    try {
      const data = await deleteItem(_id, userId);
      if (data.success) {
        removeItem(_id);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

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
            <p className="text-xs font-bold text-primary">₱{price}</p>
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
        {!isSoldOut && (
          <button
            onClick={handleDeleteItem}
            className="p-2 rounded-lg text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={16} />
          </button>
        )}
        {isSoldOut && (
          <div onClick={() => alert("WIP")} className="p-2 text-white-500">
            <PencilIcon size={16} />
          </div>
        )}
      </div>

      {/* SOLD OUT OVERLAY TEXT (SUBTLE) */}
      {isSoldOut && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-[40px] font-black text-foreground/3 rotate-12 select-none">
            OUT OF STOCK
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ItemCard;

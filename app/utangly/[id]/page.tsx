"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Edit2,
  UserPlus,
  Package,
  CreditCard,
  Search,
  CheckCircle2,
  Menu,
  X,
  Wallet,
  User,
  ShoppingBag,
  LogOut,
  ChevronDown,
  ChevronUp,
  Minus,
  Boxes,
} from "lucide-react";
import { addDebtor, addItem, getUser, logout, payDebt } from "@/app/hooks/actions";
import { toast } from "sonner";
import { useParams, useRouter } from "next/navigation";
import { setUserStore } from "@/app/store";
import { Spinner } from "@/components/ui/spinner";
import ItemCard from "@/app/Components/ItemCard";

/**
 * UTANG MANAGEMENT PAGE (INVENTORY & DEBT TRACKER)
 *
 * Features:
 * - Inventory System: Items now have quantities and "Sold Out" states.
 * - Catalog Actions: Remove items directly from the sidebar with a trash icon.
 * - Refined Person Modal: Includes item selection with live totals.
 * - Theme-Aware UI: Full support for light and dark modes.
 */

type ItemProps = {
  itemName: string;
  quantity: number;
  price: number;
  _id: string;
  createdAt: string;
};

const placeholderUsers = [
  {
    name: "Zyrill Lewis",
    totalDebt: 250,
    items: [
      { name: "Sardines", qty: 2, price: 120 },
      { name: "Cheeze whiz", qty: 4, price: 12 },
    ],
  },
  {
    name: "John Doe",
    totalDebt: 85,
    items: [
      { name: "Mineral Water", qty: 1, price: 25 },
      { name: "Rice (1kg)", qty: 1, price: 60 },
    ],
  },
];

const UtangManagementPage = () => {
  const params = useParams();
  const userId = String(params.id);
  const user = setUserStore((s) => s.user);
  const setUser = setUserStore((s) => s.setUser);
  const setItem = setUserStore((s) => s.addItem);
  const clearUser = setUserStore((s) => s.clearUser);
  const [loading, setLoading] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>(
    {},
  );
  const [activeModal, setActiveModal] = useState<
    "payment" | "person" | "item" | null
  >(null);
  const [isItemDropdownOpen, setIsItemDropdownOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedItem, setSelectedItem] = useState<ItemProps[]>([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  const [debtorData, setDebtorData] = useState({
    fullName: "",
    totalDebt: selectedItem.reduce((acc, item) => acc + (item.price * item.quantity), 0),
    item: selectedItem,
  })
  const [itemData, setItemData] = useState({
    item: "",
    qty: 0,
    price: 0,
  });
  const [paymentData, setPaymentData] = useState({
    payBy: "",
    amount: 0 
  });

  useEffect(() => {
    if (user) return;
    const getData = async () => {
      const data = await getUser(userId);
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message);
      }
    };
    getData();
  }, []);

  const handleItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDebtorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDebtorData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
    const { name, value } = e.target;
    setPaymentData((prev) => ({...prev, [name]:value}));
  }

  const closeModal = () => {
    setActiveModal(null);
    setSelectedUser(null);
    setIsItemDropdownOpen(false);
  };
  const handleAddItem = async () => {
    setLoading(true);
    try {
      const data = await addItem(
        itemData.item,
        itemData.price,
        userId,
        itemData.qty,
      );
      if (data.success) {
        const itemUpdate: ItemProps = {
          itemName: itemData.item,
          quantity: itemData.qty,
          price: itemData.price,
          _id: userId,
          createdAt: new Date().toISOString(),
        };
        setItem(itemUpdate);
        toast.success(data.message);
        setItemData({
          item: "",
          qty: 0,
          price: 0,
        });
        setActiveModal(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const data = await logout();
      if (data.success) {
        toast.success(data.message);
        router.push("/");
        clearUser();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddDebtors = async () => {
    try {
      const data = await addDebtor(debtorData.fullName, selectedItem, userId, selectedItem.reduce((acc, item) => acc + (item.price * item.quantity), 0));
      if(data.success){
        toast.success(data.message);
      }
      else{
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async()=>{
    try {
      if(paymentData.amount > selectedUser.totalDebt) return toast.error("Payment exceeded debt");
      const data = await payDebt(paymentData.payBy || selectedUser.fullName, paymentData.amount, selectedUser.totalDebt, userId, selectedUser._id);
      if(data.success){
        toast.success(data.message);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const searchItem = user?.items
    .filter((item) =>
      item.itemName.toLowerCase().trim().includes(search.toLowerCase().trim()),
    )
    .sort((a, b) => {
      if (b.createdAt < a.createdAt) return -1;
      if (b.createdAt > a.createdAt) return 1;
      return 0;
    });
  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col lg:flex-row overflow-x-hidden">
      {/* MOBILE HEADER */}
      <div className="lg:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Package size={18} />
          </div>
          <span className="font-bold">Utangly</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCatalogOpen(!isCatalogOpen)}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 transition-colors"
          >
            {isCatalogOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* SIDEBAR: ITEM CATALOG */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:z-0
        ${isCatalogOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="h-full flex flex-col p-6 gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package size={20} />
              </div>
              <h2 className="font-bold text-lg">Catalog</h2>
            </div>
            <button
              onClick={() => setActiveModal("item")}
              className="p-2 rounded-full bg-primary text-primary-foreground hover:scale-110 transition-transform"
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={16}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search items..."
              className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-transparent rounded-xl focus:bg-background focus:border-primary/30 outline-none text-sm transition-all"
            />
          </div>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-1 custom-scrollbar">
            {searchItem?.map((item, idx) => (
              <ItemCard
                key={idx}
                itemName={item.itemName}
                price={item.price}
                quantity={item.quantity}
                _id={item._id}
                userId={userId}
              />
            ))}
            {(!searchItem || searchItem.length === 0) && (
              <div className="flex flex-col items-center justify-center py-10 text-center opacity-40">
                <Boxes size={40} strokeWidth={1.5} />
                <p className="text-xs font-bold mt-2 uppercase tracking-widest">
                  No items found
                </p>
              </div>
            )}
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-500 transition-all font-bold"
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col gap-8 max-w-400 mx-auto w-full">
        <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Debtors
            </h1>
            <p className="text-muted-foreground">
              Manage people and track their dues.
            </p>
          </div>
          <button
            onClick={() => setActiveModal("person")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <UserPlus size={20} />
            <span>Add Person</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
          {user?.debtors.map((user, idx) => (
            <PersonCard
              key={idx}
              name={user.fullName}
              totalDebt={user.totalDebt}
              items={user.items}
              onPay={() => {
                setSelectedUser(user);
                setActiveModal("payment");
              }}
            />
          ))}
        </div>
      </main>

      {/* MODALS CONTAINER */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-card border border-border rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Modal Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        activeModal === "payment"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : activeModal === "person"
                            ? "bg-blue-500/10 text-blue-600"
                            : "bg-amber-500/10 text-amber-600"
                      }`}
                    >
                      {activeModal === "payment" && <Wallet size={24} />}
                      {activeModal === "person" && <User size={24} />}
                      {activeModal === "item" && <ShoppingBag size={24} />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        {activeModal === "payment" && "Record Payment"}
                        {activeModal === "person" && "Add New Person"}
                        {activeModal === "item" && "Add New Item"}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-tight">
                        {activeModal === "payment" &&
                          `For ${selectedUser?.fullName}`}
                        {activeModal === "person" &&
                          "Enter details and pick items"}
                        {activeModal === "item" && "Add product to catalog"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl hover:bg-secondary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-6">
                  {activeModal === "payment" && (
                    <>
                      <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                          Current Balance
                        </p>
                        <p className="text-2xl font-black text-rose-500">
                          ₱{selectedUser?.totalDebt}
                        </p>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold ml-1">
                          Payer Name Default: {selectedUser?.fullName}(optional)
                        </label>
                        <div className="relative group">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl text-muted-foreground group-focus-within:text-primary transition-colors">
                            <User />
                          </span>
                          <input
                            value={paymentData.payBy}
                            onChange={handlePaymentChange}
                            type="text"
                            name="payBy"
                            placeholder={`eg.${selectedUser?.fullName}`}
                            className="w-full pl-12 pr-6 py-5 bg-secondary/50 border-2 border-transparent rounded-[1.5rem] focus:bg-background focus:border-primary/30 outline-none text-2xl font-bold transition-all"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold ml-1">
                          Payment Amount
                        </label>
                        <div className="relative group">
                          <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-xl text-muted-foreground group-focus-within:text-primary transition-colors">
                            ₱
                          </span>
                          <input
                            type="number"
                            name="amount"
                            onChange={handlePaymentChange}
                            value={paymentData.amount}
                            placeholder="0.00"
                            min={0}
                            max={selectedUser.totalDebt}
                            className="w-full pl-12 pr-6 py-5 bg-secondary/50 border-2 border-transparent rounded-[1.5rem] focus:bg-background focus:border-primary/30 outline-none text-2xl font-bold transition-all"
                          />
                        </div>
                      </div>
                      <button onClick={handlePayment} className="w-full bg-emerald-600 text-white py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-3">
                        <CheckCircle2 size={24} /> <span>Confirm Payment</span>
                      </button>
                    </>
                  )}

                  {activeModal === "person" && (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold ml-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="fullName"
                            value={debtorData.fullName}
                            onChange={handleDebtorChange}
                            placeholder="e.g. Maria Clara"
                            className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
                          />
                        </div>

                        {/* ITEM SELECTION DROPDOWN */}
                        <div className="space-y-2 relative">
                          <label className="text-sm font-bold ml-1">
                            Add Items
                          </label>
                          <button
                            onClick={() =>
                              setIsItemDropdownOpen(!isItemDropdownOpen)
                            }
                            className="w-full flex items-center justify-between px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl hover:border-primary/20 transition-all text-muted-foreground"
                          >
                            <span className="text-sm">
                              Pick from catalog...
                            </span>
                            {isItemDropdownOpen ? (
                              <ChevronUp size={18} />
                            ) : (
                              <ChevronDown size={18} />
                            )}
                          </button>

                          <AnimatePresence>
                            {isItemDropdownOpen && (
                              <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="absolute z-10 top-full left-0 right-0 mt-2 bg-card border border-border rounded-2xl shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar"
                              >
                                {user?.items.map((item, idx) => {
                                  const qty = itemQuantities[item._id] || 1;
                                  return (
                                    <div
                                      key={idx}
                                      className={`w-full flex items-center justify-between p-4 border-b border-border last:border-0 ${item.quantity <= 0 ? "opacity-50 pointer-events-none" : ""}`}
                                    >
                                      <div className="flex flex-col flex-1 min-w-0">
                                        <span className="text-sm font-medium truncate">
                                          {item.itemName}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground">
                                          Stock: {item.quantity}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-sm font-bold text-primary">
                                          ₱{item.price}
                                        </span>

                                        <div className="flex items-center gap-1 bg-secondary rounded-xl px-1 py-0.5">
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setItemQuantities((prev) => ({
                                                ...prev,
                                                [item._id]: Math.max(
                                                  1,
                                                  (prev[item._id] || 1) - 1,
                                                ),
                                              }));
                                            }}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold"
                                          >
                                            −
                                          </button>
                                          <input
                                            type="number"
                                            value={qty}
                                            onChange={(e) => {
                                              const val = Math.max(
                                                1,
                                                Math.min(
                                                  item.quantity,
                                                  Number(e.target.value) || 1,
                                                ),
                                              );
                                              setItemQuantities((prev) => ({
                                                ...prev,
                                                [item._id]: val,
                                              }));
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            min={1}
                                            max={item.quantity}
                                            className="w-10 text-center text-sm font-semibold bg-transparent text-foreground focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          />
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setItemQuantities((prev) => ({
                                                ...prev,
                                                [item._id]: Math.min(
                                                  item.quantity,
                                                  (prev[item._id] || 1) + 1,
                                                ),
                                              }));
                                            }}
                                            className="w-7 h-7 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors text-sm font-bold"
                                          >
                                            +
                                          </button>
                                        </div>

                                        <button
                                          disabled={item.quantity <= 0}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const selected: ItemProps = {
                                              itemName: item.itemName,
                                              quantity: qty,
                                              price: item.price,
                                              _id: item._id,
                                              createdAt: item.createdAt,
                                            };
                                            setSelectedItem((prev) => [
                                              ...prev,
                                              selected,
                                            ]);
                                            setItemQuantities((prev) => ({
                                              ...prev,
                                              [item._id]: 1,
                                            }));
                                            setIsItemDropdownOpen(false);
                                          }}
                                          className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 disabled:opacity-50 transition-colors"
                                        >
                                          Add
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* SELECTED ITEMS LIST */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">
                            Selected Items
                          </p>
                          <div className="space-y-2">
                            {selectedItem.map((item) => (
                              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                                    {item.quantity}x
                                  </div>
                                  <span className="text-sm font-semibold">
                                    {item.itemName}
                                  </span>
                                </div>
                                <div className="flex items-center gap-3">
                                  <span className="text-sm font-bold">
                                    ₱{item.price}
                                  </span>
                                  <button
                                    onClick={() =>
                                      setSelectedItem((prev) =>
                                        prev.filter(
                                          (old) => old._id !== item._id,
                                        ),
                                      )
                                    }
                                    className="p-1 rounded-md hover:bg-rose-500/10 text-rose-500 transition-colors"
                                  >
                                    <Minus size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center pt-2 px-1 border-t border-border border-dashed">
                            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                              Initial Total
                            </span>
                            <span className="text-lg font-black text-primary">
                              ₱
                              {selectedItem.reduce(
                                (acc, item) => acc + item.price * item.quantity,
                                0,
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button onClick={handleAddDebtors} className="w-full bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                        <UserPlus size={24} /> <span>Create Person</span>
                      </button>
                    </>
                  )}

                  {activeModal === "item" && (
                    <>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold ml-1">
                            Item Name
                          </label>
                          <input
                            name="item"
                            value={itemData.item}
                            onChange={handleItemChange}
                            type="text"
                            placeholder="e.g. Lucky Me Noodles"
                            className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">
                              Price
                            </label>
                            <div className="relative group">
                              <span className="absolute left-5 top-1/2 -translate-y-1/2 font-bold text-muted-foreground group-focus-within:text-primary transition-colors">
                                ₱
                              </span>
                              <input
                                name="price"
                                value={itemData.price}
                                onChange={handleItemChange}
                                type="number"
                                placeholder="0.00"
                                className="w-full pl-10 pr-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-bold ml-1">
                              Stock
                            </label>
                            <input
                              name="qty"
                              value={itemData.qty}
                              onChange={handleItemChange}
                              type="number"
                              placeholder="0"
                              className="w-full px-5 py-4 bg-secondary/50 border-2 border-transparent rounded-2xl focus:bg-background focus:border-primary/30 outline-none font-medium transition-all"
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={handleAddItem}
                        disabled={loading}
                        className="w-full bg-primary text-primary-foreground py-5 rounded-[1.5rem] font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                      >
                        {loading ? (
                          <Spinner className="size-5" />
                        ) : (
                          <>
                            <Plus size={24} /> <span>Add to Catalog</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
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
    </div>
  );
};

const PersonCard = ({
  name,
  totalDebt,
  items,
  onPay,
}: {
  name: string;
  totalDebt: number;
  items: any[];
  onPay: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-card border border-border rounded-[2.5rem] overflow-hidden shadow-sm flex flex-col h-full hover:shadow-md transition-shadow"
  >
    <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/10">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl shadow-lg shadow-primary/10">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-lg leading-none">{name}</h3>
          <p className="text-rose-500 font-bold text-sm mt-1.5">
            ₱{totalDebt.toFixed(2)}
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
          Current Dues
        </h4>
        <button className="text-xs font-bold text-primary flex items-center gap-1.5 hover:underline bg-primary/5 px-3 py-1.5 rounded-full">
          <Plus size={14} /> Add Item
        </button>
      </div>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between group/item">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold border border-border/50">
                {item.quantity}x
              </div>
              <p className="text-sm font-semibold">{item.itemName}</p>
            </div>
            <p className="text-sm font-bold">₱{item.price}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="p-5 bg-secondary/5 border-t border-border flex gap-3">
      <button
        onClick={onPay}
        className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 text-white py-4 rounded-2xl font-bold hover:bg-emerald-700 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg shadow-emerald-600/10"
      >
        <CreditCard size={18} />
        <span>Pay Debt</span>
      </button>
      <button className="p-4 rounded-2xl border border-border bg-card hover:bg-secondary transition-colors text-muted-foreground active:scale-[0.98]">
        <History size={20} />
      </button>
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

export default UtangManagementPage;

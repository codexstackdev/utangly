"use client"
import { motion } from "framer-motion";
import { ShieldX, ArrowLeft, Lock } from "lucide-react";

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-[-20%] left-[-10%] w-125 h-125 rounded-full bg-primary/10 blur-[120px]"
        animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] w-100 h-100 rounded-full bg-destructive/10 blur-[100px]"
        animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-lg w-full text-center">
        {/* Animated shield icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="mx-auto mb-8"
        >
          <div className="relative inline-flex items-center justify-center">
            <motion.div
              className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-destructive/10"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-destructive/15 flex items-center justify-center border border-destructive/20">
              <ShieldX className="w-10 h-10 sm:w-12 sm:h-12 text-destructive" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* 403 number */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-7xl sm:text-9xl font-black text-foreground/10 tracking-tighter select-none"
        >
          403
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="text-2xl sm:text-3xl font-bold text-foreground -mt-4 sm:-mt-6 mb-3"
        >
          Access Denied
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-muted-foreground text-sm sm:text-base max-w-sm mx-auto mb-8 leading-relaxed"
        >
          You don't have permission to access this page on{" "}
          <span className="font-semibold text-primary">utangly</span>. Please
          check your credentials or contact an administrator.
        </motion.p>

        {/* Divider with lock */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex items-center gap-3 mb-8 max-w-xs mx-auto"
        >
          <div className="flex-1 h-px bg-border" />
          <Lock className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1 h-px bg-border" />
        </motion.div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <motion.a
            href="/"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-medium text-sm border border-border transition-colors"
          >
            Sign In
          </motion.a>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-12 text-xs text-muted-foreground/60"
        >
          © {new Date().getFullYear()} utangly. All rights reserved.
        </motion.p>
      </div>
    </div>
  );
};

export default Unauthorized;
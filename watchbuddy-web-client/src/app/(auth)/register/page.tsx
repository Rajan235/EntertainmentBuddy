"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { motion } from "framer-motion";
import { AuthWrapper } from "@/components/auth/AuthWrapper";

export default function RegisterPage() {
  // return (
  //   <motion.div
  //     initial={{ opacity: 0, y: 20 }}
  //     animate={{ opacity: 1, y: 0 }}
  //     transition={{ duration: 0.5, ease: "easeOut" }}
  //     className="w-full"
  //   >
  //     {/* 1. MATCHED STYLING: Added border, backdrop, and bg-card to match Login */}
  //     <div className="glass rounded-2xl p-8 shadow-2xl border border-white/10 backdrop-blur-xl bg-card/40">
  //       {/* Header */}
  //       <div className="mb-8 text-center space-y-2">
  //         {/* 2. MATCHED ANIMATION: Added stagger delay 0.1s */}
  //         <motion.h1
  //           initial={{ opacity: 0, y: 10 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: 0.1, duration: 0.5 }}
  //           className="text-3xl font-bold text-gradient"
  //         >
  //           Create Account
  //         </motion.h1>
  //         <motion.p
  //           initial={{ opacity: 0, y: 10 }}
  //           animate={{ opacity: 1, y: 0 }}
  //           transition={{ delay: 0.2, duration: 0.5 }}
  //           className="text-muted-foreground text-base"
  //         >
  //           Start tracking your entertainment
  //         </motion.p>
  //       </div>

  //       {/* Register Form */}
  //       <motion.div
  //         initial={{ opacity: 0, y: 10 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ delay: 0.3, duration: 0.5 }}
  //       >
  //         <RegisterForm />
  //       </motion.div>

  //       {/* Footer Link */}
  //       <motion.div
  //         initial={{ opacity: 0, y: 10 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ delay: 0.4, duration: 0.5 }}
  //         className="mt-8 text-center"
  //       >
  //         <p className="text-muted-foreground text-sm">
  //           Already have an account?{" "}
  //           {/* 3. MATCHED LINK: Standardized hover effects */}
  //           <Link
  //             href="/login"
  //             className="text-primary hover:text-primary/80 font-medium transition-colors duration-200 hover:underline"
  //           >
  //             Sign in
  //           </Link>
  //         </p>
  //       </motion.div>
  //     </div>

  //     {/* Brand Footer */}
  //     <motion.div
  //       initial={{ opacity: 0 }}
  //       animate={{ opacity: 1 }}
  //       transition={{ delay: 0.6, duration: 0.5 }}
  //       className="mt-8 text-center"
  //     >
  //       <p className="text-xs text-muted-foreground/60">
  //         WatchBuddy - Track Your Entertainment
  //       </p>
  //     </motion.div>
  //   </motion.div>
  // );
  return (
    <AuthWrapper
      title="Create Account"
      subtitle="Start tracking your entertainment"
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkHref="/login"
    >
      {/* This form is passed as the 'children' prop to the wrapper */}
      <RegisterForm />
    </AuthWrapper>
  );
}

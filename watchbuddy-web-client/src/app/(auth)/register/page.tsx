"use client";

import Link from "next/link";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { motion } from "framer-motion";

export default function RegisterPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground">
            Start tracking your entertainment
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:text-primary-light transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

'use client'

import Link from 'next/link'
import { LoginForm } from '@/components/forms/LoginForm'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="glass rounded-2xl p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to continue tracking</p>
        </div>
        
        <LoginForm />
        
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:text-primary-light transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </motion.div>
  )
}
// app/(auth)/layout.tsx or wherever you're placing the layout

import { isAuthenticated } from '@/lib/actions/auth.action';
import { redirect } from 'next/navigation';
import type React from 'react'

const AuthLayout = async ({ children }: { children: React.ReactNode }) => {
      const isUserAuthenticated = await isAuthenticated();
      isUserAuthenticated && redirect('/');
  return (
    <div className="w-full min-h-screen flex items-center justify-center px-4">
      <div className="bg-white dark:bg-black p-6 sm:p-8 rounded-2xl shadow-md w-full max-w-[350px] sm:max-w-[400px] border border-gray-300 dark:border-gray-600">
        {children}
      </div>
    </div>
  )
}

export default AuthLayout

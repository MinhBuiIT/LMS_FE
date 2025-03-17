'use client';
/*----Next---*/
import { NextPage } from 'next';
import React from 'react';

/*----Components---*/
import FloatingCircle from '@/src/components/floating-circle';

/*----i18next---*/
import AuthWrapper from '@/src/hoc/AuthWrapper';
import '../../../configs/i18next';

const AuthLayout: NextPage<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthWrapper guestGuard={true} authGuard={false}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800  to-black flex items-center justify-center overflow-hidden relative">
        <FloatingCircle size="w-96 h-96" color="bg-green-500" left="80%" top="10%" delay={0} />
        <FloatingCircle size="w-80 h-80" color="bg-emerald-400" left="-20%" top="20%" delay={2} />
        <FloatingCircle size="w-64 h-64" color="bg-teal-500" left="30%" top="-30%" delay={4} />
        {children}
      </div>
    </AuthWrapper>
  );
};

export default AuthLayout;

'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/loading';
import { RootState } from '../redux/store';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const isAuth = useSelector((state: RootState) => state.auth.isAuth);
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  const pathName = usePathname();

  useEffect(() => {
    if (!isAuth) {
      router.replace('/login');
      return;
    }
    setIsMounted(true);
  }, [pathName]);
  if (!isMounted) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default AuthGuard;

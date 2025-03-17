'use client';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';
import Loading from '../components/loading';

const NoGuard = ({ children }: { children: React.ReactNode }) => {
  const [isMounted, setIsMounted] = React.useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);
  if (!isMounted) {
    return <Loading />;
  }

  return <>{children}</>;
};

export default NoGuard;

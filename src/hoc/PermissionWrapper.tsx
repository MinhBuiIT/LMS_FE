'use client';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Loading from '../components/loading';
import { RootState } from '../redux/store';

type PermissionWrapperProps = {
  permissionGuard: string;
  children: React.ReactNode;
};

const PermissionWrapper = (props: PermissionWrapperProps) => {
  const { permissionGuard } = props;
  const user = useSelector((state: RootState) => state.auth.user);
  const pathName = usePathname();
  const [isMounted, setIsMounted] = React.useState(false);
  const router = useRouter();
  useEffect(() => {
    if (user?.role !== permissionGuard) {
      router.replace('/');
      return;
    }
    setIsMounted(true);
  }, [pathName]);
  if (!isMounted) {
    return <Loading />;
  }
  return <>{props.children}</>;
};

export default PermissionWrapper;

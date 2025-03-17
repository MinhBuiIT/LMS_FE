import React from 'react';
import Guard from '../guard/Guard';

type AuthWrapperProps = {
  authGuard?: boolean;
  guestGuard?: boolean;
  children: React.ReactNode;
};

const AuthWrapper = (props: AuthWrapperProps) => {
  const { authGuard = false, guestGuard = false, children } = props;
  return (
    <Guard authGuard={authGuard} guestGuard={guestGuard}>
      {children}
    </Guard>
  );
};

export default AuthWrapper;

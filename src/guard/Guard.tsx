import React from 'react';
import AuthGuard from './AuthGuard';
import GuestGuard from './GuestGuard';
import NoGuard from './NoGuard';

type GuardProps = {
  children: React.ReactNode;
  guestGuard: boolean;
  authGuard: boolean;
};

const Guard = ({ children, guestGuard, authGuard }: GuardProps) => {
  if (guestGuard) {
    return <GuestGuard>{children}</GuestGuard>;
  } else if (authGuard) {
    return <AuthGuard>{children}</AuthGuard>;
  } else {
    return <NoGuard>{children}</NoGuard>;
  }
};

export default Guard;

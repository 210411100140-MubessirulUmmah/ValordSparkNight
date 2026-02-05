import { Navigate } from 'react-router-dom';
import { UserProfile } from '../types';
import React from 'react';

interface PublicRouteProps {
  user: UserProfile | null;
  children: React.ReactNode;
}

export const PublicRoute = ({ user, children }: PublicRouteProps) => {
  if (user) {
    return (
      <Navigate
        to={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
        replace
      />
    );
  }

  return children;
};

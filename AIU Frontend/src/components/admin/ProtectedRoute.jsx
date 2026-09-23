import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { authService } from '../../services/authService';
import { LoadingState } from '../common/LoadingState';

export function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let mounted = true;

    authService.isAuthorizedAdmin().then((authorized) => {
      if (mounted) {
        setIsAdmin(authorized);
        setLoading(false);
      }
    });

    const unsub = authService.subscribe(async () => {
      const authorized = await authService.isAuthorizedAdmin();
      if (mounted) {
        setIsAdmin(authorized);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  if (loading) {
    return <LoadingState message="Verifying administrative credentials..." />;
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}

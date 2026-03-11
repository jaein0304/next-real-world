'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCurrentUser } from '../hooks/use-current-user';

export default function guestOnlyApp(Component: any) {
  const GuestComponent = () => {
    const router = useRouter();
    const { user, loading } = useCurrentUser();
    useEffect(() => {
      if (!loading && user) router.replace('/');
    }, [user, loading, router]);
    if (loading) return <LoadingSpinner />;
    return !user ? <Component /> : <LoadingSpinner />;
  };
  return GuestComponent;
}

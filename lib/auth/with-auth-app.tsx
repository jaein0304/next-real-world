'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCurrentUser } from '../hooks/use-current-user';

export default function withAuthApp(Component: any) {
  const AuthenticatedComponent = () => {
    const router = useRouter();
    const { user, loading } = useCurrentUser();
    useEffect(() => {
      if (!loading && !user) router.push('/login');
    }, [user, loading, router]);
    return user ? <Component {...{ user }} /> : <LoadingSpinner />;
  };
  return AuthenticatedComponent;
}

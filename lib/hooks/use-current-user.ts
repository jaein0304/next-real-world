import { useEffect, useState } from 'react';
import { useCurrentUserLazyQuery } from '../../generated/graphql';
import { useMessageHandler } from './use-message';
import { useToken } from './use-token';

export function useCurrentUser() {
  const { token } = useToken();
  const { handleErrors } = useMessageHandler();
  const [loading, setLoading] = useState<boolean>(true);
  const [loadCurrentUser, { data, error: queryError }] = useCurrentUserLazyQuery({
    fetchPolicy: 'cache-first',
    nextFetchPolicy: 'cache-only',
  });
  useEffect(() => {
    if (queryError) handleErrors({ err: queryError, mode: 'none' });
  }, [queryError, handleErrors]);
  useEffect(() => {
    const loadData = async () => {
      if (token) await loadCurrentUser();
      setLoading(false);
    };
    loadData();
  }, [loadCurrentUser, token]);

  return { user: data?.currentUser, loading };
}

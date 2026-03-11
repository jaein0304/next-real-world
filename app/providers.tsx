'use client';

import { TokenProvider } from '../lib/hooks/use-token';
import { CustomApolloProvider } from '../lib/hooks/use-apollo';
import { MessageProvider } from '../lib/hooks/use-message';
import Compose from '../lib/utils/compose';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Compose components={[TokenProvider, CustomApolloProvider, MessageProvider]}>
      {children}
    </Compose>
  );
}

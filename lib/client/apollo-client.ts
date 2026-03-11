import { ApolloClient, ApolloLink, HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { PersistedQueryLink } from '@apollo/client/link/persisted-queries';
import { sha256 } from 'crypto-hash';
import { cache } from '../cache';
import { BASE_URL } from '../constants';

export const cacheLink = new PersistedQueryLink({
  sha256,
  useGETForHashedQueries: true,
});

export const httpLink = new HttpLink({
  uri: `${BASE_URL}/api`,
  credentials: 'same-origin',
});

export const errorLink = new ErrorLink(({ error }) => {
  if (process.env.NODE_ENV === 'development') {
    if (CombinedGraphQLErrors.is(error)) {
      error.errors.forEach(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
      );
    } else {
      console.log(`[Network error]: ${error.message}`);
    }
  }
});

export default new ApolloClient({
  link: ApolloLink.from([errorLink, cacheLink, httpLink]),
  cache,
  ssrMode: typeof window === 'undefined',
  devtools: {
    enabled: process.env.NODE_ENV === 'development',
  },
});

'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ArticlesViewer from '../../../components/article-list/ArticlesViewer';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { TabProps } from '../../../components/common/Tab';
import UserInfo from '../../../components/profile/UserInfo';
import { ArticlesQueryVariables, useProfileLazyQuery } from '../../../generated/graphql';

export default function ProfilePage() {
  const params = useParams<{ username: string }>();
  const username = params?.username ?? '';
  const searchParams = useSearchParams();
  const favorites = searchParams?.get('favorites') ?? null;
  const [queryFilter, setQueryFilter] = useState<ArticlesQueryVariables>({});
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const [loadProfile, { data, loading }] = useProfileLazyQuery();

  useEffect(() => {
    if (username) {
      loadProfile({ variables: { username } });
      setQueryFilter(favorites ? { favorited: username } : { author: username });
      setTabs([
        { name: 'My Articles', href: `/profile/${username}` },
        { name: 'Favorited Articles', href: `/profile/${username}?favorites=true` },
      ]);
    }
  }, [username, favorites, loadProfile]);

  if (loading || !data) return <LoadingSpinner />;
  const { profile } = data;
  if (!profile) return <div>Not found</div>;
  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <UserInfo author={profile} />
      <div className='container flex flex-wrap justify-center mx-auto mt-8'>
        <div className='w-full'>
          <ArticlesViewer {...{ tabs, queryFilter }} />
        </div>
      </div>
    </div>
  );
}

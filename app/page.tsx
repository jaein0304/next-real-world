'use client';

import { useSearchParams } from 'next/navigation';
import * as R from 'ramda';
import { useEffect, useState } from 'react';
import ArticlesViewer from '../components/article-list/ArticlesViewer';
import { TabProps } from '../components/common/Tab';
import HomeBanner from '../components/home/Banner';
import HomeSidebar from '../components/home/Sidebar';
import { ArticlesQueryVariables } from '../generated/graphql';
import { useCurrentUser } from '../lib/hooks/use-current-user';

export default function Home() {
  const searchParams = useSearchParams();
  const feed = searchParams?.get('feed') ?? null;
  const tag = searchParams?.get('tag') ?? null;
  const [tabs, setTabs] = useState<TabProps[]>([]);
  const { user, loading } = useCurrentUser();
  const [isFeedQuery, setFeedQuery] = useState<boolean>(false);
  const [queryFilter, setQueryFilter] = useState<ArticlesQueryVariables>({});

  useEffect(() => {
    if (!loading) {
      setFeedQuery(!!user && !!feed);
      setQueryFilter(tag ? { tag } : {});
      setTabs(
        R.unnest([
          user ? [{ name: 'Your Feed', href: '/?feed=true' }] : [],
          [{ name: 'Global Feed', href: '/' }],
          tag ? [{ name: `# ${tag}`, href: `/?tag=${tag}` }] : [],
        ])
      );
    }
  }, [feed, tag, user, loading]);

  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <HomeBanner />
      <div className='container flex flex-col-reverse justify-center mt-8 mx-auto md:flex-row'>
        <main className='basis-9/12 shrink-0'>
          <ArticlesViewer {...{ tabs, queryFilter, isFeedQuery }} />
        </main>
        <aside className='w-full sticky self-start md:top-16 md:ml-8'>
          <HomeSidebar />
        </aside>
      </div>
    </div>
  );
}

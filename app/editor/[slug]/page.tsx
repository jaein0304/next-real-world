'use client';

import { useParams } from 'next/navigation';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import ArticleEditor from '../../../components/editor/ArticleEditor';
import { AuthUser, useEditArticleQuery } from '../../../generated/graphql';
import withAuthApp from '../../../lib/auth/with-auth-app';

const EditArticle = ({ user }: { user: AuthUser }) => {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data, loading } = useEditArticleQuery({ variables: { slug } });
  if (loading || !data) return <LoadingSpinner />;
  const { article } = data;
  if (!article || article.author.username !== user.username)
    return <div>Not found</div>;

  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <ArticleEditor {...{ user, article }} />
    </div>
  );
};

export default withAuthApp(EditArticle);

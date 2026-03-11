'use client';

import { useParams } from 'next/navigation';
import ArticleJsonMeta from '../../../components/article/article-json-meta';
import ArticleMeta from '../../../components/article/ArticleMeta';
import ArticlePageBanner from '../../../components/article/ArticlePageBanner';
import CommentSection from '../../../components/article/CommentSection';
import Marked from '../../../components/article/marked';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import TagList from '../../../components/common/TagList';
import { useArticleQuery } from '../../../generated/graphql';
import { BASE_URL } from '../../../lib/constants';

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug ?? '';
  const { data, loading } = useArticleQuery({ variables: { slug } });

  if (loading || !data) return <LoadingSpinner />;
  const { article } = data;
  if (!article) return <div>Article not found</div>;

  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <ArticleJsonMeta article={article} />
      <ArticlePageBanner article={article} />

      <div className='container flex flex-wrap flex-col mx-auto mt-8'>
        <div className='w-full'>
          <Marked content={article.body} className='mb-4' />
        </div>
        <TagList outlined tagList={article.tagList} />

        <hr className='my-4' />

        <div className='mt-16 self-center'>
          <ArticleMeta article={article} />
        </div>
      </div>
      <CommentSection article={article} />
    </div>
  );
}

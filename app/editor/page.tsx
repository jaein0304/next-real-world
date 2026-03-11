'use client';

import ArticleEditor from '../../components/editor/ArticleEditor';
import { AuthUser } from '../../generated/graphql';
import withAuthApp from '../../lib/auth/with-auth-app';

const NewArticle = ({ user }: { user: AuthUser }) => {
  return (
    <div className='flex-2 mt-14 md:mt-12'>
      <ArticleEditor {...{ user }} />
    </div>
  );
};

export default withAuthApp(NewArticle);

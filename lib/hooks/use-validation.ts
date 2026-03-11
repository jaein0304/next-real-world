import { useEffect } from 'react';
import { AnySchema, object } from 'yup';
import { AuthUser, useCheckEmailLazyQuery, useCheckUsernameLazyQuery, UserUpdateInput } from '../../generated/graphql';
import { bio, email, image, password, username } from '../validation/schema';
import { useMessageHandler } from './use-message';

export function useCheckUser(origin?: AuthUser) {
  const { handleErrors } = useMessageHandler();
  const [checkUsername, { error: usernameError }] = useCheckUsernameLazyQuery();
  const [checkEmail, { error: emailError }] = useCheckEmailLazyQuery();

  useEffect(() => {
    if (usernameError) handleErrors({ err: usernameError, mode: 'alert' });
  }, [usernameError, handleErrors]);

  useEffect(() => {
    if (emailError) handleErrors({ err: emailError, mode: 'alert' });
  }, [emailError, handleErrors]);

  return object<Record<keyof UserUpdateInput, AnySchema>>({
    username: username.test('check-username', 'Username had been taken', async (value) => {
      if (!value || origin?.username === value) return true;
      const { data } = await checkUsername({ variables: { username: value } });
      return data?.checkUsername === null;
    }),
    email: email.test('check-email', 'Email had been taken', async (value) => {
      if (!value || origin?.email === value) return true;
      const { data } = await checkEmail({
        variables: { email: value },
      });
      return data?.checkEmail === null;
    }),
    password,
    bio,
    image,
  });
}

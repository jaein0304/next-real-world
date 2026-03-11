import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type PushFn = (path: string) => void;
type ReplaceFn = (path: string) => void;

export function usePush(): PushFn {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [{ push }] = useState<{ push: PushFn }>({
    push: (path) => routerRef.current.push(path),
  });
  return push;
}

export function useReplace(): ReplaceFn {
  const router = useRouter();
  const routerRef = useRef(router);

  routerRef.current = router;

  const [{ replace }] = useState<{ replace: ReplaceFn }>({
    replace: (path) => routerRef.current.replace(path),
  });
  return replace;
}

import { MutableRefObject } from 'react';

export const handleScroll = (
  containerRef: MutableRefObject<HTMLDivElement | null>,
  loading: boolean,
  hasMore: boolean,
  onTriggerLoad: () => void
) => {
  if (!containerRef.current || loading || !hasMore) return;

  const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
  if (scrollTop + clientHeight >= scrollHeight - 10) {
    onTriggerLoad();
  }
};

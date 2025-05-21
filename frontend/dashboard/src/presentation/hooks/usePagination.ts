import { useCallback, useState } from 'react';

type UsePaginationResult<T> = {
  items: T[];
  offset: number;
  hasMore: boolean;
  loading: boolean;
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  resetPagination: () => void;
  loadMore: (fetchFunction: () => Promise<T[]>) => Promise<void>;
};

export function usePagination<T>(limit: number): UsePaginationResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async (fetchFunction: () => Promise<T[]>) => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const allItems = await fetchFunction();
      const paginated = allItems.slice(offset, offset + limit);

      setItems((prev) => [
        ...prev,
        ...paginated.filter((item) => !prev.some((existing) => (existing as any).id === (item as any).id)),
      ]);

      setOffset((prev) => prev + limit);
      if (paginated.length < limit) setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, hasMore, loading, limit]);

  const resetPagination = () => {
    setItems([]);
    setOffset(0);
    setHasMore(true);
  };

  return {
    items,
    offset,
    hasMore,
    loading,
    setItems,
    resetPagination,
    loadMore,
  };
}

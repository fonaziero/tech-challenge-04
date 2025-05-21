import { useEffect, useState } from "react";

export function useSearchFilter<T>(
  list: T[],
  searchFunction: (item: T, query: string) => boolean,
  delay: number = 300
) {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<T[]>(list);

  useEffect(() => {
    const handler = setTimeout(() => {
      if (!query.trim()) {
        setFiltered(list);
      } else {
        const q = query.toLowerCase();
        setFiltered(list.filter((item) => searchFunction(item, q)));
      }
    }, delay);

    return () => clearTimeout(handler);
  }, [query, list]);

  return {
    filtered,
    setQuery,
  };
}

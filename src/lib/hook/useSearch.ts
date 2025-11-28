import { useQuery } from "@tanstack/react-query";
import searchApi from "@/api/search";

export const useSong = (q: string) => {
  const autocomplete = useQuery({
    queryKey: ["autocomplete", q],
    queryFn: async ({ queryKey }) => {
      const [_key, searchQuery] = queryKey;
      return await searchApi.getAutocomplete(searchQuery as string);
    },
    enabled: !!q,
  });

  return { autocomplete };
};

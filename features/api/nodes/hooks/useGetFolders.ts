import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFolders } from "../api/getFolders";
import { QueryConfig } from "@/lib/queryClient";

export const getFoldersQueryKey = () => ["folders"];

const getFoldersQueryOptions = () => {
  return queryOptions({
    queryKey: getFoldersQueryKey(),
    queryFn: () => getFolders(),
  });
};

type UseGetFoldersParams = {
  queryConfig?: QueryConfig<typeof getFoldersQueryOptions>;
};

export const useGetFolders = ({ queryConfig }: UseGetFoldersParams) => {
  return useQuery({
    ...getFoldersQueryOptions(),
    ...queryConfig,
  });
};

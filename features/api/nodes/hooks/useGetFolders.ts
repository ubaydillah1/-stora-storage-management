import { queryOptions, useQuery } from "@tanstack/react-query";
import { getFolders } from "../api/getFolders";
import { QueryConfig } from "@/lib/queryClient";

export const getFoldersQueryKey = (parentId?: string | null) => [
  "folders",
  parentId,
];

const getFoldersQueryOptions = (parentId: string | null) => {
  return queryOptions({
    queryKey: getFoldersQueryKey(parentId),
    queryFn: () => getFolders(parentId),
  });
};

type UseGetFoldersParams = {
  parentId: string | null;
  queryConfig?: QueryConfig<typeof getFoldersQueryOptions>;
};

export const useGetFolders = ({
  parentId,
  queryConfig,
}: UseGetFoldersParams) => {
  return useQuery({
    ...getFoldersQueryOptions(parentId),
    ...queryConfig,
  });
};

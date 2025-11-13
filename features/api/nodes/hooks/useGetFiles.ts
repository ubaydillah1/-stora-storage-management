import { infiniteQueryOptions, useInfiniteQuery } from "@tanstack/react-query";
import { getFiles, getFilesParams } from "../api/getFiles";
import { NodeListResponse } from "../types";
import { QueryConfig } from "@/lib/queryClient";

export const GetFilesQueryKey = (params: getFilesParams) => ["files", params];

const GetFilesQueryOptions = (params: getFilesParams) => {
  return infiniteQueryOptions({
    queryKey: GetFilesQueryKey(params),
    queryFn: ({ pageParam = null }) =>
      getFiles({ ...params, cursor: pageParam }),
    getNextPageParam: (lastPage: NodeListResponse) => lastPage.nextCursor,
    initialPageParam: null,
  });
};

type UseGetFilesParams = getFilesParams & {
  queryConfig?: QueryConfig<typeof GetFilesQueryOptions>;
};

export const useGetFiles = ({ queryConfig, ...params }: UseGetFilesParams) => {
  return useInfiniteQuery({
    ...GetFilesQueryOptions(params),
    ...queryConfig,
  });
};

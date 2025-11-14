import { queryOptions, useQuery } from "@tanstack/react-query";
import { getTodayRecentFiles } from "../api/getTodayRecentFiles";
import { QueryConfig } from "@/lib/queryClient";

export const geyTodayRecetFilesQueryKey = () => ["getTodayRecentFiles"];

const getTodayRecentFilesQueryOptions = () => {
  return queryOptions({
    queryKey: geyTodayRecetFilesQueryKey(),
    queryFn: () => getTodayRecentFiles(),
  });
};

type UseGetTodayRecentFilesParams = {
  queryConfig?: QueryConfig<typeof getTodayRecentFilesQueryOptions>;
};

export const useGetTodayRecentFiles = ({
  queryConfig,
}: UseGetTodayRecentFilesParams) => {
  return useQuery({
    ...getTodayRecentFilesQueryOptions(),
    ...queryConfig,
  });
};

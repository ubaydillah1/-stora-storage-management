import { queryOptions, useQuery } from "@tanstack/react-query";
import { getSummaryStorage } from "../api/getSummaryStorage";
import { QueryConfig } from "@/lib/queryClient";

export const getSummaryStorageQueryKey = () => ["getSummaryStorage"];

const getSummaryStorageQueryOptions = () => {
  return queryOptions({
    queryKey: getSummaryStorageQueryKey(),
    queryFn: getSummaryStorage,
  });
};

type GetSummaryStorageParams = {
  queryConfig?: QueryConfig<typeof getSummaryStorageQueryOptions>;
};

export const useGetSummaryStorage = ({
  queryConfig,
}: GetSummaryStorageParams) => {
  return useQuery({
    ...getSummaryStorageQueryOptions(),
    ...queryConfig,
  });
};

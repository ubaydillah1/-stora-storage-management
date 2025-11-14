import { MutationConfig, queryClient } from "@/lib/queryClient";
import { deleteNodes } from "../api/deleteNodes";
import { useMutation } from "@tanstack/react-query";
import { GetFilesQueryKey } from "./useGetFiles";
import { getSummaryStorageQueryKey } from "../../storage/hooks/useGetSummaryStorage";
import { geyTodayRecetFilesQueryKey } from "./useGetTodayRecentFiles";

export type UseDeleteNodesParams = {
  mutationConfig?: MutationConfig<typeof deleteNodes>;
};

export const useDeleteNodes = (params: UseDeleteNodesParams) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: deleteNodes,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: GetFilesQueryKey({}),
      });

      queryClient.invalidateQueries({
        queryKey: getSummaryStorageQueryKey(),
      });

      queryClient.invalidateQueries({
        queryKey: geyTodayRecetFilesQueryKey(),
      });

      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

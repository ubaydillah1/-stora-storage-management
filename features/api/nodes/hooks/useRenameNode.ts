import { MutationConfig, queryClient } from "@/lib/queryClient";
import { renameNode } from "../api/renameNodes";
import { useMutation } from "@tanstack/react-query";
import { GetFilesQueryKey } from "./useGetFiles";

export type UseRenameNode = {
  mutationConfig?: MutationConfig<typeof renameNode>;
};

export const useRenameNode = (params: UseRenameNode) =>
  useMutation({
    ...params.mutationConfig,
    mutationFn: renameNode,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: GetFilesQueryKey({}),
      });

      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });

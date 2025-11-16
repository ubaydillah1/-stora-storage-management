import { MutationConfig, queryClient } from "@/lib/queryClient";
import { moveToFolder } from "../api/moveToFolder";
import { useMutation } from "@tanstack/react-query";
import { GetFilesQueryKey } from "./useGetFiles";
import { getFoldersQueryKey } from "./useGetFolders";

export type UseMoveToFolderParams = {
  mutationConfig?: MutationConfig<typeof moveToFolder>;
};

export const useMoveToFolder = (params: UseMoveToFolderParams) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: moveToFolder,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: GetFilesQueryKey({}),
      });

      queryClient.invalidateQueries({
        queryKey: getFoldersQueryKey(),
        exact: false,
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

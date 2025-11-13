import { MutationConfig, queryClient } from "@/lib/queryClient";
import { createFolder } from "../api/createFolder";
import { useMutation } from "@tanstack/react-query";
import { getFoldersQueryKey } from "./useGetFolders";

export type UseCreateFolderParams = {
  mutationConfig?: MutationConfig<typeof createFolder>;
};

export const useCreateFolder = (params: UseCreateFolderParams) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: createFolder,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: getFoldersQueryKey(variables.parentId),
        exact: true,
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

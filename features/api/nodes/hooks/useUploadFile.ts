import { MutationConfig, queryClient } from "@/lib/queryClient";
import { uploadFiles } from "../api/uploadFiles";
import { useMutation } from "@tanstack/react-query";
import { GetFilesQueryKey } from "./useGetFiles";

export type UseUploadFileParams = {
  mutationConfig?: MutationConfig<typeof uploadFiles>;
};

export const useUploadFile = (params: UseUploadFileParams) => {
  return useMutation({
    ...params.mutationConfig,
    mutationFn: uploadFiles,
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
};

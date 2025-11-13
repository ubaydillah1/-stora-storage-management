import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

export type UploadFilesInputParams = {
  file: File;
  parentId: string | null;
};

export const uploadFiles = async ({
  file,
  parentId,
}: UploadFilesInputParams) => {
  const formData = new FormData();
  formData.append("files", file);

  const result = await axiosInstance.post<ApiResponse>(
    `/api/dashboard/nodes?parentId=${parentId ?? ""}`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return result.data.message;
};

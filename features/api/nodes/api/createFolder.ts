import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

export type CreateFolderInput = {
  name: string;
  parentId?: string | null;
};

export const createFolder = async (data: CreateFolderInput) => {
  const url = `/api/dashboard/nodes/folders?parentId=${data.parentId ?? ""}`;

  const result = await axiosInstance.post<ApiResponse>(url, {
    name: data.name,
  });

  return result.data.message;
};

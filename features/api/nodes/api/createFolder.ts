import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

export type CreateFolderInput = {
  name: string;
};

export const createFolder = async (data: CreateFolderInput) => {
  const result = await axiosInstance.post<ApiResponse>(
    "/api/dashboard/nodes/folders",
    data
  );

  return result.data.message;
};

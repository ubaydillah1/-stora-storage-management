import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse, infiniteScrollParams } from "@/types/api";
import { FileCategory, NodeListResponse, NodeSort } from "../types";

export interface getFilesParams extends infiniteScrollParams {
  category?: FileCategory;
  search?: string;
  sort?: NodeSort;
}

export const getFiles = async (params: getFilesParams) => {
  const result = await axiosInstance.get<ApiResponse<NodeListResponse>>(
    "/api/dashboard/nodes",
    {
      params: {
        ...params,
      },
    }
  );

  return result.data.result!;
};

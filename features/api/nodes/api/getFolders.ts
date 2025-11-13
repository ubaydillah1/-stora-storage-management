import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";
import { NodeResult } from "../types";

export const getFolders = async () => {
  const result = await axiosInstance.get<ApiResponse<NodeResult[]>>(
    "/api/dashboard/nodes/folders"
  );

  return result.data.result!;
};

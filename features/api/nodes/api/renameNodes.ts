import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

export const renameNode = async (data: { id: string; newName: string }) => {
  const result = await axiosInstance.patch<ApiResponse>(
    "/api/dashboard/nodes",
    data
  );

  return result.data.message;
};

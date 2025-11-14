import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

export const deleteNodes = async (ids: string[] | string) => {
  const result = await axiosInstance.delete<ApiResponse>(
    `/api/dashboard/nodes`,
    { data: { nodeIds: ids } }
  );

  return result.data.message;
};

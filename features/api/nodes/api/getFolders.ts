import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";
import { NodeResult } from "../types";

export const getFolders = async (parentId: string | null) => {
  const result = await axiosInstance.get<ApiResponse<NodeResult[]>>(
    "/api/dashboard/nodes/folders",
    {
      params: {
        parentId: parentId ?? null,
      },
    }
  );

  return result.data.result!;
};

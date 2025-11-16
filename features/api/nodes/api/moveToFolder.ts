import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";

type moveToFolderInput = {
  parentId: string | null;
  nodeIds: string[];
};

export const moveToFolder = async (data: moveToFolderInput) => {
  const url = `/api/dashboard/nodes/move`;

  const result = await axiosInstance.post<ApiResponse>(url, {
    nodeIds: data.nodeIds,
    parentId: data.parentId,
  });

  return result.data.message;
};

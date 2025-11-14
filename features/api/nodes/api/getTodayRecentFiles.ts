import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";
import { FileCategory } from "../types";

export type NodeRecentFileResult = {
  name: string;
  id: string;
  size: number;
  mimeType: string;
  createdAt: Date;
  type: string;
  category: FileCategory;
};

export const getTodayRecentFiles = async () => {
  const result = await axiosInstance.get<ApiResponse<NodeRecentFileResult[]>>(
    "/api/dashboard/nodes/recent-files"
  );

  return result.data.result!;
};

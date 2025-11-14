import { axiosInstance } from "@/lib/axiosClient";
import { ApiResponse } from "@/types/api";
import { StorageSummary } from "../types";

export const getSummaryStorage = async () => {
  const result = await axiosInstance.get<ApiResponse<StorageSummary>>(
    `/api/dashboard/storage`
  );

  return result.data.result!;
};

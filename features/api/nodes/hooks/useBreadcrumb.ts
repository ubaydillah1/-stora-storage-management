import { axiosInstance } from "@/lib/axiosClient";
import { useQuery } from "@tanstack/react-query";

type BreadcrumbNode = {
  id: string;
  name: string;
};

export const useBreadcrumb = (ids: string[]) => {
  return useQuery({
    queryKey: ["breadcrumb", ids],
    queryFn: async () => {
      const q = ids.join(",");
      const res = await axiosInstance.get(
        `/api/dashboard/nodes/bulks?ids=${q}`
      );

      console.log(res.data.result);
      return res.data.result as BreadcrumbNode[];
    },
    enabled: ids.length > 0,
  });
};

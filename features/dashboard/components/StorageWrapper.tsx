"use client";

import { useGetSummaryStorage } from "@/features/api/storage/hooks/useGetSummaryStorage";
import SizeCard from "@/features/dashboard/components/SizeCard";
import StorageCircle from "@/features/dashboard/components/StorageCircle";

const StorageWrapper = () => {
  const { data, isPending } = useGetSummaryStorage({});

  return (
    <>
      <StorageCircle
        isPending={isPending}
        totalUsed={data?.totalUsed}
        maxStorage={data?.maxStorage}
      />
      <SizeCard data={data} isPending={isPending} />
    </>
  );
};

export default StorageWrapper;

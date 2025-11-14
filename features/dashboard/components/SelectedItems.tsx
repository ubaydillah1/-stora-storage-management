"use client";

import React, { useEffect } from "react";
import ItemLists from "./ItemLists";
import { useGetFiles } from "@/features/api/nodes/hooks/useGetFiles";
import { FileCategory } from "@/features/api/nodes/types";
import { useFilter } from "@/store/useFilter";
import { useGetFolders } from "@/features/api/nodes/hooks/useGetFolders";

type SelectedItemsProps = {
  path: string;
  parentId?: string | null;
};

const SelectedItems = ({ path, parentId }: SelectedItemsProps) => {
  const { search, sort, category, setCategory } = useFilter();

  useEffect(() => {
    if (!path) return;

    const segment = path.split("/").filter(Boolean).pop() || "";
    const cleaned = segment.replace(/s$/, "").toUpperCase();
    const valid: FileCategory[] = ["IMAGE", "DOCUMENT", "MEDIA", "OTHER", ""];

    const next = valid.includes(cleaned as FileCategory)
      ? (cleaned as FileCategory)
      : "";

    if (category !== next) setCategory(next);
  }, [path, category, setCategory]);

  const {
    data: filesData,
    isPending: isPendingFiles,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetFiles({
    search,
    sort,
    category: category || "",
    parentId,
  });

  useEffect(() => {
    const handler = () => {
      if (!isFetchingNextPage) fetchNextPage();
    };
    window.addEventListener("load-more-files", handler);
    return () => window.removeEventListener("load-more-files", handler);
  }, [fetchNextPage, isFetchingNextPage]);

  const { data: foldersData, isPending: isPendingFolders } = useGetFolders({
    parentId: parentId || null,
  });

  const flattenFiles = filesData?.pages.flatMap((page) => page.files) ?? [];


  return (
    <ItemLists
      folders={foldersData || []}
      files={flattenFiles}
      isPendingFolders={isPendingFolders}
      isPendingFiles={isPendingFiles}
      parentId={parentId || null}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
};

export default SelectedItems;

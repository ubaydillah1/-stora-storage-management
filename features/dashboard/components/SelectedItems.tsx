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
  const { search, sort, setCategory, category } = useFilter();

  useEffect(() => {
    if (!path) return;

    const cleaned = path.replace("/", "").replace(/s$/, "").toUpperCase();

    const valid: FileCategory[] = ["IMAGE", "DOCUMENT", "MEDIA", "OTHER", ""];

    if (valid.includes(cleaned as FileCategory)) {
      setCategory(cleaned as FileCategory);
    }
  }, [path, setCategory]);

  const { data: filesData, isPending: isPendingFiles } = useGetFiles({
    search,
    sort,
    category: category || "",
  });

  const { data: foldersData, isPending: isPendingFolders } = useGetFolders({});

  const flattenFiles = filesData?.pages.flatMap((page) => page.files) ?? [];

  return (
    <ItemLists
      folders={foldersData || []}
      files={flattenFiles}
      isPendingFolders={isPendingFolders}
      isPendingFiles={isPendingFiles}
    />
  );
};

export default SelectedItems;

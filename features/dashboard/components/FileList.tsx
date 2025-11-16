"use client";

import React from "react";
import { NodeResult } from "@/features/api/nodes/types";
import FileItem from "./FileItem";

type Props = {
  files: NodeResult[];
  selectedBox: string[];
  draggingIds: string[];
  isPendingFiles?: boolean;
  isFetchingNextPage?: boolean;

  registerBox: (el: HTMLElement | null) => void;

  handleItemMouseDown: (id: string, e: React.MouseEvent) => void;
  handleItemDragStart: (id: string, e: React.DragEvent) => void;
  handleItemDrag: (e: React.DragEvent) => void;
  handleItemDragEnd: () => void;
  handleFileDragOver: (e: React.DragEvent) => void;
  handleFileDrop: (id: string, e: React.DragEvent) => void;
  handleFileDoubleClick: (id: string) => void;

  handleDetail: (item: NodeResult) => void;
  handleRename: (item: NodeResult) => void;
  handleDelete: (item: NodeResult) => void;

  loadMoreRef: (el: HTMLDivElement | null) => void;
};

export default function FileList({
  files,
  selectedBox,
  draggingIds,
  isPendingFiles,
  isFetchingNextPage,
  registerBox,
  handleItemMouseDown,
  handleItemDragStart,
  handleItemDrag,
  handleItemDragEnd,
  handleFileDragOver,
  handleFileDrop,
  handleFileDoubleClick,
  handleDetail,
  handleRename,
  handleDelete,
  loadMoreRef,
}: Props) {
  if (isPendingFiles) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-[200px] rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic text-center">
        No files found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
      {files.map((file) => {
        return (
          <FileItem
            key={file.id}
            file={file}
            selected={selectedBox.includes(file.id)}
            dragging={draggingIds.includes(file.id)}
            registerBox={registerBox}
            onMouseDown={(e) => handleItemMouseDown(file.id, e)}
            onDoubleClick={() => handleFileDoubleClick(file.id)}
            onDragStart={(e) => handleItemDragStart(file.id, e)}
            onDrag={handleItemDrag}
            onDragEnd={handleItemDragEnd}
            onDragOver={handleFileDragOver}
            onDrop={(e) => handleFileDrop(file.id, e)}
            onDetail={() => handleDetail(file)}
            onRename={() => handleRename(file)}
            onDelete={() => handleDelete(file)}
          />
        );
      })}

      <div ref={loadMoreRef} className="h-10 w-full"></div>

      {isFetchingNextPage &&
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={`next-skel-${i}`}
            className="animate-pulse bg-gray-200 h-[200px] rounded-xl"
          />
        ))}
    </div>
  );
}

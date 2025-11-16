"use client";

import React from "react";
import { NodeResult } from "@/features/api/nodes/types";
import FolderItem from "./FolderItem";

type Props = {
  folders: NodeResult[];
  selectedBox: string[];
  draggingIds: string[];
  dragOverFolderId: string | null;
  isPendingFolders?: boolean;

  registerBox: (el: HTMLElement | null) => void;

  handleItemMouseDown: (id: string, e: React.MouseEvent) => void;
  handleItemDragStart: (id: string, e: React.DragEvent) => void;
  handleItemDrag: (e: React.DragEvent) => void;
  handleItemDragEnd: () => void;
  handleFolderDragOver: (id: string, e: React.DragEvent) => void;
  handleFolderDragEnter: (id: string, e: React.DragEvent) => void;
  handleFolderDragLeave: (id: string, e: React.DragEvent) => void;
  handleFolderDrop: (id: string, e: React.DragEvent) => void;
  handleFolderDoubleClick: (id: string) => void;
};

export default function FolderList({
  folders,
  selectedBox,
  draggingIds,
  dragOverFolderId,
  isPendingFolders,
  registerBox,
  handleItemMouseDown,
  handleItemDragStart,
  handleItemDrag,
  handleItemDragEnd,
  handleFolderDragOver,
  handleFolderDragEnter,
  handleFolderDragLeave,
  handleFolderDrop,
  handleFolderDoubleClick,
}: Props) {
  if (isPendingFolders) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse bg-gray-200 h-[120px] rounded-xl"
          />
        ))}
      </div>
    );
  }

  if (folders.length === 0) {
    return (
      <p className="text-sm text-gray-500 italic text-center">
        No folders found.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
      {folders.map((folder) => (
        <FolderItem
          key={folder.id}
          folder={folder}
          selected={selectedBox.includes(folder.id)}
          dragging={draggingIds.includes(folder.id)}
          dragOver={dragOverFolderId === folder.id}
          registerBox={registerBox}
          onMouseDown={(e) => handleItemMouseDown(folder.id, e)}
          onDoubleClick={() => handleFolderDoubleClick(folder.id)}
          onDragStart={(e) => handleItemDragStart(folder.id, e)}
          onDrag={handleItemDrag}
          onDragEnd={handleItemDragEnd}
          onDragOver={(e) => handleFolderDragOver(folder.id, e)}
          onDragEnter={(e) => handleFolderDragEnter(folder.id, e)}
          onDragLeave={(e) => handleFolderDragLeave(folder.id, e)}
          onDrop={(e) => handleFolderDrop(folder.id, e)}
        />
      ))}
    </div>
  );
}

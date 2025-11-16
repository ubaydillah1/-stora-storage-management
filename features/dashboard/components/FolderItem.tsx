"use client";

import { Folder } from "lucide-react";
import { NodeResult } from "@/features/api/nodes/types";
import { DragEvent, MouseEvent } from "react";
import React from "react";

type Props = {
  folder: NodeResult;
  selected: boolean;
  dragging: boolean;
  dragOver: boolean;
  registerBox: (el: HTMLElement | null) => void;

  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDrag: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;
};

export default function FolderItem({
  folder,
  selected,
  dragging,
  dragOver,
  registerBox,
  onMouseDown,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragOver,
  onDragEnter,
  onDragLeave,
  onDrop,
}: Props) {
  return (
    <div
      ref={registerBox}
      data-id={folder.id}
      draggable
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`box bg-white rounded-2xl p-5 cursor-pointer flex items-center gap-5 border-2 transition-all
        ${
          selected
            ? "bg-blue-100 border-blue-500 shadow-lg"
            : "border-transparent"
        }
        ${dragging ? "opacity-50" : ""}
        ${dragOver ? "bg-blue-200 border-blue-600 shadow-xl" : ""}
      `}
    >
      <Folder className="text-yellow-500 shrink-0" />
      <p className="truncate">{folder.name}</p>
    </div>
  );
}

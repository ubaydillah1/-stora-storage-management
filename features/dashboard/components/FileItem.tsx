"use client";

import React, { DragEvent, MouseEvent } from "react";
import Image from "next/image";
import { EllipsisVertical } from "lucide-react";
import { NodeResult } from "@/features/api/nodes/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDate } from "@/utils/formatDate";
import { getFileIcon, getFileType } from "@/lib/utils";

type Props = {
  file: NodeResult;
  selected: boolean;
  dragging: boolean;

  registerBox: (el: HTMLElement | null) => void;

  // Events from parent
  onMouseDown: (e: MouseEvent<HTMLDivElement>) => void;
  onDoubleClick: () => void;
  onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  onDrag: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd: () => void;
  onDragOver: (e: DragEvent<HTMLDivElement>) => void;
  onDrop: (e: DragEvent<HTMLDivElement>) => void;

  onDetail: () => void;
  onRename: () => void;
  onDelete: () => void;
};

export default function FileItem({
  file,
  selected,
  dragging,
  registerBox,
  onMouseDown,
  onDoubleClick,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragOver,
  onDrop,
  onDetail,
  onRename,
  onDelete,
}: Props) {
  const { type, extension } = getFileType(file.type);

  const previewUrl = type === "image" ? file.url : getFileIcon(extension, type);

  return (
    <div
      ref={registerBox}
      data-id={file.id}
      draggable
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`box bg-white rounded-2xl cursor-pointer border-2 transition-all
        ${
          selected
            ? "bg-blue-100 border-blue-500 shadow-lg"
            : "border-transparent"
        }
        ${dragging ? "opacity-50" : ""}
      `}
    >
      {/* Header */}
      <div className="flex justify-between p-3">
        <div className="flex items-center gap-3 w-full">
          <Image
            src={getFileIcon(extension, type)}
            alt="file-icon"
            width={22}
            height={22}
            className="shrink-0"
          />

          <p className="text-sm line-clamp-1 font-medium w-[80%]">
            {file.name}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <EllipsisVertical
              className="text-gray-400 hover:text-gray-600 cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onSelect={onDetail}>Detail</DropdownMenuItem>

            <DropdownMenuItem onSelect={onRename}>Rename</DropdownMenuItem>

            <DropdownMenuItem
              onSelect={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Preview */}
      <div className="relative w-full h-[140px] my-2 rounded-lg overflow-hidden bg-gray-50">
        <Image
          src={previewUrl}
          alt="file-preview"
          fill
          className={type === "image" ? "object-cover" : "object-contain p-8"}
          draggable={false}
        />
      </div>

      {/* Footer */}
      <div className="p-3 flex gap-3 items-center text-xs text-gray-500">
        <div className="relative w-[25px] aspect-square rounded-full overflow-hidden">
          <Image
            src="/assets/images/avatar.png"
            alt="profile"
            fill
            className="object-cover"
            draggable={false}
          />
        </div>
        <p>{formatDate(file.createdAt)}</p>
      </div>
    </div>
  );
}

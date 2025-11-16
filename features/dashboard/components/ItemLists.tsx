"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { useRouter } from "next/navigation";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { NodeResult } from "@/features/api/nodes/types";

import FolderList from "./FolderList";
import FileList from "./FileList";
import DragPreview from "./DragPreview";
import MarqueeSelection from "./MarqueeSelection";

import CreateFolderDialog from "./dialog/CreateFolderDialog";
import RenameNodeDialog from "./dialog/RenameNodeDialog";
import DeleteItemDialog from "./dialog/DeleteItemDialog";
import DetailDialog from "./dialog/DetailDialog";

type Props = {
  folders: NodeResult[];
  files: NodeResult[];
  isPendingFolders?: boolean;
  isPendingFiles?: boolean;
  parentId: string | null;
  isFetchingNextPage?: boolean;
};

export default function ItemLists({
  folders,
  files,
  isPendingFolders,
  isPendingFiles,
  parentId,
  isFetchingNextPage,
}: Props) {
  const router = useRouter();

  const [selectedBox, setSelectedBox] = useState<string[]>([]);
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLElement[]>([]);

  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);

  const [lastSelectedId, setLastSelectedId] = useState<string | null>(null);

  const [draggingIds, setDraggingIds] = useState<string[]>([]);
  const [draggingPos, setDraggingPos] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const dragOverTimeoutRef = useRef<number | null>(null);

  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] =
    useState(false);
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const [renameName, setRenameName] = useState("");
  const [selectedItem, setSelectedItem] = useState<NodeResult | null>(null);

  const allItems = useMemo(() => [...folders, ...files], [folders, files]);

  const { ref: loadMoreRef, inView } = useInView({ threshold: 0 });

  useEffect(() => {
    if (inView) window.dispatchEvent(new CustomEvent("load-more-files"));
  }, [inView]);

  useEffect(() => {
    boxesRef.current = [];
  }, [folders, files]);

  useEffect(() => {
    const handleMouseUp = () => {
      setIsMarqueeDragging(false);
      setDragStart(null);
      setDragEnd(null);
    };
    window.addEventListener("mouseup", handleMouseUp);
    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "a") {
        e.preventDefault();
        setSelectedBox(allItems.map((item) => item.id));
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [allItems]);

  const registerBox = (el: HTMLElement | null) => {
    if (el && !boxesRef.current.includes(el)) boxesRef.current.push(el);
  };

  const getRelativeCoords = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!containerRef.current) return { x: e.clientX, y: e.clientY };
    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: e.clientX - rect.left + containerRef.current.scrollLeft,
      y: e.clientY - rect.top + containerRef.current.scrollTop,
    };
  }, []);

  const handleContainerMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      const isClickOnItem = boxesRef.current.some((box) =>
        box.contains(e.target as Node)
      );
      if (isClickOnItem) return;

      setIsMarqueeDragging(true);
      setDragStart(getRelativeCoords(e));
      setDragEnd(null);
      setSelectedBox([]);
    },
    [getRelativeCoords]
  );

  const handleContainerMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isMarqueeDragging || !dragStart) return;

      const current = getRelativeCoords(e);
      setDragEnd(current);

      const rect = {
        left: Math.min(dragStart.x, current.x),
        right: Math.max(dragStart.x, current.x),
        top: Math.min(dragStart.y, current.y),
        bottom: Math.max(dragStart.y, current.y),
      };

      const selected: string[] = [];

      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      boxesRef.current.forEach((box) => {
        const id = box.getAttribute("data-id");
        if (!id) return;

        const boxRect = box.getBoundingClientRect();
        const rel = {
          left:
            boxRect.left -
            containerRect.left +
            containerRef.current!.scrollLeft,
          right:
            boxRect.right -
            containerRect.left +
            containerRef.current!.scrollLeft,
          top:
            boxRect.top - containerRect.top + containerRef.current!.scrollTop,
          bottom:
            boxRect.bottom -
            containerRect.top +
            containerRef.current!.scrollTop,
        };

        if (
          rect.left < rel.right &&
          rect.right > rel.left &&
          rect.top < rel.bottom &&
          rect.bottom > rel.top
        ) {
          selected.push(id);
        }
      });

      setSelectedBox(selected);
    },
    [isMarqueeDragging, dragStart, getRelativeCoords]
  );

  const handleItemMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();

      const isSelected = selectedBox.includes(id);

      setIsMarqueeDragging(false);

      if (e.ctrlKey || e.metaKey) {
        setSelectedBox((prev) =>
          isSelected ? prev.filter((x) => x !== id) : [...prev, id]
        );
        setLastSelectedId(id);
      } else if (e.shiftKey && lastSelectedId !== null) {
        const allIds = allItems.map((x) => x.id);

        const a = allIds.indexOf(lastSelectedId);
        const b = allIds.indexOf(id);

        if (a !== -1 && b !== -1) {
          const [min, max] = [Math.min(a, b), Math.max(a, b)];
          setSelectedBox(allIds.slice(min, max + 1));
        }
      } else {
        if (!isSelected) setSelectedBox([id]);
        setLastSelectedId(id);
      }
    },
    [selectedBox, lastSelectedId, allItems]
  );

  const handleItemDragStart = (id: string, e: React.DragEvent) => {
    if (!selectedBox.includes(id)) {
      setSelectedBox([id]);
    }

    setDraggingIds(selectedBox.includes(id) ? selectedBox : [id]);

    const img = new window.Image();
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAoMBgB8J/jwAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleItemDrag = (e: React.DragEvent) => {
    setDraggingPos({ x: e.clientX, y: e.clientY });
  };

  const handleItemDragEnd = () => {
    setDraggingIds([]);
    setDraggingPos(null);
    setDragOverFolderId(null);

    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
  };

  const handleFolderDoubleClick = (folderId: string) => {
    const current = window.location.pathname;

    if (!current.startsWith("/my")) router.push(`/my/${folderId}`);
    else router.push(`${current}/${folderId}`);
  };

  const handleFolderDragEnter = (folderId: string, e: React.DragEvent) => {
    e.preventDefault();

    if (!draggingIds.includes(folderId)) {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
        dragOverTimeoutRef.current = null;
      }
      setDragOverFolderId(folderId);
    }
  };

  const handleFolderDragOver = (folderId: string, e: React.DragEvent) => {
    e.preventDefault();
    if (!draggingIds.includes(folderId)) {
      setDragOverFolderId(folderId);
    }
  };

  const handleFolderDragLeave = (folderId: string, e: React.DragEvent) => {
    e.preventDefault();

    if (dragOverTimeoutRef.current) clearTimeout(dragOverTimeoutRef.current);

    dragOverTimeoutRef.current = window.setTimeout(() => {
      const el = boxesRef.current.find(
        (box) => box.getAttribute("data-id") === folderId
      );

      if (el) {
        const rect = el.getBoundingClientRect();
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          setDragOverFolderId(null);
        }
      } else {
        setDragOverFolderId(null);
      }
    }, 100);
  };

  const handleFolderDrop = (folderId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toast.info("Developers are working on this feature.");

    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }

    setDragOverFolderId(null);
  };

  const handleFileDoubleClick = (id: string) => router.push(`/view/${id}`);

  const handleFileDragOver = (e: React.DragEvent) => e.preventDefault();

  const handleFileDrop = (id: string, e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleNewFolder = () => setIsCreateFolderDialogOpen(true);

  const handleRename = (item: NodeResult) => {
    setSelectedItem(item);
    setRenameName(item.name);
    setIsRenameDialogOpen(true);
  };

  const handleDelete = (item: NodeResult) => {
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleDetail = (item: NodeResult) => {
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="overflow-y-auto flex-1 pb-[20px] select-none relative"
            style={{ scrollbarWidth: "none" }}
            onMouseDown={handleContainerMouseDown}
            onMouseMove={handleContainerMouseMove}
            ref={containerRef}
          >
            <MarqueeSelection dragStart={dragStart} dragEnd={dragEnd} />
            <DragPreview draggingIds={draggingIds} draggingPos={draggingPos} />

            <div className="p-[20px] md:px-[40px] w-full">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Folder
                </h2>

                <FolderList
                  folders={folders}
                  selectedBox={selectedBox}
                  draggingIds={draggingIds}
                  dragOverFolderId={dragOverFolderId}
                  isPendingFolders={isPendingFolders}
                  registerBox={registerBox}
                  handleItemMouseDown={handleItemMouseDown}
                  handleItemDragStart={handleItemDragStart}
                  handleItemDrag={handleItemDrag}
                  handleItemDragEnd={handleItemDragEnd}
                  handleFolderDragOver={handleFolderDragOver}
                  handleFolderDragEnter={handleFolderDragEnter}
                  handleFolderDragLeave={handleFolderDragLeave}
                  handleFolderDrop={handleFolderDrop}
                  handleFolderDoubleClick={handleFolderDoubleClick}
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  File
                </h2>

                <FileList
                  files={files}
                  selectedBox={selectedBox}
                  draggingIds={draggingIds}
                  isPendingFiles={isPendingFiles}
                  isFetchingNextPage={isFetchingNextPage}
                  registerBox={registerBox}
                  handleItemMouseDown={handleItemMouseDown}
                  handleItemDragStart={handleItemDragStart}
                  handleItemDrag={handleItemDrag}
                  handleItemDragEnd={handleItemDragEnd}
                  handleFileDragOver={handleFileDragOver}
                  handleFileDrop={handleFileDrop}
                  handleFileDoubleClick={handleFileDoubleClick}
                  handleDetail={handleDetail}
                  handleRename={handleRename}
                  handleDelete={handleDelete}
                  loadMoreRef={loadMoreRef}
                />
              </div>
            </div>
          </div>
        </ContextMenuTrigger>

        <ContextMenuContent className="w-48">
          <ContextMenuItem onClick={handleNewFolder}>
            New Folder
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      <CreateFolderDialog
        isOpen={isCreateFolderDialogOpen}
        setIsOpen={setIsCreateFolderDialogOpen}
        onClose={() => setIsCreateFolderDialogOpen(false)}
        parentId={parentId}
      />

      <RenameNodeDialog
        isOpen={isRenameDialogOpen}
        setIsOpen={setIsRenameDialogOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        renameName={renameName}
        setRenameName={setRenameName}
      />

      <DeleteItemDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
      />

      {selectedItem && (
        <DetailDialog
          folders={folders}
          isOpen={isDetailDialogOpen}
          setIsOpen={setIsDetailDialogOpen}
          selectedItem={selectedItem}
        />
      )}
    </>
  );
}

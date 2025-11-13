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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { EllipsisVertical, Folder, Image as ImageLucide } from "lucide-react";
import Image from "next/image";
import { NodeResult } from "@/features/api/nodes/types";
import { formatDate } from "@/utils/formatDate";

type Props = {
  folders: NodeResult[];
  files: NodeResult[];
  isPendingFolders?: boolean;
  isPendingFiles?: boolean;
};

const ItemLists = ({
  folders,
  files,
  isPendingFolders,
  isPendingFiles,
}: Props) => {
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
  const [newFolderName, setNewFolderName] = useState("");
  const [renameName, setRenameName] = useState("");
  const [selectedItem, setSelectedItem] = useState<NodeResult | null>(null);

  const allItems = useMemo(() => [...folders, ...files], [folders, files]);

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

  const handleItemDragStart = (itemId: string, e: React.DragEvent) => {
    if (!selectedBox.includes(itemId)) {
      setSelectedBox([itemId]);
    }
    setDraggingIds(selectedBox.includes(itemId) ? selectedBox : [itemId]);
    const img = new window.Image();
    img.src =
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/w8AAoMBgB8J/jwAAAAASUVORK5CYII=";
    e.dataTransfer.setDragImage(img, 0, 0);
  };

  const handleItemDrag = (e: React.DragEvent) =>
    setDraggingPos({ x: e.clientX, y: e.clientY });

  const handleItemDragEnd = () => {
    setDraggingIds([]);
    setDraggingPos(null);
    setDragOverFolderId(null);
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
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
      setIsMarqueeDragging(false);
      const isSelected = selectedBox.includes(id);
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

  const registerBox = (el: HTMLElement | null) => {
    if (el && !boxesRef.current.includes(el)) boxesRef.current.push(el);
  };

  const handleFolderDragEnter = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggingIds.includes(folderId)) {
      if (dragOverTimeoutRef.current) {
        clearTimeout(dragOverTimeoutRef.current);
        dragOverTimeoutRef.current = null;
      }
      setDragOverFolderId(folderId);
    }
  };

  const handleFolderDragOver = (e: React.DragEvent, folderId: string) => {
    e.preventDefault();
    if (!draggingIds.includes(folderId) && dragOverFolderId !== folderId) {
      setDragOverFolderId(folderId);
    }
  };

  const handleFolderDragLeave = (e: React.DragEvent, folderId: string) => {
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
    if (dragOverTimeoutRef.current) {
      clearTimeout(dragOverTimeoutRef.current);
      dragOverTimeoutRef.current = null;
    }
    setDragOverFolderId(null);
    if (draggingIds.includes(folderId)) return;
    console.log("Move:", draggingIds, "to folder:", folderId);
  };

  const handleFileDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleFileDrop = (id: string, e: React.DragEvent) => {
    e.preventDefault();
    console.log("Cannot drop into file:", id);
  };

  const handleNewFolder = () => {
    setIsCreateFolderDialogOpen(true);
  };

  const handleCreateFolder = () => {
    console.log("Creating folder:", newFolderName);
    setIsCreateFolderDialogOpen(false);
    setNewFolderName("");
  };

  const handleCancelCreateFolder = () => {
    setIsCreateFolderDialogOpen(false);
    setNewFolderName("");
  };

  const handleRename = (item: NodeResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setRenameName(item.name);
    setIsRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (selectedItem) {
      console.log("Renaming item:", selectedItem.id, "to:", renameName);
      setIsRenameDialogOpen(false);
      setSelectedItem(null);
      setRenameName("");
    }
  };

  const handleCancelRename = () => {
    setIsRenameDialogOpen(false);
    setSelectedItem(null);
    setRenameName("");
  };

  const handleDelete = (item: NodeResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      console.log("Deleting item:", selectedItem.id);
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setSelectedItem(null);
  };

  const handleDetail = (item: NodeResult, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedItem(item);
    setIsDetailDialogOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div
            className="overflow-y-auto flex-1 pb-[20px] select-none relative"
            style={{ scrollbarWidth: "none" }}
            onMouseDown={handleContainerMouseDown}
            ref={containerRef}
            onMouseMove={handleContainerMouseMove}
          >
            {isMarqueeDragging && dragStart && dragEnd && (
              <div
                className="absolute border-2 border-blue-400 bg-blue-300/20 pointer-events-none z-50"
                style={{
                  left: Math.min(dragStart.x, dragEnd.x),
                  top: Math.min(dragStart.y, dragEnd.y),
                  width: Math.abs(dragStart.x - dragEnd.x),
                  height: Math.abs(dragStart.y - dragEnd.y),
                }}
              />
            )}

            {draggingIds.length > 0 && draggingPos && (
              <div
                className="fixed pointer-events-none z-[9999] flex items-center gap-2 bg-white rounded-lg shadow-2xl px-4 py-2 border border-gray-300"
                style={{
                  top: draggingPos.y + 10,
                  left: draggingPos.x + 10,
                  transform: "scale(1.05)",
                }}
              >
                <ImageLucide className="text-blue-500" />
                <span className="text-sm font-medium">
                  {draggingIds.length} item{draggingIds.length > 1 ? "s" : ""}
                </span>
              </div>
            )}

            <div className="p-[20px] md:px-[40px] w-full">
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  Folder
                </h2>

                {isPendingFolders ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-200 h-[120px] rounded-xl"
                      />
                    ))}
                  </div>
                ) : folders.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center">
                    No folders found.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        ref={registerBox}
                        onMouseDown={(e) => handleItemMouseDown(folder.id, e)}
                        draggable
                        onDragStart={(e) => handleItemDragStart(folder.id, e)}
                        onDrag={handleItemDrag}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={(e) => handleFolderDragOver(e, folder.id)}
                        onDragEnter={(e) => handleFolderDragEnter(e, folder.id)}
                        onDragLeave={(e) => handleFolderDragLeave(e, folder.id)}
                        onDrop={(e) => handleFolderDrop(folder.id, e)}
                        data-id={folder.id}
                        className={`box bg-white rounded-2xl p-5 cursor-pointer flex items-center gap-5 border-2 transition-all
                        ${
                          selectedBox.includes(folder.id)
                            ? "bg-blue-100 border-blue-500 shadow-lg"
                            : "border-transparent"
                        }
                        ${draggingIds.includes(folder.id) ? "opacity-50" : ""}
                        ${
                          dragOverFolderId === folder.id
                            ? "bg-blue-200 border-blue-600 shadow-xl"
                            : ""
                        }`}
                      >
                        <Folder className="text-yellow-500 shrink-0" />
                        <p className="truncate">{folder.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700 mb-4">
                  File
                </h2>

                {isPendingFiles ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="animate-pulse bg-gray-200 h-[200px] rounded-xl"
                      />
                    ))}
                  </div>
                ) : files.length === 0 ? (
                  <p className="text-sm text-gray-500 italic text-center">
                    No files found.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]">
                    {files.map((file) => (
                      <div
                        key={file.id}
                        ref={registerBox}
                        data-id={file.id}
                        onMouseDown={(e) => handleItemMouseDown(file.id, e)}
                        draggable
                        onDragStart={(e) => handleItemDragStart(file.id, e)}
                        onDrag={handleItemDrag}
                        onDragEnd={handleItemDragEnd}
                        onDragOver={handleFileDragOver}
                        onDrop={(e) => handleFileDrop(file.id, e)}
                        className={`box bg-white rounded-2xl cursor-pointer border-2 transition-all
                        ${
                          selectedBox.includes(file.id)
                            ? "bg-blue-100 border-blue-500 shadow-lg"
                            : "border-transparent"
                        }
                        ${draggingIds.includes(file.id) ? "opacity-50" : ""}`}
                      >
                        <div className="flex justify-between p-3">
                          <div className="flex items-center gap-3 w-full">
                            <ImageLucide className="text-destructive shrink-0" />
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
                              <DropdownMenuItem
                                onClick={(e) => handleDetail(file, e)}
                              >
                                Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleRename(file, e)}
                              >
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleDelete(file, e)}
                                className="text-red-600 focus:text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="relative w-full h-[140px] my-2 rounded-lg overflow-hidden">
                          <Image
                            src="/assets/images/files.png"
                            alt="file-image"
                            fill
                            className="object-cover"
                            draggable={false}
                          />
                        </div>

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
                    ))}
                  </div>
                )}
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

      <Dialog
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
      >
        <DialogContent className="sm:max-w-md max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New Folder</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="folderName">Folder Name</Label>
              <Input
                id="folderName"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Enter folder name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelCreateFolder}>
              Cancel
            </Button>
            <Button onClick={handleCreateFolder}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="renameName">Name</Label>
              <Input
                id="renameName"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="Enter new name"
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelRename}>
              Cancel
            </Button>
            <Button onClick={handleConfirmRename}>Rename</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to delete &rdquo;{selectedItem?.name}
              &rdquo;? This action cannot be undone.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Item Details</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedItem && (
              <div className="space-y-3">
                <div>
                  <Label className="font-semibold">Name</Label>
                  <p>{selectedItem.name}</p>
                </div>
                <div>
                  <Label className="font-semibold">Type</Label>
                  <p>
                    {folders.some((f) => f.id === selectedItem.id)
                      ? "Folder"
                      : "File"}
                  </p>
                </div>
                <div>
                  <Label className="font-semibold">Created At</Label>
                  <p>{formatDate(selectedItem.createdAt)}</p>
                </div>
                <div>
                  <Label className="font-semibold">ID</Label>
                  <p className="text-sm text-gray-600">{selectedItem.id}</p>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={handleCloseDetail}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ItemLists;
  
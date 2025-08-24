"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { EllipsisVertical, Folder, Image as ImageLucide } from "lucide-react";
import Image from "next/image";

type Item = {
  id: number;
  name: string;
};

const ItemLists = ({ folders, files }: { folders: Item[]; files: Item[] }) => {
  const [selectedBox, setSelectedBox] = useState<number[]>([]);
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const boxesRef = useRef<HTMLElement[]>([]);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(
    null
  );
  const [dragEnd, setDragEnd] = useState<{ x: number; y: number } | null>(null);
  const [lastSelectedId, setLastSelectedId] = useState<number | null>(null);
  const [draggingIds, setDraggingIds] = useState<number[]>([]);
  const [draggingPos, setDraggingPos] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dragOverFolderId, setDragOverFolderId] = useState<number | null>(null);

  const allItems = useMemo(() => [...folders, ...files], [folders, files]);

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

  const handleItemDragStart = (itemId: number, e: React.DragEvent) => {
    if (!selectedBox.includes(itemId)) {
      setSelectedBox([itemId]);
    }
    setDraggingIds(selectedBox);
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
  };

  const getRelativeCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
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

      const selected: number[] = [];
      boxesRef.current.forEach((box) => {
        const boxId = parseInt(box.getAttribute("data-id") || "0", 10);
        const boxRect = box.getBoundingClientRect();
        const containerRect = containerRef.current?.getBoundingClientRect();
        if (!containerRect) return;
        const relBox = {
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
          rect.left < relBox.right &&
          rect.right > relBox.left &&
          rect.top < relBox.bottom &&
          rect.bottom > relBox.top
        ) {
          selected.push(boxId);
        }
      });
      setSelectedBox(selected);
    },
    [getRelativeCoords, isMarqueeDragging, dragStart]
  );

  const handleItemMouseDown = useCallback(
    (itemId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setIsMarqueeDragging(false);

      const isAlreadySelected = selectedBox.includes(itemId);

      if (e.ctrlKey || e.metaKey) {
        setSelectedBox((prev) =>
          isAlreadySelected
            ? prev.filter((id) => id !== itemId)
            : [...prev, itemId]
        );
        setLastSelectedId(itemId);
        return;
      }

      if (e.shiftKey && lastSelectedId !== null) {
        const allIds = allItems.map((item) => item.id);
        const startIndex = allIds.indexOf(lastSelectedId);
        const endIndex = allIds.indexOf(itemId);
        if (startIndex !== -1 && endIndex !== -1) {
          const [min, max] = [
            Math.min(startIndex, endIndex),
            Math.max(startIndex, endIndex),
          ];
          setSelectedBox(allIds.slice(min, max + 1));
        }
        return;
      }

      if (!isAlreadySelected) {
        setSelectedBox([itemId]);
      }
    },
    [selectedBox, lastSelectedId, allItems]
  );

  const registerBox = (el: HTMLElement | null) => {
    if (el && !boxesRef.current.includes(el)) boxesRef.current.push(el);
  };

  const handleFolderDragEnter = (e: React.DragEvent, folderId: number) => {
    e.preventDefault();
    setDragOverFolderId(draggingIds.includes(folderId) ? null : folderId);
  };

  const handleFolderDragLeave = (e: React.DragEvent, folderId: number) => {
    e.preventDefault();
    if (dragOverFolderId === folderId) setDragOverFolderId(null);
  };

  const handleFolderDrop = (folderId: number, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverFolderId(null);

    if (draggingIds.includes(folderId)) {
      console.log("Tidak dapat memasukkan folder ke dalam dirinya sendiri.");
      return;
    }

    console.log(
      `Item dengan ID [${draggingIds.join(
        ", "
      )}] berhasil di-drop ke folder dengan ID: ${folderId}`
    );
  };

  const handleFileDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleFileDrop = (fileId: number, e: React.DragEvent) => {
    e.preventDefault();
    console.log("Tidak dapat memasukkan item ke dalam file.");
  };

  return (
    <div
      className="overflow-y-auto flex-1 pb-[40px] select-none relative"
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

      <div className="p-[20px] md:p-[40px] md:pb-0! md:pt-[20px] w-full">
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Folder</h2>
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
                onDragOver={(e) => e.preventDefault()}
                onDragEnter={(e) => handleFolderDragEnter(e, folder.id)}
                onDragLeave={(e) => handleFolderDragLeave(e, folder.id)}
                onDrop={(e) => handleFolderDrop(folder.id, e)}
                data-id={folder.id}
                className={`box bg-white rounded-2xl p-5 cursor-pointer flex items-center gap-5
                  border-2 transition-all duration-200 ease-in-out
                  hover:bg-blue-50 hover:shadow-md
                  active:scale-[0.98]
                  ${
                    selectedBox.includes(folder.id)
                      ? "bg-blue-100 border-blue-500 shadow-lg"
                      : "border-transparent"
                  }
                  ${
                    dragOverFolderId === folder.id
                      ? "bg-blue-200 border-blue-600"
                      : ""
                  }`}
              >
                <Folder className="text-yellow-500 shrink-0" />
                <p className="truncate">{folder.name}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">File</h2>
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
                className={`box bg-white rounded-2xl cursor-pointer border-2 transition-all duration-200 ease-in-out
                  hover:bg-slate-50 hover:shadow-md
                  active:scale-[0.98]
                  ${
                    selectedBox.includes(file.id)
                      ? "bg-blue-100 border-blue-500 shadow-lg"
                      : "border-transparent"
                  }`}
              >
                <div className="flex justify-between p-3">
                  <div className="flex items-center gap-3 w-full">
                    <ImageLucide className="text-destructive shrink-0" />
                    <p className="truncate text-sm font-medium">{file.name}</p>
                  </div>
                  <EllipsisVertical className="text-gray-400 hover:text-gray-600 transition-colors" />
                </div>

                <div className="relative w-full h-[140px] my-2 rounded-lg overflow-hidden">
                  <Image
                    src={"/assets/images/files.png"}
                    alt="file-image"
                    fill
                    className="object-cover"
                    draggable={false}
                  />
                </div>

                <div className="p-3 flex gap-3 items-center text-xs text-gray-500">
                  <div className="relative w-[25px] aspect-square rounded-full overflow-hidden">
                    <Image
                      src={"/assets/images/avatar.png"}
                      alt="profile"
                      fill
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                  <p>you created on 10 Oct 2025</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemLists;

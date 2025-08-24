"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

const Page = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedBox, setSelectedBox] = useState<number[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isMarqueeDragging, setIsMarqueeDragging] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );

  const boxesRef = useRef<HTMLElement[]>([]);

  const folders = [
    { id: 1, name: "Memory" },
    { id: 21, name: "Bug Bounty" },
  ];
  const files = [
    { id: 3, name: "Black and Grey Cloud" },
    { id: 4, name: "Image 1" },
    { id: 5, name: "Image 2" },
    { id: 6, name: "Image 3" },
    { id: 7, name: "Image 4" },
    { id: 8, name: "Image 5" },
    { id: 9, name: "Image 6" },
    { id: 10, name: "Image 7" },
    { id: 11, name: "Image 8" },
    { id: 12, name: "Image 9" },
    { id: 13, name: "Image 10" },
    { id: 14, name: "Image 11" },
    { id: 15, name: "Image 12" },
    { id: 16, name: "Image 13" },
    { id: 17, name: "Image 14" },
    { id: 18, name: "Image 15" },
    { id: 19, name: "Image 16" },
    { id: 20, name: "Image 17" },
  ];
  const allItems = [...folders, ...files];

  const getRelativeCoords = useCallback((e: React.MouseEvent | MouseEvent) => {
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return { x: e.clientX, y: e.clientY };
    return {
      x: e.clientX - containerRect.left,
      y: e.clientY - containerRect.top,
    };
  }, []);

  const selectRange = useCallback(
    (startId: number, endId: number) => {
      const startIndex = allItems.findIndex((item) => item.id === startId);
      const endIndex = allItems.findIndex((item) => item.id === endId);
      if (startIndex === -1 || endIndex === -1) return [];

      const start = Math.min(startIndex, endIndex);
      const end = Math.max(startIndex, endIndex);

      const newSelection = allItems
        .slice(start, end + 1)
        .map((item) => item.id);

      return newSelection;
    },
    [allItems]
  );

  const handleMouseDownOnBox = useCallback(
    (boxId: number, e: React.MouseEvent) => {
      e.stopPropagation();
      setIsDragging(true);
      setIsMarqueeDragging(false);

      if (e.shiftKey) {
        const startBoxId = selectedBox[0];
        if (startBoxId) {
          const newSelection = selectRange(startBoxId, boxId);
          setSelectedBox(newSelection);
        } else {
          setSelectedBox([boxId]);
        }
      } else {
        setSelectedBox([boxId]);
      }
    },
    [selectedBox, selectRange]
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsMarqueeDragging(false);
  }, []);

  const handleMouseDownContainer = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        const coords = getRelativeCoords(e);
        setStartPoint(coords);
        setEndPoint(coords);
        setIsMarqueeDragging(true);
        setIsDragging(false);
        setSelectedBox([]);
      }
    },
    [getRelativeCoords]
  );

  const handleMouseMoveContainer = useCallback(
    (e: MouseEvent) => {
      if (isMarqueeDragging && startPoint) {
        const coords = getRelativeCoords(e);
        setEndPoint(coords);

        const rect = {
          left: Math.min(startPoint.x, coords.x),
          right: Math.max(startPoint.x, coords.x),
          top: Math.min(startPoint.y, coords.y),
          bottom: Math.max(startPoint.y, coords.y),
        };

        const selected: number[] = [];
        boxesRef.current?.forEach((box) => {
          const boxId = parseInt(box.getAttribute("data-id") || "0", 10);
          const boxRect = box.getBoundingClientRect();
          const containerRect = containerRef.current?.getBoundingClientRect();

          if (!containerRect) return;

          const relBox = {
            left: boxRect.left - containerRect.left,
            right: boxRect.right - containerRect.left,
            top: boxRect.top - containerRect.top,
            bottom: boxRect.bottom - containerRect.top,
          };

          const overlap =
            rect.left < relBox.right &&
            rect.right > relBox.left &&
            rect.top < relBox.bottom &&
            rect.bottom > relBox.top;

          if (overlap) selected.push(boxId);
        });

        setSelectedBox(selected);
      }
    },
    [isMarqueeDragging, startPoint, getRelativeCoords]
  );

  const handleMouseEnterOnBox = useCallback(
    (boxId: number) => {
      if (isDragging && selectedBox.length > 0) {
        const startBox = selectedBox[0];
        const newSelection = selectRange(startBox, boxId);
        setSelectedBox(newSelection);
      }
    },
    [isDragging, selectedBox, selectRange]
  );

  useEffect(() => {
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => {
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleGlobalMouseUp]);

  useEffect(() => {
    if (isMarqueeDragging) {
      window.addEventListener("mousemove", handleMouseMoveContainer);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMoveContainer);
    };
  }, [isMarqueeDragging, handleMouseMoveContainer]);

  useEffect(() => {
    if (isMarqueeDragging && endPoint) {
      const scrollSpeed = 15;
      const boundary = 20;

      if (endPoint.x < boundary) {
        window.scrollBy({ left: -scrollSpeed });
      } else if (endPoint.x > window.innerWidth - boundary) {
        window.scrollBy({ left: scrollSpeed });
      }

      if (endPoint.y < boundary) {
        window.scrollBy({ top: -scrollSpeed });
      } else if (endPoint.y > window.innerHeight - boundary) {
        window.scrollBy({ top: scrollSpeed });
      }
    }
  }, [isMarqueeDragging, endPoint]);

  useEffect(() => {
    boxesRef.current = Array.from(document.querySelectorAll(".box"));
  }, []);

  return (
    <div className="p-10 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Drive Saya</h1>
      <div
        ref={containerRef}
        className="relative bg-gray-100 p-6 rounded-xl min-h-[500px] select-none"
        onMouseDown={handleMouseDownContainer}
      >
        <div className="flex flex-col mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Folder</h2>
          <div className="flex flex-wrap gap-4">
            {folders.map((folder) => {
              const isSelected = selectedBox.includes(folder.id);
              return (
                <div
                  key={folder.id}
                  data-id={folder.id}
                  className={`box flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  onMouseDown={(e) => handleMouseDownOnBox(folder.id, e)}
                  onMouseEnter={() => handleMouseEnterOnBox(folder.id)}
                >
                  <span role="img" aria-label="folder">
                    📁
                  </span>
                  <span>{folder.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">File</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file) => {
              const isSelected = selectedBox.includes(file.id);
              return (
                <div
                  key={file.id}
                  data-id={file.id}
                  className={`box flex flex-col items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 aspect-square ${
                    isSelected
                      ? "bg-blue-100 border-blue-500"
                      : "bg-white border-gray-300"
                  }`}
                  onMouseDown={(e) => handleMouseDownOnBox(file.id, e)}
                  onMouseEnter={() => handleMouseEnterOnBox(file.id)}
                >
                  <div className="w-full h-24 bg-gray-300 rounded mb-2 flex-center">
                    <span role="img" aria-label="file">
                      📄
                    </span>
                  </div>
                  <span className="text-sm text-center">{file.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {isMarqueeDragging && startPoint && endPoint && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-200/20 pointer-events-none z-50"
            style={{
              left: Math.min(startPoint.x, endPoint.x),
              top: Math.min(startPoint.y, endPoint.y),
              width: Math.abs(startPoint.x - endPoint.x),
              height: Math.abs(startPoint.y - endPoint.y),
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Page;

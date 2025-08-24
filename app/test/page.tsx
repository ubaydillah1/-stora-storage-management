"use client";
import React, { useRef, useState } from "react";

const Page = ({ cols = 10, rows = 10 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [endPoint, setEndPoint] = useState<{ x: number; y: number } | null>(
    null
  );
  const [selectedBox, setSelectedBox] = useState<number[]>([]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    setStartPoint({ x: e.clientX, y: e.clientY });
    setEndPoint({ x: e.clientX, y: e.clientY });
    setSelectedBox([]);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown || !startPoint) return;
    setEndPoint({ x: e.clientX, y: e.clientY });

    const rect = {
      left: Math.min(startPoint.x, e.clientX),
      right: Math.max(startPoint.x, e.clientX),
      top: Math.min(startPoint.y, e.clientY),
      bottom: Math.max(startPoint.y, e.clientY),
    };

    const boxes =
      containerRef.current?.querySelectorAll<HTMLDivElement>(".box");
    const selected: number[] = [];

    boxes?.forEach((el, idx) => {
      const boxRect = el.getBoundingClientRect();
      const overlap =
        rect.left < boxRect.right &&
        rect.right > boxRect.left &&
        rect.top < boxRect.bottom &&
        rect.bottom > boxRect.top;

      if (overlap) selected.push(idx + 1);
    });

    setSelectedBox(selected);
  };

  const handleMouseUp = () => setIsMouseDown(false);

  return (
    <div className="p-[40px]">
      <div
        ref={containerRef}
        className="relative bg-red-500 w-full h-full gap-2 grid-cols-10 grid"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {[...Array(cols * rows)].map((_, i) => (
          <div
            key={i}
            className={`box ${
              selectedBox.includes(i + 1) ? "bg-white" : "bg-slate-500"
            } flex-center aspect-square select-none rounded-2xl`}
          >
            {i + 1}
          </div>
        ))}

        {isMouseDown && startPoint && endPoint && (
          <div
            className="absolute border-2 border-blue-400 bg-blue-200/20 pointer-events-none"
            style={{
              left:
                Math.min(startPoint.x, endPoint.x) -
                containerRef.current!.getBoundingClientRect().left,
              top:
                Math.min(startPoint.y, endPoint.y) -
                containerRef.current!.getBoundingClientRect().top,
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

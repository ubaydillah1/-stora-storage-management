"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "motion/react";

const MyDropzone = () => {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dragCounter = 0;

    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter++;

      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounter--;
      if (dragCounter <= 0) {
        setIsDragging(false);
        dragCounter = 0;
      }
    };

    const handleWindowDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const internalDrag = e.dataTransfer?.types.includes(
        "application/x-internal-item"
      );
      if (internalDrag) {
        console.log("➡️ Ini drag internal, jangan trigger upload");
        setIsDragging(false);
        return;
      }

      const isInside =
        dropzoneRef.current && dropzoneRef.current.contains(e.target as Node);

      if (isInside) {
        const droppedFiles = Array.from(e.dataTransfer?.files || []);
        console.log("✅ Files diterima:", droppedFiles);
      } else {
        console.log("❌ Drop di luar kotak → ditolak");
      }

      setIsDragging(false);
      dragCounter = 0;
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("drop", handleWindowDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("drop", handleWindowDrop);
    };
  }, []);

  return (
    <div>
      {isDragging && (
        <motion.div
          ref={dropzoneRef}
          key="dropzone-overlay"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="absolute inset-0 m-3 flex items-center justify-center rounded-[20px] border-2 border-dashed border-gray-300 bg-white/10 backdrop-blur-xl shadow-lg z-10 pointer-events-none"
        >
          <form
            className="flex flex-col items-center justify-center p-10 space-y-3 text-gray-600 pointer-events-auto"
            role="button"
            aria-label="Upload files"
          >
            <Upload className="w-8 h-8 text-primary animate-bounce" />
            <div className="text-lg font-medium">Drag & drop files here</div>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default MyDropzone;

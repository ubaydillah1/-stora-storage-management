"use client";

import React, { useEffect, useRef, useState } from "react";
import { Upload } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useUploadFile } from "@/features/api/nodes/hooks/useUploadFile";
import { useUploadQueue } from "@/store/useUploadQueue";

const MyDropzone = ({ parentId }: { parentId: string | null }) => {
  const [isDragging, setIsDragging] = useState(false);
  const dropzoneRef = useRef<HTMLDivElement>(null);

  const add = useUploadQueue((s) => s.add);
  const finish = useUploadQueue((s) => s.finish);

  const { mutateAsync } = useUploadFile({});

  useEffect(() => {
    const handleDragEnterWindow = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes("Files")) {
        setIsDragging(true);
      }
    };

    const handleDragLeaveWindow = (e: DragEvent) => {
      const outside =
        e.clientX === 0 ||
        e.clientY === 0 ||
        e.clientX === window.innerWidth ||
        e.clientY === window.innerHeight;

      if (outside) {
        setIsDragging(false);
      }
    };

    window.addEventListener("dragenter", handleDragEnterWindow);
    window.addEventListener("dragleave", handleDragLeaveWindow);
    return () => {
      window.removeEventListener("dragenter", handleDragEnterWindow);
      window.removeEventListener("dragleave", handleDragLeaveWindow);
    };
  }, []);

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const internalDrag = e.dataTransfer?.types.includes(
      "application/x-internal-item"
    );
    if (internalDrag) return;

    const droppedFiles = Array.from(e.dataTransfer?.files || []);
    if (!droppedFiles.length) return;

    for (const file of droppedFiles) {
      const id = add(file.name);

      try {
        await mutateAsync({
          file,
          parentId,
        });

        finish(id);
      } catch {
        finish(id);
        toast.error(`Upload failed: ${file.name}`);
      }
    }
  };

  return (
    <div>
      {isDragging && (
        <motion.div
          ref={dropzoneRef}
          key="dropzone-overlay"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="absolute inset-0 m-3 flex items-center justify-center rounded-[20px] border-2 border-dashed border-gray-300 bg-white/10 backdrop-blur-xl shadow-lg z-10"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center p-10 space-y-3 text-gray-600">
            <Upload className="w-8 h-8 text-primary animate-bounce" />
            <div className="text-lg font-medium">Drag & drop files here</div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MyDropzone;

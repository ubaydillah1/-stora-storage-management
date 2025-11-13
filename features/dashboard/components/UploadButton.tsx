"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type UploadButtonProps = {
  onFileSelect?: (files: File[]) => void;
  isPending?: boolean;
};

const UploadButton: React.FC<UploadButtonProps> = ({
  onFileSelect,
  isPending,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];

    if (files.length > 0 && onFileSelect) {
      onFileSelect(files);
    }
  };

  return (
    <>
      <Button size="lg" className="rounded-full" onClick={handleUploadClick}>
        <Upload className="mr-2" />
        Upload
      </Button>
      <input
        disabled={isPending}
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default UploadButton;

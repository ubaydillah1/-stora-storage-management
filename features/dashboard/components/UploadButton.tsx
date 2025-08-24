"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

type UploadButtonProps = {
  onFileSelect?: (file: File) => void;
};

const UploadButton: React.FC<UploadButtonProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <>
      <Button size="lg" className="rounded-full" onClick={handleUploadClick}>
        <Upload className="mr-2" />
        Upload
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </>
  );
};

export default UploadButton;

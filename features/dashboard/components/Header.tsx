"use client";

import React, { useRef } from "react";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button";
import { LogOut, Upload } from "lucide-react";
import LogoWithName from "@/components/LogoWithName";

const Header = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="h-[116px] md:flex items-center w-full py-[20px] justify-between hidden">
        <SearchBox />

        <div className="flex items-center gap-[14px]">
          <Button
            size="lg"
            className="rounded-full"
            onClick={handleUploadClick}
          >
            <Upload className="mr-2" />
            Upload
          </Button>
          <LogOut className="text-destructive rotate-180 cursor-pointer" />

          <input
            type="file"
            ref={fileInputRef}
            // onChange={handleFileChange}
            className="hidden"
          />
        </div>
      </header>

      {/* Mobile Header */}
      <header className="md:hidden flex justify-between w-full">
        <LogoWithName className="text-primary" />
      </header>
    </>
  );
};

export default Header;

"use client";

import React from "react";
import SearchBox from "./SearchBox";
import { LogOut } from "lucide-react";
import LogoWithName from "@/components/LogoWithName";
import UploadButton from "@/features/dashboard/components/UploadButton";

const Header = () => {
  const handleFileSelect = (file: File) => {
    console.log("File selected:", file);
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="h-[116px] md:flex items-center w-full py-[20px] justify-between hidden">
        <SearchBox />

        <div className="flex items-center gap-[14px]">
          <UploadButton onFileSelect={handleFileSelect} />
          <LogOut className="text-destructive rotate-180 cursor-pointer" />
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

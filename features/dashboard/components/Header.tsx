import React from "react";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button";
import { LogOut, Upload } from "lucide-react";

const Header = () => {
  return (
    <header className="h-[116px] flex items-center w-full py-[20px] justify-between">
      <SearchBox />

      <div className="flex items-center gap-[14px]">
        <Button size={"lg"} className="rounded-full">
          <Upload />
          Upload
        </Button>
        <LogOut className="text-destructive rotate-180 cursor-pointer" />
      </div>
    </header>
  );
};

export default Header;

"use client";

import React, { useRef } from "react";
import { Search } from "lucide-react";

const SearchBox = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className="bg-white p-[16px] rounded-[30px] flex gap-5 w-[482px]"
      style={{
        boxShadow:
          "0 0 30px 0 rgba(89, 104, 178, 0.06), 0 0 40px 0 rgba(89, 104, 178, 0.06)",
      }}
      onClick={handleClick}
    >
      <Search />
      <input
        type="text"
        ref={inputRef}
        placeholder="Search..."
        className="outline-none subtitle2 w-full"
      />
    </div>
  );
};

export default SearchBox;

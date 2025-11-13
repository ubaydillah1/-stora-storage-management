"use client";

import React, { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useFilter } from "@/store/useFilter";

const SearchBox = () => {
  const { search, setSearch } = useFilter();
  const [localSearch, setLocalSearch] = useState(search || "");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localSearch);
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch, setSearch]);

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
        value={localSearch}
        onChange={(e) => setLocalSearch(e.target.value)}
        className="outline-none subtitle2 w-full"
      />
    </div>
  );
};

export default SearchBox;

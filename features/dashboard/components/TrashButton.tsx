"use client";

import { Trash2 } from "lucide-react";

export default function TrashButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="
        group 
        p-3 
        rounded-full 
        bg-red-100 
        hover:bg-red-200 
        transition-all 
        duration-200 
        shadow-sm 
        hover:shadow-md 
        active:scale-95
      "
    >
      <Trash2
        className="
          w-5 h-5 
          text-red-600 
          group-hover:text-red-700 
          transition-all 
          duration-200
        "
      />
    </button>
  );
}

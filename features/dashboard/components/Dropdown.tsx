"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilter } from "@/store/useFilter";
import { NodeSort } from "@/features/api/nodes/types";

export default function Dropdown() {
  const { setSort } = useFilter();

  return (
    <Select onValueChange={(value) => setSort(value as NodeSort)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Sort</SelectLabel>

          <SelectItem value="a-z">Name A–Z</SelectItem>
          <SelectItem value="z-a">Name Z–A</SelectItem>

          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

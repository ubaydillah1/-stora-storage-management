"use client";

import React from "react";
import SearchBox from "./SearchBox";
import { LogOut } from "lucide-react";
import LogoWithName from "@/components/LogoWithName";
import UploadButton from "@/features/dashboard/components/UploadButton";
import { logout } from "@/features/api/auth/services/auth-services";
import { useRouter } from "next/navigation";
import { useUploadFiles } from "@/features/api/nodes/hooks/useUploadFiles";
import { toast } from "sonner";

const Header = () => {
  const router = useRouter();
  const { mutate, isPending } = useUploadFiles({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Files uploaded successfully");
      },
      onError: () => {
        toast.error("Failed to upload files");
      },
    },
  });

  const handleFileSelect = (files: File[]) => {
    mutate({ data: files, parentId: null });
  };

  const handleLogout = () => {
    logout();
    localStorage.removeItem("a");
    router.push("/login");
  };

  return (
    <>
      <header className="h-[116px] md:flex items-center w-full py-[20px] justify-between hidden">
        <SearchBox />

        <div className="flex items-center gap-[14px]">
          <UploadButton onFileSelect={handleFileSelect} isPending={isPending} />
          <LogOut
            className="text-destructive rotate-180 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </header>

      <header className="md:hidden flex justify-between w-full">
        <LogoWithName className="text-primary" />
      </header>
    </>
  );
};

export default Header;

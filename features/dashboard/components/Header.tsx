"use client";

import React from "react";
import SearchBox from "./SearchBox";
import { LogOut } from "lucide-react";
import LogoWithName from "@/components/LogoWithName";
import UploadButton from "@/features/dashboard/components/UploadButton";
import { logout } from "@/features/api/auth/services/auth-services";
import { useRouter } from "next/navigation";
import { useUploadFile } from "@/features/api/nodes/hooks/useUploadFile";
import { toast } from "sonner";
import { useUploadQueue } from "@/store/useUploadQueue";

const Header = ({ parentId }: { parentId: string | null }) => {
  const router = useRouter();

  const add = useUploadQueue((s) => s.add);
  const finish = useUploadQueue((s) => s.finish);

  const { mutateAsync } = useUploadFile({});

  const handleFileSelect = async (files: File[]) => {
    for (const file of files) {
      const id = add(file.name);

      try {
        await mutateAsync({
          file,
          parentId,
        });

        finish(id);
      } catch {
        toast.error(`Upload failed: ${file.name}`);
        finish(id);
      }
    }
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
          <UploadButton onFileSelect={handleFileSelect} />
          <LogOut
            className="text-destructive rotate-180 cursor-pointer"
            onClick={handleLogout}
          />
        </div>
      </header>

      <div className="md:hidden flex justify-between w-full">
        <LogoWithName className="text-primary" />
      </div>
    </>
  );
};

export default Header;

"use client";

import Dropdown from "@/features/dashboard/components/Dropdown";
import MyDropzone from "@/features/dashboard/components/Dropzone";
import Header from "@/features/dashboard/components/Header";
import SelectedItems from "@/features/dashboard/components/SelectedItems";
import { useBreadcrumb } from "@/features/api/nodes/hooks/useBreadcrumb";
import Link from "next/link";
import { usePathname } from "next/navigation";

const ItemsWrapper = ({
  parentId,
  path,
}: {
  parentId?: string | null;
  path: string | string[];
}) => {
  const pathname = usePathname();

  const sectionMap: Record<string, string> = {
    "/documents": "Documents",
    "/images": "Images",
    "/media": "Media",
    "/others": "Others",
  };

  const currentSection = Object.entries(sectionMap).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  const pathArray = Array.isArray(path)
    ? path
    : path.split("/").filter(Boolean);

  const pathString = Array.isArray(path) ? path.join("/") : path;

  const { data: breadcrumb = [] } = useBreadcrumb(
    pathname.startsWith("/my") ? pathArray : []
  );

  const folderName = currentSection
    ? currentSection
    : breadcrumb.at(-1)?.name || "My File";

  return (
    <div className="w-full flex flex-col md:pr-[40px] h-full">
      <Header />

      <div className="flex-1 bg-[#F2F4F8] rounded-[30px] flex flex-col min-h-0 relative select-none">
        <MyDropzone />

        <div className="p-[20px] pb-0 md:p-[40px] md:pb-0 md:pt-[20px]">
          {pathname.startsWith("/my") && pathArray.length > 0 && (
            <div className="flex items-center gap-2 text-gray-700 text-sm">
              <Link href="/my" className="hover:underline">
                My File
              </Link>

              {breadcrumb.map((node, index) => {
                const href = "/my/" + pathArray.slice(0, index + 1).join("/");

                return (
                  <div key={node.id} className="flex items-center gap-2">
                    <span>/</span>
                    <Link href={href} className="hover:underline capitalize">
                      {node.name}
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          <h1 className="capitalize h1 mt-4">{folderName}</h1>

          <div className="flex justify-between w-full md:mb-4 mb-2 flex-col md:flex-row">
            <p className="my-2">
              Total : <strong>12GB</strong>
            </p>
            <div className="flex gap-[20px] items-center w-full md:w-fit justify-between">
              <p>Sort By:</p>
              <Dropdown />
            </div>
          </div>
        </div>

        <SelectedItems parentId={parentId} path={pathString} />
      </div>
    </div>
  );
};

export default ItemsWrapper;

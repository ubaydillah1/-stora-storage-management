import Dropdown from "@/features/dashboard/components/Dropdown";
import MyDropzone from "@/features/dashboard/components/Dropzone";
import Header from "@/features/dashboard/components/Header";
import NavSide from "@/features/dashboard/components/NavSide";
import SelectedItems from "@/features/dashboard/components/SelectedItems";
import { notFound } from "next/navigation";
import React from "react";

const ItemsPage = async ({ params }: { params: { path: string } }) => {
  const path = (await params).path;

  const allowedPaths = ["/", "images", "others", "documents", "media"];
  if (!allowedPaths.includes(path)) {
    notFound();
  }

  return (
    <main className="flex h-screen overflow-hidden">
      <NavSide />
      <div className="w-full flex flex-col md:pr-[40px] h-full">
        <Header />
        <div className="flex-1 bg-[#F2F4F8] rounded-[30px] flex flex-col min-h-0 relative select-none">
          <MyDropzone />

          <div className="p-[20px] pb-0! md:p-[40px] md:pb-0 md:pt-[20px]">
            <h1 className="capitalize h1">{path}</h1>
            <div className="flex justify-between w-full md:mb-4">
              <p>
                Total : <strong>12GB</strong>
              </p>
              <div className="flex gap-[20px] items-center">
                <p>Sort By:</p>
                <Dropdown />
              </div>
            </div>
          </div>

          <SelectedItems />
        </div>
      </div>
    </main>
  );
};

export default ItemsPage;

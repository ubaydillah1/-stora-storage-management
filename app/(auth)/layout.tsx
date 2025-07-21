import LogoWithName from "@/components/LogoWithName";
import Image from "next/image";
import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex">
      <div className="lg:max-w-[580px] w-full hidden lg:flex flex-col justify-between bg-primary h-screen px-[60px] py-[40px]">
        <LogoWithName />

        <div className="flex flex-col gap-[18px] text-white max-w-[430px]">
          <h1 className="font-bold text-[46px] leading-[56px]">
            Manage your files the best way
          </h1>
          <p className="body1">
            Awesome, we&apos;ve created the perfect place for you to store all
            your documents.
          </p>
        </div>

        <div className="relative h-[300px] aspect-square hover:rotate-2 hover:scale-105 transition-all">
          <Image
            src={"/assets/images/files.png"}
            alt="files"
            fill
            className="object-contain"
          />
        </div>
      </div>
      {children}
    </main>
  );
};

export default Layout;

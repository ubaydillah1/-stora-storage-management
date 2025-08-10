import LogoWithName from "@/components/LogoWithName";
import {
  Folders,
  Images,
  LayoutDashboard,
  MonitorPlay,
  Palette,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const NavSide = () => {
  return (
    <aside className="hidden md:flex flex-col justify-between h-screen w-fit py-[20px] px-[20px] lg:px-[40px]">
      <div>
        <div className="mb-5">
          <LogoWithName className="text-primary hidden lg:block" />
        </div>
        <ul className="flex flex-col items-center">
          <li className="bg-primary lg:w-full w-[60px] h-[60px] flex items-center gap-[18px] rounded-full px-[15px] lg:px-[30px] text-white">
            <LayoutDashboard className="size-full lg:size-auto" />
            <Link href="/" className="hidden lg:block h5">
              Dashboard
            </Link>
          </li>
          <li className="lg:w-full h-[60px] flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px]">
            <Folders className="text-muted-foreground" />
            <Link href="/documents" className="hidden lg:block">
              Documents
            </Link>
          </li>
          <li className="lg:w-full h-[60px] flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px]">
            <Images className="text-muted-foreground" />
            <Link href="/images" className="hidden lg:block">
              Images
            </Link>
          </li>
          <li className="lg:w-full h-[60px] flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px]">
            <MonitorPlay className="text-muted-foreground" />
            <Link href="/media" className="hidden lg:block">
              Media
            </Link>
          </li>
          <li className="lg:w-full h-[60px] flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px]">
            <Palette className="text-muted-foreground" />
            <Link href="/others" className="hidden lg:block">
              Others
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-[20px]">
        <div className="relative w-[253px] h-[209px] hidden lg:block">
          <Image
            src={"/assets/images/files-2.png"}
            fill
            alt="files illustration"
          />
        </div>
        <div className="flex items-center gap-[14px] justify-center">
          <div className="relative aspect-square h-[54px]">
            <Image src={"/assets/images/avatar.png"} alt="avatar" fill />
          </div>
          <div className="hidden lg:block">
            <strong className="h5">Adrian JSM</strong>
            <p className="text-light-2">adrian@jsmastery.pro</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default NavSide;

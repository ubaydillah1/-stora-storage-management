"use client";

import LogoWithName from "@/components/LogoWithName";
import {
  Folders,
  Images,
  LayoutDashboard,
  MonitorPlay,
  Palette,
  User,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

const NavSide = () => {
  const pathname = usePathname();

  const getNavItemClass = (path: string) => {
    const isActive = pathname === path;
    return `lg:w-full h-[60px] aspect-square lg:aspect-auto flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px] justify-center lg:justify-start ${
      isActive ? "bg-primary text-white" : "text-muted-foreground"
    }`;
  };

  return (
    <aside className="hidden md:flex flex-col justify-between h-screen w-fit py-[20px] px-[20px] lg:px-[20px]">
      <div>
        <div className="mb-5">
          <LogoWithName className="text-primary hidden lg:block" />
        </div>
        <ul className="flex flex-col items-center">
          <li className="w-full flex justify-center items-center">
            <Link href="/" className={getNavItemClass("/")}>
              <LayoutDashboard />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </li>

          {/* NEW — MY */}
          <li className="w-full flex justify-center items-center">
            <Link href="/my" className={getNavItemClass("/my")}>
              <User />
              <span className="hidden lg:block">My Files</span>
            </Link>
          </li>

          <li className="w-full flex justify-center items-center">
            <Link href="/documents" className={getNavItemClass("/documents")}>
              <Folders />
              <span className="hidden lg:block">Documents</span>
            </Link>
          </li>

          <li className="w-full flex justify-center items-center">
            <Link href="/images" className={getNavItemClass("/images")}>
              <Images />
              <span className="hidden lg:block">Images</span>
            </Link>
          </li>

          <li className="w-full flex justify-center items-center">
            <Link href="/media" className={getNavItemClass("/media")}>
              <MonitorPlay />
              <span className="hidden lg:block">Media</span>
            </Link>
          </li>

          <li className="w-full flex justify-center items-center">
            <Link href="/others" className={getNavItemClass("/others")}>
              <Palette />
              <span className="hidden lg:block">Others</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-[20px]">
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

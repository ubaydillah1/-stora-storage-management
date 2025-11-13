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
import { useUser } from "@/store/useUser";

const NavSide = () => {
  const pathname = usePathname();
  const user = useUser((state) => state.user);

  const getNavItemClass = (path: string) => {
    const isActive = pathname === path;
    return `lg:w-full h-[60px] aspect-square lg:aspect-auto flex items-center h5 gap-[18px] rounded-full px-[15px] lg:px-[30px] justify-center lg:justify-start ${
      isActive ? "bg-primary text-white" : "text-muted-foreground"
    }`;
  };

  return (
    <aside
      className="
      hidden md:flex flex-col justify-between 
      h-screen py-[20px] px-[20px] lg:px-[20px] 
      w-[370px] overflow-hidden
    "
    >
      <div className="flex flex-col gap-5 min-w-0">
        <LogoWithName className="text-primary hidden lg:block mb-2" />

        <ul className="flex flex-col items-center gap-2 w-full">
          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/" className={getNavItemClass("/")}>
              <LayoutDashboard />
              <span className="hidden lg:block">Dashboard</span>
            </Link>
          </li>

          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/my" className={getNavItemClass("/my")}>
              <User />
              <span className="hidden lg:block">My Files</span>
            </Link>
          </li>

          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/documents" className={getNavItemClass("/documents")}>
              <Folders />
              <span className="hidden lg:block">Documents</span>
            </Link>
          </li>

          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/images" className={getNavItemClass("/images")}>
              <Images />
              <span className="hidden lg:block">Images</span>
            </Link>
          </li>

          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/media" className={getNavItemClass("/media")}>
              <MonitorPlay />
              <span className="hidden lg:block">Media</span>
            </Link>
          </li>

          <li className="w-full flex justify-center lg:justify-start">
            <Link href="/others" className={getNavItemClass("/others")}>
              <Palette />
              <span className="hidden lg:block">Others</span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="flex items-center gap-4 px-2 w-full min-w-0 overflow-hidden">
        <div className="relative h-[54px] w-[54px] rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={"/assets/images/avatar.png"}
            alt="avatar"
            fill
            className="object-cover"
          />
        </div>

        <div className="hidden lg:flex flex-col min-w-0 flex-1">
          <div className="font-semibold text-sm line-clamp-1">
            {user.name || "N/A"}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {user.email || "No email"}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default NavSide;

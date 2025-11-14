"use client";

import { NodeRecentFileResult } from "@/features/api/nodes/api/getTodayRecentFiles";
import { useGetTodayRecentFiles } from "@/features/api/nodes/hooks/useGetTodayRecentFiles";
import {
  // EllipsisVertical,
  Folders,
  Inbox,
  Images,
  MonitorPlay,
  Palette,
} from "lucide-react";
import React, { JSX } from "react";

const categoryConfig: Record<string, { icon: JSX.Element; bg: string }> = {
  DOCUMENT: {
    icon: <Folders className="w-7 aspect-square text-white" />,
    bg: "bg-chart-1",
  },
  IMAGE: {
    icon: <Images className="w-7 aspect-square text-white" />,
    bg: "bg-chart-2",
  },
  VIDEO: {
    icon: <MonitorPlay className="w-7 aspect-square text-white" />,
    bg: "bg-chart-3",
  },
  AUDIO: {
    icon: <MonitorPlay className="w-7 aspect-square text-white" />,
    bg: "bg-chart-3",
  },
  OTHER: {
    icon: <Palette className="w-7 aspect-square text-white" />,
    bg: "bg-chart-4",
  },
  DEFAULT: {
    icon: <Folders className="w-7 aspect-square text-white" />,
    bg: "bg-muted",
  },
};

const RecentFilesList = () => {
  const { data, isPending } = useGetTodayRecentFiles({});

  return (
    <div className="flex flex-col h-full ">
      <h2 className="h2 text-[20px]! md:text-[24px]!">Recent files uploaded</h2>

      <div className="mt-5 flex flex-col gap-[18px] flex-1 overflow-y-auto pr-1">
        {/* LOADING SKELETON */}
        {isPending &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between w-full animate-pulse"
            >
              <div className="flex gap-4 items-center">
                <div className="w-[50px] h-[50px] bg-muted rounded-full" />
                <div>
                  <div className="h-3 w-[120px] bg-muted rounded mb-2" />
                  <div className="h-3 w-[80px] bg-muted rounded" />
                </div>
              </div>
            </div>
          ))}

        {/* DATA */}
        {!isPending &&
          data!.map((file: NodeRecentFileResult) => {
            const conf =
              categoryConfig[file.category] ?? categoryConfig.DEFAULT;

            return (
              <div
                key={file.id}
                className="flex items-center justify-between w-full"
              > 
                <div className="flex gap-4 items-center">
                  <div
                    className={`size-[50px] ${conf.bg} rounded-full flex items-center justify-center`}
                  >
                    {conf.icon}
                  </div>

                  <div className="flex-1">
                    <p className="subtitle2 line-clamp-1 ">
                      {file.name}
                      {file.type}
                    </p>
                    <p className="body2 text-muted-foreground">
                      {new Date(file.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>

                {/* <div><EllipsisVertical /></div> */}
              </div>
            );
          })}

        {/* EMPTY STATE */}
        {!isPending && data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-6 text-center text-muted-foreground">
            <Inbox className="size-10 mb-2 opacity-80" />
            <p className="text-[12px] italic">No recent files today</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentFilesList;

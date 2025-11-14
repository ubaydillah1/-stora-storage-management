"use client";

import { Folders, Images, MonitorPlay, Palette } from "lucide-react";
import React from "react";

type SizeCardProps = {
  data?: {
    categories: {
      document: { size: number; count: number };
      image: { size: number; count: number };
      video: { size: number; count: number };
      audio: { size: number; count: number };
      other: { size: number; count: number };
    };
  };
  isPending?: boolean;
};

const formatGB = (bytes: number = 0) => {
  return (bytes / 1024 / 1024 / 1024).toFixed(2);
};

const SizeCard = ({ data, isPending }: SizeCardProps) => {
  const categories = [
    {
      title: "Documents",
      value: data?.categories.document.size ?? 0,
      icon: <Folders className="w-7 aspect-square text-white" />,
      bg: "bg-chart-1",
      desc: "Stored files",
    },
    {
      title: "Images",
      value: data?.categories.image.size ?? 0,
      icon: <Images className="w-7 aspect-square text-white" />,
      bg: "bg-chart-2",
      desc: "Photos & assets",
    },
    {
      title: "Media",
      value:
        (data?.categories.video.size ?? 0) + (data?.categories.audio.size ?? 0),
      icon: <MonitorPlay className="w-7 aspect-square text-white" />,
      bg: "bg-chart-3",
      desc: "Clips, videos & audio",
    },
    {
      title: "Others",
      value: data?.categories.other.size ?? 0,
      icon: <Palette className="w-7 aspect-square text-white" />,
      bg: "bg-chart-4",
      desc: "Miscellaneous files",
    },
  ];

  return (
    <div className="h-full flex-1 grid md:grid-cols-2 md:grid-rows-2 grid-rows-1 gap-3">
      {categories.map((item, index) => (
        <div
          key={index}
          className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div
              className={`w-12 aspect-square rounded-full flex items-center justify-center ${item.bg}`}
            >
              {item.icon}
            </div>

            <span className="text-gray-500 text-sm">
              {isPending ? "..." : `${formatGB(item.value)} GB`}
            </span>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              {item.title}
            </h4>
            <p className="text-sm text-gray-500">{item.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SizeCard;

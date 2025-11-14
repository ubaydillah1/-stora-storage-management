"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { axiosInstance } from "@/lib/axiosClient";
import { NodeResult } from "@/features/api/nodes/types";
import { getFileType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function FileViewer({ id }: { id: string }) {
  const router = useRouter();

  const [file, setFile] = useState<NodeResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axiosInstance
      .get(`/api/dashboard/nodes/${id}`)
      .then((res) => {
        setFile(res.data.result);
      })
      .catch(() => {
        setError("Failed to load file");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const Header = (
    <div className="absolute top-3 left-3 z-50">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 bg-black/60 text-white px-4 py-2 rounded-xl 
                   backdrop-blur-md hover:bg-black/80 transition text-sm md:text-base"
      >
        <ArrowLeft size={18} />
        <span>Back</span>
      </button>
    </div>
  );

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="animate-pulse text-gray-500">Loading file...</p>
      </div>
    );

  if (error || !file)
    return (
      <div className="w-full h-screen flex justify-center items-center relative">
        {Header}
        <p className="text-red-500">{error || "File not found"}</p>
      </div>
    );

  const { type, extension } = getFileType(file.type);
  const url = file.url;

  if (type === "image")
    return (
      <div className="w-full h-screen flex justify-center items-center p-2 md:p-4 bg-black relative">
        {Header}
        <Image
          src={url}
          alt={file.name}
          width={1600}
          height={1600}
          className="w-auto h-auto max-w-full max-h-full object-contain"
        />
      </div>
    );

  if (type === "video")
    return (
      <div className="w-full h-screen flex justify-center items-center bg-black relative">
        {Header}
        <video
          controls
          className="max-w-[100%] max-h-[100%] md:max-w-[90%] md:max-h-[90%] rounded-lg"
        >
          <source src={url} type={file.type} />
        </video>
      </div>
    );

  if (type === "audio")
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center relative px-4">
        {Header}
        <audio controls className="w-full max-w-[500px]">
          <source src={url} type={file.type} />
        </audio>
      </div>
    );

  if (extension === "pdf")
    return (
      <div className="w-full h-screen relative">
        {Header}
        <iframe src={url} className="w-full h-full" />
      </div>
    );

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center relative px-4">
      {Header}
      <p className="text-gray-600 mb-4">Preview not available</p>

      <a href={url} target="_blank" className="text-blue-500 underline text-lg">
        Download File
      </a>
    </div>
  );
}

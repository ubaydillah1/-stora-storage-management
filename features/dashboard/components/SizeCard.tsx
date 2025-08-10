import { Folders, Images, MonitorPlay, Palette } from "lucide-react";
import React from "react";

const SizeCard = () => {
  return (
    <div className="h-full flex-1 grid md:grid-cols-2 md:grid-rows-2 grid-rows-1 gap-3">
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between md:gap-3 lg:gap-0">
        <div className="flex items-center justify-between">
          <div className="w-12 aspect-square rounded-full flex items-center justify-center bg-chart-1">
            <Folders className="w-7 aspect-square text-white" />
          </div>
          <span className="text-gray-500 text-sm">20 GB</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Documents</h4>
          <p className="text-sm text-gray-500">Stored files</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 aspect-square rounded-full flex items-center justify-center bg-chart-2">
            <Images className="w-7 aspect-square text-white" />
          </div>
          <span className="text-gray-500 text-sm">15 GB</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Images</h4>
          <p className="text-sm text-gray-500">Photos & assets</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 aspect-square rounded-full flex items-center justify-center bg-chart-3">
            <MonitorPlay className="w-7 aspect-square text-white" />
          </div>
          <span className="text-gray-500 text-sm">10 GB</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Videos</h4>
          <p className="text-sm text-gray-500">Clips & movies</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-12 aspect-square rounded-full flex items-center justify-center bg-chart-4">
            <Palette className="w-7 aspect-square text-white" />
          </div>
          <span className="text-gray-500 text-sm">8 GB</span>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-gray-800">Others</h4>
          <p className="text-sm text-gray-500">Miscellaneous files</p>
        </div>
      </div>
    </div>
  );
};

export default SizeCard;

import { Folders, Images, MonitorPlay, Palette } from "lucide-react";
import React from "react";

const SizeCard = () => {
  return (
    <div className="h-full flex-1 grid grid-cols-2 grid-rows-2 gap-5">
      <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-chart-1">
            <Folders className="w-5 h-5 text-white" />
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-chart-2">
            <Images className="w-5 h-5 text-white" />
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-chart-3">
            <MonitorPlay className="w-5 h-5 text-white" />
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
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-chart-4">
            <Palette className="w-5 h-5 text-white" />
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

import { EllipsisVertical, Folders } from "lucide-react";
import React from "react";

const RecentFilesList = () => {
  return (
    <div>
      <h2 className="h2">Recent files uploaded</h2>

      <div className="my-5 flex flex-col gap-[18px]">
        <div className="flex items-center justify-between w-full cursor-pointer">
          <div className="flex gap-4 items-center">
            <div className="w-[50px] aspect-square bg-chart-1 p-[13px] rounded-full">
              <Folders className="size-full text-white" />
            </div>

            <div>
              <p className="subtitle2">CVdesigner.docx</p>
              <p className="body2 text-muted-foreground">4:57am, 10 Nov</p>
            </div>
          </div>
          <div>
            <EllipsisVertical />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentFilesList;

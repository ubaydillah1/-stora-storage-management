import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { NodeResult } from "@/features/api/nodes/types";
import { ModalProps } from "@/types/modalProps";
import Image from "next/image";
import { Folder } from "lucide-react";
import { getFileIcon, getFileType } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { formatDate } from "@/utils/formatDate";

interface DetailDialogProps extends ModalProps {
  selectedItem: NodeResult;
  folders: NodeResult[];
}

const DetailDialog = ({
  isOpen,
  selectedItem,
  setIsOpen,
  folders,
}: DetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[480px] rounded-2xl p-6">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            Item Details
          </DialogTitle>
        </DialogHeader>

        {selectedItem && (
          <div className="py-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                {folders.some((f) => f.id === selectedItem.id) ? (
                  <Folder className="w-8 h-8 text-yellow-500" />
                ) : (
                  <Image
                    src={getFileIcon(
                      getFileType(selectedItem.type).extension,
                      getFileType(selectedItem.type).type
                    )}
                    alt="icon"
                    width={36}
                    height={36}
                  />
                )}
              </div>
              <div>
                <p className="font-medium text-lg">{selectedItem.name}</p>
                <p className="text-sm text-gray-500 capitalize">
                  {folders.some((f) => f.id === selectedItem.id)
                    ? "Folder"
                    : getFileType(selectedItem.type).type}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {!folders.some((f) => f.id === selectedItem.id) && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Size
                  </Label>
                  <p className="text-gray-900">
                    {selectedItem.size
                      ? `${(selectedItem.size / 1024 / 1024).toFixed(2)} MB`
                      : "-"}
                  </p>
                </div>
              )}

              {!folders.some((f) => f.id === selectedItem.id) && (
                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    File Type
                  </Label>
                  <p className="text-gray-900">{selectedItem.type}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-gray-600">
                  Created At
                </Label>
                <p className="text-gray-900">
                  {formatDate(selectedItem.createdAt)}
                </p>
              </div>
            </div>

            {!folders.some((f) => f.id === selectedItem.id) && (
              <div className="flex gap-3 pt-2">
                <Button
                  variant={"outline"}
                  className="flex-1"
                  onClick={() =>
                    window.open(`/view/${selectedItem.id}`, "_blank")
                  }
                >
                  Open
                </Button>
              </div>
            )}
          </div>
        )}

        <DialogFooter className="pt-4 border-t">
          <Button onClick={() => setIsOpen(false)} className="w-full">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DetailDialog;

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateFolder } from "@/features/api/nodes/hooks/useCreateFolder";
import { ModalProps } from "@/types/modalProps";
import { useState } from "react";
import { toast } from "sonner";

const CreateFolderDialog = ({
  isOpen,
  onClose,
  setIsOpen,
  parentId,
}: ModalProps) => {
  const [newFolderName, setNewFolderName] = useState("");
  const { mutate, isPending } = useCreateFolder({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        toast.success("Folder created successfully");
      },
      onError: () => {
        onClose();
        toast.error("Failed to create folder");
      },
    },
  });

  const handleCreateFolder = () => {
    console.log("Masuk");
    mutate({ name: newFolderName, parentId });
    setNewFolderName("");
  };

  const handleCancelCreateFolder = () => {
    onClose();
    setNewFolderName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Folde</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="folderName">Folder Name</Label>
            <Input
              id="folderName"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Enter folder name"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancelCreateFolder}>
            Cancel
          </Button>
          <Button onClick={handleCreateFolder} disabled={isPending}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFolderDialog;

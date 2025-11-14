"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ModalProps } from "@/types/modalProps";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { NodeResult } from "@/features/api/nodes/types";
import { useRenameNode } from "@/features/api/nodes/hooks/useRenameNode";
import { toast } from "sonner";

export interface RenameNodeDialogProps extends ModalProps {
  setSelectedItem: (item: NodeResult | null) => void;
  selectedItem: NodeResult | null;
  renameName: string;
  setRenameName: (name: string) => void;
}

const RenameNodeDialog = ({
  isOpen,
  setIsOpen,
  setSelectedItem,
  selectedItem,
  renameName,
  setRenameName,
}: RenameNodeDialogProps) => {
  const { mutate, isPending } = useRenameNode({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Node renamed successfully");
        setIsOpen(false);
        setSelectedItem(null);
        setRenameName("");
      },
      onError: () => {
        toast.error("Failed to rename node");
      },
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItem) {
      mutate({ id: selectedItem.id, newName: renameName });
    }
  };

  const handleCancelRename = () => {
    setIsOpen(false);
    setSelectedItem(null);
    setRenameName("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="renameName">Name</Label>
              <Input
                id="renameName"
                autoFocus
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                placeholder="Enter new name"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelRename}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isPending}>
              {isPending ? "Renaming..." : "Rename"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RenameNodeDialog;

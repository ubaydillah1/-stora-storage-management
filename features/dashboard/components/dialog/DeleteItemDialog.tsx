"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useDeleteNodes } from "@/features/api/nodes/hooks/useDeleteNodes";
import { NodeResult } from "@/features/api/nodes/types";
import { ModalProps } from "@/types/modalProps";
import { toast } from "sonner";

interface DeleteItemDialogProps extends ModalProps {
  selectedItem: NodeResult | null;
  setSelectedItem: (item: NodeResult | null) => void;
}

const DeleteItemDialog = ({
  isOpen,
  setIsOpen,
  selectedItem,
  setSelectedItem,
}: DeleteItemDialogProps) => {
  const { mutate, isPending } = useDeleteNodes({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Item deleted successfully");
        setIsOpen(false);
        setSelectedItem(null);
      },
      onError: () => {
        toast.error("Failed to delete item");
      },
    },
  });

  const handleConfirmDelete = () => {
    if (selectedItem) {
      mutate([selectedItem.id]);
    }
  };

  const handleCancelDelete = () => {
    setIsOpen(false);
    setSelectedItem(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-w-[600px]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmDelete();
          }}
        >
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p>
              Are you sure you want to delete ”{selectedItem?.name}”? This
              action cannot be undone.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancelDelete}
              disabled={isPending}
            >
              Cancel
            </Button>

            <Button type="submit" variant="destructive" disabled={isPending}>
              {isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteItemDialog;

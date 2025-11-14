export interface ModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: () => void;
  parentId?: string | null;
}

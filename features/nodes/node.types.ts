import { FileCategory, NodeType } from "@prisma/client";

export type CreateNodeInput = {
  url: string;
  name: string;
  size?: number;
  type: string;
  userId: string;
  nodeType?: NodeType;
  mimeType?: string;
  category?: FileCategory;
  parentId?: string | null;
};

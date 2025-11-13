export type NodeSort = "a-z" | "z-a" | "newest" | "oldest";

export type FileCategory = "IMAGE" | "DOCUMENT" | "MEDIA" | "OTHER" | "";

export type NodeType = "FILE" | "FOLDER";

export interface NodeResult {
  id: string;
  name: string;
  type: string;
  nodeType: NodeType;
  parentId: string | null;
  category: FileCategory;
  userId: string;
  size: number;
  mimeType: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface NodeListResponse {
  files: NodeResult[];
  nextCursor: string | null;
}

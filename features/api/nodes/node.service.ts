import path from "path";
import { Prisma, FileCategory, NodeType } from "@prisma/client";
import { nodeRepository } from "./node.repository";
import { uploadFileToSupabase, removeFileFromSupabase } from "./utils/upload";
import { getNodeCategory } from "./utils/getFileCategort";
import { generateUniqueName } from "./utils/generateUniqueName";

export const nodeService = {
  async uploadFiles(userId: string, files: File[], parentId: string | null) {
    const results = await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) return null;

        const { success, result } = await uploadFileToSupabase(file);
        if (!success) throw new Error(result);

        const ext = path.extname(file.name);
        const pureName = path.basename(file.name, ext);

        const existingNodes = await nodeRepository.findAllByParentId(
          parentId,
          userId
        );

        const existingNames = existingNodes
          .filter((n) => n.nodeType === NodeType.FILE)
          .map((n) => n.name);

        const finalName = generateUniqueName(pureName, existingNames);

        const category = getNodeCategory(file.type, file.name);

        const node = await nodeRepository.createNode({
          url: result,
          name: finalName,
          size: file.size,
          type: ext,
          userId,
          parentId,
          nodeType: NodeType.FILE,
          mimeType: file.type,
          category,
        });

        return node;
      })
    );

    return results.filter(Boolean);
  },

  async createFolder(userId: string, name: string, parentId?: string | null) {
    return nodeRepository.createNode({
      url: "",
      name,
      type: "folder",
      userId,
      nodeType: NodeType.FOLDER,
      mimeType: undefined,
      category: undefined,
      parentId: parentId || null,
    });
  },

  async removeNodes(nodeIds: string[]) {
    const nodes = await nodeRepository.findManyByIds(nodeIds);

    for (const node of nodes) {
      if (node.nodeType === "FILE") {
        if (node.url) {
          await removeFileFromSupabase(node.url);
        }
        await nodeRepository.deleteNodeById(node.id);
      } else if (node.nodeType === "FOLDER") {
        await nodeRepository.deleteFolderRecursive(node.id);
      }
    }
  },

  async getFiles({
    userId,
    limit,
    cursor,
    search,
    sort,
    category,
  }: {
    userId: string;
    limit: number;
    cursor: string | null;
    search?: string;
    sort?: string;
    category?: string | null;
  }) {
    const where: Prisma.NodeWhereInput = {
      userId,
      nodeType: "FILE",
      ...(category ? { category: category as FileCategory } : {}),
      ...(search
        ? {
            name: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          }
        : {}),
    };

    let orderBy: Record<string, "asc" | "desc"> = { updatedAt: "desc" };
    switch (sort) {
      case "a-z":
        orderBy = { name: "asc" };
        break;
      case "z-a":
        orderBy = { name: "desc" };
        break;
      case "newest":
        orderBy = { createdAt: "desc" };
        break;
      case "oldest":
        orderBy = { createdAt: "asc" };
        break;
    }

    const { files, nextCursor } = await nodeRepository.findMany(
      where,
      orderBy,
      limit,
      cursor
    );

    return { files, nextCursor };
  },

  async getFolders(userId: string) {
    const folders = await nodeRepository.findAllFolders(userId);
    return folders;
  },

  async getNodesByParent({
    userId,
    parentId,
    limit,
    cursor,
  }: {
    userId: string;
    parentId: string | null;
    limit: number;
    cursor: string | null;
  }) {
    const { nodes, nextCursor } = await nodeRepository.findByParentId(
      userId,
      parentId,
      limit,
      cursor
    );
    return { nodes, nextCursor };
  },

  async renameNode(id: string, newName: string) {
    return nodeRepository.updateNodeName(id, newName.trim());
  },
};

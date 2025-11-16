import path from "path";
import { Prisma, FileCategory, NodeType } from "@prisma/client";
import { nodeRepository } from "./node.repository";
import { uploadFileToSupabase, removeFileFromSupabase } from "./utils/upload";
import { getNodeCategory } from "./utils/getFileCategort";
import { generateUniqueName } from "./utils/generateUniqueName";

export const nodeService = {
  async uploadFile(userId: string, file: File, parentId: string | null) {
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

    return [node];
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
    parentId,
  }: {
    userId: string;
    limit: number;
    cursor: string | null;
    search?: string;
    sort?: string;
    category?: string | null;
    parentId?: string | null;
  }) {
    const where: Prisma.NodeWhereInput = {
      userId,
      nodeType: "FILE",
      ...(parentId !== undefined ? { parentId } : {}),
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
        orderBy = { updatedAt: "desc" };
        break;
      case "oldest":
        orderBy = { updatedAt: "asc" };
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

  async getFolders(userId: string, parentId: string | null) {
    return nodeRepository.findFoldersByParent(userId, parentId);
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

  async renameNodeSafe(id: string, newName: string) {
    if (!id) {
      throw Object.assign(new Error("ID required"), { status: 400 });
    }

    if (!newName || newName.trim() === "") {
      throw Object.assign(new Error("Name cannot be empty"), { status: 400 });
    }

    const node = await nodeRepository.findNodeById(id);
    if (!node) {
      throw Object.assign(new Error("Node not found"), { status: 404 });
    }

    const parentId = node.parentId;
    // const isFile = node.nodeType === "FILE";

    const siblings = await nodeRepository.findAllByParentId(
      parentId,
      node.userId
    );

    const otherNames = siblings.filter((n) => n.id !== id).map((n) => n.name);
    const inputName = newName.trim();
    const pureName = path.basename(inputName, path.extname(inputName));

    const finalPureName = generateUniqueName(pureName, otherNames);

    return nodeRepository.renameNode(id, finalPureName);
  },

  async getTodayRecentFiles({ userId }: { userId: string }) {
    return await nodeRepository.findTodayRecentFiles({ userId });
  },

  async moveNodes(
    nodeIds: string[],
    newParentId: string | null,
    userId: string
  ) {
    if (newParentId) {
      const parent = await nodeRepository.findNodeById(newParentId);
      if (!parent || parent.nodeType !== "FOLDER") {
        throw Object.assign(new Error("Target folder not found"), {
          status: 404,
        });
      }
    }

    const nodes = await nodeRepository.findManyByIds(nodeIds);
    if (!nodes.length) {
      throw Object.assign(new Error("Nodes not found"), { status: 404 });
    }

    if (nodeIds.includes(newParentId ?? "")) {
      throw Object.assign(new Error("Cannot move a folder into itself"), {
        status: 400,
      });
    }

    const siblings = await nodeRepository.findAllByParentId(
      newParentId,
      userId
    );
    const existingNames = siblings.map((s) => s.name);

    for (const node of nodes) {
      if (existingNames.includes(node.name)) {
        const pureName = node.name;
        const finalName = generateUniqueName(pureName, existingNames);

        await nodeRepository.updateNodeName(node.id, finalName);
        existingNames.push(finalName);
      }
    }

    await nodeRepository.moveNodes(nodeIds, newParentId);

    return { success: true };
  },
};

import { prisma } from "@/lib/prisma";
import { Prisma, Node } from "@prisma/client";
import { CreateNodeInput } from "./node.types";

export const nodeRepository = {
  async findMany(
    where: Prisma.NodeWhereInput,
    orderBy: Record<string, "asc" | "desc">,
    limit: number,
    cursor: string | null
  ): Promise<{ files: Node[]; nextCursor: string | null }> {
    const files = await prisma.node.findMany({
      where,

      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy,
    });

    let nextCursor: string | null = null;
    if (files.length > limit) {
      const nextItem = files.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return { files, nextCursor };
  },

  async findAllFolders(userId: string): Promise<Node[]> {
    return prisma.node.findMany({
      where: {
        userId,
        nodeType: "FOLDER",
      },
      orderBy: { name: "asc" },
    });
  },

  async findByParentId(
    userId: string,
    parentId: string | null,
    limit: number,
    cursor: string | null
  ): Promise<{ nodes: Node[]; nextCursor: string | null }> {
    const nodes = await prisma.node.findMany({
      where: {
        userId,
        parentId: parentId || null,
      },
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: [{ nodeType: "asc" }, { updatedAt: "desc" }],
    });

    let nextCursor: string | null = null;
    if (nodes.length > limit) {
      const nextItem = nodes.pop();
      nextCursor = nextItem?.id ?? null;
    }

    return { nodes, nextCursor };
  },

  async createNode(data: CreateNodeInput) {
    return prisma.node.create({ data });
  },

  async updateNodeName(id: string, newName: string): Promise<Node> {
    return prisma.node.update({
      where: { id },
      data: { name: newName, updatedAt: new Date() },
    });
  },

  async deleteNodesByUrls(urls: string[]) {
    return prisma.node.deleteMany({
      where: { url: { in: urls } },
    });
  },

  async deleteNodeById(id: string) {
    return prisma.node.delete({
      where: { id },
    });
  },

  async deleteFolderRecursive(folderId: string) {
    const children = await prisma.node.findMany({
      where: { parentId: folderId },
      select: { id: true, nodeType: true },
    });

    for (const child of children) {
      if (child.nodeType === "FOLDER") {
        await nodeRepository.deleteFolderRecursive(child.id);
      } else {
        await prisma.node.delete({ where: { id: child.id } });
      }
    }

    return prisma.node.delete({ where: { id: folderId } });
  },

  async findManyByIds(nodeIds: string[]) {
    return prisma.node.findMany({
      where: { id: { in: nodeIds } },
      select: { id: true, url: true, nodeType: true },
    });
  },

  async findNodeById(id: string) {
    return prisma.node.findUnique({ where: { id } });
  },
};

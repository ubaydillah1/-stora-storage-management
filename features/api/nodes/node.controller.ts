import { nodeRepository } from "./node.repository";
import { nodeService } from "./node.service";
import { NextResponse } from "next/server";
import { NodeSort } from "./types";
import { FileCategory } from "@prisma/client";

export const NodeController = {
  async upload(req: Request) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId") || null;

    const formData = await req.formData();
    const filesRaw = formData.getAll("files") as File[];

    const validFiles = filesRaw.filter(
      (file) => file && file.size > 0 && file.name.trim() !== ""
    );

    if (validFiles.length < 1) {
      return NextResponse.json(
        { message: "No valid files uploaded" },
        { status: 400 }
      );
    }

    const file = validFiles[0];

    const uploadedNode = await nodeService.uploadFile(userId, file, parentId);

    return NextResponse.json({
      message: "File uploaded successfully",
      result: uploadedNode,
    });
  },

  async createFolder(req: Request) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId") || null;

    const body = await req.json();
    const { name } = body as { name: string };

    if (!name || name.trim() === "") {
      return NextResponse.json(
        { message: "Folder name is required" },
        { status: 400 }
      );
    }

    const folder = await nodeService.createFolder(userId, name, parentId);

    return NextResponse.json({
      message: "Folder created successfully",
      result: folder,
    });
  },

  async remove(req: Request) {
    const body = await req.json();
    const { nodeIds } = body as { nodeIds: string[] };

    if (!nodeIds || !Array.isArray(nodeIds) || nodeIds.length === 0) {
      return NextResponse.json(
        { message: "No node IDs provided" },
        { status: 400 }
      );
    }

    await nodeService.removeNodes(nodeIds);

    return NextResponse.json({
      message: "Selected nodes deleted successfully",
    });
  },

  async rename(req: Request) {
    const body = await req.json();
    const { id, newName } = body as { id: string; newName: string };

    if (!id || !newName || newName.trim() === "") {
      return NextResponse.json(
        { message: "Node ID and new name are required" },
        { status: 400 }
      );
    }

    const updated = await nodeService.renameNodeSafe(id, newName);
    return NextResponse.json({
      message: "Node renamed successfully",
      result: updated,
    });
  },

  async getFiles(req: Request) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor") || null;
    const search = searchParams.get("search")?.trim() || "";
    const sort: NodeSort =
      (searchParams.get("sort") as NodeSort) || ("newest" as NodeSort);
    const category = searchParams
      .get("category")
      ?.toUpperCase() as FileCategory;
    const parentId = searchParams.get("parentId") || null;

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ message: "Invalid limit" }, { status: 400 });
    }

    const validCategory = ["IMAGE", "MEDIA", "DOCUMENT", "OTHER"];

    if (category && !validCategory.includes(category)) {
      return NextResponse.json(
        {
          message:
            "Invalid category, valid categories are IMAGE, MEDIA, DOCUMENT, OTHER ",
        },
        { status: 400 }
      );
    }

    const result = await nodeService.getFiles({
      userId,
      limit,
      cursor,
      search,
      sort,
      category,
      parentId,
    });

    return NextResponse.json({
      message: "Files fetched successfully",
      result,
    });
  },

  async getFolders(req: Request) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId") || null;

    const folders = await nodeService.getFolders(userId, parentId);

    return NextResponse.json({
      message: "Folders fetched successfully",
      result: folders,
    });
  },

  async getByParent(req: Request) {
    const userId = req.headers.get("x-user-id");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    const parentId = searchParams.get("parentId");
    const limit = parseInt(searchParams.get("limit") || "10");
    const cursor = searchParams.get("cursor") || null;

    if (!parentId) {
      return NextResponse.json(
        { message: "Parent ID is required" },
        { status: 400 }
      );
    }

    const parent = await nodeRepository.findNodeById(parentId);

    if (!parent || parent.nodeType !== "FOLDER") {
      return NextResponse.json(
        { message: "Parent folder not found" },
        { status: 404 }
      );
    }

    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ message: "Invalid limit" }, { status: 400 });
    }

    const { nodes, nextCursor } = await nodeService.getNodesByParent({
      userId,
      parentId,
      limit,
      cursor,
    });

    return NextResponse.json({
      message: "Folder contents fetched successfully",
      result: nodes,
      nextCursor,
    });
  },

  async getById(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || null;
    const result = await nodeRepository.findNodeById(id || "");
    return NextResponse.json({ message: "Node fetched successfully", result });
  },
};

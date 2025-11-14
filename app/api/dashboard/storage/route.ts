import { NextResponse } from "next/server";
import { nodeRepository } from "@/features/api/nodes/node.repository";

export async function GET(req: Request) {
  const userId = req.headers.get("x-user-id");

  const files = await nodeRepository.findAllFiles(userId!);

  let totalUsed = 0;

  type CategoryKey = "document" | "image" | "video" | "audio" | "other";

  const categories: Record<CategoryKey, { size: number; count: number }> = {
    document: { size: 0, count: 0 },
    image: { size: 0, count: 0 },
    video: { size: 0, count: 0 },
    audio: { size: 0, count: 0 },
    other: { size: 0, count: 0 },
  };

  for (const file of files) {
    const raw = file.category?.toLowerCase() || "other";

    const category = (
      ["document", "image", "video", "audio", "other"].includes(raw)
        ? raw
        : "other"
    ) as CategoryKey;

    categories[category].size += file.size!;
    categories[category].count += 1;

    totalUsed += file.size!;
  }
  return NextResponse.json({
    message: "Storage summary fetched",
    result: {
      totalUsed,
      maxStorage: 2 * 1024 * 1024 * 1024,
      categories,
    },
  });
}

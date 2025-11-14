import { nodeRepository } from "@/features/api/nodes/node.repository";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await nodeRepository.findNodeById(id);
  return NextResponse.json({ message: "Node fetched successfully", result });
}

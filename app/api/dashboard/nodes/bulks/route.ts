import { nodeRepository } from "@/features/api/nodes/node.repository";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ result: [] });
  }

  const ids = idsParam.split(",").filter(Boolean);

  const nodes = await nodeRepository.findManyByIds(ids);

  return NextResponse.json({ result: nodes });
}

import { prisma } from "@/lib/prisma";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const userId = formData.get("userId") as string;

    if (!userId) {
      return NextResponse.json({ message: "User not found" }, { status: 400 });
    }

    if (!files) {
      return NextResponse.json(
        { message: "No files uploaded" },
        { status: 400 }
      );
    }

    const isValidUser = await prisma.user.findUnique({ where: { id: userId } });

    if (!isValidUser) {
      return NextResponse.json({ message: "User not valid" }, { status: 400 });
    }

    await Promise.all(
      files.map(async (file) => {
        if (!(file instanceof File)) {
          console.error("Skipping non-file entry.");
          return null;
        }

        const fileName = `${crypto.randomUUID()}-${file.name}`;
        const resultUpload = await supabase.storage
          .from("files")
          .upload(fileName, file);

        if (resultUpload.error) {
          throw new Error(
            `Supabase upload failed: ${resultUpload.error.message}`
          );
        }

        const publicUrl = supabase.storage.from("files").getPublicUrl(fileName)
          .data.publicUrl;

        const node = await prisma.node.create({
          data: {
            url: publicUrl,
            name: file.name,
            size: file.size,
            type: file.name,
            userId: userId,
          },
        });

        return node;
      })
    );

    return NextResponse.json({
      success: true,
      message: "File uploaded successfully!",
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to upload file." },
      { status: 500 }
    );
  }
};

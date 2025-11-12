import {
  removeFileFromSupabase,
  uploadFileToSupabase,
} from "@/features/files/utils/upload";
import { prisma } from "@/lib/prisma";
import { NotFoundError, UnauthorizedError } from "@/utils/error";
import { withErrorHandling } from "@/utils/safe-handler";
import { NextResponse } from "next/server";
import path from "path";

const uploadFile = async (req: Request) => {
  const formData = await req.formData();
  const filesRaw = formData.getAll("files") as File[];
  const userId = req.headers.get("x-user-id");

  if (!filesRaw) {
    throw new NotFoundError("No files uploaded");
  }

  const files: File[] = Array.isArray(filesRaw) ? filesRaw : [filesRaw];

  if (!userId) {
    throw new UnauthorizedError("User ID not found");
  }

  await Promise.all(
    files.map(async (file) => {
      if (!(file instanceof File)) return null;

      const publicUrl = await uploadFileToSupabase(file);
      const ext = path.extname(file.name);

      await prisma.node.create({
        data: {
          url: publicUrl,
          name: file.name,
          size: file.size,
          type: ext,
          userId,
          mimeType: file.type,
        },
      });
    })
  );

  return NextResponse.json({
    message: "File uploaded successfully!",
  });
};

const removeFile = async (req: Request) => {
  const body = await req.json();
  const { files } = body as { files: string[] };

  if (!files) {
    throw new NotFoundError("No files uploaded");
  }

  const Arrayfiles: string[] = Array.isArray(files) ? files : [files];

  await Promise.all(
    Arrayfiles.map((fileUrl: string) => {
      removeFileFromSupabase(fileUrl);
    })
  );

  return NextResponse.json({
    message: "File removed successfully!",
  });
};

export const POST = withErrorHandling(uploadFile);
export const DELETE = withErrorHandling(removeFile);

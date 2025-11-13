"use server";

import { supabase } from "@/lib/supabase";

export const uploadFileToSupabase = async (file: File) => {
  const fileName = `${crypto.randomUUID()}-${file.name}`;
  const result = await supabase.storage.from("files").upload(fileName, file);

  if (result.error) {
    return { success: false, result: result.error.message };
  }

  const publicUrl = supabase.storage.from("files").getPublicUrl(fileName)
    .data.publicUrl;

  return { success: true, result: publicUrl };
};

export const removeFileFromSupabase = async (fileUrl: string) => {
  const encodedName = fileUrl.split("/").pop() as string;
  const fileName = decodeURIComponent(encodedName);
  const result = await supabase.storage.from("files").remove([fileName]);

  if (result.error) {
    return { success: false, result: result.error.message };
  }

  return { success: true };
};

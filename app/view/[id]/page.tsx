import FileViewer from "@/features/dashboard/components/FileViewer";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = (await params).id;
  return <FileViewer id={id} />;
}

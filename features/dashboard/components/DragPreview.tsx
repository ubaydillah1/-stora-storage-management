import { Image as ImageLucide } from "lucide-react";

type Props = {
  draggingIds: string[];
  draggingPos: { x: number; y: number } | null;
};

export default function DragPreview({ draggingIds, draggingPos }: Props) {
  if (!draggingIds.length || !draggingPos) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999] flex items-center gap-2 bg-white rounded-lg shadow-2xl px-4 py-2 border border-gray-300"
      style={{
        top: draggingPos.y + 10,
        left: draggingPos.x + 10,
        transform: "scale(1.05)",
      }}
    >
      <ImageLucide className="text-blue-500" />
      <span className="text-sm font-medium">
        {draggingIds.length} item{draggingIds.length > 1 ? "s" : ""}
      </span>
    </div>
  );
}

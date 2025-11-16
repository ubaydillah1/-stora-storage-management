type Props = {
  dragStart: { x: number; y: number } | null;
  dragEnd: { x: number; y: number } | null;
};

export default function MarqueeSelection({ dragStart, dragEnd }: Props) {
  if (!dragStart || !dragEnd) return null;

  return (
    <div
      className="absolute border-2 border-blue-400 bg-blue-300/20 pointer-events-none z-50"
      style={{
        left: Math.min(dragStart.x, dragEnd.x),
        top: Math.min(dragStart.y, dragEnd.y),
        width: Math.abs(dragStart.x - dragEnd.x),
        height: Math.abs(dragStart.y - dragEnd.y),
      }}
    />
  );
}

export default function LoadingOverlay() {
  return (
    <div
      className="
        fixed inset-0 
        bg-black/40 
        backdrop-blur-sm 
        z-[9999] 
        flex items-center justify-center 
        pointer-events-auto
      "
    >
      <div className="flex flex-col items-center gap-4 select-none">
        <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>

        <p className="text-white text-sm font-medium tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}

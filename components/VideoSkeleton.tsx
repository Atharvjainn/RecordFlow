export function VideoSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white shadow-sm animate-pulse">
      {/* thumbnail */}
      <div className="aspect-video bg-black/10" />

      {/* info */}
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 rounded bg-black/10" />
        <div className="h-3 w-1/2 rounded bg-black/10" />
      </div>
    </div>
  );
}

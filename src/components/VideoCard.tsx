import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";

interface VideoCardProps {
  video: Doc<"videos">;
  onClick: () => void;
  index: number;
}

export function VideoCard({ video, onClick, index }: VideoCardProps) {
  const deleteVideo = useMutation(api.videos.remove);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Delete this video?")) {
      await deleteVideo({ id: video._id });
    }
  };

  const statusConfig: Record<"generating_thumbnail" | "generating_video" | "completed" | "failed", { label: string; color: string; icon: string }> = {
    generating_thumbnail: {
      label: "Creating preview...",
      color: "from-sky to-mint",
      icon: "🎨",
    },
    generating_video: {
      label: "Generating video...",
      color: "from-violet to-sky",
      icon: "🎬",
    },
    completed: {
      label: "Ready to watch!",
      color: "from-mint to-sky",
      icon: "✅",
    },
    failed: {
      label: "Generation failed",
      color: "from-coral to-peach",
      icon: "❌",
    },
  };

  const status = statusConfig[video.status as keyof typeof statusConfig];
  const isGenerating = video.status === "generating_thumbnail" || video.status === "generating_video";

  return (
    <div
      onClick={onClick}
      className="group relative bg-white/60 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all cursor-pointer animate-fade-in-up hover:scale-[1.02]"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Thumbnail / Preview */}
      <div className={`relative ${video.aspectRatio === "9:16" ? "aspect-[9/16] max-h-80" : "aspect-video"}`}>
        {video.thumbnailBase64 ? (
          <img
            src={`data:image/png;base64,${video.thumbnailBase64}`}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${status.color} flex items-center justify-center`}>
            <span className="text-5xl md:text-6xl opacity-80">{status.icon}</span>
          </div>
        )}

        {/* Status Overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm flex flex-col items-center justify-center">
            <div className="relative w-14 h-14 md:w-16 md:h-16 mb-3">
              <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl">{status.icon}</span>
              </div>
            </div>
            <p className="font-nunito text-white text-sm font-medium">{status.label}</p>
          </div>
        )}

        {/* Play button for completed */}
        {video.status === "completed" && (
          <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all flex items-center justify-center">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all shadow-xl">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-coral ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Delete button */}
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-coral hover:text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="p-3 md:p-4">
        <h3 className="font-baloo text-base md:text-lg text-charcoal truncate">{video.title}</h3>
        <p className="font-nunito text-xs md:text-sm text-charcoal/50 truncate">{video.prompt}</p>

        {video.status === "failed" && video.errorMessage && (
          <p className="mt-2 text-xs text-coral font-nunito truncate">
            {video.errorMessage}
          </p>
        )}

        <div className="mt-2 flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r ${status.color} bg-opacity-20 rounded-full text-xs font-nunito text-charcoal/70`}>
            <span className="text-sm">{status.icon}</span>
            {video.status === "completed" ? "Ready" : video.status === "failed" ? "Failed" : "Generating"}
          </span>
          <span className="text-xs text-charcoal/40 font-nunito">
            {new Date(video.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
}

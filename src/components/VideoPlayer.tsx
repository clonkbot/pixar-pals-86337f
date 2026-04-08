import { Doc } from "../../convex/_generated/dataModel";

interface VideoPlayerProps {
  video: Doc<"videos">;
  onClose: () => void;
}

export function VideoPlayer({ video, onClose }: VideoPlayerProps) {
  const isGenerating = video.status === "generating_thumbnail" || video.status === "generating_video";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md animate-fade-in">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all hover:rotate-90 z-10"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="w-full max-w-4xl animate-scale-in">
        {/* Video Container */}
        <div className={`relative rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl ${
          video.aspectRatio === "9:16" ? "max-w-sm mx-auto" : ""
        }`}>
          {video.status === "completed" && video.videoBase64 ? (
            <video
              src={`data:video/mp4;base64,${video.videoBase64}`}
              controls
              autoPlay
              className="w-full"
              style={{ maxHeight: "80vh" }}
            />
          ) : isGenerating ? (
            <div className={`bg-gradient-to-br from-violet/30 to-sky/30 ${
              video.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
            } flex flex-col items-center justify-center`}>
              {video.thumbnailBase64 && (
                <img
                  src={`data:image/png;base64,${video.thumbnailBase64}`}
                  alt={video.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
              )}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative w-20 h-20 md:w-24 md:h-24 mb-4">
                  <div className="absolute inset-0 border-4 border-white/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-transparent border-t-white rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl md:text-4xl">🎬</span>
                  </div>
                </div>
                <h3 className="font-baloo text-xl md:text-2xl text-white mb-2">Creating Magic...</h3>
                <p className="font-nunito text-white/70 text-center max-w-xs text-sm md:text-base">
                  {video.status === "generating_thumbnail"
                    ? "Generating preview image..."
                    : "Generating your Pixar-style video. This can take 1-2 minutes!"}
                </p>

                {/* Progress animation */}
                <div className="mt-6 w-48 md:w-64 h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-coral to-peach animate-progress" />
                </div>
              </div>
            </div>
          ) : video.status === "failed" ? (
            <div className={`bg-gradient-to-br from-coral/30 to-peach/30 ${
              video.aspectRatio === "9:16" ? "aspect-[9/16]" : "aspect-video"
            } flex flex-col items-center justify-center p-6`}>
              <span className="text-5xl md:text-6xl mb-4">😢</span>
              <h3 className="font-baloo text-xl md:text-2xl text-white mb-2">Generation Failed</h3>
              <p className="font-nunito text-white/70 text-center max-w-xs text-sm md:text-base">
                {video.errorMessage || "Something went wrong. Please try again."}
              </p>
            </div>
          ) : null}
        </div>

        {/* Video Info */}
        <div className="mt-4 md:mt-6 text-center">
          <h2 className="font-baloo text-xl md:text-2xl text-white mb-2">{video.title}</h2>
          <p className="font-nunito text-white/60 text-sm md:text-base max-w-lg mx-auto">{video.prompt}</p>
        </div>
      </div>
    </div>
  );
}

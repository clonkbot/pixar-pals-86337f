import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { CreateVideoModal } from "./CreateVideoModal";
import { VideoCard } from "./VideoCard";
import { VideoPlayer } from "./VideoPlayer";
import { Id, Doc } from "../../convex/_generated/dataModel";

export function Dashboard() {
  const { signOut } = useAuthActions();
  const videos = useQuery(api.videos.list) as Doc<"videos">[] | undefined;
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedVideoId, setSelectedVideoId] = useState<Id<"videos"> | null>(null);

  const selectedVideo = videos?.find((v: Doc<"videos">) => v._id === selectedVideoId);

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-cream/80 backdrop-blur-xl border-b border-charcoal/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-coral to-peach rounded-xl rotate-6 flex items-center justify-center shadow-lg animate-wiggle-slow">
              <span className="text-xl md:text-2xl -rotate-6">🎬</span>
            </div>
            <h1 className="font-baloo text-xl md:text-2xl text-charcoal">
              Pixar<span className="text-coral">Pals</span>
            </h1>
          </div>

          <button
            onClick={() => signOut()}
            className="px-4 py-2 md:px-5 md:py-2.5 bg-white/60 hover:bg-white/80 border border-charcoal/10 rounded-xl font-nunito text-sm text-charcoal/70 hover:text-charcoal transition-all hover:shadow-lg"
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
        {/* Hero Create Section */}
        <div className="mb-8 md:mb-12 animate-fade-in-up">
          <div className="bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-xl rounded-3xl p-6 md:p-10 border border-white/50 shadow-xl relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-48 h-48 md:w-64 md:h-64 bg-gradient-to-br from-coral/20 to-peach/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-gradient-to-tr from-sky/20 to-mint/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4" />

            <div className="relative">
              <h2 className="font-baloo text-2xl md:text-4xl text-charcoal mb-2 md:mb-3">
                Create Your Magical Video ✨
              </h2>
              <p className="font-nunito text-charcoal/60 mb-6 max-w-xl text-sm md:text-base">
                Describe a scene and watch AI bring it to life in beautiful Pixar-style animation. Perfect for bedtime stories, educational content, or pure imagination!
              </p>

              <button
                onClick={() => setIsCreateOpen(true)}
                className="group inline-flex items-center gap-3 px-6 py-4 md:px-8 md:py-5 bg-gradient-to-r from-coral to-peach text-white font-baloo text-lg md:text-xl rounded-2xl shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform">
                  <span className="text-xl md:text-2xl">🎥</span>
                </span>
                Start Creating
              </button>
            </div>
          </div>
        </div>

        {/* Videos Grid */}
        <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
          <h3 className="font-baloo text-xl md:text-2xl text-charcoal mb-4 md:mb-6 flex items-center gap-2">
            <span>Your Videos</span>
            {videos && videos.length > 0 && (
              <span className="px-2 py-0.5 bg-coral/10 text-coral text-sm rounded-lg">
                {videos.length}
              </span>
            )}
          </h3>

          {videos === undefined ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-video bg-white/40 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 md:py-20">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-charcoal/5 rounded-3xl flex items-center justify-center">
                <span className="text-4xl md:text-5xl opacity-50">🎬</span>
              </div>
              <p className="font-nunito text-charcoal/40 text-lg">
                No videos yet. Create your first magical video!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {videos.map((video: Doc<"videos">, index: number) => (
                <VideoCard
                  key={video._id}
                  video={video}
                  onClick={() => setSelectedVideoId(video._id)}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modals */}
      {isCreateOpen && (
        <CreateVideoModal onClose={() => setIsCreateOpen(false)} />
      )}

      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideoId(null)}
        />
      )}
    </div>
  );
}

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";

interface CreateVideoModalProps {
  onClose: () => void;
}

const PROMPT_SUGGESTIONS = [
  "A brave little robot exploring a colorful garden",
  "Two best friend puppies having a tea party",
  "A magical unicorn flying over rainbow waterfalls",
  "A tiny mouse chef cooking in a cozy kitchen",
  "Friendly dinosaurs playing in a sunny meadow",
  "A curious kitten discovering a world of butterflies",
];

export function CreateVideoModal({ onClose }: CreateVideoModalProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createVideo = useMutation(api.videos.create);
  const generateVideo = useAction(api.videos.generateVideo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const videoId = await createVideo({
        title: title.trim(),
        prompt: prompt.trim(),
        aspectRatio,
      });

      // Start generation in background
      generateVideo({ videoId }).catch(console.error);

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create video");
    } finally {
      setIsLoading(false);
    }
  };

  const useSuggestion = (suggestion: string) => {
    setPrompt(suggestion);
    if (!title) {
      setTitle(suggestion.slice(0, 40) + (suggestion.length > 40 ? "..." : ""));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-cream rounded-3xl shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header decoration */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-br from-coral/20 via-peach/10 to-transparent rounded-t-3xl" />

        <div className="relative p-5 md:p-8">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 bg-white/60 hover:bg-white rounded-xl flex items-center justify-center text-charcoal/60 hover:text-charcoal transition-all hover:rotate-90"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div className="mb-6">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-coral to-peach rounded-2xl rotate-6 flex items-center justify-center shadow-lg mb-4">
              <span className="text-2xl md:text-3xl -rotate-6">✨</span>
            </div>
            <h2 className="font-baloo text-2xl md:text-3xl text-charcoal">Create Magic</h2>
            <p className="font-nunito text-charcoal/60 text-sm md:text-base">Describe your Pixar-style video scene</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-coral/10 border border-coral/30 rounded-xl text-coral text-sm font-nunito animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
            <div>
              <label className="block font-nunito font-semibold text-charcoal mb-2 text-sm">
                Video Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My Amazing Adventure"
                className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/60 border-2 border-transparent rounded-xl md:rounded-2xl font-nunito text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-coral/50 focus:bg-white transition-all"
                required
              />
            </div>

            <div>
              <label className="block font-nunito font-semibold text-charcoal mb-2 text-sm">
                Scene Description
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe the scene you want to create..."
                rows={4}
                className="w-full px-4 py-3 md:px-5 md:py-4 bg-white/60 border-2 border-transparent rounded-xl md:rounded-2xl font-nunito text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-coral/50 focus:bg-white transition-all resize-none"
                required
              />
            </div>

            {/* Suggestions */}
            <div>
              <label className="block font-nunito font-semibold text-charcoal mb-2 text-sm">
                Need ideas? Try these:
              </label>
              <div className="flex flex-wrap gap-2">
                {PROMPT_SUGGESTIONS.slice(0, 4).map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => useSuggestion(suggestion)}
                    className="px-3 py-1.5 bg-white/60 hover:bg-sky/20 border border-charcoal/10 rounded-lg font-nunito text-xs text-charcoal/70 hover:text-charcoal transition-all hover:scale-105"
                  >
                    {suggestion.slice(0, 25)}...
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div>
              <label className="block font-nunito font-semibold text-charcoal mb-2 text-sm">
                Aspect Ratio
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setAspectRatio("16:9")}
                  className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-nunito font-semibold transition-all ${
                    aspectRatio === "16:9"
                      ? "bg-gradient-to-r from-coral to-peach text-white shadow-lg shadow-coral/30"
                      : "bg-white/60 text-charcoal/60 hover:bg-white/80"
                  }`}
                >
                  <span className="text-lg">📺</span>
                  <span className="ml-2">16:9</span>
                  <span className="block text-xs opacity-70">Landscape</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl font-nunito font-semibold transition-all ${
                    aspectRatio === "9:16"
                      ? "bg-gradient-to-r from-coral to-peach text-white shadow-lg shadow-coral/30"
                      : "bg-white/60 text-charcoal/60 hover:bg-white/80"
                  }`}
                >
                  <span className="text-lg">📱</span>
                  <span className="ml-2">9:16</span>
                  <span className="block text-xs opacity-70">Portrait</span>
                </button>
              </div>
            </div>

            <div className="pt-2 md:pt-4">
              <button
                type="submit"
                disabled={isLoading || !title.trim() || !prompt.trim()}
                className="w-full py-4 md:py-5 bg-gradient-to-r from-coral to-peach text-white font-baloo text-lg md:text-xl rounded-xl md:rounded-2xl shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Generate Video ✨"
                )}
              </button>
            </div>
          </form>

          <p className="mt-4 text-center font-nunito text-xs text-charcoal/40">
            Video generation takes 1-2 minutes. You can close this and come back!
          </p>
        </div>
      </div>
    </div>
  );
}

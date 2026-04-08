export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Bouncing dots */}
        <div className="flex gap-3">
          <div className="w-5 h-5 rounded-full bg-coral animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-5 h-5 rounded-full bg-sky animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-5 h-5 rounded-full bg-mint animate-bounce" style={{ animationDelay: "300ms" }} />
          <div className="w-5 h-5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "450ms" }} />
        </div>
        <p className="font-baloo text-xl text-charcoal/70">Loading magic...</p>
      </div>
    </div>
  );
}

import { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

export function AuthScreen() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    try {
      await signIn("password", formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnonymous = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signIn("anonymous");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 pb-20">
      {/* Hero Section */}
      <div className="text-center mb-8 md:mb-12 animate-fade-in-up">
        {/* Mascot */}
        <div className="relative inline-block mb-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-coral to-peach rounded-3xl rotate-12 shadow-xl flex items-center justify-center animate-wiggle">
            <span className="text-5xl md:text-6xl -rotate-12">🎬</span>
          </div>
          <div className="absolute -bottom-2 -right-2 w-10 h-10 md:w-12 md:h-12 bg-sky rounded-xl rotate-6 shadow-lg flex items-center justify-center animate-bounce-slow">
            <span className="text-2xl md:text-3xl">✨</span>
          </div>
        </div>

        <h1 className="font-baloo text-4xl md:text-6xl text-charcoal mb-3 tracking-tight">
          Pixar<span className="text-coral">Pals</span>
        </h1>
        <p className="font-nunito text-lg md:text-xl text-charcoal/60 max-w-md mx-auto">
          Create magical Pixar-style animated videos for kids with AI
        </p>
      </div>

      {/* Auth Card */}
      <div className="w-full max-w-md animate-fade-in-up" style={{ animationDelay: "200ms" }}>
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl shadow-coral/10 border border-white/50">
          <h2 className="font-baloo text-2xl text-charcoal text-center mb-6">
            {flow === "signIn" ? "Welcome Back!" : "Join the Fun!"}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-coral/10 border border-coral/30 rounded-xl text-coral text-sm font-nunito text-center animate-shake">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                name="email"
                type="email"
                placeholder="Email address"
                required
                className="w-full px-5 py-4 bg-cream/50 border-2 border-transparent rounded-2xl font-nunito text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-coral/50 focus:bg-white transition-all"
              />
            </div>
            <div>
              <input
                name="password"
                type="password"
                placeholder="Password"
                required
                className="w-full px-5 py-4 bg-cream/50 border-2 border-transparent rounded-2xl font-nunito text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-coral/50 focus:bg-white transition-all"
              />
            </div>
            <input name="flow" type="hidden" value={flow} />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-coral to-peach text-white font-baloo text-xl rounded-2xl shadow-lg shadow-coral/30 hover:shadow-xl hover:shadow-coral/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Loading...
                </span>
              ) : (
                flow === "signIn" ? "Sign In" : "Create Account"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <button
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              className="font-nunito text-charcoal/60 hover:text-coral transition-colors"
            >
              {flow === "signIn" ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-charcoal/10" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white/80 text-charcoal/40 font-nunito">or</span>
            </div>
          </div>

          <button
            onClick={handleAnonymous}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-sky to-mint text-white font-baloo text-xl rounded-2xl shadow-lg shadow-sky/30 hover:shadow-xl hover:shadow-sky/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Try as Guest ✨
          </button>
        </div>
      </div>

      {/* Floating decorations */}
      <div className="hidden md:block absolute top-20 left-20 animate-float-slow">
        <div className="w-16 h-16 bg-mint/40 rounded-2xl rotate-12 flex items-center justify-center shadow-lg">
          <span className="text-3xl">🌟</span>
        </div>
      </div>
      <div className="hidden md:block absolute bottom-32 right-20 animate-float">
        <div className="w-14 h-14 bg-violet/40 rounded-xl -rotate-12 flex items-center justify-center shadow-lg">
          <span className="text-2xl">🎨</span>
        </div>
      </div>
      <div className="hidden md:block absolute top-1/3 right-32 animate-float-delayed">
        <div className="w-12 h-12 bg-coral/40 rounded-lg rotate-6 flex items-center justify-center shadow-lg">
          <span className="text-xl">🎥</span>
        </div>
      </div>
    </div>
  );
}

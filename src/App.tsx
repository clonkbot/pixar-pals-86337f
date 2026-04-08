import { useConvexAuth } from "convex/react";
import { AuthScreen } from "./components/AuthScreen";
import { Dashboard } from "./components/Dashboard";
import { LoadingScreen } from "./components/LoadingScreen";

export default function App() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-cream relative overflow-hidden">
      {/* Floating gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-gradient-to-br from-coral/30 to-peach/20 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/4 -right-48 w-[500px] h-[500px] bg-gradient-to-bl from-sky/25 to-mint/15 rounded-full blur-3xl animate-float-delayed" />
        <div className="absolute -bottom-32 left-1/3 w-[400px] h-[400px] bg-gradient-to-tr from-violet/20 to-coral/10 rounded-full blur-3xl animate-float-slow" />
      </div>

      {/* Main content */}
      <div className="relative z-10">
        {isAuthenticated ? <Dashboard /> : <AuthScreen />}
      </div>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-20 py-3 text-center">
        <p className="text-xs text-charcoal/40 font-nunito">
          Requested by <span className="font-medium">@web-user</span> · Built by <span className="font-medium">@clonkbot</span>
        </p>
      </footer>
    </div>
  );
}

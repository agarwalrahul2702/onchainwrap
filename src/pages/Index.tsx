import { useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import Logo from "@/components/Logo";
import AddressInput from "@/components/AddressInput";
import LoaderScreen from "@/components/LoaderScreen";
import WrapCard, { WrapStats } from "@/components/WrapCard";
import { fetchWrapStats } from "@/services/api";
import { toast } from "@/hooks/use-toast";

type AppState = "input" | "loading" | "result";

const Index = () => {
  const [appState, setAppState] = useState<AppState>("input");
  const [stats, setStats] = useState<WrapStats | null>(null);

  const handleGenerate = async (address: string) => {
    setAppState("loading");

    try {
      const result = await fetchWrapStats(address);
      setStats(result);
      setAppState("result");
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Failed to generate your wrap. Please try again.",
        variant: "destructive",
      });
      setAppState("input");
    }
  };

  const handleReset = () => {
    setStats(null);
    setAppState("input");
  };

  return (
    <main className="relative min-h-screen flex flex-col">
      <BackgroundVideo />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container flex justify-center">
          <Logo />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 pb-8">
        <div className="glass-card p-8 w-full max-w-lg">
          {appState === "input" && (
            <div className="space-y-6">
              <div className="text-center space-y-2 animate-fade-in">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground">
                  Your <span className="gradient-text">Onchain</span> Year
                </h1>
                <p className="text-muted-foreground">
                  Discover your 2024 trading stats in one beautiful wrap
                </p>
              </div>
              <AddressInput onGenerate={handleGenerate} isLoading={false} />
            </div>
          )}

          {appState === "loading" && <LoaderScreen />}

          {appState === "result" && stats && (
            <WrapCard stats={stats} onReset={handleReset} />
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center">
        <p className="text-muted-foreground text-xs">
          Powered by{" "}
          <a
            href="https://0xppl.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            0xPPL
          </a>
        </p>
      </footer>
    </main>
  );
};

export default Index;

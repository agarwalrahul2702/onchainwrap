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
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {appState === "input" && (
          <>
            {/* Title - outside card */}
            <h1 className="font-display text-4xl md:text-5xl font-bold text-center mb-8 animate-fade-in">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                2025 Onchain Wrap
              </span>
            </h1>

            {/* Card */}
            <div className="glass-card p-8 w-full max-w-md">
              <div className="space-y-6">
                <h2 className="text-foreground text-xl md:text-2xl font-semibold text-center">
                  See everything your wallet cooked<br />(or not)
                </h2>
                <AddressInput onGenerate={handleGenerate} isLoading={false} />
              </div>
            </div>
          </>
        )}

        {appState === "loading" && (
          <div className="glass-card p-8 w-full max-w-md">
            <LoaderScreen />
          </div>
        )}

        {appState === "result" && stats && (
          <WrapCard stats={stats} onReset={handleReset} />
        )}
      </div>
    </main>
  );
};

export default Index;

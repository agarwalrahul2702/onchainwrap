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
        variant: "destructive"
      });
      setAppState("input");
    }
  };
  const handleReset = () => {
    setStats(null);
    setAppState("input");
  };
  return <main className="relative w-[1440px] h-[932px] mx-auto flex flex-col overflow-hidden">
      <BackgroundVideo />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container flex justify-center">
          <Logo />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pb-8">
        {appState === "input" && <>
            {/* Title - 489×72 dimensions */}
            <h1 className="font-sans font-bold text-center mb-6 animate-fade-in" style={{
          width: '489px',
          height: '72px',
          fontSize: '48px',
          lineHeight: '72px'
        }}>
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                2025 Onchain Wrap
              </span>
            </h1>

            {/* Card - exact 517×341.66 ratio */}
            <div className="liquid-glass-card w-[517px] h-[342px] flex flex-col justify-center px-10 py-8">
              <div className="space-y-5 text-center">
                <div className="space-y-0">
                  <p className="text-foreground font-sans whitespace-nowrap text-2xl font-medium">
                    See everything your wallet cooked
                  </p>
                  <p className="text-foreground font-sans text-2xl font-medium">(or not)</p>
                </div>
                <AddressInput onGenerate={handleGenerate} isLoading={false} />
              </div>
            </div>
          </>}

        {appState === "loading" && <div className="glass-card p-8 w-full max-w-md">
            <LoaderScreen />
          </div>}

        {appState === "result" && stats && <WrapCard stats={stats} onReset={handleReset} />}
      </div>
    </main>;
};
export default Index;
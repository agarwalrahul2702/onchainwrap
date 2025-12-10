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
  return <main className="relative w-[1440px] h-[932px] mx-auto flex-col overflow-hidden flex items-center justify-center">
      <BackgroundVideo />

      {/* Header */}
      <header className="relative z-10 pt-8 pb-4">
        <div className="container px-0 flex items-center justify-center py-0 mt-[30px]">
          <Logo />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex-1 pb-8 flex-col px-0 flex items-center justify-start my-[60px]">
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

            {/* Card - 35% width × 36% height of viewport */}
            <div className="liquid-glass-card w-[35vw] h-[36vh] my-0 mx-0 py-[2vh] flex-col px-0 flex items-center justify-center">
              <div className="space-y-[2vh] text-center">
                <div className="space-y-0">
                  <p className="text-foreground font-sans whitespace-nowrap text-[1.6vw] font-medium pt-0 pr-[2.5vw] pl-[2.5vw] px-[2vw] py-[0.2vh] text-center">
                    See everything your wallet cooked
                  </p>
                  <p className="text-foreground font-sans text-[1.6vw] font-medium">(or didn't)</p>
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
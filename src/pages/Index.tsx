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
  const handleGenerate = async (addresses: string[]) => {
    setAppState("loading");
    try {
      const result = await fetchWrapStats(addresses);
      setStats(result);
      setAppState("result");
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Invalid address or no data found",
        variant: "destructive"
      });
      setAppState("input");
    }
  };
  const handleReset = () => {
    setStats(null);
    setAppState("input");
  };
  return <main className="relative w-full min-h-screen mx-auto flex-col overflow-hidden flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <BackgroundVideo />

      {/* Header - hidden when card is generated */}
      {appState !== "result" && (
        <header className="relative z-10 pt-6 sm:pt-8 pb-4">
          <div className="container px-0 flex items-center justify-center py-0 mt-4 sm:mt-[30px]">
            <Logo />
          </div>
        </header>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 pb-8 flex-col px-0 flex items-center justify-start my-6 sm:my-[60px]">
        {appState === "input" && <>
            {/* Title - responsive */}
            <h1 className="font-sans font-bold text-center mb-4 sm:mb-6 animate-fade-in text-3xl sm:text-4xl md:text-5xl leading-tight">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                2025 Onchain Wrap
              </span>
            </h1>

            {/* Card - responsive width and height */}
            <div className="liquid-glass-card w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[35vw] min-h-[320px] sm:min-h-[280px] my-0 mx-0 py-4 sm:py-[2vh] flex-col px-4 sm:px-0 flex items-center justify-center">
              <div className="space-y-4 sm:space-y-[2vh] text-center py-0 my-0 w-full">
                <div className="space-y-0">
                  <p className="text-foreground font-sans text-sm sm:text-base md:text-lg font-medium pt-0 px-2 sm:px-[2.5vw] py-[0.2vh] text-center mt-3 sm:mt-[20px]">
                    See everything your wallet cooked
                  </p>
                  <p className="text-foreground font-sans text-sm sm:text-base md:text-lg font-medium">(or didn't)</p>
                </div>
                <AddressInput onGenerate={handleGenerate} isLoading={false} />
              </div>
            </div>
          </>}

        {appState === "loading" && <div className="glass-card p-6 sm:p-8 w-full max-w-md">
            <LoaderScreen />
          </div>}

        {appState === "result" && stats && <div className="w-full max-w-[90vw] sm:max-w-[780px]">
            <WrapCard stats={stats} onReset={handleReset} />
          </div>}
      </div>
    </main>;
};
export default Index;
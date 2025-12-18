import { useState } from "react";
import BackgroundVideo from "@/components/BackgroundVideo";
import Logo from "@/components/Logo";
import AddressInput from "@/components/AddressInput";
import LoaderScreen from "@/components/LoaderScreen";
import WrapCard, { WrapStats } from "@/components/WrapCard";
import { fetchWrapStats } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { trackEvent, EVENTS } from "@/lib/posthog";
type AppState = "input" | "loading" | "result";
const Index = () => {
  const [appState, setAppState] = useState<AppState>("input");
  const [stats, setStats] = useState<WrapStats | null>(null);
  const handleGenerate = async (addresses: string[], twitterHandle?: string) => {
    setAppState("loading");
    try {
      const result = await fetchWrapStats(addresses);
      if (twitterHandle) {
        result.twitterHandle = twitterHandle;
      }
      setStats(result);
      setAppState("result");

      // Track wrap generation
      trackEvent(EVENTS.WRAP_GENERATED, {
        archetype: result.archetype,
        addressCount: addresses.length,
        hasTwitterHandle: !!twitterHandle,
        pnlPositive: result.pnlPositive,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Invalid address or no data found",
        variant: "destructive",
      });
      setAppState("input");
    }
  };
  const handleReset = () => {
    trackEvent(EVENTS.TRY_ANOTHER_WALLET);
    setStats(null);
    setAppState("input");
  };
  return (
    <main className="relative w-full lg:w-[1440px] min-h-screen lg:h-[932px] mx-auto flex-col overflow-hidden flex items-center justify-center px-4 lg:px-0">
      <BackgroundVideo />

      {/* Header - hidden when card is generated */}
      {appState !== "result" && (
        <header className="relative z-10 pt-4 sm:pt-6 lg:pt-8 pb-2 sm:pb-4">
          <div className="container px-0 flex items-center justify-center py-0 mt-2 sm:mt-4 lg:mt-[30px]">
            <Logo />
          </div>
        </header>
      )}

      {/* Main content */}
      <div className="relative z-10 flex-1 pb-4 sm:pb-8 flex-col px-0 flex items-center justify-start my-4 sm:my-6 lg:my-[60px] lg:scale-[0.94] lg:origin-top">
        {appState === "input" && (
          <>
            {/* Title - responsive on mobile, fixed on desktop */}
            <h1 className="font-sans font-bold text-center mb-3 sm:mb-4 lg:mb-6 animate-fade-in text-base sm:text-lg lg:text-[33px] lg:leading-[49px] leading-tight lg:w-[400px] lg:h-[49px] px-2 whitespace-nowrap">
              <span className="bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] bg-clip-text text-transparent">
                Base Onchain Wrap 2025{" "}
              </span>
            </h1>

            {/* Card - responsive on mobile, fixed vw/vh on desktop */}
            <div className="liquid-glass-card w-[92vw] sm:w-[90vw] lg:w-[35vw] min-h-[280px] sm:min-h-[320px] lg:min-h-0 lg:h-[36vh] my-0 mx-0 lg:py-[2vh] flex-col lg:px-0 flex items-center justify-center px-3 sm:px-[20px] sm:py-0 py-0">
              <div className="space-y-3 sm:space-y-4 lg:space-y-[2vh] text-center py-0 my-0 w-full">
                <div className="space-y-0 -mt-[5px] sm:-mt-[10px]">
                  <p className="text-foreground font-sans text-sm sm:text-base lg:whitespace-nowrap font-medium pt-0 px-1 sm:px-2 lg:px-[2.5vw] py-[0.2vh] text-center mt-[-5px] sm:mt-[-10px] lg:mt-[5px] my-px mb-[3px] sm:mb-[5px] lg:text-2xl">
                    See everything your wallet cooked
                  </p>
                  <p className="text-foreground font-sans text-sm sm:text-base font-medium lg:text-2xl">(or didn't)</p>
                </div>
                <AddressInput onGenerate={handleGenerate} isLoading={false} />
              </div>
            </div>
          </>
        )}

        {appState === "loading" && (
          <div className="glass-card p-4 sm:p-6 lg:p-8 w-full max-w-[90vw] sm:max-w-md">
            <LoaderScreen />
          </div>
        )}

        {appState === "result" && stats && (
          <div className="w-full max-w-[95vw] sm:max-w-[90vw] lg:w-[780px] px-2 sm:px-0">
            <WrapCard stats={stats} onReset={handleReset} />
          </div>
        )}
      </div>
    </main>
  );
};
export default Index;

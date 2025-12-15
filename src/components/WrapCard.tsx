import { useEffect, useRef, useState } from "react";
import { captureElementAsBlob, downloadBlob, shareOnTwitter, uploadImageToBackend } from "@/utils/imageExport";

// Backend endpoint (use dev server until Cloudflare is configured for production)
const UPLOAD_ENDPOINT = "https://api.0xppl.com/api/ipfs/upload-image";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Import all card template images
import whaleTemplate from "@/assets/card-templates/whale.png";
import trencherTemplate from "@/assets/card-templates/trencher.png";
import swingTraderTemplate from "@/assets/card-templates/swing-trader.png";
import onlyWsTemplate from "@/assets/card-templates/only-ws.png";
import rugMaxiTemplate from "@/assets/card-templates/rug-maxi.png";
import fewTradeWonderTemplate from "@/assets/card-templates/few-trade-wonder.png";
import freshlySpawnedTemplate from "@/assets/card-templates/freshly-spawned.png";
import activeFarmerTemplate from "@/assets/card-templates/active-farmer.png";
import casualDegenTemplate from "@/assets/card-templates/casual-degen.png";
import averageCryptoBroTemplate from "@/assets/card-templates/average-crypto-bro.png";

// Default token fallback image
import defaultTokenImage from "@/assets/P1.png";

export interface TokenInfo {
  logo?: string;
  symbol?: string;
}

export interface WrapStats {
  totalVolume: string;
  biggestProfit: string;
  biggestProfitToken?: TokenInfo;
  biggestProfitPnlPercent?: string;
  biggestLoss: string;
  biggestLossToken?: TokenInfo;
  biggestLossPnlPercent?: string;
  winRate: string;
  overallPnL: string;
  pnlPositive: boolean;
  oneliner: string;
  archetype?: string;
  address: string;
  addressCount: number;
  twitterHandle?: string;
}

interface WrapCardProps {
  stats: WrapStats;
  onReset: () => void;
}

// Full card template images mapping
const templateImages: Record<string, string> = {
  Whale: whaleTemplate,
  Trencher: trencherTemplate,
  "Swing Trader": swingTraderTemplate,
  "Only W's": onlyWsTemplate,
  "Only W": onlyWsTemplate,
  "Rug Maxi": rugMaxiTemplate,
  "Few-Trade Wonder": fewTradeWonderTemplate,
  "Freshly Spawned": freshlySpawnedTemplate,
  "Active Farmer": activeFarmerTemplate,
  "Casual Degen": casualDegenTemplate,
  "Average Crypto Bro": averageCryptoBroTemplate,
};

const WrapCard = ({ stats, onReset }: WrapCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [cardWidth, setCardWidth] = useState(780);
  const { toast } = useToast();

  // Track card width for responsive font scaling
  useEffect(() => {
    const updateCardWidth = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth);
      }
    };
    updateCardWidth();
    window.addEventListener('resize', updateCardWidth);
    return () => window.removeEventListener('resize', updateCardWidth);
  }, []);

  // Calculate scale factor based on card width (780px is the base)
  const scaleFactor = cardWidth / 780;

  const formatAddress = (addr: string, count: number) => {
    const shortAddr = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
    if (count > 1) {
      return `${shortAddr} + ${count - 1} more`;
    }
    return shortAddr;
  };

  const archetype = stats.archetype || "Average Crypto Bro";
  const templateImage = templateImages[archetype] || averageCryptoBroTemplate;

  const handleDownload = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await captureElementAsBlob(cardRef.current);
      const shortAddress = stats.address.slice(0, 8);
      downloadBlob(blob, `onchain_wrap_${shortAddress}.png`);
      toast({
        title: "Image downloaded!",
        description: "Your wrap card has been saved.",
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleShareOnX = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      const blob = await captureElementAsBlob(cardRef.current);
      const imageUrl = await uploadImageToBackend(blob, UPLOAD_ENDPOINT);
      const shareText = "Got my 2025 onchain wrap from @0xPPL_. Check yours!";
      shareOnTwitter(shareText, imageUrl);
      toast({
        title: "Opening Twitter...",
        description: "Your wrap image is ready to share!",
      });
    } catch (error) {
      console.error("Failed to share:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-full flex-col animate-scale-in flex items-center justify-end mt-4 sm:mt-8 lg:mt-[60px]">
      {/* Main card container - fixed aspect ratio matching template (780x468 = 1.667:1) */}
      <div
        ref={cardRef}
        id="wrap-card"
        className="relative w-full max-w-[780px] overflow-hidden"
        style={{ aspectRatio: "780 / 468" }}
      >
        {/* Full template image as background */}
        <img
          src={templateImage}
          alt={`${archetype} card template`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* ===== DYNAMIC TEXT OVERLAYS ===== */}
        {/* All positions are based on the 780x468 template layout */}

        {/* Overall PnL value - positioned to the right of "Overall pnl" label */}
        <div
          className="absolute font-general-sans"
          style={{
            top: scaleFactor < 0.6 ? "13%" : "21.75%",
            right: "5.8%",
          }}
        >
          <span
            style={{
              color: stats.pnlPositive ? "#22c55e" : "#ef4444",
              fontSize: scaleFactor < 0.6 ? `${Math.max(5, 10 * scaleFactor)}px` : `${Math.max(10, 22 * scaleFactor)}px`,
              fontWeight: 600,
              lineHeight: 1,
            }}
          >
            {stats.pnlPositive ? "+" : ""}
            {stats.overallPnL}
          </span>
        </div>

        {/* Biggest profit value - below "Biggest profit" label */}
        <div
          className="absolute font-general-sans"
          style={{
            top: scaleFactor < 0.6 ? "54%" : "57.5%",
            left: "46.14%",
          }}
        >
          <div className="flex items-center" style={{ gap: `${Math.max(2, 6 * scaleFactor)}px` }}>
            <span
              style={{
                color: "#22c55e",
                fontSize: scaleFactor < 0.6 ? `${Math.max(5, 12 * scaleFactor)}px` : `${Math.max(9, 20 * scaleFactor)}px`,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {stats.biggestProfit !== "No data" && "+"}{stats.biggestProfit}
            </span>
            {stats.biggestProfitToken && (
              <div className="flex items-center" style={{ gap: `${Math.max(2, 4 * scaleFactor)}px` }}>
                <img
                  src={stats.biggestProfitToken.logo || defaultTokenImage}
                  alt={stats.biggestProfitToken.symbol || "token"}
                  style={{
                    width: `${Math.max(8, 16 * scaleFactor)}px`,
                    height: `${Math.max(8, 16 * scaleFactor)}px`,
                  }}
                  className="rounded-full object-cover"
                />
                {stats.biggestProfitToken.symbol && (
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontSize: `${Math.max(7, 13 * scaleFactor)}px`,
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {stats.biggestProfitToken.symbol}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Biggest loss value - below "Biggest loss" label */}
        <div
          className="absolute font-general-sans"
          style={{
            top: scaleFactor < 0.6 ? "54%" : "57.5%",
            left: "72%",
          }}
        >
          <div className="flex items-center" style={{ gap: `${Math.max(2, 6 * scaleFactor)}px` }}>
            <span
              style={{
                color: "#ef4444",
                fontSize: scaleFactor < 0.6 ? `${Math.max(5, 12 * scaleFactor)}px` : `${Math.max(9, 20 * scaleFactor)}px`,
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {stats.biggestLoss}
            </span>
            {stats.biggestLossToken && (
              <div className="flex items-center" style={{ gap: `${Math.max(2, 4 * scaleFactor)}px` }}>
                <img
                  src={stats.biggestLossToken.logo || defaultTokenImage}
                  alt={stats.biggestLossToken.symbol || "token"}
                  style={{
                    width: `${Math.max(8, 16 * scaleFactor)}px`,
                    height: `${Math.max(8, 16 * scaleFactor)}px`,
                  }}
                  className="rounded-full object-cover"
                />
                {stats.biggestLossToken.symbol && (
                  <span
                    style={{
                      color: "#9CA3AF",
                      fontSize: `${Math.max(7, 13 * scaleFactor)}px`,
                      fontWeight: 500,
                      lineHeight: 1,
                    }}
                  >
                    {stats.biggestLossToken.symbol}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Win rate value - below "Win rate" label */}
        <div
          className="absolute font-general-sans"
          style={{
            top: scaleFactor < 0.6 ? "65%" : "72.57%",
            left: "46.14%",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: scaleFactor < 0.6 ? `${Math.max(5, 12 * scaleFactor)}px` : `${Math.max(9, 20 * scaleFactor)}px`,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {stats.winRate}
          </span>
        </div>

        {/* Trading volume value - below "Trading volume" label */}
        <div
          className="absolute font-general-sans"
          style={{
            top: scaleFactor < 0.6 ? "65%" : "72.57%",
            left: "72%",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: scaleFactor < 0.6 ? `${Math.max(5, 12 * scaleFactor)}px` : `${Math.max(9, 20 * scaleFactor)}px`,
              fontWeight: 500,
              lineHeight: 1,
            }}
          >
            {stats.totalVolume}
          </span>
        </div>

        {/* Twitter handle and Wallet address - bottom right */}
        <div
          className="absolute font-general-sans flex items-center"
          style={{
            bottom: "4%",
            right: "5.41%",
            gap: `${Math.max(4, 8 * scaleFactor)}px`,
          }}
        >
          {stats.twitterHandle && (
            <span
              style={{
                position: "absolute",
                right: `${265 * scaleFactor}px`,
                color: "#60a5fa",
                fontSize: `${Math.max(8.4, 14.4 * scaleFactor)}px`,
                fontWeight: 500,
                lineHeight: 1,
                textAlign: "right",
                transform: "translateY(-2px)",
              }}
            >
              @{stats.twitterHandle.replace(/^@/, '')}
            </span>
          )}
          <span
            style={{
              color: "#60a5fa",
              fontSize: `${Math.max(8.4, 14.4 * scaleFactor)}px`,
              fontWeight: 500,
              lineHeight: 1,
              marginRight: `${3 * scaleFactor}px`,
            }}
          >
            {formatAddress(stats.address, stats.addressCount)}
          </span>
        </div>
      </div>

      {/* Action buttons - outside the card */}
      <div className="flex flex-col sm:flex-row lg:flex-row items-center gap-2 sm:gap-2 lg:gap-3 mt-3 sm:mt-4 lg:mt-6 w-full lg:w-auto px-2 sm:px-4 lg:px-0">
        <button
          onClick={onReset}
          className="w-full sm:w-auto lg:w-auto border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 transition-colors rounded-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 font-medium text-xs sm:text-sm lg:text-base"
        >
          Try another wallet
        </button>
        <button
          onClick={handleDownload}
          disabled={isExporting}
          className="w-full sm:w-auto lg:w-auto border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 font-medium flex items-center justify-center gap-1.5 sm:gap-2 text-xs sm:text-sm lg:text-base"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          Download
        </button>
        <button
          onClick={handleShareOnX}
          disabled={isExporting}
          className="w-full sm:w-auto lg:w-auto bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 flex items-center justify-center gap-1.5 sm:gap-2 font-medium text-white text-xs sm:text-sm lg:text-base"
        >
          Share on
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
          ) : (
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
        </button>
      </div>

      {/* CTA section */}
      <div
        className="text-center space-y-2 sm:space-y-3 lg:space-y-4 py-4 sm:py-6 lg:py-8 animate-fade-in px-3 sm:px-4 lg:px-0"
        style={{ animationDelay: "0.3s", marginTop: "10px" }}
      >
        <p className="text-[#8b98a9] text-[10px] sm:text-xs lg:text-sm">Track your entire multichain portfolio with live pnl</p>
        <a
          href="https://0xppl.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors text-primary-foreground text-xs sm:text-sm lg:text-base"
        >
          Try <img src="/logo-0xppl.svg" alt="0xPPL" className="h-[16px] sm:h-[18px] lg:h-[21px] w-auto object-cover" /> 0xPPL
        </a>
      </div>
    </div>
  );
};

export default WrapCard;

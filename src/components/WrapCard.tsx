import { useRef, useState } from "react";
import { captureElementAsBlob, downloadBlob, shareOnTwitter } from "@/utils/imageExport";
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
}
interface WrapCardProps {
  stats: WrapStats;
  onReset: () => void;
}

// Full card template images mapping - archetype name + oneliner are baked into templates
const templateImages: Record<string, string> = {
  "Whale": whaleTemplate,
  "Trencher": trencherTemplate,
  "Swing Trader": swingTraderTemplate,
  "Only W's": onlyWsTemplate,
  "Only W": onlyWsTemplate,
  "Rug Maxi": rugMaxiTemplate,
  "Few-Trade Wonder": fewTradeWonderTemplate,
  "Freshly Spawned": freshlySpawnedTemplate,
  "Active Farmer": activeFarmerTemplate,
  "Casual Degen": casualDegenTemplate,
  "Average Crypto Bro": averageCryptoBroTemplate
};
const WrapCard = ({
  stats,
  onReset
}: WrapCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const {
    toast
  } = useToast();
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
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
        description: "Your wrap card has been saved."
      });
    } catch (error) {
      console.error("Failed to download image:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  const handleShareOnX = async () => {
    if (!cardRef.current || isExporting) return;
    setIsExporting(true);
    try {
      await captureElementAsBlob(cardRef.current);
      const shareText = "Got my 2025 onchain wrap from @0xPPL_. Check yours!";
      const shareUrl = "https://0xppl.com";
      shareOnTwitter(shareText, shareUrl);
      toast({
        title: "Opening Twitter...",
        description: "Share your wrap with the world!"
      });
    } catch (error) {
      console.error("Failed to share:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };
  return <div className="w-full flex-col animate-scale-in flex items-center justify-end">
      {/* Main card container - fixed aspect ratio matching template */}
      <div ref={cardRef} id="wrap-card" className="relative w-full max-w-[1000px] overflow-hidden" style={{
      aspectRatio: '1000 / 600'
    }}>
        {/* Full template image as background */}
        <img src={templateImage} alt={`${archetype} card template`} className="absolute inset-0 w-full h-full object-contain" draggable={false} />
        
        {/* ===== DYNAMIC TEXT OVERLAYS - No backgrounds, transparent ===== */}
        
        {/* Archetype name and oneliner are baked into the template image - not rendered from API */}
        
        {/* Overall PnL value */}
        <div className="absolute font-general-sans" style={{
        top: 'calc(26% + 2px)',
        right: 'calc(7% - 5px)'
      }}>
          <span style={{
          color: stats.pnlPositive ? '#22c55e' : '#ef4444',
          fontSize: 'clamp(16px, 2.2vw, 22px)',
          fontWeight: 600,
          fontVariant: 'small-caps',
          lineHeight: '100%'
        }}>
            {stats.pnlPositive ? "+" : ""}{stats.overallPnL}
          </span>
        </div>

        {/* Biggest profit value with token */}
        <div className="absolute font-general-sans flex flex-col" style={{
        top: 'calc(55% + 5px)',
        left: 'calc(44% + 15px)'
      }}>
          <div className="flex items-center gap-1.5">
            <span style={{
            color: '#22c55e',
            fontSize: 'clamp(17.25px, 2.39vw, 23.97px)',
            fontWeight: 500,
            fontVariant: 'small-caps',
            lineHeight: '100%'
          }}>
              +{stats.biggestProfit}
            </span>
            {stats.biggestProfitToken && <div className="flex items-center gap-1">
                {stats.biggestProfitToken.logo && <img src={stats.biggestProfitToken.logo} alt={stats.biggestProfitToken.symbol || 'token'} style={{
              width: 'clamp(12.88px, 1.66vw, 16.56px)',
              height: 'clamp(12.88px, 1.66vw, 16.56px)'
            }} className="rounded-full object-cover" />}
                {stats.biggestProfitToken.symbol && <span style={{
              color: '#9CA3AF',
              fontSize: 'clamp(11.04px, 1.47vw, 14.72px)',
              fontWeight: 500,
              lineHeight: '100%'
            }}>
                    {stats.biggestProfitToken.symbol}
                  </span>}
              </div>}
          </div>
        </div>

        {/* Biggest loss value with token */}
        <div className="absolute font-general-sans flex flex-col" style={{
        top: 'calc(55% + 5px)',
        left: 'calc(71% + 10px)'
      }}>
          <div className="flex items-center gap-1.5">
            <span style={{
            color: '#ef4444',
            fontSize: 'clamp(17.25px, 2.39vw, 23.97px)',
            fontWeight: 500,
            fontVariant: 'small-caps',
            lineHeight: '100%'
          }}>
              {stats.biggestLoss}
            </span>
            {stats.biggestLossToken && <div className="flex items-center gap-1">
                {stats.biggestLossToken.logo && <img src={stats.biggestLossToken.logo} alt={stats.biggestLossToken.symbol || 'token'} style={{
              width: 'clamp(12.88px, 1.66vw, 16.56px)',
              height: 'clamp(12.88px, 1.66vw, 16.56px)'
            }} className="rounded-full object-cover" />}
                {stats.biggestLossToken.symbol && <span style={{
              color: '#9CA3AF',
              fontSize: 'clamp(11.04px, 1.47vw, 14.72px)',
              fontWeight: 500,
              lineHeight: '100%'
            }}>
                    {stats.biggestLossToken.symbol}
                  </span>}
              </div>}
          </div>
        </div>

        {/* Win rate value */}
        <div className="absolute font-general-sans" style={{
        top: 'calc(75% - 10px)',
        left: 'calc(44% + 15px)'
      }}>
          <span style={{
          color: '#ffffff',
          fontSize: 'clamp(17.25px, 2.39vw, 23.97px)',
          fontWeight: 500,
          fontVariant: 'small-caps',
          lineHeight: '100%'
        }}>
            {stats.winRate}
          </span>
        </div>

        {/* Trading volume value */}
        <div className="absolute font-general-sans" style={{
        top: 'calc(75% - 10px)',
        left: 'calc(71% + 15px)'
      }}>
          <span style={{
          color: '#ffffff',
          fontSize: 'clamp(17.25px, 2.39vw, 23.97px)',
          fontWeight: 500,
          fontVariant: 'small-caps',
          lineHeight: '100%'
        }}>
            {stats.totalVolume}
          </span>
        </div>

        {/* Wallet address - bottom area */}
        <div className="absolute font-general-sans text-right" style={{
        bottom: '4%',
        right: '20px'
      }}>
          <span style={{
          color: '#60a5fa',
          fontSize: 'clamp(10px, 1.4vw, 14px)',
          fontWeight: 600
        }}>
            {formatAddress(stats.address)}
          </span>
        </div>
      </div>

      {/* Action buttons - outside the card */}
      <div className="flex items-center gap-3 mt-6">
        <button onClick={handleShareOnX} disabled={isExporting} className="bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-6 py-3 flex items-center gap-2 font-medium text-white">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>}
          Share on X
        </button>
        <button onClick={handleDownload} disabled={isExporting} className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-6 py-3 font-medium flex items-center gap-2">
          {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>}
          Download Image
        </button>
      </div>

      {/* CTA section */}
      <div className="text-center space-y-4 py-8 animate-fade-in" style={{
      animationDelay: "0.3s"
    }}>
        <button onClick={onReset} className="block mx-auto text-[16.5px] transition-colors text-secondary-foreground hover:opacity-80">
          Generate another wrap
        </button>
        <p className="text-[#8b98a9] text-sm">
          Want to level up your trading game?
        </p>
        <a href="https://0xppl.com/" target="_blank" rel="noopener noreferrer" className="bg-white inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition-colors text-primary-foreground">
          Try <img src="/logo-0xppl.svg" alt="0xPPL" className="h-[21px] w-auto object-cover" /> 0xPPL 
        </a>
      </div>
    </div>;
};
export default WrapCard;
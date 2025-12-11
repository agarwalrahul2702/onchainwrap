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

export interface WrapStats {
  totalVolume: string;
  biggestProfit: string;
  biggestLoss: string;
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

// Full card template images mapping
const templateImages: Record<string, string> = {
  "Whale": whaleTemplate,
  "Trencher": trencherTemplate,
  "Swing Trader": swingTraderTemplate,
  "Only W's": onlyWsTemplate,
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
  const { toast } = useToast();

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
      await captureElementAsBlob(cardRef.current);
      const shareText = "Got my 2025 onchain wrap from @0xPPL_. Check yours!";
      const shareUrl = "https://0xppl.com";
      shareOnTwitter(shareText, shareUrl);
      
      toast({
        title: "Opening Twitter...",
        description: "Share your wrap with the world!",
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
    <div className="w-full flex flex-col items-center animate-scale-in">
      {/* Main card container - fixed aspect ratio matching template */}
      <div 
        ref={cardRef}
        id="wrap-card"
        className="relative w-full max-w-[1000px] overflow-hidden"
        style={{ aspectRatio: '1000 / 700' }}
      >
        {/* Full template image as background - NO cropping */}
        <img 
          src={templateImage} 
          alt={`${archetype} card template`}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        
        {/* ===== DYNAMIC TEXT OVERLAYS ===== */}
        {/* Each overlay has a matching background to cover placeholder text */}
        
        {/* One-liner text overlay */}
        <div 
          className="absolute font-general-sans"
          style={{
            top: '24.5%',
            left: '42%',
            backgroundColor: 'transparent',
          }}
        >
          <span 
            style={{
              color: '#9CA3AF',
              fontSize: 'clamp(8px, 1.8vw, 18px)',
              fontWeight: 500,
              fontStyle: 'italic',
            }}
          >
            {stats.oneliner}
          </span>
        </div>

        {/* Overall PnL value - top right */}
        <div 
          className="absolute font-general-sans text-right"
          style={{
            top: '14%',
            right: '3%',
            minWidth: '12%',
            backgroundColor: '#0a0f1a',
            padding: '2px 8px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: stats.pnlPositive ? '#22c55e' : '#ef4444',
              fontSize: 'clamp(16px, 4vw, 48px)',
              fontWeight: 700,
            }}
          >
            {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
          </span>
        </div>

        {/* Stats box overlays - positioned inside the dark stats panel */}
        
        {/* Biggest profit value */}
        <div 
          className="absolute font-general-sans"
          style={{
            top: '42%',
            left: '44%',
            backgroundColor: '#1a1f2e',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#22c55e',
              fontSize: 'clamp(10px, 2.5vw, 28px)',
              fontWeight: 700,
            }}
          >
            {stats.biggestProfit}
          </span>
        </div>

        {/* Biggest loss value */}
        <div 
          className="absolute font-general-sans"
          style={{
            top: '42%',
            left: '73%',
            backgroundColor: '#1a1f2e',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#ef4444',
              fontSize: 'clamp(10px, 2.5vw, 28px)',
              fontWeight: 700,
            }}
          >
            {stats.biggestLoss}
          </span>
        </div>

        {/* Win rate value */}
        <div 
          className="absolute font-general-sans"
          style={{
            top: '58%',
            left: '44%',
            backgroundColor: '#1a1f2e',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#ffffff',
              fontSize: 'clamp(12px, 3.2vw, 38px)',
              fontWeight: 700,
            }}
          >
            {stats.winRate}
          </span>
        </div>

        {/* Trading volume value */}
        <div 
          className="absolute font-general-sans"
          style={{
            top: '58%',
            left: '73%',
            backgroundColor: '#1a1f2e',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#ffffff',
              fontSize: 'clamp(12px, 3.2vw, 38px)',
              fontWeight: 700,
            }}
          >
            {stats.totalVolume}
          </span>
        </div>

        {/* Wallet address - bottom left */}
        <div 
          className="absolute font-general-sans"
          style={{
            bottom: '5%',
            left: '6.5%',
            backgroundColor: '#1d4ed8',
            padding: '2px 6px',
            borderRadius: '4px',
          }}
        >
          <span 
            style={{
              color: '#ffffff',
              fontSize: 'clamp(10px, 1.6vw, 16px)',
              fontWeight: 600,
            }}
          >
            {formatAddress(stats.address)}
          </span>
        </div>
      </div>

      {/* Action buttons - outside the card for export */}
      <div className="flex items-center gap-3 mt-6">
        <button 
          onClick={handleShareOnX}
          disabled={isExporting}
          className="bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-6 py-3 flex items-center gap-2 font-medium text-white"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          )}
          Share on X
        </button>
        <button 
          onClick={handleDownload}
          disabled={isExporting}
          className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-6 py-3 font-medium flex items-center gap-2"
        >
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          )}
          Download Image
        </button>
      </div>

      {/* CTA section */}
      <div className="text-center space-y-4 py-8 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-[#8b98a9] text-sm">
          Want to level up your trading game?
        </p>
        <a
          href="https://0xppl.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-primary-foreground font-semibold"
        >
          Try 0xPPL →
        </a>
        <button
          onClick={onReset}
          className="block mx-auto text-[#8b98a9] text-sm hover:text-white transition-colors underline-offset-4 hover:underline"
        >
          Generate another wrap
        </button>
      </div>
    </div>
  );
};

export default WrapCard;

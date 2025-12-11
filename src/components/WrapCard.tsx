import { useRef, useState } from "react";
import whaleImage from "@/assets/archetypes/whale.png";
import logoImage from "@/assets/logo-0xppl.svg";
import { captureElementAsBlob, downloadBlob, shareOnTwitter } from "@/utils/imageExport";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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

// Archetype images mapping (all use whale for now)
const archetypeImages: Record<string, string> = {
  "Whale": whaleImage,
  "Trencher": whaleImage,
  "Swing Trader": whaleImage,
  "Only W's": whaleImage,
  "Rug Maxi": whaleImage,
  "Few-Trade Wonder": whaleImage,
  "Freshly Spawned": whaleImage,
  "Active Farmer": whaleImage,
  "Casual Degen": whaleImage,
  "Average Crypto Bro": whaleImage,
};

const WrapCard = ({ stats, onReset }: WrapCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const archetype = stats.archetype || "Average Crypto Bro";
  const archetypeImage = archetypeImages[archetype] || whaleImage;

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
      // Generate image first (for user to download if they want)
      await captureElementAsBlob(cardRef.current);
      
      // Share text on Twitter
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
      {/* Main card container - matches reference design proportions */}
      <div 
        ref={cardRef}
        id="wrap-card"
        className="relative w-full rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0d1a2d 40%, #0f1e35 70%, #0a1628 100%)',
          aspectRatio: '780 / 480',
        }}
      >
        {/* Blue glow effect at bottom-left */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 70% at 20% 85%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
          }}
        />

        {/* Logo - top left */}
        <div className="absolute top-[4%] left-[3%] z-10">
          <img src={logoImage} alt="0xPPL" className="h-6 md:h-8" />
        </div>

        {/* Archetype image - left side, anchored to bottom */}
        <div className="absolute left-0 bottom-[12%] w-[38%] h-[75%] flex items-end justify-center">
          <img 
            src={archetypeImage} 
            alt={archetype}
            className="max-w-full max-h-full object-contain object-bottom"
          />
        </div>

        {/* Right side content */}
        <div className="absolute right-0 top-0 bottom-[12%] left-[38%] flex flex-col p-[4%] pt-[3%]">
          {/* Top section with persona and PnL */}
          <div className="flex justify-between items-start gap-4 flex-1">
            {/* Persona section */}
            <div className="pt-[8%]">
              <p className="text-[#8b9cb3] text-[1.8vw] md:text-sm mb-1 tracking-wide">Your onchain persona :</p>
              <h2 className="text-[5vw] md:text-[3.5vw] leading-none font-bold text-white mb-1">
                {archetype}
              </h2>
              <p className="text-[#4ade80] text-[2vw] md:text-[1.4vw]">{stats.oneliner}</p>
            </div>

            {/* Overall PnL - top right */}
            <div className="text-right pt-[4%]">
              <p className="text-[#8b9cb3] text-[1.8vw] md:text-sm mb-1">Overall pnl</p>
              <p className={`text-[4vw] md:text-[2.8vw] font-bold leading-none ${stats.pnlPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
              </p>
            </div>
          </div>

          {/* Stats box */}
          <div className="bg-[#0a101c]/95 rounded-xl p-[3%] border border-[#1a2744]">
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {/* Biggest profit */}
              <div>
                <p className="text-[#64748b] text-[1.4vw] md:text-xs mb-1">Biggest profit</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#22c55e] text-[2.2vw] md:text-xl font-bold">{stats.biggestProfit}</p>
                  <span className="flex items-center gap-1 bg-[#1a2744] rounded-full px-2 py-0.5">
                    <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <span className="text-[#8b9cb3] text-[1.2vw] md:text-xs">SZARA</span>
                  </span>
                </div>
              </div>
              
              {/* Biggest loss */}
              <div>
                <p className="text-[#64748b] text-[1.4vw] md:text-xs mb-1">Biggest loss</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#ef4444] text-[2.2vw] md:text-xl font-bold">{stats.biggestLoss}</p>
                  <span className="flex items-center gap-1 bg-[#1a2744] rounded-full px-2 py-0.5">
                    <span className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-purple-500 to-blue-500" />
                    <span className="text-[#8b9cb3] text-[1.2vw] md:text-xs">SZARA</span>
                  </span>
                </div>
              </div>
              
              {/* Win rate */}
              <div>
                <p className="text-[#64748b] text-[1.4vw] md:text-xs mb-1">Win rate</p>
                <p className="text-white text-[2.2vw] md:text-xl font-bold">{stats.winRate}</p>
              </div>
              
              {/* Trading volume */}
              <div>
                <p className="text-[#64748b] text-[1.4vw] md:text-xs mb-1">Trading volume</p>
                <p className="text-white text-[2.2vw] md:text-xl font-bold">{stats.totalVolume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[12%] bg-[#0c1424]/95 px-[3%] flex items-center justify-between border-t border-[#1e293b]/30">
          {/* Wallet address badge */}
          <div className="bg-[#1d4ed8] rounded-lg px-3 py-2 flex items-center gap-2">
            <svg className="w-3 h-3 md:w-4 md:h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[1vw] md:text-[10px] text-[#93c5fd] leading-none">Wallet Address</span>
              <span className="font-mono text-[1.4vw] md:text-sm font-semibold text-white">{formatAddress(stats.address)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button 
              onClick={handleShareOnX}
              disabled={isExporting}
              className="bg-[#1d4ed8] hover:bg-[#1e40af] disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-4 py-2 flex items-center gap-2 font-medium text-white text-[1.4vw] md:text-sm"
            >
              {isExporting ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              )}
              Share on X
            </button>
            <button 
              onClick={handleDownload}
              disabled={isExporting}
              className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-lg px-4 py-2 font-medium text-[1.4vw] md:text-sm flex items-center gap-2"
            >
              {isExporting ? (
                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
              ) : (
                <svg className="w-3 h-3 md:w-4 md:h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
              Download Image
            </button>
          </div>
        </div>
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

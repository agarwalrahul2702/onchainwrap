import whaleImage from "@/assets/archetypes/whale.png";
import logoImage from "@/assets/logo-0xppl.svg";

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

// Archetype one-liners mapping
const archetypeOneliners: Record<string, string> = {
  "Whale": "Your size is size!",
  "Trencher": "No token left unturned.",
  "Swing Trader": "TA over everything",
  "Only W's": "Clean entries, cleaner exits",
  "Rug Maxi": "You buy tops with confidence.",
  "Few-Trade Wonder": "The sniper with a day job.",
  "Freshly Spawned": "Welcome onchain, traveler.",
  "Active Farmer": "You touch more tokens than influencers shill.",
  "Casual Degen": "You trade enough to matter, not enough to stress",
  "Average Crypto BD": "You talk crypto more than you trade it.",
};

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
  "Average Crypto BD": whaleImage,
};

const WrapCard = ({ stats, onReset }: WrapCardProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const archetype = stats.archetype || "Average Crypto BD";
  const oneliner = archetypeOneliners[archetype] || archetypeOneliners["Average Crypto BD"];
  const archetypeImage = archetypeImages[archetype] || whaleImage;

  return (
    <div className="w-full flex flex-col items-center animate-scale-in">
      {/* Main card - full width, no constraints */}
      <div 
        className="relative w-full overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0d1a2d 40%, #0f1e35 70%, #0a1628 100%)',
          minHeight: '520px',
        }}
      >
        {/* Blue glow effect at bottom-left */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 60% at 25% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
          }}
        />

        {/* Logo - top left */}
        <div className="absolute top-6 left-6 z-10">
          <img src={logoImage} alt="0xPPL" className="h-8" />
        </div>

        {/* Archetype image - left side, large and prominent */}
        <div className="absolute left-0 bottom-16 w-[40%] max-w-[380px] h-[420px] flex items-end">
          <img 
            src={archetypeImage} 
            alt={archetype}
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        {/* Right side content */}
        <div className="absolute right-0 top-0 bottom-16 left-[35%] flex flex-col px-8 pt-6 pb-4">
          {/* Top section with persona and PnL */}
          <div className="flex justify-between items-start gap-8">
            {/* Persona section */}
            <div className="pt-10">
              <p className="text-[#8b9cb3] text-sm mb-2 tracking-wide">Your onchain persona :</p>
              <h2 className="text-[56px] leading-none font-bold text-[#22c55e] mb-2">
                {archetype}
              </h2>
              <p className="text-[#22c55e] text-lg">{oneliner}</p>
            </div>

            {/* Overall PnL - top right */}
            <div className="text-right pt-6">
              <p className="text-[#8b9cb3] text-sm mb-1">Overall pnl</p>
              <p className={`text-[42px] font-bold leading-none ${stats.pnlPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
              </p>
            </div>
          </div>

          {/* Stats box */}
          <div className="bg-[#0f1729]/90 rounded-xl p-6 mt-auto border border-[#1e293b]/50">
            <div className="grid grid-cols-2 gap-x-20 gap-y-6">
              {/* Biggest profit */}
              <div>
                <p className="text-[#64748b] text-xs mb-2 uppercase tracking-wider">Biggest profit</p>
                <p className="text-[#22c55e] text-3xl font-bold">{stats.biggestProfit}</p>
              </div>
              
              {/* Biggest loss */}
              <div>
                <p className="text-[#64748b] text-xs mb-2 uppercase tracking-wider">Biggest loss</p>
                <p className="text-[#ef4444] text-3xl font-bold">{stats.biggestLoss}</p>
              </div>
              
              {/* Win rate */}
              <div>
                <p className="text-[#64748b] text-xs mb-2 uppercase tracking-wider">Win rate</p>
                <p className="text-white text-3xl font-bold">{stats.winRate}</p>
              </div>
              
              {/* Trading volume */}
              <div>
                <p className="text-[#64748b] text-xs mb-2 uppercase tracking-wider">Trading volume</p>
                <p className="text-white text-3xl font-bold">{stats.totalVolume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#0c1424]/95 px-6 flex items-center justify-between border-t border-[#1e293b]/30">
          {/* Wallet address badge */}
          <div className="bg-[#1d4ed8] rounded-lg px-4 py-2.5 flex items-center gap-3">
            <svg className="w-4 h-4 text-white/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <div className="flex flex-col">
              <span className="text-[10px] text-[#93c5fd] leading-none">Wallet Address</span>
              <span className="font-mono text-sm font-semibold text-white">{formatAddress(stats.address)}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-[#1d4ed8] hover:bg-[#1e40af] transition-colors rounded-lg px-6 py-3 flex items-center gap-2 font-medium text-white text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 transition-colors rounded-lg px-6 py-3 font-medium text-sm flex items-center gap-2">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
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

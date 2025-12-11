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
    <div className="w-full max-w-[800px] mx-auto space-y-6 animate-scale-in">
      {/* Main card */}
      <div 
        className="relative w-full overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(180deg, #0a1929 0%, #0d1f3c 50%, #0a1929 100%)',
          aspectRatio: '800/480',
        }}
      >
        {/* Blue glow effect at bottom */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 50% at 40% 100%, rgba(59, 130, 246, 0.2) 0%, transparent 60%)',
          }}
        />

        {/* Logo - top left */}
        <div className="absolute top-5 left-5 z-10">
          <img src={logoImage} alt="0xPPL" className="h-7" />
        </div>

        {/* Archetype image - left side anchored to bottom */}
        <div className="absolute left-0 bottom-[60px] w-[300px] h-[340px]">
          <img 
            src={archetypeImage} 
            alt={archetype}
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        {/* Right side content */}
        <div className="absolute right-5 top-5 bottom-[72px] left-[280px] flex flex-col">
          {/* Top section with persona and PnL */}
          <div className="flex justify-between items-start">
            {/* Persona section */}
            <div className="pt-8">
              <p className="text-[#8b98a9] text-sm mb-1 font-sans tracking-wide">Your onchain persona :</p>
              <h2 className="font-display text-[52px] leading-none font-bold text-[#22c55e] mb-1">
                {archetype}
              </h2>
              <p className="text-[#22c55e] text-lg font-sans">{oneliner}</p>
            </div>

            {/* Overall PnL - top right */}
            <div className="text-right">
              <p className="text-[#8b98a9] text-sm font-sans mb-1">Overall pnl</p>
              <p className={`font-display text-4xl font-bold ${stats.pnlPositive ? "text-[#22c55e]" : "text-[#ef4444]"}`}>
                {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
              </p>
            </div>
          </div>

          {/* Stats box */}
          <div className="bg-[#111827]/95 rounded-xl p-5 mt-auto mb-2">
            <div className="grid grid-cols-2 gap-x-16 gap-y-5">
              {/* Biggest profit */}
              <div>
                <p className="text-[#6b7280] text-xs mb-1 font-sans">Biggest profit</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#22c55e] font-display text-2xl font-bold">{stats.biggestProfit}</p>
                </div>
              </div>
              
              {/* Biggest loss */}
              <div>
                <p className="text-[#6b7280] text-xs mb-1 font-sans">Biggest loss</p>
                <div className="flex items-center gap-2">
                  <p className="text-[#ef4444] font-display text-2xl font-bold">{stats.biggestLoss}</p>
                </div>
              </div>
              
              {/* Win rate */}
              <div>
                <p className="text-[#6b7280] text-xs mb-1 font-sans">Win rate</p>
                <p className="text-white font-display text-2xl font-bold">{stats.winRate}</p>
              </div>
              
              {/* Trading volume */}
              <div>
                <p className="text-[#6b7280] text-xs mb-1 font-sans">Trading volume</p>
                <p className="text-white font-display text-2xl font-bold">{stats.totalVolume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-[#0f172a]/95 px-5 flex items-center justify-between">
          {/* Wallet address badge */}
          <div className="bg-[#1d4ed8] rounded-lg px-3 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <span className="text-[10px] text-[#93c5fd] font-sans">Wallet Address</span>
            <span className="font-mono text-sm font-semibold text-white">{formatAddress(stats.address)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button className="bg-[#1d4ed8] hover:bg-[#1e40af] transition-colors rounded-lg px-5 py-2.5 flex items-center gap-2 font-medium text-white text-sm font-sans">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 transition-colors rounded-lg px-5 py-2.5 font-medium text-sm font-sans flex items-center gap-2">
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
      <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-[#8b98a9] text-sm font-sans">
          Want to level up your trading game?
        </p>
        <a
          href="https://0xppl.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex items-center gap-2 px-6 py-3 rounded-xl text-primary-foreground font-semibold font-sans"
        >
          Try 0xPPL →
        </a>
        <button
          onClick={onReset}
          className="block mx-auto text-[#8b98a9] text-sm hover:text-white transition-colors underline-offset-4 hover:underline font-sans"
        >
          Generate another wrap
        </button>
      </div>
    </div>
  );
};

export default WrapCard;

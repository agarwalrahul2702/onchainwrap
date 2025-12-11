import whaleCardBg from "@/assets/card-backgrounds/whale-card-bg.png";
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
  "Whale": "Your size is size",
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

// Card background mapping (all use whale for now, easy to swap later)
const archetypeBackgrounds: Record<string, string> = {
  "Whale": whaleCardBg,
  "Trencher": whaleCardBg,
  "Swing Trader": whaleCardBg,
  "Only W's": whaleCardBg,
  "Rug Maxi": whaleCardBg,
  "Few-Trade Wonder": whaleCardBg,
  "Freshly Spawned": whaleCardBg,
  "Active Farmer": whaleCardBg,
  "Casual Degen": whaleCardBg,
  "Average Crypto BD": whaleCardBg,
};

const WrapCard = ({ stats, onReset }: WrapCardProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  };

  const archetype = stats.archetype || "Average Crypto BD";
  const oneliner = archetypeOneliners[archetype] || archetypeOneliners["Average Crypto BD"];
  const cardBg = archetypeBackgrounds[archetype] || whaleCardBg;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-scale-in">
      {/* Main card with background image */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          backgroundImage: `url(${cardBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          aspectRatio: '16/10',
        }}
      >
        {/* Logo */}
        <div className="absolute top-6 left-6">
          <img src={logoImage} alt="0xPPL" className="h-8" />
        </div>

        {/* Archetype section - top center */}
        <div className="absolute top-12 left-1/2 -translate-x-1/4 text-center">
          <p className="text-muted-foreground text-sm mb-1">Your onchain persona :</p>
          <h2 className="font-display text-5xl font-bold text-emerald-400 mb-1">
            {archetype}
          </h2>
          <p className="text-emerald-400 text-lg">{oneliner}</p>
        </div>

        {/* Overall PnL - top right */}
        <div className="absolute top-12 right-8 text-right">
          <p className="text-muted-foreground text-sm">Overall pnl</p>
          <p className={`font-display text-3xl font-bold ${stats.pnlPositive ? "text-emerald-400" : "text-red-400"}`}>
            {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
          </p>
        </div>

        {/* Stats box - bottom right area */}
        <div className="absolute bottom-24 right-8 bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 min-w-[320px]">
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            {/* Biggest profit */}
            <div>
              <p className="text-muted-foreground text-sm mb-1">Biggest profit</p>
              <p className="text-emerald-400 font-display text-2xl font-bold">{stats.biggestProfit}</p>
            </div>
            
            {/* Biggest loss */}
            <div>
              <p className="text-muted-foreground text-sm mb-1">Biggest loss</p>
              <p className="text-red-400 font-display text-2xl font-bold">{stats.biggestLoss}</p>
            </div>
            
            {/* Win rate */}
            <div>
              <p className="text-muted-foreground text-sm mb-1">Win rate</p>
              <p className="text-foreground font-display text-2xl font-bold">{stats.winRate}</p>
            </div>
            
            {/* Trading volume */}
            <div>
              <p className="text-muted-foreground text-sm mb-1">Trading volume</p>
              <p className="text-foreground font-display text-2xl font-bold">{stats.totalVolume}</p>
            </div>
          </div>
        </div>

        {/* Bottom bar with buttons */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          {/* Wallet address */}
          <div className="bg-blue-600 rounded-lg px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <span className="text-xs text-muted-foreground">Wallet Address</span>
            <span className="font-mono text-sm font-medium">{formatAddress(stats.address)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-6 py-2 flex items-center gap-2 font-medium">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button className="border border-blue-600 text-blue-400 hover:bg-blue-600/20 transition-colors rounded-lg px-6 py-2 font-medium">
              Download Image
            </button>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4 animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <p className="text-muted-foreground text-sm">
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
          className="block mx-auto text-muted-foreground text-sm hover:text-foreground transition-colors underline-offset-4 hover:underline"
        >
          Generate another wrap
        </button>
      </div>
    </div>
  );
};

export default WrapCard;

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
    <div className="w-full max-w-4xl mx-auto space-y-6 animate-scale-in">
      {/* Main card */}
      <div 
        className="relative w-full rounded-2xl overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)',
          aspectRatio: '16/10',
        }}
      >
        {/* Blue glow effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at 30% 80%, rgba(59, 130, 246, 0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 40%)',
          }}
        />

        {/* Logo - top left */}
        <div className="absolute top-6 left-6 z-10">
          <img src={logoImage} alt="0xPPL" className="h-8" />
        </div>

        {/* Archetype image - left side */}
        <div className="absolute left-0 bottom-12 w-[45%] h-[85%] flex items-end">
          <img 
            src={archetypeImage} 
            alt={archetype}
            className="w-full h-full object-contain object-bottom"
          />
        </div>

        {/* Right side content */}
        <div className="absolute right-0 top-0 bottom-16 w-[55%] flex flex-col justify-center pr-8 pl-4">
          {/* Top section with persona and PnL */}
          <div className="flex justify-between items-start mb-4">
            {/* Persona section */}
            <div className="text-center flex-1">
              <p className="text-muted-foreground text-sm mb-2 font-sans">Your onchain persona :</p>
              <h2 className="font-display text-5xl font-bold text-emerald-400 mb-2">
                {archetype}
              </h2>
              <p className="text-emerald-400 text-lg font-sans">{oneliner}</p>
            </div>

            {/* Overall PnL - top right */}
            <div className="text-right ml-4">
              <p className="text-muted-foreground text-sm font-sans">Overall pnl</p>
              <p className={`font-display text-3xl font-bold ${stats.pnlPositive ? "text-emerald-400" : "text-red-400"}`}>
                {stats.pnlPositive ? "" : "-"}{stats.overallPnL}
              </p>
            </div>
          </div>

          {/* Stats box */}
          <div className="bg-zinc-900/90 backdrop-blur-sm rounded-xl p-6 mt-4">
            <div className="grid grid-cols-2 gap-x-12 gap-y-6">
              {/* Biggest profit */}
              <div>
                <p className="text-muted-foreground text-sm mb-1 font-sans">Biggest profit</p>
                <p className="text-emerald-400 font-display text-2xl font-bold">{stats.biggestProfit}</p>
              </div>
              
              {/* Biggest loss */}
              <div>
                <p className="text-muted-foreground text-sm mb-1 font-sans">Biggest loss</p>
                <p className="text-red-400 font-display text-2xl font-bold">{stats.biggestLoss}</p>
              </div>
              
              {/* Win rate */}
              <div>
                <p className="text-muted-foreground text-sm mb-1 font-sans">Win rate</p>
                <p className="text-foreground font-display text-2xl font-bold">{stats.winRate}</p>
              </div>
              
              {/* Trading volume */}
              <div>
                <p className="text-muted-foreground text-sm mb-1 font-sans">Trading volume</p>
                <p className="text-foreground font-display text-2xl font-bold">{stats.totalVolume}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900/80 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
          {/* Wallet address badge */}
          <div className="bg-blue-600 rounded-lg px-4 py-2 flex items-center gap-2">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="M3 10h18" />
            </svg>
            <span className="text-xs text-blue-200 font-sans">Wallet Address</span>
            <span className="font-mono text-sm font-medium text-white">{formatAddress(stats.address)}</span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 transition-colors rounded-lg px-6 py-2 flex items-center gap-2 font-medium text-white font-sans">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </button>
            <button className="border border-blue-500 text-blue-400 hover:bg-blue-600/20 transition-colors rounded-lg px-6 py-2 font-medium font-sans flex items-center gap-2">
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
        <p className="text-muted-foreground text-sm font-sans">
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
          className="block mx-auto text-muted-foreground text-sm hover:text-foreground transition-colors underline-offset-4 hover:underline font-sans"
        >
          Generate another wrap
        </button>
      </div>
    </div>
  );
};

export default WrapCard;

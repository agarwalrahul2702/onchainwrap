import { TrendingUp, TrendingDown, Target, DollarSign, Percent, Sparkles } from "lucide-react";
import whaleImage from "@/assets/archetypes/whale.png";

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

// Archetype image mapping (add more as images are provided)
const archetypeImages: Record<string, string> = {
  "Whale": whaleImage,
};

const WrapCard = ({ stats, onReset }: WrapCardProps) => {
  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const archetypeImage = stats.archetype ? archetypeImages[stats.archetype] : undefined;

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 animate-scale-in">
      {/* Main card */}
      <div className="glass-card p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm font-mono">
            {formatAddress(stats.address)}
          </p>
          <h2 className="font-display text-2xl font-bold gradient-text">
            Your 2024 Onchain Wrap
          </h2>
        </div>

        {/* Archetype image if available */}
        {archetypeImage && (
          <div className="flex justify-center">
            <img 
              src={archetypeImage} 
              alt={stats.archetype} 
              className="w-48 h-48 object-contain rounded-lg"
            />
          </div>
        )}

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          <StatItem
            icon={<DollarSign className="text-primary" size={20} />}
            label="Total Volume"
            value={stats.totalVolume}
          />
          <StatItem
            icon={<Percent className="text-accent" size={20} />}
            label="Win Rate"
            value={stats.winRate}
          />
          <StatItem
            icon={<TrendingUp className="text-green-400" size={20} />}
            label="Biggest Profit"
            value={stats.biggestProfit}
            valueClass="text-green-400"
          />
          <StatItem
            icon={<TrendingDown className="text-red-400" size={20} />}
            label="Biggest Loss"
            value={stats.biggestLoss}
            valueClass="text-red-400"
          />
        </div>

        {/* Overall PnL */}
        <div className="glass-card p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Target size={18} className={stats.pnlPositive ? "text-green-400" : "text-red-400"} />
            <span className="text-muted-foreground text-sm">Overall PnL</span>
          </div>
          <p className={`font-display text-3xl font-bold ${stats.pnlPositive ? "text-green-400" : "text-red-400"}`}>
            {stats.pnlPositive ? "+" : ""}{stats.overallPnL}
          </p>
        </div>

        {/* Personality one-liner */}
        <div className="text-center space-y-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="text-accent" size={16} />
            <span className="text-muted-foreground text-xs uppercase tracking-wider">Your Onchain Personality</span>
            <Sparkles className="text-accent" size={16} />
          </div>
          <p className="font-display text-lg text-foreground italic">
            "{stats.oneliner}"
          </p>
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

interface StatItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  valueClass?: string;
}

const StatItem = ({ icon, label, value, valueClass = "text-foreground" }: StatItemProps) => (
  <div className="glass-card p-4 space-y-2">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-muted-foreground text-xs">{label}</span>
    </div>
    <p className={`font-display text-xl font-bold ${valueClass}`}>{value}</p>
  </div>
);

export default WrapCard;

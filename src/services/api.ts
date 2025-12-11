import { WrapStats } from "@/components/WrapCard";

const API_ENDPOINT = "https://0xppl.com/api/v4/get_yearly_highlights";

interface ApiResponse {
  status: string;
  data: {
    volume?: { value: number; display_value: string };
    biggest_profit?: { amount: { value: number; display_value: string } };
    biggest_loss?: { amount: { value: number; display_value: string } };
    win_rate?: { value: number; display_value: string };
    overall_pnl?: { value: number; display_value: string };
    archetype?: string;
    num_trades?: number;
    tokens_interacted?: number;
  };
}

// Archetype detection based on priority table
type ArchetypeType = 
  | "Whale" 
  | "Trencher" 
  | "Swing Trader" 
  | "Only W's" 
  | "Rug Maxi" 
  | "Few-Trade Wonder" 
  | "Freshly Spawned" 
  | "Active Farmer" 
  | "Casual Degen" 
  | "Average Crypto Bro";

// Archetype taglines
const archetypeTaglines: Record<ArchetypeType, string> = {
  "Whale": "Your size is size",
  "Trencher": "No token left unturned",
  "Swing Trader": "TA over everything",
  "Only W's": "Clean entries, cleaner exits",
  "Rug Maxi": "You buy tops with confidence",
  "Few-Trade Wonder": "Sniper with a day job",
  "Freshly Spawned": "Welcome onchain, traveler",
  "Active Farmer": "You touch more tokens than influencers shill",
  "Casual Degen": "You trade enough to matter, not enough to stress",
  "Average Crypto Bro": "You talk crypto more than you trade",
};

const detectArchetype = (data: ApiResponse["data"]): ArchetypeType => {
  const volume = data.volume?.value ?? 0;
  const tokensInteracted = data.tokens_interacted ?? 0;
  const numTrades = data.num_trades ?? 0;
  const winRateValue = data.win_rate?.value ?? 0;
  const pnlValue = data.overall_pnl?.value ?? 0;
  
  // Calculate win/loss trades
  const winTrades = Math.round((winRateValue / 100) * numTrades);
  const lossTrades = numTrades - winTrades;

  // Priority 1: Whale - Volume >= 2,000,000
  if (volume >= 2000000) {
    return "Whale";
  }

  // Priority 2: Trencher - Tokens Interacted >= 100
  if (tokensInteracted >= 100) {
    return "Trencher";
  }

  // Priority 3: Swing Trader - (skipped for now, needs buy/sell point data)
  
  // Priority 4: Only W's - 50%+ win rate, min 7 profitable trades, in profit
  if (winRateValue >= 50 && winTrades >= 7 && pnlValue > 0) {
    return "Only W's";
  }

  // Priority 5: Rug Maxi - PnL < 0 and loss trades >= 2x win trades
  if (pnlValue < 0 && lossTrades >= 2 * winTrades) {
    return "Rug Maxi";
  }

  // Priority 6: Few-Trade Wonder - <= 5 trades, profit >= 2x loss
  const biggestProfit = data.biggest_profit?.amount?.value ?? 0;
  const biggestLoss = Math.abs(data.biggest_loss?.amount?.value ?? 0);
  if (numTrades <= 5 && biggestProfit >= 2 * biggestLoss && pnlValue > 0) {
    return "Few-Trade Wonder";
  }

  // Priority 7: Freshly Spawned - < 5 trades, doesn't meet other criteria
  if (numTrades < 5) {
    return "Freshly Spawned";
  }

  // Priority 8: Active Farmer - Tokens Interacted 30-99
  if (tokensInteracted >= 30 && tokensInteracted <= 99) {
    return "Active Farmer";
  }

  // Priority 9: Casual Degen - Volume 50,000 - 2,000,000
  if (volume >= 50000 && volume < 2000000) {
    return "Casual Degen";
  }

  // Priority 10: Average Crypto Bro (Fallback)
  return "Average Crypto Bro";
};

export const fetchWrapStats = async (address: string): Promise<WrapStats> => {
  const response = await fetch(`${API_ENDPOINT}?user_address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    throw new Error("Invalid address or no data found");
  }

  const json: ApiResponse = await response.json();
  
  console.log("API Response:", JSON.stringify(json, null, 2));

  if (!json || json.status !== "ok" || !json.data) {
    throw new Error("Invalid address or no data found");
  }

  const data = json.data;
  const pnlValue = data.overall_pnl?.value ?? 0;
  const pnlPositive = pnlValue >= 0;
  
  // Detect archetype based on priority rules
  const detectedArchetype = detectArchetype(data);

  const stats: WrapStats = {
    totalVolume: data.volume?.display_value || "No data",
    biggestProfit: data.biggest_profit?.amount?.display_value || "No data",
    biggestLoss: data.biggest_loss?.amount?.display_value || "No data",
    winRate: data.win_rate?.display_value || "No data",
    overallPnL: data.overall_pnl?.display_value || "No data",
    pnlPositive,
    oneliner: archetypeTaglines[detectedArchetype],
    archetype: detectedArchetype,
    address: address,
  };

  console.log("Mapped Stats:", stats);
  console.log("Detected Archetype:", detectedArchetype);

  return stats;
};

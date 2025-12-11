import { WrapStats, TokenInfo } from "@/components/WrapCard";

const API_ENDPOINT = "https://0xppl.com/api/v4/get_yearly_highlights";

interface ApiProfile {
  display_name?: string;
  display_picture?: string;
  token_symbol?: string;
}

interface ApiResponse {
  status: string;
  data: {
    volume?: { value: number; display_value: string };
    biggest_profit?: { 
      amount: { value: number; display_value: string };
      pnl_percent?: { value: number; display_value: string };
      profile?: ApiProfile;
    };
    biggest_loss?: { 
      amount: { value: number; display_value: string };
      pnl_percent?: { value: number; display_value: string };
      profile?: ApiProfile;
    };
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

interface AggregatedData {
  volume: number;
  biggestProfit: number;
  biggestProfitDisplay: string;
  biggestProfitToken?: TokenInfo;
  biggestProfitPnlPercent?: string;
  biggestLoss: number;
  biggestLossDisplay: string;
  biggestLossToken?: TokenInfo;
  biggestLossPnlPercent?: string;
  totalWinTrades: number;
  totalTrades: number;
  overallPnl: number;
  tokensInteracted: number;
}

const detectArchetype = (data: AggregatedData): ArchetypeType => {
  const volume = data.volume;
  const tokensInteracted = data.tokensInteracted;
  const numTrades = data.totalTrades;
  const winRateValue = numTrades > 0 ? (data.totalWinTrades / numTrades) * 100 : 0;
  const pnlValue = data.overallPnl;
  
  // Calculate win/loss trades
  const winTrades = data.totalWinTrades;
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
  const biggestProfit = data.biggestProfit;
  const biggestLoss = Math.abs(data.biggestLoss);
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

const formatCurrency = (value: number): string => {
  const sign = value < 0 ? '-' : '';
  const absValue = Math.abs(value);
  if (absValue >= 1000000) {
    return `${sign}$${(absValue / 1000000).toFixed(2)}M`;
  } else if (absValue >= 1000) {
    return `${sign}$${(absValue / 1000).toFixed(2)}K`;
  }
  return `${sign}$${absValue.toFixed(2)}`;
};

const fetchSingleWrapStats = async (address: string): Promise<ApiResponse["data"] | null> => {
  const response = await fetch(`${API_ENDPOINT}?user_address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    return null;
  }

  const json: ApiResponse = await response.json();
  
  if (!json || json.status !== "ok" || !json.data) {
    return null;
  }

  return json.data;
};

export const fetchWrapStats = async (addresses: string[]): Promise<WrapStats> => {
  // Fetch data for all addresses in parallel
  const results = await Promise.all(addresses.map(addr => fetchSingleWrapStats(addr)));
  
  // Filter out failed requests
  const validResults = results.filter((r): r is ApiResponse["data"] => r !== null);
  
  if (validResults.length === 0) {
    throw new Error("Invalid address or no data found");
  }

  console.log("API Responses:", JSON.stringify(validResults, null, 2));

  // Aggregate the data
  const aggregated: AggregatedData = {
    volume: 0,
    biggestProfit: 0,
    biggestProfitDisplay: "No data",
    biggestProfitToken: undefined,
    biggestProfitPnlPercent: undefined,
    biggestLoss: 0,
    biggestLossDisplay: "No data",
    biggestLossToken: undefined,
    biggestLossPnlPercent: undefined,
    totalWinTrades: 0,
    totalTrades: 0,
    overallPnl: 0,
    tokensInteracted: 0,
  };

  validResults.forEach(data => {
    aggregated.volume += data.volume?.value ?? 0;
    aggregated.overallPnl += data.overall_pnl?.value ?? 0;
    aggregated.tokensInteracted += data.tokens_interacted ?? 0;
    
    const numTrades = data.num_trades ?? 0;
    const winRateValue = data.win_rate?.value ?? 0;
    aggregated.totalTrades += numTrades;
    aggregated.totalWinTrades += Math.round((winRateValue / 100) * numTrades);

    // Track biggest profit
    const profit = data.biggest_profit?.amount?.value ?? 0;
    if (profit > aggregated.biggestProfit) {
      aggregated.biggestProfit = profit;
      aggregated.biggestProfitDisplay = data.biggest_profit?.amount?.display_value || "No data";
      aggregated.biggestProfitToken = data.biggest_profit?.profile ? {
        logo: data.biggest_profit.profile.display_picture,
        symbol: data.biggest_profit.profile.token_symbol,
      } : undefined;
      aggregated.biggestProfitPnlPercent = data.biggest_profit?.pnl_percent?.display_value;
    }

    // Track biggest loss (most negative)
    const loss = data.biggest_loss?.amount?.value ?? 0;
    if (loss < aggregated.biggestLoss) {
      aggregated.biggestLoss = loss;
      aggregated.biggestLossDisplay = data.biggest_loss?.amount?.display_value || "No data";
      aggregated.biggestLossToken = data.biggest_loss?.profile ? {
        logo: data.biggest_loss.profile.display_picture,
        symbol: data.biggest_loss.profile.token_symbol,
      } : undefined;
      aggregated.biggestLossPnlPercent = data.biggest_loss?.pnl_percent?.display_value;
    }
  });

  const pnlPositive = aggregated.overallPnl >= 0;
  const detectedArchetype = detectArchetype(aggregated);
  const aggregatedWinRate = aggregated.totalTrades > 0 
    ? Math.round((aggregated.totalWinTrades / aggregated.totalTrades) * 100) 
    : 0;

  const stats: WrapStats = {
    totalVolume: formatCurrency(aggregated.volume),
    biggestProfit: aggregated.biggestProfitDisplay,
    biggestProfitToken: aggregated.biggestProfitToken,
    biggestProfitPnlPercent: aggregated.biggestProfitPnlPercent,
    biggestLoss: aggregated.biggestLossDisplay,
    biggestLossToken: aggregated.biggestLossToken,
    biggestLossPnlPercent: aggregated.biggestLossPnlPercent,
    winRate: `${aggregatedWinRate}%`,
    overallPnL: formatCurrency(aggregated.overallPnl),
    pnlPositive,
    oneliner: archetypeTaglines[detectedArchetype],
    archetype: detectedArchetype,
    address: addresses.length === 1 ? addresses[0] : `${addresses.length} wallets`,
  };

  console.log("Aggregated Stats:", stats);
  console.log("Detected Archetype:", detectedArchetype);

  return stats;
};

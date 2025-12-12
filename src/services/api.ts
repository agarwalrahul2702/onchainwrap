import { WrapStats, TokenInfo } from "@/components/WrapCard";

const API_ENDPOINT_SINGLE = "https://0xppl.com/api/v4/get_yearly_highlights";
const API_ENDPOINT_MULTI = "https://0xppl.com/api/v4/get_yearly_highlights_multi";

interface ApiProfile {
  display_name?: string;
  display_picture?: string;
  token_symbol?: string;
}

interface ApiData {
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
}

interface ApiResponse {
  status: string;
  data: ApiData;
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

const fetchSingleWrapStats = async (address: string): Promise<ApiData | null> => {
  const response = await fetch(`${API_ENDPOINT_SINGLE}?user_address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    return null;
  }

  const json: ApiResponse = await response.json();
  
  if (!json || json.status !== "ok" || !json.data) {
    return null;
  }

  return json.data;
};

const fetchMultiWrapStats = async (addresses: string[]): Promise<ApiData | null> => {
  console.log("Calling multi-address endpoint with addresses:", addresses);
  
  const response = await fetch(API_ENDPOINT_MULTI, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ user_addresses: addresses }),
  });

  console.log("Multi-endpoint response status:", response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Multi-endpoint error:", errorText);
    return null;
  }

  const json: ApiResponse = await response.json();
  console.log("Multi-endpoint raw response:", JSON.stringify(json, null, 2));
  
  if (!json || json.status !== "ok" || !json.data) {
    return null;
  }

  return json.data;
};

export const fetchWrapStats = async (addresses: string[]): Promise<WrapStats> => {
  let data: ApiData | null = null;

  if (addresses.length === 1) {
    // Single address: use the single endpoint
    data = await fetchSingleWrapStats(addresses[0]);
  } else {
    // Multiple addresses: use the multi endpoint
    data = await fetchMultiWrapStats(addresses);
  }
  
  if (!data) {
    throw new Error("Invalid address or no data found");
  }

  console.log("API Response:", JSON.stringify(data, null, 2));

  // Extract data from API response
  const volume = data.volume?.value ?? 0;
  const overallPnl = data.overall_pnl?.value ?? 0;
  const tokensInteracted = data.tokens_interacted ?? 0;
  const numTrades = data.num_trades ?? 0;
  const winRateValue = data.win_rate?.value ?? 0;
  const totalWinTrades = Math.round((winRateValue / 100) * numTrades);

  const biggestProfit = data.biggest_profit?.amount?.value ?? 0;
  const biggestProfitDisplay = data.biggest_profit?.amount?.display_value || "No data";
  const biggestProfitToken: TokenInfo | undefined = data.biggest_profit?.profile ? {
    logo: data.biggest_profit.profile.display_picture,
    symbol: data.biggest_profit.profile.token_symbol,
  } : undefined;
  const biggestProfitPnlPercent = data.biggest_profit?.pnl_percent?.display_value;

  const biggestLoss = data.biggest_loss?.amount?.value ?? 0;
  const biggestLossDisplay = data.biggest_loss?.amount?.display_value || "No data";
  const biggestLossToken: TokenInfo | undefined = data.biggest_loss?.profile ? {
    logo: data.biggest_loss.profile.display_picture,
    symbol: data.biggest_loss.profile.token_symbol,
  } : undefined;
  const biggestLossPnlPercent = data.biggest_loss?.pnl_percent?.display_value;

  // Build aggregated data for archetype detection
  const aggregated: AggregatedData = {
    volume,
    biggestProfit,
    biggestProfitDisplay,
    biggestProfitToken,
    biggestProfitPnlPercent,
    biggestLoss,
    biggestLossDisplay,
    biggestLossToken,
    biggestLossPnlPercent,
    totalWinTrades,
    totalTrades: numTrades,
    overallPnl,
    tokensInteracted,
  };

  const pnlPositive = overallPnl >= 0;
  const detectedArchetype = detectArchetype(aggregated);
  const aggregatedWinRate = numTrades > 0 
    ? Math.round((totalWinTrades / numTrades) * 100) 
    : 0;

  const stats: WrapStats = {
    totalVolume: formatCurrency(volume),
    biggestProfit: biggestProfitDisplay,
    biggestProfitToken,
    biggestProfitPnlPercent,
    biggestLoss: biggestLossDisplay,
    biggestLossToken,
    biggestLossPnlPercent,
    winRate: `${aggregatedWinRate}%`,
    overallPnL: formatCurrency(overallPnl),
    pnlPositive,
    oneliner: archetypeTaglines[detectedArchetype],
    archetype: detectedArchetype,
    address: addresses.length === 1 ? addresses[0] : `${addresses.length} wallets`,
  };

  console.log("Stats:", stats);
  console.log("Detected Archetype:", detectedArchetype);

  return stats;
};

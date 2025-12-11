import { WrapStats } from "@/components/WrapCard";

const API_ENDPOINT = "https://0xppl.com/api/v4/get_yearly_highlights";

interface ApiResponse {
  total_trading_volume?: string;
  biggest_profit?: string;
  biggest_loss?: string;
  win_rate?: string;
  overall_pnl?: string;
  personality_line?: string;
}

export const fetchWrapStats = async (address: string): Promise<WrapStats> => {
  const response = await fetch(`${API_ENDPOINT}?user_address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    throw new Error("Invalid address or no data found");
  }

  const data: ApiResponse = await response.json();

  // Check if we have meaningful data
  if (!data || Object.keys(data).length === 0) {
    throw new Error("Invalid address or no data found");
  }

  // Parse overall_pnl to determine if positive
  const pnlValue = data.overall_pnl || "0";
  const pnlNumeric = parseFloat(pnlValue.replace(/[^0-9.-]/g, ""));
  const pnlPositive = pnlNumeric >= 0;

  // Map API response to WrapStats interface with fallbacks
  const stats: WrapStats = {
    totalVolume: data.total_trading_volume || "$0",
    biggestProfit: data.biggest_profit || "$0",
    biggestLoss: data.biggest_loss || "$0",
    winRate: data.win_rate || "0%",
    overallPnL: data.overall_pnl || "$0",
    pnlPositive,
    oneliner: data.personality_line || "Your onchain journey awaits.",
    address: address,
  };

  return stats;
};

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

export const fetchWrapStats = async (address: string): Promise<WrapStats> => {
  const response = await fetch(`${API_ENDPOINT}?user_address=${encodeURIComponent(address)}`);

  if (!response.ok) {
    throw new Error("Invalid address or no data found");
  }

  const json: ApiResponse = await response.json();
  
  // Log the full response for debugging
  console.log("API Response:", JSON.stringify(json, null, 2));

  // Check if we have meaningful data
  if (!json || json.status !== "ok" || !json.data) {
    throw new Error("Invalid address or no data found");
  }

  const data = json.data;

  // Parse overall_pnl to determine if positive
  const pnlValue = data.overall_pnl?.value ?? 0;
  const pnlPositive = pnlValue >= 0;

  // Map API response to WrapStats interface
  const stats: WrapStats = {
    totalVolume: data.volume?.display_value || "No data",
    biggestProfit: data.biggest_profit?.amount?.display_value || "No data",
    biggestLoss: data.biggest_loss?.amount?.display_value || "No data",
    winRate: data.win_rate?.display_value || "No data",
    overallPnL: data.overall_pnl?.display_value || "No data",
    pnlPositive,
    oneliner: data.archetype || "Your onchain journey awaits.",
    address: address,
  };

  console.log("Mapped Stats:", stats);

  return stats;
};

import { WrapStats } from "@/components/WrapCard";

// Mock API - Replace with real endpoint
const MOCK_DELAY = 8000; // Simulates ~8 second loading

// One-liners for different trader types
const oneliners = [
  "Degen by day, diamond hands by night.",
  "You turned 'buy high, sell low' into an art form.",
  "The charts fear your unpredictable moves.",
  "Master of catching falling knives.",
  "Your portfolio is more volatile than a meme coin.",
  "Professional bag holder since 2024.",
  "You don't FOMO, you ARE the FOMO.",
  "Touch grass? You'd rather touch new ATHs.",
];

// This is a mock function - replace with actual API call
export const fetchWrapStats = async (address: string): Promise<WrapStats> => {
  // TODO: Replace with actual API endpoint
  // const response = await fetch(`YOUR_API_ENDPOINT?address=${address}`);
  // return response.json();

  // Simulated API delay
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY));

  // Mock data - remove when connecting real API
  const mockStats: WrapStats = {
    totalVolume: "$1.2M",
    biggestProfit: "+$45,230",
    biggestLoss: "-$12,450",
    winRate: "62.3%",
    overallPnL: "$32,780",
    pnlPositive: true,
    oneliner: oneliners[Math.floor(Math.random() * oneliners.length)],
    address: address,
  };

  return mockStats;
};

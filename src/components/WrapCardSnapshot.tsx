import React, { forwardRef } from "react";
import { WrapStats } from "./WrapCard";

// Import all card template images
import whaleTemplate from "@/assets/card-templates/whale.png";
import trencherTemplate from "@/assets/card-templates/trencher.png";
import swingTraderTemplate from "@/assets/card-templates/swing-trader.png";
import onlyWsTemplate from "@/assets/card-templates/only-ws.png";
import rugMaxiTemplate from "@/assets/card-templates/rug-maxi.png";
import fewTradeWonderTemplate from "@/assets/card-templates/few-trade-wonder.png";
import freshlySpawnedTemplate from "@/assets/card-templates/freshly-spawned.png";
import activeFarmerTemplate from "@/assets/card-templates/active-farmer.png";
import casualDegenTemplate from "@/assets/card-templates/casual-degen.png";
import averageCryptoBroTemplate from "@/assets/card-templates/average-crypto-bro.png";
import defaultTokenImage from "@/assets/P1.png";
import xLogo from "@/assets/x-logo.png";

const templateImages: Record<string, string> = {
  Whale: whaleTemplate,
  Trencher: trencherTemplate,
  "Swing Trader": swingTraderTemplate,
  "Only W's": onlyWsTemplate,
  "Only W": onlyWsTemplate,
  "Rug Maxi": rugMaxiTemplate,
  "Few-Trade Wonder": fewTradeWonderTemplate,
  "Freshly Spawned": freshlySpawnedTemplate,
  "Active Farmer": activeFarmerTemplate,
  "Casual Degen": casualDegenTemplate,
  "Average Crypto Bro": averageCryptoBroTemplate,
};

// Fixed dimensions for snapshot - matching template aspect ratio
const SNAPSHOT_WIDTH = 780;
const SNAPSHOT_HEIGHT = 468;

interface WrapCardSnapshotProps {
  stats: WrapStats;
}

const formatAddress = (addr: string, count: number) => {
  const shortAddr = `${addr.slice(0, 4)}...${addr.slice(-4)}`;
  if (count > 1) {
    return `${shortAddr} + ${count - 1} more`;
  }
  return shortAddr;
};

/**
 * Snapshot-only card component with FIXED absolute positioning.
 * No flexbox, no grid, no Tailwind layout utilities.
 * All dimensions are in explicit pixels for html2canvas compatibility.
 */
const WrapCardSnapshot = forwardRef<HTMLDivElement, WrapCardSnapshotProps>(
  ({ stats }, ref) => {
    const archetype = stats.archetype || "Average Crypto Bro";
    const templateImage = templateImages[archetype] || averageCryptoBroTemplate;

    return (
      <div
        ref={ref}
        style={{
          position: "relative",
          width: SNAPSHOT_WIDTH,
          height: SNAPSHOT_HEIGHT,
          overflow: "hidden",
          backgroundColor: "#0a1628",
          fontFamily: "'General Sans', sans-serif",
          boxSizing: "border-box",
        }}
      >
        {/* Background template image */}
        <img
          src={templateImage}
          alt={`${archetype} card template`}
          crossOrigin="anonymous"
          width={SNAPSHOT_WIDTH}
          height={SNAPSHOT_HEIGHT}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: SNAPSHOT_WIDTH,
            height: SNAPSHOT_HEIGHT,
            objectFit: "cover",
          }}
        />

        {/* Overall PnL value - top right */}
        <div
          style={{
            position: "absolute",
            top: 102,
            right: 45,
            height: 22,
            display: "flex",
            alignItems: "center",
            fontFamily: "'General Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: stats.pnlPositive ? "#22c55e" : "#ef4444",
              fontSize: 22,
              fontWeight: 600,
              lineHeight: 1,
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {stats.pnlPositive ? "+" : ""}
            {stats.overallPnL}
          </span>
        </div>

        {/* Biggest profit value */}
        <div
          style={{
            position: "absolute",
            top: 269,
            left: 360,
            height: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'General Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: "#22c55e",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1,
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {stats.biggestProfit !== "No data" && "+"}
            {stats.biggestProfit}
          </span>

          {stats.biggestProfitToken && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <img
                src={stats.biggestProfitToken.logo || defaultTokenImage}
                alt={stats.biggestProfitToken.symbol || "token"}
                crossOrigin="anonymous"
                width={16}
                height={16}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              {stats.biggestProfitToken.symbol && (
                <span
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1,
                    fontFamily: "'General Sans', sans-serif",
                  }}
                >
                  {stats.biggestProfitToken.symbol}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Biggest loss value */}
        <div
          style={{
            position: "absolute",
            top: 269,
            left: 562,
            height: 20,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "'General Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: "#ef4444",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: 1,
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {stats.biggestLoss}
          </span>

          {stats.biggestLossToken && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              <img
                src={stats.biggestLossToken.logo || defaultTokenImage}
                alt={stats.biggestLossToken.symbol || "token"}
                crossOrigin="anonymous"
                width={16}
                height={16}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: 8,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              {stats.biggestLossToken.symbol && (
                <span
                  style={{
                    color: "#9CA3AF",
                    fontSize: 13,
                    fontWeight: 500,
                    lineHeight: 1,
                    fontFamily: "'General Sans', sans-serif",
                  }}
                >
                  {stats.biggestLossToken.symbol}
                </span>
              )}
            </span>
          )}
        </div>

        {/* Win rate value */}
        <div
          style={{
            position: "absolute",
            top: 340,
            left: 360,
            whiteSpace: "nowrap",
            fontFamily: "'General Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: "20px",
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {stats.winRate}
          </span>
        </div>

        {/* Trading volume value */}
        <div
          style={{
            position: "absolute",
            top: 340,
            left: 562,
            whiteSpace: "nowrap",
            fontFamily: "'General Sans', sans-serif",
          }}
        >
          <span
            style={{
              color: "#ffffff",
              fontSize: 20,
              fontWeight: 500,
              lineHeight: "20px",
              fontFamily: "'General Sans', sans-serif",
            }}
          >
            {stats.totalVolume}
          </span>
        </div>

        {/* Twitter handle - bottom right */}
        {stats.twitterHandle && (
          <>
            <img
              src={xLogo}
              alt="X"
              crossOrigin="anonymous"
              width={16}
              height={16}
              style={{
                position: "absolute",
                bottom: 19,
                right: 412,
                width: 16,
                height: 16,
              }}
            />
            <span
              style={{
                position: "absolute",
                bottom: 20,
                right: 312,
                color: "#60a5fa",
                fontSize: 14.4,
                fontWeight: 500,
                lineHeight: "14.4px",
                fontFamily: "'General Sans', sans-serif",
                whiteSpace: "nowrap",
              }}
            >
              @{stats.twitterHandle.replace(/^@/, "")}
            </span>
          </>
        )}

        {/* Wallet address - bottom right */}
        <span
          style={{
            position: "absolute",
            bottom: 19,
            right: 42,
            color: "#60a5fa",
            fontSize: 14.4,
            fontWeight: 500,
            lineHeight: "14.4px",
            fontFamily: "'General Sans', sans-serif",
            whiteSpace: "nowrap",
          }}
        >
          {formatAddress(stats.address, stats.addressCount)}
        </span>
      </div>
    );
  }
);

WrapCardSnapshot.displayName = "WrapCardSnapshot";

export default WrapCardSnapshot;
export { SNAPSHOT_WIDTH, SNAPSHOT_HEIGHT };

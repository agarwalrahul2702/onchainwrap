import { useEffect, useState } from "react";

const loadingMessages = [
  "Scanning your onchain history...",
  "Calculating your trading volume...",
  "Analyzing your wins and losses...",
  "Finding your biggest trades...",
  "Generating your personality...",
  "Almost there...",
];

const LoaderScreen = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[280px] sm:min-h-[350px] lg:min-h-[400px] space-y-6 sm:space-y-8 animate-fade-in px-4">
      {/* Animated loader */}
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24">
        <div className="absolute inset-0 rounded-full border-[3px] sm:border-4 border-muted" />
        <div
          className="absolute inset-0 rounded-full border-[3px] sm:border-4 border-transparent border-t-primary animate-spin"
          style={{ animationDuration: "1s" }}
        />
        <div
          className="absolute inset-1.5 sm:inset-2 rounded-full border-[3px] sm:border-4 border-transparent border-t-accent animate-spin"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-1.5 sm:space-y-2">
        <p className="text-foreground font-display text-sm sm:text-base lg:text-lg animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
        <p className="text-muted-foreground text-xs sm:text-sm">
          This may take a few seconds
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 sm:gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoaderScreen;

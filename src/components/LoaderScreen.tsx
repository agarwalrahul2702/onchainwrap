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
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8 animate-fade-in">
      {/* Animated loader */}
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 rounded-full border-4 border-muted" />
        <div 
          className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin"
          style={{ animationDuration: "1s" }}
        />
        <div 
          className="absolute inset-2 rounded-full border-4 border-transparent border-t-accent animate-spin"
          style={{ animationDuration: "1.5s", animationDirection: "reverse" }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse" />
        </div>
      </div>

      {/* Loading message */}
      <div className="text-center space-y-2">
        <p className="text-foreground font-display text-lg animate-pulse">
          {loadingMessages[messageIndex]}
        </p>
        <p className="text-muted-foreground text-sm">
          This may take a few seconds
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary animate-pulse"
            style={{ animationDelay: `${i * 0.2}s` }}
          />
        ))}
      </div>
    </div>
  );
};

export default LoaderScreen;

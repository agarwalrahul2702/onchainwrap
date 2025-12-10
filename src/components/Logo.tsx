const Logo = () => {
  return (
    <a
      href="https://0xppl.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      {/* 0xPPL Logo Icon */}
      <div className="flex flex-col gap-0.5">
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
          <div className="w-3 h-3 bg-[#EC4899]" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
        </div>
        <div className="flex gap-0.5">
          <div className="w-3 h-3 rounded-full border-2 border-[#3B82F6] bg-transparent" />
          <div className="w-3 h-3 rounded-full bg-[#3B82F6]" />
        </div>
      </div>
      {/* Text */}
      <div className="flex flex-col leading-tight">
        <span className="text-foreground text-sm font-medium">Your onchain</span>
        <span className="text-foreground text-sm font-medium">superapp</span>
      </div>
    </a>
  );
};

export default Logo;

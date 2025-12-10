import logoSvg from "@/assets/logo-0xppl.svg";

const Logo = () => {
  return (
    <a
      href="https://0xppl.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <img src={logoSvg} alt="0xPPL Logo" className="w-10 h-10" />
      <div className="flex flex-col leading-tight">
        <span className="text-foreground text-sm font-medium">Your onchain</span>
        <span className="text-foreground text-sm font-medium">superapp</span>
      </div>
    </a>
  );
};

export default Logo;

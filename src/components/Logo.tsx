import logoSvg from "@/assets/logo-0xppl.svg";

const Logo = () => {
  return (
    <a
      href="https://0xppl.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
    >
      <img src={logoSvg} alt="0xPPL Logo" className="h-14 w-14 object-contain" />
      <div className="flex flex-col items-center leading-tight text-center">
        <span className="text-foreground font-sans text-lg font-medium">Your onchain</span>
        <span className="text-foreground font-sans text-lg font-medium">superapp</span>
      </div>
    </a>
  );
};

export default Logo;
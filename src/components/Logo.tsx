import logoSvg from "@/assets/logo-0xppl.svg";
import santaHat from "@/assets/santa-hat.png";

const Logo = () => {
  return (
    <a 
      href="https://0xppl.com/" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity text-center"
    >
      <div className="relative">
        <img 
          src={santaHat} 
          alt="Santa Hat" 
          className="absolute -top-8 -left-3 h-12 w-12 object-contain z-10 -rotate-12" 
        />
        <img src={logoSvg} alt="0xPPL Logo" className="h-14 w-14 object-contain" />
      </div>
      <span className="text-foreground font-sans text-lg font-medium">Your onchain superapp</span>
    </a>
  );
};

export default Logo;

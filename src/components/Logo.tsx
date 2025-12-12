import logoSvg from "@/assets/logo-0xppl.svg";
import santaHat from "@/assets/santa-hat.png";

const Logo = () => {
  return (
    <a
      href="https://0xppl.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1 sm:gap-1.5 hover:opacity-80 transition-opacity text-center"
    >
      <div className="relative">
        <img
          src={santaHat}
          alt="Santa Hat"
          className="absolute -top-[45px] sm:-top-[52px] lg:-top-[57.5px] -left-[8px] sm:-left-[10px] h-[85px] w-[85px] sm:h-[100px] sm:w-[100px] lg:h-[109px] lg:w-[109px] object-contain z-10 rotate-[25deg]"
        />
        <img src={logoSvg} alt="0xPPL Logo" className="h-11 w-11 sm:h-12 sm:w-12 lg:h-14 lg:w-14 object-contain" />
      </div>
      <span className="text-foreground font-sans text-sm sm:text-base lg:text-lg font-medium">Your onchain superapp</span>
    </a>
  );
};

export default Logo;

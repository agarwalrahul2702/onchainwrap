import logoSvg from "@/assets/logo-0xppl.svg";
const Logo = () => {
  return <a href="https://0xppl.com/" target="_blank" rel="noopener noreferrer" style={{
    width: '190px',
    height: '58px'
  }} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity text-lg">
      <img src={logoSvg} alt="0xPPL Logo" className="h-12 w-12 object-contain" />
      <div className="flex flex-col leading-tight">
        <span className="text-foreground font-sans text-sm font-medium">Your onchain</span>
        <span className="text-foreground font-sans text-sm font-medium">superapp</span>
      </div>
    </a>;
};
export default Logo;
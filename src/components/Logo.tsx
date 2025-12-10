interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <a 
      href="https://0xppl.com/" 
      target="_blank" 
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 transition-opacity hover:opacity-80 ${className}`}
    >
      <div className="flex items-center gap-1">
        <span className="font-display text-2xl font-bold text-foreground">0x</span>
        <span className="font-display text-2xl font-bold gradient-text">PPL</span>
      </div>
    </a>
  );
};

export default Logo;

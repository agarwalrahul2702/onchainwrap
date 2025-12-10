import { useState } from "react";
import { ClipboardList, Sparkles } from "lucide-react";
interface AddressInputProps {
  onGenerate: (address: string) => void;
  isLoading: boolean;
}
const AddressInput = ({
  onGenerate,
  isLoading
}: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const isValidEVMAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text);
      setError("");
    } catch (err) {
      console.error("Failed to read clipboard");
    }
  };
  const handleSubmit = () => {
    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }
    if (!isValidEVMAddress(address.trim())) {
      setError("Please enter a valid EVM address");
      return;
    }
    setError("");
    onGenerate(address.trim());
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };
  return <div className="space-y-[1.2vh] mx-0 w-full my-[31px]">
      {/* Input field */}
      <div className="relative">
        <div className="absolute left-[1vw] top-1/2 -translate-y-1/2 text-muted-foreground">
          <ClipboardList className="w-[1.2vw] h-[1.2vw]" />
        </div>
        <input type="text" value={address} onChange={e => {
        setAddress(e.target.value);
        setError("");
      }} onKeyDown={handleKeyDown} onClick={handlePaste} placeholder="Paste any EVM wallet address" className="w-full bg-[#1a1d2e] border border-border/30 rounded-lg pl-[2.5vw] pr-[1vw] py-[1.2vh] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all font-mono text-[0.9vw]" disabled={isLoading} />
      </div>

      {/* Error message */}
      {error && <p className="text-destructive text-[0.85vw] text-center">{error}</p>}

      {/* Generate button */}
      <button onClick={handleSubmit} disabled={isLoading} className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-[1.2vh] px-[1.5vw] rounded-lg transition-all duration-200 flex items-center justify-center gap-[0.5vw] disabled:opacity-50 disabled:cursor-not-allowed text-[1vw] my-[15px]">
        <Sparkles className="w-[1.2vw] h-[1.2vw]" />
        {isLoading ? "Generating..." : "Generate Wrap"}
      </button>

      {/* Footer text */}
      <p className="text-muted-foreground text-[0.85vw] text-center mt-[2vh] mb-[1vh] px-0">
        Works with all EVM wallets · No login needed
      </p>
    </div>;
};
export default AddressInput;
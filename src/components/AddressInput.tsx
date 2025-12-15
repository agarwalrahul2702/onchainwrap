import { useState } from "react";
import { ClipboardList, Sparkles, X, Twitter } from "lucide-react";
interface AddressInputProps {
  onGenerate: (addresses: string[], twitterHandle?: string) => void;
  isLoading: boolean;
}
const AddressInput = ({
  onGenerate,
  isLoading
}: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const isValidEVMAddress = (addr: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(addr);
  };
  const isValidSolanaAddress = (addr: string): boolean => {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(addr);
  };
  const isValidAddress = (addr: string): boolean => {
    return isValidEVMAddress(addr) || isValidSolanaAddress(addr);
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
  const handleAddAddress = () => {
    const trimmedAddress = address.trim();
    if (!trimmedAddress) {
      setError("Please enter an address");
      return;
    }
    if (!isValidAddress(trimmedAddress)) {
      setError("Please enter a valid EVM or Solana address");
      return;
    }
    if (addresses.includes(trimmedAddress)) {
      setError("Address already added");
      return;
    }
    setAddresses([...addresses, trimmedAddress]);
    setAddress("");
    setError("");
  };
  const handleRemoveAddress = (addressToRemove: string) => {
    setAddresses(addresses.filter(a => a !== addressToRemove));
  };
  const handleSubmit = () => {
    let allAddresses = [...addresses];

    // If there's text in the input, try to add it
    if (address.trim()) {
      const trimmedAddress = address.trim();
      if (!isValidAddress(trimmedAddress)) {
        setError("Please enter a valid EVM or Solana address");
        return;
      }
      if (!allAddresses.includes(trimmedAddress)) {
        allAddresses.push(trimmedAddress);
      }
    }
    if (allAddresses.length === 0) {
      setError("Please add at least one address");
      return;
    }
    console.log("Submitting addresses:", allAddresses);
    onGenerate(allAddresses, twitterHandle.trim() || undefined);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAddress();
    }
  };
  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };
  return <div className="space-y-2 sm:space-y-3 lg:space-y-[1.2vh] mx-0 w-full my-3 sm:my-4 lg:my-[31px] mb-3 sm:mb-4 lg:mb-[30px] px-1 sm:px-2 lg:px-0">
      {/* Added addresses chips */}
      {addresses.length > 0 && <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center mb-2 px-2 sm:px-0">
          {addresses.map(addr => <div key={addr} className="flex items-center gap-1 bg-[#3B82F6]/20 border border-[#3B82F6]/40 rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs lg:text-[0.8vw] font-mono text-foreground">
              <span>{truncateAddress(addr)}</span>
              <button onClick={() => handleRemoveAddress(addr)} className="hover:text-destructive transition-colors" disabled={isLoading}>
                <X className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-[0.9vw] lg:h-[0.9vw]" />
              </button>
            </div>)}
        </div>}

      {/* Input field */}
      <div className="relative mx-2 sm:mx-[20px]">
        <div className="absolute left-2.5 sm:left-3 lg:left-[1vw] top-1/2 -translate-y-[calc(50%-4px)] text-muted-foreground">
          <ClipboardList className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[1.2vw] lg:h-[1.2vw]" />
        </div>
        <input type="text" value={address} onChange={e => {
        setAddress(e.target.value);
        setError("");
      }} onKeyDown={handleKeyDown} placeholder={addresses.length > 0 ? "Add another wallet" : "Paste your EVM or Sol address here"} disabled={isLoading} className="w-full bg-[#1a1d2e] border border-border/30 rounded-lg pl-8 sm:pl-10 lg:pl-[2.5vw] pr-2 sm:pr-3 lg:pr-[1vw] py-2.5 sm:py-3 lg:py-[1.2vh] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all font-mono text-[11px] sm:text-xs lg:text-[0.9vw] mt-1.5 sm:mt-2 lg:mt-[10px] mb-0" />
      </div>

      {/* Error message */}
      {error && <p className="text-destructive text-[10px] sm:text-xs lg:text-[0.85vw] text-center px-2">{error}</p>}


      {/* Buttons row */}
      <div className="flex flex-col lg:flex-row gap-2 mt-[3px] mb-0">
        {/* Add button - only show if there's input */}
        {address.trim() && <button onClick={handleAddAddress} disabled={isLoading} className="border border-[#3b82f6] text-[#60a5fa] hover:bg-[#1d4ed8]/20 font-medium py-2.5 sm:py-3 lg:py-[1.2vh] px-3 sm:px-4 lg:px-[1.5vw] rounded-lg transition-colors text-xs sm:text-sm lg:text-[1vw] whitespace-nowrap mx-2 sm:mx-0 sm:ml-[20px]">
            + Add more wallets
          </button>}

        {/* Generate button */}
        <button onClick={handleSubmit} disabled={isLoading} className="flex-1 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-2.5 sm:py-3 lg:py-[1.2vh] px-3 sm:px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 sm:gap-2 lg:gap-[0.5vw] disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm lg:text-[1vw] mx-2 sm:mx-[20px]">
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-[1.2vw] lg:h-[1.2vw]" />
          {isLoading ? "Generating..." : (() => {
          const inputValid = address.trim() && isValidAddress(address.trim()) && !addresses.includes(address.trim());
          const totalCount = addresses.length + (inputValid ? 1 : 0);
          return `Generate Wrap${totalCount > 1 ? ` (${totalCount})` : ""}`;
        })()}
        </button>
      </div>

      {/* Footer text */}

    </div>;
};
export default AddressInput;
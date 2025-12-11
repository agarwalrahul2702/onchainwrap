import { useState } from "react";
import { ClipboardList, Sparkles, X } from "lucide-react";

interface AddressInputProps {
  onGenerate: (addresses: string[]) => void;
  isLoading: boolean;
}

const AddressInput = ({
  onGenerate,
  isLoading
}: AddressInputProps) => {
  const [address, setAddress] = useState("");
  const [addresses, setAddresses] = useState<string[]>([]);
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

  const handleAddAddress = () => {
    const trimmedAddress = address.trim();
    
    if (!trimmedAddress) {
      setError("Please enter an address");
      return;
    }
    
    if (!isValidEVMAddress(trimmedAddress)) {
      setError("Please enter a valid EVM address");
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
    if (addresses.length === 0) {
      // If no addresses added yet, try to add the current input
      if (address.trim()) {
        const trimmedAddress = address.trim();
        if (!isValidEVMAddress(trimmedAddress)) {
          setError("Please enter a valid EVM address");
          return;
        }
        onGenerate([trimmedAddress]);
      } else {
        setError("Please add at least one address");
      }
      return;
    }
    
    onGenerate(addresses);
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

  return (
    <div className="space-y-[1.2vh] mx-0 w-full my-[31px] mb-[30px]">
      {/* Added addresses chips */}
      {addresses.length > 0 && (
        <div className="flex flex-wrap gap-2 justify-center mb-2">
          {addresses.map((addr) => (
            <div
              key={addr}
              className="flex items-center gap-1 bg-[#3B82F6]/20 border border-[#3B82F6]/40 rounded-full px-3 py-1 text-[0.8vw] font-mono text-foreground"
            >
              <span>{truncateAddress(addr)}</span>
              <button
                onClick={() => handleRemoveAddress(addr)}
                className="hover:text-destructive transition-colors"
                disabled={isLoading}
              >
                <X className="w-[0.9vw] h-[0.9vw]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input field */}
      <div className="relative">
        <div className="absolute left-[1vw] top-1/2 -translate-y-1/2 text-muted-foreground">
          <ClipboardList className="w-[1.2vw] h-[1.2vw]" />
        </div>
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          onClick={handlePaste}
          placeholder={addresses.length > 0 ? "Add another wallet address" : "Paste any EVM wallet address"}
          className="w-full bg-[#1a1d2e] border border-border/30 rounded-lg pl-[2.5vw] pr-[1vw] py-[1.2vh] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#3B82F6]/30 transition-all font-mono text-[0.9vw]"
          disabled={isLoading}
        />
      </div>

      {/* Add button - only show if there's input */}
      {address.trim() && (
        <button
          onClick={handleAddAddress}
          disabled={isLoading}
          className="w-full bg-[#1a1d2e] hover:bg-[#252a3d] text-muted-foreground hover:text-foreground font-medium py-[0.8vh] px-[1.5vw] rounded-lg transition-all duration-200 border border-border/30 text-[0.9vw]"
        >
          + Add Address
        </button>
      )}

      {/* Error message */}
      {error && <p className="text-destructive text-[0.85vw] text-center">{error}</p>}

      {/* Generate button */}
      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#3B82F6] hover:bg-[#2563EB] text-white font-semibold py-[1.2vh] px-[1.5vw] rounded-lg transition-all duration-200 flex items-center justify-center gap-[0.5vw] disabled:opacity-50 disabled:cursor-not-allowed text-[1vw] my-[15px] mb-0"
      >
        <Sparkles className="w-[1.2vw] h-[1.2vw]" />
        {isLoading ? "Generating..." : `Generate Wrap${addresses.length > 1 ? ` (${addresses.length} wallets)` : ""}`}
      </button>

      {/* Footer text */}
      <p className="text-muted-foreground text-[0.85vw] text-center mb-[1vh] px-0 mt-[20px]">
        Works with all EVM wallets · No login needed
      </p>
    </div>
  );
};

export default AddressInput;

import { useState } from "react";
import { Clipboard, AlertCircle } from "lucide-react";

interface AddressInputProps {
  onGenerate: (address: string) => void;
  isLoading: boolean;
}

const AddressInput = ({ onGenerate, isLoading }: AddressInputProps) => {
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
      setError("Please enter your wallet address");
      return;
    }
    
    if (!isValidEVMAddress(address.trim())) {
      setError("Invalid EVM address. Must be 0x followed by 40 hex characters");
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

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
      <div className="relative">
        <input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste your EVM address"
          className="input-glass w-full pr-12 font-mono text-sm"
          disabled={isLoading}
        />
        <button
          onClick={handlePaste}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
          title="Paste from clipboard"
        >
          <Clipboard size={18} />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm animate-fade-in">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className="btn-primary w-full py-4 rounded-xl text-primary-foreground font-display text-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Generating..." : "Generate Wrap"}
      </button>
    </div>
  );
};

export default AddressInput;

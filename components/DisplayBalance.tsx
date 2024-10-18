import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { formatAmount } from "@/lib/utils";

interface DisplayTokenBalanceProps {
  label: string;
  balance: number;
  showButtons?: boolean;
  setUserInput?: Dispatch<SetStateAction<string>>;
}

export const DisplayTokenBalance: React.FC<DisplayTokenBalanceProps> = ({
  label,
  balance,
  showButtons = false,
  setUserInput: setUserInput,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div className="text-white text-sm">{label}</div>
      <div className="text-grey text-sm items-center flex gap-2">
        Balance: {formatAmount(balance)}
        {showButtons && balance > 0 && (
          <>
            <Button
              onClick={() =>
                setUserInput && setUserInput((balance / 2).toString())
              }
              className="bg-black-1 border-green text-green hover:bg-green w-14 h-6"
              variant="outline"
            >
              HALF
            </Button>
            <Button
              onClick={() => setUserInput && setUserInput(balance.toString())}
              className="w-14 h-6 bg-black-1 border-green text-green hover:bg-green"
              variant="outline"
            >
              MAX
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

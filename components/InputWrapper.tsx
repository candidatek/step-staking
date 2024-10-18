import { Dispatch, FC, SetStateAction, useEffect, useMemo } from "react";
import Image from "next/image";
import xStepLogo from "../app/public/xstep.svg";
import StepLogo from "../app/public/step.png";
import { useStepTokenPrice } from "@/app/hooks/useStepTokenPrice";
import { useStepPerXStep } from "@/app/hooks/useStepPerXStep";
import { formatToDollar, handleDecimalInput } from "@/lib/utils";

interface InputWrapperProps {
  token: "STEP" | "xSTEP";
  userInput?: string;
  setUserInput: Dispatch<SetStateAction<string>>;
  activeTab: string;
}

enum Token {
  STEP = "STEP",
  xSTEP = "xSTEP",
}

export const InputWrapper: FC<InputWrapperProps> = ({
  token,
  userInput,
  setUserInput
}) => {
  const logo = token === Token.STEP ? StepLogo : xStepLogo;
  const logoWidth = token === Token.STEP ? 30 : 30;
  const logoMargin = token === Token.STEP ? "mr-1.5" : "mr-2";
  const { data: stepPriceUSD } = useStepTokenPrice();
  const {data: stepPerXStep} = useStepPerXStep();
  
  const stepPriceInUSD = useMemo(
    () => {
      if (token === Token.STEP) {
        return stepPriceUSD! * Number(userInput)
      } else {
        return Number(userInput) * Number(stepPerXStep?.stepPerXstep)! * stepPriceUSD!
      }
    },
    [userInput, stepPriceUSD]
  );

  const {data} = useStepPerXStep();
  const {stepPerXstep} = data??{stepPerXstep:0};

  const receiveLPTokens = useMemo(() => {
    if(token === Token.STEP ){
      return Number(userInput ?? 0) * Number(stepPerXstep)
    }else { 
      return Number(userInput ?? 0) / Number(stepPerXstep)
    }

  },[token, userInput, stepPerXstep])

  useEffect(() => {
    setUserInput((receiveLPTokens) > 0 ? receiveLPTokens.toFixed(2) : '')
  },[])
  
  return (
    <div key={token} className="w-full p-2 bg-black rounded-lg mt-4 flex justify-between">
      <div className="flex items-center">
        <Image
          src={logo}
          width={logoWidth}
          height={logoWidth}
          alt={token}
          className={logoMargin}
        />
        <div className="text-white text-sm font-bold">{token}</div>
      </div>
      <input
        value={userInput ?? ""}
        onChange={(e) => handleDecimalInput(e.target.value, setUserInput)}
        type="text"
        maxLength={10}
        placeholder="0.00"
        className={
          "rounded-sm focus:outline-none bg-black text-md font-bold !font-mono h-[48px] placeholder:text-liteGrey text-right"
        }
      />
      <div className="absolute ml-[275px] sm:right-9 mt-8 text-sm text-grey w-[120px] h-8 text-right">
        {stepPriceUSD && userInput && parseFloat(userInput) > 0 && (
          <div>{`$${stepPriceInUSD && formatToDollar(stepPriceInUSD)}`}</div>
        )}
      </div>
    </div>
  );
};

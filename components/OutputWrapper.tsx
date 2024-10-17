import { FC, useMemo } from "react";
import Image from "next/image";
import xStepLogo from "../app/public/xstep.svg";
import StepLogo from "../app/public/step.png";
import { useStepPerXStep } from "@/app/hooks/useStepPerXStep";

export const OutputWrapper: FC<{ token: "STEP" | "xSTEP", userInput: string }> = ({ token, userInput }) => {
  const logo = token === "STEP" ? StepLogo : xStepLogo;
  const logoWidth = token === "STEP" ? 30 : 30;
  const logoMargin = token === "STEP" ? "mr-1.5 ml-2" : "mr-2 ml-2";
  const {data} = useStepPerXStep();
  const {stepPerXstep} = data??{stepPerXstep:0};
  const receiveLPTokens = useMemo(() => {
    if(token === "STEP" ){
      return Number(userInput) * Number(stepPerXstep)
    }else { 
      return Number(userInput) / Number(stepPerXstep)
    }

  },[token, userInput, stepPerXstep])

  return (
    <>
      <div className="flex items-center pt-4 w-full  justify-between pr-2">
        <div className="flex items-center justify-between mt-2">
          <Image
            src={logo}
            width={logoWidth}
            height={logoWidth}
            alt={token}
            className={logoMargin}
          />
          <div className="text-white text-sm font-bold">{token}</div>
        </div>
        <div className="rounded-sm text-md font-bold !font-mono  placeholder:text-liteGrey text-right">
          {receiveLPTokens.toFixed(2)}
        </div>
      </div>
      <div className="w-full p-2 bg-black-1 rounded-lg  z-[100] h-[64px] flex justify-between border border-liteGrey mt-[-50px] opacity-15" />
    </>
  );
};

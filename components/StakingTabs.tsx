import React, {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { useStepAndXStepBalances } from "../app/hooks/useTokens";
import { useExecuteTransaction } from "../app/hooks/useExecuteTransaction";
import { DisplayTokenBalance } from "./DisplayBalance";
import { InputWrapper } from "./InputWrapper";
import { OutputWrapper } from "./OutputWrapper";

export enum Tab {
  Stake = "stake",
  Unstake = "unstake",
}
const ACTIVE_TAB_CLASSES = "!text-green !bg-black-1";
const INACTIVE_TAB_CLASSES = "!text-white";
const TAB_BASE_CLASSES =
  "w-[150px] h-11 duration-500 font-extrabold !bg-black-2 !rounded-t-lg !rounded-b-none hover:!text-green";

const StakingTabs = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Stake);
  const [userInput, setUserInput] = useState<string>("");

  return (
    <>
      <Tabs
        defaultValue={activeTab}
        className="w-[40vw] max-w-[450px] min-w-[400px] mt-4"
      >
        <TabsList className="!p-0 !m-0 h-11 bg-black">
          <TabsTrigger
            onClick={() => setActiveTab(Tab.Stake)}
            className={`${TAB_BASE_CLASSES} ${
              activeTab === Tab.Stake
                ? ACTIVE_TAB_CLASSES
                : INACTIVE_TAB_CLASSES
            }`}
            value={Tab.Stake}
          >
            <ArrowDownToLine size={16} className="mr-1" />
            Stake
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setActiveTab(Tab.Unstake)}
            className={`${TAB_BASE_CLASSES} ${
              activeTab === Tab.Unstake
                ? ACTIVE_TAB_CLASSES
                : INACTIVE_TAB_CLASSES
            }`}
            value={Tab.Unstake}
          >
            <ArrowUpFromLine size={16} className="mr-1" />
            Unstake
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="text-white max-h-[300px] rounded-lg !rounded-ss-none bg-black-1 !mt-0 p-5"
          value={Tab.Stake}
        >
          <StakeTab userInput={userInput} setUserInput={setUserInput} />
        </TabsContent>
        <TabsContent
          className="text-white max-h-[300px] bg-black-1 !mt-0 p-5 !rounded-ss-none rounded-lg"
          value={Tab.Unstake}
        >
          <UnstakeTab userInput={userInput} setUserInput={setUserInput} />
        </TabsContent>
      </Tabs>
      <PerformOperationButton activeTab={activeTab} userInput={userInput} />
    </>
  );
};


const UnstakeTab: FC<{
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
}> = ({ userInput, setUserInput }): JSX.Element => {
  const { data } = useStepAndXStepBalances();
  const { stepTokenBalance, xStepTokenBalance } = data ?? {
    stepTokenBalance: 0,
    xStepTokenBalance: 0,
  };
  return (
    <div className="h-full">
      <DisplayTokenBalance
        label="You stake"
        balance={xStepTokenBalance ?? 0}
        showButtons={true}
        setUserInput={setUserInput}
      />
      <InputWrapper
        token="xSTEP"
        activeTab={Tab.Unstake}
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <ArrowDown
        size={36}
        color="rgb(255,187,29)"
        className="flex justify-center items-center mt-2 w-full"
      />
      <DisplayTokenBalance
        label="You receive"
        balance={stepTokenBalance ?? 0}
      />
      <OutputWrapper token="STEP" userInput={userInput}/>
    </div>
  );
};

const StakeTab: FC<{
  userInput: string;
  setUserInput: Dispatch<SetStateAction<string>>;
}> = ({ userInput, setUserInput }): JSX.Element => {
  const { data } = useStepAndXStepBalances();
  const { stepTokenBalance, xStepTokenBalance } = data ?? {
    stepTokenBalance: 0,
    xStepTokenBalance: 0,
  };

  return (
    <div className="h-full">
      <DisplayTokenBalance
        label="You stake"
        balance={stepTokenBalance}
        showButtons={true}
        setUserInput={setUserInput}
      />
      <InputWrapper
        activeTab={Tab.Stake}
        token="STEP"
        userInput={userInput}
        setUserInput={setUserInput}
      />
      <ArrowDown
        size={36}
        color="rgb(255,187,29)"
        className="flex justify-center items-center mt-2 w-full"
      />
      <DisplayTokenBalance label="You receive" balance={xStepTokenBalance} />
      <OutputWrapper token="xSTEP" userInput={userInput} />
    </div>
  );
};

const PerformOperationButton: FC<{ activeTab: string; userInput: string }> = ({
    activeTab,
    userInput,
  }) => {
    const { data } = useStepAndXStepBalances();
    const { stepTokenBalance, xStepTokenBalance } = data ?? {
      stepTokenBalance: 0,
      xStepTokenBalance: 0,
    };
    const { initiateStakeTransaction, initiateUnstakeTransaction, isLoading } =
      useExecuteTransaction();
  
    const maxStakeBalance = useMemo(() => {
      if (activeTab === "stake") {
        return stepTokenBalance;
      }
      return xStepTokenBalance;
    }, [activeTab, data?.stepTokenBalance, data?.xStepTokenBalance]);
  
    const handleButtonClick = useCallback(() => {
      if (activeTab === "stake") {
        initiateStakeTransaction(parseFloat(userInput));
      } else {
        initiateUnstakeTransaction(parseFloat(userInput));
      }
    }, [
      activeTab,
      userInput,
      initiateStakeTransaction,
      initiateUnstakeTransaction,
    ]);
  
    const userInputAmt = useMemo(() => parseFloat(userInput), [userInput]);
  
    const displayStr: string = useMemo(() => {
      if (isLoading) return "Loading...";
      if (activeTab === "stake") {
        if (userInputAmt > stepTokenBalance) return "Insufficient STEP balance";
        if (userInputAmt === 0) return "Enter an amount";
        return "Stake ";
      } else {
        if (userInputAmt > xStepTokenBalance) return "Insufficient xSTEP balance";
        if (userInputAmt === 0) return "Enter an amount";
        return "Unstake ";
      }
    }, [
      userInput,
      stepTokenBalance,
      xStepTokenBalance,
      activeTab,
      isLoading,
      userInputAmt,
    ]);
  
    return (
      <div className="w-[40vw] max-w-[450px] min-w-[400px] bg-none mt-4">
        <Button
          onClick={handleButtonClick}
          disabled={
            userInputAmt === 0 || userInputAmt > maxStakeBalance || isLoading
          }
          className="bg-black-1 border-green duration-500 w-full disabled:text-gray
              text-green text-md font-bold hover:bg-green h-12 mb-10"
          variant="outline"
        >
          {displayStr}
        </Button>
      </div>
    );
  };
export default StakingTabs;
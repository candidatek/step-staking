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

export enum TokenActions {
  Stake = "stake",
  Unstake = "unstake",
}
const ACTIVE_TAB_CLASSES = "!text-green !bg-black-1";
const INACTIVE_TAB_CLASSES = "!text-white";
const TAB_BASE_CLASSES =
  "w-[150px] h-11 duration-500 font-extrabold !bg-black-2 !rounded-t-lg !rounded-b-none hover:!text-green";

const StakingTabs = () => {
  const [activeTab, setActiveTab] = useState<TokenActions>(TokenActions.Stake);
  const [userInput, setUserInput] = useState<string>("");

  return (
    <>
      <Tabs
        defaultValue={activeTab}
        className="w-[450px] sm:w-[96vw] mt-4"
      >
        <TabsList className="!p-0 !m-0 h-11 bg-black">
          <TabsTrigger
            onClick={() => setActiveTab(TokenActions.Stake)}
            className={`${TAB_BASE_CLASSES} ${activeTab === TokenActions.Stake
                ? ACTIVE_TAB_CLASSES
                : INACTIVE_TAB_CLASSES
              }`}
            value={TokenActions.Stake}
          >
            <ArrowDownToLine size={16} className="mr-1" />
            Stake
          </TabsTrigger>
          <TabsTrigger
            onClick={() => setActiveTab(TokenActions.Unstake)}
            className={`${TAB_BASE_CLASSES} ${activeTab === TokenActions.Unstake
                ? ACTIVE_TAB_CLASSES
                : INACTIVE_TAB_CLASSES
              }`}
            value={TokenActions.Unstake}
          >
            <ArrowUpFromLine size={16} className="mr-1" />
            Unstake
          </TabsTrigger>
        </TabsList>
        <TabsContent
          className="text-white max-h-[300px] rounded-lg !rounded-ss-none bg-black-1 !mt-0 p-5"
          value={TokenActions.Stake}
        >
          <StakeTab userInput={userInput} setUserInput={setUserInput} />
        </TabsContent>
        <TabsContent
          className="text-white max-h-[300px] bg-black-1 !mt-0 p-5 !rounded-ss-none rounded-lg"
          value={TokenActions.Unstake}
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
        balance={xStepTokenBalance ?? '0.00'}
        showButtons={true}
        setUserInput={setUserInput}
      />
      <InputWrapper
        token="xSTEP"
        activeTab={TokenActions.Unstake}
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
        balance={stepTokenBalance ?? '0.00'}
      />
      <OutputWrapper token="STEP" userInput={userInput} />
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
        activeTab={TokenActions.Stake}
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

  const isDisabled = useMemo(() => {
    return userInputAmt === 0 || userInputAmt > maxStakeBalance || isLoading || !userInput;
  }, [userInputAmt, maxStakeBalance, isLoading, userInput]);

  // Memoized class names based on the disabled state
  const buttonClass = useMemo(() => {
    return `w-full h-12 mb-10 duration-500 font-bold text-md border 
      ${isDisabled
        ? 'bg-black-1 border-gray-500 cursor-not-allowed text-gray-300 !pointer-events-auto'
        : 'bg-black-1 border-green text-green hover:bg-green !cursor-auto !pointer-events-auto'}`;
  }, [isDisabled]);


  const displayStr: string = useMemo(() => {
    if (isLoading) return "Loading...";
    if (activeTab === "stake") {
      if (userInputAmt > stepTokenBalance) return "Insufficient STEP balance";
      if (userInputAmt === 0 || !userInput) return "Enter an amount";
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
    <div className="sm:w-[96vw] w-[450px]  bg-none mt-4">
      <Button
        onClick={handleButtonClick}
        disabled={isDisabled}
        className={buttonClass}
        variant="outline"
      >
        {displayStr}
      </Button>
    </div>
  );
};
export default StakingTabs;

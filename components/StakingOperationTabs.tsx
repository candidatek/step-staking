import React, { Dispatch, FC, SetStateAction, useCallback, useMemo, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatAmount, handleDecimalInput } from '../app/utils/utils';
import { Button } from "@/components/ui/button"
import StepLogo from "../app/public/step.png"
import xStepLogo from "../app/public/xstep.svg"
import Image from 'next/image';
import { ArrowDown, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { useStepAndXStepBalances } from '../app/hooks/useTokens';
import { usePerformTransaction } from '../app/hooks/useStakeTransaction';


const StakingOperationTabs = () => {
    const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake')
    const [userInput, setUserInput] = useState<string>('');

    return (
        <div>
            <Tabs defaultValue={activeTab} className="w-[40vw] max-w-[450px] min-w-[400px] mt-4">
                <TabsList className='!p-0 !m-0 h-11 bg-black'>
                    <TabsTrigger
                        onClick={() => setActiveTab('stake')}
                        className={`w-[150px] h-11 duration-500 font-extrabold hover:!text-green	!rounded-t-lg !rounded-b-none bg-black-2 
                            ${activeTab === 'stake' ? '!text-green !bg-black-1'
                                : '!text-white'}`}
                        value="stake">
                        <ArrowDownToLine size={16} className='mr-1' />
                        Stake</TabsTrigger>
                    <TabsTrigger
                        onClick={() => setActiveTab('unstake')}
                        className={`w-[150px] h-11 duration-500 font-extrabold !bg-black-2 !rounded-t-lg !rounded-b-none hover:!text-green
                             ${activeTab === 'unstake' ? '!text-green !bg-black-1' : '!text-white'}`}
                        value="unstake">
                        <ArrowUpFromLine size={16} className='mr-1' />
                        Unstake</TabsTrigger>
                </TabsList>
                <TabsContent
                    className='text-white max-h-[300px] rounded-lg !rounded-ss-none bg-black-1 !mt-0 p-5'
                    value={'stake'}>
                    <StakeStepTab userInput={userInput} setUserInput={setUserInput} />
                </TabsContent>
                <TabsContent
                    className='text-white max-h-[300px] bg-black-1 !mt-0 p-5 !rounded-ss-none rounded-lg '
                    value={'unstake'}> <UnstakeStepTab userInput={userInput} setUserInput={setUserInput} /> </TabsContent>
            </Tabs>
            <PerformOperationButton activeTab={activeTab} userInput={userInput} />

        </div>
    );
}

const PerformOperationButton: FC<{ activeTab: string, userInput: string }> = ({ activeTab, userInput }) => {
    const { data } = useStepAndXStepBalances();
    const { stepTokenBalance, xStepTokenBalance } = data ?? { stepTokenBalance: 0, xStepTokenBalance: 0 };
    const { initiateStakeTransaction, initiateUnstakeTransaction, isLoading } = usePerformTransaction();

    const maxStakeBalance = useMemo(() => {
        if (activeTab === 'stake') {
            return stepTokenBalance;
        }
        return xStepTokenBalance;
    }, [activeTab, data?.stepTokenBalance, data?.xStepTokenBalance]);

    const handleButtonClick = useCallback(() => {
        if (activeTab === 'stake') {
            initiateStakeTransaction(parseFloat(userInput));
        }
        else {
            initiateUnstakeTransaction(parseFloat(userInput));
        }
    }, [activeTab, userInput, initiateStakeTransaction, initiateUnstakeTransaction]);

    const userInputAmt = useMemo(() => parseFloat(userInput), [userInput]);


    const displayStr: string = useMemo(() => {
        if (isLoading) return 'Loading...';
        if (activeTab === 'stake') {
            if (userInputAmt > stepTokenBalance) return 'Insufficient STEP balance'
            if (userInputAmt === 0) return 'Enter an amount'
            return 'Stake '
        }
        else {
            if (userInputAmt > xStepTokenBalance) return 'Insufficient xSTEP balance'
            if (userInputAmt === 0) return 'Enter an amount'
            return 'Unstake '
        }

    }, [userInput, stepTokenBalance, xStepTokenBalance, activeTab, isLoading, userInputAmt])

    return <div className='w-[40vw] max-w-[450px] min-w-[400px] bg-none mt-4'>
        <Button
            onClick={handleButtonClick}
            disabled={userInputAmt === 0 || userInputAmt > maxStakeBalance || isLoading}
            className="bg-black-1 border-green w-full disabled:text-gray
            text-green text-md font-bold hover:bg-green h-12 mb-10" variant="outline">{displayStr}</Button>

    </div>

}

const UnstakeStepTab: FC<{
    userInput: string,
    setUserInput: Dispatch<SetStateAction<string>>
}> = ({ userInput, setUserInput }): JSX.Element => {
    const { data } = useStepAndXStepBalances();
    return (
        <div className="h-full">
            <BalanceDisplay label="You stake" balance={data?.xStepTokenBalance ?? 0} showButtons={true} setUserInput={setUserInput} />
            <InputContainer token="xSTEP" userInput={userInput} setUserInput={setUserInput} />
            <ArrowDown size={36} color="rgb(255,187,29)" className="flex justify-center items-center mt-2 w-full" />
            <BalanceDisplay label="You receive" balance={data?.stepTokenBalance ?? 0} />
            <ReceiveBalanceContainer token="STEP" />

        </div>
    );
};

const StakeStepTab: FC<{
    userInput: string,
    setUserInput: Dispatch<SetStateAction<string>>
}> = ({ userInput, setUserInput }): JSX.Element => {
    // const { stepTokenBalance, xStepTokenBalance } = useTokenBalance();
    const { data } = useStepAndXStepBalances();
    const { stepTokenBalance, xStepTokenBalance } = data ?? { stepTokenBalance: 0, xStepTokenBalance: 0 };

    return (
        <div className="h-full">
            <BalanceDisplay label="You stake" balance={stepTokenBalance} showButtons={true} setUserInput={setUserInput} />
            <InputContainer token="STEP" userInput={userInput} setUserInput={setUserInput} />
            <ArrowDown size={36} color="rgb(255,187,29)" className="flex justify-center items-center mt-2 w-full" />
            <BalanceDisplay label="You receive" balance={xStepTokenBalance} />
            <ReceiveBalanceContainer token="xSTEP" />
        </div>
    );
};
const InputContainer: FC<InputContainerProps> = ({ token, userInput, setUserInput }) => {
    const logo = token === 'STEP' ? StepLogo : xStepLogo;
    const logoWidth = token === 'STEP' ? 32 : 28;
    const logoMargin = token === 'STEP' ? 'mr-1.5' : 'mr-2';

    return (
        <div className="w-full p-2 bg-black rounded-lg mt-4 flex justify-between">
            <div className="flex items-center">
                <Image src={logo} width={logoWidth} height={logoWidth} alt={token} className={logoMargin} />
                <div className="text-white text-sm font-bold">
                    {token}
                </div>
            </div>
            <input
                value={userInput ?? ''}
                onChange={(e) => handleDecimalInput(e.target.value, setUserInput)}
                type="text"
                placeholder="0.00"
                className="rounded-sm focus:outline-none bg-black text-md font-bold !font-mono h-[48px] placeholder:text-liteGrey text-right"
            />
        </div>
    );
};

interface BalanceDisplayProps {
    label: string;
    balance: number;
    showButtons?: boolean;
    setUserInput?: Dispatch<SetStateAction<string>>;
}

const BalanceDisplay: React.FC<BalanceDisplayProps> = ({ label, balance, showButtons = false, setUserInput: setUserInput }) => {
    return (
        <div className="flex justify-between items-center">
            <div className="text-white text-sm">{label}</div>
            <div className="text-grey text-sm items-center flex gap-2">
                Balance: {formatAmount(balance)}
                {showButtons && balance > 0 && (
                    <>
                        <Button
                            onClick={() => setUserInput && setUserInput((balance / 2).toString())}
                            className="bg-black-1 border-green text-green hover:bg-green w-14 h-6" variant="outline">HALF</Button>
                        <Button
                            onClick={() => setUserInput && setUserInput(balance.toString())}
                            className="w-14 h-6 bg-black-1 border-green text-green hover:bg-green" variant="outline">MAX</Button>
                    </>
                )}
            </div>
        </div>
    );
}

interface InputContainerProps {
    token: 'STEP' | 'xSTEP';
    userInput?: string;
    setUserInput: Dispatch<SetStateAction<string>>;
}

const ReceiveBalanceContainer: FC<{ token: 'STEP' | 'xSTEP' }> = ({ token }) => {
    const logo = token === 'STEP' ? StepLogo : xStepLogo;
    const logoWidth = token === 'STEP' ? 30 : 30;
    const logoMargin = token === 'STEP' ? 'mr-1.5 ml-2' : 'mr-2 ml-2';

    return (
        <>
            <div className='flex items-center pt-4 w-full  justify-between pr-2'>
                <div className="flex items-center justify-between mt-2">
                    <Image src={logo} width={logoWidth} height={logoWidth} alt={token} className={logoMargin} />
                    <div className="text-white text-sm font-bold">
                        {token}
                    </div>
                </div>
                <div className="rounded-sm text-md font-bold !font-mono  placeholder:text-liteGrey text-right"   >
                    0.00
                </div>

            </div>
            <div className="w-full p-2 bg-black-1 rounded-lg  z-[100] h-[64px] flex justify-between border border-liteGrey mt-[-50px] opacity-15" />

        </>

    );
}

export default StakingOperationTabs;
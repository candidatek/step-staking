import React from 'react';
import useWalletInfo from '../hooks/useWalletInfo';
import Image from 'next/image';
import WalletNotConnected from "../public/step-disconnected.svg";
import StepArrow from "../public/stake-arrow.svg";
import CustomIcon from './CustomIcon';
import StakingOperationTabs from './StakingOperationTabs';

const LandingContent = () => {
    const { publicKey } = useWalletInfo();

    return (
        <div className='h-[90vh] flex items-center justify-center'>
            {publicKey ? <StakeOperations /> :
                <WalletDisconnected />
            }
        </div>
    );
}


const StakeOperations = () => <div className='flex flex-col'>
    <StakeHeader />
    <StakingInfoCard />
    <StakingOperationTabs />
</div>

const StakeHeader = () =>
    <>  <div className='flex justify-center items-center gap-4 h-10'>
        <Image src={StepArrow} width={32} height={32} alt="Step" />
        <div className='text-white text-lg font-bold '>Stake STEP   </div>
    </div>
        <div className='text-liteGrey text-sm  flex items-center justify-center mt-6'>
            Stake STEP to receive xSTEP
        </div>
    </>



const StakingInfoCard = () =>
    <div className='text-white  rounded-lg text-sm p-[30px] bg-black-1 flex flex-col  
    max-w-[450px] min-w-[400px] w-[40vw] mt-10'>
        <div className='flex justify-between w-full'>
            <div className='flex items-center gap-4  text-sm font-bold'>
                <CustomIcon />
                xSTEP staking APY
            </div>
            <div className='flex items-center text-sm gap-4 font-bold'>
                17.96%
            </div>
        </div>

        <div className='mt-8  text-sm  font-bold'>
            “Where is my staking reward?”
        </div>
        <div className='mt-2.5 text-sm text-liteGrey leading-5 '>
            xSTEP is a yield bearing asset. This means it is automatically worth more STEP over time.
            You don&apos;t need to claim any rewards, or do anything other than hold your xSTEP to benefit from this. Later,
            when you unstake your xSTEP you will receive more STEP than you initially deposited.
        </div>


    </div>

const WalletDisconnected = () => {
    return (
        <div className='flex h-full flex-col justify-center items-center'>
            <Image src={WalletNotConnected} width={160} height={160} alt="Step Wallet not connected" />
            <div className='text-white text-2xl pt-10'>Connect your wallet</div>
        </div>
    );
};

export default LandingContent;

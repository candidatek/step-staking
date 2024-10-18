import React from 'react';
import Image from 'next/image';
import WalletNotConnected from "../app/public/step-disconnected.svg";
import StepArrow from "../app/public/stake-arrow.svg";
import CustomIcon from './CustomIcon';
import StakingTabs from './StakingTabs';
import useWalletInfo from '@/app/hooks/useWalletInfo';

const LandingScreen = () => {
    const { publicKey } = useWalletInfo();

    return (
        <div className='flex items-center justify-center'>
            {publicKey ? <StakeWrapper /> :
                <WalletDisconnected />
            }
        </div>
    );
}

const StakeWrapper = () =>  <div className='flex flex-col items-center sm:mt-4'>
    <StakeHeader />
    <StakingInfoCard />
    <StakingTabs />
</div>

const StakeHeader = () => <>  <div className='flex justify-center items-center gap-4 h-10 '>
    <Image src={StepArrow} width={32} height={32} alt="Step" />
    <div className='text-white text-lg sm:text-md font-bold '>Stake STEP   </div>
</div>
    <div className='text-liteGrey text-sm  flex items-center justify-center mt-6 sm:mt-4'>
        Stake STEP to receive xSTEP
    </div>
</>



const StakingInfoCard = () =>
    <div className='text-white  rounded-lg text-sm p-[30px] sm:p-5 bg-black-1 flex flex-col  
    sm:w-[96vw] w-[450px] mt-10 sm:mt-5'>
        <div className='flex justify-between w-full'>
            <div className='flex items-center gap-4  text-sm font-bold'>
                <CustomIcon />
                xSTEP staking APY
            </div>
            <div className='flex items-center text-sm gap-4 font-bold'>
                17.96%
            </div>
        </div>

        <div className='mt-8 sm:mt-4 text-sm  font-bold'>
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
        <div className='flex flex-col justify-center items-center h-[90vh]'>
            <Image src={WalletNotConnected} width={160} height={160} alt="Step Wallet not connected" />
            <div className='text-white text-2xl pt-10'>Connect your wallet</div>
        </div>
    );
};

export default LandingScreen;

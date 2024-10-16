import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import React from 'react';
import { WalletButton } from './WalletButton';
import Image from 'next/image';
import StepLogo from '../public/step-logo.svg';

const HeaderComponent = () => {
    return (
        <div className='flex justify-between px-[2vw] pt-[1.5vh] h-[7vh]'>
            <div>
                <Image src={StepLogo} width={110} height={40} alt="Step Stake logo" />
            </div>
            <div>
                <WalletMultiButton style={{}} />
                <WalletButton />
            </div>
        </div>

    );
}

export default HeaderComponent;

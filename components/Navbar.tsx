import React from 'react';
import { WalletButton } from './WalletButton';
import Image from 'next/image';
import StepLogo from '../app/public/step-logo.svg';

const Navbar = () =>
    <div className='flex justify-between px-[2vw] pt-[1.5vh] h-[7vh]'>
        <div>
            <Image src={StepLogo} width={110} height={40} alt="Step Stake logo" />
        </div>
        <div>
            <WalletButton />
        </div>
    </div>




export default Navbar;

import { Program } from '@coral-xyz/anchor';
import { AnchorProvider } from '@coral-xyz/anchor';
import { AnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { STEP_PROGRAM_ID } from '../utils/constants';
import { StepStakingIDL, StepStakingJSON } from '../utils/idl';
import { getConnection } from '../utils/utils';

export const useStakingProgram = () => {
    const connection = getConnection();
    const wallet = useWallet();

    const provider = new AnchorProvider(
        connection,
        wallet as AnchorWallet,
        AnchorProvider.defaultOptions()
    );

    const program = new Program(
        StepStakingJSON,
        STEP_PROGRAM_ID,
        provider
    ) as Program<StepStakingIDL>;

    return program;
};

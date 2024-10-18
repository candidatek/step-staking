import { useQuery } from '@tanstack/react-query';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { STEP_MINT, XSTEP_MINT } from '../../lib/constants';
import { fetchMintBalance } from '@/lib/utils';

export const useStepAndXStepBalances = () => {
    const { publicKey, connected } = useWallet();
    const {connection} = useConnection();

    return useQuery({
        queryKey: ['tokenBalances', publicKey],
        queryFn: async () => {
            if (!publicKey) throw new Error('Public key is required');

            const [stepTokenBalance, xStepTokenBalance] = await Promise.all([
                fetchMintBalance(publicKey, STEP_MINT, connection),
                fetchMintBalance(publicKey, XSTEP_MINT, connection),
            ]);

            return { stepTokenBalance, xStepTokenBalance };
        },
        enabled: !!publicKey && connected,
        staleTime: 1000 * 60 * 5, 
        refetchInterval: 1000 * 60 * 1,  
        refetchIntervalInBackground: true,
    });
};
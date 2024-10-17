import { useQuery } from '@tanstack/react-query';
import { useWallet } from '@solana/wallet-adapter-react';
import { fetchMintBalance } from '../utils/utils';
import { STEP_MINT, XSTEP_MINT } from '../utils/constants';

export const useStepAndXStepBalances = () => {
    const { publicKey, connected } = useWallet();

    return useQuery({
        queryKey: ['tokenBalances', publicKey],
        queryFn: async () => {
            if (!publicKey) throw new Error('Public key is required');

            const [stepTokenBalance, xStepTokenBalance] = await Promise.all([
                fetchMintBalance(publicKey, STEP_MINT),
                fetchMintBalance(publicKey, XSTEP_MINT),
            ]);

            return { stepTokenBalance, xStepTokenBalance };
        },
        enabled: !!publicKey && connected,
        staleTime: 1000 * 60 * 5, 
        refetchInterval: 1000 * 60 * 1,  
        refetchIntervalInBackground: true,
    });
};
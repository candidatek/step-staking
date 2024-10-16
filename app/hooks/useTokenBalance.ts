import { useEffect, useState, useCallback, useMemo } from 'react';
import { Connection, PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { SOLANA_RPC_URL } from '../utils/constants';

interface UseTokenBalanceResult {
    balance: number | null;
    loading: boolean;
    error: Error | null;
}

const useTokenBalance = (tokenMintAddress: string): UseTokenBalanceResult => {
    const { publicKey } = useWallet();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    const connection = useMemo(() => new Connection(SOLANA_RPC_URL, 'confirmed'), []);

    const fetchBalance = useCallback(async () => {
        if (!publicKey || !tokenMintAddress) {
            setBalance(null);
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const tokenPublicKey = new PublicKey(tokenMintAddress);

            // Get all token accounts of the user for this specific mint address
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                mint: tokenPublicKey,
            });

            if (tokenAccounts.value.length > 0) {
                const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
                const amount = tokenAccountInfo.tokenAmount.uiAmount.toFixed(2);
                console.log('calling ', amount);
                setBalance(amount);
            } else {
                setBalance(0); // No token accounts found, balance is 0
            }
        } catch (err) {
            setError(err as Error);
            setBalance(0);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    return useMemo(() => ({ balance, loading, error }), [balance, loading, error]);
};

export default useTokenBalance;
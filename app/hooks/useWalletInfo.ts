import { useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

const useWalletInfo = () => {
  const { wallet } = useWallet();

  const publicKey = useMemo(() => wallet?.adapter?.publicKey ?? null, [wallet?.adapter?.publicKey]);
  const isConnected = useMemo(() => !!publicKey, [publicKey]);

  return { publicKey, isConnected };
};

export default useWalletInfo;
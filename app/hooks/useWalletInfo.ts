import { useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "sonner"
import { formatPublicKey } from '@/lib/utils';


const useWalletInfo = () => {
  const { wallet } = useWallet();

  const publicKey = useMemo(() => wallet?.adapter?.publicKey ?? null, [wallet?.adapter?.publicKey]);
  const isConnected = useMemo(() => !!publicKey, [publicKey]);

  useEffect(() => {
    if (publicKey) {
      localStorage.setItem('publicKey', publicKey.toBase58());
      toast.success(`Wallet connected to ${formatPublicKey(publicKey.toBase58())}`);
    }
    if (!publicKey) {
      const pubKey = localStorage.getItem('publicKey');
      toast.error(`Wallet disconnected ${pubKey && `from ` + formatPublicKey(pubKey)} `);
      localStorage.removeItem('publicKey');
    }
  }, [publicKey]);
  return { publicKey, isConnected };
};

export default useWalletInfo;
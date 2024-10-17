import { useEffect, useMemo } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from "sonner"
import { formatPublicKey } from '@/lib/utils';


const useWalletInfo = () => {
  const { wallet } = useWallet();

  const publicKey = useMemo(() => wallet?.adapter?.publicKey ?? null, [wallet?.adapter?.publicKey]);
  const isConnected = useMemo(() => !!publicKey, [publicKey]);


  return { publicKey, isConnected };
};

export const useWalletConnectNotify = () => {
  const { publicKey } = useWalletInfo();

  useEffect(() => {

    toast.dismiss();
    if (publicKey) {
      localStorage.setItem('publicKey', publicKey.toBase58());
      toast.success(`Wallet connected to ${formatPublicKey(publicKey.toBase58())}`);
    }
    if (!publicKey) {
      const prevPublicKey = localStorage.getItem('publicKey');
      toast.message(`Wallet disconnected ${prevPublicKey && `from ` + formatPublicKey(prevPublicKey)} `);
      localStorage.removeItem('publicKey');
    }

  }, [publicKey]);
  return null;
}



export default useWalletInfo;
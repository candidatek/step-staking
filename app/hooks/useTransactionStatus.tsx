import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { toast } from 'sonner';
import { useConnection } from '@solana/wallet-adapter-react';
import { type TransactionSignature } from '@solana/web3.js';
import Image from 'next/image';
import { useLPTokenBalance } from './useLPTokenBalance';
import { useQueryClient } from '@tanstack/react-query'; // For query invalidation

import StepLogo from '../public/step.png';
import XStepLogo from '../public/xstep.svg';
import { ConfirmingTxToast, SuccessToast } from '../../components/ToastNotifications';

type TransactionDetails = {
  signature: TransactionSignature;
  sendAmount: number;
  action: 'stake' | 'unstake';
  setIsLoading: Dispatch<SetStateAction<boolean>>;
};

export const useTransactionStatus = () => {
  const { connection } = useConnection();
  const queryClient = useQueryClient(); // To invalidate queries
  const { data: stepConversionRate } = useLPTokenBalance();
  const [txDetails, setTxDetails] = useState<TransactionDetails | null>(null);

  useEffect(() => {
    const checkTransactionStatus = async () => {
      if (!txDetails) return;

      const { signature, action, sendAmount, setIsLoading } = txDetails;
      try {
        const latestBlockhash = await connection.getLatestBlockhash();
        const res = await connection.confirmTransaction(
          {
            signature,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
          },
          'confirmed'
        );

        if (!res.value.err) {
          setIsLoading(false);
          const toastMessage =
            action === 'stake' ? 'You staked STEP' : 'You unstaked xSTEP';

          const receivedAmount =
            action === 'stake'
              ? sendAmount / +stepConversionRate!.stepPerXstep
              : sendAmount * +stepConversionRate!.stepPerXstep;

          // Show success toast
          toast.dismiss();
          toast(
            <SuccessToast
              message={toastMessage}
              sendSectionTitle={action === 'stake' ? 'You staked:' : 'You unstaked:'}
              sendTokenIcon={
                action === 'stake' ? (
                  <Image src={StepLogo} width={20} height={20} alt='step logo' />
                ) : (
                  <Image src={XStepLogo} width={20} height={20} alt='xStep logo' />
                )
              }
              sendAmount={sendAmount.toString()}
              sendTokenLabel={action === 'unstake' ? 'xSTEP' : 'STEP'}
              receiveAmount={receivedAmount.toFixed(2).toString()}
              receiveTokenLabel={action === 'stake' ? 'xSTEP' : 'STEP'}
              receiveTokenIcon={
                action === 'unstake' ? (
                  <Image src={StepLogo} alt='' width={20} height={20} />
                ) : (
                  <Image src={XStepLogo} alt='' width={20} height={20} />
                )
              }
              onClick={() => {
                window.open(`https://solscan.io/tx/${signature}`, '_blank', 'noopener,noreferrer');
              }}
            />
          );

          // Invalidate token balance queries to fetch the latest balances
          queryClient.invalidateQueries({
            queryKey: ['tokenBalances'],
          });
        } else {
          setIsLoading(false);
          toast.error('Transaction error: ' + res.value.err.toString());
        }
      } catch (err) {
        setIsLoading(false);
        toast.error('Failed to confirm transaction: ' + err);
      } finally {
        setIsLoading(false);
        setTxDetails(null);
      }
    };

    if (txDetails) {
      checkTransactionStatus();
    }
  }, [txDetails, connection, stepConversionRate, queryClient]);

  const checkStatus = (transactionDetails: TransactionDetails) => {
    const toastMessage =
      transactionDetails.action === 'stake' ? 'You are staking STEP' : 'You are unstaking xSTEP';
    toast.dismiss();
    
    toast(
      <ConfirmingTxToast
        message={toastMessage}
        onClick={() => {
          window.open(`https://solscan.io/tx/${transactionDetails.signature}`, '_blank', 'noopener,noreferrer');
        }}
      />,
      { dismissible: false, duration: Infinity }
    );

    setTxDetails(transactionDetails);
  };

  return { checkStatus };
};
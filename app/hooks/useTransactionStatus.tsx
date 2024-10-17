import { useState } from 'react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useConnection } from '@solana/wallet-adapter-react';
import { type TransactionSignature } from '@solana/web3.js';
import Image from 'next/image';
import { useStepPerXStep } from './useStepPerXStep';

import StepLogo from '../public/step.png';
import XStepLogo from '../public/xstep.svg';
import { STEP_MINT_DECIMAL } from '../utils/constants';
import { SuccessToast } from '../../components/SuccessToast';
import { ConfirmingTxToast } from '@/components/ConfirmingTxToast';


type TransactionDetails = {
  signature: TransactionSignature;
  sendAmount: number;
  action: 'stake' | 'unstake';
};
export const useTransactionStatus = () => {
  const queryClient = useQueryClient();
  const { connection } = useConnection();
  const { data } = useStepPerXStep();

  const [txDetails, setTxDetails] = useState<TransactionDetails>();

  const query = useQuery({
    queryKey: [`transactionStatus-${txDetails}`],
    queryFn: async () => {
      if (!txDetails) {
        return;
      }
      const { signature, action, sendAmount } = txDetails;
      const latestBlockhash = await connection.getLatestBlockhash();

      const res = await connection.confirmTransaction({
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
        'confirmed'
      );

      if (!res.value.err) {
        const toastMessage =
          action === 'stake' ? 'You staked STEP' : 'You unstaked xSTEP';

        const receivedAmount =
          action === 'stake'
            ? +sendAmount / +data!.stepPerXstep
            : sendAmount * +data!.stepPerXstep;
        toast.dismiss();
        toast(
          <SuccessToast
            message={toastMessage}
            sendSectionTitle={
              action === 'stake' ? 'You staked:' : 'You unstaked:'
            }
            sendTokenIcon={
              action === 'stake' ? (
                <Image src={StepLogo} width={20} height={20} alt='step logo' />
              ) : (
                <Image src={XStepLogo} width={20} height={20} alt='xStep logo' />
              )
            }
            sendAmount={sendAmount.toString()}
            sendTokenLabel={action === 'unstake' ? 'xSTEP' : 'STEP'}
            receiveSectionTitle="You received:"
            receiveAmount={receivedAmount.toFixed(STEP_MINT_DECIMAL).toString()}
            receiveTokenLabel={action === 'stake' ? 'xSTEP' : 'STEP'}
            receiveTokenIcon={
              action === 'unstake' ? (
                <Image src={StepLogo} alt='' width={20} height={20} />
              ) : (
                <Image src={XStepLogo} alt='' width={20} height={20} />
              )
            }
            onClick={() => {
              window.open(
                `https://solscan.io/tx/${signature}`,
                '_blank',
                'noopener,noreferrer'
              );
            }}
          />
        );


      } else {
        toast('Transaction error' + res.value.err.toString());
      }
      queryClient.invalidateQueries({
        queryKey: ['tokenBalances'],
      });
      setTxDetails(undefined);
      return res;
    },
    enabled: !!txDetails,
  });

  const checkStatus = (transactionDetails: TransactionDetails) => {
    toast.dismiss();
    const toastMessage =
      transactionDetails.action === 'stake'
        ? 'Your are staking STEP'
        : 'You are unstaking xSTEP';
    toast(
      <ConfirmingTxToast
        message={toastMessage}
        onClick={() => {
          window.open(
            `https://solscan.io/tx/${transactionDetails.signature}`,
            '_blank',
            'noopener,noreferrer'
          );
        }}
      />,
      {
        dismissible: false,
        duration: Infinity,
      }
    );
    setTxDetails(transactionDetails);
  };

  return { ...query, checkStatus };
};


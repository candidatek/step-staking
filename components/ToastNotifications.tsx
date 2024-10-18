import { ReactNode } from 'react';
import { CircleCheck, ExternalLink, Minus, Plus, LoaderCircle } from 'lucide-react';

import { FC } from 'react';

type Props = {
  message: string;
  sendSectionTitle: string;
  sendAmount: string;
  sendTokenLabel: string;
  sendTokenIcon: ReactNode;
  receiveAmount: string;
  receiveTokenLabel: string;
  receiveTokenIcon: ReactNode;
  onClick: () => void;
};
export const SuccessToast = ({
  message,
  sendSectionTitle,
  sendAmount,
  sendTokenLabel,
  sendTokenIcon,
  receiveAmount,
  receiveTokenLabel,
  receiveTokenIcon,
  onClick,
}: Props) => {
  return (
    <div className="flex flex-1 items-center gap-2.5">
      <CircleCheck size={25} color="#06D6A0" />
      <div className="flex flex-col flex-1 gap-2.5 text-sm text-liteGrey font-normal">
        <span className="text-base font-extrabold text-liteGrey">{message}</span>
        {sendSectionTitle}
        <div className="flex items-center gap-2.5">
          <Minus color="#06D6A0" size={16} />
          {sendTokenIcon}
          <span className="font-mono">{sendAmount}</span>
          <span className="font-bold">{sendTokenLabel}</span>
        </div>
        <span>{"You received:"}</span>
        <div className="flex items-center gap-2.5">
          <Plus color="#06D6A0" size={16} />
          {receiveTokenIcon}
          <span className="font-mono">{receiveAmount}</span>
          <span className="font-bold">{receiveTokenLabel}</span>
        </div>
        <button
          onClick={onClick}
          className="flex items-center gap-2 self-end rounded-sm text-liteGrey py-1.5 px-4 border border-gray1"
        >
          View on Solscan
          <ExternalLink size={16} color="#B2B2B2" />
        </button>
      </div>
    </div>
  );
};


export const ConfirmingTxToast: FC<{ message: string, onClick: () => void }> = ({ message, onClick }) => {
  return (
    <div className="flex flex-1 items-center gap-2.5">
      <LoaderCircle size={25} color="blue" />
      <div className="flex flex-col flex-1 gap-2.5 text-liteGrey font-extrabold">
        {message}
        <span className="text-sm text-liteGrey">Confirmation is in progress</span>
        <button
          onClick={onClick}
          className="flex items-center gap-2 self-end rounded-sm text-liteGrey py-1.5 px-4 border border-gray1"
        >
          View on Solscan
          <ExternalLink size={16} color="#B2B2B2" />
        </button>
      </div>
    </div>
  );
};

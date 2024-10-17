import { ReactNode } from 'react';
import { CircleCheck, ExternalLink, Minus, Plus } from 'lucide-react';

type Props = {
  message: string;
  sendSectionTitle: string;
  sendAmount: string;
  sendTokenLabel: string;
  sendTokenIcon: ReactNode;
  receiveSectionTitle: string;
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
  receiveSectionTitle,
  receiveAmount,
  receiveTokenLabel,
  receiveTokenIcon,
  onClick,
}: Props) => {
  return (
    <div className="flex flex-1 items-center gap-2.5">
      <CircleCheck size={25} color="#000" />
      <div className="flex flex-col flex-1 gap-2.5 text-sm text-black font-normal">
        <span className="text-base font-extrabold text-black">{message}</span>
        {sendSectionTitle}
        <div className="flex items-center gap-2.5">
          <Minus color="#000" size={16} />
          {sendTokenIcon}
          <span className="font-mono">{sendAmount}</span>
          <span className="font-bold">{sendTokenLabel}</span>
        </div>
        <span>{receiveSectionTitle}</span>
        <div className="flex items-center gap-2.5">
          <Plus color="#000" size={16} />
          {receiveTokenIcon}
          <span className="font-mono">{receiveAmount}</span>
          <span className="font-bold">{receiveTokenLabel}</span>
        </div>
        <button
          onClick={onClick}
          className="flex items-center gap-2 self-end rounded-sm text-black py-1.5 px-4 border border-gray1"
        >
          View on Solscan
          <ExternalLink size={16} color="#B2B2B2" />
        </button>
      </div>
    </div>
  );
};

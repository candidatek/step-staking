import { Ellipsis, ExternalLink } from 'lucide-react';
import { FC } from 'react';

export const ConfirmingTxToast:FC<{message: string, onClick: () => void}> = ({ message, onClick }) => {
  return (
    <div className="flex flex-1 items-center gap-2.5">
      <Ellipsis size={25} color="blue" />
      <div className="flex flex-col flex-1 gap-2.5 text-black font-extrabold">
        {message}
        <span className="text-sm text-black">Confirmation is in progress</span>
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

import { toast } from 'sonner';
import { ExternalLink, Copy, Unplug } from 'lucide-react';
import { useWallet } from '@solana/wallet-adapter-react';
import { formatPublicKey } from '@/lib/utils';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@shadcn/ui';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
// import { Button } from '@shadcn/ui/button';

export const WalletButton = () => {
    const { wallet, disconnect } = useWallet();
    const { setVisible } = useWalletModal();
    const publicKey = wallet?.adapter.publicKey?.toBase58();

    const copyPublicKey = async () => {
        await navigator.clipboard.writeText(publicKey!);
        toast('Address copied to clipboard', {
            description: publicKey,
            icon: <Copy size={20} />,
        });
    };

    return (
        <>
            {!publicKey ? (
                <Button
                    onClick={() => setVisible(true)}
                    className="w-[150px] bg-black-1 border text-green border-green font-bold text-center h-10 flex items-center justify-center rounded-lg"
                >
                    Connect Wallet
                </Button>
            ) : (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button className="w-[150px] bg-black-1 border text-green border-green font-bold text-center h-10 flex items-center justify-center rounded-lg">
                            {formatPublicKey(publicKey)}
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="bg-black-1 border border-green mt-2 rounded-lg p-2 mr-4">
                        <div className="flex gap-2 items-center">
                            <DropdownMenuItem asChild>
                                <a
                                    href={`https://solscan.io/account/${publicKey}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-green flex items-center gap-2"
                                >
                                    <span>{formatPublicKey(publicKey)}</span>
                                    <ExternalLink color='#06D6A0' size={16} />
                                </a>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={copyPublicKey} className="flex items-center gap-2 text-gray">
                                <Copy size={16} color='#06D6A0'/>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={disconnect} className="flex items-center gap-2 text-gray">
                                <Unplug size={16} color="#FF5900" />
                            </DropdownMenuItem>
                        </div>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </>

    );
};
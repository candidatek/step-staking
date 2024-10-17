import { STEP_MINT, STEP_MINT_DECIMAL, STEP_PROGRAM_ID, XSTEP_MINT, XSTEP_MINT_DECIMAL } from "../utils/constants";
import { useStakingProgram } from "./useStakingProgram"
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import useWalletInfo from "./useWalletInfo";
import { PublicKey, Transaction, TransactionInstruction } from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { getConnection } from "../utils/utils";


type UseStakeTransactionReturn = {
    initiateStakeTransaction: (amount: number) => Promise<void>;
    initiateUnstakeTransaction: (amount: number) => Promise<void>;
    isLoading: boolean;
    error: Error | null;
};

export const usePerformTransaction = (): UseStakeTransactionReturn => {
    const { publicKey } = useWalletInfo()
    const { sendTransaction } = useWallet()
    const connection = getConnection();
    const program = useStakingProgram();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createTransaction = async (ix: TransactionInstruction, feePayer: PublicKey): Promise<Transaction> => {
        const tx = new Transaction().add(ix);
        tx.feePayer = feePayer;
        const { blockhash } = await connection.getLatestBlockhash();
        tx.recentBlockhash = blockhash;
        return tx;
    };


    const initiateStakeTransaction = async (amount: number) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!publicKey || !amount || amount <= 0) {
                throw new Error("Wallet is not connected");
            }
            const stepTokenAta = await getAssociatedTokenAddress(STEP_MINT, publicKey);
            const xStepTokenAta = await getAssociatedTokenAddress(XSTEP_MINT, publicKey);
            const [stepTokenVault, stepBump] = PublicKey.findProgramAddressSync(
                [STEP_MINT.toBuffer()],
                STEP_PROGRAM_ID
            );
            // Get associated token addresses for staking

            const ix = await program.methods
                .stake(stepBump, new BN(amount * 10 ** STEP_MINT_DECIMAL))
                .accounts({
                    tokenMint: STEP_MINT,
                    xTokenMint: XSTEP_MINT,
                    tokenFrom: stepTokenAta,
                    tokenFromAuthority: publicKey,
                    tokenVault: stepTokenVault,
                    xTokenTo: xStepTokenAta,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .instruction();

            const tx = await createTransaction(ix, publicKey);
            await sendTransaction(tx, connection);
            console.log("Transaction sent successfully");
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
            console.error("Error creating stake transaction:", err);
        }
        finally {
            setIsLoading(false);
        }
    };
    const initiateUnstakeTransaction = async (amount: number) => {
        setIsLoading(true);
        setError(null);

        try {
            if (!publicKey) {
                throw new Error("Wallet is not connected");
            }
            const stetTokenAta = await getAssociatedTokenAddress(STEP_MINT, publicKey!);

            const xTokenFrom = await getAssociatedTokenAddress(
                XSTEP_MINT,
                publicKey!
            );

            const [vaultPubkey, vaultBump] = await PublicKey.findProgramAddress(
                [STEP_MINT.toBuffer()],
                STEP_PROGRAM_ID
            );

            const ix = await program.methods
                .unstake(vaultBump, new BN(amount * 10 ** XSTEP_MINT_DECIMAL))
                .accounts({
                    tokenMint: STEP_MINT,
                    xTokenMint: XSTEP_MINT,
                    xTokenFrom: xTokenFrom,
                    xTokenFromAuthority: publicKey!,
                    tokenVault: vaultPubkey,
                    tokenTo: stetTokenAta,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .instruction();

            // Construct transaction and add instruction
            const tx = await createTransaction(ix, publicKey);
            await sendTransaction(tx, connection);
            console.log("Transaction sent successfully");
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false)
            console.error("Error creating stake transaction:", err);
            //   setError(err as Error);
        }
        finally {
            setIsLoading(false);
        }
    };

    return { initiateStakeTransaction, isLoading, error, initiateUnstakeTransaction };



}
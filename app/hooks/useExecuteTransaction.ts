import {
  STEP_MINT,
  STEP_MINT_DECIMAL,
  STEP_PROGRAM_ID,
  XSTEP_MINT,
  XSTEP_MINT_DECIMAL,
} from "../utils/constants";
import { useStakingProgram } from "./useStakingProgram";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import useWalletInfo from "./useWalletInfo";
import {
  PublicKey,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { BN } from "@coral-xyz/anchor";
import { useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { getConnection } from "../utils/utils";
import { toast } from "sonner";
import { useTransactionStatus } from "./useTransactionStatus";

type useExecuteTransactionReturn = {
  initiateStakeTransaction: (amount: number) => Promise<void>;
  initiateUnstakeTransaction: (amount: number) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
};

export const useExecuteTransaction = (): useExecuteTransactionReturn => {
  const { publicKey } = useWalletInfo();
  const { sendTransaction } = useWallet();
  const connection = getConnection();
  const program = useStakingProgram();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { checkStatus } = useTransactionStatus();


  const createTransaction = async (
    ix: (TransactionInstruction | undefined)[],
    feePayer: PublicKey
  ): Promise<Transaction> => {
    const tx = new Transaction();
    ix.forEach((instruction) => instruction && tx.add(instruction));
    tx.feePayer = feePayer;
    const { blockhash } = await connection.getLatestBlockhash();
    tx.recentBlockhash = blockhash;
    return tx;
  };

  const initiateStakeTransaction = async (sendAmount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      if (!publicKey || !sendAmount || sendAmount <= 0) {
        throw new Error("Wallet is not connected");
      }
      const stepTokenAta = await getAssociatedTokenAddress(
        STEP_MINT,
        publicKey
      );
      const xStepTokenAta = await getAssociatedTokenAddress(
        XSTEP_MINT,
        publicKey
      );
      const xStepTokenAtaValue = await connection.getAccountInfo(xStepTokenAta);
      let createAtaIx;
      if (!xStepTokenAtaValue) {
        createAtaIx = await createAssociatedTokenAccountInstruction(
          publicKey,
          xStepTokenAta,
          publicKey,
          XSTEP_MINT
        );
      }
      const [stepTokenVault, stepBump] = PublicKey.findProgramAddressSync(
        [STEP_MINT.toBuffer()],
        STEP_PROGRAM_ID
      );
      // Get associated token addresses for staking

      const ix = await program.methods
        .stake(stepBump, new BN(sendAmount * 10 ** STEP_MINT_DECIMAL))
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

      const tx = await createTransaction([createAtaIx, ix], publicKey);
      toast.message("Approve Transaction from Wallet", { duration: 20000 });
      const signature = await sendTransaction(tx, connection);
      checkStatus({ signature, sendAmount, action: 'stake' });
      setIsLoading(false);
    } catch (err: Error | unknown) {
      toast.dismiss();
      toast.error("Failed to send transaction ", {
        description: err?.toString(),
        duration: 20000,
        style: { backgroundColor: "#FF8A8A" },
      });

      setIsLoading(false);
      console.error("Error creating stake transaction:", err);
    } finally {
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
      const stepTokenAta = await getAssociatedTokenAddress(
        STEP_MINT,
        publicKey!
      );
      const xStepTokenAtaValue = await connection.getAccountInfo(stepTokenAta);
      let createAtaIx;
      if (!xStepTokenAtaValue) {
        createAtaIx = await createAssociatedTokenAccountInstruction(
          publicKey,
          stepTokenAta,
          publicKey,
          STEP_MINT
        );
      }

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
          tokenTo: stepTokenAta,
          tokenProgram: TOKEN_PROGRAM_ID,
        })
        .instruction();

      // Construct transaction and add instruction
      const tx = await createTransaction([createAtaIx, ix], publicKey);
      await sendTransaction(tx, connection);
      console.log("Transaction sent successfully");
      setIsLoading(false);
    } catch (err: Error | unknown) {
      toast.dismiss();
      toast.error("Failed to send transaction ", {
        description: err?.toString(),
        duration: 20000,
        style: { backgroundColor: "#FF8A8A" },
      });
      setIsLoading(false);
      console.error("Error creating stake transaction:", err);
      //   setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initiateStakeTransaction,
    isLoading,
    error,
    initiateUnstakeTransaction,
  };
};

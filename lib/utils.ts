import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

import { Connection, PublicKey } from "@solana/web3.js";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatPublicKey = (publicKey: string) => {
  return `${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`;
};


export const handleDecimalInput = (
  value: string,
  setInput: (value: string) => void
): void => {

  if (/^\d*\.?\d*$/.test(value)) {
    setInput(value);
  }
};

export const formatAmount = (amount: number, decimals?: number) => {
  if (!amount || amount === 0) {
    return 0;
  }
  return amount.toFixed(decimals ?? 2);
};
export const fetchMintBalance = async (
  publicKey: PublicKey,
  tokenMintAddress: PublicKey,
  connection: Connection
): Promise<number> => {
  if (!publicKey || !tokenMintAddress) {
    return 0;
  }

  try {
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
      publicKey,
      {
        mint: tokenMintAddress,
      }
    );

    if (tokenAccounts.value.length > 0) {
      const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
      const amount = tokenAccountInfo.tokenAmount.uiAmount;
      return amount;
    } else {
      return 0;
    }
  } catch (err) {
    console.log(err);
    return 0;
  }
};
export const formatToDollar = (amount: number): string => {
  return `${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

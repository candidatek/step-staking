import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPublicKey = (publicKey: string) => {
  return `${publicKey?.slice(0, 4)}...${publicKey?.slice(-4)}`;
};
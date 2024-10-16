import { Connection, PublicKey } from "@solana/web3.js";
import { SOLANA_RPC_URL } from "./constants";


export const getConnection = (): Connection => {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    return connection;
}

export const formatAmount = (amount: number, decimals?: number) => {
    if(!amount || amount === 0) {
        return 0;
    }
    return amount.toFixed(decimals ?? 2);
}
export const fetchMintBalance = async (publicKey: PublicKey, tokenMintAddress: PublicKey) => {
    const connection = getConnection();
    if (!publicKey || !tokenMintAddress) {
        return 0
    }

    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            mint: tokenMintAddress,
        });

        if (tokenAccounts.value.length > 0) {
            const tokenAccountInfo = tokenAccounts.value[0].account.data.parsed.info;
            const amount = tokenAccountInfo.tokenAmount.uiAmount;
            return amount;
        } else {
            return 0; 
        }
    } catch (err) {
        console.log(err);
        return 0
    }
}
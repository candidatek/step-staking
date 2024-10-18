import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { useQuery } from "@tanstack/react-query";
import { STEP_MINT, XSTEP_MINT, STEP_PROGRAM_ID } from "../../lib/constants";
import { useStakingProgram } from "./useStakingProgram";

export const useStepPerXStep = () => {
  const program = useStakingProgram();

  return useQuery({
    queryKey: ["emitPrice"],
    queryFn: async () => {
      try {
        const [vaultPubkey] = await PublicKey.findProgramAddress(
          [STEP_MINT.toBuffer()],
          STEP_PROGRAM_ID
        );
        const res = await program.simulate.emitPrice({
          accounts: {
            tokenMint: STEP_MINT,
            xTokenMint: XSTEP_MINT,
            tokenVault: vaultPubkey,
          },
        });

        const price = res.events[0].data as {
          stepPerXstep: string;
          stepPerXstepE9: BN;
        };

        return price;
      } catch (error) {
        console.error(error);
        return { stepPerXstep: "0", stepPerXstepE9: new BN(0) };
      }
    },
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    refetchInterval: 1000 * 60, // Refetch every 1 minute
    refetchIntervalInBackground: true,
  });
};

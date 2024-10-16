import { useQuery } from '@tanstack/react-query';

const fetchStepTokenPrice = async () => {
  const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=step-finance&vs_currencies=usd'
  );
  if (!response.ok) {
    throw new Error('Error while fetching STEP price');
  }
  const data = await response.json();
  return data['step-finance'].usd as number;
};

export const useStepTokenPrice = () => {
  return useQuery({
    queryKey: ['stepPrice'],
    queryFn: fetchStepTokenPrice,
    staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
    refetchInterval: 1000 * 60, // Refetch every 1 minute
    refetchIntervalInBackground: true,
  });
};

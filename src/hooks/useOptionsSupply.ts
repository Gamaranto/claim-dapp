import { ethers } from "ethers";
import { useQuery } from "react-query";

import { useConnection } from "./useConnection";
import { KPIOptionsToken, infuraId } from "../config";

export function useOptionsSupply() {
  const { provider, network } = useConnection();
  const { data, isLoading, error } = useQuery<any>(
    ["kpi options supply", provider, network?.chainId],
    () => getOptionsSupply(provider, network)
  );

  const format = Intl.NumberFormat("en-US", {
    maximumSignificantDigits: 1,
  }).format;

  return {
    supply: data ? format(+ethers.utils.formatEther(data)) : undefined,
    isLoading,
    error,
  };
}

async function getOptionsSupply(
  web3Provider: ethers.providers.Web3Provider | null,
  network: ethers.providers.Network | null
) {
  const chainId = (network && network.chainId ? network.chainId : 1) as 1 | 42;
  const provider =
    web3Provider != null
      ? web3Provider
      : new ethers.providers.InfuraProvider(chainId, infuraId);
  const contract = new ethers.Contract(
    KPIOptionsToken.address(chainId),
    KPIOptionsToken.abi,
    provider
  );
  const supply = await contract.totalSupply();
  return supply;
}

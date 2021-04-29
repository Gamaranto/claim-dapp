import React from "react";
import { Wallet } from "bnc-onboard/dist/src/interfaces";
import Onboard from "bnc-onboard";
<<<<<<< HEAD
=======
import { ethers } from "ethers";
>>>>>>> 15504e5 (feat(claim-dapp): separate useConnection from Onboard)

import { useConnection } from "./useConnection";
import { onboardBaseConfig } from "../config";
import { UnsupportedChainIdError, isValidChainId } from "../utils/chainId";

export function useOnboard() {
  const { connect, disconnect, update, setError } = useConnection();
  const instance = React.useMemo(
    () =>
      Onboard({
        ...onboardBaseConfig(),
        subscriptions: {
          address: (address: string) => {
            update({ account: address });
          },
          network: (networkId: number) => {
            const error = isValidChainId(networkId)
              ? undefined
              : new UnsupportedChainIdError(networkId);
            update({
              chainId: networkId,
            });
            if (error) {
              setError(error);
            }
          },
          wallet: async (wallet: Wallet) => {
            if (wallet.provider) {
<<<<<<< HEAD
              const provider = wallet.provider;

              update({
                provider,
=======
              const provider = new ethers.providers.Web3Provider(
                wallet.provider
              );
              const signer = provider.getSigner();

              update({
                provider,
                signer,
>>>>>>> 15504e5 (feat(claim-dapp): separate useConnection from Onboard)
              });
            }
          },
        },
      }),
    [setError, update]
  );
  const initOnboard = React.useCallback(async () => {
    try {
      await instance.walletSelect();
      await instance.walletCheck();
      connect({ connector: instance });
    } catch (err) {
      setError(err);
    }
  }, [connect, instance, setError]);
  const resetOnboard = React.useCallback(() => {
    instance.walletReset();
    disconnect();
  }, [instance, disconnect]);
  return { initOnboard, resetOnboard };
}

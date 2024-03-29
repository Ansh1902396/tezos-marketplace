import { NetworkType } from "@airgap/beacon-sdk";
import { BeaconWallet } from "@taquito/beacon-wallet";
import { TezosToolkit } from "@taquito/taquito";
import { Dispatch, SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import { TZIP21TokenMetadata } from "./App";
import { PagesPaths } from "./Navigator";

type ButtonProps = {
  Tezos: TezosToolkit;
  setUserAddress: Dispatch<SetStateAction<string>>;
  setUserBalance: Dispatch<SetStateAction<number>>;
  wallet: BeaconWallet;
  nftContratTokenMetadataMap: Map<number, TZIP21TokenMetadata>;
};

const ConnectButton = ({
  Tezos,
  setUserAddress,
  setUserBalance,
  wallet,
  nftContratTokenMetadataMap,
}: ButtonProps): JSX.Element => {
  const navigate = useNavigate();

  const connectWallet = async (): Promise<void> => {
    try {
      await wallet.requestPermissions({
        network: {
          type: NetworkType.GHOSTNET,
          rpcUrl: "https://ghostnet.tezos.marigold.dev",
        },
      });
      // gets user's address
      const userAddress = await wallet.getPKH();
      const balance = await Tezos.tz.getBalance(userAddress);
      setUserBalance(balance.toNumber());
      setUserAddress(userAddress);
      if (nftContratTokenMetadataMap && nftContratTokenMetadataMap.size > 0)
        navigate(PagesPaths.CATALOG);
      else navigate(PagesPaths.MINT);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="buttons">
      <button className="button" onClick={connectWallet}>
        <span>
          <i className="fas fa-wallet"></i>&nbsp; Connect with wallet
        </span>
      </button>
    </div>
  );
};

export default ConnectButton;

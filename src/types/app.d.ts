import { ethers } from "ethers";

interface Window {
  ethereum: EthereumProvider;
}

// ExternalProvider seems to be the official ethersproject type for the window.ethereum object, however, `new Web3(ethereum)` does not like it so we must improvise.
declare type ExternalProvider = import("@ethersproject/providers").ExternalProvider;
declare type AbstractProvider = import("web3/node_modules/web3-core/types").AbstractProvider;
interface EthereumProvider extends ExternalProvider {
  _state: {
    accounts: string[];
  };
  on(event: "close" | "accountsChanged" | "chainChanged" | "networkChanged", callback: (payload: any) => void): void;
  once(event: "close" | "accountsChanged" | "chainChanged" | "networkChanged", callback: (payload: any) => void): void;
  removeAllListeners(): void;
  sendAsync: AbstractProvider["sendAsync"];
}

export interface token {
  id: number;
  uri: string;
  publicLink: string;
}

export interface profile {
  address?: string;
  network?: ethers.providers.Network;
  tokens?: token[];
}

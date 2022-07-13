import React from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";

let providerOptions = {};

export const connectWallet = async (
  set: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>
) => {
  try {
    const web3modal = new Web3Modal({
      cacheProvider: false,
      providerOptions,
    });

    const web3Instance = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(web3Instance);

    console.log(provider);
    set(provider);
  } catch (err) {
    console.log(err);
  }
};

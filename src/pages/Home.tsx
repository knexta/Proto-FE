import React, { useState } from "react";

import { Link } from "react-router-dom";
import { connectWallet } from "../utils/connectWallet";
import { ethers } from "ethers";
import { get_details } from "../utils/TokenDetails";
import { profile } from "../types/app";
import style from "../styles/home.module.css";

interface props {
  profile: profile;
  setProfile: React.Dispatch<React.SetStateAction<profile>>;
  signer: ethers.providers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  setProvider: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>;
}

export const Home: React.FC<props> = ({ profile, setProfile, signer, contract, setProvider }) => {
  const [err, setErr] = useState<string | null>(null);
  const [minting, setMinting] = useState<number>(-1);

  const Mint = async () => {
    if (!signer) {
      setErr("Signer Not Set");
      return;
    }

    if (!contract) {
      setErr("Contract not Set");
      return;
    }

    if (!profile.address) {
      return;
    }

    try {
      let txn: ethers.ContractTransaction;
      let merkleProof = [
        "0xc21ba819004fa273fb9b334fb970dcc3cf16a4562629c1f49542000b6cd0c655",
        "0xe467c02201f6ccff8dc14d70bf00e8bd2f6d2fc31f703ee3326f1ae45b0569db",
        "0xb49abd4102a5911165e24fb8d9908fce24f2d68b3b60a8b381f5c9b7bda9d7b8",
        "0xc65cff29666ef8cef0cf6081acf536cc4b6214b2788fffaa0bf9cbbbd0a1f72a",
      ];
      let isWhiteList = await contract.functions.isWhitelisted(merkleProof, ethers.utils.keccak256(profile.address));
      console.log(isWhiteList);
      if (isWhiteList[0]) {
        await contract.callStatic.whitelistMint(merkleProof, 1, profile.address, {
          value: ethers.utils.parseEther("0.00001"),
        });
        txn = await contract.whitelistMint(merkleProof, 1, profile.address, {
          value: ethers.utils.parseEther("0.00001"),
        });
      } else {
        await contract.callStatic.publicMint(profile.address, 1, {
          value: ethers.utils.parseEther("0.00001"),
        });
        txn = await contract.publicMint(profile.address, 1, {
          value: ethers.utils.parseEther("0.00001"),
        });
      }
      setMinting(1);
      let receipt: ethers.ContractReceipt = await txn.wait();
      console.log({ txn, receipt });
      setErr("");
    } catch (err: any) {
      console.log({ err });
      setErr(err.reason);
    }
    contract.once("Transfer", async (from, to, tokenId) => {
      console.log({ from, to, tokenId });
      if (!profile.address) return;
      let tokens = await get_details(profile.address, contract);
      setProfile((val) => ({ ...val, tokens }));
      setMinting(0);
      setErr("");
    });
  };

  return (
    <div className="flex flex-col gap-14 items-center pt-16">
      <p className="text-5xl font-bold text-blue-200">Click Bellow to Mint Your NFT</p>
      {!signer ? (
        <button disabled className={style.btn} onClick={() => connectWallet(setProvider)}>
          Connect Wallet
        </button>
      ) : (
        <button className={style.btn} onClick={() => Mint()}>
          Mint as {profile.address}
        </button>
      )}
      {minting === 0 ? (
        <p>
          You'r NFT is minted, View you'r NFT{" "}
          <Link className="font-semibold bg-slate-100" to="/profile">
            here
          </Link>
        </p>
      ) : (
        minting === 1 && <p>Minting ...</p>
      )}
      <p className="mt-8 text-red-400 font-semibold text-lg">{err}</p>
    </div>
  );
};

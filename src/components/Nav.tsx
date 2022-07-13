import { Link, NavLink } from "react-router-dom";

import React from "react";
import { connectWallet } from "../utils/connectWallet";
import { ethers } from "ethers";
import styles from "../styles/nav.module.css";

interface props {
  provider: ethers.providers.Web3Provider | null;
  setProvider: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>;
}

export const Nav: React.FC<props> = ({ provider, setProvider }) => {
  return (
    <div className="NavBar-Height bg-gray-50 shadow-sm w-screen pb-1">
      <div className="flex items-center gap-2 h-full w-4/5 m-auto">
        <Link to="/" className="font-bold text-3xl">
          Home
        </Link>
        <div className="grow"></div>
        <Link to="/about" className={styles.link}>
          About
        </Link>
        <Link to="/roadmap" className={styles.link}>
          Road Map
        </Link>
        <div className="grow"></div>
        {provider ? (
          <>
            <NavLink className={styles.link} to="/profile">
              My NFT's
            </NavLink>
            {/* <div className="bg-blue-100 rounded-full p-5 ml-3"></div> */}
          </>
        ) : (
          <>
            <button className={styles.btn} onClick={() => connectWallet(setProvider)}>
              Connect Wallet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

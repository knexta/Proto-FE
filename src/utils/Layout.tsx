import { Footer } from "../components/Footer";
import { Nav } from "../components/Nav";
import { Outlet } from "react-router-dom";
import React from "react";
import { ethers } from "ethers";

interface props {
  provider: ethers.providers.Web3Provider | null;
  setProvider: React.Dispatch<React.SetStateAction<ethers.providers.Web3Provider | null>>;
}

export const Layout: React.FC<props> = ({ provider, setProvider }) => {
  return (
    <div>
      <Nav provider={provider} setProvider={setProvider} />
      <div className="Body-Height">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

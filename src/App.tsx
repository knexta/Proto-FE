import "./App.css";

import { Contract, ethers } from "ethers";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import { Home } from "./pages/Home";
import { Layout } from "./utils/Layout";
import { Profile } from "./pages/Profile";
import abi from "./assets/abi.json";
import { get_details } from "./utils/TokenDetails";
import { profile } from "./types/app";

const App: React.FC = () => {
  const [profile, setProfile] = useState<profile>({});
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [signer, setSigner] = useState<ethers.providers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!provider || signer) {
          return;
        }

        const signerT = provider.getSigner();
        setSigner(signerT);

        // let address = await signerT.getAddress();
        // setProfile((val) => ({ ...val, address }));
        setInterval(async () => {
          let address = await signerT.getAddress();
          setProfile((val) => ({ ...val, address }));
        }, 500);

        let network = await provider.getNetwork();
        setProfile((val) => ({ ...val, network }));
      } catch (err: any) {
        console.log(err);
      }
    })();

    (async () => {
      if (!signer) return;
      if (!profile.address) return;
      const Add = "0xFa38bF02bc62c3b2b35abD3680f94705c0efA025";
      const contract = new Contract(Add, abi.abi, signer);
      setContract(contract);

      let tokens = await get_details(profile.address, contract);

      setProfile((val) => ({ ...val, tokens: tokens }));
    })();
  }, [provider, signer, profile.address]);

  return (
    <Routes>
      <Route path="/" element={<Layout provider={provider} setProvider={setProvider} />}>
        <Route
          index
          element={
            <Home
              profile={profile}
              setProfile={setProfile}
              signer={signer}
              contract={contract}
              setProvider={setProvider}
            />
          }
        />
        <Route path="profile" element={<Profile profile={profile} setProfile={setProfile} contract={contract} />} />
      </Route>
    </Routes>
  );
};

export default App;

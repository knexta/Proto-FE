import React, { useEffect, useState } from "react";

import { ethers } from "ethers";
import { get_details } from "../utils/TokenDetails";
import { profile } from "../types/app";

interface props {
  profile: profile;
  contract: ethers.Contract | null;
  setProfile: React.Dispatch<React.SetStateAction<profile>>;
}

// let tokens = [
//   { id: 1, publicLink: "http://" },
//   { id: 1, publicLink: "http://" },
// ];

export interface tokenData {
  name?: string;
  desc?: string;
  image?: string;
}

export const Profile: React.FC<props> = ({ profile, setProfile, contract }) => {
  let [loading, setLoading] = useState<boolean>(false);
  let [data, setData] = useState<tokenData[]>([]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      if (!profile.address) return;
      if (!contract) return;
      let tokens = await get_details(profile.address, contract, setData);

      setProfile((val) => ({ ...val, tokens: tokens }));
      setLoading(false);
    })();
  }, [contract, setProfile, profile.address]);

  return (
    <div className="flex flex-wrap w-10/12 justify-center mt-10 m-auto gap-2">
      {!loading ? (
        data?.map((token, idx) => (
          <div key={idx} className="p-5 bg-blue-200 rounded-md shadow-md">
            <p className="font-semibold text-xl">{token.name}</p>
            <p>{token.desc}</p>
            <img className="mt-" src={token.image} alt={token.name} />
          </div>
        ))
      ) : (
        <p>Loading ...</p>
      )}
    </div>
  );
};

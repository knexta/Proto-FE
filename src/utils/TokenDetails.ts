import { ethers } from "ethers";
import { token } from "../types/app";
import { tokenData } from "../pages/Profile";

interface tokenRes {
  name: string;
  description: string;
  image: string;
}

export const get_details = async (
  address: string,
  contract: ethers.Contract,
  set?: React.Dispatch<React.SetStateAction<tokenData[]>>
): Promise<token[]> => {
  let tokenIds: number[] = [];
  try {
    let totalSupply = await contract.functions.totalSupply();
    tokenIds = [];
    for (let i = 0; i < Number(totalSupply); i++) {
      let owner = await contract.functions.ownerOf(i);
      if (owner[0] === address) {
        tokenIds.push(i);
      }
    }
  } catch (error) {
    console.log({ error });
  }
  let tokens: token[] = [];

  for (let id of tokenIds) {
    let token_uri: string;
    try {
      //   console.log(tokenIds);
      token_uri = await contract.functions.tokenURI(id);
      //   console.log(token_uri);
      let token = {
        id: id,
        uri: token_uri[0],
        publicLink: "https://ipfs.io/ipfs/" + token_uri[0].split("/")[2],
      };

      tokens.push(token);
    } catch (error) {
      console.log({ error });
    }
  }

  let data: tokenData[] = [];
  for (let token of tokens) {
    if (!set) continue;
    try {
      let res = await fetch(token.publicLink);
      let tokenData: tokenRes = await res.json();
      console.log(tokenData);

      let image = "https://ipfs.io/ipfs/" + tokenData.image.split("/")[2];

      let obj = {
        name: tokenData.name,
        desc: tokenData.description,
        image,
      };

      data.push(obj);
    } catch (error) {
      console.log({ error });
    }
  }

  set && set(data);

  return tokens;
};

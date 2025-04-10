import type {BigNumberish, Nft} from "alchemy-sdk";
import {Alchemy, Network} from "alchemy-sdk";
import dotenv from 'dotenv';

interface env {
  ALCHEMY_API_KEY: string,
}

dotenv.config({path: './.env'});
const {ALCHEMY_API_KEY } = process.env as unknown as env;

console.log(ALCHEMY_API_KEY, 12);

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
};

const alchemy = new Alchemy(settings);

console.log(alchemy);

const getNFTMetadata = async (nftContractAddress: string, tokenId: BigNumberish): Promise<Nft>=>  {
  return await alchemy.nft.getNftMetadata(
    nftContractAddress,
    tokenId
  );
}

console.log(getNFTMetadata)

const main = async (): Promise<void> => {
  const response = await getNFTMetadata(
    "0x009608e71A4f75cA3c99954D8AFFD47ba4A4777c",
    "44"
  );
  console.log("NFT Metadata:\n", response);
}

main().then(r => console.log(r)).catch(e => console.error(e));
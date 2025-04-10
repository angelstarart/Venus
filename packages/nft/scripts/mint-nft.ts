import {ethers} from "ethers";
import dotenv from 'dotenv';
import contract from '../artifacts/contracts/MyNFT.sol/MyNFT.json';

interface env {
  ALCHEMY_API_KEY: string,
}

dotenv.config({path: './.env'});
const {ALCHEMY_API_KEY} = process.env as unknown as env;

console.log(ALCHEMY_API_KEY, 12);

const provider = new ethers.providers.AlchemyProvider('matic', ALCHEMY_API_KEY);

console.log(provider, 16)
console.log(JSON.stringify(contract.abi), 17);


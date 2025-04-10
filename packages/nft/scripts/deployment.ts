// scripts/deploy.ts
import { ethers } from "hardhat";

async function main(): Promise<void>  {
  console.log("Deploying NFT contract...");

  // Collection details
  const name = "My OpenSea Collection";
  const symbol = "MOSC";
  const baseURI = "ipfs://";

  // Get the contract factory
  const NFTContract = await ethers.getContractFactory("OpenSeaNFT");
  
  // Deploy the contract
  const nftContract = await NFTContract.deploy(name, symbol, baseURI);
  
  // Wait for deployment
  await nftContract.deployed();
  
  console.log("NFT contract deployed to:", nftContract.address);
  console.log("Contract Name:", name);
  console.log("Contract Symbol:", symbol);
  
  console.log("\nVerify with:");
  console.log(`npx hardhat verify --network goerli ${nftContract.address} "${name}" "${symbol}" "${baseURI}"`);
}

main()
  .then((res) => {
    console.log(res, 17)
    process.exitCode = 0
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1
  });

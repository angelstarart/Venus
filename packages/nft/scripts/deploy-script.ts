import { ethers } from "hardhat";
import fs from "fs";

async function main(): Promise<void>  {
  console.log("Deploying NFT Contract...");
  const [deployer] = await ethers.getSigners();
  // Deploy the contract
  const NFT = await ethers.getContractFactory("NftContract");
  const nft = await NFT.deploy(deployer.address);

  await nft.deployed();

  console.log(`OpenSeaNFT contract deployed to: ${nft.address}`);

  // Save the contract address for future use
  const deploymentInfo = {
    contractAddress: nft.address,
    // network: network.name,
    timestamp: new Date().toISOString(),
  };

  // Make sure the deployments directory exists
  if (!fs.existsSync("./deployments")) {
    fs.mkdirSync("./deployments");
  }

  fs.writeFileSync(
    `./deployments/network.name}-deployment.json`,
    JSON.stringify(deploymentInfo, null, 2)
  );

  // console.log(`Deployment info saved to ./deployments/${network.name}-deployment.json`);
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

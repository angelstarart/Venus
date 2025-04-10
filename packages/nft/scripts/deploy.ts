import hre from 'hardhat';

async function main(): Promise<void> {
  const [deployer] = await hre.ethers.getSigners();
  const MyNFT = await hre.ethers.getContractFactory("MyNFT");

  const myNFT = await MyNFT.deploy(deployer.address); // Pass the deployer's address as the initial owner

  await myNFT.deployed();

  console.log("Contract deployed to address:", myNFT.address);
}

main()
  .then((res) => {
    console.log(res, 12)
    process.exitCode = 0
  })
  .catch(error => {
    console.error(error);
    process.exitCode = 1
  });
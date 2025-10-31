import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString());

  const adminAddress = process.env.ADMIN_ADDRESS || deployer.address;
  console.log("Admin address:", adminAddress);

  const SecretFeedbackWall = await ethers.getContractFactory("SecretFeedbackWall");
  const feedbackWall = await SecretFeedbackWall.deploy(adminAddress);

  await feedbackWall.waitForDeployment();

  const contractAddress = await feedbackWall.getAddress();
  console.log("SecretFeedbackWall deployed to:", contractAddress);
  console.log("Admin set to:", adminAddress);

  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", contractAddress);
  console.log("Admin Address:", adminAddress);
  console.log("Network:", (await ethers.provider.getNetwork()).name);
  console.log("========================\n");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

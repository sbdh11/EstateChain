// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  console.log("Starting deployment...");

  // Deploy PropertyToken
  const PropertyToken = await hre.ethers.getContractFactory("PropertyToken");
  const propertyToken = await PropertyToken.deploy();
  await propertyToken.waitForDeployment();
  console.log("PropertyToken deployed to:", await propertyToken.getAddress());

  // Deploy PropertyValuation
  const PropertyValuation = await hre.ethers.getContractFactory("PropertyValuation");
  const propertyValuation = await PropertyValuation.deploy();
  await propertyValuation.waitForDeployment();
  console.log("PropertyValuation deployed to:", await propertyValuation.getAddress());

  // Deploy RentalManagement
  const RentalManagement = await hre.ethers.getContractFactory("RentalManagement");
  const rentalManagement = await RentalManagement.deploy();
  await rentalManagement.waitForDeployment();
  console.log("RentalManagement deployed to:", await rentalManagement.getAddress());

  console.log("Deployment completed!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

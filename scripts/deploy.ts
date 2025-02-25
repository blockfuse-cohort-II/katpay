// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const uniswapRouter = "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b";
  const usdt = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";

  const PaymentGateway = await hre.ethers.getContractFactory("PaymentGateway");
  const paymentGateway = await PaymentGateway.deploy(uniswapRouter, usdt);

  console.log("PaymentGateway deployed to:",await paymentGateway.getAddress());

  
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });

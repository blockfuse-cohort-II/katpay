import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("PaymentGateway", function () {
  async function deployMocks() {
    const [owner, wallet] = await hre.ethers.getSigners();

    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const realUSDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    // const UniswapMock = await hre.ethers.getContractFactory("UniswapV2RouterMock");
    // const uniswapMock = await UniswapMock.deploy();
    // await uniswapMock.waitForDeployment();

   
    // const USDTMock = await hre.ethers.getContractFactory("ERC20Mock");
    // const usdtMock = await USDTMock.deploy("Tether USD", "USDT", owner.address, ethers.parseUnits("1000000", 6));
    // await usdtMock.waitForDeployment();

    // Deploy Mock Tokens
    // const tokenMock1 = await USDTMock.deploy("Mock Token 1", "MTK1", owner.address, ethers.parseUnits("1000000", 18));
    // await tokenMock1.waitForDeployment();

    // const tokenMock2 = await USDTMock.deploy("Mock Token 2", "MTK2", owner.address, ethers.parseUnits("1000000", 18));
    // await tokenMock2.waitForDeployment();

    return { owner, wallet, USDCAddress, UNIRouter, realUSDTAddress,DAIAddress};
  }

  async function deployPaymentGateway() {
    const { owner, wallet, USDCAddress, UNIRouter,DAIAddress } = await deployMocks();

    // Deploy PaymentGateway contract
    const PaymentGateway = await hre.ethers.getContractFactory("PaymentGateway");
    const paymentGateway = await PaymentGateway.deploy(UNIRouter,USDCAddress);
    await paymentGateway.waitForDeployment();

    return { paymentGateway, owner, wallet,UNIRouter,USDCAddress};
  }

  describe("Deployment", function () {
    it("Should set the correct Uniswap router and USDT address", async function () {
      const { paymentGateway, UNIRouter, USDCAddress } = await loadFixture(deployPaymentGateway);

      expect(await paymentGateway.uniswapRouter()).to.equal(await UNIRouter);
      expect(await paymentGateway.usdt()).to.equal(await USDCAddress);
    });

    it("Should not deploy with same Address", async function(){
      const {owner,  paymentGateway, UNIRouter, USDCAddress } = await loadFixture(deployPaymentGateway);
       
      const PaymentGateway = await hre.ethers.getContractFactory("PaymentGateway");

      await expect(PaymentGateway.deploy(USDCAddress, USDCAddress)).to.be.rejectedWith("Error Same Token Address")
    })

    it("Should not deploy with Invalid Address", async function(){
      const {owner, paymentGateway, UNIRouter, USDCAddress } = await loadFixture(deployPaymentGateway);
       
      const PaymentGateway = await hre.ethers.getContractFactory("PaymentGateway");

      await expect(PaymentGateway.deploy(USDCAddress, ethers.ZeroAddress)).to.be.rejectedWith("Invalid Address")
    })
  });

 
 







});

import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-toolbox/network-helpers");

const main = async () => {

    const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

    const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const realUSDTAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const theAddressIFoundWithUSDCAndDAI = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";
    const theAddressIFoundWithoutUSDCAndDAI = "0xf02D8F51FcaB2cB0DEE31712c11D01C7fcE25B3D";

    let AmtADesired = ethers.parseUnits('100000', 6);
    let AmtBDesired = ethers.parseUnits('100000', 18);

    let AmtAMin = ethers.parseUnits('99000', 6);
    let AmtBMin = ethers.parseUnits('99000', 18);

    let deadline = await helpers.time.latest() + 300;


    await helpers.impersonateAccount(theAddressIFoundWithUSDCAndDAI);
    const impersonatedSigner = await ethers.getSigner(theAddressIFoundWithUSDCAndDAI);

    let usdcContract = await ethers.getContractAt('IERC20', USDCAddress);
    let daiContract = await ethers.getContractAt('IERC20', DAIAddress);
    let uniswapContract = await ethers.getContractAt('IUniswap', UNIRouter);
    const PaymentGateway = await ethers.getContractFactory("PaymentGateway");
    const paymentGateway = await PaymentGateway.deploy(UNIRouter, realUSDTAddress);
    await paymentGateway.waitForDeployment();
    const address = await paymentGateway.getAddress();
    console.log('PaymentGateway deployed to:', address);

    const deboehhn = await paymentGateway.getTokenBalancesAndUSDTValue(impersonatedSigner.address, [USDCAddress, DAIAddress]);

    console.log('deboehhn:', deboehhn)

    const usdcBal = await usdcContract.balanceOf(impersonatedSigner.address);
    const daiBal = await daiContract.balanceOf(impersonatedSigner.address);

    const daiBalRich = await daiContract.balanceOf(theAddressIFoundWithoutUSDCAndDAI);
    console.log('daiBalRich:', ethers.formatUnits(daiBalRich, 18))

    console.log('impersonneted acct usdc bal BA:', ethers.formatUnits(usdcBal, 6))

    console.log('impersonneted acct dai bal BA:', ethers.formatUnits(daiBal, 18))

    await usdcContract.connect(impersonatedSigner).approve(UNIRouter, AmtADesired);
    await daiContract.connect(impersonatedSigner).approve(await paymentGateway.getAddress(), AmtBDesired);

    await paymentGateway.connect(impersonatedSigner).makePayment(DAIAddress, USDCAddress, 100, theAddressIFoundWithoutUSDCAndDAI, 10)

    const daiBalAfterRich = await daiContract.balanceOf(theAddressIFoundWithoutUSDCAndDAI);
    const daiUSDCAfterRich = await usdcContract.balanceOf(theAddressIFoundWithoutUSDCAndDAI);
    console.log('daiBalAfterRich:', ethers.formatUnits(daiBalAfterRich, 18))
    console.log('daiUSDCAfterRich:', ethers.formatUnits(daiUSDCAfterRich, 6))
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
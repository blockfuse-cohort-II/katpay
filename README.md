# KatPay - Payment Gateway on Uniswap

**KatPay** is a decentralized payment gateway that allows users to swap ERC-20 tokens using Uniswap V2. It enables seamless token payments by converting any supported token into USDT and then into the recipient’s preferred token.

## Features

- Retrieve token balances and their USDT equivalent using Uniswap V2.
- Swap tokens for payments while considering slippage.
- Automate token conversions through the Uniswap V2 router.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [Hardhat](https://hardhat.org/)
- [Ethers.js](https://docs.ethers.io/)
- [dotenv](https://www.npmjs.com/package/dotenv) for environment variable management.

## Setup

1. Clone the repository:

   ```sh
   git clone https://github.com/your-repo/KatPay.git
   cd KatPay
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a `.env` file and configure:

   ```
   PRIVATE_KEY=your_private_key
   ALCHEMY_API_URL=https://eth-mainnet.alchemyapi.io/v2/your-api-key
   ```

## Deployment

Deploy the contract using Hardhat:

```sh
npx hardhat run scripts/deploy.ts --network goerli
```

Replace `goerli` with your preferred network.

## Usage

### Get Token Balances in USDT Value

Call `getTokenBalancesAndUSDTValue(walletAddress, tokenAddresses)` to fetch a wallet’s balances and their equivalent value in USDT.

### Make a Payment

Invoke `makePayment(tokenIn, tokenOut, usdtAmount, receiver, slippage)`, where:

- `tokenIn`: ERC-20 token being used for payment.
- `tokenOut`: Desired token for the receiver.
- `usdtAmount`: Amount in USDT to be converted.
- `receiver`: Address receiving the final token.
- `slippage`: Acceptable price deviation in percentage.

## Hardhat Commands

Run tests:

```sh
npx hardhat test
```

Start a local Hardhat network:

```sh
npx hardhat node
```

Deploy the contract using Hardhat Ignition:

```sh
npx hardhat ignition deploy ./ignition/modules/PaymentGateway.ts
```

## License

This project is licensed under the **MIT License**.

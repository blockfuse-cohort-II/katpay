// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

/// @notice Minimal ERC20 interface.
interface IERC20 {
    function balanceOf(address account) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function transfer(address to, uint256 amount) external returns (bool);
}

interface IUniswapV2Router02 {
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
    function swapExactTokensForTokens(
         uint amountIn,
         uint amountOutMin,
         address[] calldata path,
         address to,
         uint deadline
    ) external returns (uint[] memory amounts);
}

contract PaymentGateway {
    address public uniswapRouter;
    address public usdt; // Address of USDT token

    constructor(address _uniswapRouter, address _usdt) {
        uniswapRouter = _uniswapRouter;
        usdt = _usdt;
    }

    struct TokenInfo {
        address token;
        uint256 balance;
        uint256 usdtValue;
    }

    function getTokenBalancesAndUSDTValue(address wallet, address[] calldata tokens) external view returns (TokenInfo[] memory) {
        TokenInfo[] memory tokenInfos = new TokenInfo[](tokens.length);
        for (uint i = 0; i < tokens.length; i++) {
            uint256 balance = IERC20(tokens[i]).balanceOf(wallet);
            uint256 usdtValue = 0;
            if (balance > 0) {
                address[] memory path = new address[](2);
                path[0] = tokens[i];
                path[1] = usdt;
                // Get the USDT value for the token balance.
                try IUniswapV2Router02(uniswapRouter).getAmountsOut(balance, path) returns (uint[] memory amounts) {
                    usdtValue = amounts[1];
                } catch {
                    usdtValue = 0;
                }
            }
            tokenInfos[i] = TokenInfo(tokens[i], balance, usdtValue);
        }
        return tokenInfos;
    }


    function makePayment(
        address tokenIn,
        address tokenOut,
        uint256 usdtAmount,
        address receiver,
        // uint256 deadline,
        uint256 slippage
    ) external {

        // Calculate deadline as current block time plus 20 minutes
        uint256 deadline = block.timestamp + 20 minutes;
        // First, compute the expected amount of tokenOut from the given USDT value.
        address[] memory pathForOut = new address[](2);
        pathForOut[0] = usdt;
        pathForOut[1] = tokenOut;
        uint[] memory amountsOut = IUniswapV2Router02(uniswapRouter).getAmountsOut(usdtAmount, pathForOut);
        uint256 expectedTokenOut = amountsOut[1];

        // Define the swap path: tokenIn -> USDT -> tokenOut.
        address[] memory path = new address[](3);
        path[0] = tokenIn;
        path[1] = usdt;
        path[2] = tokenOut;
        
        // Calculate how many tokenIn are required to obtain the desired USDT amount.
        uint[] memory amountsIn = IUniswapV2Router02(uniswapRouter).getAmountsIn(usdtAmount, path);
        uint256 requiredTokenIn = amountsIn[0];

        // Transfer the required tokenIn amount from the payer.
        require(IERC20(tokenIn).transferFrom(msg.sender, address(this), requiredTokenIn), "Transfer of tokenIn failed");

        // Approve Uniswap router to spend tokenIn.
        IERC20(tokenIn).approve(uniswapRouter, requiredTokenIn);

        // Adjust for slippage: determine the minimum acceptable tokenOut amount.
        uint256 minTokenOut = expectedTokenOut * (100 - slippage) / 100;

        // Execute the swap on Uniswap and send the resulting tokenOut directly to the receiver.
        IUniswapV2Router02(uniswapRouter).swapExactTokensForTokens(
            requiredTokenIn,
            minTokenOut,
            path,
            receiver,
            deadline
        );
    }
}

import { Contract } from '../../src/contract';
  
const uniswapRouterContract = new Contract('UniswapRouter');

const usdcToken = 'a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const daiToken = '6b175474e89094c44da98b954eedeac495271d0f'
const tetherToken = 'dac17f958d2ee523a2206206994597c13d831ec7'
const wbtcToken = '2260fac5e5542a773aa44fbcfedf7c193bc2c599'

let token = usdcToken
let amountTokenDesired = 50000000
let exchangeRate = 344.69
let tolerance = 0.9
let ethAmount = Math.floor(amountTokenDesired * 1e12 / exchangeRate)
let to = '0x793F2aA4Cd841A2a64a8AB928ce6011662f565Fe'
let deadline = Math.floor(Date.now() / 1000) + 3600
let amountTokenMin =  Math.floor(amountTokenDesired * tolerance)
let amountETHMin = Math.floor(ethAmount * tolerance)

let { data, amount, address } = uniswapRouterContract.methods()
  .addLiquidityETH.call({ deadline: deadline, token: token, amountTokenDesired: amountTokenDesired, amountTokenMin: amountTokenMin, amountETHMin: amountETHMin, to: to });

console.log(`\nTo addLiquidityETH ${deadline} ${token} ${amountTokenDesired} ${amountTokenMin} ${amountETHMin} ${to}, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${ethAmount} ETH`);
console.log(`To: ${address}`);

import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

// Example to swap from 0.01 ETH to DAI

async function sendBitGoTx() {
  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const DAIContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const amountOutMinimum = 50e17;
  const amountIn = 1e16;
  const wrappedEtherContractAddress = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';
  const walletAddress = '0x6f32a7e465d50f61df96dfffc5bfb6d4059c7cd6';
  const fee = '3000';
  const sqrtPriceLimitX96 = '0';
  const deadline = 'deadline';

  const swapRouter = getContractsFactory('eth')
    .getContract('UniswapV3SwapRouter')
    .instance();
  const txInput = swapRouter.methods().exactInputSingle.call({
    tokenIn: wrappedEtherContractAddress,
    tokenOut: DAIContractAddress,
    fee: fee,
    recipient: walletAddress,
    deadline: deadline,
    amountIn: amountIn.toString(10),
    amountOutMinimum: amountOutMinimum,
    sqrtPriceLimitX96: sqrtPriceLimitX96,
  });

  txInput.amount = amountIn.toString(10);
  const transaction = await bitGoWallet.send({
    data: txInput.data,
    amount: txInput.amount,
    address: swapRouter.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);
}

sendBitGoTx();

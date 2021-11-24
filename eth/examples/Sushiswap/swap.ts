import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';


// Example to swap from 0.01 ETH to DAI

async function sendBitGoTx() {
  const DAIContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const wrappedEtherContractAddress = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';
  const toAddress = 'wallet address';
  const amountOutMin = 50e17;
  const deadline = 'deadline';
  const swapRouter = getContractsFactory('eth').getContract('SushiswapV2Router').instance();
  const path = [wrappedEtherContractAddress, DAIContractAddress];
 
  const txInput = swapRouter.methods().swapExactETHForTokens.
call({ amountOutMin: amountOutMin.toString(10), path: path, to: toAddress, deadline: deadline });

  txInput.amount = 1e16;
  console.log(`To swap ETH to DAI with  SushiswapV2Router contract, send:`);
  console.log(`Data: ${txInput.data}`);
  console.log(`Amount: ${txInput.amount}`);
  console.log(`To: ${swapRouter.address}`);


  const bitGo = new BitGo({ env: 'test', accessToken:
'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin
    .wallets()
    .get({ id: 'walletId' });

  
  const transaction = await bitGoWallet.send({
    data: txInput.data, amount: txInput.amount, address: swapRouter.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);
}

sendBitGoTx();

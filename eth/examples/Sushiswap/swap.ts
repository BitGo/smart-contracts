import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';


// Example to swap from 0.01 ETH to DAI

async function sendBitGoTx() {
  const DAIContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const amountOutMin = '5604703456315089187';

  const wrappedEtherContractAddress = '0xd0A1E359811322d97991E03f863a0C30C2cF029C';

  const toAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';

  const swapRouter = getContractsFactory('eth').getContract('SushiswapV2Router02').instance();

  const path = [wrappedEtherContractAddress, DAIContractAddress];
  const deadline = '1633431336';
  const txInput = swapRouter.methods().swapExactETHForTokens.
call({ amountOutMin: amountOutMin, path: path, to: toAddress, deadline: deadline });

  txInput.amount = '10000000000000000';
  console.log(`To swap ETH to DAI with  SushiswapV2Router02 contract, send:`);
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

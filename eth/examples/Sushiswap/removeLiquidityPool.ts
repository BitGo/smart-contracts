import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

async function sendBitGoTx() {
  const tokenAContractAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; //UNI
  const tokenBContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; //DAI

  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  const liquidity = '220509162040';
  const amountAMin = '20695021634680454';
  const amountBMin = '9949999999972479590';
  const deadline = '1636486532';
  const v = 'v';
  const r = 'r';
  const s = 's';

  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const liquidityPoolContract = getContractsFactory('eth')
    .getContract('SushiswapV2Router02')
    .instance('default');

  const { data, amount } = liquidityPoolContract
    .methods()
    .removeLiquidityWithPermit.call({
      tokenA: tokenAContractAddress,
      tokenB: tokenBContractAddress,
      liquidity: liquidity,
      amountAMin: amountAMin,
      amountBMin: amountBMin,
      to: walletAddress,
      deadline: deadline,
      v: v,
      r: r,
      s: s,
    });

  const transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: liquidityPoolContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);
}

sendBitGoTx();

import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

//remove DAI/ETH Liquidity Pool
async function sendBitGoTx() {
  const liquidity = '1318223252018799158';
  const tokenContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; //DAI
  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  const amountTokenMin = '53908965678479786810';
  const amountETHMin = '9950000000000000';
  const deadline = '1633453844';
  const v = 'v';
  const r = 'r';
  const s = 's';

  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const liquidityPoolContract = getContractsFactory('eth')
    .getContract('UniswapV2SwapRouter')
    .instance();

  const { data, amount } = liquidityPoolContract
    .methods()
    .addLiquidityETH.call({
      token: tokenContractAddress,
      liquidity,
      amountTokenMin,
      amountETHMin,
      to: walletAddress,
      deadline,
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

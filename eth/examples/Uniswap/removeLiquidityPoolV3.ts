import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

//remove DAI/ETH Liquidity Pool
async function sendBitGoTx() {
 
  const tokenId = '7387';
  const liquidity = '1980847311146948948';
  const amount0Min = '87250369302256362';
  const amount1Min = '42776168301443947341';
  const deadline = '1636519720';
  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const liquidityPoolContract = getContractsFactory('eth')
    .getContract('UniswapV3NonfungiblePositionManager')
    .instance();

  const data1 = liquidityPoolContract
    .methods()
    .decreaseLiquidity.call({
      tokenId,
      liquidity,
      amount0Min,
      amount1Min,
      deadline,
    });

  const recipient = 'walletAddress';
  const amount0Max = '340282366920938463463374607431768211455';
  const amount1Max = '340282366920938463463374607431768211455';

  const data2 = liquidityPoolContract
    .methods()
    .collect.call({
      tokenId,
      recipient,
      amount0Max,
      amount1Max,
    });

  const dataBytes = [data1.data, data2.data];
  
  const { data, amount } = liquidityPoolContract
    .methods()
    .multicall.call({ data: dataBytes });


  const transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: liquidityPoolContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);
}

sendBitGoTx();

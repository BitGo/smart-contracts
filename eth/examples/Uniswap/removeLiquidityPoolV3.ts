import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

//remove DAI/ETH Liquidity Pool
async function sendBitGoTx() {
 
  const DAIContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const tokenId = 'tokenId'; // you can get the id calling balanceOf and tokenOfOwnerByIndex
  const liquidity = 18e17;
  const amount0Min = 80e15; //eth
  const amount1Min = 40e18; //dai
  const deadline = 'deadline';
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
      liquidity: liquidity.toString(10),
      amount0Min: amount0Min.toString(10),
      amount1Min: amount1Min.toString(10),
      deadline,
    });

  const recipient = 'walletAddress';
  const amountMax = '340282366920938463463374607431768211455';

  const data2 = liquidityPoolContract
    .methods()
    .collect.call({
      tokenId,
      recipient,
      amount0Max: amountMax,
      amount1Max: amountMax,
    });

  const data3 = liquidityPoolContract
    .methods()
    .unwrapWETH9.call({
      amountMinimum: amount1Min.toString(10),
      recipient,
    });

  const data4 = liquidityPoolContract
    .methods()
    .sweepToken.call({
      token: DAIContractAddress,
      amountMinimum: amount0Min.toString(10),
      recipient,
    });
  const dataBytes = [data1.data, data2.data, data3.data, data4.data];
  
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

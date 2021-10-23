import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

async function sendBitGoTx() {
  const tokenA = 'DAI';
  const tokenB = 'UNI';

  const tokenAContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const tokenBContractAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';

  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';

  const amountADesired = '100000000000000000000';
  const amountBDesired = '25462061812432604';

  const amountAMin = '99500000000000000000';
  const amountBMin = '25334751503370441';
  const deadline = '1633453844';

  const bitGo = new BitGo({ env: 'test', accessToken:
  'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin
      .wallets()
      .get({ id: 'walletId' });


  const liquidityPoolContract = getContractsFactory('eth')
.getContract('SushiswapV2Router02')
.instance('default');

  const tokenAContract = getContractsFactory('eth')
  .getContract('StandardERC20')
  .instance(tokenA);

  let { data, amount } = tokenAContract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amountADesired,
  });

  let transaction = await bitGoWallet.send({
    data: data, amount: amount, address: tokenAContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  //  we need to approve the amount of DAI for the liquidityPool contract to control
  console.log(
    `To approve ${amountADesired} ${tokenA} to DAI token contract, send:`,
  );
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount}`);

  const tokenBContract = getContractsFactory('eth')
  .getContract('StandardERC20')
  .instance(tokenB);

  ({ data, amount } = tokenBContract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amountBDesired,
  }));

  transaction = await bitGoWallet.send({
    data: data, amount: amount, address: tokenBContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  //we need to approve the amount of UNI for the liquidityPool contract to control
  console.log(
    `To approve ${amountBDesired} ${tokenB} to UNI token contract, send:`,
  );
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount}`);

  ({ data, amount } = liquidityPoolContract.methods().addLiquidity.call({
    tokenA: tokenAContractAddress,
    tokenB: tokenBContractAddress,
    amountADesired: amountADesired,
    amountBDesired: amountBDesired,
    amountAMin: amountAMin,
    amountBMin: amountBMin,
    to: walletAddress,
    deadline: deadline,
  }));

  transaction = await bitGoWallet.send({
    data: data, amount: amount, address: liquidityPoolContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);

  // Once the above txs are confirmed, we can  create swap liquidity pool
  console.log(`To create liquidity pool with pair of ${tokenA} ${tokenB}, send: `);
  console.log(`${tokenA} amount: ${amountADesired} and ${tokenB} amount: ${amountBDesired} `);
  console.log(`to: ${liquidityPoolContract.address}`);
}


sendBitGoTx();

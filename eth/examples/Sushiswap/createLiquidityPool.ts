import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

async function sendBitGoTx() {
  const tokenA = 'DAI';
  const tokenB = 'UNI';
  const walletAddress = 'wallet addresses';
  const amountADesired = 100e18; // amount of DAI desired
  const amountBDesired = 250e14; // amount of UNI desired
  const amountAMin = 995e17; //minimum amout of DAI 
  const amountBMin = 254e14; // minimum amout of UNI
  const deadline = 'deadline';

  const bitGo = new BitGo({ env: 'test', accessToken:
  'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin
      .wallets()
      .get({ id: 'walletId' });


  const liquidityPoolContract = getContractsFactory('eth')
.getContract('SushiswapV2Router')
.instance();

  const tokenAContract = getContractsFactory('eth')
  .getContract('StandardERC20')
  .instance(tokenA);

  let { data, amount } = tokenAContract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amountADesired.toString(10),
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
    _value: amountBDesired.toString(10),
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
    tokenA: tokenAContract.address,
    tokenB: tokenBContract.address,
    amountADesired: amountADesired.toString(10),
    amountBDesired: amountBDesired.toString(10),
    amountAMin: amountAMin.toString(10),
    amountBMin: amountBMin.toString(10),
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

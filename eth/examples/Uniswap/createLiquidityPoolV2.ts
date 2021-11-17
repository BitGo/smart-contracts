import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

//create DAI/ETH Liquidity Pool
async function sendBitGoTx() {
  const token = 'DAI';
  const walletAddress = 'wallet address';
  const amountTokenDesired = 54e18;
  const amountTokenMin = 53e18;
  const amountETHMin = 995e13;
  const deadline = 'deadline';

  const bitGo = new BitGo({ env: 'test', accessToken:
  'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin
      .wallets()
      .get({ id: 'walletId' });


  const liquidityPoolContract = getContractsFactory('eth')
      .getContract('UniswapV2SwapRouter')
      .instance();

  //  we need to approve the amount of DAI for the liquidityPool contract to control
  const tokenContract = getContractsFactory('eth')
  .getContract('StandardERC20')
  .instance(token);

  let { data, amount } = tokenContract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amountTokenDesired.toString(10),
  });

  let transaction = await bitGoWallet.send({
    data: data, amount: amount, address: tokenContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(
    `To approve ${amountTokenDesired} ${token} to DAI token contract, send:`,
  );
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount}`);
  

  ({ data, amount } = liquidityPoolContract.methods().addLiquidityETH.call({
    token: tokenContract.address,
    amountTokenDesired: amountTokenDesired.toString(10),
    amountTokenMin: amountTokenMin.toString(10),
    amountETHMin: amountETHMin.toString(10),
    to: walletAddress,
    deadline,
  }));

  transaction = await bitGoWallet.send({
    data: data, amount: amount, address: liquidityPoolContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);

}


sendBitGoTx();

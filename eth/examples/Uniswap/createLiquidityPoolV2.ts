import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

//create DAI/ETH Liquidity Pool
async function sendBitGoTx() {
  const token = 'DAI';
  const tokenContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  const amountTokenDesired = '54179865003497273176';
  const amountTokenMin = '53908965678479786810';
  const amountETHMin = '9950000000000000';
  const deadline = '1633453844';

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
    _value: amountTokenDesired,
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
    token: tokenContractAddress,
    amountTokenDesired,
    amountTokenMin,
    amountETHMin,
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

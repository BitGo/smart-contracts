import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';

async function sendBitGoTx() {
  const token0 = 'UNI';
  const token1 = 'DAI';
  const token0ContractAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984';
  const token1ContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const walletAddress = '0x6f32a7e465d50f61df96dfffc5bfb6d4059c7cd6';
  const fee = '3000';
  const tickLower = '-887220';
  const tickUpper = '887220';
  const amount0Desired = 148e14;
  const amount1Desired = 499e17;
  const amount0Min = 147e14;
  const amount1Min = 498e17;
  const deadline = 'deadline';

  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const liquidityPoolContract = getContractsFactory('eth')
    .getContract('UniswapV3NonfungiblePositionManager')
    .instance();

  const token0Contract = getContractsFactory('eth')
    .getContract('StandardERC20')
    .instance(token0);

  let { data, amount } = token0Contract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amount0Desired.toString(10),
  });

  //  we need to approve the amount of UNI for the liquidityPool contract to control
  console.log(
    `To approve ${amount0Desired} ${token0} to UNI token contract, send:`,
  );
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount}`);

  let transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: token0Contract.address,
    walletPassphrase: 'walletPassphrase',
  });

  const token1Contract = getContractsFactory('eth')
    .getContract('StandardERC20')
    .instance(token1);

  ({ data, amount } = token1Contract.methods().approve.call({
    _spender: liquidityPoolContract.address,
    _value: amount1Desired.toString(10),
  }));

  //we need to approve the amount of DAI for the liquidityPool contract to control
  console.log(
    `To approve ${amount1Desired} ${token1} to DAI token contract, send:`,
  );
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount}`);

  transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: token1Contract.address,
    walletPassphrase: 'walletPassphrase',
  });

  ({ data, amount } = liquidityPoolContract.methods().mint.call({
    token0: token0ContractAddress,
    token1: token1ContractAddress,
    fee: fee,
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: amount0Desired.toString(10),
    amount1Desired: amount1Desired.toString(10),
    amount0Min: amount0Min.toString(10),
    amount1Min: amount1Min.toString(10),
    recipient: walletAddress,
    deadline: deadline,
  }));

  // Once the above txs are confirmed, we can  create swap liquidity pool
  console.log(
    `To create liquidity pool with pair of ${token0} ${token1}, send: `,
  );
  console.log(
    `${token0} amount: ${amount0Desired} and ${token1} amount: ${amount1Desired} `,
  );
  console.log(`to: ${liquidityPoolContract.address}`);

  transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: liquidityPoolContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);
}

sendBitGoTx();

import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';
import * as utils from '../utils';
import * as ethUtil from 'ethereumjs-util';
//remove DAI/ETH Liquidity Pool
async function sendBitGoTx() {
  const liquidity = 10e18;
  const tokenContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; //DAI
  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  const amountTokenMin = 99e18;
  const amountETHMin = 9e15;
  const deadline = 'deadline';
 

  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const liquidityPoolContract = getContractsFactory('eth')
    .getContract('UniswapV2SwapRouter')
    .instance();
  const chainId = 1;
  const uniSwapV2FactoryContractAddress = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f';
  const sampleWalletAddress = '0x6c31cdbf161bad81f9eceb107d757cb85f2dbcab';
  const spender = liquidityPoolContract.address;
  const value = liquidity.toString(10);
  const nonce = 'nonce';
  const name = 'Uniswap V2';
  const permitApprovalHash = utils.getUniSushiSwapV2ApprovalHash(sampleWalletAddress, spender, value, nonce, deadline);
  const domainSeperatorHash = utils.getUniSushiSwapV2PairDomainSeperatorHash(name, chainId, uniSwapV2FactoryContractAddress);
  const digest = utils.getMasterContractApprovalHash(domainSeperatorHash, permitApprovalHash);
  const privateKeyHex = 'privateKeyHex';
  const privkey = Buffer.from(privateKeyHex.replace(/^0x/i, ''), 'hex');
  const signature = ethUtil.ecsign(digest, privkey);

  const v = signature.v;
  const r = ethUtil.addHexPrefix(signature.r.toString('hex'));
  const s = ethUtil.addHexPrefix(signature.s.toString('hex'));

  const { data, amount } = liquidityPoolContract
    .methods()
    .addLiquidityETH.call({
      token: tokenContractAddress,
      liquidity: liquidity.toString(10),
      amountTokenMin: amountTokenMin.toString(10),
      amountETHMin: amountETHMin.toString(10),
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

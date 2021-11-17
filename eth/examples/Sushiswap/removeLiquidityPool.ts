import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';
import * as utils from '../utils';
import * as ethUtil from 'ethereumjs-util';
async function sendBitGoTx() {
  const tokenAContractAddress = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'; //UNI
  const tokenBContractAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'; //DAI

  const walletAddress = '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  const liquidity = 220e9;
  const amountAMin = 20e15;
  const amountBMin = 99e18;
  const deadline = 'deadline';

  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });
  const liquidityPoolContract = getContractsFactory('eth')
  .getContract('SushiswapV2Router')
  .instance();

  const chainId = 1;
  const sushiSwapV2FactoryContractAddress = '0xC0AEe478e3658e2610c5F7A4A2E1777cE9e4f2Ac';
  const sampleWalletAddress = '0x6c31cdbf161bad81f9eceb107d757cb85f2dbcab';
  const spender = liquidityPoolContract.address;
  const value = liquidity.toString(10);
  const nonce = 'nonce';
  const name = 'SushiSwap LP Token';
  const permitApprovalHash = utils.getUniSushiSwapV2ApprovalHash(sampleWalletAddress, spender, value, nonce, deadline);
  const domainSeperatorHash = utils.getUniSushiSwapV2PairDomainSeperatorHash(name, chainId, sushiSwapV2FactoryContractAddress);
  const digest = utils.getMasterContractApprovalHash(domainSeperatorHash, permitApprovalHash);
  const privateKeyHex = 'privateKeyHex';
  const privkey = Buffer.from(privateKeyHex.replace(/^0x/i, ''), 'hex');
  const signature = ethUtil.ecsign(digest, privkey);

  const v = signature.v;
  const r = ethUtil.addHexPrefix(signature.r.toString('hex'));
  const s = ethUtil.addHexPrefix(signature.s.toString('hex'));
 

  const { data, amount } = liquidityPoolContract
    .methods()
    .removeLiquidityWithPermit.call({
      tokenA: tokenAContractAddress,
      tokenB: tokenBContractAddress,
      liquidity: liquidity.toString(10),
      amountAMin: amountAMin.toString(10),
      amountBMin: amountBMin.toString(10),
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

import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';
// Example to lend USDT in Kashi

async function sendBitGoTx() {
  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const token = 'USDT';
  const bentoBoxV1ContractAddress = '0xF5BCE5077908a1b7370B9ae04AdC565EBd643966';
  //approve USDT
  const tokenContract = getContractsFactory('eth')
    .getContract('StandardERC20')
    .instance(token);

  const value = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
  let { data, amount } = tokenContract.methods().approve.call({
    _spender: bentoBoxV1ContractAddress,
    _value: value,
  });

  let transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: tokenContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  // lend USDT in Kashi
  
  /*
   * 24 ACTION_BENTO_SETAPPROVAL ParamNames user, _masterContract, approved, v, r, s. ABI encoding address, address, bool, uint8, bytes32, bytes32
   * for information in v, r, s visit https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
   * userAddress= walletAddress
   * _masterContract=KashiPairMediumRiskV1 contract Address
   * example dataForAction24 ='0x
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 0000000000000000000000002cba6ab6574646badc84f0544d05059e57a5dc42 (KashiPairMediumRiskV1 contract Address)
   * 0000000000000000000000000000000000000000000000000000000000000001 (approved)
   * 000000000000000000000000000000000000000000000000000000000000001c (v)
   * 45dcc6b8a59747de4424b7f11e5cfadd0399579d24ec91d433c8fda4d8b26246 (r)
   * 0d135ac427b217fe96dfbd86f97fe904f68dbb87538feec734f07af9ab9fd9c3' (s)
   * 
   * 20 ACTION_BENTO_DEPOSIT ParamNames token, to, amount, share. ABI encoding IERC20, address, int256, int256
   * example dataForAction20='0x
   * 000000000000000000000000dac17f958d2ee523a2206206994597c13d831ec7 (USDT contract Address)
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 00000000000000000000000000000000000000000000000000000000017b31ee (amount)
   * 0000000000000000000000000000000000000000000000000000000000000000' (share)
   * 1 ACTION_ADD_ASSET ParamNames share, to, skim. ABI encoding int256, address, bool
   * example dataForAction1='0x
   * fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe (share)
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 0000000000000000000000000000000000000000000000000000000000000000' (skim)
   */
  const actions = ['24', '20', '1'];
  const values = ['0', '0', '0'];
  
  const datas = ['dataForAction24', 'dataForAction20', 'dataForAction1'];
  const lendContract = getContractsFactory('eth')
  .getContract('KashiPairMediumRiskV1')
  .instance();


  ({ data, amount } = lendContract.methods().cook.call({
    actions,
    values,
    datas,
  }));

  transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: lendContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);


}

sendBitGoTx();

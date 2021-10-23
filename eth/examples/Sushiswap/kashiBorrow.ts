import { getContractsFactory } from '../../../src/index';
import { BitGo } from 'bitgo';
// Example to borrow DAI with  WETH as Collateral in Kashi

async function sendBitGoTx() {
  const bitGo = new BitGo({ env: 'test', accessToken: 'accesstoken' });
  const baseCoin = bitGo.coin('teth');
  const bitGoWallet = await baseCoin.wallets().get({ id: 'walletId' });

  const amountWETH = '20000000000000000';
  /*
   * 24 ACTION_BENTO_SETAPPROVAL ParamNames user, _masterContract, approved, v, r, s. ABI encoding address, address, bool, uint8, bytes32, bytes32
   * for information in v, r, s visit https://github.com/ethereum/EIPs/blob/master/EIPS/eip-155.md
   * example dataForAction24 ='0x
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 0000000000000000000000002cba6ab6574646badc84f0544d05059e57a5dc42 (KashiPairMediumRiskV1 contract Address)
   * 0000000000000000000000000000000000000000000000000000000000000001 (approved)
   * 000000000000000000000000000000000000000000000000000000000000001c (v)
   * 45dcc6b8a59747de4424b7f11e5cfadd0399579d24ec91d433c8fda4d8b26246 (r)
   * 0d135ac427b217fe96dfbd86f97fe904f68dbb87538feec734f07af9ab9fd9c3' (s)
   * 5 ACTION_BORROW ParamNames amount, to. ABI encoding int256, address.
   * example dataForAction5 ='0x
   * 0000000000000000000000000000000000000000000000028c418afbbb5c0000 (amount)
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab' (to)
   * 20 ACTION_BENTO_DEPOSIT ParamNames token, to, amount, share. ABI encoding IERC20, address, int256, int256
   * example dataForAction20 ='0x
   * 0000000000000000000000000000000000000000000000000000000000000000 (IERC20)
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 00000000000000000000000000000000000000000000000000470de4df820000 (amount)
   * 0000000000000000000000000000000000000000000000000000000000000000 (share)
   * 10 ACTION_ADD_COLLATERAL ParamNames share, to, skim. ABI encoding int256, address, bool
   * example dataForAction10 ='0x
   * fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe (share)
   * 0000000000000000000000006c31cdbf161bad81f9eceb107d757cb85f2dbcab (wallet Address)
   * 0000000000000000000000000000000000000000000000000000000000000000 (skim)
   */
  const actions = ['24', '5', '20', '10'];
  const values = ['0', '0', amountWETH, '0'];
  
  
  const datas = ['dataForAction24', 'dataForAction5', 'dataForAction20', 'dataForAction10'];
  const borrowContract = getContractsFactory('eth')
  .getContract('KashiPairMediumRiskV1')
  .instance();


  const { data, amount } = borrowContract.methods().cook.call({
    actions,
    values,
    datas,
  });

  const transaction = await bitGoWallet.send({
    data: data,
    amount: amount,
    address: borrowContract.address,
    walletPassphrase: 'walletPassphrase',
  });

  console.log(transaction);


}

sendBitGoTx();

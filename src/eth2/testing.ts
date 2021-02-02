const { EthContract } = require('./contracts/contracts');
const { EthDecoder } = require('./decoder/decoder');


const tokenName = 'DAI';
const recipient = '0xadd62287c10d90f65fd3bf8bf94183df115c030a';
const tokenAmount = 1e18; // 1 DAI

function main() {
  const daiContract = new EthContract('StandardERC20').instance(tokenName);

  const { data, amount } = daiContract.methods().transfer.call({ _to: recipient, _value: tokenAmount.toString(10) });

  console.log(`To transfer ${tokenAmount} ${tokenName} to ${recipient}:\n`);
  console.log(`Data: ${data}`);
  console.log(`Amount: ${amount} ETH`);
  console.log(`To: ${daiContract.address}`);


  console.log('////////// ** decoder ** ');

  const decoder = new EthDecoder();
  const decodedRandom = decoder.decode(
    Buffer.from(
      'a9059cbb0000000000000000000000002260fac5e5542a773aa44fbcfedf7c193bc2c599000000000000000000000000000000000000000000000000000000000003ae3e',
      'hex',
    ),
  );
  console.log(decodedRandom);

  const decodeDAI = decoder.decode(
    Buffer.from(
      'a9059cbb000000000000000000000000add62287c10d90f65fd3bf8bf94183df115c030a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
      'hex',
    ),
  );
  console.log('DAI decoded', decodeDAI);



}

main();

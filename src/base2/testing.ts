const { EthContract } = require('./contracts/contracts');

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
}

main();

import { Contract } from '../../src/contract';
  
const usdcName = 'UNI-V2-ETH-USDC';
const usdcPoolContract = new Contract('UNIPool').instance(usdcName);
const exitUsdc = usdcPoolContract.methods().exit.call({});

const usdtName = 'UNI-V2-ETH-USDT';
const usdtPoolContract = new Contract('UNIPool').instance(usdtName);
const exitUsdt = usdtPoolContract.methods().exit.call({});

const daiName = 'UNI-V2-ETH-DAI';
const daiPoolContract = new Contract('UNIPool').instance(daiName);
const exitDai = daiPoolContract.methods().exit.call({});

const wbtcName = 'UNI-V2-ETH-WBTC';
const wbtcPoolContract = new Contract('UNIPool').instance(wbtcName);
const exitWbtc = wbtcPoolContract.methods().exit.call({});

console.log(`----`)
console.log(`Data: ${exitUsdc.data}`);
console.log(`To: ${exitUsdc.address}\n`);
console.log(`Data: ${exitUsdt.data}`);
console.log(`To: ${exitUsdt.address}\n`);
console.log(`Data: ${exitDai.data}`);
console.log(`To: ${exitDai.address}\n`);
console.log(`Data: ${exitWbtc.data}`);
console.log(`To: ${exitWbtc.address}\n`);

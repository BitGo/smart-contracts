import * as abi from 'ethereumjs-abi';
import ethers from 'ethers';


const APPROVAL_SIGNATURE_HASH =
ethers.utils.keccak256(ethers.utils.toUtf8Bytes('SetMasterContractApproval(string warning,address user,address masterContract,bool approved,uint256 nonce)'));
const WARNING_MESSAGE_HASH =
ethers.utils.keccak256(ethers.utils.toUtf8Bytes('Give FULL access to funds in (and approved to) BentoBox?'));
const EIP191_PREFIX_FOR_EIP712_STRUCTURED_DATA = '\x19\x01';
const DOMAIN_SEPARATOR_SIGNATURE_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('EIP712Domain(string name,uint256 chainId,address verifyingContract)'));
const SUSHISWAPV2PAIR_DOMAIN_SEPERATOR_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)'));
const BENTOBOX_HASH = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('BentoBox V1'));
const SUSHISWAP_PERMIT_TYPEHASH = 0x6e71edae12b1b97f4d1f60370fef10105fa2faae0126114a169c64845d6126c9;
export const MAX_VALUE_SHARE = 115792089237316195423570985008687907853269984665640564039457584007913129639934;
export function getKashiApprovalHash(
  user,
  master,
  approved,
  nonce,
) {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'address', 'address', 'bool', 'uint256'],
    [
      APPROVAL_SIGNATURE_HASH,
      WARNING_MESSAGE_HASH,
      user,
      master,
      approved,
      nonce,
    ],
  ));
}

export function getKashiDomainSeperatorHash(
  chainId,
  address,
) {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ['string', 'string', 'string', 'uint256', 'address'],
    [
      DOMAIN_SEPARATOR_SIGNATURE_HASH,
      BENTOBOX_HASH,
      chainId,
      address,
    ],
  ));
}

export function getUniSushiSwapV2PairDomainSeperatorHash(
  name,
  chainId,
  address,
) {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ['bytes32', 'bytes32', 'bytes32', 'uint', 'address'],
    [
      SUSHISWAPV2PAIR_DOMAIN_SEPERATOR_HASH,
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(name)),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes('1')),
      chainId,
      address,
    ],
  ));
}


export function getUniSushiSwapV2ApprovalHash(
  owner,
  spender,
  value,
  nonce,
  deadline,
) {
  return ethers.utils.keccak256(ethers.utils.defaultAbiCoder.encode(
    ['bytes32', 'address', 'address', 'uint', 'uint', 'uint'],
    [
      SUSHISWAP_PERMIT_TYPEHASH,
      owner,
      spender,
      value,
      nonce,
      deadline,
    ],
  ));
}

export function getMasterContractApprovalHash (
  domainSeperatorHash,
  kashiApprovalHash,
) {
  return abi.soliditySHA3(
    ['string', 'bytes32', 'bytes32'],
    [
      EIP191_PREFIX_FOR_EIP712_STRUCTURED_DATA,
      domainSeperatorHash,
      kashiApprovalHash,
       
    ],
  );
}

export const stripHexPrefix = (str: string): string => {
  if (typeof str !== 'string') {
    throw new Error(`[stripHexPrefix] input must be type 'string', received ${typeof str}`);
  }
  
  return ethers.utils.isHexString(str) ? str.slice(2) : str;
};


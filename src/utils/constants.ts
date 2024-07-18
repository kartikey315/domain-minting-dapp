export const WALLET_FACTORY_ADDRESS =
  "0x86beBfc804F9784b638B5B20f0577887c5B62A2e";

export const BUNDLER_RPC_URL = `https://api.stackup.sh/v1/node/${process.env.NEXT_PUBLIC_STACKUP_API_KEY}`;

export const WALLET_FACTORY_ABI = [
  {
    type: "constructor",
    inputs: [
      {
        name: "_entryPoint",
        type: "address",
        internalType: "contract IEntryPoint",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createAccount",
    inputs: [
      { name: "owners", type: "address[]", internalType: "address[]" },
      { name: "salt", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "contract Wallet" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getWalletAddress",
    inputs: [
      { name: "owners", type: "address[]", internalType: "address[]" },
      { name: "salt", type: "uint256", internalType: "uint256" },
    ],
    outputs: [{ name: "", type: "address", internalType: "address" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "walletImplementation",
    inputs: [],
    outputs: [{ name: "", type: "address", internalType: "contract Wallet" }],
    stateMutability: "view",
  },
] as const;

export const ENTRY_POINT_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint192",
        name: "key",
        type: "uint192",
      },
    ],
    name: "getNonce",
    outputs: [
      {
        internalType: "uint256",
        name: "nonce",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export const WALLET_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "dest",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "func",
        type: "bytes",
      },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

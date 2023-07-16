export type AptosResource<T = unknown> = {
  data: T;
  type: string;
};

export type OUSGWrapper = {
  mint_fee_ratio_bps: number;
  mint_flat_fee: number;
  recipient: string;
  recipient_chain: number;
  redeem_fee_ratio_bps: number;
  redeem_flat_fee: number;
  reserve: {
    value: number;
  };
  thousg_fees: {
    value: number;
  };
  usdc_fees: {
    value: number;
  };
};

export const aptosOndoAddress =
  "0xf5a0daefe578a4c73b1480505505631d7f27229bd9f7834beebb727941415397";

export const sepoliaClientRPCURL = "https://rpc.ankr.com/eth_sepolia";
export const aptosClientRPCURL = "https://aptos-testnet-rpc.allthatnode.com/v1";
export const aptosTokenBridgeAddress =
  "0x576410486a2da45eee6c949c995670112ddf2fbeedab20350d506328eefc9d4f";
export const ondoManagerEthereumAddress =
  "0xD641363D036eC8E28af27c39Ebe4810Ce1c3197d";
export const wormholeCoreBridgeAptos =
  "0x5bc11445584a763c1fa7ed39081f1b920954da14e04b32440cba863d03e19625";
export const wormholeCoreBridgeEth =
  "0x4a8bc80Ed5a4067f1CCf107057b8270E0cC11A78";
export const wormholeTokenBridgeEth =
  "0xDB5492265f6038831E89f495670FF909aDe94bd9";

export const wormholeAptosNetID = 22;
export const wormholeEthereumNetID = 10002;

export const MIN_BRIDGE_AMOUNT = 1000000;

export const ondoManagerABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_wormholeAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokenBridgeAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_usdcAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_ondoCashManagerAddress",
        type: "address",
      },
      {
        internalType: "address",
        name: "_adminAddress",
        type: "address",
      },
      {
        internalType: "uint16",
        name: "_foreignChainId",
        type: "uint16",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "Deposited",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes16",
        name: "from",
        type: "bytes16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdcAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint32",
        name: "nonce",
        type: "uint32",
      },
      {
        indexed: false,
        internalType: "uint16",
        name: "foreignChainId",
        type: "uint16",
      },
    ],
    name: "RedemptionInitiated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes16",
        name: "from",
        type: "bytes16",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "usdcAmount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "ousgAmount",
        type: "uint256",
      },
    ],
    name: "RedemptionRequested",
    type: "event",
  },
  {
    inputs: [],
    name: "admin",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedVM",
        type: "bytes",
      },
    ],
    name: "completeDeposit",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "encodedVM",
        type: "bytes",
      },
    ],
    name: "completeRedemptionRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "foreignChainId",
    outputs: [
      {
        internalType: "uint16",
        name: "",
        type: "uint16",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "foreignEmitterId",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "hasProcessedMessage",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "isAdmin",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "ondoCustodianAddress",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "pendingUSDCRedemption",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "redeemer",
        type: "bytes32",
      },
      {
        internalType: "uint32",
        name: "nonce",
        type: "uint32",
      },
    ],
    name: "redeemUSDC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "requestOndoMint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "newAdmin",
        type: "address",
      },
    ],
    name: "setAdmin",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "newArbiterFee",
        type: "uint256",
      },
    ],
    name: "setArbiterFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "emitterId",
        type: "bytes32",
      },
    ],
    name: "setForeignEmitterId",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

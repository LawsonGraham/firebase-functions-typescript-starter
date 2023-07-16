import {
  Provider,
  Network,
  AptosAccount,
  AptosClient,
  HexString,
  Types,
} from "aptos";
import { hexZeroPad } from "ethers/lib/utils";
import { ethers } from "ethers";
import {
  hexToUint8Array,
} from "@certusone/wormhole-sdk";
import {
  AptosResource,
  OUSGWrapper,
  aptosOndoAddress,
  aptosClientRPCURL,
  aptosTokenBridgeAddress,
  sepoliaClientRPCURL,
  ondoManagerEthereumAddress,
  ondoManagerABI,
  wormholeCoreBridgeAptos,
  MIN_BRIDGE_AMOUNT,
} from "./constants";

export const handleAptos = async (
  amount: number,
  relayerFee: number,
  nonce: number,
) => {
  const client = new AptosClient(aptosClientRPCURL);

  // query aptos contract for if we have enough usdc
  const ousg_wrapper = (
    (await client.getAccountResource(
      aptosOndoAddress,
      `${aptosOndoAddress}::ondo_wrapper::Wrapper`,
    )) as AptosResource<OUSGWrapper>
  ).data;

  if (ousg_wrapper.reserve.value < MIN_BRIDGE_AMOUNT) {
    throw new Error("Not enough OUSG in reserve");
  }

  const provider = new Provider(Network.TESTNET);
  const privKey = new HexString(process.env.APTOS_PRIVATE_KEY as string).toUint8Array();
  const account = new AptosAccount(privKey);

  const payload = {
    function: `${aptosOndoAddress}::ondo_wrapper::bridge`,
    type_arguments: [],
    arguments: [amount, relayerFee, nonce],
  };

  const rawTxn = await provider.generateTransaction(account.address(), payload);

  const signedTxn = AptosClient.generateBCSTransaction(account, rawTxn);

  const transactionRes = await provider.submitSignedBCSTransaction(signedTxn);
  console.log("Aptos bridge transaction: ", transactionRes.hash);

  const result = await client.waitForTransactionWithResult(transactionRes.hash);

  return result;
};

export const handleAptosRedemption = async (
  vaaBytes: string,
  redeemerAddress: string,
) => {
  const client = new AptosClient(aptosClientRPCURL);
  const provider = new Provider(Network.TESTNET);
  const privKey = new HexString(process.env.APTOS_PRIVATE_KEY as string).toUint8Array();
  const account = new AptosAccount(privKey);

  const payload = {
    function: `${aptosTokenBridgeAddress}::complete_transfer::submit_vaa_entry`,
    type_arguments: [
      "0x7407a4b33950dde1b1c0cb5e0da2d94db3b9ee3a6d643d8045a7b9eec75824b4::coin::T",
    ],
    arguments: [hexToUint8Array(vaaBytes), redeemerAddress],
  };
  console.log(payload);
  const rawTxn = await provider.generateTransaction(account.address(), payload);
  console.log("here");

  const signedTxn = AptosClient.generateBCSTransaction(account, rawTxn);
  console.log("fngfgnf");

  const transactionRes = await provider.submitSignedBCSTransaction(signedTxn);
  console.log("Aptos bridge transaction: ", transactionRes.hash);

  const result = await client.waitForTransactionWithResult(transactionRes.hash);

  return result;
};

export const handleEthereumMint = async (vaaBytes: string) => {
  const provider = new ethers.providers.JsonRpcProvider(sepoliaClientRPCURL);
  const signer = new ethers.Wallet(process.env.ETHEREUM_PRIV_KEY as string, provider);
  const ondoManager = new ethers.Contract(
    ondoManagerEthereumAddress,
    ondoManagerABI,
    signer,
  );

  const transactionRes = await ondoManager.completeDeposit(vaaBytes, {
    gasLimit: 1000000,
  });

  console.log("Ethereum mint transaction: ", transactionRes.hash);
  return transactionRes;
};

export const handleEthereumRedemptionRequest = async (vaaBytes: string) => {
  const provider = new ethers.providers.JsonRpcProvider(sepoliaClientRPCURL);
  const signer = new ethers.Wallet(process.env.ETHEREUM_PRIV_KEY as string, provider);
  const ondoManager = new ethers.Contract(
    ondoManagerEthereumAddress,
    ondoManagerABI,
    signer,
  );

  const transactionRes = await ondoManager.completeRedemptionRequest(vaaBytes, {
    gasLimit: 1000000,
  });

  console.log("Ethereum redemption transaction: ", transactionRes.hash);
  return transactionRes;
};

export const handleEthereumRedeemUSDC = async (
  redeemerAddress: string,
  nonce: number,
) => {
  const provider = new ethers.providers.JsonRpcProvider(sepoliaClientRPCURL);
  const signer = new ethers.Wallet(process.env.ETHEREUM_PRIV_KEY as string, provider);
  const ondoManager = new ethers.Contract(
    ondoManagerEthereumAddress,
    ondoManagerABI,
    signer,
  );

  const transactionRes = await ondoManager.redeemUSDC(redeemerAddress, nonce, {
    gasLimit: 1000000,
  });

  console.log("Ethereum redeem USDC transaction: ", transactionRes.hash);
  return transactionRes;
};

export const mintUSDC = async (amount: number) => {
  const provider = new ethers.providers.JsonRpcProvider(sepoliaClientRPCURL);
  const signer = new ethers.Wallet(process.env.ETHEREUM_PRIV_KEY as string, provider);
  const usdcCoin = new ethers.Contract(
    "0xa0775e54ee5D0f1b7FC040f66BFD9f70a6F9E5FA",
    [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "_spender", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "burn",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "value", type: "uint256" },
        ],
        name: "mint",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "_from", type: "address" },
          { internalType: "address", name: "_to", type: "address" },
          { internalType: "uint256", name: "_value", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ],
    signer,
  );

  const transactionRes = await usdcCoin.mint(
    ondoManagerEthereumAddress,
    amount,
    {
      gasLimit: 1000000,
    },
  );

  return transactionRes;
};

export const fetchVAAWithRetry = async (
  emitterAddress: string,
  sequence: string,
  netID: number,
) => {
  const vaaURL = `https://wormhole-v2-testnet-api.certus.one/v1/signed_vaa/${netID}/${emitterAddress}/${sequence}`;
  console.log(vaaURL);
  let vaaBytes = await (await fetch(vaaURL)).json();
  let n = 0;
  while (!vaaBytes.vaaBytes && n < 30) {
    console.log("VAA not found, retrying in 5s!", n);
    await new Promise((r) => setTimeout(r, 5000)); // Timeout to let Guardiand pick up log and have VAA ready
    vaaBytes = await (await fetch(vaaURL)).json();
    n++;
  }
  if (n < 180) {
    const hexVAA = Buffer.from(vaaBytes.vaaBytes, "base64").toString("hex");
    return `0x${hexVAA}`;
  } else {
    throw new Error("VAA not found");
  }
};

export const getEmitterAddressAndSequenceFromResultAptos = (
  result: Types.UserTransaction,
): { emitterAddress: string; sequence: string } => {
  const data = result.events.find(
    (e) => e.type === `${wormholeCoreBridgeAptos}::state::WormholeMessage`,
  )?.data;
  const emitterAddress = hexZeroPad(
    `0x${parseInt(data?.sender).toString(16)}`,
    32,
  ).substring(2);
  const sequence = data?.sequence;
  return {
    emitterAddress,
    sequence,
  };
};

export const getLatestRedemptionRequest = async () => {
  const client = new AptosClient(aptosClientRPCURL);

  const events = await client.getEventsByEventHandle(
    aptosOndoAddress,
    `${aptosOndoAddress}::ondo_wrapper::Wrapper`,
    "request_redeem_events",
  );
  // @ts-ignore
  const latestTxVersion = events[events.length - 1].version;
  const latestTx = await client.getTransactionByVersion(latestTxVersion);
  console.log("Aptos redemption transaction: ", latestTx.hash);
  return await client.waitForTransactionWithResult(latestTx.hash);
};

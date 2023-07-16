import * as functions from 'firebase-functions';
import {
    parseSequenceFromLogEth,
    getEmitterAddressEth,
  } from "@certusone/wormhole-sdk";
  import {
    handleAptos,
    getEmitterAddressAndSequenceFromResultAptos,
    fetchVAAWithRetry,
    handleEthereumMint,
    getLatestRedemptionRequest,
    handleEthereumRedemptionRequest,
    handleEthereumRedeemUSDC,
    handleAptosRedemption,
    mintUSDC,
  } from "./utils/helpers";
  import {
    wormholeAptosNetID,
    wormholeEthereumNetID,
    wormholeCoreBridgeEth,
    wormholeTokenBridgeEth,
  } from "./utils/constants";
/**
 * Analysis function.
 */
export async function analysisFunction(request: functions.Request, response: functions.Response): Promise<void> {
    const { amount, relayerFee, nonce } = request.query;
    try {
    const aptosResult = await handleAptos(
      parseInt(amount as string),
      parseInt(relayerFee as string),
      parseInt(nonce as string),
    );

    const { emitterAddress, sequence } =
      // @ts-ignore
      getEmitterAddressAndSequenceFromResultAptos(aptosResult);
    const vaaBytes = await fetchVAAWithRetry(
      emitterAddress,
      sequence,
      wormholeAptosNetID,
    );

    const ethereumResult = await handleEthereumMint(vaaBytes);

    response.status(200).json({
      ethereumMintHash: ethereumResult.hash,
      aptosBridgeHash: aptosResult.hash,
      amount,
      nonce,
    }).send();
  } catch (e) {
    response.status(400).json(e).send();
  }
}

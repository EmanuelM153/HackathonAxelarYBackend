import {
  AxelarAssetTransfer,
  CHAINS,
  Environment,
} from "@axelar-network/axelarjs-sdk";

const sdk = new AxelarAssetTransfer({ environment: Environment.TESTNET });

const fromChain = CHAINS.TESTNET.BINANCE,
  toChain = CHAINS.TESTNET.AVALANCHE,
  destinationAddress = "0xb18B217e7af74646f18BCd2E4d70BB43F3485845",
  asset = "btc"

const depositAddress = await sdk.getDepositAddress({
  fromChain, 
  toChain, 
  destinationAddress, 
  asset,
  options: {
    shouldUnwrapIntoNative: true
  }
});

console.log(depositAddress);

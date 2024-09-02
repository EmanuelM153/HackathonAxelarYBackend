const express = require("express");
const app = express();
const port = 3000; // para pruebas
const { Web3 } = require("web3");
const abi = require("./nftContractABI.json");
const axelar = require("@axelar-network/axelarjs-sdk")

const address = 
  "0x8db97C7cEcE249c2b98bDC0226Cc4C2A57BF52FC";
const privateKey =
  "0x56289e99c94b6912bfc12adc093c9b51124f0dc54ac7a766b2bc5ccf558d8027";
const rpc =
  "https://psychic-telegram-px57g75gg7536vvj-9650.app.github.dev/ext/bc/devChain/rpc";
const contractAddress =
  "0xA8FdD25760C3c6ADc77f07f49ffF97540B66c64A";

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
})

app.post("/axelar-openDeposit", async (req, res) => {
  const data = req.body;
  const sdk = new axelar.AxelarAssetTransfer({ environment: axelar.Environment.TESTNET });
  const fromChain = data.chain,
  toChain = axelar.CHAINS.TESTNET.AVALANCHE,
  destinationAddress = data.pubKey,
  asset = data.asset

  const depositAddress = await sdk.getDepositAddress({
    fromChain,
    toChain,
    destinationAddress,
    asset,
    options: {
      shouldUnwrapIntoNative: true
    }
  });

  res.send({
    address: depositAddress,
  });
})

app.get("/contract-info", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const balanceLucas = await lucasNet.eth.getBalance(address);
  console.log({ balanceLucas });
  res.send({
    message: "Hola Bogotá...!",
    balanceLucas: Number(balanceLucas) / 10 ** 18,
  });
});

app.post("/transfer-native-token", async (req, res) => {
  const lucasNet = new Web3(rpc);
  const account = lucasNet.eth.accounts.wallet.add(privateKey);
  console.log(req.body);
  const tx = {
    from: account[0].address,
    to: req.body.pubKey,
    value: lucasNet.utils.toWei(String(req.body.numESM), "ether"),
  };
  console.log(tx);
  const txReceipt = await lucasNet.eth.sendTransaction(tx);
  console.log("Tx hash:", txReceipt.transactionHash);
  console.log(txReceipt.transactionHash);
  res.send({
    message: "Ok",
    statusCode: 200,
    txHash: txReceipt.transactionHash,
  });
});

const nftList = {
  gold: "ipfs://...",
  silver: "ipfs://..."
}

app.post("/obtain-nft", async (req, res) => {
  const data = req.body;
  const devChain = new Web3(rpc);
  const account = devChain.eth.accounts.wallet.add(privateKey);
  const nftContract = new devChain.eth.Contract(abi, contractAddress);
  const tx = await nftContract.methods
    .safeTransferFrom(account[0].address, data.pubKey, data.numESM)
    .send({from: account[0].address})
    .then(function(receipt){
      console.log(receipt);
    });
  res.send({
    message: "Ok",
    statusCode: 200,
  })
})

app.get("/nft-info", async (req, res) => {
  const data = req.query;
  const devChain = new Web3(rpc);
  const account = devChain.eth.accounts.wallet.add(privateKey);
  const nftContract = new devChain.eth.Contract(abi, contractAddress);
  const tx = await nftContract.methods
    .ownerOf(data.id)
    .call({from: address})
  res.send({
    message: "Ok",
    address: tx,
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

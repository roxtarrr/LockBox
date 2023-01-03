const solanaWeb3 = require('solana-web3');

// Connect to a Solana cluster
const client = new solanaWeb3.Client('http://localhost:8899');

// Load the contract ABI and bytecode
const contractAbi = require('./TimeLocked.abi.json');
const contractBytecode = require('./TimeLocked.bin');

// Deploy the contract
const contract = new client.Contract(contractAbi, contractBytecode, {
  defaultAccount: '<YOUR_SOLANA_PUBLIC_KEY>',
  defaultConfirmations: 1,
  defaultGasPrice: 0,
});

const releaseTime = Math.floor(Date.now() / 1000) + 60 * 60; // 1 hour from now
const unlockInterval = 60 * 60 * 24; // 1 day
const percentage = 50; // 50%

const deploy = contract.deploy([releaseTime, unlockInterval, percentage]);
deploy.send({
  amount: solanaWeb3.BigNumber.from('10000000'),
  confirmationCallback: (confirmationCount, transactionReceipt) => {
    console.log(confirmationCount, transactionReceipt);
  },
  confirmationCount: 1,
  gasPrice: 0,
}).then((response) => {
  console.log(response.contractAddress);
});

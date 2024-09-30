const contractAddress = "your_contract_address_here";
const contractABI = /* Contract ABI goes here */;

const contract = new web3.eth.Contract(contractABI, contractAddress);

document.addEventListener("DOMContentLoaded", async () => {
  const accounts = await web3.eth.getAccounts();
  const account = accounts[0];

  // Add functionality to interact with the smart contract here
});

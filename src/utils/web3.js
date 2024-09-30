let web3;

if (window.ethereum) {
  web3 = new Web3(window.ethereum);
  window.ethereum.enable().catch(error => {
    console.error("User denied account access");
  });
} else if (window.web3) {
  web3 = new Web3(window.web3.currentProvider);
} else {
  console.log("No Ethereum browser detected");
}

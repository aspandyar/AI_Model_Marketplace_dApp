require('dotenv').config(); // Load .env file

const contractAddress = process.env.CONTRACT_ADDRESS; // Access contract address
const contractABI = JSON.parse(process.env.CONTRACT_ABI); // Parse ABI string to JSON

// Initialize Web3
if (typeof window.ethereum !== 'undefined') {
  const web3 = new Web3(window.ethereum);
  ethereum.request({ method: 'eth_requestAccounts' });
} else {
  console.log('Please install MetaMask!');
}
const contract = new web3.eth.Contract(contractABI, contractAddress);

// List a new model
document.getElementById('listModelForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const name = document.getElementById('modelName').value;
  const description = document.getElementById('modelDescription').value;
  const price = web3.utils.toWei(document.getElementById('modelPrice').value, 'ether');
  const accounts = await web3.eth.getAccounts();

  contract.methods.listModel(name, description, price).send({ from: accounts[0] })
    .then(() => alert('Model listed successfully!'))
    .catch(console.error);
});

// Display available models
async function loadModels() {
  const modelsCount = await contract.methods.getModelsCount().call();
  const modelsList = document.getElementById('modelsList');
  modelsList.innerHTML = '';

  for (let i = 0; i < modelsCount; i++) {
    const model = await contract.methods.getModelDetails(i).call();
    const modelElement = document.createElement('div');
    modelElement.innerHTML = `
      <p><strong>Name:</strong> ${model.name}</p>
      <p><strong>Description:</strong> ${model.description}</p>
      <p><strong>Price:</strong> ${web3.utils.fromWei(model.price, 'ether')} ETH</p>
      <button onclick="purchaseModel(${i})">Purchase</button>
    `;
    modelsList.appendChild(modelElement);
  }
}

loadModels();

// Purchase a model
async function purchaseModel(modelId) {
  const accounts = await web3.eth.getAccounts();
  const model = await contract.methods.getModelDetails(modelId).call();

  contract.methods.purchaseModel(modelId).send({
    from: accounts[0],
    value: model.price
  })
  .then(() => alert('Model purchased successfully!'))
  .catch(console.error);
}

// Rate a purchased model
document.getElementById('rateModelForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  const modelId = document.getElementById('modelId').value;
  const rating = document.getElementById('modelRating').value;
  const accounts = await web3.eth.getAccounts();

  contract.methods.rateModel(modelId, rating).send({ from: accounts[0] })
    .then(() => alert('Model rated successfully!'))
    .catch(console.error);
});

// View model details
async function viewModelDetails() {
  const modelId = document.getElementById('viewModelId').value;
  const model = await contract.methods.getModelDetails(modelId).call();
  const modelDetails = document.getElementById('modelDetails');
  modelDetails.innerHTML = `
    <p><strong>Name:</strong> ${model.name}</p>
    <p><strong>Description:</strong> ${model.description}</p>
    <p><strong>Price:</strong> ${web3.utils.fromWei(model.price, 'ether')} ETH</p>
    <p><strong>Average Rating:</strong> ${model.averageRating}</p>
  `;
}

// Withdraw funds
async function withdrawFunds() {
  const accounts = await web3.eth.getAccounts();
  contract.methods.withdrawFunds().send({ from: accounts[0] })
    .then(() => alert('Funds withdrawn successfully!'))
    .catch(console.error);
}

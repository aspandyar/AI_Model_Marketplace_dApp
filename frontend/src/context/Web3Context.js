import React, { createContext, useEffect, useState } from 'react';
import Web3 from 'web3';
import AIModelMarketplaceABI from '../abis/AImodelMarketplace.json';

const Web3Context = createContext();

const Web3Provider = ({ children }) => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [error, setError] = useState(null); // Added error state

  useEffect(() => {
    const initWeb3 = async () => {
      try {
        let web3Instance;
        if (window.ethereum) {
          web3Instance = new Web3(window.ethereum);
          await window.ethereum.enable();
        } else if (window.web3) {
          web3Instance = new Web3(window.web3.currentProvider);
        } else {
          web3Instance = new Web3('http://127.0.0.1:7545');
        }
        setWeb3(web3Instance);

        const accounts = await web3Instance.eth.requestAccounts();
        setAccount(accounts[0]);

        const networkId = await web3Instance.eth.net.getId();
        const deployedNetwork = AIModelMarketplaceABI.networks[networkId];

        if (deployedNetwork) {
          const contractInstance = new web3Instance.eth.Contract(
            AIModelMarketplaceABI.abi,
            deployedNetwork.address,
          );
          setContract(contractInstance);
        } else {
          setError('Contract not deployed on this network.');
          console.error('No contract deployed on this network');
        }
      } catch (err) {
        setError(`Error initializing Web3: ${err.message}`);
        console.error('Error initializing web3:', err);
      }
    };

    initWeb3();
  }, []);

  return (
    <Web3Context.Provider value={{ web3, account, contract, error }}>
      {children}
    </Web3Context.Provider>
  );
};

export { Web3Provider, Web3Context };

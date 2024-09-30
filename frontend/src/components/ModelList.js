// src/components/ModelList.js
import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import PurchaseModelButton from './PurchaseModelButton';
import ModelDetails from './ModelDetails';
import Web3 from 'web3'; // Ensure Web3 is imported

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contract } = useContext(Web3Context);
  const web3 = new Web3(); // Initialize a new Web3 instance if needed

  useEffect(() => {
    const fetchModels = async () => {
      if (!contract) {
        setError('Contract is not initialized.');
        setLoading(false);
        return;
      }

      try {
        const totalModels = await contract.methods.totalModels();
        const modelsArray = await Promise.all(
          Array.from({ length: totalModels }, async (_, i) => {
            console.log('Fetching model details for index:', i); // Debugging log
            try {
              return await contract.methods.getModelDetails(i).call({ gas: 3000000 });
            } catch (innerErr) {
              console.error(`Error fetching model details for index ${i}:`, innerErr);
              return null; // Return null for this model if there's an error
            }
          })
        );  

        // Filter out any null results from the modelsArray
        const validModels = modelsArray.filter(model => model !== null);

        // Convert prices from wei to ether and store in modelsArray
        const formattedModels = validModels.map((model) => ({
          ...model,
          price: web3.utils.fromWei(model.price.toString(), 'ether'), // Convert wei to ether
        }));

        setModels(formattedModels);
      } catch (err) {
        console.error('Error fetching total models:', err); // Debugging log
        setError('Error fetching models: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModels();
  }, [contract]);

  if (loading) {
    return <div>Loading models...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Available Models</h2>
      <ul>
        {models.map((model, index) => (
          <li key={index}>
            <h3>{model.name}</h3>
            <p>{model.description}</p>
            <p>Price: {model.price} ETH</p> {/* Display price in ETH */}
            <ModelDetails modelId={index} />
            <PurchaseModelButton modelId={index} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ModelList;

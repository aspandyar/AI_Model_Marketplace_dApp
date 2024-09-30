// src/components/PurchaseModelButton.js
import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const PurchaseModelButton = ({ modelId }) => {
  const { contract } = useContext(Web3Context);

  const handlePurchase = async () => {
    await contract.methods.purchaseModel(modelId).send({ from: contract.address });
  };

  return <button onClick={handlePurchase}>Purchase Model</button>;
};

export default PurchaseModelButton;

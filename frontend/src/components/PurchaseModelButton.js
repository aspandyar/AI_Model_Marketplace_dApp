// src/components/PurchaseModelButton.js
import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Button } from 'react-bootstrap'; // Import Bootstrap Button

const PurchaseModelButton = ({ modelId }) => {
  const { contract } = useContext(Web3Context);

  const handlePurchase = async () => {
    try {
      await contract.methods.purchaseModel(modelId).send({ from: contract.address });
    } catch (err) {
      console.error('Error purchasing model:', err);
    }
  };

  return (
    <Button
      onClick={handlePurchase}
      variant="primary" // You can change this variant to suit your design
      style={{ padding: '10px 20px', marginTop: '10px' }} // Add padding and margin
    >
      Purchase Model
    </Button>
  );
};

export default PurchaseModelButton;

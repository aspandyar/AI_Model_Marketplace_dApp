// src/components/RateModelForm.js
import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const RateModelForm = ({ modelId }) => {
  const [rating, setRating] = useState('');
  const { contract } = useContext(Web3Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await contract.methods.rateModel(modelId, rating).send({ from: contract.address });
    setRating('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="number" placeholder="Rating (1-5)" value={rating} onChange={(e) => setRating(e.target.value)} required />
      <button type="submit">Rate Model</button>
    </form>
  );
};

export default RateModelForm;

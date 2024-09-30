// src/components/ListModelForm.js
import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const ListModelForm = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { contract } = useContext(Web3Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await contract.methods.listModel(name, description, price).send({ from: contract.address });
    setName('');
    setDescription('');
    setPrice('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Model Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
      <input type="number" placeholder="Price (in wei)" value={price} onChange={(e) => setPrice(e.target.value)} required />
      <button type="submit">List Model</button>
    </form>
  );
};

export default ListModelForm;

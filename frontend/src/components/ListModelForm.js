// src/components/ListModelForm.js
import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Form, Button } from 'react-bootstrap';

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
    <Form onSubmit={handleSubmit} className="mb-4">
      <Form.Group controlId="formModelName">
        <Form.Label>Model Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter model name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formModelDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </Form.Group>
      <Form.Group controlId="formModelPrice">
        <Form.Label>Price (in wei)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        List Model
      </Button>
    </Form>
  );
};

export default ListModelForm;

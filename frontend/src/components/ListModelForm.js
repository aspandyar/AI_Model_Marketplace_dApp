import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Form, Button, Card, Container } from 'react-bootstrap';

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
    <Container className='m-5'>
      <Card className="mx-auto my-4">
        <Card.Body>
          <h4 className="text-center mb-3">List a New Model</h4>
          <Form onSubmit={handleSubmit}>
            <div className="border" style>
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
            </div>
            <div className="border">
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
            </div>
            <div className="border">
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
            </div>
            <Button variant="primary" type="submit" className="w-100">
              List Model
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ListModelForm;


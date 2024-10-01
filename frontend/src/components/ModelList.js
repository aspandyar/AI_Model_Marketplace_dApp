// src/components/ModelList.js
import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import PurchaseModelButton from './PurchaseModelButton';
import ModelDetails from './ModelDetails';
import Web3 from 'web3'; // Ensure Web3 is imported
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const { contract, account } = useContext(Web3Context);
  const web3 = new Web3(); // Initialize a new Web3 instance if needed

  // Function to fetch models
  const fetchModels = async () => {
    if (!contract) {
      console.log('Contract not yet initialized, returning early.');
      return;
    }

    setLoading(true);

    try {
      const totalModelsBigInt = await contract.methods.totalModels().call();
      const totalModels = Number(totalModelsBigInt);

      const modelsArray = await Promise.all(
        Array.from({ length: totalModels }, async (_, i) => {
          try {
            return await contract.methods.getModelDetails(i).call({ gas: 3000000 });
          } catch (innerErr) {
            console.error(`Error fetching model details for index ${i}:`, innerErr);
            return null;
          }
        })
      );

      const validModels = modelsArray.filter(model => model !== null);

      // Format models to include relevant data
      const formattedModels = validModels.map((model) => {
        const priceInEther = model[2] ? web3.utils.fromWei(model[2].toString(), 'ether') : 'N/A'; // Convert price from Wei to Ether
        const averageRating = model[4]; // Average rating
        const buyers = model[5]; // List of buyers

        return {
          name: model[0],
          description: model[1],
          price: priceInEther,
          creator: model[3],
          averageRating: averageRating,
          buyers: buyers,
        };
      });

      setModels(formattedModels);
    } catch (err) {
      console.error('Error fetching total models:', err);
      setError('Error fetching models: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModels();
  }, [contract, account]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission

    try {
      const priceInWei = web3.utils.toWei(price, 'ether');
      await contract.methods.listModel(name, description, priceInWei).send({ from: account });

      setName('');
      setDescription('');
      setPrice('');

      fetchModels();
    } catch (err) {
      console.error('Error listing model:', err);
      setError('Error listing model: ' + err.message);
    }
  };

  if (loading) {
    return <div>Loading models...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Container>
      <h2 className="my-4 text-center text-primary">Available Models</h2>

      {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}
      {error && <Alert variant="danger">{error}</Alert>}

      <Row className="justify-content-center">
        {models.map((model, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card border="primary" className="shadow-sm rounded">
              <Card.Body>
                <Card.Title className="text-primary">{model.name}</Card.Title>
                <Card.Text>{model.description}</Card.Text>
                <Card.Text className="font-weight-bold">Price: {model.price} ETH</Card.Text>
                <Card.Text>Creator: {model.creator}</Card.Text>
                <Card.Text>Average Rating: {model.averageRating}</Card.Text>
                <Card.Text>
                  Buyers: {model.buyers.length > 0 ? model.buyers.join(', ') : 'No buyers yet'}
                </Card.Text>
                <ModelDetails modelId={index} />
                <PurchaseModelButton modelId={index} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="my-4 text-center text-primary">List a New Model</h3>
      <Form onSubmit={handleSubmit} className="mb-4">
        <Form.Group controlId="formModelName">
          <Form.Label>Model Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter model name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border-primary"
          />
        </Form.Group>
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="border-primary"
          />
        </Form.Group>
        <Form.Group controlId="formPrice">
          <Form.Label>Price (in ETH)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter price in ETH"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="border-primary"
          />
        </Form.Group>
        <Button variant="primary" type="submit" className="w-100 mt-3">
          List Model
        </Button>
      </Form>
    </Container>
  );
};

export default ModelList;

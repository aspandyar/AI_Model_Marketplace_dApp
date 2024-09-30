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

        console.log(totalModels);

        const modelsArray = await Promise.all(
            Array.from({ length: totalModels }, async (_, i) => {
                console.log('Fetching model details for index:', i);
                try {
                    return await contract.methods.getModelDetails(i).call({ gas: 3000000 });
                } catch (innerErr) {
                    console.error(`Error fetching model details for index ${i}:`, innerErr);
                    return null;
                }
            })
        );  

        const validModels = modelsArray.filter(model => model !== null);

        // Convert prices from wei to ether and store in modelsArray
        const formattedModels = validModels.map((model) => {
            console.log('Model details fetched:', model); // Log the model details
            const priceInEther = model.price ? web3.utils.fromWei(model.price.toString(), 'ether') : 'N/A'; // Handle undefined price

            return {
                ...model,
                price: priceInEther, 
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
    fetchModels(); // Call fetchModels when the component mounts or when contract changes
  }, [contract]);

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
      <h2 className="my-4">Available Models</h2>
      {loading && <Spinner animation="border" role="status"><span className="sr-only">Loading...</span></Spinner>}
      {error && <Alert variant="danger">{error}</Alert>}
      <Row>
        {models.map((model, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Name: {model[0]}</Card.Title>
                <Card.Text>Description: {model[1]}</Card.Text>
                <Card.Text>Price: {model[2]} ETH</Card.Text>
                <ModelDetails modelId={index} />
                <PurchaseModelButton modelId={index} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <h3 className="my-4">List a New Model</h3>
      <Form onSubmit={handleSubmit}>
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
        <Form.Group controlId="formDescription">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
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
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          List Model
        </Button>
      </Form>
    </Container>
  );
};

export default ModelList;

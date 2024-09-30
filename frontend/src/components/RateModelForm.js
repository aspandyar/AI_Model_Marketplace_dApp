import React, { useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Alert, Form, Button } from 'react-bootstrap';

const RateModelForm = ({ modelId }) => {
  const [rating, setRating] = useState('');
  const [error, setError] = useState(null);
  const { contract, account } = useContext(Web3Context);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5');
      return;
    }
    try {
      await contract.methods.rateModel(modelId, rating).send({ from: account });
      setRating('');
      setError(null); // Clear error on successful submission
    } catch (err) {
      console.error(err); // Log the full error to the console
      setError('Failed to submit rating: ' + (err.message || 'Unknown error'));
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="my-3">
      <Form.Group controlId="rating">
        <Form.Label>Rate Model (1-5)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Enter rating"
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          required
        />
      </Form.Group>
      <Button variant="primary" type="submit">
        Rate Model
      </Button>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
    </Form>
  );
};

export default RateModelForm;

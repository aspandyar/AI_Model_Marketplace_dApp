import React, { useEffect, useState, useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import PurchaseModelButton from './PurchaseModelButton';
import ModelDetails from './ModelDetails';
import Web3 from 'web3';
import { Container, Row, Col, Card, Button, Spinner, Alert, Modal } from 'react-bootstrap';
import RateModelForm from './RateModelForm';
import ListModel from './ListModelForm'; // Import the new ListModel component

const ModelList = () => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { contract, account } = useContext(Web3Context);
  const [showModal, setShowModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const web3 = new Web3();

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

      const formattedModels = validModels.map((model) => {
        const priceInEther = model[2] ? web3.utils.fromWei(model[2].toString(), 'ether') : 'N/A';
        const averageRating = model[4];
        const buyers = model[5];

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

  const handleOpenModal = (model) => {
    setSelectedModel(model);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedModel(null);
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
                <Card.Title>
                  Name: <div className='fw-bold'>{model.name}</div>
                </Card.Title>
                <Card.Text>Description: 
                  <div className='fw-bold'>{model.description}</div>
                  </Card.Text>
                <Card.Text>Price: 
                  <div className='fw-bold'>{model.price} ETH</div>
                  </Card.Text>
                  <Card.Text>
                    Average Rating: 
                    <div className="fw-bold">
                      {model.averageRating && model.averageRating !== '0' ? model.averageRating : 'No rating yet'}
                    </div>
                  </Card.Text>

                <Button variant="info" onClick={() => handleOpenModal(model)}>
                  View Details
                </Button>
                <RateModelForm></RateModelForm>
                <PurchaseModelButton modelId={index} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Move the List Model form to the ListModel component */}
      <ListModel contract={contract} account={account} fetchModels={fetchModels}/>

      {selectedModel && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>Model Details: {selectedModel.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Description:</strong> {selectedModel.description}</p>
            <p><strong>Price:</strong> {selectedModel.price} ETH</p>
            <p><strong>Creator:</strong> {selectedModel.creator}</p>
            <p><strong>Average Rating:</strong> {selectedModel.averageRating}</p>
            <p><strong>Buyers:</strong> {selectedModel.buyers.length > 0 ? selectedModel.buyers.join(', ') : 'No buyers yet'}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
};

export default ModelList;

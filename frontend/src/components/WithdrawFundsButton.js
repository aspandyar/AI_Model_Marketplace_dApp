import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Button, Card, Alert } from 'react-bootstrap';

const WithdrawFundsButton = () => {
  const { contract } = useContext(Web3Context);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleWithdraw = async () => {
    try {
      await contract.methods.withdrawFunds().send({ from: contract.address });
      setSuccess('Withdrawal successful!');
      setError(null); // Clear error on success
    } catch (err) {
      console.error(err);
      setError('Failed to withdraw funds: ' + (err.message || 'Unknown error'));
      setSuccess(null); // Clear success message on error
    }
  };

  return (
    <Card className="mx-auto my-4" style={{ maxWidth: '350px' }}>
      <Card.Body className="text-center">
        <h4>Withdraw Funds</h4>
        <Button variant="success" onClick={handleWithdraw} className="mt-3">
          Withdraw Funds
        </Button>
        {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
      </Card.Body>
    </Card>
  );
};

export default WithdrawFundsButton;

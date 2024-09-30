// src/components/WithdrawFundsButton.js
import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';
import { Button } from 'react-bootstrap';

const WithdrawFundsButton = () => {
  const { contract } = useContext(Web3Context);

  const handleWithdraw = async () => {
    await contract.methods.withdrawFunds().send({ from: contract.address });
  };

  return <Button variant="success" onClick={handleWithdraw}>Withdraw Funds</Button>;
};

export default WithdrawFundsButton;

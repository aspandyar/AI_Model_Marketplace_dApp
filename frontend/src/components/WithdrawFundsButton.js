// src/components/WithdrawFundsButton.js
import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Context';

const WithdrawFundsButton = () => {
  const { contract } = useContext(Web3Context);

  const handleWithdraw = async () => {
    await contract.methods.withdrawFunds().send({ from: contract.address });
  };

  return <button onClick={handleWithdraw}>Withdraw Funds</button>;
};

export default WithdrawFundsButton;

// src/App.js
import React from 'react';
import ListModelForm from './components/ListModelForm';
import ModelList from './components/ModelList';
import WithdrawFundsButton from './components/WithdrawFundsButton';
import { Web3Provider } from './context/Web3Context';

const App = () => {
  return (
    <Web3Provider>
      <div>
        <h1>AI Model Marketplace</h1>
        <ListModelForm />
        <ModelList />
        <WithdrawFundsButton />
      </div>
    </Web3Provider>
  );
};

export default App;

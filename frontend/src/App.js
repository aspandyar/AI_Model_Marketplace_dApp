// src/App.js
import React from 'react';
import ListModelForm from './components/ListModelForm';
import ModelList from './components/ModelList';
import WithdrawFundsButton from './components/WithdrawFundsButton';
import { Web3Provider } from './context/Web3Context';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Web3Provider>
      <div className="container mt-5">
        <h1 className="text-center">AI Model Marketplace</h1>
        <ModelList />
        <WithdrawFundsButton />
      </div>
    </Web3Provider>
  );
};

export default App;

import React from 'react';
import Homepage from './components/Homepage';
import ContributionForm from './components/ContributionForm';
import ContributionList from './components/ContributionList';
import io from 'socket.io-client';
import './styles.css';

const socket = io('http://localhost:5000');

const App = () => {
  return (
    <>
      <Homepage />
      <ContributionForm socket={socket} />
      <ContributionList socket={socket} />
    </>
  );
};

export default App;

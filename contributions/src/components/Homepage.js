import React from 'react';
import './styles.css';

const Homepage = () => {
  return (
    <header>
      <h1>In Memory of Kevin</h1>
      <p>
        Kevin was a talented full-stack software engineer and a great friend. 
        We are gathering contributions to honor his memory.
      </p>
      <img src="/kevin.jpg" alt="Kevin" style={{ width: '100%', borderRadius: '8px' }} />
    </header>
  );
};

export default Homepage;


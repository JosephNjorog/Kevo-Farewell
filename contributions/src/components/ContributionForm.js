import React, { useState } from 'react';
import axios from 'axios';

const ContributionForm = ({ socket }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await axios.post('http://localhost:5000/contribute', { name, phone, amount });

    if (response.data.success) {
      setName('');
      setPhone('');
      setAmount('');
    }
  };

  return (
    <div className="container">
      <h2>Make a Contribution</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount (KES)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="submit">Contribute</button>
      </form>
    </div>
  );
};

export default ContributionForm;

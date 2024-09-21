import React, { useEffect, useState } from 'react';

const ContributionList = ({ socket }) => {
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    socket.on('new-contribution', (contribution) => {
      setContributions((prev) => [...prev, contribution]);
    });

    return () => socket.off('new-contribution');
  }, [socket]);

  return (
    <div className="container">
      <h2>Contributors</h2>
      <ul>
        {contributions.map((contribution, index) => (
          <li key={index}>
            {contribution.name} contributed KES {contribution.amount}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContributionList;

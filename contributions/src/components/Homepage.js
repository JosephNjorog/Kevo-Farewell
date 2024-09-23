import React from 'react';
<<<<<<< HEAD
import './styles.css'; // Ensure the path is correct
=======
import './styles.css';
>>>>>>> 2ca2cb0f85cf3a0ab341365b3f1a324c08472f72
import kevinImage from '../assets/kevin.jpeg'; // Adjust the path according to your structure

const Homepage = () => {
  return (
    <div className="homepage">
      <header>
        <h1>In Memory of Kevin</h1>
      </header>
      <div className="container">
        <img src={kevinImage} alt="Kevin" className="kevin-image" />
        <p className="description">
          Kevin was a remarkable software engineer with a passion for Kubernetes. 
          He will be greatly missed. Please make your contributions using the form below.
        </p>
        <div className="contribution-details">
          <h2>Contribution Details</h2>
          <p>
            Contributions can be sent to <strong>Mercy Chomba</strong> via MPESA at the following number:
          </p>
          <p className="phone-number"><strong>+254 711 749396</strong></p>
        </div>
        <form>
          <input type="text" placeholder="Your Name" />
          <input type="text" placeholder="Amount (KES)" />
          <button type="submit">Send Contribution</button>
        </form>
      </div>
    </div>
  );
};

export default Homepage;

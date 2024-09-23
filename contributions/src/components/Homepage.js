import React from 'react';
import './styles.css'; // Ensure the path is correct
import kevinImage from '../assets/kevin.jpeg'; // Adjust the path according to your structure

const Homepage = () => {
  return (
    <div className="homepage">
      <h1>In Memory of Kevin</h1>
      <img src={kevinImage} alt="Kevin" className="kevin-image" />
      <p>
        Kevin was a remarkable software engineer with a passion for Kubernetes. 
        He will be greatly missed. Please make your contributions using the form below.
      </p>
      <h2>Contribution Details</h2>
      <p>
        Contributions can be sent to <strong>Mercy Chomba</strong> via MPESA at the following number:
      </p>
      <p className="phone-number"><strong>+254 711 749396</strong></p>
    </div>
  );
};

export default Homepage;

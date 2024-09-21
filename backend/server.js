const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');
const Mpesa = require('mpesa-api').Mpesa;

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Body-parser middleware
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('your-mongo-db-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Contribution Schema and Model
const ContributionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  amount: Number,
});

const Contribution = mongoose.model('Contribution', ContributionSchema);

// M-Pesa API credentials
const credentials = {
  clientKey: 'your-client-key',
  clientSecret: 'your-client-secret',
  initiatorPassword: 'your-initiator-password',
  securityCredential: 'your-security-credential',
};

const mpesa = new Mpesa(credentials, 'sandbox');

// Contribution endpoint with M-Pesa STK Push
app.post('/contribute', async (req, res) => {
  const { name, phone, amount } = req.body;

  // M-Pesa STK Push
  const paymentDetails = {
    BusinessShortCode: '174379',
    Amount: amount,
    PartyA: phone,
    PartyB: '174379',
    PhoneNumber: phone,
    CallBackURL: 'https://your-domain.com/mpesa-callback',
    AccountReference: 'KevinContribution',
    TransactionDesc: 'Contribution for Kevin',
  };

  try {
    const response = await mpesa.lipaNaMpesaOnline(paymentDetails);

    res.send({ success: true, data: response });
  } catch (error) {
    res.status(500).send({ success: false, error: error.message });
  }
});

// M-Pesa callback endpoint
app.post('/mpesa-callback', async (req, res) => {
  const { Body } = req.body;

  // Extract necessary details from the callback
  const resultCode = Body.stkCallback.ResultCode;
  const resultDesc = Body.stkCallback.ResultDesc;
  const merchantRequestID = Body.stkCallback.MerchantRequestID;
  const checkoutRequestID = Body.stkCallback.CheckoutRequestID;
  const amount = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === 'Amount').Value;
  const phone = Body.stkCallback.CallbackMetadata.Item.find(i => i.Name === 'PhoneNumber').Value;

  if (resultCode === 0) { // Transaction successful
    const contribution = new Contribution({ name: 'Anonymous', phone, amount });
    await contribution.save();
    io.emit('new-contribution', contribution);
  }

  // Send response back to M-Pesa
  res.json({ resultCode, resultDesc });
});

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

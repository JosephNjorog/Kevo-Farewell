const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const shortCode = 'YOUR_SHORT_CODE';
const lipaNaMpesaOnlinePassKey = 'YOUR_PASS_KEY';
const consumerKey = 'YOUR_CONSUMER_KEY';
const consumerSecret = 'YOUR_CONSUMER_SECRET';
const phoneNumber = '254711749396'; // Replace with the recipient's phone number
const partyA = '254711749396'; // Replace with the contributor's phone number (use as placeholder)
const accountReference = 'Contribution';
const transactionDesc = 'Contribution for Kevin';

const tokenUrl = 'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials';
const stkPushUrl = 'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest';
const callbackUrl = 'https://your-server-url/callback';

let accessToken = '';

const getAccessToken = async () => {
  const auth = 'Basic ' + Buffer.from(consumerKey + ':' + consumerSecret).toString('base64');
  try {
    const response = await axios.get(tokenUrl, {
      headers: {
        Authorization: auth
      }
    });
    accessToken = response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error);
  }
};

app.post('/stkpush', async (req, res) => {
  const amount = req.body.amount;
  await getAccessToken();

  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const password = Buffer.from(shortCode + lipaNaMpesaOnlinePassKey + timestamp).toString('base64');

  const stkPushRequest = {
    BusinessShortCode: shortCode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: partyA,
    PartyB: shortCode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackUrl,
    AccountReference: accountReference,
    TransactionDesc: transactionDesc
  };

  try {
    const response = await axios.post(stkPushUrl, stkPushRequest, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in STK Push:', error);
    res.status(500).send('Error initiating STK Push');
  }
});

app.post('/callback', (req, res) => {
  const callbackData = req.body;
  console.log('Callback received:', callbackData);

  if (callbackData.Body.stkCallback.ResultCode === 0) {
    const transactionDetails = callbackData.Body.stkCallback.CallbackMetadata.Item;
    const amount = transactionDetails.find(item => item.Name === 'Amount').Value;
    const phoneNumber = transactionDetails.find(item => item.Name === 'PhoneNumber').Value;
    const transactionId = transactionDetails.find(item => item.Name === 'MpesaReceiptNumber').Value;

    // You can save these details in your database or any storage
    console.log(`Received ${amount} from ${phoneNumber}, Transaction ID: ${transactionId}`);

    // Optionally, update the front-end with the new contribution
    // e.g., using WebSocket or other real-time update mechanisms
  }

  res.status(200).send('Callback received successfully');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

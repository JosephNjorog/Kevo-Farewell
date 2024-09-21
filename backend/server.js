const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());

mongoose.connect('your-mongo-db-connection-string', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const ContributionSchema = new mongoose.Schema({
  name: String,
  phone: String,
  amount: Number,
});

const Contribution = mongoose.model('Contribution', ContributionSchema);

app.post('/contribute', async (req, res) => {
  const { name, phone, amount } = req.body;

  // Initiate M-Pesa STK push here

  const contribution = new Contribution({ name, phone, amount });
  await contribution.save();

  io.emit('new-contribution', contribution);

  res.send({ success: true });
});

io.on('connection', (socket) => {
  console.log('New client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server is running on port 5000');
});

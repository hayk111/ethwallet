const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/ethwallet', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const User = mongoose.model(
  'User',
  new mongoose.Schema({
    address: String,
    balance: Number,
  })
);

app.post('/deposit', async (req, res) => {
  const { account, amount } = req.body;
  let user = await User.findOne({ address: account });
  if (!user) {
    user = new User({ address: account, balance: 0 });
  }
  user.balance += parseFloat(amount);
  await user.save();
  res.send({ message: 'Deposit successful' });
});

app.post('/withdraw', async (req, res) => {
  const { account, amount } = req.body;
  let user = await User.findOne({ address: account });
  if (!user || user.balance < amount) {
    return res.status(400).send({ message: 'Insufficient balance' });
  }
  user.balance -= parseFloat(amount);
  await user.save();
  res.send({ message: 'Withdrawal successful' });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

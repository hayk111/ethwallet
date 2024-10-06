const User = require('../models/User');
const { Web3 } = require('web3');

const options = {
  timeout: 30000, // ms
  clientConfig: {
    // Useful if requests are large
    maxReceivedFrameSize: 100000000, // bytes - default: 1MiB
    maxReceivedMessageSize: 100000000, // bytes - default: 8MiB
  },
  // Enable auto reconnection
  reconnect: {
    auto: true,
    delay: 5000, // ms
    maxAttempts: 5,
    onTimeout: false,
  },
};

const web3 = new Web3(
  new Web3.providers.HttpProvider(process.env.ALCHEMY_NODE_URL, options)
);

const ABI = JSON.parse(process.env.ABI);
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

exports.createUser = async (req, res) => {
  const { walletAddress } = req.body;
  try {
    let user = await User.findOne({ walletAddress });
    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }
    res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getUser = async (req, res) => {
  const { walletAddress } = req.params;
  try {
    const user = await User.findOne({ walletAddress });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.withdraw = async (req, res) => {
  const { walletAddress, amount } = req.body;
  try {
    const user = await User.findOne({ walletAddress });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.balance < amount)
      return res.status(400).json({ message: 'Insufficient balance' });

    // Interact with the smart contract to withdraw
    const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
    await contract.methods
      .withdraw(web3.utils.toWei(amount.toString(), 'ether'))
      .send({ from: walletAddress });

    user.balance -= parseFloat(amount);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error('Error during withdrawal:', error);
    if (error.message.includes('insufficient funds')) {
      res.status(400).json({ error: 'Insufficient funds for withdrawal' });
    } else {
      res
        .status(500)
        .json({ error: 'Internal server error during withdrawal' });
    }
  }
};

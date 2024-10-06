import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import Web3 from 'web3';
import Loader from './components/Loader';
import {
  fetchBalanceAPI,
  withdrawAPI,
  createUserWalletAPI,
  getUserWalletAPI,
} from './api';

const contractABI = JSON.parse(import.meta.env.VITE_CONTRACT_ABI);
const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function App() {
  const [isMetaMaskInstalled, setIsMetaMaskInstalled] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      setIsMetaMaskInstalled(true);
      console.log('MetaMask is installed!');
    } else {
      setMessage('Please install MetaMask to use this app.');
    }
  }, []);

  useEffect(() => {
    const createWalletIfNotExists = async (walletAddress) => {
      let wallet = null;
      try {
        wallet = await getUserWalletAPI(walletAddress);
      } catch (error) {
        console.error(error);
      }
      if (!!wallet) {
        return;
      }
      try {
        const data = await createUserWalletAPI(walletAddress);
        setBalance(data.balance);
        setMessage(`User wallet created: ${data.walletAddress}`);
      } catch (error) {
        setMessage(`Error creating user wallet: ${error.message}`);
      }
    };

    if (walletAddress) {
      createWalletIfNotExists(walletAddress);
    }
  }, [walletAddress]);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      fetchBalance(accounts[0]);
    } catch (error) {
      setMessage(`Error connecting to MetaMask: ${error.message}`);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const data = await fetchBalanceAPI(address);
      setBalance(data.balance);
    } catch (error) {
      setMessage(`Error fetching balance: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    if (amount <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }

    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const web3 = new Web3(window.ethereum);

      const accounts = await web3.eth.getAccounts();
      const walletAddress = accounts[0];

      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const depositAmount = web3.utils.toWei(amount, 'ether');

      contract.methods
        .deposit()
        .send({
          from: walletAddress,
          value: depositAmount,
        })
        .on('transactionHash', (hash) => {
          setMessage(`Transaction sent! Hash: ${hash}`);
        })
        .on('receipt', (receipt) => {
          setMessage(`Deposit successful! New balance: ${receipt}`);
        })
        .on('error', (error) => {
          setMessage(`Error during deposit: ${error.message}`);
        });
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleWithdraw = async () => {
    if (amount <= 0) {
      setMessage('Amount must be greater than 0');
      return;
    }
    setWithdrawLoading(true);
    try {
      const data = await withdrawAPI(walletAddress, amount);
      setMessage(`Withdrawal successful! New balance: ${data.balance} ETH`);
      setBalance(data.balance);
    } catch (error) {
      if (!error.message) {
        setMessage('Something went wrong with the withdrawal');
        return;
      }
      setMessage(`Error: ${error.message}`);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 rounded shadow-md w-[634px] min-h-[200px]">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Deposit/Withdraw ETH
        </h1>
        {walletAddress && (
          <>
            <div className="text-center text-gray-700 mb-4">
              <strong>Wallet Balance:</strong>{' '}
              {balance !== null ? `${balance} ETH` : 'Loading...'}
            </div>
          </>
        )}
        {!walletAddress && isMetaMaskInstalled && (
          <div className="flex justify-center mt-auto">
            <button
              onClick={connectMetaMask}
              className="bg-gray-900 text-white w-2/3 px-4 py-2 rounded"
            >
              Connect MetaMask
            </button>
          </div>
        )}
        {walletAddress && isMetaMaskInstalled && (
          <>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700">
                Amount (ETH)
              </label>
              <input
                id="amount"
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleDeposit}
                className={classNames(
                  'bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center',
                  {
                    'opacity-50 cursor-not-allowed': withdrawLoading,
                  }
                )}
                disabled={withdrawLoading}
              >
                Deposit
              </button>
              <button
                onClick={handleWithdraw}
                className={classNames(
                  'bg-gray-900 text-white px-4 py-2 rounded flex items-center justify-center',
                  {
                    'opacity-50 cursor-not-allowed': withdrawLoading,
                  }
                )}
                disabled={withdrawLoading}
              >
                {withdrawLoading ? (
                  <span className="flex items-center">
                    <Loader />
                    Withdrawing...
                  </span>
                ) : (
                  'Withdraw'
                )}
              </button>
            </div>
          </>
        )}
        <div className="mt-6 text-center text-gray-700">{message}</div>
        {walletAddress && (
          <div className="mt-6 text-center text-gray-700 text-sm">
            Connected with wallet: <b>{walletAddress}</b>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

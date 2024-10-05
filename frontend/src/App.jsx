import React, { useState, useEffect } from 'react';
import Loader from './components/Loader';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [balance, setBalance] = useState(null);
  const [depositLoading, setDepositLoading] = useState(false);
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  useEffect(() => {
    if (typeof window.ethereum !== 'undefined') {
      console.log('MetaMask is installed!');
    } else {
      setMessage('Please install MetaMask to use this app.');
    }
  }, []);

  const connectMetaMask = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setWalletAddress(accounts[0]);
      setMessage(`Connected with wallet: ${accounts[0]}`);
      fetchBalance(accounts[0]);
    } catch (error) {
      setMessage(`Error connecting to MetaMask: ${error.message}`);
    }
  };

  const fetchBalance = async (address) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${address}`
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }
      const data = await response.json();
      setBalance(data.balance);
    } catch (error) {
      setMessage(`Error fetching balance: ${error.message}`);
    }
  };

  const handleDeposit = async () => {
    setDepositLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setMessage(`Deposit successful! New balance: ${data.balance} ETH`);
      setBalance(data.balance);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setDepositLoading(false);
    }
  };

  const handleWithdraw = async () => {
    setWithdrawLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/users/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ walletAddress, amount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
      }

      const data = await response.json();
      setMessage(`Withdrawal successful! New balance: ${data.balance} ETH`);
      setBalance(data.balance);
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setWithdrawLoading(false);
    }
  };

  return (
    <div className="bg-gray-200 flex items-center justify-center h-screen">
      <div className="flex flex-col bg-white p-8 rounded shadow-md min-w-[634px] min-h-[200px]">
        <h1 className="text-center text-2xl font-bold mb-4 text-gray-800">
          Deposit/Withdraw ETH
        </h1>
        {walletAddress && (
          <div className="text-center text-gray-700 mb-4">
            <strong>Wallet Balance:</strong>{' '}
            {balance !== null ? `${balance} ETH` : 'Loading...'}
          </div>
        )}
        {!walletAddress ? (
          <div className="flex justify-center mt-auto">
            <button
              onClick={connectMetaMask}
              className="bg-gray-900 text-white w-2/3 px-4 py-2 rounded"
            >
              Connect MetaMask
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4">
              <label htmlFor="amount" className="block text-gray-700">
                Amount (ETH)
              </label>
              <input
                id="amount"
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="0.1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleDeposit}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded flex items-center justify-center"
                disabled={depositLoading || withdrawLoading}
              >
                {depositLoading ? (
                  <span className="flex items-center">
                    <Loader />
                    Depositing...
                  </span>
                ) : (
                  'Deposit'
                )}
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-gray-900 text-white px-4 py-2 rounded flex items-center justify-center"
                disabled={depositLoading || withdrawLoading}
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
        <div className="mt-10 text-center text-gray-700">{message}</div>
      </div>
    </div>
  );
}

export default App;

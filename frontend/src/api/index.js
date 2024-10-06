const API_URL = import.meta.env.VITE_API_URL;
console.log('🚀 ~ API_URL33:', API_URL);

export const fetchBalanceAPI = async (address) => {
  const response = await fetch(`${API_URL}/${address}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const getUserWalletAPI = async (walletAddress) => {
  const response = await fetch(`${API_URL}/${walletAddress}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const createUserWalletAPI = async (walletAddress) => {
  const response = await fetch(`${API_URL}/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ walletAddress }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }

  return response.json();
};

export const withdrawAPI = async (walletAddress, amount) => {
  const response = await fetch(`${API_URL}/withdraw`, {
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

  return response.json();
};

const API_URL = import.meta.env.VITE_API_URL;
console.log('🚀 ~ API_URL:', API_URL);

export const fetchBalanceAPI = async (address) => {
  const response = await fetch(`${API_URL}/${address}`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message);
  }
  return response.json();
};

export const depositAPI = async (walletAddress, amount) => {
  const response = await fetch(`${API_URL}/deposit`, {
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

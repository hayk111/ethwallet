# Deposit and Withdrawal Application

This project is a simple application that allows users to connect their MetaMask wallet, make deposits, and withdraw funds using Ethereum. The application consists of a frontend built with React and Vite, styled with Tailwind CSS, and a backend built with Express.js and MongoDB.

## Features

- Connect MetaMask wallet
- Make deposits in ETH
- Withdraw funds in ETH
- Store user balances in MongoDB

## Technologies Used

- Frontend: React, Vite, Tailwind CSS, Web3.js
- Backend: Express.js, MongoDB, Mongoose
- Wallet: MetaMask

## Prerequisites

- Node.js and npm (or Yarn)
- MongoDB
- MetaMask extension installed in your browser

## Getting Started

### Backend Setup

1. **Navigate to the server directory**:

```bash
  cd server
```

2. Install dependencies:
```bash
  yarn
```
3. Start MongoDB:
```bash
  brew services start mongodb/brew/mongodb-community
```
3. Run the server:
```bash
  node app.js
```

### Frontend Setup

1. **Navigate to the frontend directory**:

```bash
  cd frontend
```

2. Install dependencies:
```bash
  yarn
```

3. Run the development server:
```bash
  yarn dev
```

### App is deployed with Vercel

https://ethwallet-mocha.vercel.app/
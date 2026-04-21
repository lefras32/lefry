# lefry

A modern Ethereum blockchain explorer built with Next.js, TypeScript, and Ethers.js.
<img width="1903" height="911" alt="image" src="https://github.com/user-attachments/assets/2bec2dbf-1b43-466d-9e34-8ccac25edcd9" />


## Features

- **Latest Blocks** - View the most recent blocks on the Ethereum network
- **Block Details** - Explore individual blocks with all their transactions
- **Transaction Details** - Look up any transaction by hash
- **Address View** - Check wallet balances and transaction history
- **Search** - Find blocks, transactions, and addresses quickly

## Tech Stack

- **Next.js 14** - App Router for server-side rendering
- **TypeScript** - Type-safe code
- **Ethers.js v6** - Blockchain interaction
- **Tailwind CSS** - Styling

## Getting Started

### Prerequisites

- Node.js 18+
- An Ethereum RPC URL (Alchemy or Infura)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/lefry.git
cd lefry

# Install dependencies
npm install
```

### Configuration

Create a `.env.local` file with your Ethereum RPC provider:

```env
NEXT_PUBLIC_ETHEREUM_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

Get a free API key from [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

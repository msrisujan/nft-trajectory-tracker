# **NFT Trajectory Tracker**

NFT Trajectory Tracker is a **user-friendly platform** for tracking the complete lifecycle of NFTs, providing transparency, efficiency, and accessibility for collectors, businesses, and marketplaces.

---

## **Features**

- **Unified Timeline**: View all lifecycle events of an NFT (creation, transfers, clawbacks, metadata updates, and deletions).
- **Efficient Data Retrieval**: Rapid access to NFT histories using MongoDB and incremental searching.
- **User-Friendly Interface**: Visual tools like timelines and pie charts for easy data interpretation.
- **Open-Source and Integrable**: Easily integrate the tracker into existing blockchain projects and NFT marketplaces.
- **Comprehensive Applications**: Useful for asset-backed tokens, NFT marketplaces, retail, legal compliance, and more.

---

## **Tech Stack**

- **Backend**: Node.js, MongoDB
- **Frontend**: React.js, Tailwind CSS
- **Blockchain Integration**: Indexer URLs for Testnet, Mainnet, and Localnet

---

## **Installation and Setup**

### **Backend Setup**

1. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

2. **Create a `.env` file** with the following content:

   ```env
   # Backend server configuration
   PORT=1314
   HOST=0.0.0.0

   # MongoDB configuration
   # Replace <YOUR_MONGO_URI> with your MongoDB connection string.
   MONGO_URI=<YOUR_MONGO_URI>

   # Indexer URLs for blockchain
   TESTNET_INDEXER_URL=<Your Testnet Indexer URL>
   MAINNET_INDEXER_URL=<Your Mainnet Indexer URL>
   LOCALNET_INDEXER_URL=http://localhost

   # Indexer ports
   INDEXER_MAINNET_PORT=443
   INDEXER_TESTNET_PORT=443
   INDEXER_LOCALNET_PORT=8980
   ```

   - Replace `<YOUR_MONGO_URI>` with your MongoDB connection string, such as:  
     `mongodb+srv://username:password@clustername.mongodb.net/databaseName?retryWrites=true&w=majority`

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

---

### **Frontend Setup**

1. **Open a new terminal** and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the frontend server:**
   ```bash
   npm run dev
   ```

---

## **How to Use**

1. Open your browser and navigate to the address where the app is running (e.g., `http://localhost:5173`).
2. Use the **search functionality** to track the lifecycle of any NFT.
3. Visualize the data using the timeline and charts provided in the interface.

---

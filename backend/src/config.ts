import algosdk from "algosdk";
import dotenv from "dotenv";
dotenv.config();

export const port = Number(process.env.PORT) || 3000;
export const host = process.env.HOST || "localhost";
export const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017";
export const indexerLocalnetUrl =
  process.env.LOCALNET_INDEXER_URL || "https://testnet-idx.4160.nodely.dev";
export const indexerTestnetUrl =
  process.env.TESTNET_INDEXER_URL || "https://testnet-idx.4160.nodely.dev";
export const indexerMainnetUrl =
  process.env.MAINNET_INDEXER_URL || "https://mainnet-idx.4160.nodely.dev";

export const indexerLocalnetPort = Number(
  process.env.INDEXER_LOCALNET_PORT || 8980
);
export const indexerTestnetPort = Number(
  process.env.INDEXER_TESTNET_PORT || 443
);
export const indexerMainnetPort = Number(
  process.env.INDEXER_MAINNET_PORT || 443
);

export const localnetIndexerClient = new algosdk.Indexer("a".repeat(64), indexerLocalnetUrl, indexerLocalnetPort);
export const testnetIndexerClient = new algosdk.Indexer("a".repeat(64), indexerTestnetUrl, indexerTestnetPort);
export const mainnetIndexerClient = new algosdk.Indexer("a".repeat(64), indexerMainnetUrl, indexerMainnetPort);
import mongoose from "mongoose";
import express, { Request, Response } from "express";
import algosdk from "algosdk";
import cors from "cors";
import {
  AssetCreateTxn,
  PathTxn,
  AssetDetails,
  assetDetails,
} from "./model/AssetDetails";
import {
  localnetIndexerClient,
  testnetIndexerClient,
  mainnetIndexerClient,
  mongoUri,
  port,
  host,
} from "./config";

const app = express();
app.use(express.json());
app.use(cors());

async function processAssetTransactions(
  indexerClient: algosdk.Indexer,
  assetId: number,
  lastSyncRound: number = 0
) {
  let txns = await indexerClient
    .lookupAssetTransactions(assetId)
    .minRound(lastSyncRound == 0 ? 0 : lastSyncRound + 1)
    .do();
  let path: PathTxn[] = [];
  txns.transactions.forEach((txn) => {
    if (txn.createdAssetIndex) {
      if (txn.assetConfigTransaction) {
        path.push({
          assetCreateTxn: {
            sender: txn.sender,
            txid: txn.id || "",
            params: txn.assetConfigTransaction.params,
            timestamp: txn.roundTime || 0,
            confirmedRound: Number(txn.confirmedRound) || 0,
          },
        });
      }
    } else {
      if (txn.assetConfigTransaction) {
        if (!txn.assetConfigTransaction.params) {
          path.push({
            assetDestroyTxn: {
              sender: txn.sender,
              txid: txn.id || "",
              params: txn.assetConfigTransaction.params,
              timestamp: txn.roundTime || 0,
              confirmedRound: Number(txn.confirmedRound) || 0,
            },
          });
        } else {
          path.push({
            assetReConfigTxn: {
              sender: txn.sender,
              txid: txn.id || "",
              params: txn.assetConfigTransaction.params,
              timestamp: txn.roundTime || 0,
              confirmedRound: Number(txn.confirmedRound) || 0,
            },
          });
        }
      }
    }

    if (txn.assetTransferTransaction) {
      if (txn.assetTransferTransaction.amount > 0) {
        path.push({
          assetTransferTxn: {
            sender: txn.sender,
            from: txn.assetTransferTransaction.sender
              ? txn.assetTransferTransaction.sender
              : txn.sender,
            to: txn.assetTransferTransaction.receiver,
            amount: Number(txn.assetTransferTransaction.amount),
            type: txn.assetTransferTransaction.sender ? "clawback" : "normal",
            txid: txn.id || "",
            timestamp: txn.roundTime || 0,
            confirmedRound: Number(txn.confirmedRound) || 0,
          },
        });
      }
      if (
        txn.assetTransferTransaction.closeTo &&
        (txn.assetTransferTransaction.closeAmount
          ? txn.assetTransferTransaction.closeAmount > 0
          : false)
      ) {
        path.push({
          assetTransferTxn: {
            sender: txn.sender,
            from: txn.assetTransferTransaction.sender
              ? txn.assetTransferTransaction.sender
              : txn.sender,
            to: txn.assetTransferTransaction.closeTo,
            amount: Number(txn.assetTransferTransaction.closeAmount),
            type: "closeout",
            txid: txn.id || "",
            timestamp: txn.roundTime || 0,
            confirmedRound: Number(txn.confirmedRound) || 0,
          },
        });
      }
    }
  });

  lastSyncRound = Number(txns.currentRound);

  while (txns.nextToken) {
    txns = await indexerClient
      .lookupAssetTransactions(assetId)
      .nextToken(txns.nextToken)
      .do();

    txns.transactions.forEach((txn) => {
      if (txn.createdAssetIndex) {
        if (txn.assetConfigTransaction) {
          path.push({
            assetCreateTxn: {
              sender: txn.sender,
              txid: txn.id || "",
              params: txn.assetConfigTransaction.params,
              timestamp: txn.roundTime || 0,
              confirmedRound: Number(txn.confirmedRound) || 0,
            },
          });
        }
      } else {
        if (txn.assetConfigTransaction) {
          if (!txn.assetConfigTransaction.params) {
            path.push({
              assetDestroyTxn: {
                sender: txn.sender,
                txid: txn.id || "",
                params: txn.assetConfigTransaction.params,
                timestamp: txn.roundTime || 0,
                confirmedRound: Number(txn.confirmedRound) || 0,
              },
            });
          } else {
            path.push({
              assetReConfigTxn: {
                sender: txn.sender,
                txid: txn.id || "",
                params: txn.assetConfigTransaction.params,
                timestamp: txn.roundTime || 0,
                confirmedRound: Number(txn.confirmedRound) || 0,
              },
            });
          }
        }
      }

      if (txn.assetTransferTransaction) {
        if (txn.assetTransferTransaction.amount > 0) {
          path.push({
            assetTransferTxn: {
              sender: txn.sender,
              from: txn.assetTransferTransaction.sender
                ? txn.assetTransferTransaction.sender
                : txn.sender,
              to: txn.assetTransferTransaction.receiver,
              amount: Number(txn.assetTransferTransaction.amount),
              type: txn.assetTransferTransaction.sender ? "clawback" : "normal",
              txid: txn.id || "",
              timestamp: txn.roundTime || 0,
              confirmedRound: Number(txn.confirmedRound) || 0,
            },
          });
        }
        if (
          txn.assetTransferTransaction.closeTo &&
          (txn.assetTransferTransaction.closeAmount
            ? txn.assetTransferTransaction.closeAmount > 0
            : false)
        ) {
          path.push({
            assetTransferTxn: {
              sender: txn.sender,
              from: txn.assetTransferTransaction.sender
                ? txn.assetTransferTransaction.sender
                : txn.sender,
              to: txn.assetTransferTransaction.closeTo,
              amount: Number(txn.assetTransferTransaction.closeAmount),
              type: "closeout",
              txid: txn.id || "",
              timestamp: txn.roundTime || 0,
              confirmedRound: Number(txn.confirmedRound) || 0,
            },
          });
        }
      }
    });

    lastSyncRound = Number(txns.currentRound);
  }

  return { path, lastSyncRound };
}

(async () => {
  const DB = await mongoose.connect(mongoUri);

  app.listen(port, host, () => {
    console.log(`Server is running on port ${port}\nhttp://${host}:${port}`);
  });

  app.post("/", async (req: Request, res: Response) => {
    let indexerClient: algosdk.Indexer;
    const network = req.body.network;
    const assetId = req.body.assetId;
    switch (network) {
      case "localnet":
        indexerClient = localnetIndexerClient;
        break;
      case "testnet":
        indexerClient = testnetIndexerClient;
        break;
      case "mainnet":
        indexerClient = mainnetIndexerClient;
        break;
      default:
        res.status(400).json({ error: "Invalid network" });
        return;
    }

    let assetDetailsResult;
    try {
      assetDetailsResult = await indexerClient
        .lookupAssetByID(assetId)
        .includeAll()
        .do();
    } catch (e) {
      res.status(400).json({ error: "Asset not found" });
      return;
    }
    const decoder = new TextDecoder();

    if (network === "mainnet" || network === "testnet") {
      const existingAsset = await assetDetails
        .findOne({ assetId: assetId, network: network })
        .exec();

      if (!existingAsset) {
        const { path, lastSyncRound } = await processAssetTransactions(
          indexerClient,
          assetId
        );
        let assetDetail: AssetDetails = {
          assetId: Number(assetDetailsResult.asset.index),
          creator: assetDetailsResult.asset.params.creator,
          name: assetDetailsResult.asset.params.name || "",
          unitName: assetDetailsResult.asset.params.unitName || "",
          url: assetDetailsResult.asset.params.url || "",
          metadataHash:
            decoder.decode(assetDetailsResult.asset.params.metadataHash) || "",
          total: Number(assetDetailsResult.asset.params.total),
          decimals: Number(assetDetailsResult.asset.params.decimals),
          defaultFrozen: assetDetailsResult.asset.params.defaultFrozen || false,
          manager: assetDetailsResult.asset.params.manager || "",
          reserve: assetDetailsResult.asset.params.reserve || "",
          freeze: assetDetailsResult.asset.params.freeze || "",
          clawback: assetDetailsResult.asset.params.clawback || "",
          createdAtRound: Number(assetDetailsResult.asset.createdAtRound || 0),
          deleted: assetDetailsResult.asset.deleted || false,
          destroyedAtRound: assetDetailsResult.asset.destroyedAtRound
            ? Number(assetDetailsResult.asset.destroyedAtRound)
            : undefined,
          lastSyncRound,
          network,
          path: path,
        };

        const rec = new assetDetails(assetDetail);
        await rec.save();
        console.log(assetDetail);
        res.json(stringifyWithBigInt(assetDetail)).status(200);
      } else {
        const { path, lastSyncRound } = await processAssetTransactions(
          indexerClient,
          assetId,
          existingAsset.lastSyncRound
        );

        existingAsset.manager = assetDetailsResult.asset.params.manager || "";
        existingAsset.reserve = assetDetailsResult.asset.params.reserve || "";
        existingAsset.freeze = assetDetailsResult.asset.params.freeze || "";
        existingAsset.clawback = assetDetailsResult.asset.params.clawback || "";
        existingAsset.deleted = assetDetailsResult.asset.deleted || false;
        existingAsset.destroyedAtRound = assetDetailsResult.asset
          .destroyedAtRound
          ? Number(assetDetailsResult.asset.destroyedAtRound)
          : undefined;
        existingAsset.lastSyncRound = lastSyncRound;
        existingAsset.path = [...existingAsset.path, ...path];

        await existingAsset.save();

        res.json(stringifyWithBigInt(existingAsset)).status(200);
      }
    } else {
      const { path, lastSyncRound } = await processAssetTransactions(
        indexerClient,
        assetId
      );
      let assetDetail: AssetDetails = {
        assetId: Number(assetDetailsResult.asset.index),
        creator: assetDetailsResult.asset.params.creator,
        name: assetDetailsResult.asset.params.name || "",
        unitName: assetDetailsResult.asset.params.unitName || "",
        url: assetDetailsResult.asset.params.url || "",
        metadataHash:
          decoder.decode(assetDetailsResult.asset.params.metadataHash) || "",
        total: Number(assetDetailsResult.asset.params.total),
        decimals: Number(assetDetailsResult.asset.params.decimals),
        defaultFrozen: assetDetailsResult.asset.params.defaultFrozen || false,
        manager: assetDetailsResult.asset.params.manager || "",
        reserve: assetDetailsResult.asset.params.reserve || "",
        freeze: assetDetailsResult.asset.params.freeze || "",
        clawback: assetDetailsResult.asset.params.clawback || "",
        createdAtRound: Number(assetDetailsResult.asset.createdAtRound || 0),
        deleted: assetDetailsResult.asset.deleted || false,
        destroyedAtRound: assetDetailsResult.asset.destroyedAtRound
          ? Number(assetDetailsResult.asset.destroyedAtRound)
          : undefined,
        lastSyncRound,
        network,
        path: path,
      };
      res.json(stringifyWithBigInt(assetDetail)).status(200);
    }
  });
})();

function stringifyWithBigInt(obj: any): string {
  return JSON.parse(
    JSON.stringify(obj, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    )
  );
}

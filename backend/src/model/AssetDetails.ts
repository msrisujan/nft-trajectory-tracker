import mongoose, { Schema, Document, model } from "mongoose";

interface AssetPermenantDetails {
  assetId: number;
  creator: string;
  name: string;
  unitName: string;
  url: string;
  metadataHash: string;
  total: number;
  decimals: number;
  defaultFrozen: boolean;
  network: string;
}

interface AssetTempDetails {
  manager: string;
  reserve: string;
  freeze: string;
  clawback: string;
}

export interface AssetCreateTxn {
  sender: string;
  txid: string;
  params: any;
  timestamp: number;
  confirmedRound: number;
}

interface AssetTransferTxn {
  sender: string;
  from: string;
  to: string;
  amount: number;
  type: "normal" | "clawback" | "closeout";
  txid: string;
  timestamp: number;
  confirmedRound: number;
}

export interface PathTxn {
  assetCreateTxn?: AssetCreateTxn;
  assetReConfigTxn?: AssetCreateTxn;
  assetTransferTxn?: AssetTransferTxn;
  assetDestroyTxn?: AssetCreateTxn;
}

export interface AssetDetails extends AssetPermenantDetails, AssetTempDetails {
  createdAtRound: number;
  deleted: boolean;
  destroyedAtRound?: number;
  lastSyncRound: number;
  path: PathTxn[];
}

const pathTxnSchema = new Schema<PathTxn>({
  assetCreateTxn: {
    sender: String,
    txid: String,
    timestamp: Number,
    confirmedRound: Number,
    params: Object,
  },
  assetReConfigTxn: {
    sender: String,
    txid: String,
    timestamp: Number,
    confirmedRound: Number,
    params: Object,
  },
  assetTransferTxn: {
    sender: String,
    from: String,
    to: String,
    amount: Number,
    type: { type: String, enum: ["normal", "clawback", "closeout"] },
    txid: String,
    timestamp: Number,
    confirmedRound: Number,
  },
  assetDestroyTxn: {
    sender: String,
    txid: String,
    timestamp: Number,
    confirmedRound: Number,
    params: Object,
  },
});

const assetDetailsSchema = new Schema<AssetDetails>({
  assetId: { type: Number, required: true },
  creator: { type: String, required: true },
  name: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "name cannot be null or undefined",
    },
  },
  unitName: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "unitName cannot be null or undefined",
    },
  },
  url: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "url cannot be null or undefined",
    },
  },
  metadataHash: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "metadataHash cannot be null or undefined",
    },
  },
  total: { type: Number, required: true },
  decimals: { type: Number, required: true },
  defaultFrozen: { type: Boolean, required: true },
  manager: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "manager cannot be null or undefined",
    },
  },
  reserve: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "reserve cannot be null or undefined",
    },
  },
  freeze: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "freeze cannot be null or undefined",
    },
  },
  clawback: {
    type: String,
    required: false,
    default: "",
    validate: {
      validator: function (value: string) {
        return value !== null && value !== undefined;
      },
      message: "clawback cannot be null or undefined",
    },
  },
  createdAtRound: { type: Number, required: true },
  deleted: { type: Boolean, required: true },
  destroyedAtRound: { type: Number },
  lastSyncRound: { type: Number, required: true },
  network: { type: String, required: true, enum: ["mainnet", "testnet"] },
  path: { type: [pathTxnSchema], required: true },
});

export const assetDetails = model<AssetDetails>(
  "assetDetails",
  assetDetailsSchema
);

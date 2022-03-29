import { gql } from 'apollo-server-express';

export type TNft = 'card' | 'box';

export type TNetwork = 'fantom' | 'polygon';

export interface IOrdering {
  column: string;
  order: 'desc' | 'asc';
}

export interface IPagination {
  total: number;
  offset: number;
  limit: number;
  order: IOrdering[];
}

export interface IInventoryRequest {
  network: TNetwork;
  owner: string;
  tokenSymbol: string;
  pagination: Pick<IPagination, 'offset' | 'limit'>;
}

export interface IInventoryResponse {
  owner: string;
  network: TNetwork;
  pagination: IPagination;
  nftIdList: string[];
}

export interface IBoxCount {
  phase: number;
  total: number;
}

export interface IBoxCountRequest {
  network: TNetwork;
  owner: string;
}

export interface IBoxCountResponse {
  network: TNetwork;
  owner: string;
  boxes: IBoxCount[];
}

export interface IUnboxResultRequest {
  network: TNetwork;
  owner: string;
  pagination: Pick<IPagination, 'offset' | 'limit'>;
}

export interface IUnboxResult {
  nftId: string;
  nftBoxId: string;
  itemApplication: number;
  itemEdition: number;
  itemGeneration: number;
  itemRareness: number;
  itemType: number;
  itemId: number;
  itemSerial: number;
  transactionHash: string;
}

export interface IUnboxResultResponse {
  owner: string;
  network: string;
  pagination: IPagination;
  unbox: IUnboxResult[];
}

export interface ITransfer {
  id: number;
  chainId: number;
  tokenId: number;
  status: number;
  eventId: string;
  from: string;
  to: string;
  value: string;
  blockNumber: number;
  transactionHash: string;
  createdDate: string;
  updatedDate: string;
}

export interface ITransferDetail extends ITransfer {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: number;
  tokenAddress: string;
}

export interface IBoxTransferRequest {
  network: TNetwork;
  status: number;
  receiver: string;
  pagination: Pick<IPagination, 'offset' | 'limit'>;
}

export interface IMigrationRequest {
  network: TNetwork;
  sender: string;
  receiver: string;
  pagination: Pick<IPagination, 'offset' | 'limit'>;
}

export interface IBoxTransferResponse {
  network: TNetwork;
  pagination: IPagination;
  transfers: ITransferDetail[];
}

export const typeDefApp = [
  gql`
    type Query

    type Ordering {
      column: String
      order: String
    }

    type Pagination {
      total: Int
      offset: Int
      limit: Int
      order: [Ordering]
    }

    input PaginationInput {
      offset: Int
      limit: Int
    }

    type InventoryResponse {
      owner: String
      network: String
      pagination: Pagination
      nftIdList: [String]
    }

    type BoxCount {
      phase: Int
      total: Int
    }

    type BoxCountResponse {
      owner: String
      network: String
      boxes: [BoxCount]
    }

    type UnboxResult {
      nftId: String
      nftBoxId: String
      itemApplication: Int
      itemEdition: Int
      itemGeneration: Int
      itemRareness: Int
      itemType: Int
      itemId: Int
      itemSerial: Int
      transactionHash: String
    }

    type UnboxResultResponse {
      owner: String
      network: String
      pagination: Pagination
      unbox: [UnboxResult]
    }

    type TransferDetail {
      id: Int
      chainId: Int
      tokenId: Int
      status: Int
      eventId: String
      from: String
      to: String
      value: String
      blockNumber: Int
      transactionHash: String
      createdDate: String
      updatedDate: String
      tokenName: String
      tokenSymbol: String
      tokenDecimal: Int
      tokenAddress: String
    }

    type TransferResponse {
      network: String
      pagination: Pagination
      transfers: [TransferDetail]
    }

    extend type Query {
      inventory(network: String, owner: String, tokenSymbol: String, pagination: PaginationInput): InventoryResponse
      countBox(network: String, owner: String): BoxCountResponse
      unboxResult(network: String, owner: String, pagination: PaginationInput): UnboxResultResponse
      transfers(status: String, network: String, receiver: String, pagination: PaginationInput): TransferResponse
      migrations(network: String, sender: String, receiver: String, pagination: PaginationInput): TransferResponse
    }
  `,
];

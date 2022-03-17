/* eslint-disable no-await-in-loop */
import { Knex } from 'knex';
import { ModelMysqlBasic, IPagination, IResponse, IModelCondition } from '@dkdao/framework';
import { IBoxCount, TNetwork } from '../apollo/typedef';

export interface IOwnership {
  id: number;
  tokenId: number;
  owner: string;
  nftId: string;
  transactionHash: string;
  updatedDate: string;
  createdDate: string;
}

export interface IOwnershipQuery extends IOwnership {
  't.symbol': string;
}

export interface IOwnershipDetail extends IOwnership {
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
}

export class ModelOwnership extends ModelMysqlBasic<IOwnership> {
  private network: TNetwork;

  constructor(network: TNetwork) {
    super('ownership', network);
    this.network = network;
  }

  public basicQuery(): Knex.QueryBuilder {
    return this.getDefaultKnex().select('*');
  }

  public async countBox(owner: string): Promise<IBoxCount[]> {
    if (this.network === 'polygon') return [{ phase: 0, total: 0 }];
    const data = await this.getKnex()(`${this.tableName} as o`)
      .select('nftId')
      .join('token as t', 't.id', 'o.tokenId')
      .where({ owner, 't.symbol': 'DKI' });
    const result: IBoxCount[] = [];
    const phaseMap = new Map<number, number>();
    for (let i = 0; i < data.length; i += 1) {
      const { nftId } = data[i];
      const phase = parseInt(nftId.substring(2, nftId.length - 16), 16);
      if (phaseMap.has(phase)) {
        phaseMap.set(phase, (phaseMap.get(phase) || 1) + 1);
      } else {
        phaseMap.set(phase, 1);
      }
    }
    const entries = phaseMap.entries();
    for (let entry = entries.next().value; typeof entry !== 'undefined'; entry = entries.next().value) {
      const [phase, total] = entry;
      result.push({ phase, total });
    }

    return result;
  }

  public async getNftList(
    pagination: IPagination = { offset: 0, limit: 1000, order: [] },
    conditions?: IModelCondition<IOwnershipQuery>[],
  ): Promise<IResponse<IOwnershipQuery>> {
    return this.getListByCondition<IOwnershipQuery>(
      this.attachConditions(
        this.getKnex()(`${this.tableName} as o`).select('nftId').join('token as t', 't.id', 'o.tokenId'),
        conditions as any,
      ),
      pagination,
    );
  }
}

export default ModelOwnership;

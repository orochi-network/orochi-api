/* eslint-disable no-await-in-loop */
import { Knex } from 'knex';
import { ModelMysqlBasic, IPagination, IModelCondition, IResponse } from '@dkdao/framework';
import { TNetwork } from '../apollo/typedef';

export interface IUnboxResult {
  id: number;
  tokenId: number;
  nftBoxId: string;
  owner: string;
  nftId: string;
  itemApplication: number;
  itemEdition: number;
  itemGeneration: number;
  itemRareness: number;
  itemType: number;
  itemId: number;
  itemSerial: number;
  transactionHash: string;
  updatedDate: string;
}

export class ModelUnboxResult extends ModelMysqlBasic<IUnboxResult> {
  constructor(network: TNetwork) {
    super('unbox_result', network);
  }

  public basicQuery(): Knex.QueryBuilder {
    return this.getDefaultKnex().select('*');
  }

  public async getUnboxResultList(
    pagination: IPagination = { offset: 0, limit: 20, order: [] },
    conditions?: IModelCondition<IUnboxResult>[],
  ): Promise<IResponse<IUnboxResult>> {
    return this.getListByCondition<IUnboxResult>(
      this.attachConditions(
        this.getKnex()(`${this.tableName}`).select(
          'nftId',
          'nftBoxId',
          'itemApplication',
          'itemEdition',
          'itemGeneration',
          'itemRareness',
          'itemType',
          'itemId',
          'itemSerial',
          'transactionHash',
        ),
        conditions,
      ),
      pagination,
    );
  }
}

export default ModelUnboxResult;

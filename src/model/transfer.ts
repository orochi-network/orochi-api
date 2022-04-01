import { IModelCondition, IPagination, IResponse, ModelMysqlBasic } from '@dkdao/framework';
import { Knex } from 'knex';
import { ITransfer, ITransferDetail, TNetwork } from '../apollo/typedef';

const zeroAddress = '0x0000000000000000000000000000000000000000';

export enum ETransferStatus {
  NewTransfer = 0,
  Processing = 1,
  Success = 254,
  Error = 255,
}

export class ModelTransfer extends ModelMysqlBasic<ITransfer> {
  constructor(network: TNetwork) {
    super('transfer', network);
  }

  public basicQuery(): Knex.QueryBuilder {
    return this.getDefaultKnex().select('*');
  }

  public async getBoxTransferList(
    pagination: IPagination = { offset: 0, limit: 20, order: [] },
    conditions?: IModelCondition<ITransfer>[],
  ): Promise<IResponse<ITransferDetail>> {
    return this.getListByCondition<ITransferDetail>(
      this.attachConditions(
        this.getKnex()(`${this.tableName} as e`)
          .select('*')
          .select(
            'e.id as id',
            't.name as tokenName',
            't.symbol as tokenSymbol',
            't.decimal as tokenDecimal',
            't.address as tokenAddress',
            'e.createdDate as createdDate',
            'e.updatedDate as updatedDate',
          )
          .join(`token as t`, 'e.tokenId', 't.id')
          .where('from', zeroAddress)
          .where('t.symbol', 'DKI'),
        conditions,
      ),
      pagination,
    );
  }

  public async getMigrationList(
    pagination: IPagination = { offset: 0, limit: 20, order: [] },
    conditions?: IModelCondition<ITransfer>[],
  ): Promise<IResponse<ITransferDetail>> {
    return this.getListByCondition<ITransferDetail>(
      this.attachConditions(
        this.getKnex()(`${this.tableName} as e`)
          .select('*')
          .select(
            'e.id as id',
            't.name as tokenName',
            't.symbol as tokenSymbol',
            't.decimal as tokenDecimal',
            't.address as tokenAddress',
            'e.createdDate as createdDate',
            'e.updatedDate as updatedDate',
          )
          .join(`token as t`, 'e.tokenId', 't.id'),
        conditions,
      ),
      pagination,
    );
  }
}

export default ModelTransfer;

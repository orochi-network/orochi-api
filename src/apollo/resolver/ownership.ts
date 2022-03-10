import {
  IBoxCountRequest,
  IBoxCountResponse,
  IInventoryRequest,
  IInventoryResponse,
  IUnboxResult,
  IUnboxResultRequest,
  IUnboxResultResponse,
} from '../typedef';
import ModelOwnership, { IOwnership } from '../../model/ownership';
import { IRecordList } from '@dkdao/framework';
import ModelUnboxResult from '../../model/unbox-result';

export const resolverOwnership = {
  Query: {
    inventory: async (_: any, { network, owner, pagination }: IInventoryRequest): Promise<IInventoryResponse> => {
      const imOwnership = new ModelOwnership(network);

      const { result, success } = await imOwnership.getNftList(
        { ...(pagination || { offset: 0, limit: 1000 }), order: [] },
        [
          {
            field: 'owner',
            value: owner,
          },
        ],
      );

      if (success) {
        const { total, offset, limit, order, records } = <IRecordList<IOwnership>>result;
        return {
          network,
          owner,
          pagination: { total: total || 0, offset, limit, order },
          nftIdList: records.map((e: IOwnership) => e.nftId),
        };
      }
      return {
        network,
        owner,
        pagination: {
          total: 0,
          order: [],
          ...pagination,
        },
        nftIdList: [],
      };
    },
    countBox: async (_: any, { network, owner }: IBoxCountRequest): Promise<IBoxCountResponse> => {
      const imOwnership = new ModelOwnership(network);
      console.log({
        network,
        owner,
        boxes: await imOwnership.countBox(owner),
      });
      return {
        network,
        owner,
        boxes: await imOwnership.countBox(owner),
      };
    },
    unboxResult: async (_: any, { network, owner, pagination }: IUnboxResultRequest): Promise<IUnboxResultResponse> => {
      const imUnboxResult = new ModelUnboxResult(network);

      const { result, success } = await imUnboxResult.getUnboxResultList(
        { ...(pagination || { offset: 0, limit: 1000 }), order: [] },
        [
          {
            field: 'owner',
            value: owner,
          },
        ],
      );

      if (success) {
        const { total, offset, limit, order, records } = <IRecordList<IUnboxResult>>result;
        return {
          network,
          owner,
          pagination: { total: total || 0, offset, limit, order },
          unbox: records,
        };
      }
      return {
        network,
        owner,
        pagination: {
          total: 0,
          order: [],
          ...pagination,
        },
        unbox: [],
      };
    },
  },
};

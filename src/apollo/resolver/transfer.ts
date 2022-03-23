import { IModelCondition, IRecordList } from '@dkdao/framework';
import { utils } from 'ethers';
import ModelTransfer from '../../model/transfer';
import {
    IBoxTransferRequest,
    IBoxTransferResponse,
    ITransferDetail
} from '../typedef';

export const resolverTransfer = {
    Query: {
        transfers: async (_: any, { status, receiver, network, pagination }: IBoxTransferRequest): Promise<IBoxTransferResponse> => {
            const imNftTransfer = new ModelTransfer(network);

            const paginate = { ...(pagination || { offset: 0, limit: 1000 }), order: [] }
            const conditions: IModelCondition<any>[] = [];

            if (typeof status === 'number' && Number.isInteger(status)) {
                conditions.push({
                    field: 'status',
                    value: status,
                });
            }
            if (typeof receiver === 'string' && utils.isAddress(receiver)) {
                conditions.push({
                    field: 'to',
                    value: receiver,
                });
            }
           
            const { result, success } = await imNftTransfer.getBoxTransferList(paginate, <any>conditions)

            if (success) {
                const { total, offset, limit, order, records } = <IRecordList<ITransferDetail>>result;
                return {
                    network,
                    pagination: { total: total || 0, offset, limit, order },
                    transfers: records,
                };
            }
            return {
                network,
                pagination: {
                    total: 0,
                    order: [],
                    ...pagination,
                },
                transfers: [],
            };
        },
    },
};

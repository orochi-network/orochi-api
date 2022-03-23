import { resolverOwnership } from './ownership';
import { resolverTransfer } from './transfer';

export const resolverApp = [
    resolverOwnership,
    resolverTransfer
];

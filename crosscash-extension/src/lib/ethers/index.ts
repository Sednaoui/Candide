import {
    BaseProvider,
    TransactionRequest,
} from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { cloneDeep } from 'lodash';

import { HexString } from '../accounts';
import { ITxData } from '../walletconnect/types';

export const sendTransaction = async ({
    provider,
    fromAddress,
    transaction,
    privateKey,
}: {
    provider: BaseProvider,
    fromAddress: HexString,
    transaction: TransactionRequest | ITxData,
    privateKey: string,
}) => {
    const _transaction = cloneDeep(transaction);

    if (!fromAddress) {
        throw new Error('No Active Account');
    }

    try {
        if (transaction.from
            && transaction.from.toLowerCase() !== fromAddress.toLowerCase()
        ) {
            throw new Error('Transaction request From doesn\'t match active account');
        }

        const balance = await provider.getBalance(fromAddress);

        if (_transaction.value) {
            if (balance.lt(_transaction.value)) {
                throw new Error('Insufficient balance to pay for transaction');
            }
        }

        const nonce = await provider.getTransactionCount(fromAddress, 'latest');

        if (nonce !== _transaction.nonce) {
            throw new Error('Transaction request nonce doesn\'t match active account');
        }

        // ethers.js expects gasLimit instead
        if ('gas' in _transaction) {
            _transaction.gasLimit = _transaction.gas;
            delete _transaction.gas;
        }

        const walletSigner = new Wallet(privateKey, provider);

        const result = await walletSigner.sendTransaction(_transaction as TransactionRequest);

        return result.hash;
    } catch (error: any) {
        throw new Error(error);
    }
};

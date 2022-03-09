import {
    BaseProvider,
    TransactionRequest,
} from '@ethersproject/providers';
import { Wallet } from 'ethers';
import { cloneDeep } from 'lodash';

import { HexString } from '../accounts';
import { ITxData } from '../walletconnect/types';

const validateTransaction = async ({
    provider,
    fromAddress,
    transaction,
}: {
    provider: BaseProvider,
    fromAddress: HexString,
    transaction: TransactionRequest | ITxData,
}) => {
    const _transaction = cloneDeep(transaction);

    if (!fromAddress) {
        return new Error('No Active Account');
    }

    try {
        if (transaction.from
            && transaction.from.toLowerCase() !== fromAddress.toLowerCase()
        ) {
            return new Error('Transaction request From doesn\'t match active account');
        }

        const balance = await provider.getBalance(fromAddress);

        if (_transaction.value) {
            if (balance.lt(_transaction.value)) {
                return new Error('Insufficient balance to pay for transaction');
            }
        }

        const nonce = await provider.getTransactionCount(fromAddress, 'latest');

        if (nonce !== _transaction.nonce) {
            return new Error('Transaction request nonce doesn\'t match active account');
        }

        // ethers.js expects gasLimit instead
        if ('gas' in _transaction) {
            _transaction.gasLimit = _transaction.gas;
            delete _transaction.gas;
        }

        return _transaction;
    } catch (error: any) {
        return new Error(error);
    }
};

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
    try {
        const transactionValidated = validateTransaction({
            provider,
            fromAddress,
            transaction,
        });
        const walletSigner = new Wallet(privateKey, provider);

        const result = await walletSigner.sendTransaction(
            transactionValidated as TransactionRequest,
        );

        return result.hash;
    } catch (error: any) {
        return new Error(error);
    }
};
    }
};

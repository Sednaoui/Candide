import {
    L2Provider,
    asL2Provider,
} from '@eth-optimism/sdk';
import {
    Provider,
    TransactionRequest,
} from '@ethersproject/providers';

const getProvider = async (provider: Provider) => {
    const l2RpcProvider = asL2Provider(provider);

    return l2RpcProvider;
};

const getEstimates = async (provider: L2Provider<Provider>, tx: TransactionRequest) => ({
    totalCost: await provider.estimateTotalGasCost(tx),
    l1Cost: await provider.estimateL1GasCost(tx),
    l2Cost: await provider.estimateL2GasCost(tx),
    l1Gas: await provider.estimateL1Gas(tx),
});

export const estimateGasOnOptimism = async ({ provider, tx }: {
    provider: Provider,
    tx: TransactionRequest,
}) => {
    const l2Provider = await getProvider(provider);

    let transactionRequest = tx;

    // get nonce until bug is fix on optimism
    if (!tx.nonce && tx.from) {
        const nonce = await provider.getTransactionCount(tx.from);

        transactionRequest = {
            ...transactionRequest,
            nonce,
        };
    }

    const estimates = await getEstimates(l2Provider, transactionRequest);

    return estimates;
};

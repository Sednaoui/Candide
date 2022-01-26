import { Provider } from '@ethersproject/providers';
import { utils } from 'ethers';

import {
    BlockPrices,
    EVMNetwork,
} from '../../lib/networks';

export default async function getBlockPrices(
    network: EVMNetwork,
    provider: Provider,
): Promise<BlockPrices> {
    const [currentBlock, feeData] = await Promise.all([
        provider.getBlock('latest'),
        provider.getFeeData(),
    ]);

    if (feeData.gasPrice === null) {
        utils.Logger.arguments('Not receiving accurate gas prices from provider', feeData);
    }

    const gasPrice = feeData?.gasPrice?.toBigInt() || 0n;

    if (feeData.maxPriorityFeePerGas === null || feeData.maxFeePerGas === null) {
        utils.Logger.arguments(
            'Not receiving accurate EIP-1559 gas prices from provider',
            feeData,
        );
    }

    const maxFeePerGas = feeData?.maxFeePerGas?.toBigInt() || 0n;
    const maxPriorityFeePerGas = feeData?.maxPriorityFeePerGas?.toBigInt() || 0n;

    return {
        network,
        blockNumber: currentBlock.number,
        baseFeePerGas: (maxFeePerGas - maxPriorityFeePerGas) / 2n,
        estimatedTransactionCount: null,
        estimatedPrices: [
            {
                confidence: 99,
                maxPriorityFeePerGas,
                maxFeePerGas,
                price: gasPrice,
            },
        ],
        dataSource: 'local',
    };
}

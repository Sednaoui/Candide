import { Provider } from '@ethersproject/providers';
import { utils } from 'ethers';

import Blocknative, { BLOCKNATIVE_API_KEY } from '../../lib/blocknative/blocknative';
import {
    BlockPrices,
    EVMNetwork,
} from '../../lib/networks';

/**
 * Get block prices for a particular network and block number.
 * @param network
 * @param provider
 * @returns blockPrices for the given network and block number
 */

export default async function getBlockPrices(
    network: EVMNetwork,
    provider: Provider,
): Promise<BlockPrices> {
    if (BLOCKNATIVE_API_KEY) {
        try {
            const blockprices = await getBlockPricesBN(network);

            if (blockprices) {
                return blockprices;
            }
        } catch (e) {
            console.error(e);
        }
    }

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

/**
 * Get block prices for a particular network and block numbe using blocknative
 * @param network
 * @returns blockPrices for the given network and block number or null if not found
 */
export async function getBlockPricesBN(
    network: EVMNetwork,
): Promise<BlockPrices | null> {
    if (
        typeof BLOCKNATIVE_API_KEY !== 'undefined'
    ) {
        try {
            const blocknative = Blocknative.connect(
                BLOCKNATIVE_API_KEY,
                Number(network.chainID),
            );

            return await blocknative.getBlockPrices();
        } catch (err) {
            console.error('Error getting block prices from BlockNative', err);
        }
    } else {
        console.error(
            'Blocknative API key not found, falling back to local block prices',
        );
    }
    return null;
}

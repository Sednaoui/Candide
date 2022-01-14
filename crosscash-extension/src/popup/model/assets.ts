import { AlchemyProvider } from '@ethersproject/providers';

import { HexString } from '../../util/accounts';
import {
    getTokenBalances,
    getTokenMetadata,
} from '../../util/alchemy';
import { AnyAssetAmount } from '../../util/assets';
import { fromFixedPoint } from '../../util/helpers';

/**
 * Retrieve token balances for a particular account on a particular network,
 * saving the resulting balances and adding any asset with a non-zero balance
 * to the list of assets to track.
 *
 * @param addressNetwork
 * @param contractAddresses
 */
export async function retrieveTokenBalances(
    provider: AlchemyProvider,
    address: HexString,
): Promise<AnyAssetAmount[]> {
    const balances = await getTokenBalances(
        provider,
        address,
    );

    return Promise.all(balances.map(async ({ contractAddress, amount }) => {
        const token = await getTokenMetadata(provider, contractAddress);

        const { decimals } = token;

        const balanceAmount = fromFixedPoint(amount, decimals, 4);

        return {
            asset: token,
            amount: balanceAmount,
        };
    }));
}

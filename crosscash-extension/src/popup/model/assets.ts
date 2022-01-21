import { AlchemyProvider } from '@ethersproject/providers';

import { HexString } from '../../lib/accounts';
import {
    getTokenBalances,
    getTokenMetadata,
} from '../../lib/alchemy';
import { AnyAssetAmount } from '../../lib/assets';
import { ETH } from '../../lib/constants/currencies';
import { fromFixedPoint } from '../../lib/helpers';

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
    // get ERC-20 balances
    const balances = await getTokenBalances(
        provider,
        address,
    );

    // get ETH balance
    const ethBalance = await provider.getBalance(address);

    const formatedEthBalance = fromFixedPoint(
        BigInt(ethBalance.toString()),
        ETH.decimals,
        4,
    );

    const ethAssetAmount = {
        asset: ETH,
        amount: formatedEthBalance,
    };

    const nonZeroBalances = balances.filter((balance) => balance.amount > 0n);

    const erc20AssetAmount = Promise.all(nonZeroBalances.map(async ({
        contractAddress,
        amount,
    }) => {
        const token = await getTokenMetadata(provider, contractAddress);

        const { decimals } = token;

        const balanceAmount = fromFixedPoint(amount, decimals, 4);

        return {
            asset: token,
            amount: balanceAmount,
        };
    }));

    return [
        ethAssetAmount,
        ...(await erc20AssetAmount),
    ];
}

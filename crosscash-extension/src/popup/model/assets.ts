import { AlchemyProvider } from '@ethersproject/providers';

import { HexString } from '../../lib/accounts';
import { getTokenMetadata } from '../../lib/alchemy';
import { AnyAssetAmount } from '../../lib/assets';
import {
    baseAddress,
    ETH,
    MATIC,
} from '../../lib/constants/currencies';
import { POLYGON } from '../../lib/constants/networks';
import { getBalances } from '../../lib/zapper';

/**
 * Retrieve token balances for a particular account on a particular network,
 * saving the resulting balances and adding any asset with a non-zero balance
 * to the list of assets to track.
 *
 * @param addressNetwork
 * @param contractAddresses
 * @returns a list of asset and its balance
 */
export async function retrieveTokenBalances(
    provider: AlchemyProvider,
    address: HexString,
): Promise<AnyAssetAmount[]> {
    // get base asset balance and ERC-20 balances
    const balances = await getBalances(
        address,
        provider.network.chainId,
    );

    // get base asset balance
    const baseAssetBalance = balances.find(({ contractAddress }) =>
        contractAddress === baseAddress)?.amount || 0;

    const baseAssetAmount = {
        asset: provider.network.chainId === Number(POLYGON.chainID) ? MATIC : ETH,
        amount: baseAssetBalance,
    };

    // filter out non-zero balances && base asset balance
    const nonZeroERC20Balances = balances.filter(
        (balance) => balance.amount > 0n && balance.contractAddress !== baseAddress,
    );

    const erc20AssetAmount = Promise.all(nonZeroERC20Balances.map(async ({
        contractAddress,
        amount,
    }) => {
        const token = await getTokenMetadata(provider, contractAddress);

        return {
            asset: token,
            amount,
        };
    }));

    return [
        baseAssetAmount,
        ...(await erc20AssetAmount),
    ];
}

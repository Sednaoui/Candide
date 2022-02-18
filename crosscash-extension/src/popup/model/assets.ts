import { AlchemyProvider } from '@ethersproject/providers';

import { HexString } from '../../lib/accounts';
import { getTokenMetadata as getTokenMetadataAlchemy } from '../../lib/alchemy';
import { AnyAssetAmount } from '../../lib/assets';
import {
    baseAddress,
    ETH,
    MATIC,
} from '../../lib/constants/currencies';
import {
    MAINNET,
    POLYGON,
} from '../../lib/constants/networks';
import { getTokenMetadata as getTokenMetadataTrust } from '../../lib/trustwallet';
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
    const { chainId } = provider.network;
    // get base asset balance and ERC-20 balances
    const balances = await getBalances(
        address,
        chainId,
    );

    // get base asset balance
    const baseAssetBalance = balances.find(({ contractAddress }) =>
        contractAddress === baseAddress)?.amount || 0;

    const baseAssetAmount = {
        asset: chainId === POLYGON.chainID ? MATIC : ETH,
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
        const tokenMetaDataTrust = await getTokenMetadataTrust(chainId, contractAddress);

        if (tokenMetaDataTrust) {
            return {
                asset: tokenMetaDataTrust,
                amount,
            };
        }

        // if token not found using trust wallet asset list, try alchemy on mainnet
        if (!tokenMetaDataTrust && chainId === MAINNET.chainID) {
            const tokenMetadataAlchemy = await getTokenMetadataAlchemy(provider, contractAddress);

            return {
                asset: tokenMetadataAlchemy,
                amount,
            };
        }

        // if token not found, return unknow.
        // TODO: handle this case better
        return {
            asset: {
                contractAddress,
                name: 'Unknown',
                symbol: 'N/A',
                decimals: 18,
            },
            amount,
        };
    }));

    return [
        baseAssetAmount,
        ...(await erc20AssetAmount),
    ];
}

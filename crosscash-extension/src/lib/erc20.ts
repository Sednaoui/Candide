import { AlchemyProvider } from '@ethersproject/providers';

import { HexString } from './accounts';
import { getTokenBalances } from './alchemy';
import { SmartContractFungibleAsset } from './assets';

/*
 * Get multiple token balances for an account using Alchemy.
 *
 * If no token contracts are provided, no balances will be returned.
 */
export async function getBalances(
    provider: AlchemyProvider,
    address: HexString,
    tokens?: SmartContractFungibleAsset[],
): Promise<{ contractAddress: string; amount: bigint }[]> {
    const tokenContractAddresses = tokens ? tokens.map((t) => t.contractAddress) : undefined;
    const tokenBalances = await getTokenBalances(
        provider,
        address,
        tokenContractAddresses || undefined,
    );

    return tokenBalances;
}


import {
    AlchemyProvider,
    AlchemyWebSocketProvider,
} from '@ethersproject/providers';

import { HexString } from './accounts';
import { SmartContractFungibleAsset } from './assets';
import { getEthereumNetwork } from './helpers';

/**
 * alchemy_getTokenBalances return type for tokenBalances
 */
type TokenBalance = {
    contractAddress: HexString;
    tokenBalance: string;
    error: string;
}

/**
 * alchemy_getTokenBalances return type for token Balances
 */
type TokenBalances = {
    address: HexString;
    tokenBalances: TokenBalance[];
}

/**
 * alchemy_getTokenMetadata return type
 */
type TokenMetaData = {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
}

/**
 * Use Alchemy's getTokenBalances call to get balances for a particular address.
 *
 *
 * More information https://docs.alchemy.com/alchemy/documentation/enhanced-apis/token-api
 *
 * @param provider an Alchemy ethers provider
 * @param address the address whose balances we're fetching
 * @param tokens An optional list of hex-string contract addresses. If the list
 *        isn't provided, Alchemy will choose based on the top 100 high-volume
 *        tokens on its platform
 */
export async function getTokenBalances(
    provider: AlchemyProvider | AlchemyWebSocketProvider,
    address: HexString,
    tokens?: string[],
): Promise<{ contractAddress: string; amount: bigint }[]> {
    const json: TokenBalances = await provider.send('alchemy_getTokenBalances', [
        address,
        tokens || 'DEFAULT_TOKENS',
    ]);

    // TODO log balances with errors, consider returning an error type
    return (
        json.tokenBalances
            .filter(
                (
                    b: TokenBalance,
                ): b is typeof json['tokenBalances'][0] & {
                    tokenBalance: Exclude<
                        typeof json['tokenBalances'][0]['tokenBalance'],
                        null
                    >
                } => b.error === null && b.tokenBalance !== null,
            )
            // A hex value of 0x without any subsequent numbers generally means "no
            // value" (as opposed to 0) in Ethereum implementations, so filter it out
            // as effectively undefined.
            .filter(({ tokenBalance }: TokenBalance) => tokenBalance !== '0x')
            .map((tokenBalance: TokenBalance) => {
                let balance = tokenBalance.tokenBalance;

                if (balance.length > 66) {
                    balance = balance.substring(0, 66);
                }
                return {
                    contractAddress: tokenBalance.contractAddress,
                    amount: BigInt(balance),
                };
            })
    );
}

/**
 * Use Alchemy's getTokenMetadata call to get metadata for a token contract on
 * Ethereum.
 *
 * More information https://docs.alchemy.com/alchemy/documentation/enhanced-apis/token-api
 *
 * @param provider an Alchemy ethers provider
 * @param contractAddress the address of the token smart contract whose
 *        metadata should be returned
 */
export async function getTokenMetadata(
    provider: AlchemyProvider | AlchemyWebSocketProvider,
    contractAddress: HexString,
): Promise<SmartContractFungibleAsset> {
    const json: TokenMetaData = await provider.send('alchemy_getTokenMetadata', [
        contractAddress,
    ]);

    return {
        decimals: json.decimals,
        name: json.name,
        symbol: json.symbol,
        metadata: {
            tokenLists: [],
            ...(json.logo ? { logoURL: json.logo } : {}),
        },
        homeNetwork: getEthereumNetwork(), // TODO make multi-network friendly
        contractAddress,
    };
}

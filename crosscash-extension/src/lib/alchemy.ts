
import {
    AlchemyProvider,
    AlchemyWebSocketProvider,
} from '@ethersproject/providers';
import { utils } from 'ethers';

import { HexString } from './accounts';
import {
    SmartContractFungibleAsset,
    AssetTransfer,
} from './assets';
import { ETH } from './constants/currencies';
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

/**
 * Use Alchemy's getAssetTransfers call to get historical transfers for an
 * account.
 *
 * Note that pagination isn't supported in this wrapper, so any responses after
 * 1k transfers will be dropped.
 *
 * More information
 * https://docs.alchemy.com/alchemy/enhanced-apis/transfers-api#alchemy_getassettransfers
 * @param provider an Alchemy ethers provider
 * @param account the account whose transfer history we're fetching
 * @param fromBlock the block height specifying how far in the past we want
 *        to look.
 */
export async function getAssetTransfers(
    provider: AlchemyProvider | AlchemyWebSocketProvider,
    account: string,
    fromBlock: number,
    toBlock?: number,
): Promise<AssetTransfer[]> {
    const params = {
        fromBlock: utils.hexValue(fromBlock),
        toBlock: toBlock === undefined ? 'latest' : utils.hexValue(toBlock),
        // excludeZeroValue: false,
    };

    // TODO handle partial failure
    const rpcResponses = await Promise.all([
        provider.send('alchemy_getAssetTransfers', [
            {
                ...params,
                fromAddress: account,
            },
        ]),
        provider.send('alchemy_getAssetTransfers', [
            {
                ...params,
                toAddress: account,
            },
        ]),
    ]);

    return rpcResponses
        .flatMap((jsonResponse: any) => jsonResponse.transfers)
        .map((transfer) => {
            // TODO handle NFT asset lookup properly
            if (transfer.erc721TokenId) {
                return null;
            }

            // we don't care about 0-value transfers
            // TODO handle nonfungible assets properly
            // TODO handle assets with a contract address and no name
            if (
                !transfer.rawContract
                || !transfer.rawContract.value
                || !transfer.rawContract.decimal
                || !transfer.asset
            ) {
                return null;
            }

            const ethereumNetwork = getEthereumNetwork();

            const asset = transfer.rawContract.address
                ? {
                    contractAddress: transfer.rawContract.address,
                    decimals: Number(BigInt(transfer.rawContract.decimal)),
                    symbol: transfer.asset,
                    homeNetwork: ethereumNetwork,
                }
                : ETH;

            return {
                network: ethereumNetwork,
                assetAmount: {
                    asset,
                    amount: BigInt(transfer.rawContract.value),
                },
                txHash: transfer.hash,
                to: transfer.to,
                from: transfer.from,
                dataSource: 'alchemy',
            } as AssetTransfer;
        })
        .filter((t): t is AssetTransfer => t !== null);
}

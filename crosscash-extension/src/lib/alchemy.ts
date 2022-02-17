
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
 * alchemy_getTokenMetadata return type
 */
type TokenMetaData = {
    name: string;
    symbol: string;
    decimals: number;
    logo: string;
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
    const network = getEthereumNetwork(provider.network.chainId);

    try {
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
            homeNetwork: network,
            contractAddress,
        };
    } catch (e) {
        // TODO: Token metadata is not available for all networks. Need to find another service
        // for now, we return an empty object to indicate that we don't have metadata for this token
        return {
            decimals: 0,
            name: '',
            symbol: '',
            metadata: {
                tokenLists: [],
            },
            homeNetwork: network,
            contractAddress,
        };
    }
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

            const ethereumNetwork = getEthereumNetwork(provider.network.chainId);

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

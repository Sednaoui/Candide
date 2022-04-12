import { HexString } from '../accounts';
import { SmartContractFungibleAsset } from '../assets';
import { baseAddress } from '../constants/currencies';
import { getEthereumNetwork } from '../helpers';
import {
    TrustWalletTokenJSONSchema,
    TrustWalletTokenListJSONSchema,
} from './types';

const trustWalletURL = 'https://cdn.statically.io/gh/trustwallet';
const assetsTWURL = `${trustWalletURL}/assets/77f1dbc4/blockchains`;

/**
 * This function returns the metadata for a token contract on several networks
 * @param {number} chainId the chainId of the network
 * @param {HexString} contractAddress the address of the token smart contract whose
 * @returns {SmartContractFungibleAsset} the metadata for the token contract
 */
export async function getTokenMetadata(
    chainId: number,
    contractAddress: HexString,
): Promise<SmartContractFungibleAsset | null> {
    const network = getEthereumNetwork(chainId);

    const networkName = network.name.toLowerCase();

    // handle baseAddress case to fetch from info of blockchain instead of regular asset list
    // ETH or MATIC
    if (contractAddress === baseAddress) {
        const response = await fetch(`${assetsTWURL}/${network.name}/info/info.json`);
        const tokenInfo: TrustWalletTokenJSONSchema = await response.json();
        const logoURL = `${assetsTWURL}/${network.name}/info/logo.png`;

        return {
            name: tokenInfo.name,
            decimals: tokenInfo.decimals,
            symbol: tokenInfo.symbol,
            contractAddress,
            metadata: {
                logoURL,
                websiteURL: tokenInfo.website,
                tokenLists: [],
            },
            homeNetwork: network,
        };
    }

    // check contractAddress case sensitivity using whilelist from TrustWallet
    try {
        const tokenList: Response = await fetch(
            `${assetsTWURL}/${networkName}/tokenlist.json`,
        );

        const trustWalletTokenListJSON: TrustWalletTokenListJSONSchema = await
        tokenList.clone().json();

        const trustWalletToken = trustWalletTokenListJSON.tokens.find(
            (token) => token.address.toLowerCase() === contractAddress.toLowerCase(),
        );

        if (!trustWalletToken) {
            return null;
        }

        const tokenListJSON = await tokenList.json();

        const tokenInfo = await fetch(
            // eslint-disable-next-line max-len
            `${assetsTWURL}/${networkName}/assets/${trustWalletToken.address}/info.json`,
        );

        const tokkenInfoJson: TrustWalletTokenJSONSchema = await tokenInfo.json();

        const logoURL = `${assetsTWURL}/${networkName}/assets/${trustWalletToken.address}/logo.png`;

        return {
            name: tokkenInfoJson.name,
            decimals: tokkenInfoJson.decimals,
            symbol: tokkenInfoJson.symbol,
            contractAddress: trustWalletToken.address,
            metadata: {
                logoURL,
                websiteURL: tokkenInfoJson.website,
                tokenLists: [{
                    name: tokenListJSON.name,
                    url: tokenListJSON.url,
                    logoURL: tokenListJSON.logoURI,
                }],
            },
            homeNetwork: network,
        };
    } catch (error: any) {
        return null;
    }
}

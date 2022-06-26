import {
    ARBITRUM,
    OPTIMISM,
} from '../constants/networks';
import { AccountAssetsResponse } from './types';

const apiVerion = 'v1';
const quixoticDomainName = `https://api.quixotic.io/api/${apiVerion}`;
const stratosnftDomainName = `https://api.stratosnft.io/api/${apiVerion}`;

export const fetchAccountNFTAssets = async (
    chainId: number, // Optimism and Arbitrum
    walletAddress: string,
    apiKey: string,
): Promise<AccountAssetsResponse | null> => {
    try {
        let nftMarketplace = null;

        if (chainId === OPTIMISM.chainID) {
            nftMarketplace = quixoticDomainName;
        } else if (chainId === ARBITRUM.chainID) {
            nftMarketplace = stratosnftDomainName;
        }

        if (nftMarketplace) {
            const response = await fetch(
                `${nftMarketplace}/account/${walletAddress}/assets/`, {
                    method: 'GET',
                    headers: {
                        Accept: 'application/json',
                        'X-API-KEY': apiKey,
                    },
                },
            );
            const jsonResponse = await response.json();

            return jsonResponse;
        }
    } catch (error) {
        return null;
    }

    return null;
};


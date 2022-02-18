/* eslint-disable max-len */
import axios from 'axios';

import { HexString } from '../accounts';
import { getEthereumNetwork } from '../helpers';
import {
    ZapperResponse,
    ZapperAccountAddress,
} from './types';

const ZAPPER_PUBLIC_API_KEY = '96e0cc51-a62e-42ca-acee-910ea7d2a241';
const ZAPPER_PUBLIC_API_URL = 'https://api.zapper.fi/v1/';

const inst = axios.create({
    baseURL: ZAPPER_PUBLIC_API_URL,
    timeout: 5000,
});

/**
 * Get balances for a given address and network using zapper public API
 * @param address
 * @param network
 * @returns {Promise<{ contractAddress: string; amount: number }[]>} TokenBalance for the given addresse
 */
export async function getBalances(accountAddress: HexString, chainId: number): Promise<{ contractAddress: string; amount: number }[]> {
    const zapperEvmNetworkName = getEthereumNetwork(chainId).name.toLowerCase();
    const response: ZapperResponse<ZapperAccountAddress> = await inst.get(
        `protocols/tokens/balances?addresses[]=${accountAddress}&network=${zapperEvmNetworkName}&api_key=${ZAPPER_PUBLIC_API_KEY}`,
    );

    // for now, we will only accept one address to fetch at a time
    const zapperAccountAddress = response.data[accountAddress.toLowerCase()];

    if (zapperAccountAddress) {
        if (Object.keys(zapperAccountAddress.products).length) {
            const { assets } = zapperAccountAddress.products[0];

            // map each contract asset with its balance to return an array of object with the following structure:
            // { contractAddress: string, amount: number }
            return assets.map(({ address, balance }) => ({
                contractAddress: address,
                amount: balance,
            }));
        }
    }

    return [];
}

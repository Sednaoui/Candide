import { utils } from 'ethers';

import { HexString } from './accounts';
import {
    MAINNET,
    evmNetworks,
} from './constants/networks';
import { EVMNetwork } from './networks';

/**
 * trancats an address to 8 bytes, and pads the rest with four dots
 */
export const trancatAddress = (address: string): string => (
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
);

/**
 * removes https:// and www and trailing slash from a url string
 * @param url url string
 * @returns url string without https:// and www and trailing slash
 */
export const removeHttp = (url: string): string => (
    url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/\/$/, '')
);

/**
 * Determine which Ethereum network should be used based user input
 */
export function getEthereumNetwork(chainId: number | string): EVMNetwork {
    // find the network based on the chainId in evmNetworks object, default to mainnet
    const network = evmNetworks.find(
        (n: EVMNetwork) => n.chainID === Number(chainId),
    );

    return network || MAINNET;
}

/**
 * A fixed point number carrying an amount and the number of decimals it
 * represents.
 *
 * For example, the number 100,893.000107 tracked with a precision of 6
 * decimals is represented by the FixedPointNumber object:
 * ```
 * {
 *   amount: 100893000107n,
 *   decimals: 5
 * }
 * ```
 *
 * Convenience functions exist in this file to convert regular JavaScript
 * floating point Number to and from FixedPointNumber, as well as to multiply
 * FixedPointNumber and floats.
 */
export type FixedPointNumber = {
    amount: bigint
    decimals: number
}

/**
 * Convert a fixed point bigint with precision `fixedPointDecimals` to a
 * floating point number truncated to `desiredDecimals`. Note that precision
 * is not guaranteed, as it is possible that the fixed point number cannot be
 * accurately converted to or represented as a floating point number. If the
 * desired precision is higher than that tracked in the fixed point number, the
 * fixed point precision is used.
 *
 * This function is best used as the last step after any computations are done.
 */
export function fromFixedPoint(
    fixedPoint: bigint,
    fixedPointDecimals: number,
    desiredDecimals: number,
): number {
    const fixedPointDesiredDecimalsAmount = fixedPoint
        / 10n ** BigInt(Math.max(1, fixedPointDecimals - desiredDecimals));

    return (
        Number(fixedPointDesiredDecimalsAmount)
        / 10 ** Math.min(desiredDecimals, fixedPointDecimals)
    );
}

/**
 * Convert GWEI to WEI
 * @param gwei
 * @returns WEI
 */
export function gweiToWei(value: number | bigint): bigint {
    return BigInt(utils.parseUnits(value.toString(), 'gwei').toString());
}

/**
 * Get transaction method from transaction data
 * @param method
 * @returns method text
 */
export async function getMethodFromTransactionData(method: HexString): Promise<string | Error> {
    // uses https://github.com/ethereum-lists
    // use https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${}
    try {
        const signature = method.substring(2, 10);
        const url = `https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${signature}`;

        const response = await fetch(url);

        if (!response.ok) {
            return 'Unknown Function';
        }

        return response.text();
    } catch (error: any) {
        return new Error(error);
    }
}

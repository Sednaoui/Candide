/* eslint-disable import/exports-last */
import axios from 'axios';

import { HexString } from '../accounts';
import { ContractMetaData } from './types';

const SOURCIFY_BASE_SERVER_URL = 'https://sourcify.dev/server/';
const instServer = axios.create({
    baseURL: SOURCIFY_BASE_SERVER_URL,
    timeout: 5000,
});

/**
 * Checks if a contract is verified by sourcify
 * @param chainId Chain ID of the network to check the contract
 * @param contractAddress Address of the contract to check
 * @returns {Promise<boolean>} True if the contract is verified, false otherwise
 */
export const isContractVerified = async (
    chainId: number,
    contractAddress: HexString,
): Promise<boolean> => {
    const id = chainId.toString();
    const url = `check-by-addresses?addresses=${contractAddress}&chainIds=${id}`;
    const response = await instServer.get(url);

    return response.data[0].status === 'perfect';
};

const SOURCIFY_BASE_WEB_API = 'https://repo.sourcify.dev/';
const instWeb = axios.create({
    baseURL: SOURCIFY_BASE_WEB_API,
    timeout: 5000,
});

/**
 * Returns Metadata for a smart contract if it is verified on sourcify.
 * Returns only full_match
 * https://repo.sourcify.dev/contracts/:match/:chainId/:contractAddress
 * @param chainId Chain ID of the network to check the contract
 * @param contractAddress Contract Address
 * @returns metadata of the contract if it is verified, null otherwise
 */
export const getContractMetadata = async (
    chainId: number,
    contractAddress: HexString,
): Promise<ContractMetaData | null | Error> => {
    try {
        const verified = await isContractVerified(chainId, contractAddress);

        if (verified) {
            const id = chainId.toString();
            const url = `contracts/full_match/${id}/${contractAddress}/metadata.json`;
            const response = await instWeb.get(url);

            return response.data;
        } else {
            return null;
        }
    } catch (error: any) {
        return new Error(error);
    }
};

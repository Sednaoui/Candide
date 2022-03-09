import {
    AlchemyProvider,
    BaseProvider,
    TransactionResponse,
} from '@ethersproject/providers';
import {
    Wallet,
    utils,
    Contract,
} from 'ethers';

import ERC20ABI from '../../lib/abi/erc20.json';
import { HexString } from '../../lib/accounts';
import { getAssetTransfers } from '../../lib/alchemy';
import { AnyAssetTransfer } from '../../lib/assets';
import {
    sendTransaction,
    signPersonalMessage,
    signTransaction,
} from '../../lib/ethers';
import { fromFixedPoint } from '../../lib/helpers';
import {
    approveCallRequest,
    rejectCallRequest,
} from '../../lib/walletconnect';
import {
    RequestTransactionPayload,
    IConnector,
} from '../../lib/walletconnect/types';

/**
 * Tranfer ETH from one account to another.
 * @param provider an Alchemy ethers provider
 * @param sendTokenAmout the amount of token to send
 * @param toAddress the address to send the token to
 * @param privateKey the private key of the account to send the token from
 * @returns the transaction response
 */
export const sendETH = async (
    provider: BaseProvider,
    sendTokenAmout: string,
    toAddress: string,
    privateKey: string,
): Promise<TransactionResponse | Error> => {
    // TODO: create internal provider on windows.crosscash
    const walletSigner = new Wallet(privateKey, provider);

    let response: Promise<TransactionResponse>;

    try {
        const currentGasPrice = await provider.getGasPrice();
        const gasPrice = utils.hexlify(currentGasPrice);
        const tx = {
            to: toAddress,
            value: utils.parseEther(sendTokenAmout),
            gasPrice,
            gasLimit: 21000,
        };

        response = walletSigner.sendTransaction(tx);
        return await response;
    } catch (error: any) {
        return new Error(error);
    }
};

export const signEthereumRequests = async ({
    connector,
    provider,
    transactionRequest,
    privateKey,
    fromAddress,
}: {
    connector: IConnector,
    provider: BaseProvider,
    transactionRequest: RequestTransactionPayload,
    fromAddress: HexString,
    privateKey: string,
}): Promise<void> => {
    let transaction;
    let dataToSign;
    let address;
    let result;
    let errorMsg;

    const { id } = transactionRequest;

    switch (transactionRequest.method) {
        case 'eth_sendTransaction':
            [transaction] = transactionRequest.params;

            result = await sendTransaction({
                provider,
                fromAddress,
                transaction,
                privateKey,
            });
            break;
        case 'eth_signTransaction':
            [transaction] = transactionRequest.params;
            result = await signTransaction({
                provider,
                fromAddress,
                transaction,
                privateKey,
            });
            break;
        case 'personal_sign':
        case 'eth_sign':
            [dataToSign, address] = transactionRequest.params;
            if (fromAddress.toLowerCase() === address.toLowerCase()) {
                result = await signPersonalMessage({
                    message: dataToSign,
                    privateKey,
                });
            } else {
                errorMsg = 'Address requested does not match active account';
            }
            break;
        default:
            break;
    }
    if (typeof result === 'string') {
        approveCallRequest({ connector, id, result });
    } else {
        let message = 'JSON RPC method not supported';

        if (errorMsg) {
            message = errorMsg;
        } else if (result instanceof Error) {
            message = result.message;
        }
        rejectCallRequest({ connector, id, message });
        throw new Error(message);
    }
};
export const sendTx = async (
    provider: BaseProvider,
    data: string,
    value: string,
    toAddress: string,
    gas: string,
    privateKey: string,
): Promise<TransactionResponse | string> => {
    // TODO: create internal provider on windows.crosscash
    const walletSigner = new Wallet(privateKey, provider);

    let response: Promise<TransactionResponse>;

    try {
        // const currentGasPrice = await provider.getGasPrice();
        // const gasPrice = utils.hexlify(currentGasPrice);

        const tx = {
            to: toAddress,
            value,
            gasPrice: gas,
            gasLimit: 65000,
            data,
        };

        console.log('tx before sending: ', tx);

        response = walletSigner.sendTransaction(tx);
        return await response;
    } catch (error) {
        return JSON.stringify(error);
    }
};

/**
 * Send erc20 tokens to a given address.
 * @param provider an Alchemy ethers provider
 * @param sendTokenAmout the amount of tokens to send
 * @param toAddress the address to send the tokens to
 * @param privateKey the private key of the account to send the tokens from
 * @param tokenAddress the address of the token contract
* */
export const sendERC20 = async (
    provider: AlchemyProvider,
    sendTokenAmout: string,
    toAddress: string,
    privateKey: string,
    contractAddress: string,
): Promise<TransactionResponse | Error> => {
    const walletSigner = new Wallet(privateKey, provider);
    const amountFormated = utils.parseUnits(sendTokenAmout, 18);

    try {
        const tokenContract = new Contract(
            contractAddress,
            ERC20ABI,
            walletSigner,
        );

        return tokenContract.transfer(toAddress, amountFormated);
    } catch (error: any) {
        return new Error(error);
    }
};

/**
 * Transfer Tokens from one address to another. Handles both ERC20 and ETH.
 * @param provider an Alchemy ethers provider
 * @param sendTokenAmout the amount of tokens to send
 * @param toAddress the address to send the tokens to
 * @param privateKey the private key of the account to send the tokens from
 * @param contractAddress the address of the token contract
 * @returns
 */
export const transferTokens = async (
    provider: AlchemyProvider,
    sendTokenAmout: string,
    toAddress: string,
    privateKey: string,
    contractAddress?: string,
): Promise<TransactionResponse | Error> => {
    if (contractAddress) {
        return sendERC20(provider, sendTokenAmout, toAddress, privateKey, contractAddress);
    } else {
        return sendETH(provider, sendTokenAmout, toAddress, privateKey);
    }
};

/**
 * Get Transation history of of asset tranfers of an account.
 * @param provider
 * @param address
 * @returns A list of asset transfers
 */
export const getTransactionHistory = async (
    provider: AlchemyProvider,
    address: HexString,
): Promise<AnyAssetTransfer[]> => {
    try {
        const transfers = await getAssetTransfers(provider, address, 0);

        return transfers.map((transfer) => {
            const { decimals } = transfer.assetAmount.asset;

            return {
                ...transfer,
                assetAmount: {
                    ...transfer.assetAmount,
                    amount: fromFixedPoint(transfer.assetAmount.amount, decimals, 4),
                },
            };
        });
    } catch (error: any) {
        if (error.code === 'SERVER_ERROR') {
            return getTransactionHistory(provider, address);
        }
        return [];
    }
};

export type TransactionDetail = {
    txHash: HexString,
    to: HexString,
    from: HexString,
    value: string,
    gas: number,
    gasPrice: number, // gwei
    blockNumber: number,
    date: string,
}

export type Transaction = {
    blockHash: HexString;
    blockNumber: HexString;
    chainId: HexString;
    from: HexString;
    gas: HexString;
    gasPrice: HexString;
    hash: HexString;
    input: HexString;
    nonce: HexString;
    r: HexString;
    s: HexString;
    to: HexString;
    transactionIndex: HexString;
    v: HexString;
    value: HexString;
}

export type Block = {
    difficulty: HexString;
    extraData: HexString;
    gasLimit: HexString;
    gasUsed: HexString;
    hash: HexString;
    logsBloom: HexString;
    miner: HexString;
    mixHash: HexString;
    nonce: HexString;
    number: HexString;
    parentHash: HexString;
    receiptsRoot: HexString;
    sha3Uncles: HexString;
    size: HexString;
    stateRoot: HexString;
    timestamp: HexString;
    totalDifficulty: HexString;
    transactionsRoot: HexString;
    uncles: HexString[];
    transactions: HexString[] | Transaction[];
}

export const getTransactionDetails = async (
    provider: AlchemyProvider,
    txHash: HexString,
): Promise<TransactionDetail> => {
    const tx: Transaction = await provider.send('eth_getTransactionByHash', [txHash]);

    const block: Block = await provider.send('eth_getBlockByNumber', [tx.blockNumber, false]);

    const date = new Date(Number(block.timestamp) * 1000).toLocaleString();

    // convert gas price to gwei
    const gasPrice = Number(tx.gasPrice) / 1000000000;

    return {
        txHash,
        to: tx.to,
        from: tx.from,
        value: tx.value,
        gas: Number(tx.gas),
        gasPrice,
        blockNumber: Number(tx.blockNumber),
        date,
    };
};

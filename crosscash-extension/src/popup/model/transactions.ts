import {
    AlchemyProvider,
    BaseProvider,
    TransactionResponse,
} from '@ethersproject/providers';
import {
    Wallet,
    utils,
} from 'ethers';

import { HexString } from '../../lib/accounts';
import { getAssetTransfers } from '../../lib/alchemy';
import { AnyAssetTransfer } from '../../lib/assets';
import { fromFixedPoint } from '../../lib/helpers';

export const sendETH = async (
    provider: BaseProvider,
    sendTokenAmout: string,
    toAddress: string,
    fromAddress: string,
    privateKey: string,
): Promise<TransactionResponse | string> => {
    // TODO: create internal provider on windows.crosscash
    const walletSigner = new Wallet(privateKey, provider);

    let response: Promise<TransactionResponse>;

    try {
        const currentGasPrice = await provider.getGasPrice();
        const gasPrice = utils.hexlify(currentGasPrice);
        const tx = {
            from: fromAddress,
            to: toAddress,
            value: utils.parseEther(sendTokenAmout),
            gasPrice,
            gasLimit: 21000,
        };

        response = walletSigner.sendTransaction(tx);
        return await response;
    } catch (error) {
        return JSON.stringify(error);
    }
};

export const getTransactionHistory = async (
    provider: AlchemyProvider,
    address: HexString,
): Promise<AnyAssetTransfer[]> => {
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
};

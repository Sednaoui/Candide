import {
    BaseProvider,
    TransactionResponse,
} from '@ethersproject/providers';
import {
    Wallet,
    utils,
} from 'ethers';

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

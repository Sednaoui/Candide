/* eslint-disable import/exports-last */
import {
    Wallet,
    utils,
} from 'ethers';

export const createWallet = async (
    mnemonic: null | EthereumMnemonic = null,
): Promise<null | EthereumWallet> => {
    if (mnemonic && utils.isValidMnemonic(mnemonic)) {
        return Wallet.fromMnemonic(mnemonic);
    }

    if (!mnemonic) {
        return Wallet.createRandom();
    }

    return null;
};

export type EthereumWallet = Wallet | null;
export type EthereumMnemonic = string;

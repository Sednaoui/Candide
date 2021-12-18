import CryptoJS from 'crypto-js';
import {
    Wallet,
    utils,
} from 'ethers';

export const createWallet = async (
    mnemonic: null | EthereumMnemonicPhrase = null,
): Promise<null | Wallet> => {
    if (mnemonic && utils.isValidMnemonic(mnemonic)) {
        return Wallet.fromMnemonic(mnemonic);
    }

    if (!mnemonic) {
        return Wallet.createRandom();
    }

    return null;
};

export const createEncryptedWallet = async (
    password: Password,
    mnemonic?: EthereumMnemonicPhrase,
): Promise<EthereumWallet | null> => {
    const wallet = await createWallet(mnemonic);

    if (wallet && password) {
        const { privateKey } = wallet;
        const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, password).toString();
        const encryptedMnemonicPhrase = CryptoJS.AES.encrypt(
            wallet.mnemonic.phrase,
            password,
        ).toString();

        return {
            ...wallet,
            privateKey: encryptedPrivateKey,
            mnemonic: {
                ...wallet.mnemonic,
                phrase: encryptedMnemonicPhrase,
            },
        };
    } else {
        return null;
    }
};

export const decryptWallet = async (
    password: Password,
    encryptedWallet: EthereumWallet,
): Promise<EthereumWallet | null> => {
    if (encryptedWallet) {
        const { privateKey, mnemonic } = encryptedWallet;

        const decryptedPrivateKey = CryptoJS.AES.decrypt(privateKey, password)
            .toString(CryptoJS.enc.Utf8);

        const decryptedMnemonicPhrase = CryptoJS.AES.decrypt(
            mnemonic.phrase,
            password,
        ).toString(CryptoJS.enc.Utf8);

        return {
            ...encryptedWallet,
            privateKey: decryptedPrivateKey,
            mnemonic: {
                ...encryptedWallet.mnemonic,
                phrase: decryptedMnemonicPhrase,
            },
        };
    } else {
        return null;
    }
};

export type Password = string;
export interface EthereumWallet {
    address: string;
    mnemonic: {
        locale: string;
        phrase: string;
        path: string;
    };
    privateKey: string;
    _isSigner: boolean;
}
export type EthereumMnemonicPhrase = string;


import CryptoJS from 'crypto-js';
import {
    Wallet,
    utils,
} from 'ethers';

import { HexString } from '../../lib/accounts';

/**
 * Create wallet from mnemonic or create random wallet.
 * @param mnemonic option mnemonic. If not provided, a new random wallet will be created.
 * @returns wallet
 */
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

/**
 * Create encrypted wallet from mnemonic and password.
 * @param password
 * @param mnemonic
 * @returns encrypted wallet
 */
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
/**
 * Decrypt encrypted wallet using password
 * @param password
 * @param encryptedWallet
 * @returns decrypted wallet
 */

// TODO throw error instead of returning string
export const decryptWallet = async (
    password: Password,
    encryptedWallet: EthereumWallet,
): Promise<EthereumWallet | Error> => {
    if (encryptedWallet) {
        const { privateKey, mnemonic } = encryptedWallet;

        try {
            const decryptedPrivateKey = CryptoJS.AES.decrypt(privateKey, password)
                .toString(CryptoJS.enc.Utf8);

            const decryptedMnemonicPhrase = CryptoJS.AES.decrypt(
                mnemonic.phrase,
                password,
            ).toString(CryptoJS.enc.Utf8);

            if (!decryptedPrivateKey && !decryptedMnemonicPhrase) {
                return new Error(
                    // eslint-disable-next-line max-len
                    'Incorrect password. Remember that this is the password you have set on this device to create your wallet for Candide',
                );
            }

            return {
                ...encryptedWallet,
                privateKey: decryptedPrivateKey,
                mnemonic: {
                    ...encryptedWallet.mnemonic,
                    phrase: decryptedMnemonicPhrase,
                },
            };
        } catch (error: any) {
            return new Error(error);
        }
    } else {
        return new Error('no wallet to decrypt');
    }
};

export type Password = string;
export interface EthereumWallet {
    address: HexString;
    mnemonic: {
        locale: string;
        phrase: string;
        path: string;
    };
    privateKey: string;
    _isSigner: boolean;
}
export type EthereumMnemonicPhrase = string;


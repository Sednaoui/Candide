import {
    EthereumMnemonicPhrase,
    Password,
} from '../../model/wallet';

export interface EncryptedWallet {
    password: Password,
    mnemonic: EthereumMnemonicPhrase,
}

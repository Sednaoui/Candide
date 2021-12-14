import { EthereumMnemonic } from '../../model/wallet';

export type CreateWalletAction = {
    payload: EthereumMnemonic;
    type: string;
}

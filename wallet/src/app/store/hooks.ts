import { useAppSelector } from '.';

export const useWalletProvider = () => useAppSelector((state) => state.wallet.walletProvider);

export const useDappProvider = () => useAppSelector((state) => state.wallet.dappProvider);

export const useTransactionHash = () => useAppSelector((state) => state.wallet.transactionHash);

export const useWalletError = () => useAppSelector((state) => state.wallet.error);

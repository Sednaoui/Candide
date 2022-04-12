import { useAppSelector } from '.';

export const useWalletProvider = () => useAppSelector((state) => state.wallet.walletProvider);

export const useDappProvider = () => useAppSelector((state) => state.wallet.dappProvider);

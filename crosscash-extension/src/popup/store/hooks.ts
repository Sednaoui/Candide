import { useAppSelector } from '.';

export const useWalletProvider = () => useAppSelector((state) => state.wallet.walletProvider);

import { AxiosResponse } from 'axios';

import { HexString } from '../accounts';

type ZapperTokenMeta = {
    label: 'Total' | 'Assets' | 'Debt';
    type: string;
    value: string;
}

type AddressBalance = {
    meta: ZapperTokenMeta[];
    products: Products[];
}

type Products = {
    assets: ZapperAsset[];
    label: string;
    meta: unknown[];
}

type ZapperAsset = {
    address: HexString,
    balance: number,
    balanceRaw: string,
    balanceUSD: number,
    decimals: number,
    hide: boolean,
    network: string,
    price: number,
    symbol: string,
    type: string,
};

export type ZapperAccountAddress = {
    [key: HexString]: AddressBalance;
}

export type ZapperResponse<T> = AxiosResponse<T>;

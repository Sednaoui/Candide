type TrustWalletLink = {
    name: string;
    url: string;
};

type TrustWalletVersions = {
    major: number;
    minor: number;
    patch: number;
};

type TrustWalletToken = {
    asset: string;
    type: string; // example: ERC-20, ERC-721, ERC-1155
    address: string; // contract address
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
    pairs: TrustWalletTokenPairs[]
};

type TrustWalletTokenPairs = {
    base: string;
};

export type TrustWalletTokenJSONSchema = {
    name: string;
    symbol: string;
    type: string;
    decimals: number;
    description: string;
    website: string;
    explorer: string;
    status: string;
    id: string;
    links?: TrustWalletLink[]
};

export type TrustWalletTokenListJSONSchema = {
    name: string;
    logoURI: string;
    timestamp: string;
    tokens: TrustWalletToken[];
    version: TrustWalletVersions;
};
